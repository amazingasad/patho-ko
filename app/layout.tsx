import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Navbar from '@/components/Navbar';
import Splash from '@/components/Splash';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Pathor-Ko — Discover where every stone lives',
  description: 'A stone and mineral locality explorer. Search by stone or by country.',
  icons: { icon: '/favicon.svg', apple: '/icon-192.png' },
  manifest: '/manifest.json',
  applicationName: 'Pathor-Ko',
  appleWebApp: {
    capable: true,
    title: 'Pathor-Ko',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
};

// Next.js 14 requires themeColor to live in the viewport export (no build warnings).
export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <Splash />
          <Navbar />
          <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
