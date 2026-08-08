import Link from 'next/link';
import React from 'react';
import { RxDividerHorizontal } from 'react-icons/rx';

type Props = {
  title: string;
  breadcrumbs: {
    name: string;
    slug: string;
  }[];
  backgroundImage?: string;
};

function ShopHero({ title, breadcrumbs }: Props) {
  return (
    <section className="w-full h-24 lg:h-40 mt-5 relative flex items-center justify-center">
      <section className="w-full h-full absolute flex items-start justify-center flex-col gap-4 md:gap-8 container px-5">
        <h1 className="text-3xl md:text-5xl font-butler">{title}</h1>
        <section className="flex items-center gap-2">
          {breadcrumbs.map((item, index) => (
            <div
              key={index}
              className="text-base-content/70 last:text-base-content flex items-center gap-2 text-sm md:text-base"
            >
              <Link
                href={item.slug}
                className="hover:text-secondary hover:underline underline-offset-4 transition-all duration-300"
              >
                {item.name}
              </Link>
              {index !== breadcrumbs.length - 1 && <RxDividerHorizontal size={20} />}
            </div>
          ))}
        </section>
      </section>
    </section>
  );
}

export default ShopHero;
