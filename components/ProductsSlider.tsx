'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './cards/ProductCard';
import Link from 'next/link';
import { Product } from '@/types/Product';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Props = {
  products: Product[];
  title?: string | React.ReactNode;
};

function ProductsSlider({ title = 'Best Selling Products', products }: Props) {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="w-full py-10 container mx-auto">
      <h2 className="text-3xl md:text-4xl font-medium text-base-content text-center">{title}</h2>
      <section className="w-full">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={windowWidth > 1280 ? 5 : windowWidth > 740 ? 4 : windowWidth > 640 ? 3 : 2}
          slidesToScroll={2}
          autoplay={true}
          autoplaySpeed={2500}
          arrows={false}
        >
          {products.map((product) => (
            <section className="px-1 sm:px-3 py-8 xl:py-14" key={product.uuid}>
              <ProductCard
                image={product.images[0]}
                discountPrice={product.discountPrice || 0}
                isNew={product.showIsNew || false}
                isOnSale={product.isOnSale || false}
                isOutOfStock={product.isOutOfStock || false}
                price={product.basePrice || 0}
                slug={product.slug}
                title={product.title}
              />
            </section>
          ))}
        </Slider>
      </section>
      <section className="w-full flex items-center justify-center">
        <Link href="/products" className="btn btn-primary btn-lg font-normal">
          View All Products
        </Link>
      </section>
    </section>
  );
}

export default ProductsSlider;
