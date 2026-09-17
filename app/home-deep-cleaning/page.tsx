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
import { CLEANING_SERVICE_ITEMS } from "@/lib/ucServiceData";
import {
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Search,
  Share2,
} from "lucide-react";

export default function HomeDeepCleaningPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("full-home");
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
      id: "full-home",
      nameEn: "Full Home",
      nameTe: "పూర్తి ఇల్లు",
      image: "/images/service-cleaning-home.jpg",
      badge: "Machine Scrub",
    },
    {
      id: "bathroom",
      nameEn: "Bathroom Scrub",
      nameTe: "బాత్‌రూమ్ స్క్రబ్",
      image: "/images/service-cleaning-bathroom.jpg",
    },
    {
      id: "kitchen",
      nameEn: "Kitchen Degrease",
      nameTe: "వంటగది క్లీనింగ్",
      image: "/images/service-cleaning-kitchen.jpg",
    },
    {
      id: "balcony-sofa",
      nameEn: "Balcony & Sofa",
      nameTe: "బాల్కనీ & సోఫా",
      image: "/images/service-sofa.jpg",
    },
  ];

  const menuCategories: MenuSubcategory[] = [
    { id: "full-home", nameEn: "Full Home", nameTe: "పూర్తి ఇల్లు", itemCount: 4 },
    { id: "bathroom", nameEn: "Bathroom Scrub", nameTe: "బాత్‌రూమ్ స్క్రబ్", itemCount: 2 },
    { id: "kitchen", nameEn: "Kitchen Degreasing", nameTe: "వంటగది క్లీనింగ్", itemCount: 1 },
    { id: "balcony-sofa", nameEn: "Balcony & Sofa", nameTe: "బాల్కనీ & సోఫా", itemCount: 1 },
  ];

  const fullHomeItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "full-home");
  const bathroomItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "bathroom");
  const kitchenItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "kitchen");
  const balconySofaItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "balcony-sofa");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida Home Deep Cleaning Nellore",
        text: "Book Machine Floor Scrubbing & Home Cleaning in Nellore with ₹0 advance!",
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
              onClick={() => scrollToSubcategory("full-home")}
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
                {lang === "te" ? "డీప్ క్లీనింగ్ & స్క్రబ్బింగ్" : "Home cleaning &\nscrubbing in 60 mins"}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {lang === "te" ? "ప్రారంభ ధర ₹499 • సింగిల్-డిస్క్ మెషిన్" : "Starts at ₹499 • Single-Disc Scrubbing"}
              </p>
            </div>

            <div className="relative h-28 w-32 sm:h-32 sm:w-36 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
              <Image
                src="/images/service-cleaning-home.jpg"
                alt="Cleaning Pro"
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
                <span className="text-base font-black text-slate-900">Deep Cleaning</span>
                <div className="flex items-center gap-1 text-xs text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  <span className="font-black">4.88</span>
                  <span className="text-slate-500">(1.2k reviews)</span>
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
                    ? "పూర్తి సంతృప్తి లేదా ఉచిత రీ-క్లీన్"
                    : "Complete satisfaction or free re-clean"}
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
        {/* SECTION A: FULL HOME */}
        <section id="full-home" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "పూర్తి ఇల్లు డీప్ క్లీనింగ్" : "Full Home Deep Clean"}
            </h2>
          </div>

          {/* UC Lifestyle Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#EDE7E1] p-4 relative overflow-hidden shadow-2xs border border-[#E0D7CE]">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1 z-10 max-w-[65%]">
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  A cleaner home, without any hassle
                </h3>
                <p className="text-[11px] text-slate-700">
                  {lang === "te"
                    ? "సింగిల్-డిస్క్ మెషిన్ స్క్రబ్బింగ్ & వాక్యూమింగ్"
                    : "Single-disc machine buffing & deep suction"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-white/60">
                <Image
                  src="/images/home-cleaning-banner.jpg"
                  alt="A cleaner home"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {fullHomeItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION B: BATHROOM */}
        <section id="bathroom" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "బాత్‌రూమ్ డీప్ స్క్రబ్" : "Bathroom Deep Scrub"}
            </h2>
          </div>

          {bathroomItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION C: KITCHEN */}
        <section id="kitchen" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "వంటగది క్లీనింగ్" : "Kitchen Degreasing"}
            </h2>
          </div>

          {kitchenItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION D: BALCONY & SOFA */}
        <section id="balcony-sofa" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "బాల్కనీ & సోఫా" : "Balcony & Sofa"}
            </h2>
          </div>

          {balconySofaItems.map((item) => (
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
