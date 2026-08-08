import Image from 'next/image';
import Link from 'next/link';

type Props = {
  tagline: string;
  heading: string[];
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  productImage: string;
  productImageAlt: string;
  className?: string;
};

export default function FullWidthProductBanner({
  tagline,
  heading,
  buttonText,
  buttonLink,
  backgroundImage,
  productImage,
  productImageAlt,
  className = '',
}: Props) {
  return (
    <section
      className={`container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-12 sm:mt-16 lg:mt-24 ${className}`}
    >
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/70 rounded-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center px-5 py-8 sm:px-8 sm:py-10 md:py-12 lg:pl-12 xl:pl-20">
          <div className="text-base-100 flex flex-col">
            <p className="text-sm md:text-base mb-2">{tagline}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-bold mb-6 sm:mb-8 lg:mb-16 leading-tight">
              {heading.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < heading.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <Link
              href={buttonLink}
              className="w-fit font-semibold rounded-full px-6 py-2.5 bg-base-content text-base-100 text-sm"
            >
              {buttonText}
            </Link>
          </div>

          <div className="hidden md:flex w-[300px] lg:w-[380px] xl:w-[420px] flex-shrink-0 ml-auto">
            <Image
              src={productImage}
              alt={productImageAlt}
              width={500}
              height={500}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
