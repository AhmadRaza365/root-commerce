import { SETTINGS } from '@/data/settings';
import { Settings } from '@/types/Settings';
import { NextResponse } from 'next/server';

// Enable cache for 5 hours
export const fetchCache = 'force-cache';
export const revalidate = 18000; // 5 hours in seconds

export async function GET() {
  try {
    const settingsRes = SETTINGS;

    const settings: Settings = {
      ticker: settingsRes?.ticker || {
        show: false,
        text: '',
        duration: 40,
      },
      homeSlider: settingsRes?.homeSlider || [],
    };

    return NextResponse.json(
      {
        message: 'Settings fetched successfully',
        data: settings,
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
