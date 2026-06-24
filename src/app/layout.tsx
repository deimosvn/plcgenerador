import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PLC AI Studio - Generador de Código PLC con IA',
  description:
    'Genera código PLC profesional en segundos con inteligencia artificial. Soporte para Siemens, Allen-Bradley, Mitsubishi, Omron, Schneider, Beckhoff, ABB y más. Compatible con IEC 61131-3.',
  keywords: [
    'PLC',
    'generador de código',
    'IA',
    'Siemens',
    'Allen-Bradley',
    'Mitsubishi',
    'automatización',
    'IEC 61131-3',
    'Structured Text',
    'Ladder',
  ],
  authors: [{ name: 'Diego Martinez' }],
  icons: {
    icon: '/plcicon.png',
    apple: '/plcicon.png',
  },
  openGraph: {
    title: 'PLC AI Studio',
    description: 'Generador de código PLC profesional con inteligencia artificial',
    type: 'website',
    locale: 'es_ES',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-slate-800 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
