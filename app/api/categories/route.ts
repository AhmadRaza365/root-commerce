import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/data/categories';

// Enable cache for 5 hours
export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export async function GET() {
  try {
    const categories = CATEGORIES;

    if (!categories) {
      return NextResponse.json(
        {
          message: 'No categories found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Categories fetched successfully',
        data: categories,
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
