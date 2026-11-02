const $ = (id) => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemen admin "${id}" tidak ditemukan.`);
  return element;
};

const products = [];

function showNotice(message, isError = false) {
  const notice = $("notice");
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.style.display = "block";
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

function renderProducts() {
  const query = $("product-search").value.trim().toLowerCase();
  const visible = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query),
  );
  const list = $("product-list");
  $("product-count").textContent = `${products.length} produk`;
  list.replaceChildren();

  const createCard = document.createElement("a");
  createCard.className = "product-row new-product-card";
  createCard.href = "/admin/edit";
  createCard.setAttribute("aria-label", "Tambah produk baru");
  const plus = document.createElement("span");
  plus.className = "new-product-icon";
  plus.setAttribute("aria-hidden", "true");
  plus.textContent = "+";
  const createTitle = document.createElement("strong");
  createTitle.textContent = "＋ Produk Baru";
  const createDescription = document.createElement("span");
  createDescription.textContent = "Tambah produk ke katalog";
  createCard.append(plus, createTitle, createDescription);
  list.append(createCard);

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = products.length ? "Produk tidak ditemukan." : "Belum ada produk.";
    if (products.length) list.append(empty);
    return;
  }

  visible.forEach((product) => {
    const row = document.createElement("article");
    row.className = "product-row";
    const imageFrame = document.createElement("div");
    imageFrame.className = "product-image-frame";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    imageFrame.append(image);

    const info = document.createElement("div");
    info.className = "product-info";
    const name = document.createElement("strong");
    name.textContent = product.name;
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.category;
    const description = document.createElement("p");
    description.textContent = product.description;
    info.append(category, name, description);

    const actions = document.createElement("div");
    actions.className = "product-actions";
    const edit = document.createElement("a");
    edit.className = "button primary";
    edit.href = `/admin/edit?slug=${encodeURIComponent(product.slug)}`;
    edit.textContent = "Edit";
    edit.setAttribute("aria-label", `Edit ${product.name}`);

    const remove = document.createElement("button");
    remove.className = "button danger";
    remove.type = "button";
    remove.textContent = "Hapus";
    remove.setAttribute("aria-label", `Hapus ${product.name}`);
    remove.addEventListener("click", () => deleteProduct(product, remove));

    actions.append(edit, remove);
    row.append(imageFrame, info, actions);
    list.append(row);
  });
}

async function loadProducts() {
  const result = await api("products");
  products.splice(0, products.length, ...result.products);
  renderProducts();
}

async function deleteProduct(product, button) {
  if (!window.confirm(`Hapus produk "${product.name}" dari katalog?`)) return;
  button.disabled = true;
  try {
    await api("products", {
      method: "DELETE",
      body: JSON.stringify({ originalSlug: product.slug }),
    });
    await loadProducts();
    showNotice(`Produk "${product.name}" berhasil dihapus.`);
  } catch (error) {
    button.disabled = false;
    showNotice(error instanceof Error ? error.message : "Gagal menghapus produk.", true);
  }
}

$("product-search").addEventListener("input", renderProducts);
loadProducts().catch((error) => {
  $("product-count").textContent = "Data tidak tersedia";
  showNotice(error instanceof Error ? error.message : "Gagal membaca data katalog.", true);
});
