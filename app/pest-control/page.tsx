"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Language } from "@/lib/translations";
import { CategorySelectorModal } from "@/components/CategorySelectorModal";
import { UCServiceCard, UCServiceItemData } from "@/components/UCServiceCard";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { UCCartDrawer } from "@/components/UCCartDrawer";
import { UCServiceDetailModal } from "@/components/UCServiceDetailModal";
import { PEST_SUBCATEGORIES, PEST_SERVICE_ITEMS } from "@/lib/ucServiceData";
import {
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  RotateCcw,
  BadgePercent,
  Sparkles,
} from "lucide-react";

export default function PestControlPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("cockroach-ants");
  const [selectedDetailItem, setSelectedDetailItem] = useState<UCServiceItemData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleOpenDetail = (item: UCServiceItemData) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const scrollToSubcategory = (subId: string) => {
    setActiveTab(subId);
    const element = document.getElementById(subId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Local SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Pest Control & Cockroach Bedbug Termite Treatment in Nellore",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Osmida Pest Control Nellore",
      "telephone": "+917676358162",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nellore",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "524003",
        "addressCountry": "IN",
      },
    },
    "areaServed": "Nellore",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "699",
      "highPrice": "2499",
      "priceCurrency": "INR",
    },
  };

  const faqs = [
    {
      qEn: "Are the pest control chemicals safe for kids and elderly parents?",
      qTe: "పురుగుల మందులు పిల్లలు మరియు పెద్దలకు సురక్షితమేనా?",
      aEn: "Yes. We use low-odor, government-approved certified gels and synthetic pyrethroids. Unlike harsh unorganized sprays, our gel baiting requires zero kitchen emptying and is safe when basic 2-hour ventilation protocols are followed.",
      aTe: "అవును. మేము ప్రభుత్వ ఆమోదం పొందిన, తక్కువ వాసన గల సర్టిఫైడ్ జెల్స్ ఉపయోగిస్తాము. వంటగది సామాన్లు మొత్తం బయట పెట్టాల్సిన అవసరం లేదు. పిల్లలు, వృద్ధులు & పెంపుడు జంతువులకు సురక్షితం.",
    },
    {
      qEn: "What are the terms of the 30-day rework warranty?",
      qTe: "30 రోజుల రీవిజిట్ వారంటీ నిబంధనలు ఏమిటి?",
      aEn: "If you observe persistent cockroaches or target pests in the treated rooms within 30 days, our technician will re-inspect and apply a booster treatment completely FREE of cost.",
      aTe: "ట్రీట్ చేసిన గదుల్లో 30 రోజుల్లోగా మళ్లీ పురుగులు కనిపిస్తే, మా టెక్నీషియన్ వచ్చి పూర్తిగా ఉచితంగా రీ-ట్రీట్మెంట్ చేస్తారు.",
    },
    {
      qEn: "Do I need to pay any advance before service?",
      qTe: "ముందస్తుగా అడ్వాన్స్ ఏమైనా చెల్లించాలా?",
      aEn: "No advance is required (₹0 Advance). You only pay after our uniformed technician finishes the full treatment and provides the warranty card.",
      aTe: "ముందస్తు అడ్వాన్స్ ఏమీ లేదు (₹0 అడ్వాన్స్). టెక్నీషియన్ పని పూర్తి చేసి వారంటీ కార్డు ఇచ్చిన తర్వాతే మీరు చెల్లించాలి.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-slate-900 pt-14 sm:pt-16 pb-24 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. APP HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. CATEGORY HERO HEADER */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 pt-4 pb-4">
        <div className="mx-auto max-w-3xl space-y-2">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "హోమ్ పేజీకి తిరిగి వెళ్లండి" : "Back to All Services"}</span>
          </Link>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {lang === "te" ? "పురుగుల నివారణ సేవలు నెల్లూరు" : "Pest Control Services in Nellore"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {lang === "te"
                  ? "బొద్దింకలు, నల్లులు, చెదపురుగుల నివారణ • సర్టిఫైడ్ స్వల్ప వాసన రసాయనాలు • 30 రోజుల వారంటీ"
                  : "Cockroaches, bedbugs, termites & ants eradication • Low-odor certified chemicals • 30-day warranty"}
              </p>
            </div>

            {/* Rating pill */}
            <div className="flex flex-col items-end shrink-0 pt-1">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900">
                <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                <span>4.89</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">1.8k bookings</span>
            </div>
          </div>

          {/* Trust Value Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" />
              <span>{lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్" : "₹0 Advance Booking"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              <RotateCcw className="h-3 w-3" />
              <span>{lang === "te" ? "30 రోజుల వారంటీ" : "30-Day Revisit Warranty"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-600" />
              <span>{lang === "te" ? "స్వల్ప వాసన రసాయనాలు" : "Low-Odor Certified"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. STICKY SUBCATEGORY PILL TABS (Urban Company Signature) */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          {PEST_SUBCATEGORIES.map((sub) => {
            const isActive = activeTab === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => scrollToSubcategory(sub.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                }`}
              >
                {lang === "te" ? sub.labelTe : sub.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN SERVICE PACKAGES CONTAINER */}
      <div className="mx-auto max-w-3xl px-3 sm:px-6 py-4 space-y-6">
        {PEST_SUBCATEGORIES.map((sub) => {
          const subItems = PEST_SERVICE_ITEMS.filter((item) => item.subcategory === sub.id);
          if (subItems.length === 0) return null;

          return (
            <section
              key={sub.id}
              id={sub.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs scroll-mt-28"
            >
              {/* Subcategory Section Header */}
              <div className="pb-2 mb-2 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {lang === "te" ? sub.labelTe : sub.labelEn}
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  {sub.id === "cockroach-ants" &&
                    (lang === "te"
                      ? "కిచెన్ కేబినెట్లు, ఫ్రిజ్ & వాష్‌రూమ్‌లలో జెల్ బెయిటింగ్ మరియు స్ప్రే (30 రోజుల వారంటీ)"
                      : "Gel baiting & perimeter spray in kitchens & washrooms with 30-day warranty")}
                  {sub.id === "bedbug-control" &&
                    (lang === "te"
                      ? "మంచాలు, మ్యాట్రెస్ & కర్టెన్లలో నల్లుల సమూల నివారణకు మిస్టింగ్ ట్రీట్మెంట్"
                      : "Targeted misting treatment eliminating live bedbugs & eggs from mattresses & seams")}
                  {sub.id === "termite-control" &&
                    (lang === "te"
                      ? "గోడల మూలల్లో ప్రత్యేక డ్రిల్లింగ్ & కెమికల్ ప్రెజర్ ఇంజెక్షన్ (చ.అ.కు ₹8)"
                      : "Chemical barrier injection along skirting walls with multi-year warranty")}
                  {sub.id === "mosquito-rodents" &&
                    (lang === "te"
                      ? "డ్రెయిన్ శానిటైజేషన్ & సురక్షిత ఎలుకల నివారణ బోర్డులు"
                      : "Safe glue board runways & non-toxic drain repellent granules")}
                </p>
              </div>

              {/* Items in this subcategory */}
              <div className="divide-y divide-slate-100">
                {subItems.map((item) => (
                  <UCServiceCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onViewDetails={handleOpenDetail}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* 5. URBAN COMPANY 4-POINT TRUST PROMISE */}
        <section className="rounded-2xl sm:rounded-3xl bg-[#FEF3C7]/40 border border-[#FDE68A] p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#92400E]" />
            <h3 className="text-sm sm:text-base font-black text-[#92400E]">
              {lang === "te" ? "ఓస్మిడా పెస్ట్ కంట్రోల్ రక్షణ" : "The Osmida Pest Control Promise"}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-800">
            <div className="rounded-xl bg-white/80 p-2.5 border border-amber-200">
              <span className="block text-amber-900 font-black">₹0 Advance</span>
              <span className="text-[11px] text-slate-600">Pay after completion</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-amber-200">
              <span className="block text-amber-900 font-black">30-Day Warranty</span>
              <span className="text-[11px] text-slate-600">Free rework if pests return</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-amber-200">
              <span className="block text-amber-900 font-black">Low-Odor Gel</span>
              <span className="text-[11px] text-slate-600">No kitchen emptying</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-amber-200">
              <span className="block text-amber-900 font-black">Black Uniform</span>
              <span className="text-[11px] text-slate-600">ID checked experts</span>
            </div>
          </div>
        </section>

        {/* 6. FAQS ACCORDION */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 space-y-3">
          <h3 className="text-base font-black text-slate-900">
            {lang === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Frequently Asked Questions"}
          </h3>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 py-1"
                >
                  <span>{lang === "te" ? faq.qTe : faq.qEn}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      openFaqIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <p className="text-xs text-slate-600 pt-1.5 leading-relaxed">
                    {lang === "te" ? faq.aTe : faq.aEn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 7. FLOATING CART DOCK (Urban Company Signature) */}
      <UCFloatingCartBar lang={lang} />

      {/* 8. SLIDE-UP CART DRAWER */}
      <UCCartDrawer lang={lang} />

      {/* 9. SERVICE DETAIL MODAL */}
      <UCServiceDetailModal
        item={selectedDetailItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lang={lang}
      />

      {/* 10. MOBILE BOTTOM NAV */}
      <MobileBottomNav lang={lang} onOpenServices={() => setIsCatalogModalOpen(true)} />

      {/* 11. CATALOG MODAL */}
      <CategorySelectorModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        lang={lang}
        initialTab="pest"
      />
    </main>
  );
}
