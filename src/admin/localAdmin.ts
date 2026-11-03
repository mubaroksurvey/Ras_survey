import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { sanitizeRichText } from "../utils/sanitizeRichText";

const root = process.cwd();
const catalogPath = resolve(root, "src/data/catalog.json");
const publicRoot = resolve(root, "public");
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const maxRequestSize = 2 * 1024 * 1024;

class AdminInputError extends Error {}

interface ProductFeature {
  title: string;
  description: string;
}

interface ProductSpecification {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

interface CatalogProduct {
  slug: string;
  category: string;
  name: string;
  heading: string;
  description: string;
  productDescription: string;
  image: string;
  gallery: string[];
  title: string;
  seoDescription: string;
  seoKeywords: string[];
  tags: string[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
}

function response(body: string, status = 200, contentType = "application/json; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

function jsonResponse(value: unknown, status = 200) {
  return response(JSON.stringify(value), status);
}

function isLocalRequest(request: Request, clientAddress: string) {
  const url = new URL(request.url);
  const localHosts = new Set(["127.0.0.1", "::1", "[::1]", "localhost"]);
  const isLoopbackAddress =
    clientAddress === "::1" ||
    clientAddress === "127.0.0.1" ||
    clientAddress === "::ffff:127.0.0.1";
  if (!isLoopbackAddress || !localHosts.has(url.hostname.toLowerCase())) return false;

  const origin = request.headers.get("origin");
  return !origin || origin === url.origin;
}

async function listImages(directory = publicRoot): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const images = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listImages(path);
      if (!entry.isFile() || !imageExtensions.has(extname(entry.name).toLowerCase())) return [];
      return [`/${relative(publicRoot, path).split(sep).join("/")}`];
    }),
  );
  return images.flat().sort((a, b) => a.localeCompare(b));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new AdminInputError(`${field} wajib diisi (maksimal ${maxLength} karakter).`);
  }
  return value.trim();
}

function optionalText(value: unknown, field: string, maxLength: number, fallback: string) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string" || value.length > maxLength) {
    throw new AdminInputError(`${field} maksimal ${maxLength} karakter.`);
  }
  return value.trim() || fallback;
}

function stringList(value: unknown, field: string, maxItems: number, maxLength: number) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new AdminInputError(`${field} harus berupa daftar maksimal ${maxItems} item.`);
  }
  return [...new Set(value.map((item) => requiredText(item, field, maxLength)))];
}

function normalizeFeatures(value: unknown): ProductFeature[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 50) {
    throw new AdminInputError("Fitur produk harus berupa daftar maksimal 50 item.");
  }
  return value.map((feature, index) => {
    if (!isRecord(feature)) throw new AdminInputError(`Format fitur nomor ${index + 1} tidak valid.`);
    return {
      title: requiredText(feature.title, "Judul fitur", 200),
      description: requiredText(feature.description, "Deskripsi fitur", 2000),
    };
  });
}

function normalizeSpecifications(value: unknown): ProductSpecification[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 50) {
    throw new AdminInputError("Spesifikasi harus berupa daftar maksimal 50 kelompok.");
  }
  return value.map((group, index) => {
    if (!isRecord(group) || !Array.isArray(group.rows) || group.rows.length > 100) {
      throw new AdminInputError(`Format kelompok spesifikasi nomor ${index + 1} tidak valid.`);
    }
    return {
      title: requiredText(group.title, "Judul kelompok spesifikasi", 200),
      rows: group.rows.map((row, rowIndex) => {
        if (!isRecord(row)) {
          throw new AdminInputError(`Format baris spesifikasi nomor ${rowIndex + 1} tidak valid.`);
        }
        return {
          label:
            row.label === ""
              ? ""
              : requiredText(row.label, "Label spesifikasi", 200),
          value: requiredText(row.value, "Nilai spesifikasi", 2000),
        };
      }),
    };
  });
}

function normalizeProduct(value: unknown, availableImages: Set<string>): CatalogProduct {
  if (!isRecord(value)) throw new AdminInputError("Data produk tidak valid.");
  const slug = requiredText(value.slug, "URL produk", 300);
  const slugSegments = slug.split("/");
  if (
    !/^\/produk\/katalog\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)+$/.test(slug) ||
    slugSegments.some((segment) => segment === "." || segment === "..")
  ) {
    throw new AdminInputError("URL harus diawali /produk/katalog/ dan hanya berisi segmen URL yang valid.");
  }
  const image = requiredText(value.image, "Gambar utama", 1000);
  const name = requiredText(value.name, "Nama produk", 200);
  const description = requiredText(value.description, "Deskripsi singkat", 3000);
  const gallery = stringList(value.gallery ?? [image], "Galeri gambar", 40, 1000);
  if (!gallery.length) throw new AdminInputError("Pilih setidaknya satu gambar untuk galeri.");
  if (!gallery.includes(image)) throw new AdminInputError("Gambar utama harus dipilih dari galeri.");
  for (const asset of [image, ...gallery]) {
    if (!availableImages.has(asset)) {
      throw new AdminInputError(`Gambar "${asset}" tidak ditemukan di folder public.`);
    }
  }

  return {
    slug,
    category: requiredText(value.category, "Kategori", 100),
    name,
    heading: optionalText(value.heading, "Judul produk", 200, name),
    description,
    productDescription: sanitizeRichText(
      optionalText(value.productDescription, "Deskripsi produk", 10000, description),
    ),
    image,
    gallery,
    title: requiredText(value.title, "Judul SEO", 200),
    seoDescription: requiredText(value.seoDescription, "Deskripsi SEO", 500),
    seoKeywords: stringList(value.seoKeywords, "Kata kunci SEO", 40, 100),
    tags: stringList(value.tags, "Tag", 40, 60),
    features: normalizeFeatures(value.features),
    specifications: normalizeSpecifications(value.specifications),
  };
}

