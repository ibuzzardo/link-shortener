import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'URL Shortener',
  description: 'A simple URL shortener with analytics dashboard',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-textPrimary antialiased`}>
        {children}
      </body>
    </html>
  );
}