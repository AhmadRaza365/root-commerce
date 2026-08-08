'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';

type Props = {
  images: string[];
  alt: string;
};

function ProductImagesSlider({ images, alt }: Props) {
  return (
    <section className="">
      <Slider
        dots={true}
        infinite={true}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={2500}
        arrows={false}
        customPaging={(i) => (
          <div className="w-20 h-20 relative">
            <Image
              src={images[i]}
              alt={`${alt} thumbnail ${i}`}
              fill
              className="object-cover rounded-box"
            />
          </div>
        )}
        dotsClass="slick-dots custom-thumb"
      >
        {images.map((image, index) => (
          <section key={index} className="relative w-full aspect-3/4">
            <Image src={image} alt={alt} fill className="object-contain object-center" />
          </section>
        ))}
      </Slider>
    </section>
  );
}

export default ProductImagesSlider;
