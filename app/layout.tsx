import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0C6266",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://osmida.com'),
  title: {
    template: '%s | Osmida Nellore',
    default: 'Osmida - Trusted House Help & Apartment Cleaning in Nellore (₹199/hr)',
  },
  description: "Osmida provides verified, on-demand house help for Nellore apartments. Book bathroom cleaning, kitchen cleaning, dishwashing, and general house help at a flat ₹199/hr rate. ₹0 advance, pay after service with Before/After photo proof.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
      alternateName: ["Osmida Nellore", "Osmida House Help", "Osmida Apartment Cleaning", "Osmida Partner"],
      url: "https://osmida.com",
      logo: "https://osmida.com/icon.png",
      image: "https://osmida.com/icon.png",
      description: "Osmida is Nellore's trusted apartment-first residential house help platform providing verified local helpers for bathroom cleaning, kitchen cleaning, dishwashing, and general house help at a transparent flat ₹199/hr rate with ₹0 advance and Before/After photo proof.",
      telephone: "+91-7676358162",
      email: "osmidaindia@gmail.com",
      priceRange: "₹",
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
        name: "Osmida Apartment House Help & Cleaning Services",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Bathroom Deep Cleaning",
            description: "Tile descaling, toilet bowl sanitization, chrome tap shining, and mirror cleaning at flat ₹199/hr.",
          },
          {
            "@type": "OfferCatalog",
            name: "Kitchen Cleaning & Degreasing",
            description: "Stove degreasing, slab scrubbing, exhaust dusting, and kitchen sink descaling at flat ₹199/hr.",
          },
          {
            "@type": "OfferCatalog",
            name: "Utensil & Dishwashing",
            description: "Hygienic dish cleaning, pressure sink rinse, and dish rack arrangement at flat ₹199/hr.",
          },
          {
            "@type": "OfferCatalog",
            name: "General House Help & Mopping",
            description: "Floor sweeping & disinfectant mopping, dusting, dry waste disposal, and domestic chores at flat ₹199/hr.",
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://osmida.com/#website",
      url: "https://osmida.com",
      name: "Osmida",
      description: "Trusted Apartment House Help & Cleaning in Nellore (₹199/hr)",
      publisher: {
        "@id": "https://osmida.com/#organization",
      },
    },
  ],
};

import { CartProvider } from "@/lib/cartContext";
import { InstallAppPrompt } from "@/components/InstallAppPrompt";

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
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__osmida_install_prompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__osmida_install_prompt = e;
                window.dispatchEvent(new CustomEvent('osmida_install_prompt_ready'));
              });
              function initOsmidaSW() {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function(err) {
                    console.warn('Osmida SW note:', err);
                  });
                }
              }
              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                initOsmidaSW();
              } else {
                window.addEventListener('DOMContentLoaded', initOsmidaSW);
                window.addEventListener('load', initOsmidaSW);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <InstallAppPrompt />
        </CartProvider>
      </body>
    </html>
  );
}