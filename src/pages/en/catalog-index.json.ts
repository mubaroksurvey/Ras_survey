import type { APIRoute } from "astro";
import catalog from "../../data/catalog.json";
import translations from "../../data/translations.json";

export const prerender = true;

export const GET: APIRoute = () => {
  const products = catalog.map(({ slug, category, name, description, image }) => ({
    slug: slug.replace(/^\/produk/, ""),
    category,
    name: translations[name as keyof typeof translations] ?? name,
    description: translations[description as keyof typeof translations] ?? description,
    image,
  }));

  return new Response(JSON.stringify(products), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
