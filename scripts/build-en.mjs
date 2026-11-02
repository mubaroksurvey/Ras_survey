import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { parse, serialize } from "parse5";
import translate from "translate-google";

const root = process.cwd();
const outputRoot = resolve(root, "dist");
const englishRoot = resolve(outputRoot, "en");
const cachePath = resolve(root, "src/data/translations.json");
const catalog = JSON.parse(readFileSync(resolve(root, "src/data/catalog.json"), "utf8"));
const site = JSON.parse(readFileSync(resolve(root, "src/data/seo.json"), "utf8")).site;
const translationCache = JSON.parse(readFileSync(cachePath, "utf8"));
const normalizeBrand = (text) =>
  text
    .replace(/\brace survey\b/gi, "Ras Survey")
    .replace(/\bhorizons\b/gi, "Horizon")
    .replace(/\s*\|\s*(?=Ras Survey)/g, " | ");
const ignoredTags = new Set(["script", "style", "code", "pre", "svg", "noscript"]);
const englishPages = [];

for (const [source, translation] of Object.entries(translationCache)) {
  if (typeof translation === "string") {
    translationCache[source] = normalizeBrand(translation);
  }
}

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (path === englishRoot) return [];
    if (entry.isDirectory()) return findHtmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  });
}

function pagePath(file) {
  const path = `/${relative(outputRoot, file).split(sep).join("/")}`;
  if (path === "/index.html") return "/";
  return path.replace(/\/index\.html$/, "").replace(/\.html$/, "");
}

function isTranslatableAttribute(element, attribute) {
  if (["alt", "title", "placeholder", "aria-label", "aria-description"].includes(attribute.name)) {
    return true;
  }
  if (element.tagName !== "meta" || attribute.name !== "content") return false;
  const key = element.attrs.find((item) => item.name === "name" || item.name === "property")?.value;
  return new Set([
    "description",
    "keywords",
    "og:title",
    "og:description",
    "twitter:title",
    "twitter:description",
  ]).has(key);
}

function addTarget(value, apply) {
  const text = value.trim();
  if (!text || !/[A-Za-zÀ-ÿ]{2}/.test(text)) return;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  targets.push({ text, leading, trailing, apply });
}

let targets = [];

const catalogTranslations = [
  ...new Set(catalog.flatMap(({ name, description }) => [name, description])),
].filter((text) => translationCache[text] === undefined);
if (catalogTranslations.length) await fillTranslations(catalogTranslations);

function collectTargets(node, skip = false) {
  const skipped = skip || ignoredTags.has(node.tagName);
  if (!skipped && node.nodeName === "#text") {
    addTarget(node.value ?? "", (value) => {
      node.value = value;
    });
  }
  if (!skipped && node.attrs) {
    for (const attribute of node.attrs) {
      if (!isTranslatableAttribute(node, attribute)) continue;
      addTarget(attribute.value, (value) => {
        attribute.value = value;
      });
    }
  }
  for (const child of node.childNodes ?? []) collectTargets(child, skipped);
  if (node.content) collectTargets(node.content, skipped);
}

function splitLongText(text, maxLength = 1800) {
  const chunks = [];
  let rest = text;
  while (rest.length > maxLength) {
    let splitAt = rest.lastIndexOf(" ", maxLength);
    if (splitAt < maxLength * 0.6) splitAt = maxLength;
    chunks.push(rest.slice(0, splitAt));
    rest = rest.slice(splitAt);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

function makeBatches(values) {
  const batches = [];
  let batch = [];
  let characters = 0;
  for (const value of values) {
    const chunks = splitLongText(value);
    for (const chunk of chunks) {
      if (batch.length >= 35 || characters + chunk.length > 2600) {
        batches.push(batch);
        batch = [];
        characters = 0;
      }
      batch.push(chunk);
      characters += chunk.length;
    }
  }
  if (batch.length) batches.push(batch);
  return batches;
}

async function translateBatch(values) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await translate(values, { from: "id", to: "en" });
      const translations = Array.isArray(result) ? result : [result];
      if (translations.length !== values.length || translations.some((value) => typeof value !== "string")) {
        throw new Error("Translation provider returned an unexpected response.");
      }
      return translations.map(normalizeBrand);
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 1200));
    }
  }
  throw new Error(`Unable to translate a batch of ${values.length} text segments.`, { cause: lastError });
}

async function fillTranslations(missing) {
  const chunks = [];
  const chunkOwners = new Map();
  for (const source of missing) {
    const parts = splitLongText(source);
    chunkOwners.set(source, parts);
    chunks.push(...parts.filter((part) => translationCache[part] === undefined));
  }
  const uniqueChunks = [...new Set(chunks)];
  const batches = makeBatches(uniqueChunks);
  let batchIndex = 0;
  const workers = Array.from({ length: Math.min(2, batches.length) }, async () => {
    while (batchIndex < batches.length) {
      const currentIndex = batchIndex++;
      const batch = batches[currentIndex];
      const result = await translateBatch(batch);
      batch.forEach((source, index) => {
        translationCache[source] = result[index].trim();
      });
      console.log(`Translated batch ${currentIndex + 1}/${batches.length}`);
    }
  });
  await Promise.all(workers);

  for (const source of missing) {
    const parts = chunkOwners.get(source) ?? [source];
    translationCache[source] = parts.map((part) => translationCache[part] ?? part).join("");
  }
}

function routeForUrl(url) {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  return path;
}

