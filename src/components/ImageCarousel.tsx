import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface ImageCarouselProps {
  images: Array<{ id: string; url: string; alt: string; caption?: string }>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  if (!images || images.length === 0) return null;
  return (
    <Swiper
      modules={[Pagination]}
      loop={false}
      autoplay={false as any}
      pagination={false as any}
      spaceBetween={24}
      slidesPerView={images.length >= 3 ? 3 : images.length}
      className="rounded-2xl shadow-lg bg-white"
      allowTouchMove={false}
    >
      {images.map((img) => (
        <SwiperSlide key={img.id}>
          <div className="flex flex-col items-center">
            <img
              src={img.url}
              alt={img.alt}
              className="w-full max-h-96 object-contain rounded-2xl transition-transform duration-300 hover:scale-105 shadow-md"
            />
            {img.caption && (
              <div className="text-center text-sm text-gray-600 mt-2 italic animate-elegant-fadeIn">
                {img.caption}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
