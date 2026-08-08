import { ProductCategory } from '@/types/Product';
import React from 'react';
import SimpleCategoriesGrid from './SimpleCategoriesGrid';
import CategoriesBentoGrid from './CategoriesBentoGrid';
import CircleCardCategoriesSlider from './CircleCardCategoriesSlider';

type Props = {
  categories: ProductCategory[];
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  type?: 'simple-grid' | 'circle-card-slider' | 'brick-style-bento-grid';
};

function CategoriesSection({
  categories,
  buttonLink = '/categories',
  buttonText = 'View All',
  title = 'Shop By Categories',
  type = 'simple-grid',
}: Props) {
  switch (type) {
    case 'simple-grid':
      return (
        <SimpleCategoriesGrid
          categories={categories}
          buttonLink={buttonLink}
          buttonText={buttonText}
          title={title}
        />
      );
    case 'circle-card-slider':
      return <CircleCardCategoriesSlider categories={categories} title={title} />;
    case 'brick-style-bento-grid':
      return <CategoriesBentoGrid categories={categories} />;
    default:
      return (
        <SimpleCategoriesGrid
          categories={categories}
          buttonLink={buttonLink}
          buttonText={buttonText}
          title={title}
        />
      );
  }
}

export default CategoriesSection;
