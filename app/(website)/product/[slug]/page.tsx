import ProductImagesSlider from '@/components/ProductImagesSlider';
import ProductsSlider from '@/components/ProductsSlider';
import ProductVariants from '@/components/ProductVariants';
import { siteData } from '@/data/siteData';
import axoisAPI from '@/network/axios';
import { Product, ProductCategory } from '@/types/Product';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const productRes = await axoisAPI.get(`/api/products/get-product-by-slug?slug=${slug}`);
  const product: Product = productRes.data.data.product;

  return {
    title: `${product.title}`,
    robots: 'index, follow',
    openGraph: {
      images: product.images[0],
      type: 'website',
      title: `${product.title}`,
      siteName: siteData.name,
      locale: 'en_US',
      description: siteData.description,
      url: `${siteData.siteURL}/product/${slug}`,
    },
    twitter: {
      card: 'summary',
      creator: siteData.author,
      title: `${product.title}`,
      description: siteData.description,
      creatorId: siteData.socialHandle,
      images: product.images[0],
      site: siteData.name,
    },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const productRes = await axoisAPI.get(`/api/products/get-product-by-slug?slug=${slug}`);
  const product: Product = productRes.data.data.product;
  const relatedProducts: Product[] = productRes.data.data.relatedProducts;
  const categories: ProductCategory[] = productRes.data.data.categories;

  return (
    <main>
      <section className="container px-5 py-10 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="w-full">
          <ProductImagesSlider alt={product.title} images={product.images} />
        </section>
        <section className="w-full h-fit mt-28 md:mt-0">
          <section className="flex items-center justify-start flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.uuid}
                href={`/categories/${category.slug}`}
                className="badge badge-soft badge-primary rounded-box"
              >
                {category.name}
              </Link>
            ))}

            {product.showIsNew && <div className="badge badge-soft badge-success">New</div>}
            {product.isOnSale && product.discountPrice && (
              <div className="badge badge-soft badge-secondary">
                {(((product.basePrice - product.discountPrice) / product.basePrice) * 100).toFixed(
                  0
                )}
                % Off
              </div>
            )}
            {product.isOutOfStock && (
              <div className="badge badge-soft badge-error">Out of Stock</div>
            )}
          </section>

          <h1 className="text-2xl font-bold text-base-content my-3">{product.title}</h1>
          <p className="text-base font-normal leading-6 text-base-content/80 my-3">
            {product.shortDescription}
          </p>
          <section>
            <ProductVariants
              displayType="radio"
              product={product}
              showPerUnitPriceText={
                categories.find((category) => category.name?.toLowerCase() === 'buttons')
                  ? true
                  : false
              }
            />
          </section>

          <section className="collapse collapse-plus">
            <input type="checkbox" className="peer" />
            <h2 className="collapse-title bg-base-100 text-base-content peer-checked:bg-base-100 font-butler text-2xl font-medium border-b peer-checked:border-b-0 border-base-content/20">
              Description
            </h2>
            <div
              className="collapse-content bg-base-100 text-base-content prose pt-3.5 border-b-0 peer-checked:border-b border-base-content/20"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </section>
        </section>
      </section>

      <section className="mt-0 lg:mt-20 mb-20">
        {relatedProducts.length > 0 && (
          <ProductsSlider
            products={relatedProducts}
            title={
              <span className="text-2xl font-butler font-medium text-base-content">
                Related Products
              </span>
            }
          />
        )}
      </section>
    </main>
  );
}
