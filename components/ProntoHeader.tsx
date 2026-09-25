"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  HelpCircle,
  Phone,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";

const NELLORE_LOCALITIES = [
  "Haranathapuram",
  "Magunta Layout",
  "Vedayapalem",
  "Pogathota",
  "Dargamitta",
  "Balaji Nagar",
  "Nellore Central",
];

export function ProntoHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState("Haranathapuram");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E1EBEB] transition-all shadow-xs">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Working Nellore Locality Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-1.5 focus:outline-hidden group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0C6266] group-hover:opacity-90 transition-opacity">
              Osmida
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0C6266] bg-[#EBF4F5] border border-[#B6D7D8] px-2 py-0.5 rounded-full uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Nellore
            </span>
          </Link>

          {/* Interactive Working Locality Dropdown (Takes minimal space, never pushes nav) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#0C6266] bg-[#EBF4F5] hover:bg-[#DFEFEF] px-2.5 py-1 rounded-full border border-[#B6D7D8] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              title="Click to select Nellore locality"
            >
              <MapPin className="h-3 w-3 text-[#0C6266] shrink-0" />
              <span className="max-w-[110px] truncate">{selectedLocality}</span>
              <ChevronDown className="h-3 w-3 text-[#0C6266] shrink-0" />
            </button>

            {locationDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLocationDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white p-1.5 shadow-2xl border border-[#DFE8E8] z-40 animate-in fade-in duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#475559] border-b border-[#F4F8F8] mb-1">
                    Select Nellore Locality
                  </div>
                  <div className="space-y-0.5">
                    {NELLORE_LOCALITIES.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocality(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedLocality === loc
                            ? "bg-[#0C6266] text-white"
                            : "text-[#0F171A] hover:bg-[#F4F8F8]"
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocality === loc && (
                          <Check className="w-3.5 h-3.5 text-white shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Zero wrapping with whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-bold text-[#475559]">
          <button
            type="button"
            onClick={() => scrollTo("services-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            Services &amp; Pricing
          </button>
          <button
            type="button"
            onClick={() => scrollTo("how-it-works-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo("guarantee-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            Our Guarantee
          </button>
          <button
            type="button"
            onClick={() => scrollTo("faqs-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            FAQs
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/my-bookings"
            className="hidden md:inline-flex text-xs font-bold text-[#475559] hover:text-[#0C6266] transition-colors px-2 py-1 whitespace-nowrap"
          >
            Track Booking
          </Link>

          {/* Compact on Mobile (Book • ₹199), Full on Desktop */}
          <Link
            href="/book"
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all shadow-xs shadow-[#E68A00]/25 whitespace-nowrap"
          >
            <span className="sm:hidden">Book • ₹199</span>
            <span className="hidden sm:inline">Book in 60s (₹199/hr)</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[#0F171A] hover:text-[#0C6266] rounded-xl hover:bg-[#F4F8F8] active:scale-90 transition-all border border-[#DFE8E8]/80 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY & MENU */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 top-14 sm:top-16 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-Down Menu Sheet */}
          <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#DFE8E8] shadow-2xl px-4 pt-3.5 pb-6 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden rounded-b-3xl">
            {/* Quick Location Badge */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#0C6266] bg-[#EBF4F5] px-3 py-1.5 rounded-xl border border-[#B6D7D8]">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>Serving {selectedLocality}, Nellore</span>
              </div>
              <span className="font-extrabold text-[10px] bg-[#0C6266] text-white px-2 py-0.5 rounded-md">
                15–30 Mins
              </span>
            </div>

            {/* Menu Links with Icons */}
            <div className="grid grid-cols-1 gap-1 text-xs font-bold text-[#0F171A]">
              <button
                type="button"
                onClick={() => scrollTo("services-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Services &amp; Pricing</p>
                  <p className="text-[10px] text-[#475559] font-normal">Flat ₹199/hr • 4 Core Services</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("how-it-works-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">How It Works</p>
                  <p className="text-[10px] text-[#475559] font-normal">Dual OTP system • Live tracking</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("guarantee-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Our Launch Guarantee</p>
                  <p className="text-[10px] text-[#475559] font-normal">₹0 Advance • Pay after verification</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("faqs-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <HelpCircle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Frequently Asked Questions</p>
                  <p className="text-[10px] text-[#475559] font-normal">Common questions answered</p>
                </div>
              </button>
            </div>

            {/* Track Booking Card */}
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F8F8] border border-[#DFE8E8] hover:border-[#0C6266]/40 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0C6266]/10 text-[#0C6266] flex items-center justify-center font-bold shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F171A] group-hover:text-[#0C6266] transition">
                    Track Active Booking
                  </p>
                  <p className="text-[10px] text-[#475559]">View helper arrival &amp; Before/After photos</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#475559] group-hover:text-[#0C6266] transition shrink-0" />
            </Link>

            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/917676358162"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#EBF4F5] border border-[#B6D7D8] text-xs font-bold text-[#0C6266] hover:bg-[#DFEFEF] transition"
            >
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0C6266] shrink-0" />
                <span>WhatsApp Help: +91 7676358162</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-[#0C6266] text-white px-2 py-0.5 rounded-md shrink-0">
                Chat
              </span>
            </a>

            {/* Primary Action Button */}
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white py-3.5 text-xs font-black transition-all shadow-md shadow-[#E68A00]/25"
            >
              <span>Book House Help in 60s (₹199/hr)</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
