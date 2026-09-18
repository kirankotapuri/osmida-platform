"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Language } from "@/lib/translations";
import { UCServiceCard, UCServiceItemData } from "@/components/UCServiceCard";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { UCServiceDetailModal } from "@/components/UCServiceDetailModal";
import { UCSubcategoryTabs, SubcategoryTabItem } from "@/components/UCSubcategoryTabs";
import { UCSubcategoryMenuModal, MenuSubcategory } from "@/components/UCSubcategoryMenuModal";
import { PEST_SERVICE_ITEMS } from "@/lib/ucServiceData";
import {
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Search,
  Share2,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  Check,
} from "lucide-react";

export default function PestControlPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("cockroach");
  const [selectedDetailItem, setSelectedDetailItem] = useState<UCServiceItemData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetail = (item: UCServiceItemData) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const scrollToSubcategory = (subId: string) => {
    setActiveTab(subId);
    const element = document.getElementById(subId);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const subcategoryTabs: SubcategoryTabItem[] = [
    {
      id: "cockroach",
      nameEn: "Cockroach Control",
      nameTe: "బొద్దింకల నివారణ",
      image: "/images/service-pest-general.jpg",
      badge: "60-Day Warranty",
    },
    {
      id: "termite",
      nameEn: "Termite Control",
      nameTe: "చెదలు నివారణ",
      image: "/images/termite-banner.jpg",
      badge: "Drill-Fill-Seal",
    },
    {
      id: "bedbugs-ants",
      nameEn: "Ants & Bed Bugs",
      nameTe: "నల్లులు & చీమలు",
      image: "/images/service-pest-bedbug.jpg",
    },
  ];

  const menuCategories: MenuSubcategory[] = [
    { id: "cockroach", nameEn: "Cockroach Control", nameTe: "బొద్దింకల నివారణ", itemCount: 4 },
    { id: "termite", nameEn: "Termite Control", nameTe: "చెదలు నివారణ", itemCount: 2 },
    { id: "bedbugs-ants", nameEn: "Ants & Bed Bugs", nameTe: "నల్లులు & చీమలు", itemCount: 3 },
  ];

  const cockroachItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "cockroach");
  const bedbugAntItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "bedbugs-ants");

  // --- "CHOOSE YOUR SPACE" INTERACTIVE STATE & PRICING ---
  type SpaceTier = "1200-2400" | "2500-4000" | "4000-6000";
  const [selectedSpace, setSelectedSpace] = useState<SpaceTier>("1200-2400");

  const SPACE_OPTIONS = [
    {
      id: "1200-2400" as const,
      labelEn: "1200-2400 sq. ft.",
      labelTe: "1200-2400 చ.అ.",
      displayPrice: "₹8,499",
      apartmentPrice: 3999,
      apartmentOriginalPrice: 4999,
      bungalowPrice: 8499,
      bungalowOriginalPrice: 9999,
    },
    {
      id: "2500-4000" as const,
      labelEn: "2500-4000 sq. ft.",
      labelTe: "2500-4000 చ.అ.",
      displayPrice: "₹9,999",
      apartmentPrice: 5499,
      apartmentOriginalPrice: 6999,
      bungalowPrice: 9999,
      bungalowOriginalPrice: 11999,
    },
    {
      id: "4000-6000" as const,
      labelEn: "4000-6000 sq. ft.",
      labelTe: "4000-6000 చ.అ.",
      displayPrice: "₹12,500",
      apartmentPrice: 7499,
      apartmentOriginalPrice: 8999,
      bungalowPrice: 12500,
      bungalowOriginalPrice: 14999,
    },
  ];

  const currentSpaceOption = SPACE_OPTIONS.find((s) => s.id === selectedSpace) || SPACE_OPTIONS[0];

  const dynamicTermiteItems: UCServiceItemData[] = [
    {
      id: `pest-termite-apartment-${selectedSpace}`,
      titleEn: `Apartment termite control (${currentSpaceOption.labelEn})`,
      titleTe: `అపార్ట్‌మెంట్ చెదలు నివారణ (${currentSpaceOption.labelTe})`,
      price: currentSpaceOption.apartmentPrice,
      originalPrice: currentSpaceOption.apartmentOriginalPrice,
      durationEn: "2 hrs",
      durationTe: "2 గంటలు",
      rating: "4.83",
      reviews: "18k",
      badge: currentSpaceOption.labelEn,
      optionsCount: "3 area options",
      inclusionsEn: [
        `Complete termite treatment configured for ${currentSpaceOption.labelEn} apartment`,
        "Precision hole drilling at 1-foot intervals along skirting walls",
        "Chemical injection to create subterranean barrier and stop termite spread",
        "White cement sealing of all holes to restore wall aesthetic",
        "1-year service warranty included",
      ],
      inclusionsTe: [
        `${currentSpaceOption.labelTe} అపార్ట్‌మెంట్ల కోసం సమగ్ర చెదలు నివారణ`,
        "గోడల వద్ద 1 అడుగు దూరంలో రంధ్రాలు వేసి కెమికల్ ఇంజెక్షన్",
        "చెదలు వ్యాపించకుండా కెమికల్ బారియర్ ఏర్పాటు",
        "రంధ్రాలను వైట్ సిమెంట్‌తో భద్రంగా మూసివేయడం",
        "1 సంవత్సరం పూర్తి వారంటీ",
      ],
      imageSrc: "/images/termite-banner.jpg",
      category: "pest",
      subcategory: "termite",
    },
    {
      id: `pest-termite-bungalow-${selectedSpace}`,
      titleEn: `Bungalow termite control (${currentSpaceOption.labelEn})`,
      titleTe: `బంగ్లా / విల్లా చెదలు నివారణ (${currentSpaceOption.labelTe})`,
      price: currentSpaceOption.bungalowPrice,
      originalPrice: currentSpaceOption.bungalowOriginalPrice,
      durationEn: "3 hrs 30 mins",
      durationTe: "3 గంటల 30 నిమిషాలు",
      rating: "4.84",
      reviews: "772",
      badge: currentSpaceOption.labelEn,
      optionsCount: "3 area options",
      inclusionsEn: [
        `Extensive termite protection for ${currentSpaceOption.labelEn} independent homes & villas`,
        "Covers wooden doors, wardrobes, skirting, and wall perimeters",
        "Detailed drilling, high-pressure chemical injection & white cement application",
        "Long-term warranty with free annual inspection",
      ],
      inclusionsTe: [
        `${currentSpaceOption.labelTe} పెద్ద ఇళ్ళు, బంగ్లాలు మరియు విల్లాల కోసం పూర్తి చెదలు రక్షణ`,
        "చెక్క తలుపులు, అల్మారాలు మరియు గోడల మూలల రక్షణ",
        "హై-ప్రెజర్ కెమికల్ ఇంజెక్షన్ మరియు వైట్ సిమెంట్ సీలింగ్",
        "వార్షిక ఉచిత తనిఖీ వారంటీ",
      ],
      imageSrc: "/images/service-pest-termite.jpg",
      category: "pest",
      subcategory: "termite",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida Pest & Termite Control Nellore",
        text: "Book Odorless Cockroach, Termite & Bedbug Control in Nellore with 60-Day Warranty!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-28">
      {/* 1. TOP APP HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. CATEGORY TOP BAR */}
      <div className="pt-14 sm:pt-16 bg-white">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-slate-800" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSubcategory("cockroach")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Search services"
            >
              <Search className="h-4 w-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Share service"
            >
              <Share2 className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* 3. HERO CARD (Matching AC Services Clean Professional Layout) */}
        <div className="mx-auto max-w-xl px-4 pb-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left Headline */}
            <div className="space-y-1">
              <span className="inline-block bg-[#007F5F] text-white text-[10px] font-black px-2 py-0.5 rounded-xs tracking-wider uppercase">
                ★ INSTANT
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {lang === "te" ? "బొద్దింకలు & చెదలు నివారణ 60 నిమిషాల్లో" : "Cockroach & termite\ncontrol in 60 mins"}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {lang === "te" ? "ప్రారంభ ధర ₹699" : "Starts at ₹699"}
              </p>
            </div>

            {/* Right Hero Image (Technician in black uniform kneeling with drill) */}
            <div className="relative h-28 w-32 sm:h-32 sm:w-36 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
              <Image
                src="/images/termite-banner.jpg"
                alt="Pest & Termite Control Pro"
                fill
                className="object-cover"
                priority
                sizes="144px"
              />
            </div>
          </div>

          {/* 4. RATING & OSMIDA COVER GUARANTEE STRIP */}
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">Pest Control</span>
                <div className="flex items-center gap-1 text-xs text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  <span className="font-black">4.84</span>
                  <span className="text-slate-500">(1.5M reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#007F5F] px-2 py-0.5 rounded-md text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#007F5F]" />
                <span>{lang === "te" ? "ధృవీకరించిన నిపుణులు" : "Verified Pros"}</span>
              </div>
            </div>

            {/* Osmida Cover Banner */}
            <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2 text-xs border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-extrabold text-slate-900">OSMIDA COVER</span>
                <span className="text-slate-500 text-[11px]">
                  {lang === "te"
                    ? "ట్రీట్‌మెంట్‌లపై 60 రోజుల వరకు ఉచిత వారంటీ"
                    : "Upto 60 days warranty on treatments"}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. STICKY SUBCATEGORY ICON TABS */}
      <UCSubcategoryTabs
        items={subcategoryTabs}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 6. CONTENT SECTIONS */}
      <div className="mx-auto max-w-xl px-4 divide-y divide-slate-100">
        {/* SECTION A: COCKROACH CONTROL */}
        <section id="cockroach" className="pt-6 pb-4 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "వంటగది & బాత్‌రూమ్ బొద్దింకలు" : "Kitchen/Bathroom"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted Bayer gel baiting with 2 visits gap
            </p>
          </div>

          <div className="space-y-1">
            {cockroachItems.slice(0, 2).map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>

          <div className="pt-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {lang === "te" ? "అపార్ట్‌మెంట్ & బంగ్లా ప్యాకేజీలు" : "Apartment/Bungalow"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Full residential eradication with spray + gel
            </p>
          </div>

          <div className="space-y-1">
            {cockroachItems.slice(2).map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>
        </section>

        {/* SECTION B: TERMITE CONTROL (Screenshot 2: Choose your space) */}
        <section id="termite" className="pt-6 pb-4 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "మీ స్థలాన్ని ఎంచుకోండి" : "Choose your space"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Drill-Fill-Seal chemical barrier for wooden & skirting protection
            </p>
          </div>

          {/* Area Selector Quick Chips (Interactive Choose your space) */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {SPACE_OPTIONS.map((opt) => {
              const isSelected = selectedSpace === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSpace(opt.id)}
                  className={`rounded-2xl p-3 shrink-0 text-center min-w-[130px] sm:min-w-[140px] transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-purple-600 bg-purple-50 text-purple-900 shadow-sm scale-[1.02]"
                      : "border border-slate-200 bg-white hover:border-slate-300 text-slate-700 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    {isSelected && <Check className="h-3.5 w-3.5 text-purple-700 stroke-[3]" />}
                    <span className={`text-[11px] font-bold block ${isSelected ? "text-purple-950 font-black" : "text-slate-600"}`}>
                      {lang === "te" ? opt.labelTe : opt.labelEn}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-black block ${isSelected ? "text-purple-700" : "text-slate-900"}`}>
                    {opt.displayPrice}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            {dynamicTermiteItems.map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>

          {/* Termite 4-Step Process Visual Cards (Screenshot 2) */}
          <div className="rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Included in Termite Treatment
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-left">
              <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">1. Hole drill inspection</span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  1 hole drilled at 1-foot interval along skirting walls
                </p>
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">2. Chemical injection</span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Specialized barrier spray & injection to stop spread
                </p>
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">3. White cement sealing</span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Seals all drilled holes neatly to prevent infestation
                </p>
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-900 block">4. Wooden surface coating</span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Sprayed on door frames, cabinets & wooden furniture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION C: ANTS & BED BUGS (Screenshot 3) */}
        <section id="bedbugs-ants" className="pt-6 pb-4 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "నల్లులు & చీమల నివారణ" : "Bed Bugs & Ant Control"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unique 2-visit treatment targeting eggs, nymphs & adults
            </p>
          </div>

          <div className="space-y-1">
            {bedbugAntItems.map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>
        </section>

      </div>

      {/* 7. FLOATING ≡ MENU MODAL */}
      <UCSubcategoryMenuModal
        categories={menuCategories}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 8. FLOATING CART DOCK */}
      <UCFloatingCartBar lang={lang} />

      {/* 10. SERVICE DETAIL BOTTOM SHEET MODAL */}
      <UCServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedDetailItem}
        lang={lang}
      />
    </main>
  );
}
