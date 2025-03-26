import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Flight Manager CRM',
  description: 'A modern CRM system for managing flight bookings and client data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
