"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";
import { NELLORE_LOCALITIES } from "@/lib/constants";
import { MapPin, ChevronDown, Check, X } from "lucide-react";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ lang, onLanguageChange }: HeaderProps) {
  const pathname = usePathname();
  const [selectedLocality, setSelectedLocality] = useState<string>("Pogathota");
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);

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

            {/* Urban Company-Style Exact Location Selector (Screenshot 1) */}
            <button
              type="button"
              onClick={() => setIsLocalityModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl hover:bg-white/10 px-2 py-1 text-left transition-colors focus:outline-none"
              aria-label="Select locality in Nellore"
            >
              <MapPin className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white shrink-0" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black text-white truncate max-w-[120px] sm:max-w-[180px]">
                    {selectedLocality}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-300 shrink-0 stroke-[2.5]" />
                </div>
                <span className="text-[10px] text-slate-300 truncate max-w-[120px] sm:max-w-[200px] leading-tight font-medium">
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

          {/* Right: Language Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-1 text-xs font-bold bg-white/10 rounded-full p-1 border border-white/15"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`transition-colors duration-200 rounded-full px-2.5 py-0.5 ${
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
                className={`transition-colors duration-200 rounded-full px-2.5 py-0.5 ${
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

      {/* Urban Company-Style Locality Picker Bottom Sheet / Modal */}
      {isLocalityModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsLocalityModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 z-10 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle Bar for mobile */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === "te" ? "నెల్లూరులో మీ ప్రాంతాన్ని ఎంచుకోండి" : "Select Your Nellore Area"}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === "te" ? "30 నిమిషాల్లో సర్వీస్ నిర్ధారణ" : "30-min doorstep arrival confirmation"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLocalityModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 py-2">
              {NELLORE_LOCALITIES.map((loc) => {
                const isSelected = selectedLocality === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocality(loc);
                      setIsLocalityModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between py-3 px-2 text-left rounded-xl transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-950 font-bold"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin
                        className={`h-4 w-4 ${
                          isSelected ? "text-slate-950" : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm">{loc}, Nellore</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-slate-950" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
