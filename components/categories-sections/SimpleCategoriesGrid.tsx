import { ProductCategory } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  categories: ProductCategory[];
  title: string;
  buttonText: string;
  buttonLink: string;
};

function SimpleCategoriesGrid({ categories, title, buttonText, buttonLink }: Props) {
  return (
    <section className="w-full py-14 xl:py-14 px-5 sm:px-8 2xl:px-16 grid grid-cols-2 lg:grid-cols-3 items-center gap-3 lg:gap-8 md:container md:mx-auto">
      <section className="col-span-full flex items-center justify-center w-full pb-2.5 lg:pb-5">
        <h2 className="text-2xl lg:text-4xl font-bold font-secondary text-center">{title}</h2>
      </section>

      {categories.map((category, index) => {
        return (
          <Link
            key={index}
            href={`/categories/${category.slug}`}
            className="bg-base-300 aspect-4/3 w-full relative rounded-box overflow-hidden group cursor-pointer"
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
      {buttonText && buttonLink && (
        <section className="col-span-full flex items-center justify-center w-full pt-5 lg:pt-10">
          <Link href={buttonLink} className="btn btn-outline btn-wide">
            {buttonText}
          </Link>
        </section>
      )}
    </section>
  );
}

export default SimpleCategoriesGrid;
