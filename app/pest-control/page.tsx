"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Language } from "@/lib/translations";
import { UCServiceCard, UCServiceItemData } from "@/components/UCServiceCard";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { UCCartDrawer } from "@/components/UCCartDrawer";
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
} from "lucide-react";

export default function PestControlPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("cockroach-ants");
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
      id: "cockroach-ants",
      nameEn: "Cockroach & Ants",
      nameTe: "బొద్దింకలు & చీమలు",
      image: "/images/service-pest-general.jpg",
      badge: "30-Day Warranty",
    },
    {
      id: "bedbugs",
      nameEn: "Bedbugs",
      nameTe: "నల్లులు",
      image: "/images/service-pest-bedbug.jpg",
    },
    {
      id: "termites",
      nameEn: "Termite Control",
      nameTe: "చెదలు నివారణ",
      image: "/images/service-pest-termite.jpg",
    },
    {
      id: "mosquito-rodents",
      nameEn: "Mosquito & Rodent",
      nameTe: "దోమలు & ఎలుకలు",
      image: "/images/service-pest-v2.jpg",
    },
  ];

  const menuCategories: MenuSubcategory[] = [
    { id: "cockroach-ants", nameEn: "Cockroach & Ants", nameTe: "బొద్దింకలు & చీమలు", itemCount: 4 },
    { id: "bedbugs", nameEn: "Bedbugs", nameTe: "నల్లులు", itemCount: 2 },
    { id: "termites", nameEn: "Termite Control", nameTe: "చెదలు నివారణ", itemCount: 1 },
    { id: "mosquito-rodents", nameEn: "Mosquito & Rodent", nameTe: "దోమలు & ఎలుకలు", itemCount: 1 },
  ];

  const cockroachItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "cockroach-ants");
  const bedbugItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "bedbugs");
  const termiteItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "termites");
  const mosquitoItems = PEST_SERVICE_ITEMS.filter((i) => i.subcategory === "mosquito-rodents");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida Pest Control Nellore",
        text: "Book Odorless Cockroach & Pest Control in Nellore with 30-Day Warranty!",
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
      <div className="pt-14 sm:pt-16 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-slate-800" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSubcategory("cockroach-ants")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
              aria-label="Search services"
            >
              <Search className="h-4 w-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
              aria-label="Share service"
            >
              <Share2 className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* 3. HERO CARD */}
        <div className="mx-auto max-w-xl px-4 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block bg-[#007F5F] text-white text-[10px] font-black px-2 py-0.5 rounded-xs tracking-wider uppercase">
                ★ INSTANT
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {lang === "te" ? "పురుగుల నివారణ 60 నిమిషాల్లో" : "Pest control in\nNellore in 60 mins"}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {lang === "te" ? "ప్రారంభ ధర ₹699 • వాసన లేని మందులు" : "Starts at ₹699 • 100% Odorless Gel"}
              </p>
            </div>

            <div className="relative h-28 w-32 sm:h-32 sm:w-36 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
              <Image
                src="/images/service-pest-general.jpg"
                alt="Pest Control Pro"
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
                  <span className="font-black">4.89</span>
                  <span className="text-slate-500">(890 reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#007F5F] px-2 py-0.5 rounded-md text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#007F5F]" />
                <span>{lang === "te" ? "ధృవీకరించిన నిపుణులు" : "Verified Pros"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2 text-xs border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-extrabold text-slate-900">OSMIDA COVER</span>
                <span className="text-slate-500 text-[11px]">
                  {lang === "te"
                    ? "30 రోజుల ఉచిత రీ-విజిట్ వారంటీ"
                    : "30-day free revisit warranty"}
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
        {/* SECTION A: COCKROACH & ANTS */}
        <section id="cockroach-ants" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "బొద్దింకలు & చీమల నివారణ" : "Cockroach & Ants Control"}
            </h2>
          </div>

          {/* UC Hero Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 relative overflow-hidden shadow-2xs">
            <div className="inline-block bg-[#007F5F] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-1.5">
              Odorless Gel + Spray
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Herbal Bayer Gel Treatment
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === "te"
                    ? "వంటగది సామాన్లు తీయక్కర్లేదు • వాసన లేని సురక్షిత మందులు"
                    : "No need to empty kitchen cabinets • Child & pet safe"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/images/service-pest-general.jpg"
                  alt="Gel Treatment"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {cockroachItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION B: BEDBUGS */}
        <section id="bedbugs" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "నల్లుల నిర్మూలన" : "Bedbug Eradication"}
            </h2>
          </div>

          {bedbugItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION C: TERMITES */}
        <section id="termites" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "చెదలు నివారణ" : "Termite Control"}
            </h2>
          </div>

          {termiteItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION D: MOSQUITO & RODENTS */}
        <section id="mosquito-rodents" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "దోమలు & ఎలుకలు" : "Mosquito & Rodents"}
            </h2>
          </div>

          {mosquitoItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
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

      {/* 9. SLIDE-UP BOTTOM CART CHECKOUT DRAWER */}
      <UCCartDrawer lang={lang} />

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
