import React, { type JSX } from "react";
import { useMemo, useState } from "react";
import Link from "@/compat/LegacyLink";
import Image from "@/compat/LegacyImage";
import { FiSearch, FiChevronDown, FiGrid } from "react-icons/fi";
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineScale,
  HiOutlineCloud,
  HiOutlineSparkles,
} from "react-icons/hi";
import { PiSpeedometerThin } from "react-icons/pi";
import { FaRulerCombined } from "react-icons/fa";
import { LuFileVideo2 } from "react-icons/lu";
import { FaGripLines } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { TbPhotoSensor3 } from "react-icons/tb";
import { MdOutlineGasMeter } from "react-icons/md";
import { FiActivity } from "react-icons/fi";
import { GiHammerBreak } from "react-icons/gi";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

import { motion, AnimatePresence } from "framer-motion";


// Replace the dropdownVariants with simpler animation
const dropdownVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

interface Props {
  isEnglish?: boolean;
}

export default function ProductsPage({ isEnglish = false }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { products: catalogProducts, loading, error } = useCatalogProducts(isEnglish);
  const products = useMemo(
    () => catalogProducts.map((product, index) => ({ ...product, id: index + 1 })),
    [catalogProducts],
  );

  React.useEffect(() => {
    const savedCat =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedCat")
        : null;
    if (savedCat) setSelectedCat(savedCat);
  }, []);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q") ?? "";
    setSearch(query);
    if (query) setSelectedCat(null);
  }, []);

  React.useEffect(() => {
    if (selectedCat !== null) {
      localStorage.setItem("selectedCat", selectedCat);
    } else {
      localStorage.removeItem("selectedCat");
    }
  }, [selectedCat]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCat ? p.category === selectedCat : true;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCat, products]);

  // Add category icons mapping
  const categoryIcons: { [key: string]: JSX.Element } = {
    "total station": <HiOutlineViewGrid className="text-lg" />,
    theodolite: <HiOutlineCube className="text-lg" />,
    "Digital Level": <HiOutlineScale className="text-lg" />,
    "Alat Curah Hujan": <HiOutlineCloud className="text-lg" />,
    "Alat Deteksi Emas": <HiOutlineSparkles className="text-lg" />,
    "Current Meter": <PiSpeedometerThin className="text-lg" />,
    "Coating Thickness": <FaRulerCombined className="text-lg" />,
    "Auto Level": <LuFileVideo2 className="text-lg" />,
    "Cross Line": <FaGripLines className="text-lg" />,
    "Niton Analyzer": <MdAnalytics className="text-lg" />,
    "Digipass Dwl": <TbPhotoSensor3 className="text-lg" />,
    "Gas Detektor": <MdOutlineGasMeter className="text-lg" />,
    "ECHO SOUNDER": <FiActivity className="text-lg" />,
    "GPS Geodetik": <HiOutlineCube className="text-lg" />,
    "Hammer Test": <GiHammerBreak className="text-lg" />,

  };

  // Get count per category
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [products]);

  const categoryLabel = (category: string) =>
    isEnglish
      ? ({
          "Alat Curah Hujan": "Rain Gauges",
          "Alat Deteksi Emas": "Gold Detectors",
          "Auto Level": "Automatic Levels",
          "Coating Thickness": "Coating Thickness Meters",
          "Cross Line": "Cross-Line Lasers",
          "Current Meter": "Current Meters",
          "Digipass Dwl": "Digital Levels",
          "Digital Level": "Digital Levels",
          "Gas Detektor": "Gas Detectors",
          "ECHO SOUNDER": "Echo Sounders",
          "GPS Geodetik": "Geodetic GPS",
          "Hammer Test": "Hammer Tests",
          "Niton Analyzer": "Niton Analyzers",
          theodolite: "Theodolites",
          "total station": "Total Stations",
        }[category] ?? category)
      : category;

  return (
    <section className="pb-10">
      <div className="mx-auto mb-8 mt-6 flex max-w-7xl flex-col items-center gap-6 px-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-4xl text-center md:text-left">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              {selectedCat ? categoryLabel(selectedCat) : isEnglish ? "Product Catalog" : "Katalog Produk"}
            </span>
          </h1>
          <div className="mt-4 space-y-2">
            {selectedCat ? (
              <>
                <p className="text-sm text-gray-600 md:text-base">
                  {isEnglish ? "Showing" : "Menampilkan"} <span className="font-semibold text-blue-600">{categoryCounts[selectedCat]}</span>{" "}
                  {isEnglish ? "products in" : "produk dalam kategori"}{" "}
                  <span className="font-medium text-gray-800">{categoryLabel(selectedCat)}</span>
                </p>
                <button
                  onClick={() => setSelectedCat(null)}
                  className="rounded-lg px-2 py-1 text-sm font-medium text-blue-600 transition-all hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEnglish ? "← View All Products" : "← Lihat Semua Produk"}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-600 md:text-base">
                {isEnglish ? "Find" : "Temukan"} <span className="font-semibold text-blue-600">{products.length}</span>{" "}
                {isEnglish
                  ? "quality surveying instruments for your professional needs"
                  : "peralatan survei berkualitas untuk kebutuhan profesional Anda"}
              </p>
            )}
          </div>
        </div>

        <div className="relative z-20 shrink-0">
          <button
            type="button"
            aria-expanded={isMenuOpen}
            data-category-filter
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex min-h-11 w-72 max-w-[calc(100vw-2rem)] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FiGrid className="shrink-0 text-blue-600" />
              <span className="truncate">
                {selectedCat ? categoryLabel(selectedCat) : isEnglish ? "All Categories" : "Semua Kategori"}
              </span>
            </span>
            <FiChevronDown className={`shrink-0 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm md:left-auto md:right-0"
              >
                <div className="max-h-[60vh] space-y-1 overflow-y-auto p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCat(null);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-blue-50"
                  >
                    <span className="flex items-center gap-3">
                      <FiGrid className="text-slate-400" />
                      <span className={selectedCat === null ? "font-medium text-blue-600" : "text-slate-700"}>
                        {isEnglish ? "All Categories" : "Semua Kategori"}
                      </span>
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        setSelectedCat(cat);
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-blue-50"
                    >
                      <span className="flex items-center gap-3">
                        {categoryIcons[cat]}
                        <span className={selectedCat === cat ? "font-medium text-blue-600" : "text-slate-700"}>
                          {categoryLabel(cat)}
                        </span>
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {categoryCounts[cat]}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="py-12 text-center text-gray-500">
            {isEnglish ? "Loading product catalog..." : "Memuat katalog produk..."}
          </p>
        ) : error ? (
          <p className="py-12 text-center text-red-600" role="alert">
            {isEnglish ? "Failed to load product catalog:" : "Katalog produk gagal dimuat:"} {error}
          </p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm">
              <FiSearch className="text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">
                {isEnglish ? "No products found" : "Tidak ada produk ditemukan"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isEnglish ? "Try another search term" : "Coba cari dengan kata kunci lain"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/produk${p.slug}`}
                  className="group h-full block overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-300"
                >
                  <div className="flex flex-col h-full">
                    <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                      <div className="relative w-full h-full">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={75}
                          onError={() => {
                            const img = document.getElementById(`product-image-${p.id}`) as HTMLImageElement;
                            if (img) {
                              img.src = '/no-image.jpg';
                              img.style.objectFit = 'contain';
                              img.style.padding = '2rem';
                            }
                          }}
                          id={`product-image-${p.id}`}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {p.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center justify-center bg-white text-black text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                        {isEnglish ? "Buy Now" : "Beli Sekarang"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}