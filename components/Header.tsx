"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";
import { MapPin, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { LocationSelectorModal } from "@/components/LocationSelectorModal";
import { UCCartDrawer } from "@/components/UCCartDrawer";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ lang, onLanguageChange }: HeaderProps) {
  const pathname = usePathname();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const [selectedLocality, setSelectedLocality] = useState<string>("Kailasapuram");
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);

  // Restore saved locality from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("osmida_selected_locality");
      if (saved) {
        setSelectedLocality(saved);
      }
    }
  }, []);

  const handleSelectLocality = (loc: string, details?: string) => {
    setSelectedLocality(loc);
    if (typeof window !== "undefined") {
      localStorage.setItem("osmida_selected_locality", loc);
      if (details) {
        localStorage.setItem("osmida_selected_locality_details", details);
      }
    }
  };

  const navLinks = [
    {
      href: "/#services-section",
      labelEn: "Services",
      labelTe: "సేవలు",
      activeMatch: (p: string) =>
        p === "/" ||
        p.startsWith("/pest-control") ||
        p.startsWith("/ac-services") ||
        p.startsWith("/home-deep-cleaning"),
    },
    {
      href: "/#how-to-book-video",
      labelEn: "How to Book (Video)",
      labelTe: "వీడియో గైడ్",
      activeMatch: () => false,
    },
    {
      href: "/about",
      labelEn: "About",
      labelTe: "మా గురించి",
      activeMatch: (p: string) => p.startsWith("/about"),
    },
    {
      href: "/#contact",
      labelEn: "Contact",
      labelTe: "సంప్రదించండి",
      activeMatch: (p: string) => p.startsWith("/#contact"),
    },
  ];

  return (
    <>
      {/* Osmida Executive Midnight Header (Human Color Psychology: Authority & Trust) */}
      <header
        className="fixed top-0 left-0 right-0 z-[1000] w-full bg-[#0F172A] text-white border-b border-slate-800 transition-all duration-200 shadow-md"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 sm:px-4 lg:px-6 h-14 sm:h-16">
          {/* Left: Location & Logo (Urban Company Screenshot 1 Layout) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 focus:outline-none rounded-xl"
              aria-label="Osmida Home Page"
            >
              <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden border border-white/20 bg-black transition-transform group-hover:scale-105 shrink-0 shadow-xs">
                <Image
                  src="/osmida.jpg"
                  alt="Osmida Logo"
                  fill
                  className="object-cover"
                  priority
                  sizes="36px"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm sm:text-base font-black tracking-wider text-white">
                  OSMIDA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 -mt-0.5">
                  {lang === "te" ? "నెల్లూరు" : "Nellore"}
                </span>
              </div>
            </Link>

            {/* Urban Company-Style Exact Location Selector (Screenshot 1 & 2) */}
            <button
              type="button"
              onClick={() => setIsLocalityModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl hover:bg-white/10 px-2 py-1 text-left transition-colors focus:outline-none"
              aria-label="Select locality in Nellore"
            >
              <MapPin className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white shrink-0" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black text-white truncate max-w-[100px] xs:max-w-[130px] sm:max-w-[180px]">
                    {selectedLocality}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-300 shrink-0 stroke-[2.5]" />
                </div>
                <span className="text-[10px] text-slate-300 truncate max-w-[100px] xs:max-w-[130px] sm:max-w-[200px] leading-tight font-medium">
                  {lang === "te" ? "నెల్లూరు • ప్రముఖ నిపుణులు" : "Nellore, AP • Verified Pros"}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Navigation Links (Desktop >= 1024px only) */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = link.activeMatch(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center h-10 px-2 text-sm font-bold transition-colors duration-200 focus:outline-none rounded-md ${
                    isActive ? "text-white font-black" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{lang === "te" ? link.labelTe : link.labelEn}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-white transition-all duration-200 origin-center ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: Cart Button & Language Toggle (Screenshot 4 & Audio 2) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Urban Company-Style Circular Cart Button (Screenshot 4) */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex h-8.5 w-8.5 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 transition-all shadow-xs"
              aria-label={`Open Cart (${totalItems} items)`}
              title={lang === "te" ? `కార్ట్ (${totalItems})` : `Cart (${totalItems})`}
            >
              <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black px-1 shadow-sm border border-[#0F172A] animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div
              className="flex items-center gap-1 text-xs font-bold bg-white/10 rounded-full p-1 border border-white/15"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`transition-colors duration-200 rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs ${
                  lang === "en"
                    ? "font-black text-slate-950 bg-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
                aria-label="Switch language to English"
                aria-pressed={lang === "en"}
              >
                EN
              </button>

              <button
                type="button"
                onClick={() => onLanguageChange("te")}
                className={`transition-colors duration-200 rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs ${
                  lang === "te"
                    ? "font-black text-slate-950 bg-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
                aria-label="భాషను తెలుగుకి మార్చండి"
                aria-pressed={lang === "te"}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Google Maps-Style Location Selector Modal with Out-of-Service Warning (Screenshot 3 & Audio 1) */}
      <LocationSelectorModal
        isOpen={isLocalityModalOpen}
        onClose={() => setIsLocalityModalOpen(false)}
        selectedLocality={selectedLocality}
        onSelectLocality={handleSelectLocality}
        lang={lang}
      />

      {/* Slide-Up Bottom Cart Checkout Drawer (Available across all pages) */}
      <UCCartDrawer lang={lang} />
    </>
  );
}
