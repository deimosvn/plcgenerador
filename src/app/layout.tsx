import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLC AI Studio - AI-Powered PLC Code Generator",
  description: "Generate production-ready PLC code in seconds using AI. Support for Siemens, Allen-Bradley, Mitsubishi, Omron and more.",
  keywords: "PLC, code generator, AI, Siemens, Allen-Bradley, Mitsubishi, automation",
  authors: [{ name: "PLC AI Studio" }],
  openGraph: {
    title: "PLC AI Studio",
    description: "AI-powered PLC code generator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-800 min-h-screen flex flex-col`}
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}
      >
        <main className="flex-1">{children}</main>
        <footer className="w-full py-6 px-6 border-t border-slate-200 bg-white/80 text-center text-sm text-slate-500 mt-12">
          © 2026 Diego Martinez. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
