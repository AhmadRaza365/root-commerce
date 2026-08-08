import { PRODUCTS } from '@/data/products';
import { NextRequest, NextResponse } from 'next/server';

export const fetchCache = 'force-cache';
export const revalidate = 18000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query') || '';
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sortParam = searchParams.get('sort') || 'default';

    const query = searchQuery.toLowerCase();
    const filtered = query
      ? PRODUCTS.filter(
          (p) =>
            p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        )
      : PRODUCTS;

    const sortFns: Record<
      string,
      (a: (typeof PRODUCTS)[number], b: (typeof PRODUCTS)[number]) => number
    > = {
      'price-asc': (a, b) => a.basePrice - b.basePrice,
      'price-desc': (a, b) => b.basePrice - a.basePrice,
      newest: (a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
      oldest: (a, b) =>
        new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime(),
      'name-asc': (a, b) => a.title.localeCompare(b.title),
      'name-desc': (a, b) => b.title.localeCompare(a.title),
      default: (a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
    };

    const sortFn = sortFns[sortParam] || sortFns.default;
    const sorted = [...filtered].sort(sortFn);

    const totalRecords = sorted.length;
    const skip = (pageNumber - 1) * pageSize;
    const paged = sorted.slice(skip, skip + pageSize);

    return NextResponse.json(
      {
        message: 'Products fetched successfully',
        data: paged,
        totalRecords,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
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
