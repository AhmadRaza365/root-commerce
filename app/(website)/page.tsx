import ProductsSlider from '@/components/ProductsSlider';
import axoisAPI from '@/network/axios';
import { ProductCategory } from '@/types/Product';
import { Settings } from '@/types/Settings';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/hero-sections/HeroSection';
import CategoriesSection from '@/components/categories-sections/CategoriesSection';
import CtaSection from '@/components/cta-sections/CtaSection';
import FullWidthProductBanner from '@/components/promo-sections/FullWidthProductBanner';
import ServiceFeaturesGrid from '@/components/promo-sections/ServiceFeaturesGrid';
import { BsGlobe2 } from 'react-icons/bs';

export const fetchCache = 'force-cache';
export const revalidate = 18000;

export default async function Home() {
  const categoriesRes = await axoisAPI.get('/api/categories');
  const productsRes = await axoisAPI.get('/api/products/get-best-selling');
  const settingsRes = await axoisAPI.get('/api/settings');
  const categories: ProductCategory[] = categoriesRes.data.data;
  const products = productsRes.data.data;
  const settings: Settings = settingsRes.data.data;

  if (!categories || !products || !settings) {
    notFound();
  }

  return (
    <main className="">
      <HeroSection
        type="centered-content"
        slides={settings.homeSlider ? settings.homeSlider : []}
      />
      <CategoriesSection categories={categories} type="brick-style-bento-grid" />

      <CategoriesSection categories={categories} type="circle-card-slider" />
      <CategoriesSection categories={categories} type="simple-grid" />

      <HeroSection
        type="left-middle-content-full-image"
        slides={settings.homeSlider ? settings.homeSlider : []}
      />

      <ProductsSlider title="Best Selling Products" products={products} />

      <FullWidthProductBanner
        backgroundImage="/images/slidebg.jpg"
        buttonLink="/shop"
        buttonText="Shop Now"
        heading={['Featured Product']}
        productImage="/images/product-image.png"
        productImageAlt="Product"
        tagline="Tagline"
      />
      <section className="my-20" />
      <CtaSection
        type="classic-left-center"
        content={{
          backgroundImage: '/images/slidebg.jpg',
          buttons: [
            {
              link: '/shop',
              text: 'Button 1',
            },
            {
              link: '/shop',
              text: 'Button 2',
            },
          ],
          description: 'CTA section description',
          heading: 'CTA section Heading',
        }}
      />

      <ServiceFeaturesGrid
        services={[
          {
            id: '1',
            title: 'Service 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
            icon: <BsGlobe2 size={24} />,
          },
          {
            id: '2',
            title: 'Service 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
            icon: <BsGlobe2 size={24} />,
          },
          {
            id: '3',
            title: 'Service 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
            icon: <BsGlobe2 size={24} />,
          },
          {
            id: '4',
            title: 'Service 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
            icon: <BsGlobe2 size={24} />,
          },
        ]}
      />

      <section className="my-20" />
    </main>
  );
}
