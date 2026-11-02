import Link from '@/compat/LegacyLink';
import { FaRegBuilding, FaHandshake, FaFlagCheckered } from 'react-icons/fa';

export const metadata = {
  title: 'Tentang Kami | Ras Survey',
  description:
    'Profil Ras Survey sebagai penyedia alat survey, kalibrasi, rental, dan pelatihan sejak 2017.',
};

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800">

      {/* Konten Utama */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ras Survey</h2>
          <div className="h-1 w-16 bg-blue-500 rounded"></div>
        </div>

        <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700">
          <p><strong>Ras Survey</strong> didirikan pada tanggal 12 Desember 2017, bisnis inti perusahaan kami adalah bergerak di bidang Sales, Service, Rental dan Jasa Kalibrasi alat survey.</p>
          <p>Perkembangan bisnis ini sejalan dengan pembangunan infrastruktur serta pertambangan minyak dan gas, kehutanan, perkebunan, projek swasta dan pemerintahan.</p>
          <p>Kegiatan survey pada saat ini mengharuskan kita memilih perangkat kerja yang didukung sistem komputer, pengolahan dokumen, komunikasi, multimedia, serta rekayasa industri.</p>
          <p>Menyadari kebutuhan tersebut, <strong>Ras Survey</strong> siap membantu dan melaksanakan tugas pekerjaan untuk memenuhi segala kebutuhan konsumen alat survey.</p>
          <p>Kami hadir di depan Anda, memberikan solusi terbaik untuk pemilihan kebutuhan alat survey Anda.</p>
          <p>Sebagai perusahaan dengan moto <span className="italic font-semibold">&quot;KEPERCAYAAN ANDA ADALAH MODAL UTAMA KAMI&quot;</span>, kami akan selalu menjaga dan menjunjung tinggi kepercayaan setiap pelanggan.</p>
          <p><strong>Ras Survey</strong> akan menjadi pusat pelayanan terbaik di bidang alat survey dan pemetaan di Indonesia, mengembangkan dan meningkatkan pengetahuan serta keterampilan pelanggan kami.</p>
          <p>Untuk meningkatkan daya saing di dunia bisnis lokal dan global, kami akan selalu mendukung program pemerintah dalam pembangunan infrastruktur.</p>
          <p>Demikian profil yang kami hadirkan, semoga mendapat kepercayaan dan kerjasama yang saling menguntungkan.</p>
        </div>

        {/* 3 Pilar Perusahaan */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <FaRegBuilding className="text-blue-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold mb-1">Profesional</h3>
            <p className="text-sm text-gray-600">
              Tim bersertifikat & berpengalaman di bidang alat survey.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <FaHandshake className="text-blue-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold mb-1">Kepercayaan</h3>
            <p className="text-sm text-gray-600">
              Selalu menjaga hubungan jangka panjang dengan pelanggan.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition bg-white">
            <FaFlagCheckered className="text-blue-600 text-4xl mb-3" />
            <h3 className="text-lg font-semibold mb-1">Komitmen</h3>
            <p className="text-sm text-gray-600">
              Berkomitmen mendukung pembangunan nasional melalui alat survey.
            </p>
          </div>
        </div>

        {/* CTA kembali ke Home */}
        <div className="mt-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-full shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6m0 0h6m-6 0H7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
