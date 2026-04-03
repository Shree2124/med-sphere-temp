import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'MedSphere HIMS — Hospital Information Management System',
  description:
    'A comprehensive Hospital Information Management System for managing patients, clinical records, pharmacy, billing, and hospital operations.',
  keywords: [
    'hospital',
    'HIMS',
    'medical',
    'patient management',
    'EMR',
    'healthcare',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${outfit.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
