// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'UpStore - Магазин электроники',
  description: 'Современный магазин электроники и гаджетов',
  manifest: '/manifest.json',
  icons: {
    icon: '/src/img/logo.svg',
    apple: '/src/img/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen bg-black text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
