import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import EnvironmentBanner from '@/components/Sandbox/EnvironmentBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Firebase Sandbox Emulator Suite',
  description: 'Plug-and-play Firebase sandbox toolkit: emulators, modular seeding, schema sync + diff, CI guard, web admin panel, and scenario runner.',
  keywords: ['firebase', 'emulator', 'testing', 'development', 'sandbox', 'nextjs', 'typescript'],
  authors: [{ name: 'Firebase Sandbox Team' }],
  openGraph: {
    title: 'Firebase Sandbox Emulator Suite',
    description: 'Plug-and-play Firebase sandbox toolkit for development and testing',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnvironmentBanner />
        {children}
      </body>
    </html>
  );
}

