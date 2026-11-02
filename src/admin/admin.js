const $ = (id) => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemen admin "${id}" tidak ditemukan.`);
  return element;
};

const form = $("product-form");
const products = [];
let images = [];
let categories = [];
let currentSlug = null;
let isNew = false;
let slugWasEdited = false;
let selectedImages = [];
let primaryImage = "";
let featureItems = [];
let specificationGroups = [];

const allowedRichTags = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "EM", "H2", "H3", "H4", "HR", "I", "LI",
  "OL", "P", "STRONG", "U", "UL",
]);
const discardedRichTags = new Set(["IFRAME", "MATH", "OBJECT", "SCRIPT", "STYLE", "SVG", "TEMPLATE"]);

function showNotice(message, isError = false) {
  const notice = $("notice");
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.style.display = "block";
  notice.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function api(path, options = {}) {
  const response = await fetch(`/__local-admin/api/${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `Permintaan gagal (${response.status}).`);
  return result;
}

function safeRichHtml(markup) {
  const parsed = new DOMParser().parseFromString(`<div>${markup}</div>`, "text/html");
  const root = parsed.body.firstElementChild;
  if (!root) return "";
  const clean = (parent) => {
    for (const child of [...parent.childNodes]) {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        continue;
      }
      if (!(child instanceof Element)) continue;
      if (discardedRichTags.has(child.tagName)) {
        child.remove();
        continue;
      }
      clean(child);
      if (!allowedRichTags.has(child.tagName)) {
        child.replaceWith(...child.childNodes);
        continue;
      }
      const href = child.tagName === "A" ? child.getAttribute("href") : null;
      for (const attribute of [...child.attributes]) child.removeAttribute(attribute.name);
      if (
        href &&
        ((href.startsWith("/") && !href.startsWith("//")) ||
          href.startsWith("#") ||
          /^https?:\/\//i.test(href) ||
          /^mailto:/i.test(href))
      ) {
        child.setAttribute("href", href);
      }
    }
  };
  clean(root);
  return root.innerHTML;
}

function textToHtml(value) {
  const paragraph = document.createElement("p");
  paragraph.textContent = value;
  return paragraph.outerHTML;
}

function plainTextToHtml(value) {
  const paragraphs = value.trim().split(/\n\s*\n/).filter(Boolean);
  return paragraphs.map((text) => {
    const paragraph = document.createElement("p");
    text.split("\n").forEach((line, index) => {
      if (index) paragraph.append(document.createElement("br"));
      paragraph.append(document.createTextNode(line));
    });
    return paragraph.outerHTML;
  }).join("");
}

function buildAiPrompt() {
  const brief = $("ai-brief").value.trim() || $("name").value.trim() || "produk yang ingin dicari";
  const context = $("category").value.trim();
  return [
    `Carikan saya produk: ${brief}${context ? ` (kategori: ${context})` : ""}.`,
    "Buat konten halaman produk dalam bahasa Indonesia. Gunakan informasi yang dapat dipastikan; jangan mengarang spesifikasi. Jika data tidak tersedia, tulis 'Belum tersedia'.",
    "Keluarkan hanya format berikut, tanpa pembuka atau markdown:",
    "",
    "[Nama Produk]",
    "Nama produk yang jelas",
    "",
    "[Judul]",
    "Judul halaman produk",
    "",
    "[Ringkasan]",
    "Ringkasan singkat untuk katalog",
    "",
    "[Deskripsi]",
    "Deskripsi detail produk, boleh beberapa paragraf",
    "",
    "[Judul SEO]",
    "Judul SEO",
    "",
    "[Deskripsi SEO]",
    "Deskripsi meta untuk mesin pencari",
    "",
    "[Kata Kunci SEO]",
    "kata kunci 1, kata kunci 2",
    "",
    "[Tag]",
    "tag 1, tag 2",
    "",
    "[Fitur]",
    "Judul: nama fitur",
    "Deskripsi: penjelasan fitur",
    "",
    "Judul: nama fitur berikutnya",
    "Deskripsi: penjelasan fitur berikutnya",
    "",
    "[Spesifikasi]",
    "Kelompok: nama kelompok",
    "Label | Nilai",
    "Label | Nilai",
  ].join("\n");
}

