import { readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseFragment } from "parse5";

const root = process.cwd();
const catalogPath = resolve(root, "src/data/catalog.json");
const publicRoot = resolve(root, "public");
const actualAssets = new Map();
const categories = {
  "Alat-Curah-Hujan": "Alat Curah Hujan",
  "Alat-Deteksi-Emas": "Alat Deteksi Emas",
  "Auto-Level": "Auto Level",
  "Coating-Thickness": "Coating Thickness",
  "Cross-Line": "Cross Line",
  "Current-Meter": "Current Meter",
  "Digipass-Dwl": "Digipass Dwl",
  "Digital-Level": "Digital Level",
  "Gas-Detektor": "Gas Detektor",
  "GPS-ECHO-SOUNDER": "ECHO SOUNDER",
  "GPS-Geodetik": "GPS Geodetik",
  "Hammer-test": "Hammer Test",
  "Niton-Analyzer": "Niton Analyzer",
  "theodolite": "theodolite",
  "total-station": "total station",
  "Alat Curah Hujan": "Alat Curah Hujan",
  "Alat Deteksi Emas": "Alat Deteksi Emas",
  "Auto Level": "Auto Level",
  "Coating Thickness": "Coating Thickness",
  "Cross Line": "Cross Line",
  "Current Meter": "Current Meter",
  "Digipass Dwl": "Digipass Dwl",
  "Digital Level": "Digital Level",
  "Gas Detektor": "Gas Detektor",
  "ECHO SOUNDER": "ECHO SOUNDER",
  "GPS Geodetik": "GPS Geodetik",
  "Hammer Test": "Hammer Test",
  "Niton Analyzer": "Niton Analyzer",
  "total station": "total station",
};

function textContent(node) {
  if (node.nodeName === "#text") return node.value ?? "";
  return (node.childNodes ?? [])
    .map(textContent)
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function findNodes(node, predicate, result = []) {
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes ?? []) findNodes(child, predicate, result);
  return result;
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function indexPublicAssets(directory = publicRoot) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      indexPublicAssets(file);
    } else {
      const url = `/${file.slice(publicRoot.length + 1).replaceAll("\\", "/")}`;
      actualAssets.set(url.toLowerCase(), url);
    }
  }
}

function readProductContent(product) {
  if (!product.contentHtml) return;
  const fragment = parseFragment(product.contentHtml);
  const headings = findNodes(fragment, (node) => /^h[1-6]$/.test(node.tagName ?? ""));
  const productHeading = headings.find((node) => node.tagName === "h1");
  const descriptionHeading = headings.find((node) =>
    /deskripsi produk/i.test(textContent(node)),
  );
  const productDescription = descriptionHeading
    ? (descriptionHeading.parentNode?.childNodes ?? [])
        .slice((descriptionHeading.parentNode?.childNodes ?? []).indexOf(descriptionHeading) + 1)
        .find((node) => node.tagName === "p")
    : undefined;

  const featureCards = findNodes(
    fragment,
    (node) =>
      node.tagName === "div" &&
      /\bbg-blue-50\b/.test(attribute(node, "class") ?? ""),
  );
  const features = featureCards.flatMap((card) => {
    const title = findNodes(card, (node) => node.tagName === "h3")[0];
    const description = findNodes(card, (node) => node.tagName === "p")[0];
    return title && description
      ? [{ title: textContent(title), description: textContent(description) }]
      : [];
  });

  const specifications = findNodes(fragment, (node) => node.tagName === "table").map((table) => {
    const groups = [];
    let activeGroup = { title: "Spesifikasi", rows: [] };
    for (const row of findNodes(table, (node) => node.tagName === "tr")) {
      const cells = (row.childNodes ?? []).filter((node) =>
        node.tagName === "td" || node.tagName === "th",
      );
      if (cells.length === 0) continue;
      const label = textContent(cells[0]);
      if (cells.length === 1 || Number(attribute(cells[0], "colspan") ?? 1) > 1) {
        const listItems = findNodes(cells[0], (node) => node.tagName === "li").map(textContent);
        if (listItems.length) {
          activeGroup.rows.push({ label: "", value: listItems.join(", ") });
          continue;
        }
        if (activeGroup.rows.length) groups.push(activeGroup);
        activeGroup = { title: label || "Spesifikasi", rows: [] };
        continue;
      }
      activeGroup.rows.push({
        label,
        value: cells.slice(1).map(textContent).join(" "),
      });
    }
    if (activeGroup.rows.length) groups.push(activeGroup);
    return groups;
  }).flat();

  const images = findNodes(fragment, (node) => node.tagName === "img")
    .map((node) => attribute(node, "src"))
    .filter((image, index, list) => image && list.indexOf(image) === index);
  Object.assign(product, {
    heading: productHeading ? textContent(productHeading) : product.name,
    productDescription: productDescription ? textContent(productDescription) : product.description,
    features,
    specifications,
    gallery: images.length ? images : [product.image],
  });
  delete product.contentHtml;
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
indexPublicAssets();
if (
  !Array.isArray(catalog) ||
  catalog.some(
    (product) =>
      !product.slug ||
      !product.title ||
      !product.name ||
      !product.description ||
      !product.image,
  )
) {
  throw new Error("Each catalog product needs a route, name, description, image, and SEO title.");
}
const routes = new Set(catalog.map((product) => product.slug));
if (routes.size !== catalog.length) {
  throw new Error("Catalog JSON contains duplicate product routes.");
}

for (const product of catalog) {
  product.category = categories[product.category] ?? product.category;
  readProductContent(product);
  delete product.applications;
  for (const image of new Set([product.image, ...(product.gallery ?? [])])) {
    const actualImage = actualAssets.get(image.toLowerCase());
    if (actualImage !== image) {
      throw new Error(
        `Catalog image "${image}" is missing or has incorrect casing for ${product.slug}.` +
          (actualImage ? ` Use "${actualImage}".` : ""),
      );
    }
  }
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Prepared ${catalog.length} catalog products across ${new Set(catalog.map((item) => item.category)).size} categories.`);
