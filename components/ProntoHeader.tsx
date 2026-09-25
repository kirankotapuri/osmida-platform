"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, MapPin } from "lucide-react";

export function ProntoHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E1EBEB] transition-all shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Osmida Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 focus:outline-hidden">
            <span className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0C6266]">
              Osmida
            </span>
            <span className="text-[10px] font-black text-[#0C6266] bg-[#EBF4F5] border border-[#B6D7D8] px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">
              Nellore
            </span>
          </Link>

          {/* Quick Locality Indicator */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-[#475559] bg-[#F4F8F8] px-2.5 py-1 rounded-full border border-[#DFE8E8] ml-2">
            <MapPin className="h-3 w-3 text-[#0C6266]" />
            <span>Haranathapuram • Magunta Layout • All Apartments</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[#475559]">
          <button
            type="button"
            onClick={() => scrollTo("services-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => scrollTo("how-it-works-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo("reviews-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <button
            type="button"
            onClick={() => scrollTo("faqs-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer"
          >
            FAQs
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/my-bookings"
            className="hidden sm:inline-flex text-xs font-bold text-[#0F171A] hover:text-[#0C6266] transition-colors px-2 py-1"
          >
            Track Booking
          </Link>

          <Link
            href="/book"
            className="flex items-center gap-1.5 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition-all shadow-sm shadow-[#E68A00]/25"
          >
            <span>Book in 60s (₹199/hr)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#0F171A] hover:text-[#0C6266] rounded-lg focus:outline-hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E1EBEB] bg-white px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2.5 text-xs font-bold text-[#0F171A]">
            <button
              type="button"
              onClick={() => scrollTo("services-section")}
              className="text-left py-2 border-b border-[#F4F8F8] text-[#475559] hover:text-[#0C6266]"
            >
              Services & Pricing
            </button>
            <button
              type="button"
              onClick={() => scrollTo("how-it-works-section")}
              className="text-left py-2 border-b border-[#F4F8F8] text-[#475559] hover:text-[#0C6266]"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollTo("guarantee-section")}
              className="text-left py-2 border-b border-[#F4F8F8] text-[#475559] hover:text-[#0C6266]"
            >
              Our Launch Guarantee
            </button>
            <button
              type="button"
              onClick={() => scrollTo("faqs-section")}
              className="text-left py-2 border-b border-[#F4F8F8] text-[#475559] hover:text-[#0C6266]"
            >
              FAQs
            </button>
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-[#0C6266] font-bold"
            >
              📋 Track My Active Booking (OTP Login) →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
