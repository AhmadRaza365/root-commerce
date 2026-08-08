import localFont from 'next/font/local';
import { Noto_Serif_Display } from 'next/font/google';

const primaryFont = localFont({
  src: [
    {
      path: './kors_Sans-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './kors_Sans-Book.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './kors_Sans-Medium.woff',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
  fallback: ['serif'],
  preload: true,
});

const secondaryFont = Noto_Serif_Display({
  subsets: ['latin'],
  variable: '--font-secondary',
});

export { primaryFont, secondaryFont };
