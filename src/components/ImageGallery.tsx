
import { useState } from 'react';
import Image from '@/compat/LegacyImage';
import ProductPoster from '@/components/ProductPoster';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image Display */}
      <div className="relative rounded-lg sm:rounded-xl border shadow-md overflow-hidden">
        <ProductPoster
          name={`${alt} - ${currentIndex + 1}`}
          image={images[currentIndex]}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors z-10 active:bg-black/80"
              aria-label="Previous image"
            >
              <FiChevronLeft size={28} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors z-10 active:bg-black/80"
              aria-label="Next image"
            >
              <FiChevronRight size={28} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/60 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-1.5 sm:gap-2 md:gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:max-h-96 md:pr-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`product-image-watermark relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-full md:h-20 rounded-lg border-2 overflow-hidden transition-all active:opacity-75 ${
                currentIndex === index
                  ? 'border-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
