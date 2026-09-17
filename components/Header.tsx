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
  const [selectedLocality, setSelectedLocality] = useState<string>("Trunk Road");
  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);

  const navLinks = [
    {
      href: "/#booking-section",
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
      <header
        className="fixed top-0 left-0 right-0 z-[1000] w-full bg-[#0B0B0F] transition-all duration-200"
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2.5 sm:px-4 lg:px-6 h-14 sm:h-16 lg:h-20">
          {/* Left: Logo (Osmida) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-1.5 sm:gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF] rounded-xl py-1"
              aria-label="Osmida Home Page"
            >
              <div className="relative h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 overflow-hidden rounded-xl border border-white/20 bg-black transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/osmida.jpg"
                  alt="Osmida Logo"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 36px, 40px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-base lg:text-lg font-black tracking-wider sm:tracking-widest text-white transition-colors duration-200 group-hover:text-[#CCCCCC]">
                  OSMIDA
                </span>
                <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6] -mt-0.5">
                  {lang === "te" ? "నెల్లూరు" : "Nellore"}
                </span>
              </div>
            </Link>

            {/* Urban Company-Style Locality Selector Pill */}
            <button
              type="button"
              onClick={() => setIsLocalityModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-2 sm:px-3 py-1 text-left transition-colors focus:outline-none"
              aria-label="Select locality in Nellore"
            >
              <MapPin className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#38BDF8] shrink-0" />
              <div className="flex items-center gap-1 max-w-[88px] sm:max-w-[160px] truncate">
                <span className="text-[10px] sm:text-xs font-semibold text-white truncate">
                  {selectedLocality}
                </span>
                <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400 shrink-0" />
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
                  className="group relative flex items-center h-11 px-2 text-[15px] font-medium text-white transition-colors duration-200 hover:text-[#CCCCCC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF] rounded-md"
                >
                  <span>{lang === "te" ? link.labelTe : link.labelEn}</span>
                  <span
                    className={`absolute bottom-1 left-0 h-[2px] w-full bg-[#1E6FFF] transition-all duration-200 origin-center ${
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
          <div className="flex items-center justify-end shrink-0">
            <div
              className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium bg-white/10 rounded-full px-2 py-0.5 border border-white/15"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`transition-colors duration-200 rounded px-1.5 py-0.5 ${
                  lang === "en"
                    ? "font-bold text-[#1E6FFF] bg-white/20"
                    : "text-slate-300 hover:text-white"
                }`}
                aria-label="Switch language to English"
                aria-pressed={lang === "en"}
              >
                EN
              </button>

              <span
                className="inline-block w-[1px] h-3 bg-white/30"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => onLanguageChange("te")}
                className={`transition-colors duration-200 rounded px-1.5 py-0.5 ${
                  lang === "te"
                    ? "font-bold text-[#1E6FFF] bg-white/20"
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
                        ? "bg-blue-50 text-[#1E6FFF] font-bold"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin
                        className={`h-4 w-4 ${
                          isSelected ? "text-[#1E6FFF]" : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm">{loc}, Nellore</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-[#1E6FFF]" />}
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
