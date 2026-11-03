import Link from "@/compat/LegacyLink";
import ProductPoster from "@/components/ProductPoster";
import { FiSearch } from "react-icons/fi";

interface Product {
  id: number;
  slug: string;
  name: string;
  heading: string;
  description: string;
  image: string;
  features: string[];
}

interface Props {
  products: Product[];
  isEnglish?: boolean;
}

export default function TheodoliteProductsClient({ products, isEnglish = false }: Props) {
  return (
    <section className="pb-10">
      {/* Article Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-white py-12 md:py-16 px-4 md:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Apa itu Theodolite?
          </h2>
          
          <div className="space-y-6 text-gray-700">
            <p>
              <span className="font-semibold text-blue-600">Theodolite</span> adalah instrumen optik presisi yang digunakan untuk mengukur sudut horizontal dan vertikal dalam pekerjaan survei, konstruksi, dan topografi. Alat ini merupakan perangkat dasar dalam dunia pengukuran yang telah digunakan selama berabad-abad dengan terus mengalami modernisasi teknologi.
            </p>

            {/* Anchor Button */}
            <div className="flex flex-col gap-2 justify-start">
              <a
                href="#theodolite-products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg w-fit"
              >
                {isEnglish ? "View All Theodolite Products" : "Lihat Semua Produk Theodolite"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg w-fit"
              >
                Jasa & Sewa Alat Ukur
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Featured Products - Small */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {products.slice(0, 2).map((p, idx) => (
                <Link
                  key={idx}
                  href={`/produk${p.slug}`}
                  className="group h-full block overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-300"
                >
                  <div className="flex flex-col h-full">
                    <ProductPoster
                      name={p.name}
                      heading={p.heading}
                      image={p.image}
                      features={p.features}
                    />
                    <div className="p-3">
                      <span className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-black transition-all group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
                        {isEnglish ? "View Details" : "Lihat Detail"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="space-y-6 text-gray-700">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Fungsi Utama Theodolite:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Pengukuran Sudut Horizontal:</span> Mengukur sudut azimuth dengan presisi tinggi untuk penentuan arah dan posisi</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Pengukuran Sudut Vertikal:</span> Mengukur sudut elevasi dan depresi untuk penentuan ketinggian</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Penyejajaran Garis:</span> Menentukan dan menyejajaran garis lurus untuk konstruksi bangunan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Triangulasi:</span> Menentukan posisi titik melalui pengukuran sudut dari titik yang diketahui</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Aplikasi dan Kegunaan:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Survei Topografi:</span> Pemetaan dan penentuan posisi titik-titik di lapangan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Konstruksi Bangunan:</span> Pengecekan kesejajaran dan ketepatan sudut struktur bangunan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Survei Perbatasan:</span> Penentuan batas-batas lahan dengan akurasi tinggi</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Pemetaan Jalan:</span> Pembuatan peta dan perencanaan jalur jalan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Investigasi Forensik:</span> Dokumentasi bukti dengan presisi di lokasi kejadian</span>
                </li>
              </ul>
            </div>

            <p id="theodolite-products">
              Theodolite masih menjadi instrumen penting dalam survei profesional meskipun ada teknologi lebih modern seperti Total Station. Keunggulan theodolite terletak pada kesederhanaannya, keandalan, dan biaya yang lebih ekonomis, menjadikannya pilihan utama untuk berbagai aplikasi survei tingkat lanjut.
            </p>
          </div>
        </div>
      </div>
      {/* Title Section */}
      <div className="mb-8 px-4 md:px-8 mt-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Theodolite
          </span>
        </h1>
        <div className="mt-4">
          <p className="text-sm md:text-base text-gray-600">
            {isEnglish ? "Showing" : "Menampilkan"}{" "}
            <span className="font-semibold text-blue-600">{products.length}</span>{" "}
            {isEnglish
              ? "high-quality Theodolites from leading brands"
              : "produk Theodolite berkualitas tinggi dari merek ternama"}
          </p>
          <Link
            href="/produk"
            className="inline-block mt-3 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg text-sm"
          >
            {isEnglish ? "View More Products" : "Lihat Produk Lainnya"}
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm">
              <FiSearch className="text-4xl text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">
                {isEnglish ? "No products available" : "Produk belum tersedia"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8">
            {products.map((p) => (
              <div
                key={p.id}
              >
                <Link
                  href={`/produk${p.slug}`}
                  className="group h-full block overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-300"
                >
                  <div className="flex flex-col h-full">
                    <ProductPoster
                      name={p.name}
                      heading={p.heading}
                      image={p.image}
                      features={p.features}
                      imageId={`product-image-${p.id}`}
                      onImageError={() => {
                        const img = document.getElementById(
                          `product-image-${p.id}`,
                        ) as HTMLImageElement;
                        if (img) {
                          img.src = "/no-image.jpg";
                          img.style.padding = "2rem";
                        }
                      }}
                    />
                    <div className="p-3">
                      <span className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-black transition-all group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
                        {isEnglish ? "Buy Now" : "Beli Sekarang"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
