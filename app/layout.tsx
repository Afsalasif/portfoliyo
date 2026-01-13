import type { Metadata } from "next";
import { Geist, Doto, Geist_Mono } from "next/font/google";
import "./globals.css";

// Optimize font loading with display: 'swap' and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const doto = Doto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-doto',
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Afzal's Portfolio | Full Stack Developer",
    template: "%s | Afzal's Portfolio"
  },
  description: "Explore Afzal's portfolio showcasing expertise in full-stack development, innovative projects, and professional experience in web technologies.",
  keywords: ["portfolio", "full stack developer", "web developer", "software engineer", "Afzal"],
  authors: [{ name: "Afzal" }],
  creator: "Afzal",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Afzal's Portfolio",
    title: "Afzal's Portfolio | Full Stack Developer",
    description: "Explore Afzal's portfolio showcasing expertise in full-stack development and innovative projects.",
    
  },
  twitter: {
    card: "summary_large_image",
    title: "Afzal's Portfolio",
    description: "Full Stack Developer | Innovative Projects & Professional Experience",
   
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${doto.variable} ${geistMono.variable} antialiased text-white min-h-screen bg-black`}
      >
        {children}
      </body>
    </html>
  );
}