function parseAiSections(value) {
  const sections = new Map();
  const headers = [...value.matchAll(/^\s*\[([^\]]+)\]\s*$/gm)];
  headers.forEach((header, index) => {
    const start = header.index + header[0].length;
    const end = headers[index + 1]?.index ?? value.length;
    sections.set(header[1].trim().toLowerCase(), value.slice(start, end).trim());
  });
  return sections;
}

function parseAiFeatures(value) {
  return value.split(/\n\s*\n/)
    .map((block) => {
      const lines = block.trim().split("\n");
      const title = lines[0]?.match(/^\s*(?:[-*]\s*)?Judul\s*:\s*(.*)$/i)?.[1]?.trim() ?? "";
      const descriptionIndex = lines.findIndex((line) => /^\s*Deskripsi\s*:/i.test(line));
      const description = descriptionIndex < 0
        ? ""
        : [
            lines[descriptionIndex].replace(/^\s*Deskripsi\s*:\s*/i, ""),
            ...lines.slice(descriptionIndex + 1),
          ].join("\n").trim();
      return { title, description };
    })
    .filter((feature) => feature.title && feature.description);
}

function parseAiSpecifications(value) {
  const groups = [];
  let group = null;
  value.split("\n").forEach((line) => {
    const groupMatch = line.match(/^\s*(?:[-*]\s*)?Kelompok\s*:\s*(.+)$/i);
    if (groupMatch) {
      group = { title: groupMatch[1].trim(), rows: [] };
      groups.push(group);
      return;
    }
    const separator = line.indexOf("|");
    if (separator < 0) return;
    if (!group) {
      group = { title: "Spesifikasi Umum", rows: [] };
      groups.push(group);
    }
    const label = line.slice(0, separator).replace(/^\s*[-*]\s*/, "").trim();
    const rowValue = line.slice(separator + 1).trim();
    if (label && rowValue) group.rows.push({ label, value: rowValue });
  });
  return groups.filter((item) => item.title && item.rows.length);
}

function richValue(value) {
  return /<[a-z][\s\S]*>/i.test(value) ? safeRichHtml(value) : textToHtml(value);
}

function currentRichHtml() {
  return safeRichHtml($("product-preview-description").innerHTML);
}

function setInlineText(id, value) {
  const element = $(id);
  if (document.activeElement !== element) element.textContent = value;
}

