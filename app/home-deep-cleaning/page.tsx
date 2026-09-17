"use client";

import React, { useState, useEffect } from "react";
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
import {
  BATHROOM_SERVICE_ITEMS,
  KITCHEN_SERVICE_ITEMS,
} from "@/lib/ucServiceData";
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
  CheckCircle2,
  Flame,
  Bath,
} from "lucide-react";

export default function HomeDeepCleaningPage() {
  const [lang, setLang] = useState<Language>("en");
  const [cleaningSection, setCleaningSection] = useState<"bathroom" | "kitchen">("bathroom");
  const [activeTab, setActiveTab] = useState<string>("bath-value-deals");
  const [selectedDetailItem, setSelectedDetailItem] = useState<UCServiceItemData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);

  // Read URL query parameter "?tab=kitchen" or "?tab=bathroom"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "kitchen") {
        setCleaningSection("kitchen");
        setActiveTab("kitchen-value-deals");
      } else if (tabParam === "bathroom") {
        setCleaningSection("bathroom");
        setActiveTab("bath-value-deals");
      }
    }
  }, []);

  const handleOpenDetail = (item: UCServiceItemData) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const scrollToSubcategory = (subId: string) => {
    setActiveTab(subId);
    const element = document.getElementById(subId);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Switch between Bathroom and Kitchen cleaning
  const handleSectionSwitch = (section: "bathroom" | "kitchen") => {
    setCleaningSection(section);
    if (section === "bathroom") {
      setActiveTab("bath-value-deals");
    } else {
      setActiveTab("kitchen-value-deals");
    }
  };

  // --- 1. BATHROOM CLEANING TABS & DATA (Screenshot 2: Value deals, One time deep clean, Mini services) ---
  const bathroomTabs: SubcategoryTabItem[] = [
    {
      id: "bath-value-deals",
      nameEn: "Value deals",
      nameTe: "కాంబో డీల్స్",
      image: "/images/bathroom-scrub-banner.jpg",
      badge: "COMBO DEALS",
    },
    {
      id: "bath-one-time",
      nameEn: "One time deep clean",
      nameTe: "డీప్ క్లీనింగ్",
      image: "/images/service-cleaning-bathroom.jpg",
    },
    {
      id: "bath-mini-services",
      nameEn: "Mini services",
      nameTe: "మినీ సర్వీసులు",
      image: "/images/service-cleaning-kitchen.jpg",
    },
  ];

  const bathroomMenuCategories: MenuSubcategory[] = [
    { id: "bath-value-deals", nameEn: "Value deals", nameTe: "కాంబో డీల్స్", itemCount: 4 },
    { id: "bath-one-time", nameEn: "One time deep clean", nameTe: "డీప్ క్లీనింగ్", itemCount: 2 },
    { id: "bath-mini-services", nameEn: "Mini services", nameTe: "మినీ సర్వీసులు", itemCount: 6 },
  ];

  const bathValueDeals = BATHROOM_SERVICE_ITEMS.filter((i) => i.subcategory === "bath-value-deals");
  const bathOneTime = BATHROOM_SERVICE_ITEMS.filter((i) => i.subcategory === "bath-one-time");
  const bathMini = BATHROOM_SERVICE_ITEMS.filter((i) => i.subcategory === "bath-mini-services");

  // Bathroom Areas Included (Screenshot 2)
  const bathroomAreasIncluded = [
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

  // --- 2. KITCHEN CLEANING TABS & DATA (Screenshot 1: Value deals, Chimney & Stove, Appliances, Cabinets & Mini) ---
  const kitchenTabs: SubcategoryTabItem[] = [
    {
      id: "kitchen-value-deals",
      nameEn: "Value deals",
      nameTe: "కాంబో డీల్స్",
      image: "/images/service-cleaning-chimney.jpg",
      badge: "BESTSELLERS",
    },
    {
      id: "kitchen-chimney-stove",
      nameEn: "Chimney & Stove",
      nameTe: "చిమ్నీ & స్టవ్",
      image: "/images/service-cleaning-stove.jpg",
    },
    {
      id: "kitchen-appliances",
      nameEn: "Appliance clean",
      nameTe: "ఉపకరణాలు",
      image: "/images/service-cleaning-fridge.jpg",
    },
    {
      id: "kitchen-cabinets-mini",
      nameEn: "Cabinets & Mini",
      nameTe: "కేబినెట్లు & మినీ",
      image: "/images/service-cleaning-counter.jpg",
    },
  ];

  const kitchenMenuCategories: MenuSubcategory[] = [
    { id: "kitchen-value-deals", nameEn: "Value deals", nameTe: "కాంబో డీల్స్", itemCount: 3 },
    { id: "kitchen-chimney-stove", nameEn: "Chimney & Stove", nameTe: "చిమ్నీ & స్టవ్", itemCount: 2 },
    { id: "kitchen-appliances", nameEn: "Appliance clean", nameTe: "ఉపకరణాల క్లీన్", itemCount: 5 },
    { id: "kitchen-cabinets-mini", nameEn: "Cabinets & Mini", nameTe: "కేబినెట్స్ & మినీ", itemCount: 5 },
  ];

  const kitchenValueDeals = KITCHEN_SERVICE_ITEMS.filter((i) => i.subcategory === "kitchen-value-deals");
  const kitchenChimneyStove = KITCHEN_SERVICE_ITEMS.filter((i) => i.subcategory === "kitchen-chimney-stove");
  const kitchenAppliances = KITCHEN_SERVICE_ITEMS.filter((i) => i.subcategory === "kitchen-appliances");
  const kitchenCabinetsMini = KITCHEN_SERVICE_ITEMS.filter((i) => i.subcategory === "kitchen-cabinets-mini");

  // Kitchen Areas Included (Screenshot 1)
  const kitchenAreasIncluded = [
    { name: "Chimney hood & filters", desc: "Chemical dip degreasing", img: "/images/service-cleaning-chimney.jpg" },
    { name: "Gas stove & burners", desc: "Unclogged & polished", img: "/images/service-cleaning-stove.jpg" },
    { name: "Granite slab & backsplash", desc: "Oil & turmeric scrub", img: "/images/service-cleaning-counter.jpg" },
    { name: "Refrigerator interior", desc: "Food-safe sanitization", img: "/images/service-cleaning-fridge.jpg" },
    { name: "Microwave & Oven", desc: "Baked grease softened", img: "/images/service-cleaning-kitchen.jpg" },
    { name: "Kitchen sink & drain", desc: "Descaled & deodorized", img: "/images/service-cleaning-counter.jpg" },
    { name: "Cabinets inside & out", desc: "Trolleys & racks wiped", img: "/images/kitchen-after.jpg" },
    { name: "Kitchen floor tiles", desc: "Machine rotary scrub", img: "/images/bathroom-scrub-banner.jpg" },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida Bathroom & Kitchen Deep Cleaning Nellore",
        text: "Book Machine Rotary Bathroom Scrub & Kitchen Degreasing in Nellore with ₹0 advance!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-28">
      {/* 1. TOP FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. CATEGORY TOP BAR */}
      <div className="pt-14 sm:pt-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-xl px-4 py-2.5 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-slate-800" />
          </Link>

          {/* Service Title */}
          <div className="text-center">
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {cleaningSection === "bathroom"
                ? (lang === "te" ? "బాత్‌రూమ్ క్లీనింగ్" : "Bathroom Cleaning")
                : (lang === "te" ? "కిచెన్ & చిమ్నీ క్లీనింగ్" : "Kitchen Cleaning")}
            </h1>
            <p className="text-[10px] text-emerald-600 font-bold">
              {lang === "te" ? "నెల్లూరు మార్కెట్ ధరలు • ₹0 అడ్వాన్స్" : "Nellore Market Pricing • ₹0 Advance"}
            </p>
          </div>

          <div className="flex items-center gap-2">
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

        {/* 3. DUAL-SERVICE SWITCHER: BATHROOM & KITCHEN */}
        <div className="mx-auto max-w-xl px-4 pb-3">
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => handleSectionSwitch("bathroom")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                cleaningSection === "bathroom"
                  ? "bg-[#0F172A] text-white shadow-md shadow-slate-950/20 scale-[1.01]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bath className="h-4 w-4 shrink-0" />
              <span>{lang === "te" ? "బాత్‌రూమ్ క్లీనింగ్" : "Bathroom Cleaning"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSectionSwitch("kitchen")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                cleaningSection === "kitchen"
                  ? "bg-[#0F172A] text-white shadow-md shadow-slate-950/20 scale-[1.01]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{lang === "te" ? "కిచెన్ క్లీనింగ్" : "Kitchen Cleaning"}</span>
            </button>
          </div>
        </div>

        {/* 4. HERO VIDEO BANNER (Matching Screenshot 1 or 2) */}
        <div className="mx-auto max-w-xl px-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-900 group">
            <Image
              src={
                cleaningSection === "bathroom"
                  ? "/images/bathroom-scrub-banner.jpg"
                  : "/images/service-cleaning-chimney.jpg"
              }
              alt={cleaningSection === "bathroom" ? "Bathroom Scrubbing" : "Kitchen Chimney Cleaning"}
              fill
              className="object-cover opacity-90 group-hover:scale-102 transition-transform duration-300"
              priority
              sizes="(max-width: 640px) 100vw, 576px"
            />
            {/* Dark overlay & Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 flex flex-col justify-between p-4 text-white">
              <div className="flex items-center gap-2">
                <span className="bg-[#0F172A] border border-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  {cleaningSection === "bathroom" ? "OSMIDA BATH PRO" : "OSMIDA KITCHEN PRO"}
                </span>
                <span className="bg-emerald-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm">
                  ₹0 ADVANCE
                </span>
              </div>

              <div className="flex items-center justify-center">
                <Link
                  href="/#how-to-book-video"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/60 text-white shadow-xl transition-transform group-hover:scale-110"
                >
                  <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                </Link>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-black text-white">
                  {cleaningSection === "bathroom"
                    ? "We got you covered (Bathroom Deep Clean)"
                    : "Spotless oil-free kitchen & chimney"}
                </h2>
                <p className="text-[11px] text-slate-200">
                  {cleaningSection === "bathroom"
                    ? "Rotary machine scrubbing • Hard water descaling • No harsh acids"
                    : "Chimney degrease dip • Gas stove carbon removal • Appliance clean"}
                </p>
              </div>
            </div>
          </div>

          {/* 5. TITLE & METRICS STRIP */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {cleaningSection === "bathroom"
                    ? (lang === "te" ? "బాత్‌రూమ్ క్లీనింగ్" : "Bathroom Cleaning")
                    : (lang === "te" ? "కిచెన్ & చిమ్నీ క్లీనింగ్" : "Kitchen Cleaning")}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  <span className="font-bold text-slate-900">
                    {cleaningSection === "bathroom" ? "4.83" : "4.79"}
                  </span>
                  <span className="text-slate-500">
                    {cleaningSection === "bathroom"
                      ? "(5.6M bookings • Nellore Verified)"
                      : "(3.1M bookings • Nellore Verified)"}
                  </span>
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

            {/* Areas & Surfaces Included Trigger Button */}
            <button
              type="button"
              onClick={() => setIsAreasModalOpen(true)}
              className="w-full flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3.5 py-2 text-xs border border-slate-200/80 shadow-2xs text-left hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#059669]" />
                <span className="font-bold text-slate-900">
                  {cleaningSection === "bathroom"
                    ? (lang === "te" ? "ఏయే భాగాలు క్లీన్ చేస్తాం? చూడండి" : "Areas & surfaces included")
                    : (lang === "te" ? "కిచెన్ భాగాలు & ఉపకరణాలు చూడండి" : "Kitchen areas & appliances included")}
                </span>
                <span className="text-[11px] text-slate-500">
                  {cleaningSection === "bathroom" ? "(9 surfaces)" : "(8 items)"}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. STICKY SUBCATEGORY ICON TABS */}
      <UCSubcategoryTabs
        items={cleaningSection === "bathroom" ? bathroomTabs : kitchenTabs}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 7. CONTENT SECTIONS */}
      <div className="mx-auto max-w-xl px-4 divide-y divide-slate-100">
        {cleaningSection === "bathroom" ? (
          <>
            {/* BATHROOM SECTION 1: VALUE DEALS (Screenshot 2) */}
            <section id="bath-value-deals" className="pt-6 pb-4 space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  COMBO SAVINGS
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                  {lang === "te" ? "కాంబో డీల్స్ (Value deals)" : "Value deals"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-bathroom machine scrubbing packs with up to 25% discount
                </p>
              </div>

              <div className="space-y-1">
                {bathValueDeals.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>

            {/* BATHROOM SECTION 2: ONE TIME DEEP CLEAN (Screenshot 2) */}
            <section id="bath-one-time" className="pt-6 pb-4 space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  ROTARY MACHINE SCRUB
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                  {lang === "te" ? "వన్ టైమ్ డీప్ క్లీనింగ్" : "One time deep clean"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Handheld rotary machine scrubbing for tough yellow scale & stains
                </p>
              </div>

              <div className="space-y-1">
                {bathOneTime.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>

            {/* BATHROOM SECTION 3: MINI SERVICES (Screenshot 2) */}
            <section id="bath-mini-services" className="pt-6 pb-4 space-y-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {lang === "te" ? "మినీ సర్వీసులు (యాడ్-ఆన్స్)" : "Mini services"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add individual exhaust fans, doors, mirrors, washbasins, or disinfection
                </p>
              </div>

              <div className="space-y-1">
                {bathMini.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* KITCHEN SECTION 1: VALUE DEALS (Screenshot 1) */}
            <section id="kitchen-value-deals" className="pt-6 pb-4 space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  BESTSELLER COMBOS
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                  {lang === "te" ? "కిచెన్ కాంబో డీల్స్" : "Value deals"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chimney & gas stove degrease, sink & slab deep clean, full kitchen package
                </p>
              </div>

              <div className="space-y-1">
                {kitchenValueDeals.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>

            {/* KITCHEN SECTION 2: CHIMNEY & STOVE (Screenshot 1) */}
            <section id="kitchen-chimney-stove" className="pt-6 pb-4 space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  OIL & CARBON REMOVAL
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                  {lang === "te" ? "చిమ్నీ & గ్యాస్ స్టవ్ క్లీనింగ్" : "Chimney & Gas stove cleaning"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Baffle filters chemical degreasing, auto-clean blower wipe, gas burner holes unclogged
                </p>
              </div>

              <div className="space-y-1">
                {kitchenChimneyStove.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>

            {/* KITCHEN SECTION 3: APPLIANCES (Screenshot 1) */}
            <section id="kitchen-appliances" className="pt-6 pb-4 space-y-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  FOOD-SAFE CLEAN
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1">
                  {lang === "te" ? "కిచెన్ ఉపకరణాల క్లీనింగ్" : "Appliance cleaning"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Refrigerator interior & exterior, microwave steam clean, exhaust fan, air fryer
                </p>
              </div>

              <div className="space-y-1">
                {kitchenAppliances.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>

            {/* KITCHEN SECTION 4: CABINETS & MINI (Screenshot 1) */}
            <section id="kitchen-cabinets-mini" className="pt-6 pb-4 space-y-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {lang === "te" ? "కేబినెట్స్, ఫ్లోర్ & మినీ సర్వీసులు" : "Cabinets, floor & mini services"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Under-sink cabinet, modular trolley inside-out, kitchen floor machine scrub, drain unblock
                </p>
              </div>

              <div className="space-y-1">
                {kitchenCabinetsMini.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* 8. AREAS & SURFACES INCLUDED BOTTOM SHEET (Screenshot 1 / 2 Modal) */}
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
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {cleaningSection === "bathroom" ? "Bathroom areas included" : "Kitchen areas & surfaces included"}
                </h3>
                <p className="text-xs text-slate-500">
                  {cleaningSection === "bathroom" ? "9 key surfaces scrubbed & sanitized" : "8 key kitchen points degreased"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAreasModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
              {(cleaningSection === "bathroom" ? bathroomAreasIncluded : kitchenAreasIncluded).map((area, idx) => (
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
                className="w-full rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. FLOATING ≡ MENU MODAL */}
      <UCSubcategoryMenuModal
        categories={cleaningSection === "bathroom" ? bathroomMenuCategories : kitchenMenuCategories}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 10. FLOATING CART DOCK */}
      <UCFloatingCartBar lang={lang} />

      {/* 11. SLIDE-UP BOTTOM CART CHECKOUT DRAWER */}
      <UCCartDrawer lang={lang} />

      {/* 12. SERVICE DETAIL BOTTOM SHEET MODAL */}
      <UCServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedDetailItem}
        lang={lang}
      />
    </main>
  );
}
