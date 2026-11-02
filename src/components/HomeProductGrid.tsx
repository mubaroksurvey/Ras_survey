
import Image from '@/compat/LegacyImage';
import Link from '@/compat/LegacyLink';
import { useMemo } from 'react';
import { useCatalogProducts } from '@/hooks/useCatalogProducts';

interface Props {
  isEnglish?: boolean;
}

export default function HomeProductGrid({ isEnglish = false }: Props) {
  const { products, loading, error } = useCatalogProducts(isEnglish);
  const totalStationProducts = useMemo(
    () =>
      products
        .filter((product) => product.category === 'total station')
        .map((product, index) => ({ ...product, id: index + 1 })),
    [products],
  );

  return (
    <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
          {isEnglish ? 'Total Station Products' : 'Produk Total Station'}
        </h2>

        {/* Grid Produk */}
        {loading ? <p className="col-span-full text-center text-gray-500">{isEnglish ? 'Loading products...' : 'Memuat produk...'}</p> : null}
        {error ? <p className="col-span-full text-center text-red-600" role="alert">{isEnglish ? 'Failed to load product catalog:' : 'Katalog produk gagal dimuat:'} {error}</p> : null}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {totalStationProducts.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              href={`/produk${p.slug}`}
              className="group h-full block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex flex-col h-full">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center justify-center bg-white text-black text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                    {isEnglish ? 'Buy Now' : 'Beli Sekarang'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tombol Lihat Semua */}
        <div className="mt-8 text-center">
          <Link
            href="/produk"
            className="inline-flex items-center justify-center bg-transparent text-black text-sm font-medium px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition-colors"
          >
            {isEnglish ? 'View All Products' : 'Lihat Semua Produk'}
          </Link>

        </div>
      </div>
    </section>
  );
}