function renderPreview() {
  const name = $("name").value.trim() || "Nama produk";
  const heading = $("heading").value.trim() || name;
  const summary = $("description").value.trim();
  const seoTitle = $("title").value.trim() || "Judul SEO produk";
  const seoDescription = $("seoDescription").value.trim() || "Deskripsi SEO produk akan tampil di sini.";
  const slug = $("slug").value.trim().replace(/^\/+/, "");
  const richDescription = currentRichHtml();

  if (document.activeElement !== $("product-preview-description")) {
    $("product-preview-description").innerHTML = richDescription;
  }
  setInlineText("product-preview-name", name);
  setInlineText("product-preview-heading", heading);
  setInlineText("product-preview-summary", summary);
  $("product-preview-breadcrumb").textContent = name;
  $("seo-preview-url").textContent = `rassurvey.com/${slug || "produk/katalog/produk"}`;
  $("seo-preview-title").textContent = seoTitle;
  $("seo-preview-description").textContent = seoDescription;
  $("seo-title-count").textContent = `${$("title").value.length}/200`;
  $("seo-description-count").textContent = `${$("seoDescription").value.length}/500`;
  $("seo-preview-title").title = `${seoTitle.length}/200 karakter`;
  $("seo-preview-description").title = `${seoDescription.length}/500 karakter`;
  const image = $("product-preview-image");
  if (primaryImage) {
    image.src = primaryImage;
    image.alt = heading;
    image.hidden = false;
    $("preview-image-placeholder").hidden = true;
    $("preview-image-change").hidden = false;
  } else {
    image.removeAttribute("src");
    image.hidden = true;
    $("preview-image-placeholder").hidden = false;
    $("preview-image-change").hidden = true;
  }
  const gallery = $("product-preview-gallery");
  gallery.replaceChildren();
  selectedImages.forEach((imagePath) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preview-thumbnail";
    button.classList.toggle("selected", imagePath === primaryImage);
    button.setAttribute("aria-label", `Jadikan ${imagePath} gambar utama`);
    button.setAttribute("aria-pressed", String(imagePath === primaryImage));
    button.dataset.previewImage = imagePath;
    const thumbnail = document.createElement("img");
    thumbnail.src = imagePath;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    button.append(thumbnail);
    gallery.append(button);
  });
  const tagList = $("product-preview-tags");
  if (document.activeElement !== tagList) {
    tagList.replaceChildren();
    $("tags").value.split(",").map((tag) => tag.trim()).filter(Boolean).forEach((tag) => {
      const pill = document.createElement("span");
      pill.textContent = tag;
      tagList.append(pill);
    });
    if (!$("tags").value.trim()) {
      const empty = document.createElement("span");
      empty.className = "preview-tag-placeholder";
      empty.textContent = "Klik untuk menambah tag";
      tagList.append(empty);
    }
  }
  const featureList = $("product-preview-features");
  featureList.replaceChildren();
  featureItems.forEach((feature, index) => {
    const item = document.createElement("div");
    item.className = "preview-feature";
    const title = document.createElement("strong");
    title.contentEditable = "true";
    title.setAttribute("role", "textbox");
    title.setAttribute("aria-label", `Judul fitur ${index + 1}`);
    title.dataset.previewFeatureTitle = String(index);
    title.dataset.placeholder = "Judul fitur";
    title.textContent = feature.title;
    const description = document.createElement("div");
    description.contentEditable = "true";
    description.setAttribute("role", "textbox");
    description.setAttribute("aria-label", `Deskripsi fitur ${index + 1}`);
    description.dataset.previewFeatureDescription = String(index);
    description.dataset.placeholder = "Deskripsi singkat";
    description.textContent = feature.description;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "preview-edit-button preview-remove-button";
    remove.textContent = "Hapus";
    remove.setAttribute("aria-label", `Hapus fitur ${index + 1}`);
    remove.dataset.removeFeature = String(index);
    item.append(title, description, remove);
    featureList.append(item);
  });
  const specificationList = $("product-preview-specifications");
  specificationList.replaceChildren();
  specificationGroups.forEach((group, groupIndex) => {
    const section = document.createElement("section");
    section.className = "preview-spec-group";
    const title = document.createElement("h3");
    title.contentEditable = "true";
    title.setAttribute("role", "textbox");
    title.setAttribute("aria-label", `Judul kelompok spesifikasi ${groupIndex + 1}`);
    title.dataset.previewSpecGroupTitle = String(groupIndex);
    title.dataset.placeholder = "Judul kelompok";
    title.textContent = group.title;
    section.append(title);
    group.rows.forEach((row, rowIndex) => {
      const line = document.createElement("div");
      line.className = "preview-spec-row";
      const label = document.createElement("span");
      label.contentEditable = "true";
      label.setAttribute("role", "textbox");
      label.setAttribute("aria-label", `Label spesifikasi ${groupIndex + 1}.${rowIndex + 1}`);
      label.dataset.previewSpecLabel = `${groupIndex}:${rowIndex}`;
      label.dataset.placeholder = "Label";
      label.textContent = row.label;
      const value = document.createElement("span");
      value.contentEditable = "true";
      value.setAttribute("role", "textbox");
      value.setAttribute("aria-label", `Nilai spesifikasi ${groupIndex + 1}.${rowIndex + 1}`);
      value.dataset.previewSpecValue = `${groupIndex}:${rowIndex}`;
      value.dataset.placeholder = "Nilai";
      value.textContent = row.value;
      const removeRow = document.createElement("button");
      removeRow.type = "button";
      removeRow.className = "preview-edit-button preview-remove-button";
      removeRow.textContent = "×";
      removeRow.setAttribute("aria-label", `Hapus spesifikasi ${groupIndex + 1}.${rowIndex + 1}`);
      removeRow.dataset.removeSpecRow = `${groupIndex}:${rowIndex}`;
      line.append(label, value, removeRow);
      section.append(line);
    });
    const actions = document.createElement("div");
    actions.className = "preview-spec-actions";
    const addRow = document.createElement("button");
    addRow.type = "button";
    addRow.className = "preview-edit-button";
    addRow.textContent = "＋ Baris";
    addRow.dataset.addSpecRow = String(groupIndex);
    const removeGroup = document.createElement("button");
    removeGroup.type = "button";
    removeGroup.className = "preview-edit-button preview-remove-button";
    removeGroup.textContent = "Hapus kelompok";
    removeGroup.dataset.removeSpecGroup = String(groupIndex);
    actions.append(addRow, removeGroup);
    section.append(actions);
    specificationList.append(section);
  });
}

