# Ras Survey (Astro)

The site is built with Astro and React server rendering. The original Next.js
pages and product content are retained under `src/app`; Astro generates their
static routes without including Next.js in the runtime.

## Commands

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run build` checks the project, builds Indonesian pages, then generates
matching `/en` pages. On the first build it translates uncached content, so an
internet connection is required. Translations are saved in
`src/data/translations.json` and reused on later builds. SEO defaults are in
`src/data/seo.json`; all product details, specifications, descriptions, SEO
metadata, and rendered product content are managed in `src/data/catalog.json`.
Update that JSON file to add or edit a product; the build derives the lightweight
product-list endpoint from it, so there is only one catalog source file.

Each catalog record contains its URL (`slug`), category, product name and
description, image paths, page/SEO title and description, a detailed product
description, optional feature cards, and grouped specification rows. New
products need no page component or product-specific folder; add a record to
`catalog.json` and run `npm run build`.

## Local product admin

Run `npm run dev` and open `http://127.0.0.1:4321/admin` to manage the product
list. Each product has separate Edit and Hapus actions; the editor opens at
`/admin/edit?slug=...`, while Produk Baru opens `/admin/edit`. The editor reads
image files recursively from `public`, supports a primary image plus a
multi-image gallery, and saves product and SEO details in `catalog.json`.
Product text, tags, features, and specifications can be edited directly in the
live preview. The admin server binds to loopback and is only enabled during
development; it is not included in production builds. Copy any new image into
`public` before selecting it in the editor.
