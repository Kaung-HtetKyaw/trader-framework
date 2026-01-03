import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import { Toaster } from 'sonner';
import ClientProviders from '@/components/ClientProvider';
import { ReactScan } from '@/components/ReactScan';
import config from '@/lib/config';
import ReoScript from '@/components/ReoScript';
import PendoScript from '@/components/PendoScript';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kubegrade',
  description: 'Managing and upgrading components in Kubernetes environments ',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientProviders>
          {children}
          <Toaster />
          {config.NEXT_PUBLIC_ENABLE_DEBUG && <ReactScan />}
          <ReoScript />
          <PendoScript />
        </ClientProviders>
      </body>
    </html>
  );
}
