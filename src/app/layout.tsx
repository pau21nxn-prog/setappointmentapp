import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Your Appointment | Web Development Consultation',
  description:
    'Pre-qualify for a custom web development consultation. Book your appointment to discuss your project needs.',
  keywords: ['web development', 'consultation', 'appointment', 'booking'],
  authors: [{ name: 'Your Company Name' }],
  openGraph: {
    title: 'Book Your Appointment | Web Development Consultation',
    description: 'Pre-qualify for a custom web development consultation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
