import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitch } from '@/components/theme-switch';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QRCode VCard',
  description: 'Generate QR codes for your digital business card',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitch />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}