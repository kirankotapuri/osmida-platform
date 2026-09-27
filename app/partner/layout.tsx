import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osmida Partner Portal | Join as Service Partner in Nellore",
  description:
    "Join Osmida as a verified house cleaning, kitchen cleaning, dishwashing, or domestic help partner in Nellore. Earn daily payouts with 70% share, guaranteed dispatch, and 9 PM instant settlements. Register online or login to the dispatch portal.",
  keywords: [
    "Osmida Partner",
    "Osmida Partner Portal",
    "Osmida partner login",
    "Osmida Nellore partner",
    "house help jobs in nellore",
    "cleaning jobs in nellore",
    "maid jobs nellore",
    "part time jobs in nellore",
    "osmida worker registration",
    "osmida partner app",
  ],
  alternates: {
    canonical: "https://partner.osmida.com",
  },
  manifest: "/worker-manifest.json",
  icons: {
    icon: [
      { url: "/icons/partner-icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/partner-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/partner-icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/partner-icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/partner-apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Osmida Partner Portal | Join as Service Partner in Nellore",
    description:
      "Verified technician & helper dispatch portal. 70% earnings, daily UPI settlements, and guaranteed apartment jobs in Nellore.",
    url: "https://partner.osmida.com",
    siteName: "Osmida Partner",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Osmida Partner Portal | Nellore Worker Dispatch",
    description: "Earn daily with Osmida Nellore. 70% payout share, daily 9 PM UPI settlements.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#0E131F",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Osmida Partner Portal",
            url: "https://osmida.com/partner",
            description:
              "Dispatch and registration portal for Osmida service helpers and cleaning technicians in Nellore.",
            provider: {
              "@type": "Organization",
              name: "Osmida",
              url: "https://osmida.com",
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "INR",
              description: "70% partner payout share with daily 9:00 PM UPI settlement",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
