import ProductCard from '@/components/cards/ProductCard';
import ShopHero from '@/components/ShopHero';
import Pagination from '@/components/ui/Pagination';
import SortDropdown from '@/components/ui/SortDropdown';
import { siteData } from '@/data/siteData';
import axoisAPI from '@/network/axios';
import { Product } from '@/types/Product';
import { Metadata } from 'next';
import React from 'react';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Search',
  robots: 'index, follow',
  openGraph: {
    images: siteData.siteMetaImage,
    type: 'website',
    title: `Search | ${siteData.name}`,
    siteName: siteData.name,
    locale: 'en_US',
    description: siteData.description,
    url: `${siteData.siteURL}`,
  },
  twitter: {
    card: 'summary',
    creator: siteData.author,
    title: `Search | ${siteData.name}`,
    description: siteData.description,
    creatorId: siteData.socialHandle,
    images: siteData.siteMetaImage,
    site: siteData.name,
  },
};

export default async function CategoryPage({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Promise<{ query: string }>;
}) {
  const { pageNumber, sort, pageSize } = await searchParams;
  const { query } = await params;
  const pageUrl = `/search/${query}`;

  const productsRes = await axoisAPI.get(
    `/api/products/search?query=${query}&pageNumber=${pageNumber || 1}&sort=${sort || 'default'}&pageSize=${pageSize || 20}`
  );

  const products: Product[] = productsRes.data.data;
  const totalPages = productsRes.data.totalPages;

  return (
    <main>
      <ShopHero
        title="Shop"
        breadcrumbs={[
          {
            name: 'Home',
            slug: '/',
          },
          {
            name: 'Products',
            slug: '/shop',
          },
        ]}
        backgroundImage="/images/shop-hero-bg.jpg"
      />

      <section className="container px-5 py-10 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-base font-normal text-base-content ">
          We found <span className="font-bold">{products.length}</span> products available for you.
        </p>
        <SortDropdown currentPage={`/search/${query}`} selectedSort={sort || ''} />
      </section>

      <section className="container px-5 py-10 mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 xl:gap-x-6 gap-y-8 xl:gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.uuid}
            image={product.images[0]}
            discountPrice={product.discountPrice || 0}
            isNew={product.showIsNew}
            isOnSale={product.isOnSale}
            isOutOfStock={product.isOutOfStock}
            price={product.basePrice}
            slug={product.slug}
            title={product.title}
          />
        ))}

        <section className="col-span-full flex justify-center">
          <Pagination
            currentPageUrl={pageUrl}
            currentPageNumber={parseInt(pageNumber || '1')}
            totalPages={totalPages}
            currentSort={sort || ''}
          />
        </section>
      </section>
    </main>
  );
}
