import { FaTools, FaRulerCombined, FaCogs } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function LayananPage() {
  return (
    <main className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Layanan Kami</h1>
          <div className="h-1 w-16 bg-blue-600 rounded mx-auto"></div>
        </header>

        {/* Jasa Sewa Alat Ukur */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FaRulerCombined className="text-blue-600 text-2xl" />
            <h2 className="text-xl sm:text-2xl font-semibold">Jasa Sewa Alat Ukur</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Kami menyediakan layanan sewa/rental alat-alat survey dan pemetaan seperti Total Station, Theodolite, dan Waterpass. Masa sewa fleksibel dari 1 hari hingga 1 tahun. Pembayaran dilakukan di awal dan alat kami antar dalam kondisi siap pakai.
          </p>
          <ul className="list-disc pl-6 text-sm mb-2 space-y-1">
            <li>Melampirkan PO, KTP, SIUP, TDP, NPWP</li>
            <li>Pembayaran di awal masa sewa</li>
            <li>Kontrak perjanjian</li>
            <li>Jaminan 80% dari harga alat</li>
            <li>Kerusakan dan kehilangan menjadi tanggung jawab penyewa</li>
          </ul>
          <p className="font-semibold mt-4">Alat yang disewakan:</p>
          <ul className="list-decimal pl-6 text-sm space-y-1">
            <li>Total Station</li>
            <li>GNSS Geodetik</li>
            <li>Theodolite (digital & manual)</li>
            <li>Auto Level</li>
          </ul>
          <div className="mt-6">
            <a
              href="https://wa.me/6281295958196?text=Halo%2C%20saya%20tertarik%20dengan%20Jasa%20Sewa%20Alat%20Ukur.%20Bisakah%20Anda%20memberikan%20informasi%20lebih%20lanjut%20tentang%20harga%20sewa%2C%20prosedur%2C%20dan%20ketersediaan%20alat%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#20ba5a] transition-all duration-300 hover:shadow-lg"
            >
              <FaWhatsapp className="w-5 h-5" />
              Jasa Sewa Alat Ukur
            </a>
          </div>
        </section>

        {/* Jasa Service & Kalibrasi */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FaTools className="text-green-600 text-2xl" />
            <h2 className="text-xl sm:text-2xl font-semibold">Jasa Service & Kalibrasi</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Kami menyediakan layanan service berkala dan kalibrasi untuk menjaga akurasi dan kondisi alat Anda. Didukung oleh teknisi profesional dan berpengalaman.
          </p>
          <p className="font-semibold">Alat yang dapat dikalibrasi:</p>
          <ul className="list-disc pl-6 text-sm mb-2 space-y-1">
            <li>Total Station</li>
            <li>Theodolite</li>
            <li>Auto Level</li>
            <li>Hammer Test</li>
            <li>Prisma Poligon</li>
            <li>GPS Geodetik & Garmin</li>
            <li>XRF Niton Analyzer</li>
          </ul>
          <p className="font-semibold mt-4">Estimasi Biaya:</p>
          <ul className="list-decimal pl-6 text-sm space-y-1">
            <li>Total Station Rp. 1.500.000</li>
            <li>Theodolite Rp. 1.000.000</li>
            <li>Auto Level Rp. 500.000</li>
            <li>Hammer Test Rp. 1.000.000</li>
            <li>Prisma Poligon Rp. 350.000</li>
            <li>GPS Geodetik Rp. 3.000.000</li>
            <li>GPS Garmin Rp. 800.000</li>
            <li>XRF Niton Analyzer Rp.--</li>
            <li>Sudah termasuk sertifikat kalibrasi</li>
            <li>Estimasi waktu: ±2 jam jika tanpa kendala</li>
            <li>Antar jemput alat area DKI Jakarta</li>
          </ul>
          <p className="mt-2 text-sm italic">
            Kalibrasi disarankan setiap 6 bulan atau 1000 jam kerja.
          </p>
          <div className="mt-6">
            <a
              href="https://wa.me/6281295958196?text=Halo%2C%20saya%20tertarik%20dengan%20Jasa%20Service%20%26%20Kalibrasi%20alat%20survey.%20Bisakah%20Anda%20memberikan%20informasi%20lebih%20lanjut%20tentang%20prosedur%2C%20waktu%20pengerjaan%2C%20dan%20biaya%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#20ba5a] transition-all duration-300 hover:shadow-lg"
            >
              <FaWhatsapp className="w-5 h-5" />
              Service & Kalibrasi
            </a>
          </div>
        </section>

        {/* Jasa Pengukuran */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FaCogs className="text-indigo-600 text-2xl" />
            <h2 className="text-xl sm:text-2xl font-semibold">Jasa Pengukuran</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Layanan pengukuran profesional dengan tim berpengalaman dan alat yang akurat.
          </p>
          <ul className="list-disc pl-6 text-sm mb-2 space-y-1">
            <li>Vertical Tower BTS</li>
            <li>Pengukuran Cut & Fill</li>
            <li>Pengukuran Kontur Tanah</li>
          </ul>
          <p className="font-semibold mt-4">Estimasi Biaya:</p>
          <ul className="list-decimal pl-6 text-sm space-y-1">
            <li>Vertical Tower BTS: Rp. 1.000.000</li>
            <li>Cut & Fill: Rp. 3.000.000</li>
            <li>Kontur Tanah: Rp. 2.500.000</li>
          </ul>
          <p className="mt-2 text-sm italic">* Harga dapat berubah sesuai kesepakatan</p>
          <div className="mt-6">
            <a
              href="https://wa.me/6281295958196?text=Halo%2C%20saya%20tertarik%20dengan%20Jasa%20Pengukuran.%20Bisakah%20Anda%20memberikan%20informasi%20lebih%20lanjut%20tentang%20layanan%2C%20harga%2C%20dan%20timeline%20pengerjaan%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#20ba5a] transition-all duration-300 hover:shadow-lg"
            >
              <FaWhatsapp className="w-5 h-5" />
              Jasa Pengukuran
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
