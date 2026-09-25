import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://osmida.com'),
  title: {
    template: '%s | Osmida Nellore',
    default: 'Osmida - Trusted House Help & Apartment Cleaning in Nellore (₹199/hr)',
  },
  description: "Osmida provides verified, on-demand house help for Nellore apartments. Book bathroom cleaning, kitchen cleaning, dishwashing, and general house help at a flat ₹199/hr rate. ₹0 advance, pay after service with Before/After photo proof.",
  icons: {
    icon: [
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
      { url: "/icon.png?v=4", type: "image/png" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    shortcut: "/icon.png?v=4",
    apple: [
      { url: "/icon.png?v=4", type: "image/png" },
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
    ],
  },
  keywords: [
    "Osmida",
    "Osmida Nellore",
    "Osmida house help",
    "maid in nellore",
    "apartment cleaning nellore",
    "bathroom cleaning in nellore",
    "kitchen cleaning in nellore",
    "dishwashing service nellore",
    "house maid haranathapuram",
    "cleaning services magunta layout nellore",
    "vedayapalem cleaning service"
  ],
  openGraph: {
    title: 'Osmida - Trusted House Help in Minutes in Nellore',
    description: 'Verified house helpers for bathroom cleaning, kitchen cleaning, dishwashing, and house help across Nellore apartments at flat ₹199/hr. ₹0 advance, pay after service.',
    url: 'https://osmida.com',
    siteName: 'Osmida',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Osmida - Trusted House Help in Minutes in Nellore',
    description: 'Apartment house help & cleaning at flat ₹199/hr in Nellore with ₹0 advance and photo verification.',
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
      image: "https://osmida.com/icon.png",
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
      className={`${plusJakartaSans.variable} font-sans h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0C6266" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Osmida" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('Osmida Service Worker active:', reg.scope);
                    },
                    function(err) {
                      console.warn('Osmida Service Worker registration error:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}