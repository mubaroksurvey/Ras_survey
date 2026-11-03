import type { APIRoute } from "astro";
import catalog from "../data/catalog.json";

export const prerender = true;

export const GET: APIRoute = () => {
  const products = catalog.map(({ slug, category, name, heading, description, image, features }) => ({
    slug: slug.replace(/^\/produk/, ""),
    category,
    name,
    heading,
    description,
    image,
    features: features.slice(0, 2).map(({ description: value }) => value),
  }));

  return new Response(JSON.stringify(products), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
