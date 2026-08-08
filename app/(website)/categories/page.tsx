import ShopHero from '@/components/ShopHero';
import { siteData } from '@/data/siteData';
import axoisAPI from '@/network/axios';
import { ProductCategory } from '@/types/Product';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Categories',
  robots: 'index, follow',
  openGraph: {
    images: siteData.siteMetaImage,
    type: 'website',
    title: `Categories | ${siteData.name}`,
    siteName: siteData.name,
    locale: 'en_US',
    description: siteData.description,
    url: `${siteData.siteURL}/categories`,
  },
  twitter: {
    card: 'summary',
    creator: siteData.author,
    title: `Categories | ${siteData.name}`,
    description: siteData.description,
    creatorId: siteData.socialHandle,
    images: siteData.siteMetaImage,
    site: siteData.name,
  },
};

export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export default async function CategoriesPage() {
  const categoriesRes = await axoisAPI.get('/api/categories');
  const categories: ProductCategory[] = categoriesRes.data.data;

  return (
    <main>
      <ShopHero
        title="Categories"
        breadcrumbs={[
          {
            name: 'Home',
            slug: '/',
          },
          {
            name: 'Categories',
            slug: '/categories',
          },
        ]}
        backgroundImage="/images/shop-hero-bg.jpg"
      />

      <section className="container px-5 py-10 my-14 mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 xl:gap-x-6 gap-y-8 xl:gap-y-10">
        {categories.map((category, index) => {
          const isBigCategory = index % 3 === 0;
          const isFromLastTwoCategories = index >= categories.length - 2;

          return (
            <section
              key={category.uuid}
              className={`w-full h-full flex flex-col group relative rounded overflow-hidden ${
                isFromLastTwoCategories
                  ? 'col-span-2 row-span-2 md:row-span-1 aspect-square md:aspect-video'
                  : isBigCategory
                    ? 'col-span-2 row-span-2 aspect-square'
                    : 'col-span-2 md:col-span-1 row-span-2 md:row-span-1 aspect-square'
              }`}
            >
              <section className="w-full h-auto grow relative overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-300"
                />
              </section>
              <section className="w-full h-auto py-4">
                <h3 className="text-xl md:text-2xl font-medium text-base-content text-center">
                  {category.name}{' '}
                  {category.showNewTag && <span className="text-secondary font-normal">New</span>}
                </h3>
              </section>
              <Link
                href={`/categories/${category.slug}`}
                className="absolute top-0 left-0 w-full h-full"
              />
            </section>
          );
        })}
      </section>
    </main>
  );
}
