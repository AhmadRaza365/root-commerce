import { formatPrice } from '@/lib/formatePrice';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  image: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number;
  isOnSale: boolean;
  isOutOfStock: boolean;
  isNew: boolean;
};

function ProductCard({
  title,
  slug,
  image,
  discountPrice,
  price,
  isNew,
  isOnSale,
  isOutOfStock,
}: Props) {
  return (
    <section className="w-full h-fit group cursor-pointer relative shadow-lg bg-base-100 border border-base-content/5 rounded-box overflow-hidden">
      <section className="w-full aspect-3/4 relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-110 transition-all duration-300"
        />
      </section>

      <section className="px-2 py-3">
        {isOnSale && discountPrice ? (
          <div className="flex items-center gap-2 justify-center">
            <p className="text-xs md:text-sm font-normal text-base-content line-through">
              {formatPrice(price)}
            </p>
            <p className="text-sm md:text-base font-bold text-primary">
              {formatPrice(discountPrice)}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <p className="text-sm md:text-base font-bold text-base-content">{formatPrice(price)}</p>
          </div>
        )}
        <h3
          className="text-sm md:text-base font-medium text-base-content text-center mt-2 truncate"
          title={title}
          aria-label={title}
        >
          <Link
            href={slug}
            className="hover:text-primary group-hover:text-primary transition-all duration-300"
          >
            {title}
          </Link>
        </h3>
      </section>

      {isOutOfStock || isNew || isOnSale ? (
        <section className="absolute top-3 left-3 flex flex-col items-start gap-1 h-fit w-fit">
          {isOutOfStock && (
            <div className="bg-error text-error-content text-[10px] md:text-xs font-medium px-2 py-1 rounded-selector">
              <span>Out of Stock</span>
            </div>
          )}
          {isNew && (
            <div className="bg-primary text-primary-content text-[10px] md:text-xs font-medium px-2 py-1 rounded-selector">
              <span>New</span>
            </div>
          )}
          {isOnSale && (
            <div className="bg-primary text-primary-content text-[10px] md:text-xs font-medium px-2 py-1 rounded-selector">
              <span>{(((price - discountPrice) / price) * 100).toFixed(0)}% Off</span>
            </div>
          )}
        </section>
      ) : null}

      <Link
        href={`/product/${slug}`}
        className="w-full h-full absolute top-0 left-0 z-10 appearance-none bg-transparent opacity-0"
        title={title}
        aria-label={title}
      >
        View Product Details
      </Link>
    </section>
  );
}

export default ProductCard;
