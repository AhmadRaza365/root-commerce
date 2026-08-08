import { ProductCategory } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  categories: ProductCategory[];
};

function CategoriesBentoGrid({ categories }: Props) {
  return (
    <section className="w-full py-14 xl:py-14 px-5 sm:px-8 2xl:px-16 grid grid-cols-12 items-center gap-3 lg:gap-4 md:container md:mx-auto">
      {categories.map((category, index) => {
        const isLarge = index === 0 || index % 4 === 3 || index % 4 === 0;

        return (
          <Link
            key={index}
            href={`/categories/${category.slug}`}
            className={`col-span-full bg-base-300 w-full h-60 lg:h-72 relative rounded-box overflow-hidden group cursor-pointer ${
              isLarge ? 'lg:col-span-7' : 'lg:col-span-5'
            }`}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover w-full h-full object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
            <section className="absolute top-0 left-0 w-full h-full pl-2 lg:pl-6 py-3 lg:py-8 flex flex-col justify-end gap-3">
              <h3 className="text-lg lg:text-2xl lg:font-medium leading-6 text-base-100 hover:text-primary group-hover:text-primary transition-colors duration-500 ease-in-out">
                {category.name}
              </h3>
            </section>
          </Link>
        );
      })}
    </section>
  );
}

export default CategoriesBentoGrid;
