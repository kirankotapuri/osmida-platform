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
    default: 'Osmida - AC Services, Pest Control & Home Deep Cleaning in Nellore',
  },
  description: "Osmida is Nellore's #1 trusted home services platform. Book verified local technicians for AC servicing & repair, cockroach & termite pest control, and full home deep cleaning. ₹0 advance, pay after service, 30-day warranty.",
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
    "Osmida",
    "Osmida Nellore",
    "Osmida home services",
    "Osmida pest control",
    "Osmida AC service",
    "pest control in nellore",
    "ac service in nellore",
    "home deep cleaning nellore",
    "cockroach pest control nellore",
    "termite treatment nellore",
    "bedbug treatment nellore",
    "ac repair trunk road nellore",
    "cleaning services magunta layout nellore"
  ],
  openGraph: {
    title: 'Osmida - Reliable Doorstep Home Services in Nellore',
    description: 'Book verified local pros for AC service, pest control (cockroach, termite), and home deep cleaning across Nellore. 30-day warranty, ₹0 advance, pay after service.',
    url: 'https://osmida.com',
    siteName: 'Osmida',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Osmida - Doorstep Home Services in Nellore',
    description: 'AC Servicing, Pest & Termite Control, and Home Deep Cleaning in Nellore with ₹0 advance.',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://osmida.com/#organization",
      name: "Osmida",
      alternateName: ["Osmida Nellore", "Osmida Home Services", "Osmida Facility Services"],
      url: "https://osmida.com",
      logo: "https://osmida.com/icon.png",
      image: "https://osmida.com/osmida.jpg",
      description: "Osmida is Nellore's trusted doorstep home services platform providing AC servicing & repair, odorless cockroach, termite & bed bug control, and full home deep cleaning with verified local technicians, ₹0 advance, and a 30-day rework warranty.",
      telephone: "+91-7676358162",
      email: "osmidaindia@gmail.com",
      priceRange: "₹₹",
      areaServed: {
        "@type": "City",
        name: "Nellore",
        containedInPlace: {
          "@type": "State",
          name: "Andhra Pradesh",
        },
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fathekhanpet, Pendemvari Street",
        addressLocality: "Nellore",
        addressRegion: "Andhra Pradesh",
        postalCode: "524003",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "14.4426",
        longitude: "79.9865",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:00",
          closes: "20:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/osmida_osmida",
        "https://wa.me/917676358162",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Osmida Doorstep Home Services",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "AC Services & Repair",
            description: "Power Saver Jet AC Service, Gas Leak Fix & Refill, Installation & Uninstallation across Nellore.",
          },
          {
            "@type": "OfferCatalog",
            name: "Pest & Termite Control",
            description: "Odorless Cockroach Control, Drill-Fill-Seal Subterranean Termite Treatment, Bed Bug & Ant Eradication.",
          },
          {
            "@type": "OfferCatalog",
            name: "Home Deep Cleaning",
            description: "Full House Deep Cleaning, Kitchen Degreasing, Bathroom Sanitization, Sofa & Balcony Cleaning.",
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://osmida.com/#website",
      url: "https://osmida.com",
      name: "Osmida",
      description: "Reliable Doorstep Home Services in Nellore",
      publisher: {
        "@id": "https://osmida.com/#organization",
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}