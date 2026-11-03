
import Image from '@/compat/LegacyImage';
import Link from '@/compat/LegacyLink';
import { useState } from 'react';
import HomeProductGrid from '../components/HomeProductGrid';
import { FaShoppingCart, FaTools, FaShippingFast, FaAward, FaBox, FaWrench, FaTimes } from 'react-icons/fa';

interface Props {
  isEnglish?: boolean;
}

export default function Home({ isEnglish = false }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const testimonialImages = [
    '/document/image1.jpg',
    '/document/image2.jpg',
    '/document/image4.jpg',
    '/document/image5.jpg',
    '/document/image6.jpg',
    '/document/image7.jpg',
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 text-center rounded-3xl overflow-hidden my-4 mx-4">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 rounded-3xl"
          style={{
            backgroundImage: "url('/img/theodolite/theodolite.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '0.3'
          }}
        />
        {/* Content with relative positioning */}
        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Logo & Judul */}
          <div className="mb-8">
            <Image
              src="/icon-no-bg.png"
              alt="RAS SURVEY"
              width={300}
              height={300}
              className="mx-auto h-56 w-56 object-contain sm:h-64 sm:w-64"
              priority
            />
            <h2 className="text-lg sm:text-xl text-gray-700 mt-2">
              {isEnglish ? "Trusted Survey Equipment Store" : "Toko Alat Survey Terpercaya"}
            </h2>
          </div>

          {/* Deskripsi */}
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            {isEnglish
              ? "Founded on December 12, 2017, Ras Survey specializes in "
              : "Ras Survey didirikan pada tanggal 12 Desember 2017. Kami bergerak di bidang"}
            <strong className="text-gray-800">
              {isEnglish ? "Sales, Service, and Rentals" : "Sales, Service, Rental"}
            </strong>
            {isEnglish ? " and " : " dan "}
            <strong className="text-gray-800">
              {isEnglish ? "Survey Equipment Calibration" : "Jasa Kalibrasi alat survey"}
            </strong>.
          </p>

          {/* Tombol Aksi Responsif */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <Link
              href="/produk"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-full transition w-full sm:w-auto"
            >
              <FaShoppingCart size={18} />
              {isEnglish ? "Shop Now" : "Belanja Sekarang"}
            </Link>

            <Link
              href="/layanan"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-full transition w-full sm:w-auto"
            >
              <FaTools size={18} />
              {isEnglish ? "Our Services" : "Layanan Jasa"}
            </Link>
          </div>
        </div>
      </section>

      {/* Produk Unggulan */}
      <HomeProductGrid isEnglish={isEnglish} />
      {/* Features */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaAward className="text-4xl text-blue-600" />,
                title: isEnglish ? "Genuine Products" : "Produk Original",
                desc: isEnglish ? "Official warranty and assured quality" : "Garansi resmi & kualitas terjamin",
              },
              {
                icon: <FaShippingFast className="text-4xl text-blue-600" />,
                title: isEnglish ? "Fast Delivery" : "Pengiriman Cepat",
                desc: isEnglish ? "Delivery throughout Indonesia" : "Layanan ke seluruh Indonesia",
              },
              {
                icon: <FaBox className="text-4xl text-blue-600" />,
                title: isEnglish ? "Extensive Stock" : "Stok Lengkap",
                desc: isEnglish ? "Ready to ship for projects of all sizes" : "Siap kirim untuk berbagai proyek",
              },
              {
                icon: <FaTools className="text-4xl text-blue-600" />,
                title: isEnglish ? "Complete Services" : "Layanan Lengkap",
                desc: isEnglish ? "Repairs, calibration, and rentals" : "Service, kalibrasi & rental",
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products & Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEnglish ? "Our Products" : "Produk Kami"}
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <ul className="grid grid-cols-2 gap-4">
                  {[
                    "Total Station",
                    "Digital Theodolite",
                    "Automatic Level",
                    isEnglish ? "GPS Navigation" : "GPS Navigasi",
                    isEnglish ? "Compass" : "Kompas",
                    isEnglish ? "Binoculars" : "Binokular",
                    "Laser Rangefinder",
                    "Digital Altimeter",
                    "Measuring Wheel",
                    isEnglish ? "And more" : "DLL",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="text-blue-600">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEnglish ? "Our Services" : "Layanan Kami"}
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <FaTools className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        {isEnglish ? "Repair & Calibration" : "Service & Kalibrasi"}
                      </h3>
                      <p className="text-gray-600">
                        {isEnglish
                          ? "Equipment repairs and calibration by experienced technicians"
                          : "Perbaikan dan kalibrasi alat ukur oleh teknisi berpengalaman"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaBox className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        {isEnglish ? "Equipment Rental" : "Rental Alat"}
                      </h3>
                      <p className="text-gray-600">
                        {isEnglish
                          ? "Survey equipment rentals for short-term projects"
                          : "Sewa alat survey untuk kebutuhan proyek jangka pendek"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaWrench className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        {isEnglish ? "Technical Consultation" : "Konsultasi Teknis"}
                      </h3>
                      <p className="text-gray-600">
                        {isEnglish
                          ? "Help choosing equipment and finding technical solutions"
                          : "Bantuan pemilihan alat dan solusi teknis"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            {isEnglish ? "Trusted Brands" : "Merek Terpercaya"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              "Topcon",
              "Nikon",
              "Sokkia",
              "Trimble",
              "Garmin",
              "Magellan",
              "Suunto",
              "Horizon",
              "Bushnell",
              "Brunton",
            ].map((brand, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center font-semibold text-gray-700"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            {isEnglish ? "Customer Gallery" : "Dokumentasi Pembeli"}
          </h2>
          <div className="grid grid-cols-3 gap-2 md:gap-6">
            {testimonialImages.map((img, idx) => (
              <div
                key={idx}
                className="cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 aspect-square relative"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Testimonial ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            {/* Desktop close button */}
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <FaTimes size={24} />
            </button>

            {/* Mobile floating close button */}
            <button
              className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <FaTimes size={24} />
            </button>

            <Image
              src={selectedImage}
              alt="Selected testimonial"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
}
