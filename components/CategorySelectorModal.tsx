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

  // 1. AC Services Sub-Categories ONLY
  const acServiceItems: ServiceSubItem[] = [
    {
      id: "ac-foam-jet",
      titleEn: "Split AC Foam Jet Service",
      titleTe: "స్ప్లిట్ ఏసీ ఫోమ్ జెట్ సర్వీస్",
      badgeEn: "45 mins",
      badgeTe: "45 నిమిషాలు",
      imageSrc: "/images/service-ac-foamjet.jpg",
      href: "/book?service=ac-services&plan=foam-jet",
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
      href: "/book?service=ac-services&plan=foam-jet",
      priceEn: "₹499",
      priceTe: "₹499",
    },
    {
      id: "coil-coating",
      titleEn: "Anti-Rust Coil Coating",
      titleTe: "కాయిల్ రక్షణ కోటింగ్",
      badgeEn: "30 mins",
      badgeTe: "30 నిమిషాలు",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/book?service=ac-services&plan=foam-jet",
      priceEn: "₹399",
      priceTe: "₹399",
    },
    {
      id: "ac-diagnosis",
      titleEn: "AC Not Cooling / Diagnosis",
      titleTe: "కూలింగ్ సమస్య & డయాగ్నోసిస్",
      badgeEn: "30-min call",
      badgeTe: "30 నిమి కాల్",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/book?service=ac-services&plan=repair-diagnosis",
      priceEn: "₹299",
      priceTe: "₹299",
    },
    {
      id: "ac-gas-leak",
      titleEn: "Gas Leak Fix & Refill",
      titleTe: "గ్యాస్ లీక్ చెక్ & రీఫిల్",
      badgeEn: "Standard Gas",
      badgeTe: "స్టాండర్డ్ గ్యాస్",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/book?service=ac-services&plan=repair-diagnosis",
      priceEn: "₹1,899",
      priceTe: "₹1,899",
    },
    {
      id: "ac-install",
      titleEn: "Split AC Installation",
      titleTe: "స్ప్లిట్ ఏసీ ఇన్‌స్టాలేషన్",
      badgeEn: "Level Rigged",
      badgeTe: "పర్ఫెక్ట్ ఫిట్టింగ్",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/book?service=ac-services&plan=installation-uninstallation",
      priceEn: "₹799",
      priceTe: "₹799",
    },
    {
      id: "ac-uninstall",
      titleEn: "Safe AC Uninstallation",
      titleTe: "సురక్షిత ఏసీ అన్‌ఇన్‌స్టాల్",
      badgeEn: "Zero Gas Loss",
      badgeTe: "గ్యాస్ వేస్ట్ కాదు",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/book?service=ac-services&plan=installation-uninstallation",
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
      href: "/book?service=ac-services&plan=installation-uninstallation",
      priceEn: "₹1,199",
      priceTe: "₹1,199",
    },
  ];

  // 2. Pest Control Sub-Categories ONLY
  const pestServiceItems: ServiceSubItem[] = [
    {
      id: "pest-1bhk",
      titleEn: "General Pest Control – 1 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 1 BHK",
      badgeEn: "30-Day Guarantee",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=1bhk",
      priceEn: "₹799",
      priceTe: "₹799",
    },
    {
      id: "pest-2bhk",
      titleEn: "General Pest Control – 2 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 2 BHK",
      badgeEn: "30-Day Guarantee",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=2bhk",
      priceEn: "₹1,099",
      priceTe: "₹1,099",
    },
    {
      id: "pest-3bhk",
      titleEn: "General Pest Control – 3 BHK",
      titleTe: "సాధారణ పురుగుల నివారణ – 3 BHK",
      badgeEn: "30-Day Guarantee",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=3bhk",
      priceEn: "₹1,399",
      priceTe: "₹1,399",
    },
    {
      id: "pest-bedbug-1room",
      titleEn: "Bedbug Heat & Chemical – 1 Room",
      titleTe: "నల్లుల నివారణ – 1 గది",
      badgeEn: "2 Visits Incl.",
      badgeTe: "2 సార్లు తనిఖీ",
      imageSrc: "/images/service-pest-bedbug.jpg",
      href: "/book?service=pest-control&plan=bedbug",
      priceEn: "₹1,299",
      priceTe: "₹1,299",
    },
    {
      id: "pest-bedbug-home",
      titleEn: "Bedbug Complete Home (2-3 Rooms)",
      titleTe: "నల్లుల పూర్తి ఇల్లు ప్యాకేజీ",
      badgeEn: "60-Day Guarantee",
      badgeTe: "60 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-bedbug.jpg",
      href: "/book?service=pest-control&plan=bedbug",
      priceEn: "₹2,199",
      priceTe: "₹2,199",
    },
    {
      id: "pest-termite-spot",
      titleEn: "Termite Spot Injection Treatment",
      titleTe: "చెదపురుగుల స్పాట్ ఇంజెక్షన్",
      badgeEn: "Per Sq. Ft.",
      badgeTe: "చదరపు అడుగుకి",
      imageSrc: "/images/service-pest-termite.jpg",
      href: "/book?service=pest-control&plan=termite",
      priceEn: "₹22/sqft",
      priceTe: "₹22/sqft",
    },
    {
      id: "pest-termite-full",
      titleEn: "Termite Wall Drilling & Chemical Barrier",
      titleTe: "చెదపురుగుల గోడ డ్రిల్లింగ్ రక్షణ",
      badgeEn: "1-Year Warranty",
      badgeTe: "1 సంవత్సరం గ్యారెంటీ",
      imageSrc: "/images/service-pest-termite.jpg",
      href: "/book?service=pest-control&plan=termite",
      priceEn: "₹3,499",
      priceTe: "₹3,499",
    },
  ];

  // 3. Home Deep Cleaning Sub-Categories ONLY
  const cleaningServiceItems: ServiceSubItem[] = [
    {
      id: "clean-1bhk",
      titleEn: "1 BHK Full Home Deep Clean",
      titleTe: "1 BHK ఇల్లు డీప్ క్లీన్",
      badgeEn: "3-4 hrs",
      badgeTe: "3-4 గంటలు",
      imageSrc: "/images/service-cleaning-home.jpg",
      href: "/book?service=home-deep-cleaning&plan=1bhk",
      priceEn: "₹2,499",
      priceTe: "₹2,499",
    },
    {
      id: "clean-2bhk",
      titleEn: "2 BHK Deep Clean",
      titleTe: "2 BHK డీప్ క్లీన్",
      badgeEn: "4-5 hrs",
      badgeTe: "4-5 గంటలు",
      imageSrc: "/images/service-cleaning-home.jpg",
      href: "/book?service=home-deep-cleaning&plan=2bhk",
      priceEn: "₹3,499",
      priceTe: "₹3,499",
    },
    {
      id: "clean-3bhk",
      titleEn: "3 BHK Deep Clean",
      titleTe: "3 BHK డీప్ క్లీన్",
      badgeEn: "5-6 hrs",
      badgeTe: "5-6 గంటలు",
      imageSrc: "/images/service-cleaning-home.jpg",
      href: "/book?service=home-deep-cleaning&plan=3bhk",
      priceEn: "₹4,499",
      priceTe: "₹4,499",
    },
    {
      id: "clean-villa",
      titleEn: "Gruhapravesam / Villa",
      titleTe: "గృహప్రవేశం / విల్లా డీప్ క్లీన్",
      badgeEn: "Full Day Care",
      badgeTe: "పూర్తి రోజు సేవ",
      imageSrc: "/images/service-cleaning-home.jpg",
      href: "/book?service=home-deep-cleaning&plan=3bhk",
      priceEn: "₹5,999",
      priceTe: "₹5,999",
    },
    {
      id: "clean-kitchen",
      titleEn: "Kitchen Deep Degreasing",
      titleTe: "కిచెన్ డీగ్రీసింగ్ & టైల్స్ వాష్",
      badgeEn: "90 mins",
      badgeTe: "90 నిమిషాలు",
      imageSrc: "/images/service-cleaning-kitchen.jpg",
      href: "/book?service=home-deep-cleaning&plan=kitchen-bathroom",
      priceEn: "₹699",
      priceTe: "₹699",
    },
    {
      id: "clean-bathroom",
      titleEn: "Bathroom Acid-Free Descale",
      titleTe: "బాత్‌రూమ్ డీస్కేలింగ్ & శానిటైజ్",
      badgeEn: "60 mins",
      badgeTe: "60 నిమిషాలు",
      imageSrc: "/images/service-cleaning-bathroom.jpg",
      href: "/book?service=home-deep-cleaning&plan=kitchen-bathroom",
      priceEn: "₹499",
      priceTe: "₹499",
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
        {/* Mobile Swipe Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#111111] flex items-center gap-2">
              <span>
                {lang === "te"
                  ? "మీకు అవసరమైన సర్వీస్ ఎంచుకోండి"
                  : "Select Your Service Category"}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>{lang === "te" ? "₹0 అడ్వాన్స్" : "₹0 Advance"}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                <Clock className="h-3 w-3" />
                <span>{lang === "te" ? "30 నిమిషాల్లో కాల్" : "30-Min Call"}</span>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 Strict Category Tabs: AC / Pest / Cleaning (Urban Company Pills) */}
        <div className="grid grid-cols-3 gap-2 px-3 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab("ac")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ac"
                ? "bg-[#1E6FFF] text-white shadow-sm scale-[1.01]"
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
                ? "bg-[#1E6FFF] text-white shadow-sm scale-[1.01]"
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
                ? "bg-[#1E6FFF] text-white shadow-sm scale-[1.01]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{lang === "te" ? "డీప్ క్లీనింగ్" : "Deep Clean"}</span>
          </button>
        </div>

        {/* Scrollable Body: Sub-Categories Compact App Grid */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              {activeTab === "ac" && (lang === "te" ? "ఏసీ సర్వీసులు & రిపేర్" : "AC Servicing, Repair & Shifting")}
              {activeTab === "pest" && (lang === "te" ? "పురుగుల నియంత్రణ ప్యాకేజీలు" : "Residential Pest Control Packages")}
              {activeTab === "cleaning" && (lang === "te" ? "హోమ్ డీప్ క్లీనింగ్ ప్యాకేజీలు" : "Home Deep Cleaning Packages")}
            </h4>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {currentItems.length} {lang === "te" ? "ఎంపికలు" : "options"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {currentItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-xl bg-[#F8FAFC] hover:bg-white border border-slate-200/90 hover:border-[#1E6FFF] p-2 sm:p-3 text-left transition-all duration-150 hover:shadow-md active:scale-[0.98]"
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
                  {/* Badge */}
                  <div className="absolute top-1.5 left-1.5 inline-flex items-center rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-slate-800 shadow-2xs">
                    <span>{lang === "te" ? item.badgeTe : item.badgeEn}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-0.5">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-[#1E6FFF] transition-colors leading-snug line-clamp-2">
                    {lang === "te" ? item.titleTe : item.titleEn}
                  </div>
                  {/* Price */}
                  <div className="text-xs font-black text-[#1E6FFF]">
                    {lang === "te" ? `${item.priceTe} నుండి` : `From ${item.priceEn}`}
                  </div>
                </div>

                {/* Instant Book CTA Pill */}
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-[#1E6FFF]">
                  <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href={currentCategoryPage}
            onClick={onClose}
            className="font-bold text-[#1E6FFF] hover:underline inline-flex items-center gap-1 text-[11px] sm:text-xs"
          >
            <span>
              {lang === "te" ? "పూర్తి వివరాలు చూడండి" : "View complete scope"}
            </span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <a
            href="tel:+917676358162"
            className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-[#1E6FFF] text-[11px] sm:text-xs"
          >
            <Phone className="h-3 w-3 text-emerald-600" />
            <span>{lang === "te" ? "76763 58162" : "76763 58162"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
