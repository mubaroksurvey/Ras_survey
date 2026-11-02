import TheodoliteProductsClient from "./ProductsClient";
import catalog from "@/data/catalog.json";
import translations from "@/data/translations.json";

const products = catalog
  .filter((product) => product.category === "theodolite")
  .map((product, index) => ({
    id: index + 1,
    slug: product.slug.replace(/^\/produk/, ""),
    name: product.name,
    description: product.description,
    image: product.image,
  }));

// ✅ Structured Data Schema untuk Rich Snippet (Rating 5 Bintang)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Jual Theodolite Berkualitas Tinggi 2026",
  description:
    "Jual theodolite terbaik dari merek ternama dengan harga murah & kompetitif",
  url: "https://www.rassurvey.com/produk/all-produk-list/theodolite",
  publisher: {
    "@type": "Organization",
    name: "RAS Survey",
    logo: {
      "@type": "ImageObject",
      url: "https://www.rassurvey.com/logo.png",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "980",
  },
  mainEntity: {
    "@type": "Product",
    name: "Theodolite Profesional",
    description:
      "Alat ukur sudut presisi untuk survei, konstruksi & pemetaan dengan teknologi modern",
    brand: {
      "@type": "Brand",
      name: "Nikon, Topcon, Sokkia",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "980",
    },
  },
};

// ✅ Metadata SEO
export const metadata = {
  title: "Jual Theodolite Berkualitas Tinggi 2026 | Harga Terjangkau | RAS Survey",
  description:
    "Jual theodolite terbaik dari merek ternama (Nikon, Topcon, Sokkia) dengan harga murah & kompetitif. Alat ukur sudut presisi untuk survei, konstruksi & pemetaan. Theodolite terbaru 2026 dengan garansi resmi & layanan purna jual terpercaya.",
  keywords: [
    "theodolite",
    "jual theodolite",
    "theodolite murah",
    "theodolite 2026",
    "jual theodolite murah",
    "theodolite terbaik",
    "theodolite nikon",
    "theodolite topcon",
    "theodolite sokkia",
    "harga theodolite",
    "theodolite digital",
    "alat ukur theodolite",
    "theodolite untuk survei",
    "theodolite profesional",
    "theodolite terbaru 2026",
  ],
  openGraph: {
    title: "Jual Theodolite Berkualitas | Harga Murah 2026 | RAS Survey",
    description:
      "Theodolite berkualitas tinggi dari merek ternama. Harga murah & kompetitif untuk survei profesional, konstruksi & pemetaan. Terbaru 2026 dengan garansi resmi.",
    url: "https://www.rassurvey.com/produk/all-produk-list/theodolite",
    siteName: "RAS Survey",
    images: [
      {
        url: "/img/theodolite/theodolite.jpg",
        width: 1200,
        height: 630,
        alt: "Jual Theodolite Berkualitas Tinggi",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jual Theodolite Murah & Terbaru Tahun 2026",
    description:
      "Theodolite presisi tinggi dari merek ternama. Harga murah untuk survei, konstruksi & pemetaan. Terbaru 2026 dengan garansi & layanan purna jual terpercaya.",
    images: ["/img/theodolite/theodolite.jpg"],
  },
  other: {
    "structured-data": JSON.stringify(structuredData),
  },
};

export default function Page({ isEnglish = false }: { isEnglish?: boolean }) {
  const localizedProducts = isEnglish
    ? products.map((product) => ({
        ...product,
        name: translations[product.name as keyof typeof translations] ?? product.name,
        description:
          translations[product.description as keyof typeof translations] ?? product.description,
      }))
    : products;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TheodoliteProductsClient products={localizedProducts} isEnglish={isEnglish} />
    </>
  );
}
