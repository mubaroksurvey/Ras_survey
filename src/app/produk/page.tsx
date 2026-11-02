import ProductsClient from "./ProductsClient";
// ✅ Metadata SEO
export const metadata = {
  title: "Katalog Peralatan Profesional: Survei, Deteksi & Pengukuran | RAS Survey",
  description:
    "Pusat peralatan profesional terlengkap: alat survei, deteksi emas, pengukur ketebalan, detektor gas, alat curah hujan, dan berbagai instrumen pengukuran presisi. Kualitas terjamin dengan harga terbaik.",
  keywords: [
    "alat survey",
    "total station",
    "theodolite",
    "alat deteksi emas",
    "coating thickness",
    "detektor gas",
    "alat curah hujan",
    "digital level",
    "cross line laser",
    "current meter",
    "niton analyzer",
    "alat ukur profesional",
    "instrumen pengukuran",
  ],
  openGraph: {
    title: "Katalog Peralatan Profesional | RAS Survey",
    description:
      "Temukan berbagai peralatan profesional berkualitas: alat survei, deteksi emas, pengukur ketebalan, detektor gas, dan instrumen pengukuran presisi lainnya.",
    url: "https://www.rassurvey.com",
    siteName: "RAS Survey",
    images: [
      {
        url: "/img/NIKON-XF-5.png",
        width: 1200,
        height: 630,
        alt: "Peralatan Profesional RAS Survey",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Peralatan Profesional | RAS Survey",
    description:
      "Temukan berbagai peralatan profesional berkualitas: alat survei, deteksi emas, pengukur ketebalan, detektor gas, dan instrumen pengukuran presisi lainnya.",
    images: ["/img/NIKON-XF-5.png"],
  },
};

export default function Page({ isEnglish = false }: { isEnglish?: boolean }) {
  return <ProductsClient isEnglish={isEnglish} />
}
