"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination, Zoom } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./slideshow.css";
import "swiper/css/zoom";

import { ProductImageCustom } from "../image/ProductImage";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100vw",
          height: "500px",
        }}
        pagination={true}
        zoom={true}
        autoplay={{
          delay: 10500,
        }}
        modules={[FreeMode, Autoplay, Pagination, Zoom]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <div className="swiper-zoom-container">
              <ProductImageCustom
                src={image}
                width={600}
                height={500}
                alt={title}
                className="object-fill"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
