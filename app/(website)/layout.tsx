import Footer from '@/components/Footer';
import Header from '@/components/Header';
import axoisAPI from '@/network/axios';
import { ProductCategory } from '@/types/Product';
import { Settings } from '@/types/Settings';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-cache';

export default async function MainWebsiteLayout({ children }: Props) {
  const categoriesRes = await axoisAPI.get('/api/categories');
  const settingsRes = await axoisAPI.get('/api/settings');
  const categories: ProductCategory[] = categoriesRes.data.data;
  const settings: Settings = settingsRes.data.data;

  return (
    <main className="relative">
      <Header
        categories={categories.map((category) => ({
          name: category.name,
          slug: category.slug,
          showNewTag: category.showNewTag || false,
        }))}
        ticker={settings.ticker}
      />
      <section className="min-h-[70vh]">{children}</section>
      <Footer />
    </main>
  );
}
