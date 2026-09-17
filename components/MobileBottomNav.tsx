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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <nav className="grid grid-cols-4 items-center h-16 px-1 max-w-md mx-auto">
        {/* 1. Home Tab */}
        {isHomePage ? (
          <button
            type="button"
            onClick={handleHomeScroll}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#1E6FFF] focus:outline-none transition-transform active:scale-95"
            aria-label="Home"
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <Home className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold tracking-tight">
              {lang === "te" ? "హోమ్" : "Home"}
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 hover:text-[#1E6FFF] focus:outline-none transition-transform active:scale-95"
            aria-label="Home"
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <Home className="h-5 w-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium tracking-tight">
              {lang === "te" ? "హోమ్" : "Home"}
            </span>
          </Link>
        )}

        {/* 2. Services Tab (Opens Urban Company Bottom Sheet) */}
        <button
          type="button"
          onClick={onOpenServices}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-700 hover:text-[#1E6FFF] focus:outline-none transition-transform active:scale-95"
          aria-label="Services Catalog"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <LayoutGrid className="h-5 w-5 stroke-[2.2] text-[#1E6FFF]" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#1E6FFF]" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 tracking-tight">
            {lang === "te" ? "సర్వీసులు" : "Services"}
          </span>
        </button>

        {/* 3. Video Guide Tab */}
        <button
          type="button"
          onClick={handleVideoScroll}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-[#1E6FFF] focus:outline-none transition-transform active:scale-95"
          aria-label="Telugu Video Guide"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <PlayCircle className="h-5 w-5 stroke-[2] text-amber-500" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 tracking-tight">
            {lang === "te" ? "వీడియో గైడ్" : "Video"}
          </span>
        </button>

        {/* 4. Book Now CTA Tab */}
        <Link
          href="/book"
          className="flex flex-col items-center justify-center gap-1 py-1 text-[#1E6FFF] focus:outline-none transition-transform active:scale-95"
          aria-label="Book Now"
        >
          <div className="relative flex items-center justify-center h-7 w-7 rounded-xl bg-blue-50 text-[#1E6FFF]">
            <CalendarCheck className="h-4 w-4 stroke-[2.4]" />
          </div>
          <span className="text-[11px] font-bold text-[#1E6FFF] tracking-tight">
            {lang === "te" ? "బుకింగ్" : "Book Now"}
          </span>
        </Link>
      </nav>
    </aside>
  );
}
