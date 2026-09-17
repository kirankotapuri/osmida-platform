"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Language } from "@/lib/translations";
import {
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Snowflake,
  Shield,
  CheckCircle2,
  Phone,
} from "lucide-react";

interface CategorySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: "ac" | "pest" | "cleaning";
}

interface ServiceSubItem {
  id: string;
  titleEn: string;
  titleTe: string;
  badgeEn: string;
  badgeTe: string;
  imageSrc: string;
  href: string;
  priceEn: string;
  priceTe: string;
}

export function CategorySelectorModal({
  isOpen,
  onClose,
  lang,
  initialTab = "ac",
}: CategorySelectorModalProps) {
  const [activeTab, setActiveTab] = useState<"ac" | "pest" | "cleaning">(initialTab);

  // Sync activeTab when initialTab changes on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // 1. AC Services Sub-Categories ONLY -> Routes to /ac-services
  const acServiceItems: ServiceSubItem[] = [
    {
      id: "ac-foam-jet",
      titleEn: "Split AC Foam Jet Service",
      titleTe: "స్ప్లిట్ ఏసీ ఫోమ్ జెట్ సర్వీస్",
      badgeEn: "45 mins",
      badgeTe: "45 నిమిషాలు",
      imageSrc: "/images/service-ac-foamjet.jpg",
      href: "/ac-services",
      priceEn: "₹599",
      priceTe: "₹599",
    },
    {
      id: "window-ac",
      titleEn: "Window AC Jet Wash",
      titleTe: "విండో ఏసీ జెట్ వాష్",
      badgeEn: "45 mins",
      badgeTe: "45 నిమిషాలు",
      imageSrc: "/images/service-ac-foamjet.jpg",
      href: "/ac-services",
      priceEn: "₹499",
      priceTe: "₹499",
    },
    {
      id: "ac-diagnosis",
      titleEn: "AC Not Cooling / Diagnosis",
      titleTe: "కూలింగ్ సమస్య & డయాగ్నోసిస్",
      badgeEn: "30-min call",
      badgeTe: "30 నిమి కాల్",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/ac-services",
      priceEn: "₹299",
      priceTe: "₹299",
    },
    {
      id: "water-leak",
      titleEn: "Water Leakage Resolution",
      titleTe: "వాటర్ లీకేజ్ రిపేర్",
      badgeEn: "30 mins",
      badgeTe: "30 నిమిషాలు",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/ac-services",
      priceEn: "₹349",
      priceTe: "₹349",
    },
    {
      id: "ac-gas-leak",
      titleEn: "Gas Leak Fix & Refill",
      titleTe: "గ్యాస్ లీక్ చెక్ & రీఫిల్",
      badgeEn: "Standard Gas",
      badgeTe: "స్టాండర్డ్ గ్యాస్",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/ac-services",
      priceEn: "₹1,999",
      priceTe: "₹1,999",
    },
    {
      id: "ac-install",
      titleEn: "Split AC Installation",
      titleTe: "స్ప్లిట్ ఏసీ ఇన్‌స్టాలేషన్",
      badgeEn: "Level Rigged",
      badgeTe: "పర్ఫెక్ట్ ఫిట్టింగ్",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/ac-services",
      priceEn: "₹899",
      priceTe: "₹899",
    },
    {
      id: "ac-uninstall",
      titleEn: "Safe AC Uninstallation",
      titleTe: "సురక్షిత ఏసీ అన్‌ఇన్‌స్టాల్",
      badgeEn: "Zero Gas Loss",
      badgeTe: "గ్యాస్ వేస్ట్ కాదు",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/ac-services",
      priceEn: "₹499",
      priceTe: "₹499",
    },
    {
      id: "ac-shifting",
      titleEn: "Complete AC Shifting (Within Nellore)",
      titleTe: "ఏసీ షిఫ్టింగ్ & రీ-ఫిట్టింగ్",
      badgeEn: "Doorstep Care",
      badgeTe: "ఇంటి వద్దకే",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/ac-services",
      priceEn: "₹1,299",
      priceTe: "₹1,299",
    },
  ];

  // 2. Pest Control Sub-Categories ONLY -> Routes to /pest-control
  const pestServiceItems: ServiceSubItem[] = [
    {
      id: "pest-1bhk",
      titleEn: "General Pest Control – 1 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 1 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/pest-control",
      priceEn: "₹1,499",
      priceTe: "₹1,499",
    },
    {
      id: "pest-2bhk",
      titleEn: "General Pest Control – 2 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 2 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/pest-control",
      priceEn: "₹1,999",
      priceTe: "₹1,999",
    },
    {
      id: "pest-3bhk",
      titleEn: "General Pest Control – 3 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 3 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/pest-control",
      priceEn: "₹2,499",
      priceTe: "₹2,499",
    },
    {
      id: "pest-bedbug-1room",
      titleEn: "Bedbug Treatment – Per Room",
      titleTe: "నల్లుల నివారణ – ప్రతి గది",
      badgeEn: "Targeted Care",
      badgeTe: "ప్రత్యేక చికిత్స",
      imageSrc: "/images/service-pest-bedbug.jpg",
      href: "/pest-control",
      priceEn: "₹999/room",
      priceTe: "గదికి ₹999",
    },
    {
      id: "pest-bedbug-home",
      titleEn: "Bedbug Complete Home Protocol",
      titleTe: "నల్లుల పూర్తి ఇల్లు ప్యాకేజీ",
      badgeEn: "2 Visits Incl.",
      badgeTe: "2 సార్లు తనిఖీ",
      imageSrc: "/images/service-pest-bedbug.jpg",
      href: "/pest-control",
      priceEn: "₹2,199",
      priceTe: "₹2,199",
    },
    {
      id: "pest-termite-spot",
      titleEn: "Termite Drill-Fill-Seal Treatment",
      titleTe: "చెదపురుగుల డ్రిల్లింగ్ రక్షణ",
      badgeEn: "Per Sq. Ft.",
      badgeTe: "చదరపు అడుగుకి",
      imageSrc: "/images/termite-banner.jpg",
      href: "/pest-control",
      priceEn: "₹8/sqft",
      priceTe: "చ.అ.కు ₹8",
    },
    {
      id: "pest-kitchen-addon",
      titleEn: "Kitchen Deep Gel Treatment",
      titleTe: "కిచెన్ డీప్ జెల్ చికిత్స",
      badgeEn: "Odorless Gel",
      badgeTe: "వాసన లేని జెల్",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/pest-control",
      priceEn: "₹699",
      priceTe: "₹699",
    },
  ];

  // 3. Bathroom & Kitchen Deep Cleaning ONLY (Matching exact Urban Company Screenshots) -> Routes to /home-deep-cleaning
  const cleaningServiceItems: ServiceSubItem[] = [
    {
      id: "clean-bath-single",
      titleEn: "Intense Bathroom Cleaning",
      titleTe: "బాత్‌రూమ్ మెషిన్ స్క్రబ్ & డీస్కేలింగ్",
      badgeEn: "50 mins",
      badgeTe: "50 నిమిషాలు",
      imageSrc: "/images/bathroom-scrub-banner.jpg",
      href: "/home-deep-cleaning?tab=bathroom",
      priceEn: "₹449",
      priceTe: "₹449",
    },
    {
      id: "clean-bath-2pack",
      titleEn: "2 Bathrooms Scrub Pack",
      titleTe: "2 బాత్‌రూమ్‌ల మెషిన్ స్క్రబ్ ప్యాక్",
      badgeEn: "Popular Combo",
      badgeTe: "బెస్ట్ కాంబో",
      imageSrc: "/images/bathroom-scrub-banner.jpg",
      href: "/home-deep-cleaning?tab=bathroom",
      priceEn: "₹899",
      priceTe: "₹899",
    },
    {
      id: "clean-bath-3pack",
      titleEn: "3 Bathrooms Scrub Pack",
      titleTe: "3 బాత్‌రూమ్‌ల మెషిన్ స్క్రబ్ ప్యాక్",
      badgeEn: "₹433/bath",
      badgeTe: "₹433/బాత్",
      imageSrc: "/images/service-cleaning-bathroom.jpg",
      href: "/home-deep-cleaning?tab=bathroom",
      priceEn: "₹1,299",
      priceTe: "₹1,299",
    },
    {
      id: "clean-bath-4pack",
      titleEn: "4 Bathrooms Scrub Pack",
      titleTe: "4 బాత్‌రూమ్‌ల మెషిన్ స్క్రబ్ ప్యాక్",
      badgeEn: "Best Value",
      badgeTe: "బెస్ట్ వాల్యూ",
      imageSrc: "/images/bathroom-scrub-banner.jpg",
      href: "/home-deep-cleaning?tab=bathroom",
      priceEn: "₹1,699",
      priceTe: "₹1,699",
    },
    {
      id: "clean-kitchen-chimney",
      titleEn: "Regular Chimney & Stove Cleaning",
      titleTe: "చిమ్నీ & గ్యాస్ స్టవ్ డీప్ డిగ్రీస్",
      badgeEn: "Bestseller",
      badgeTe: "బెస్ట్‌సెల్లర్",
      imageSrc: "/images/service-cleaning-chimney.jpg",
      href: "/home-deep-cleaning?tab=kitchen",
      priceEn: "₹649",
      priceTe: "₹649",
    },
    {
      id: "clean-kitchen-slab",
      titleEn: "Kitchen Sink & Slab Deep Clean",
      titleTe: "కిచెన్ సింక్ & స్లాబ్ డీప్ క్లీన్",
      badgeEn: "Popular",
      badgeTe: "పాపులర్",
      imageSrc: "/images/service-cleaning-counter.jpg",
      href: "/home-deep-cleaning?tab=kitchen",
      priceEn: "₹399",
      priceTe: "₹399",
    },
    {
      id: "clean-kitchen-fridge",
      titleEn: "Refrigerator Deep Clean",
      titleTe: "ఫ్రిడ్జ్ సమగ్ర డీప్ క్లీన్ (లోపల & బయట)",
      badgeEn: "Food Safe",
      badgeTe: "ఆహార సురక్షితం",
      imageSrc: "/images/service-cleaning-fridge.jpg",
      href: "/home-deep-cleaning?tab=kitchen",
      priceEn: "₹349",
      priceTe: "₹349",
    },
    {
      id: "clean-kitchen-full",
      titleEn: "Complete Kitchen Deep Clean",
      titleTe: "సంపూర్ణ కిచెన్ డీప్ క్లీనింగ్",
      badgeEn: "Full Kitchen",
      badgeTe: "పూర్తి కిచెన్",
      imageSrc: "/images/kitchen-after.jpg",
      href: "/home-deep-cleaning?tab=kitchen",
      priceEn: "₹1,249",
      priceTe: "₹1,249",
    },
  ];

  const currentItems =
    activeTab === "ac"
      ? acServiceItems
      : activeTab === "pest"
      ? pestServiceItems
      : cleaningServiceItems;

  const currentCategoryPage =
    activeTab === "ac"
      ? "/ac-services"
      : activeTab === "pest"
      ? "/pest-control"
      : "/home-deep-cleaning";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300 p-0 sm:p-4">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Urban Company-Style Bottom Sheet Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col z-10 border border-slate-200 animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-xs font-black text-xs">
              O
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {lang === "te" ? "సర్వీస్ ఎంచుకోండి" : "Select Service Category"}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                {lang === "te"
                  ? "నెల్లూరులో 30 నిమిషాల్లో ప్రొఫెషనల్స్ రాక • ₹0 అడ్వాన్స్"
                  : "Verified Pros in Nellore • ₹0 Advance Booking"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Selector Tabs (3 Categories ONLY) */}
        <div className="grid grid-cols-3 gap-1.5 p-2.5 sm:p-3 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("ac")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ac"
                ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/15 scale-[1.01]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Snowflake className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lang === "te" ? "ఏసీ సర్వీస్" : "AC Services"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pest")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "pest"
                ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/15 scale-[1.01]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Shield className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lang === "te" ? "పురుగుల నివారణ" : "Pest Control"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cleaning")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "cleaning"
                ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/15 scale-[1.01]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lang === "te" ? "డీప్ క్లీనింగ్" : "Deep Clean"}</span>
          </button>
        </div>

        {/* Scrollable Body: Sub-Categories Compact App Grid */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-3 bg-[#F8FAFC]">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              {activeTab === "ac" && (lang === "te" ? "ఏసీ సర్వీసులు & రిపేర్" : "AC Servicing, Repair & Shifting")}
              {activeTab === "pest" && (lang === "te" ? "పురుగుల నియంత్రణ ప్యాకేజీలు" : "Residential Pest Control Packages")}
              {activeTab === "cleaning" && (lang === "te" ? "హోమ్ & బాత్‌రూమ్ డీప్ క్లీనింగ్" : "Home & Bathroom Deep Cleaning")}
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
              {currentItems.length} {lang === "te" ? "ఎంపికలు" : "options"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {currentItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-xl bg-white border border-slate-200 hover:border-slate-800 p-2 sm:p-3 text-left transition-all duration-150 hover:shadow-md active:scale-[0.98]"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-20 sm:h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.titleEn}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 140px, 200px"
                  />
                  {/* High-Contrast Badge */}
                  <div className="absolute top-1.5 left-1.5 inline-flex items-center rounded-md bg-[#0F172A]/90 backdrop-blur-xs border border-white/20 px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-white shadow-xs">
                    <span>{lang === "te" ? item.badgeTe : item.badgeEn}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-0.5">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-black transition-colors leading-snug line-clamp-2">
                    {lang === "te" ? item.titleTe : item.titleEn}
                  </div>
                  {/* Price */}
                  <div className="text-xs sm:text-sm font-black text-[#0F172A]">
                    {lang === "te" ? `${item.priceTe} నుండి` : `From ${item.priceEn}`}
                  </div>
                </div>

                {/* Direct Page Link CTA */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-slate-900">
                    {lang === "te" ? "చూడండి" : "View"}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-700">
              {lang === "te" ? "₹0 అడ్వాన్స్ • పని అయ్యాకే చెల్లించండి" : "₹0 Advance • Pay after service"}
            </span>
          </div>

          <Link
            href={currentCategoryPage}
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F172A] hover:bg-black px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
          >
            <span>{lang === "te" ? "పూర్తి పేజీని చూడండి" : "Explore All Packages"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
