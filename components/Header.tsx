"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ lang, onLanguageChange }: HeaderProps) {
  const pathname = usePathname();

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
    <header
      className="fixed top-0 left-0 right-0 z-[1000] w-full bg-[#0B0B0F] transition-all duration-200"
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-6 h-16 lg:h-20">
        {/* Left: Logo (Osmida) */}
        <div className="w-[160px] lg:w-[180px] flex items-center shrink-0">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF] rounded-xl py-1"
            aria-label="Osmida Home Page"
          >
            <div className="relative h-9 w-9 lg:h-10 lg:w-10 overflow-hidden rounded-xl border border-white/20 bg-black transition-transform duration-200 group-hover:scale-105">
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
              <span className="text-base lg:text-lg font-black tracking-widest text-white transition-colors duration-200 group-hover:text-[#CCCCCC]">
                OSMIDA
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6] -mt-0.5">
                {lang === "te" ? "నెల్లూరు" : "Nellore"}
              </span>
            </div>
          </Link>
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
                {/* 2px blue underline animation on hover / active */}
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

        {/* Right: Language Toggle (Desktop & Mobile) */}
        <div className="flex items-center justify-end w-[160px] lg:w-[180px] shrink-0">
          <div
            className="flex items-center gap-2 text-sm font-medium"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => onLanguageChange("en")}
              className={`transition-colors duration-200 hover:text-[#CCCCCC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF] rounded px-1.5 py-1 ${
                lang === "en"
                  ? "font-bold text-[#1E6FFF]"
                  : "text-white"
              }`}
              aria-label="Switch language to English"
              aria-pressed={lang === "en"}
            >
              EN
            </button>

            {/* Small vertical divider */}
            <span
              className="inline-block w-[1px] h-4 bg-[#9AA0A6]/60"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => onLanguageChange("te")}
              className={`transition-colors duration-200 hover:text-[#CCCCCC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF] rounded px-1.5 py-1 ${
                lang === "te"
                  ? "font-bold text-[#1E6FFF]"
                  : "text-white"
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
  );
}
