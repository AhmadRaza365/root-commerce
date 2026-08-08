'use client';
import Image from 'next/image';
import Slider from 'react-slick';
import { Settings } from '@/types/Settings';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { BASE_HERO_SLIDER_SETTINGS } from '@/components/hero-sections/heroSliderDefaults';
import Link from 'next/link';

type Props = {
  slides: Settings['homeSlider'];
  contentPosition?: 'top' | 'center' | 'bottom';
  hideArrows?: boolean;
};

function CenteredContentSliderHero({
  slides,
  contentPosition = 'center',
  hideArrows = false,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={`absolute top-1/2 right-2 sm:right-4 z-2 flex items-center justify-center text-base-100 bg-base-100/20 hover:bg-base-100/50 w-9 h-9 rounded-full cursor-pointer`}
        onClick={onClick}
      >
        <GoArrowRight size={24} />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className={`absolute top-1/2 left-2 sm:left-4 z-2 flex items-center justify-center text-base-100 bg-base-100/20 hover:bg-base-100/50 w-9 h-9 rounded-full cursor-pointer`}
        onClick={onClick}
      >
        <GoArrowLeft size={24} />
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <Slider
        {...BASE_HERO_SLIDER_SETTINGS}
        dots={true}
        arrows={!hideArrows}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        appendDots={(dots) => (
          <div
            style={{
              backgroundColor: 'transparent',
              transform: 'translateY(-36px)',
            }}
          >
            <ul className="centered-slider-dots-wrap">{dots}</ul>
          </div>
        )}
        customPaging={(i) => (
          <div className="w-2.5 h-2.5 bg-base-100 aspect-square rounded-full"></div>
        )}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            heading={slide.heading}
            text={slide.text}
            image={slide.image}
            buttonText={slide.buttonText}
            buttonLink={slide.buttonLink}
            contentPosition={contentPosition}
          />
        ))}
      </Slider>
      <style jsx global>{`
        .centered-slider-dots-wrap {
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .centered-slider-dots-wrap > li {
          margin: 0px;
          padding: 0px;
          width: 12px;
          height: 12px;
        }

        .centered-slider-dots-wrap > li:not(.slick-active) {
          opacity: 0.35;
          transform: scale(0.8);
        }
      `}</style>
    </section>
  );
}

function Slide({
  heading,
  text,
  image,
  buttonText,
  buttonLink,
  contentPosition = 'center',
}: {
  heading: string;
  text: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  contentPosition?: 'top' | 'center' | 'bottom';
}) {
  return (
    <section className="w-full h-[85vh] relative group">
      <Image src={image} alt={heading} fill className="object-cover w-full h-full" />
      <section
        className={`w-full z-50! h-full absolute bg-base-content/50 text-base-100 flex px-5 sm:px-10 xl:px-16 ${
          contentPosition === 'top'
            ? 'items-start pt-24'
            : contentPosition === 'bottom'
              ? 'items-end pb-24'
              : 'items-center'
        }`}
      >
        <section
          className={`w-full max-w-xl flex flex-col gap-y-4 xl:gap-y-5 items-center mx-auto`}
        >
          {!!text && (
            <p className={`capitalize text-lg md:text-lg font-normal text-center`}>{text}</p>
          )}
          {!!heading && (
            <h2 className={`text-xl md:text-5xl font-medium text-center font-secondary`}>
              {heading}
            </h2>
          )}
          {!!buttonText && (
            <Link className="btn btn-soft btn-md btn-wide" href={buttonLink || '/shop'}>
              {buttonText}
            </Link>
          )}
        </section>
      </section>
    </section>
  );
}

export default CenteredContentSliderHero;
