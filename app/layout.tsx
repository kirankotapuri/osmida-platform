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
  metadataBase: new URL('https://osmida.com'),
  title: {
    template: '%s | Osmida Nellore',
    default: 'Pest Control, AC Service & Home Deep Cleaning in Nellore | Osmida',
  },
  description: "Launching 1st in Nellore! Book pest control (cockroaches, bedbugs, termites), AC service & repair, and home deep cleaning with established local technicians. 30-day guarantee, ₹0 advance, pay after service.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/icon.png?v=3", type: "image/png" },
      { url: "/icon.svg?v=3", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      { url: "/apple-icon.png?v=3", type: "image/png" },
      { url: "/apple-icon.svg?v=3", type: "image/svg+xml" },
    ],
  },
  keywords: [
    "pest control in nellore",
    "ac service in nellore",
    "home deep cleaning nellore",
    "cockroach pest control nellore",
    "bedbug treatment nellore",
    "ac repair trunk road nellore",
    "cleaning services magunta layout nellore"
  ],
  openGraph: {
    title: 'Osmida | Pest Control, AC Services & Home Cleaning in Nellore',
    description: 'Launching 1st in Nellore! Partnered with established local technicians for pest control, AC servicing, and home deep cleaning with 30-day warranty and ₹0 advance.',
    url: 'https://osmida.com',
    siteName: 'Osmida Nellore',
    locale: 'en_IN',
    type: 'website',
  },
};

import { CartProvider } from "@/lib/cartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}