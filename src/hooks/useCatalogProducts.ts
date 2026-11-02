import { useEffect, useState } from "react";

export interface CatalogProduct {
  slug: string;
  category: string;
  name: string;
  description: string;
  image: string;
}

function isCatalogProduct(value: unknown): value is CatalogProduct {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;
  return (
    typeof product.slug === "string" &&
    typeof product.category === "string" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.image === "string"
  );
}

export function useCatalogProducts(initialIsEnglish = false) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnglish, setIsEnglish] = useState(initialIsEnglish);

  useEffect(() => {
    let active = true;
    const english = initialIsEnglish || document.documentElement.lang === "en";
    setIsEnglish(english);

    async function loadProducts() {
      try {
        const response = await fetch(
          english ? "/en/catalog-index.json" : "/catalog-index.json",
        );
        if (!response.ok) {
          throw new Error(`Catalog request failed with status ${response.status}.`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isCatalogProduct)) {
          throw new Error("Catalog response has an invalid format.");
        }

        if (active) setProducts(data);
      } catch (reason) {
        if (active) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProducts();
    return () => {
      active = false;
    };
  }, [initialIsEnglish]);

  return { products, loading, error, isEnglish };
}
