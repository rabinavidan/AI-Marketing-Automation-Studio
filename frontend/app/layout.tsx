import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Marketing Automation Studio',
  description: 'Cosmetics Marketing AI Suite',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="flex flex-col sm:flex-row min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <Header />
            <main className="flex-1 px-4 sm:px-8 py-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
