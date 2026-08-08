'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { Settings } from '@/types/Settings';
import { useRouter } from 'next/navigation';
import { BASE_HERO_SLIDER_SETTINGS } from '@/components/hero-sections/heroSliderDefaults';

type Props = {
  slides: Settings['homeSlider'];
};

function ClassicHeroSlider({ slides }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={`absolute top-1/2 right-2 sm:right-4 z-[2] w-fit h-fit flex items-center justify-center text-black opacity-50 hover:opacity-100 focus:opacity-100 cursor-pointer`}
        onClick={onClick}
      >
        <IoIosArrowDroprightCircle size={32} />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={`absolute top-1/2 left-2 sm:left-4 z-[2] w-fit h-fit flex items-center justify-center text-black opacity-50 hover:opacity-100 focus:opacity-100 cursor-pointer`}
        onClick={onClick}
      >
        <IoIosArrowDropleftCircle size={32} />
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <Slider
        {...BASE_HERO_SLIDER_SETTINGS}
        dots={false}
        arrows={true}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            heading={slide.heading}
            text={slide.text}
            image={slide.image}
            buttonText={slide.buttonText}
            buttonLink={slide.buttonLink}
            isSingleSlide={slides.length === 1}
          />
        ))}
      </Slider>
    </section>
  );
}

function Slide({
  heading,
  text,
  image,
  buttonText,
  buttonLink,
  isSingleSlide = false,
}: {
  heading: string;
  text: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isSingleSlide?: boolean;
}) {
  const router = useRouter();

  return (
    <section className="w-full h-[85vh] relative group">
      <Image src={image} alt={heading} fill className="object-cover w-full h-full" />
      <section className="w-full h-full absolute bg-base-content/50 text-base-100 flex items-center px-5 sm:px-10 xl:px-16">
        <section
          className={`w-full max-w-xl flex flex-col gap-y-4 xl:gap-y-5 ${isSingleSlide ? 'items-center mx-auto' : 'items-center md:items-start mx-auto md:mx-0'}`}
        >
          {!!heading && (
            <h2
              className={`text-xl md:text-3xl font-medium xl:leading-7 ${isSingleSlide ? 'text-center' : ''}`}
            >
              {heading}
            </h2>
          )}
          {!!text && (
            <p
              className={`capitalize text-lg md:text-lg font-normal ${isSingleSlide ? 'text-center' : 'text-center md:text-left'}`}
            >
              {text}
            </p>
          )}
          {!!buttonText && (
            <button
              className="btn btn-primary btn-md btn-wide"
              onClick={() => {
                router.push(buttonLink || '/shop');
              }}
            >
              {buttonText}
            </button>
          )}
        </section>
      </section>
    </section>
  );
}

export default ClassicHeroSlider;
