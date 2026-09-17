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
      id: "gas-refill",
      titleEn: "Gas Leak Check & Refill",
      titleTe: "గ్యాస్ టాప్-అప్ & రీఫిల్",
      badgeEn: "60 mins",
      badgeTe: "60 నిమిషాలు",
      imageSrc: "/images/service-ac-repair.jpg",
      href: "/book?service=ac-services&plan=gas-refill",
      priceEn: "₹1,999",
      priceTe: "₹1,999",
    },
    {
      id: "ac-install",
      titleEn: "AC Installation",
      titleTe: "కొత్త ఏసీ ఇన్స్టాలేషన్",
      badgeEn: "Same Day",
      badgeTe: "అదే రోజు",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/book?service=ac-services&plan=ac-installation",
      priceEn: "₹899",
      priceTe: "₹899",
    },
    {
      id: "ac-shifting",
      titleEn: "Complete AC Shifting",
      titleTe: "ఏసీ షిఫ్టింగ్ & రీ-ఫిక్సింగ్",
      badgeEn: "Relocation",
      badgeTe: "రవాణా & ఫిక్స్",
      imageSrc: "/images/service-ac-install.jpg",
      href: "/book?service=ac-services&plan=ac-installation",
      priceEn: "₹1,299",
      priceTe: "₹1,299",
    },
  ];

  // 2. Pest Control Sub-Categories ONLY
  const pestServiceItems: ServiceSubItem[] = [
    {
      id: "pest-1bhk",
      titleEn: "General Pest – 1 BHK",
      titleTe: "సాధారణ పురుగులు – 1 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=general-1bhk",
      priceEn: "₹1,499",
      priceTe: "₹1,499",
    },
    {
      id: "pest-2bhk",
      titleEn: "General Pest – 2 BHK",
      titleTe: "సాధారణ పురుగులు – 2 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=general-2bhk",
      priceEn: "₹1,999",
      priceTe: "₹1,999",
    },
    {
      id: "pest-3bhk",
      titleEn: "General Pest – 3 BHK",
      titleTe: "సాధారణ పురుగులు – 3 BHK",
      badgeEn: "30-Day Warranty",
      badgeTe: "30 రోజుల వారంటీ",
      imageSrc: "/images/service-pest-general.jpg",
      href: "/book?service=pest-control&plan=general-3bhk",
      priceEn: "₹2,499",
      priceTe: "₹2,499",
    },
    {
      id: "pest-bedbug",
      titleEn: "Bedbug Treatment (Per Room)",
      titleTe: "నిద్రపురుగుల చికిత్స (ప్రతి గది)",
      badgeEn: "2 Visits Included",
      badgeTe: "2 సార్లు స్ప్రే",
      imageSrc: "/images/service-pest-bedbug.jpg",
      href: "/book?service=pest-control&plan=bedbug",
      priceEn: "₹999",
      priceTe: "₹999",
    },
    {
      id: "pest-termite",
      titleEn: "Termite Control (Per Sq. Ft.)",
      titleTe: "తెల్లచీమల నియంత్రణ (చ.అ.కు)",
      badgeEn: "Long-Term Warranty",
      badgeTe: "దీర్ఘకాలిక వారంటీ",
      imageSrc: "/images/service-pest-termite.jpg",
      href: "/book?service=pest-control&plan=termite",
      priceEn: "₹8/sq.ft",
      priceTe: "₹8/అడుగుకు",
    },
  ];

  // 3. Home Deep Cleaning Sub-Categories ONLY
  const cleaningServiceItems: ServiceSubItem[] = [
    {
      id: "clean-1bhk",
      titleEn: "1 BHK Deep Clean",
      titleTe: "1 BHK డీప్ క్లీన్",
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

      {/* Urban Company-Style Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 border border-slate-200 animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#111111] flex items-center gap-2">
              <span>
                {lang === "te"
                  ? "మీకు అవసరమైన సర్వీస్ ఎంచుకోండి"
                  : "Select Your Service Category"}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్" : "₹0 Advance"}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                <Clock className="h-3.5 w-3.5" />
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

        {/* 3 Strict Category Tabs: AC / Pest / Cleaning */}
        <div className="grid grid-cols-3 gap-2 px-5 sm:px-6 py-3 bg-slate-50 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab("ac")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ac"
                ? "bg-[#1E6FFF] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Snowflake className="h-4 w-4" />
            <span className="truncate">{lang === "te" ? "ఏసీ సర్వీస్" : "AC Services"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pest")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "pest"
                ? "bg-[#1E6FFF] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span className="truncate">{lang === "te" ? "పురుగుల నివారణ" : "Pest Control"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cleaning")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "cleaning"
                ? "bg-[#1E6FFF] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="truncate">{lang === "te" ? "హోమ్ డీప్ క్లీనింగ్" : "Deep Cleaning"}</span>
          </button>
        </div>

        {/* Scrollable Body: Sub-Categories Grid */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {activeTab === "ac" && (lang === "te" ? "ఏసీ సర్వీసులు & రిపేర్" : "AC Servicing, Repair & Shifting")}
              {activeTab === "pest" && (lang === "te" ? "పురుగుల నియంత్రణ ప్యాకేజీలు" : "Residential Pest Control Packages")}
              {activeTab === "cleaning" && (lang === "te" ? "హోమ్ డీప్ క్లీనింగ్ ప్యాకేజీలు" : "Home Deep Cleaning Packages")}
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              {currentItems.length} {lang === "te" ? "ఎంపికలు" : "options"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {currentItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group relative flex flex-col justify-between rounded-2xl bg-[#F8FAFC] hover:bg-white border border-slate-200/90 hover:border-[#1E6FFF] p-3 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]"
              >
                {/* Real Photographic Thumbnail */}
                <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.titleEn}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 160px, 240px"
                  />
                  {/* Mint Speed / Guarantee Pill on top of photo */}
                  <div className="absolute top-2 left-2 inline-flex items-center rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-800 shadow-xs">
                    <span>{lang === "te" ? item.badgeTe : item.badgeEn}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1E6FFF] transition-colors leading-snug line-clamp-2">
                    {lang === "te" ? item.titleTe : item.titleEn}
                  </div>
                  {/* Price */}
                  <div className="text-xs font-black text-[#1E6FFF]">
                    {lang === "te" ? `${item.priceTe} నుండి` : `From ${item.priceEn}`}
                  </div>
                </div>

                {/* Instant Book CTA Pill */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-[#1E6FFF]">
                  <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href={currentCategoryPage}
            onClick={onClose}
            className="font-bold text-[#1E6FFF] hover:underline inline-flex items-center gap-1"
          >
            <span>
              {lang === "te" ? "పూర్తి సర్వీస్ వివరాలు చూడండి" : "View complete scope & checklist"}
            </span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <a
            href="tel:+917676358162"
            className="font-bold text-slate-700 hover:text-[#1E6FFF]"
          >
            {lang === "te" ? "కాల్: 76763 58162" : "Helpline: 76763 58162"}
          </a>
        </div>
      </div>
    </div>
  );
}
