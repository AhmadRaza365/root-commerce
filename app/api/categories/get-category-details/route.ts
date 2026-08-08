import { NextRequest, NextResponse } from 'next/server';
import { ProductCategory } from '@/types/Product';
import { CATEGORIES } from '@/data/categories';

// Enable cache for 5 hours
export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
    }

    const category = CATEGORIES.find((cat) => cat.slug === slug);

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const categoryData: ProductCategory = {
      name: category.name,
      image: category.image,
      slug: category.slug,
      uuid: category.uuid,
      showNewTag: category.showNewTag || false,
    };

    return NextResponse.json(
      {
        message: 'Category fetched successfully',
        data: categoryData,
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
