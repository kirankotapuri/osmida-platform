"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";
import {
  Home,
  LayoutGrid,
  PlayCircle,
  CalendarCheck,
} from "lucide-react";

interface MobileBottomNavProps {
  lang: Language;
  onOpenServices: () => void;
}

export function MobileBottomNav({
  lang,
  onOpenServices,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleVideoScroll = () => {
    if (isHomePage) {
      const el = document.getElementById("how-to-book-video");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = "/#how-to-book-video";
  };

  const handleHomeScroll = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
    >
      <nav className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
        {/* 1. Osmida / Home Tab (Screenshot 1: "UC" style icon) */}
        {isHomePage ? (
          <button
            type="button"
            onClick={handleHomeScroll}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-950 focus:outline-none transition-transform active:scale-95"
            aria-label="Osmida Home"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
              O
            </div>
            <span className="text-[10px] font-bold tracking-tight text-slate-950">
              {lang === "te" ? "ఓస్మిడా" : "Osmida"}
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 hover:text-slate-900 focus:outline-none transition-transform active:scale-95"
            aria-label="Osmida Home"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700">
              O
            </div>
            <span className="text-[10px] font-medium tracking-tight">
              {lang === "te" ? "ఓస్మిడా" : "Osmida"}
            </span>
          </Link>
        )}

        {/* 2. Services Tab (Screenshot 1: with Red Dot Badge) */}
        <button
          type="button"
          onClick={onOpenServices}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-slate-950 focus:outline-none transition-transform active:scale-95"
          aria-label="Services Catalog"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <LayoutGrid className="h-5 w-5 stroke-[2] text-slate-800" />
            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white" />
          </div>
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight">
            {lang === "te" ? "సర్వీసులు" : "Services"}
          </span>
        </button>

        {/* 3. Telugu Video Guide Tab */}
        <button
          type="button"
          onClick={handleVideoScroll}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-slate-950 focus:outline-none transition-transform active:scale-95"
          aria-label="Telugu Video Guide"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <PlayCircle className="h-5 w-5 stroke-[2] text-slate-800" />
          </div>
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight">
            {lang === "te" ? "వీడియో" : "Video"}
          </span>
        </button>

        {/* 4. WhatsApp Support Tab (Screenshot style action) */}
        <a
          href="https://wa.me/917676358162?text=Hi%20Osmida%2C%20I%20want%20to%20know%20about%20your%20services%20in%20Nellore."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-slate-950 focus:outline-none transition-transform active:scale-95"
          aria-label="WhatsApp Support"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-white">
              <span className="text-[10px] font-bold">W</span>
            </div>
            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white" />
          </div>
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight">
            {lang === "te" ? "వాట్సాప్" : "WhatsApp"}
          </span>
        </a>

        {/* 5. Book Now Tab */}
        <Link
          href="/book"
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-900 focus:outline-none transition-transform active:scale-95"
          aria-label="Book Now"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <CalendarCheck className="h-5 w-5 stroke-[2.2] text-slate-900" />
          </div>
          <span className="text-[10px] font-bold text-slate-900 tracking-tight">
            {lang === "te" ? "బుక్ (₹0)" : "Book (₹0)"}
          </span>
        </Link>
      </nav>
    </aside>
  );
}
