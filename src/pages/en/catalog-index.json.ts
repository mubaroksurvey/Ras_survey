import type { APIRoute } from "astro";
import catalog from "../../data/catalog.json";
import translations from "../../data/translations.json";

export const prerender = true;

export const GET: APIRoute = () => {
  const products = catalog.map(({ slug, category, name, heading, description, image, features }) => ({
    slug: slug.replace(/^\/produk/, ""),
    category,
    name: translations[name as keyof typeof translations] ?? name,
    heading: translations[heading as keyof typeof translations] ?? heading,
    description: translations[description as keyof typeof translations] ?? description,
    image,
    features: features
      .slice(0, 2)
      .map(({ description: value }) => translations[value as keyof typeof translations] ?? value),
  }));

  return new Response(JSON.stringify(products), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
