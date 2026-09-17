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
  description: "Book verified pest control (cockroaches, bedbugs, termites), AC service & repair, and home deep cleaning in Nellore. 30-day guarantee, ₹0 advance, pay after service.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
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
    description: 'Book verified pest control, AC servicing, and home deep cleaning in Nellore with 30-day warranty, verified local experts, and 30-minute call confirmation.',
    url: 'https://osmida.com',
    siteName: 'Osmida Nellore',
    locale: 'en_IN',
    type: 'website',
  },
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}