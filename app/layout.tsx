import type { Metadata } from 'next';
import './globals.css';
import { primaryFont, secondaryFont } from './fonts/font';
import { siteData } from '@/data/siteData';
import { StoreProvider } from './StoreProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteData.name}`,
    default: `${siteData.title}`,
  },
  description: siteData.description,
  authors: {
    name: siteData.author,
    url: siteData.siteURL,
  },
  robots: 'index, follow',
  openGraph: {
    images: `${siteData.siteURL}${siteData.siteMetaImage}`,
    type: 'website',
    title: `${siteData.name}`,
    siteName: `${siteData.name}`,
    locale: 'en_UK',
    description: `${siteData.description}`,
    url: `${siteData.siteURL}`,
  },
  twitter: {
    card: 'summary',
    creator: `${siteData.socialHandle}`,
    title: `${siteData.name}`,
    description: `${siteData.description}`,
    creatorId: `${siteData.socialHandle}`,
    images: `${siteData.siteURL}${siteData.siteMetaImage}`,
    site: `${siteData.name}`,
  },
  creator: `${siteData.author}`,
  publisher: `${siteData.author}`,
  metadataBase: siteData.siteURL,
  applicationName: `${siteData.name}`,
  appleWebApp: {
    title: `${siteData.name}`,
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" data-theme="website_theme" className="hydrated">
        <body
          className={`${primaryFont.className} ${primaryFont.variable} ${secondaryFont.variable} bg-base-100 text-base-content antialiased`}
        >
          {children}
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              className: '!bg-base-content !text-base-100',
              duration: 3000,
            }}
          />
        </body>
      </html>
    </StoreProvider>
  );
}
