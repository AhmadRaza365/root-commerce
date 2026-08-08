import { PRODUCTS } from '@/data/products';
import { NextResponse } from 'next/server';

// Enable cache for 5 hours
export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export async function GET() {
  try {
    // Get First 10 products
    const products = PRODUCTS;

    if (!products) {
      return NextResponse.json(
        {
          message: 'No products found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Products fetched successfully',
        data: products,
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
