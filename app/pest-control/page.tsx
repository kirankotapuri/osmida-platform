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
  const termiteItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "termite");
  const bedbugAntItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "bedbugs-ants");

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

          {/* Area Selector Quick Chips (Screenshot 2) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-2.5 shrink-0 text-center min-w-[120px]">
              <span className="text-[11px] font-bold text-slate-700 block">2000-2500 sq. ft.</span>
              <span className="text-xs font-black text-purple-700 block mt-0.5">₹8,499</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shrink-0 text-center min-w-[120px]">
              <span className="text-[11px] font-bold text-slate-700 block">2500-4000 sq. ft.</span>
              <span className="text-xs font-black text-slate-900 block mt-0.5">₹9,999</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shrink-0 text-center min-w-[120px]">
              <span className="text-[11px] font-bold text-slate-700 block">4000-6000 sq. ft.</span>
              <span className="text-xs font-black text-slate-900 block mt-0.5">₹12,999</span>
            </div>
          </div>

          <div className="space-y-1">
            {termiteItems.map((item) => (
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
