import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';

export const fetchCache = 'force-cache';
export const revalidate = 18000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const product = PRODUCTS.find((p) => p.slug === slug);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const categoryIds = product.category || [];
    const categoryDetails = categoryIds.length
      ? CATEGORIES.filter((c) => categoryIds.includes(c.uuid))
      : [];

    let relatedProducts: typeof PRODUCTS = [];
    const firstCategoryId = categoryIds[0];

    if (firstCategoryId) {
      relatedProducts = PRODUCTS.filter(
        (p) => p.category.includes(firstCategoryId) && p.slug !== slug
      )
        .sort(
          (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 10);
    }

    return NextResponse.json(
      {
        message: 'Product fetched successfully',
        data: {
          product,
          categories: categoryDetails,
          relatedProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
