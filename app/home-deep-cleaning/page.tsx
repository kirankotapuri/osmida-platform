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
  Play,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";

export default function HomeDeepCleaningPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("value-deals");
  const [selectedDetailItem, setSelectedDetailItem] = useState<UCServiceItemData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);

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

  // Subcategory tabs matching Urban Company screenshot 1
  const subcategoryTabs: SubcategoryTabItem[] = [
    {
      id: "value-deals",
      nameEn: "Value deals",
      nameTe: "కాంబో డీల్స్",
      image: "/images/bathroom-scrub-banner.jpg",
      badge: "COMBO DEALS",
    },
    {
      id: "one-time",
      nameEn: "One time deep clean",
      nameTe: "డీప్ క్లీనింగ్",
      image: "/images/service-cleaning-bathroom.jpg",
    },
    {
      id: "mini-services",
      nameEn: "Mini services",
      nameTe: "మినీ సర్వీసులు",
      image: "/images/service-cleaning-kitchen.jpg",
    },
  ];

  const menuCategories: MenuSubcategory[] = [
    { id: "value-deals", nameEn: "Value deals", nameTe: "కాంబో డీల్స్", itemCount: 4 },
    { id: "one-time", nameEn: "One time deep clean", nameTe: "డీప్ క్లీనింగ్", itemCount: 3 },
    { id: "mini-services", nameEn: "Mini services", nameTe: "మినీ సర్వీసులు", itemCount: 6 },
  ];

  const valueDealItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "value-deals");
  const oneTimeItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "one-time");
  const miniItems = CLEANING_SERVICE_ITEMS.filter((i) => i.subcategory === "mini-services");

  // Areas & surfaces included items (Screenshot 1 modal)
  const areasIncluded = [
    { name: "Floor scrubbing machine", desc: "Rotary deep scrub", img: "/images/bathroom-scrub-banner.jpg" },
    { name: "Toilet seat inside & out", desc: "Descaled & sanitized", img: "/images/service-cleaning-bathroom.jpg" },
    { name: "Washbasin", desc: "Stain removal & shine", img: "/images/service-plumber.jpg" },
    { name: "Mirror & glass partition", desc: "Streak-free buff", img: "/images/service-cleaning-bathroom.jpg" },
    { name: "Fixtures & chrome taps", desc: "Scale & acid-free polish", img: "/images/service-plumber.jpg" },
    { name: "Windows", desc: "Grill & pane dusting", img: "/images/home-cleaning-banner.jpg" },
    { name: "Exhaust & ceiling fan", desc: "Grease & dust wiped", img: "/images/service-electrician.jpg" },
    { name: "Doors", desc: "Front & back wipe", img: "/images/service-carpenter.jpg" },
    { name: "Ceiling & wall dusting", desc: "Cobweb removal", img: "/images/service-cleaning-home.jpg" },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida Bathroom & Deep Cleaning Nellore",
        text: "Book Machine Floor Scrubbing & Bathroom Deep Cleaning in Nellore with ₹0 advance!",
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
              onClick={() => scrollToSubcategory("value-deals")}
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

        {/* 3. HERO VIDEO BANNER (Screenshot 1: We got you) */}
        <div className="mx-auto max-w-xl px-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-900 group">
            <Image
              src="/images/bathroom-scrub-banner.jpg"
              alt="Bathroom Scrubbing Machine"
              fill
              className="object-cover opacity-90 group-hover:scale-102 transition-transform duration-300"
              priority
              sizes="(max-width: 640px) 100vw, 576px"
            />
            {/* Dark overlay & Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex flex-col justify-between p-4 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#3B1277] text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  OSMIDA CLEAN
                </span>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/60 text-white shadow-xl transition-transform group-hover:scale-110">
                  <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                </div>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-black text-white">
                  We got you covered
                </h2>
                <p className="text-[11px] text-slate-200">
                  Rotary machine scrubbing • Hard water descaling • No harsh acids
                </p>
              </div>
            </div>
          </div>

          {/* 4. TITLE & GUARANTEE STRIP (Screenshot 1) */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {lang === "te" ? "బాత్‌రూమ్ & డీప్ క్లీనింగ్" : "Bathroom Cleaning"}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  <span className="font-bold text-slate-900">4.83</span>
                  <span className="text-slate-500">(5.4 M bookings)</span>
                </div>
              </div>

              {/* Earliest Slot Badge */}
              <div className="rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] px-2.5 py-1 text-right shrink-0">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#166534]">
                  <Clock className="h-3 w-3 text-[#166534]" />
                  <span>Earliest</span>
                </div>
                <div className="text-[10px] font-extrabold text-[#166534]">
                  Today, 8:00 AM
                </div>
              </div>
            </div>

            {/* Areas & Surfaces Included Trigger Button (Screenshot 1 Sheet) */}
            <button
              type="button"
              onClick={() => setIsAreasModalOpen(true)}
              className="w-full flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3.5 py-2 text-xs border border-slate-200/80 shadow-2xs text-left hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-700" />
                <span className="font-bold text-slate-900">
                  {lang === "te" ? "ఏయే భాగాలు క్లీన్ చేస్తాం? చూడండి" : "Areas & surfaces included"}
                </span>
                <span className="text-[11px] text-slate-500">
                  (9 surfaces)
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
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
        {/* SECTION A: VALUE DEALS */}
        <section id="value-deals" className="pt-6 pb-4 space-y-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "కాంబో డీల్స్ (Value deals)" : "Value deals"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-bathroom scrubbing packs with up to 25% discount
            </p>
          </div>

          <div className="space-y-1">
            {valueDealItems.map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>
        </section>

        {/* SECTION B: ONE TIME DEEP CLEAN */}
        <section id="one-time" className="pt-6 pb-4 space-y-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "వన్ టైమ్ డీప్ క్లీనింగ్" : "One time deep clean"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Floor & tile rotary machine scrubbing for tough stains
            </p>
          </div>

          <div className="space-y-1">
            {oneTimeItems.map((item) => (
              <UCServiceCard
                key={item.id}
                item={item}
                lang={lang}
                onViewDetails={handleOpenDetail}
              />
            ))}
          </div>
        </section>

        {/* SECTION C: MINI SERVICES (Add-ons from Screenshot 1) */}
        <section id="mini-services" className="pt-6 pb-4 space-y-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "మినీ సర్వీసులు (యాడ్-ఆన్స్)" : "Mini services"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add individual fixtures, fans, or doors to your service
            </p>
          </div>

          <div className="space-y-1">
            {miniItems.map((item) => (
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

      {/* 7. AREAS & SURFACES INCLUDED BOTTOM SHEET (Screenshot 1 Bottom Sheet) */}
      {isAreasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsAreasModalOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Areas & surfaces included
              </h3>
              <button
                type="button"
                onClick={() => setIsAreasModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 grid grid-cols-3 gap-2.5 text-center">
              {areasIncluded.map((area, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center rounded-xl bg-[#F8F9FA] p-2 border border-slate-100 space-y-1"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-200">
                    <Image
                      src={area.img}
                      alt={area.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 leading-tight">
                    {area.name}
                  </span>
                  <span className="text-[8px] text-slate-500 leading-tight">
                    {area.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAreasModalOpen(false)}
                className="w-full rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. FLOATING ≡ MENU MODAL */}
      <UCSubcategoryMenuModal
        categories={menuCategories}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 9. FLOATING CART DOCK */}
      <UCFloatingCartBar lang={lang} />

      {/* 10. SLIDE-UP BOTTOM CART CHECKOUT DRAWER */}
      <UCCartDrawer lang={lang} />

      {/* 11. SERVICE DETAIL BOTTOM SHEET MODAL */}
      <UCServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedDetailItem}
        lang={lang}
      />
    </main>
  );
}
