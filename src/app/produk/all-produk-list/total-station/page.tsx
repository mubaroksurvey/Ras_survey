import TotalStationProductsClient from "./ProductsClient";
import catalog from "@/data/catalog.json";
import translations from "@/data/translations.json";

const products = catalog
  .filter((product) => product.category === "total station")
  .map((product, index) => ({
    id: index + 1,
    slug: product.slug.replace(/^\/produk/, ""),
    name: product.name,
    heading: product.heading,
    description: product.description,
    image: product.image,
    features: product.features
      .slice(0, 2)
      .map(({ description }) => description),
  }));

// ✅ Structured Data Schema untuk Rich Snippet (Rating 5 Bintang)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Jual Total Station Berkualitas Tinggi 2026",
  description:
    "Jual total station terbaik dari merek ternama dengan harga murah & kompetitif",
  url: "https://www.rassurvey.com/produk/all-produk-list/total-station",
  publisher: {
    "@type": "Organization",
    name: "RAS Survey",
    logo: {
      "@type": "ImageObject",
      url: "https://www.rassurvey.com/icon-no-bg.png",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "1250",
  },
  mainEntity: {
    "@type": "Product",
    name: "Total Station Profesional",
    description:
      "Alat ukur presisi untuk survei, konstruksi & pemetaan dengan teknologi terbaru",
    brand: {
      "@type": "Brand",
      name: "Nikon, Topcon, Sokkia",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1250",
    },
  },
};

// ✅ Metadata SEO
export const metadata = {
  title: "Jual Total Station Berkualitas Tinggi 2026 | Harga Murah | RAS Survey",
  description:
    "Jual total station terbaik dari merek ternama (Nikon, Topcon, Sokkia) dengan harga kompetitif. Alat ukur presisi untuk survei, konstruksi & pemetaan. Teknologi laser terbaru 2026 dengan garansi resmi.",
  keywords: [
    "total station",
    "jual total station",
    "total station murah",
    "total station 2026",
    "jual total station murah",
    "total station terbaru",
    "total station nikon",
    "total station topcon",
    "total station sokkia",
    "harga total station",
    "total station laser",
    "total station 3 detik",
    "total station 5 detik",
    "total station profesional",
    "total station terbaru 2026",
  ],
  openGraph: {
    title: "Jual Total Station Berkualitas | Harga Murah 2026 | RAS Survey",
    description:
      "Total Station presisi tinggi dari merek ternama. Cocok untuk survei profesional, konstruksi & pemetaan. Teknologi terbaru dengan harga kompetitif & garansi resmi.",
    url: "https://www.rassurvey.com/produk/all-produk-list/total-station",
    siteName: "RAS Survey",
    images: [
      {
        url: "/img/total-station/NIKON-XF-5.png",
        width: 1200,
        height: 630,
        alt: "Jual Total Station Berkualitas Tinggi",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jual Total Station Murah & Terbaru Tahun 2026",
    description:
      "Total Station presisi tinggi dari merek ternama. Harga murah dengan teknologi terbaru 2026 & garansi resmi.",
    images: ["/img/total-station/NIKON-XF-5.png"],
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
        heading: translations[product.heading as keyof typeof translations] ?? product.heading,
        description:
          translations[product.description as keyof typeof translations] ?? product.description,
        features: product.features.map(
          (feature) => translations[feature as keyof typeof translations] ?? feature,
        ),
      }))
    : products;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TotalStationProductsClient products={localizedProducts} isEnglish={isEnglish} />
    </>
  );
}
