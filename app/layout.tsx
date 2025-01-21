import type { Metadata } from "next";
import { Geist,Doto, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const doto =Doto({
  subsets: ['latin'], // Add subsets as required
  weight: ['400', '700'], // Specify weights as needed
  variable: '--font-doto', // Optional: CSS variable for Tailwind integration
  display: 'swap', // Improves performance
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "afzal's portfolio",
  description: "all about me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${doto.variable} ${geistMono.variable} antialiased  text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
