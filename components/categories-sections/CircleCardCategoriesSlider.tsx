'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductCategory } from '@/types/Product';

type Props = {
  categories: ProductCategory[];
  title: string;
};

function CircleCardCategoriesSlider({ categories, title }: Props) {
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
    <section className="w-full py-14 xl:py-32 px-5 sm:px-8 2xl:px-16 grid grid-cols-10 items-center gap-y-10 md:gap-x-10 2xl:gap-x-20 md:container md:mx-auto">
      <section className="col-span-full flex items-center justify-center w-full pb-2.5 lg:pb-5">
        <h2 className="text-2xl lg:text-4xl font-bold font-secondary text-center">{title}</h2>
      </section>

      <section className="col-span-full">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={
            windowWidth > 1280
              ? 6
              : windowWidth > 1024
                ? 5
                : windowWidth > 740
                  ? 3
                  : windowWidth > 640
                    ? 3
                    : 2
          }
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={2500}
          arrows={false}
        >
          {categories.map((category) => (
            <CategorySlide key={category.uuid} category={category} />
          ))}
        </Slider>
      </section>
    </section>
  );
}

function CategorySlide({ category }: { category: ProductCategory }) {
  return (
    <section className="px-1 xl:px-2">
      <Link
        href={`/categories/${category.slug}`}
        className="w-full group cursor-pointer bg-transparent flex flex-col gap-6"
      >
        <section className="w-full aspect-square rounded-full relative overflow-hidden bg-base-300">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover w-full h-full object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        </section>
        <section className="w-full h-fit px-6 py-0 flex items-center justify-center gap-3">
          <h3 className="text-xl text-base-content text-center">{category.name}</h3>
        </section>
      </Link>
    </section>
  );
}

export default CircleCardCategoriesSlider;
