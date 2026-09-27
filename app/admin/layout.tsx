import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osmida Admin Console | Private Operations Portal",
  description: "Private management console for Osmida Nellore operations.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#0F172A",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#0A0E17] text-white">{children}</div>;
}