function slugPart(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function suggestedSlug() {
  return `/produk/katalog/${slugPart($("category").value) || "kategori"}/${slugPart($("name").value) || "produk"}`;
}

function renderCategories() {
  const options = $("category-options");
  options.replaceChildren();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    options.append(option);
  });
}

function fillForm(product) {
  for (const field of [
    "name",
    "category",
    "slug",
    "heading",
    "title",
    "description",
    "seoDescription",
  ]) {
    $(field).value = product[field] ?? "";
  }
  $("productDescription").value = product.productDescription ?? product.description ?? "";
  $("product-preview-description").innerHTML = richValue(
    product.productDescription ?? product.description ?? "",
  );
  $("seoKeywords").value = (product.seoKeywords ?? []).join(", ");
  $("tags").value = (product.tags ?? []).join(", ");
  featureItems = structuredClone(product.features ?? []);
  specificationGroups = structuredClone(product.specifications ?? []);
  selectedImages = [...new Set(product.gallery?.length ? product.gallery : [product.image])];
  primaryImage = product.image || selectedImages[0] || "";
  $("editor-title").textContent = "Edit produk";
  $("edit-mode").textContent = product.slug;
  $("delete-product").hidden = false;
  $("save-product").textContent = "Simpan Perubahan";
  renderImages();
  renderPreview();
}

function selectProduct(product) {
  currentSlug = product.slug;
  isNew = false;
  slugWasEdited = true;
  fillForm(product);
}

function startNewProduct() {
  currentSlug = null;
  isNew = true;
  slugWasEdited = false;
  selectedImages = [];
  primaryImage = "";
  form.reset();
  $("product-preview-description").innerHTML = "";
  $("product-preview-name").textContent = "";
  $("product-preview-heading").textContent = "";
  $("product-preview-summary").textContent = "";
  $("slug").value = suggestedSlug();
  $("editor-title").textContent = "Tambah produk";
  $("edit-mode").textContent = "Produk baru";
  $("delete-product").hidden = true;
  $("save-product").textContent = "Tambah Produk";
  featureItems = [];
  specificationGroups = [];
  renderImages();
  renderPreview();
  $("product-preview-name").focus();
}

function renderFolderOptions() {
  const folders = [...new Set(images.map((image) => image.split("/").slice(0, -1).join("/")))]
    .sort((a, b) => a.localeCompare(b));
  const select = $("image-folder");
  const selectedFolder = select.value;
  select.replaceChildren(new Option("Semua folder", ""));
  folders.forEach((folder) => select.add(new Option(folder, folder)));
  if (folders.includes(selectedFolder)) select.value = selectedFolder;
}

function renderImages() {
  const query = $("image-search").value.trim().toLowerCase();
  const folder = $("image-folder").value;
  const matches = images.filter((image) =>
    (!folder || image.split("/").slice(0, -1).join("/") === folder) &&
    (!query || image.toLowerCase().includes(query)),
  );
  const shown = matches.slice(0, 120);
  const list = $("image-list");
  list.replaceChildren();
  if (!shown.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Gambar tidak ditemukan di folder public.";
    list.append(empty);
  }
  shown.forEach((image) => {
    const label = document.createElement("label");
    label.className = "image-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedImages.includes(image);
    checkbox.setAttribute("aria-label", `Pilih ${image} untuk galeri`);
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "primary-image";
    radio.checked = primaryImage === image;
    radio.setAttribute("aria-label", `Jadikan ${image} gambar utama`);
    const preview = document.createElement("img");
    preview.src = image;
    preview.alt = "";
    preview.loading = "lazy";
    const path = document.createElement("span");
    path.textContent = image;
    label.append(checkbox, radio, preview, path);
    checkbox.addEventListener("change", () => {
      selectedImages = checkbox.checked
        ? [...new Set([...selectedImages, image])]
        : selectedImages.filter((selected) => selected !== image);
      if (!selectedImages.includes(primaryImage)) primaryImage = selectedImages[0] ?? "";
      renderImages();
      renderPreview();
    });
    radio.addEventListener("change", () => {
      primaryImage = image;
      if (!selectedImages.includes(image)) selectedImages.push(image);
      renderImages();
      renderPreview();
    });
    list.append(label);
  });
  $("selected-images").textContent =
    `${selectedImages.length} gambar dipilih` +
    (primaryImage ? ` · utama: ${primaryImage}` : "") +
    (matches.length > shown.length ? ` · menampilkan ${shown.length} dari ${matches.length}, persempit pencarian untuk lainnya` : "");
}

