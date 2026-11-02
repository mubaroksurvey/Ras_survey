import Link from "@/compat/LegacyLink";
import Image from "@/compat/LegacyImage";
import { FiSearch } from "react-icons/fi";

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
}

interface Props {
  products: Product[];
  isEnglish?: boolean;
}

export default function TotalStationProductsClient({ products, isEnglish = false }: Props) {

  return (
    <section className="pb-10">
      {/* Article Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-white py-12 md:py-16 px-4 md:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Apa itu Total Station?
          </h2>
          
          <div className="space-y-6 text-gray-700">
            <p>
              <span className="font-semibold text-blue-600">Total Station</span> adalah instrumen survei elektronik yang mengintegrasikan teknologi theodolite digital dengan Electronic Distance Measurement (EDM) atau pengukur jarak elektronik. Alat ini merupakan evolusi dari peralatan survei tradisional yang menggabungkan beberapa fungsi dalam satu perangkat canggih.
            </p>

            {/* Anchor Button */}
            <div className="flex flex-col gap-2 justify-start">
              <a
                href="#total-station-products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg w-fit"
              >
                {isEnglish ? "View All Total Station Products" : "Lihat Semua Produk Total Station"}
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
                    <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                      <div className="relative w-full h-full">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          quality={75}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                          {p.name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                      <span className="mt-3 inline-flex items-center justify-center bg-white text-black text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                        {isEnglish ? "View Details" : "Lihat Detail"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="space-y-6 text-gray-700">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Fungsi Utama Total Station:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Pengukuran Sudut:</span> Mengukur sudut horizontal dan vertikal dengan presisi tinggi (akurasi hingga 1 detik)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Pengukuran Jarak:</span> Menggunakan cahaya laser atau inframerah untuk mengukur jarak hingga 5 km dengan atau tanpa prisma</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Perhitungan Otomatis:</span> Menghitung koordinat (X, Y, Z) dan ketinggian secara otomatis</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><span className="font-semibold">Penyimpanan Data:</span> Menyimpan data hasil pengukuran secara digital untuk analisis lebih lanjut</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Aplikasi dan Kegunaan:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Survei Topografi:</span> Pemetaan kontur dan relief permukaan tanah</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Konstruksi:</span> Penempatan dan pengecekan bangunan dengan presisi tinggi</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Survei Kadastral:</span> Pengukuran batas-batas dan penentuan luas tanah</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Pemetaan Lahan:</span> Pembuatan peta detail untuk perencanaan pembangunan</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><span className="font-semibold">Arkeologi:</span> Dokumentasi dan pengukuran situs arkeologi</span>
                </li>
              </ul>
            </div>

            <p id="total-station-products">
              Total Station telah menjadi standar industri dalam dunia survei dan konstruksi modern karena efisiensi, akurasi, dan kemampuannya untuk menghemat waktu pekerjaan lapangan. Dengan teknologi yang terus berkembang, Total Station kini dilengkapi dengan fitur-fitur seperti GPS, kamera digital, dan konektivitas wireless untuk meningkatkan produktivitas.
            </p>
          </div>
        </div>
      </div>
      {/* Title Section */}
      <div className="mb-8 px-4 md:px-8 mt-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Total Station
          </span>
        </h1>
        <div className="mt-4">
          <p className="text-sm md:text-base text-gray-600">
            {isEnglish ? "Showing" : "Menampilkan"}{" "}
            <span className="font-semibold text-blue-600">{products.length}</span>{" "}
            {isEnglish
              ? "high-quality Total Stations from leading brands"
              : "produk Total Station berkualitas tinggi dari merek ternama"}
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
                            const img = document.getElementById(
                              `product-image-${p.id}`
                            ) as HTMLImageElement;
                            if (img) {
                              img.src = "/no-image.jpg";
                              img.style.objectFit = "contain";
                              img.style.padding = "2rem";
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