async function readCatalog(): Promise<CatalogProduct[]> {
  const parsed: unknown = JSON.parse(await readFile(catalogPath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Format catalog.json harus berupa daftar produk.");
  return parsed as CatalogProduct[];
}

async function saveCatalog(products: CatalogProduct[]) {
  const temporaryPath = `${catalogPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await rename(temporaryPath, catalogPath);
}

async function readRequestBody(request: Request): Promise<unknown | Response> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxRequestSize) return jsonResponse({ error: "Ukuran data melebihi batas 2 MB." }, 413);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Permintaan harus menggunakan application/json." }, 415);
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxRequestSize) {
    return jsonResponse({ error: "Ukuran data melebihi batas 2 MB." }, 413);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return jsonResponse({ error: "JSON permintaan tidak valid." }, 400);
  }
}

async function handleApiRequest(request: Request, pathname: string) {
  if (pathname === "/__local-admin/api/images" && request.method === "GET") {
    return jsonResponse(await listImages());
  }
  if (pathname !== "/__local-admin/api/products") {
    return jsonResponse({ error: "Endpoint admin tidak ditemukan." }, 404);
  }

  if (request.method === "GET") {
    const products = await readCatalog();
    return jsonResponse({
      products,
      categories: [...new Set(products.map((product) => product.category))].sort((a, b) =>
        a.localeCompare(b),
      ),
    });
  }

  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    return jsonResponse({ error: "Metode permintaan tidak didukung." }, 405);
  }
  const body = await readRequestBody(request);
  if (body instanceof Response) return body;

  const products = await readCatalog();
  const availableImages = new Set(await listImages());

  if (request.method === "POST") {
    const product = normalizeProduct(body, availableImages);
    if (products.some((item) => item.slug === product.slug)) {
      return jsonResponse({ error: "URL produk sudah digunakan." }, 409);
    }
    products.push(product);
    await saveCatalog(products);
    return jsonResponse({ product, count: products.length }, 201);
  }

  if (!isRecord(body)) return jsonResponse({ error: "Data permintaan tidak valid." }, 400);
  const originalSlug = requiredText(body.originalSlug, "URL produk lama", 300);
  const index = products.findIndex((product) => product.slug === originalSlug);
  if (index < 0) return jsonResponse({ error: "Produk tidak ditemukan." }, 404);

  if (request.method === "DELETE") {
    products.splice(index, 1);
    await saveCatalog(products);
    return jsonResponse({ count: products.length });
  }

  const product = normalizeProduct(body.product, availableImages);
  if (products.some((item, itemIndex) => itemIndex !== index && item.slug === product.slug)) {
    return jsonResponse({ error: "URL produk sudah digunakan." }, 409);
  }
  products[index] = product;
  await saveCatalog(products);
  return jsonResponse({ product, count: products.length });
}

async function handleApi(request: Request, pathname: string) {
  try {
    return await handleApiRequest(request, pathname);
  } catch (error) {
    if (error instanceof AdminInputError) return jsonResponse({ error: error.message }, 400);
    throw error;
  }
}

export async function handleLocalAdminRequest(request: Request, clientAddress: string) {
  const url = new URL(request.url);
  const isAdminPath =
    url.pathname === "/admin" ||
    url.pathname === "/admin/" ||
    url.pathname.startsWith("/admin/") ||
    url.pathname.startsWith("/__local-admin/");
  if (!isAdminPath) return undefined;
  if (!isLocalRequest(request, clientAddress)) {
    return response("Admin hanya dapat digunakan dari komputer lokal.", 403, "text/plain; charset=utf-8");
  }
  if (url.pathname === "/admin" || url.pathname === "/admin/") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const html = await readFile(resolve(root, "src/admin/admin-list.html"), "utf8");
    return response(html, 200, "text/html; charset=utf-8");
  }
  if (url.pathname === "/admin/edit") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const html = await readFile(resolve(root, "src/admin/admin.html"), "utf8");
    return response(html, 200, "text/html; charset=utf-8");
  }
  if (url.pathname.startsWith("/admin/")) {
    return response("Halaman admin tidak ditemukan.", 404, "text/plain; charset=utf-8");
  }
  if (url.pathname === "/__local-admin/admin.js") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const script = await readFile(resolve(root, "src/admin/admin.js"), "utf8");
    return response(script, 200, "text/javascript; charset=utf-8");
  }
  if (url.pathname === "/__local-admin/admin-list.js") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const script = await readFile(resolve(root, "src/admin/admin-list.js"), "utf8");
    return response(script, 200, "text/javascript; charset=utf-8");
  }
  if (url.pathname === "/__local-admin/poster.js") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const script = await readFile(resolve(root, "src/admin/poster.js"), "utf8");
    return response(script, 200, "text/javascript; charset=utf-8");
  }
  if (url.pathname === "/__local-admin/poster.css") {
    if (request.method !== "GET") return response("Method not allowed", 405, "text/plain; charset=utf-8");
    const stylesheet = await readFile(resolve(root, "src/admin/poster.css"), "utf8");
    return response(stylesheet, 200, "text/css; charset=utf-8");
  }
  return handleApi(request, url.pathname);
}