function formProduct() {
  const data = new FormData(form);
  const description = String(data.get("description") ?? "").trim();
  const name = String(data.get("name") ?? "").trim();
  for (const [value, label] of [
    [name, "Nama produk"],
    [String(data.get("category") ?? "").trim(), "Kategori"],
    [String(data.get("slug") ?? "").trim(), "URL produk"],
    [description, "Ringkasan katalog"],
    [String(data.get("title") ?? "").trim(), "Judul SEO"],
    [String(data.get("seoDescription") ?? "").trim(), "Deskripsi SEO"],
  ]) {
    if (!value) throw new Error(`${label} wajib diisi.`);
  }
  const productDescription = currentRichHtml();
  $("productDescription").value = productDescription;
  return {
    slug: String(data.get("slug") ?? "").trim(),
    category: String(data.get("category") ?? "").trim(),
    name,
    heading: String(data.get("heading") ?? "").trim() || name,
    description,
    productDescription: productDescription || textToHtml(description),
    image: primaryImage,
    gallery: selectedImages,
    title: String(data.get("title") ?? "").trim(),
    seoDescription: String(data.get("seoDescription") ?? "").trim(),
    seoKeywords: String(data.get("seoKeywords") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    tags: String(data.get("tags") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    features: featureItems.filter((feature) => feature.title.trim() && feature.description.trim()),
    specifications: specificationGroups
      .map((group) => ({
        title: group.title.trim(),
        rows: group.rows.filter((row) => row.value.trim()),
      }))
      .filter((group) => group.title && group.rows.length),
  };
}

async function loadData() {
  const [catalog, allImages] = await Promise.all([
    api("products"),
    api("images"),
  ]);
  products.splice(0, products.length, ...catalog.products);
  categories = catalog.categories;
  images = allImages;
  renderCategories();
  renderFolderOptions();
  renderImages();
}

function applyAiResponse() {
  const sections = parseAiSections($("ai-response").value);
  const keys = [
    "nama produk",
    "judul",
    "ringkasan",
    "deskripsi",
    "judul seo",
    "deskripsi seo",
    "kata kunci seo",
    "tag",
    "fitur",
    "spesifikasi",
  ];
  if (!keys.some((key) => sections.has(key))) {
    $("ai-status").textContent = "Format belum dikenali. Gunakan bagian seperti [Judul] dan [Deskripsi].";
    return;
  }

  const value = (...names) => names.map((name) => sections.get(name)).find((item) => item !== undefined);
  const name = value("nama produk");
  const heading = value("judul");
  const summary = value("ringkasan");
  const description = value("deskripsi");
  const title = value("judul seo");
  const seoDescription = value("deskripsi seo");
  const seoKeywords = value("kata kunci seo");
  const tags = value("tag", "tags");

  if (name) {
    $("name").value = name;
    if (isNew && !slugWasEdited) $("slug").value = suggestedSlug();
  }
  if (heading) $("heading").value = heading;
  if (summary) $("description").value = summary;
  if (description) {
    $("product-preview-description").innerHTML = safeRichHtml(plainTextToHtml(description));
    $("productDescription").value = currentRichHtml();
  }
  if (title) $("title").value = title;
  if (seoDescription) $("seoDescription").value = seoDescription;
  if (seoKeywords) $("seoKeywords").value = seoKeywords.split(/[,\n]/).map((item) => item.trim()).filter(Boolean).join(", ");
  if (tags) $("tags").value = tags.split(/[,\n]/).map((item) => item.trim()).filter(Boolean).join(", ");
  if (sections.has("fitur")) featureItems = parseAiFeatures(sections.get("fitur"));
  if (sections.has("spesifikasi")) specificationGroups = parseAiSpecifications(sections.get("spesifikasi"));

  renderPreview();
  $("ai-status").textContent = "Hasil AI sudah diterapkan ke editor. Tinjau kembali sebelum menyimpan.";
  $("ai-dialog").close();
  showNotice("Hasil AI diterapkan ke editor. Tinjau kembali sebelum menyimpan.");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const saveButton = $("save-product");
  saveButton.disabled = true;
  try {
    const product = formProduct();
    if (!product.image || !product.gallery.length) {
      throw new Error("Pilih setidaknya satu gambar dan tentukan gambar utama.");
    }
    const wasNew = isNew;
    const result = await api("products", {
      method: isNew ? "POST" : "PUT",
      body: JSON.stringify(isNew ? product : { originalSlug: currentSlug, product }),
    });
    await loadData();
    selectProduct(result.product);
    history.replaceState(null, "", `/admin/edit?slug=${encodeURIComponent(result.product.slug)}`);
    showNotice(wasNew ? "Produk baru berhasil ditambahkan." : "Perubahan produk berhasil disimpan.");
    isNew = false;
    currentSlug = result.product.slug;
  } catch (error) {
    showNotice(error instanceof Error ? error.message : "Gagal menyimpan produk.", true);
  } finally {
    saveButton.disabled = false;
  }
});

$("open-ai-command").addEventListener("click", () => {
  if (!$("ai-brief").value.trim()) $("ai-brief").value = $("name").value.trim();
  $("ai-prompt").value = buildAiPrompt();
  $("ai-status").textContent = "";
  $("ai-dialog").showModal();
  $("ai-brief").focus();
});
$("close-ai-command").addEventListener("click", () => $("ai-dialog").close());
$("ai-brief").addEventListener("input", () => {
  $("ai-prompt").value = buildAiPrompt();
});
$("copy-ai-prompt").addEventListener("click", async () => {
  const prompt = $("ai-prompt").value;
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    const copyField = document.createElement("textarea");
    copyField.value = prompt;
    copyField.setAttribute("readonly", "");
    copyField.style.position = "fixed";
    copyField.style.opacity = "0";
    document.body.append(copyField);
    copyField.select();
    const execCopy = Reflect.get(document, "execCommand");
    const copied = typeof execCopy === "function" && execCopy.call(document, "copy");
    copyField.remove();
    if (!copied) {
      $("ai-status").textContent = "Gagal menyalin prompt. Pilih dan salin teks prompt secara manual.";
      $("ai-prompt").focus();
      $("ai-prompt").select();
      return;
    }
  }
  $("ai-status").textContent = "Prompt berhasil disalin. Tempelkan ke AI pilihan Anda.";
});
$("apply-ai-response").addEventListener("click", applyAiResponse);
$("open-image-picker").addEventListener("click", () => {
  renderImages();
  $("image-picker-dialog").showModal();
});
$("close-image-picker").addEventListener("click", () => $("image-picker-dialog").close());
$("done-image-picker").addEventListener("click", () => $("image-picker-dialog").close());
$("image-picker-dialog").addEventListener("click", (event) => {
  if (event.target === $("image-picker-dialog")) $("image-picker-dialog").close();
});
$("add-feature").addEventListener("click", () => {
  featureItems.push({ title: "", description: "" });
  renderPreview();
  const title = $("product-preview-features").lastElementChild?.querySelector("[data-preview-feature-title]");
  title?.focus();
});
$("add-spec-group").addEventListener("click", () => {
  specificationGroups.push({ title: "Spesifikasi Umum", rows: [{ label: "", value: "" }] });
  renderPreview();
  const title = $("product-preview-specifications").lastElementChild?.querySelector("[data-preview-spec-group-title]");
  title?.focus();
});
$("product-preview-description").addEventListener("input", () => {
  $("productDescription").value = currentRichHtml();
  renderPreview();
});
$("product-preview-description").addEventListener("blur", () => {
  $("product-preview-description").innerHTML = currentRichHtml();
  renderPreview();
});
$("product-preview-name").addEventListener("input", () => {
  $("name").value = $("product-preview-name").textContent.trim();
  if (isNew && !slugWasEdited) $("slug").value = suggestedSlug();
  if (isNew && !$("title").value) $("title").value = `${$("name").value} | Ras Survey`;
  renderPreview();
});
$("product-preview-heading").addEventListener("input", () => {
  $("heading").value = $("product-preview-heading").innerText.trim();
  renderPreview();
});
$("product-preview-summary").addEventListener("input", () => {
  $("description").value = $("product-preview-summary").innerText.trim();
  renderPreview();
});
$("product-preview-tags").addEventListener("focus", () => {
  const tags = $("product-preview-tags");
  tags.replaceChildren(document.createTextNode($("tags").value));
});
$("product-preview-tags").addEventListener("input", () => {
  $("tags").value = $("product-preview-tags").textContent
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");
});
$("product-preview-tags").addEventListener("blur", renderPreview);
$("product-preview-gallery").addEventListener("click", (event) => {
  const button = event.target.closest("[data-preview-image]");
  if (!button) return;
  primaryImage = button.dataset.previewImage;
  renderImages();
  renderPreview();
});
$("product-preview-features").addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.previewFeatureTitle !== undefined) {
    featureItems[Number(target.dataset.previewFeatureTitle)].title = target.innerText;
  } else if (target.dataset.previewFeatureDescription !== undefined) {
    featureItems[Number(target.dataset.previewFeatureDescription)].description = target.innerText;
  }
});
$("product-preview-features").addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || target.dataset.removeFeature === undefined) return;
  featureItems.splice(Number(target.dataset.removeFeature), 1);
  renderPreview();
});
$("product-preview-specifications").addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.previewSpecGroupTitle !== undefined) {
    specificationGroups[Number(target.dataset.previewSpecGroupTitle)].title = target.innerText;
    return;
  }
  const spec = target.dataset.previewSpecLabel ?? target.dataset.previewSpecValue;
  if (spec === undefined) return;
  const [groupIndex, rowIndex] = spec.split(":").map(Number);
  const row = specificationGroups[groupIndex].rows[rowIndex];
  if (target.dataset.previewSpecLabel !== undefined) row.label = target.innerText;
  else row.value = target.innerText;
});
$("product-preview-specifications").addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.removeSpecGroup !== undefined) {
    specificationGroups.splice(Number(target.dataset.removeSpecGroup), 1);
  } else if (target.dataset.removeSpecRow !== undefined) {
    const [groupIndex, rowIndex] = target.dataset.removeSpecRow.split(":").map(Number);
    specificationGroups[groupIndex].rows.splice(rowIndex, 1);
  } else if (target.dataset.addSpecRow !== undefined) {
    specificationGroups[Number(target.dataset.addSpecRow)].rows.push({ label: "", value: "" });
  } else {
    return;
  }
  renderPreview();
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("mousedown", (event) => event.preventDefault());
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    if (!command) return;
    const executeCommand = Reflect.get(document, "execCommand");
    if (typeof executeCommand !== "function") return;
    if (command === "createLink") {
      const href = window.prompt("Masukkan alamat tautan (https://…):");
      if (!href) return;
      executeCommand.call(document, command, false, href);
    } else {
      executeCommand.call(document, command, false, button.dataset.value);
    }
    $("product-preview-description").focus();
    $("productDescription").value = currentRichHtml();
    renderPreview();
  });
});
$("description").addEventListener("input", renderPreview);
$("seoDescription").addEventListener("input", renderPreview);
$("title").addEventListener("input", renderPreview);
$("heading").addEventListener("input", renderPreview);
$("tags").addEventListener("input", renderPreview);
$("slug").addEventListener("input", renderPreview);
$("cancel-edit").addEventListener("click", () => {
  window.location.assign("/admin");
});
$("delete-product").addEventListener("click", async () => {
  const product = products.find((item) => item.slug === currentSlug);
  if (!product || !window.confirm(`Hapus produk "${product.name}" dari katalog?`)) return;
  try {
    await api("products", {
      method: "DELETE",
      body: JSON.stringify({ originalSlug: product.slug }),
    });
    window.location.assign("/admin");
  } catch (error) {
    showNotice(error instanceof Error ? error.message : "Gagal menghapus produk.", true);
  }
});
$("image-search").addEventListener("input", renderImages);
$("image-folder").addEventListener("change", renderImages);
$("slug").addEventListener("input", () => {
  slugWasEdited = true;
});
for (const field of ["name", "category"]) {
  $(field).addEventListener("input", () => {
    if (isNew && !slugWasEdited) $("slug").value = suggestedSlug();
    if (field === "name" && isNew && !$("title").value) {
      $("title").value = `${$("name").value.trim()} | Ras Survey`;
    }
    renderPreview();
  });
}

loadData().then(() => {
  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    startNewProduct();
    return;
  }
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    history.replaceState(null, "", "/admin/edit");
    startNewProduct();
    showNotice("Produk yang diminta tidak ditemukan. Silakan pilih produk dari daftar.");
    return;
  }
  selectProduct(product);
}).catch((error) => {
  showNotice(error instanceof Error ? error.message : "Gagal membaca data katalog.", true);
});
