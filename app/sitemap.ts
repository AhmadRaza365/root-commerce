import axoisAPI from '@/network/axios';
import { Product, ProductCategory } from '@/types/Product';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteURL = process.env.NEXT_PUBLIC_DOMAIN_URL;
  const categoriesRes = await axoisAPI.get('/api/categories');
  const productsRes = await axoisAPI.get(
    `/api/products/get-by-category?pageNumber=1&sort=default&pageSize=1000`
  );

  const categories: ProductCategory[] = categoriesRes.data.data;
  const products: Product[] = productsRes.data.data;

  return [
    {
      url: siteURL ?? '',
      priority: 1,
    },
    {
      url: `${siteURL}/shop`,
      priority: 1,
    },
    {
      url: `${siteURL}/products`,
      priority: 1,
    },
    {
      url: `${siteURL}/categories`,
      priority: 0.9,
    },

    ...categories.map((category) => ({
      url: `${siteURL}/categories/${category.slug}`,
      priority: 0.9,
    })),

    ...products.map((product) => ({
      url: `${siteURL}/product/${product.slug}`,
      priority: 0.9,
    })),

    {
      url: `${siteURL}/contact-us`,
      priority: 0.5,
    },
    {
      url: `${siteURL}/checkout`,
      priority: 0.5,
    },
  ];
}