function updateDocument(document, route, routes) {
  const canonicalPath = `/en${route === "/" ? "/" : route}`;
  const canonicalUrl = new URL(canonicalPath, site.url).href;
  const languageRoute = route === "/404" ? "/" : route;
  const idUrl = new URL(languageRoute, site.url).href;
  const enUrl = new URL(`/en${languageRoute === "/" ? "/" : languageRoute}`, site.url).href;

  function visit(node) {
    if (node.tagName === "html") {
      const lang = node.attrs.find((attribute) => attribute.name === "lang");
      if (lang) lang.value = "en";
      else node.attrs.push({ name: "lang", value: "en" });
    }

    if (node.tagName === "link") {
      const rel = node.attrs.find((attribute) => attribute.name === "rel")?.value;
      const href = node.attrs.find((attribute) => attribute.name === "href");
      if (href && rel === "canonical") href.value = canonicalUrl;
      if (href && rel === "alternate") {
        const language = node.attrs.find((attribute) => attribute.name === "hreflang")?.value;
        if (language === "id" || language === "x-default") href.value = idUrl;
        if (language === "en") href.value = enUrl;
      }
    }

    if (node.tagName === "meta") {
      const property = node.attrs.find((attribute) => attribute.name === "property")?.value;
      const content = node.attrs.find((attribute) => attribute.name === "content");
      if (property === "og:url" && content) content.value = canonicalUrl;
    }

    if (node.tagName === "a") {
      const href = node.attrs.find((attribute) => attribute.name === "href");
      const language = node.attrs.find((attribute) => attribute.name === "data-language-switch")?.value;
      if (href && language) {
        href.value = language === "en" ? enUrl : idUrl;
      } else if (href && (href.value.startsWith("/") || href.value.startsWith(site.url))) {
        try {
          const url = new URL(href.value, site.url);
          if (url.origin === new URL(site.url).origin) {
            const target = routeForUrl(url);
            if (routes.has(target)) href.value = `/en${target === "/" ? "/" : target}`;
          }
        } catch {
          throw new Error(`Invalid internal link found while generating English page: ${href.value}`);
        }
      }
    }
    if (node.tagName === "form") {
      const action = node.attrs.find((attribute) => attribute.name === "action");
      if (action && action.value.startsWith("/")) {
        const url = new URL(action.value, site.url);
        const target = routeForUrl(url);
        if (url.origin === new URL(site.url).origin && routes.has(target)) {
          action.value = `/en${target === "/" ? "/" : target}${url.search}`;
        }
      }
    }
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }

  visit(document);
}

const sourceFiles = findHtmlFiles(outputRoot).filter((file) => !file.startsWith(`${englishRoot}${sep}`));
const routeSet = new Set(sourceFiles.map(pagePath).filter((route) => route !== "/404"));

for (const file of sourceFiles) {
  const html = readFileSync(file, "utf8");
  const document = parse(html);
  targets = [];
  collectTargets(document);
  const pending = [...new Set(targets.map((target) => target.text))].filter(
    (text) => translationCache[text] === undefined,
  );
  if (pending.length) await fillTranslations(pending);

  const route = pagePath(file);
  const relativePath = relative(outputRoot, file);
  const destination = join(englishRoot, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  const englishHtml = existsSync(destination) ? readFileSync(destination, "utf8") : html;
  const englishDocument = parse(englishHtml);
  targets = [];
  collectTargets(englishDocument);
  for (const target of targets) {
    const translation = translationCache[target.text];
    if (translation !== undefined) {
      target.apply(`${target.leading}${translation}${target.trailing}`);
    }
  }
  updateDocument(englishDocument, route, routeSet);
  writeFileSync(destination, serialize(englishDocument));
  englishPages.push(route);
  console.log(`Generated /en${route === "/" ? "/" : route}`);
}

writeFileSync(cachePath, `${JSON.stringify(translationCache, null, 2)}\n`);
const catalogIndex = JSON.parse(readFileSync(resolve(outputRoot, "catalog-index.json"), "utf8"));
writeFileSync(
  resolve(englishRoot, "catalog-index.json"),
  `${JSON.stringify(
    catalogIndex.map((product) => ({
      ...product,
      name: translationCache[product.name] ?? product.name,
      description: translationCache[product.description] ?? product.description,
    })),
    null,
    2,
  )}\n`,
);
writeFileSync(
  resolve(outputRoot, "sitemap-en.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${englishPages
    .filter((route) => route !== "/404")
    .map((route) => `<url><loc>${new URL(`/en${route === "/" ? "/" : route}`, site.url).href}</loc></url>`)
    .join("")}</urlset>\n`,
);
const sitemapIndexPath = resolve(outputRoot, "sitemap-index.xml");
const sitemapIndex = readFileSync(sitemapIndexPath, "utf8");
const englishSitemapUrl = new URL("/sitemap-en.xml", site.url).href;
if (!sitemapIndex.includes(englishSitemapUrl)) {
  if (!sitemapIndex.includes("</sitemapindex>")) {
    throw new Error("Astro did not generate a valid sitemap index.");
  }
  writeFileSync(
    sitemapIndexPath,
    sitemapIndex.replace(
      "</sitemapindex>",
      `<sitemap><loc>${englishSitemapUrl}</loc></sitemap></sitemapindex>`,
    ),
  );
}
console.log(`Generated ${englishPages.length} English pages with cached translations.`);
