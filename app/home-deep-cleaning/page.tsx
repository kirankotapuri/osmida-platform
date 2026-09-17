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
import { CLEANING_SUBCATEGORIES, CLEANING_SERVICE_ITEMS } from "@/lib/ucServiceData";
import {
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BadgePercent,
} from "lucide-react";

export default function HomeDeepCleaningPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("full-home");
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
    "name": "Home Deep Cleaning, Bathroom & Kitchen Scrubbing in Nellore",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Osmida Cleaning Services Nellore",
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
      "lowPrice": "499",
      "highPrice": "5999",
      "priceCurrency": "INR",
    },
  };

  const faqs = [
    {
      qEn: "Do your technicians use single-disc floor scrubbing machines?",
      qTe: "ఫ్లోర్ క్లీనింగ్ కోసం సింగిల్-డిస్క్ మెషీన్లను ఉపయోగిస్తారా?",
      aEn: "Yes! Unlike local maids who only use a mop, our trained crew carries industrial rotary single-disc scrubbing machines and wet-dry vacuum cleaners to extract deep ground-in dirt and grout grime.",
      aTe: "అవును! సాధారణ మాప్ కాకుండా, గ్రౌట్ మురికి మరియు గట్టి మరకలను తొలగించడానికి మా బృందం సింగిల్-డిస్క్ రోటరీ స్క్రబ్బింగ్ మెషీన్లు & వాక్యూమ్ క్లీనర్లను తీసుకువస్తుంది.",
    },
    {
      qEn: "Do you use harsh acid that damages bathroom tiles?",
      qTe: "బాత్‌రూమ్ టైల్స్ పాడయ్యే హానికరమైన యాసిడ్ వాడతారా?",
      aEn: "Never. We strictly use professional non-acidic descalers that dissolve hard-water calcium stains and yellow scale without eroding the tile glaze or cement grout.",
      aTe: "ఖచ్చితంగా వాడము. టైల్స్ మెరుపు మరియు సిమెంట్ జాయింట్లు పాడవకుండా ఉండే ప్రొఫెషనల్ నాన్-యాసిడిక్ డీస్కేలర్స్ మాత్రమే ఉపయోగిస్తాము.",
    },
    {
      qEn: "Is any advance payment required before cleaning starts?",
      qTe: "క్లీనింగ్ ప్రారంభించే ముందు ఏదైనా అడ్వాన్స్ ఇవ్వాలా?",
      aEn: "No advance payment is needed (₹0 Advance). You only pay after walking through your home, inspecting all rooms, and confirming full satisfaction.",
      aTe: "ముందస్తు అడ్వాన్స్ ఏమీ లేదు (₹0 అడ్వాన్స్). ఇల్లు మొత్తం పరిశీలించి, పని సంతృప్తికరంగా ఉందని మీరు నిర్ధారించిన తర్వాతే చెల్లించాలి.",
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
                {lang === "te" ? "హోమ్ డీప్ క్లీనింగ్ సేవలు నెల్లూరు" : "Home Deep Cleaning Services in Nellore"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {lang === "te"
                  ? "సింగిల్-డిస్క్ మెషీన్ ఫ్లోర్ స్క్రబ్బింగ్ • యాసిడ్-రహిత బాత్‌రూమ్ డీస్కేలింగ్ • ₹0 అడ్వాన్స్"
                  : "Single-disc machine floor scrubbing • Acid-free bathroom descaling • 24-hr satisfaction check"}
              </p>
            </div>

            {/* Rating pill */}
            <div className="flex flex-col items-end shrink-0 pt-1">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900">
                <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                <span>4.86</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">1.4k bookings</span>
            </div>
          </div>

          {/* Trust Value Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1 text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" />
              <span>{lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్" : "₹0 Advance Booking"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span>{lang === "te" ? "మెషీన్ స్క్రబ్బింగ్" : "Machine Floor Scrubbing"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              <RotateCcw className="h-3 w-3" />
              <span>{lang === "te" ? "24-గంటల క్వాలిటీ చెక్" : "24-Hr Check"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. STICKY SUBCATEGORY PILL TABS (Urban Company Signature) */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CLEANING_SUBCATEGORIES.map((sub) => {
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
        {CLEANING_SUBCATEGORIES.map((sub) => {
          const subItems = CLEANING_SERVICE_ITEMS.filter((item) => item.subcategory === sub.id);
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
                  {sub.id === "full-home" &&
                    (lang === "te"
                      ? "ఫ్లోర్ మెషీన్ స్క్రబ్బింగ్, కిచెన్, బాత్‌రూమ్‌లు & కిటికీల పూర్తి డీప్ క్లీన్"
                      : "Rotary floor machine scrubbing, vacuuming, kitchens, bathrooms & windows")}
                  {sub.id === "bathroom-scrub" &&
                    (lang === "te"
                      ? "యాసిడ్ లేకుండా ఉప్పు మరకల తొలగింపు & కుళాయిల క్రోమ్ పాలిషింగ్"
                      : "Acid-free tile scale descaling & mirror tap buffing")}
                  {sub.id === "kitchen-degrease" &&
                    (lang === "te"
                      ? "గట్టు, టైల్స్, స్టవ్ బర్నర్స్ & ఎగ్జాస్ట్ ఫ్యాన్ నూనె మరకల నివారణ"
                      : "Grease and oil removal from wall tiles, countertops, sink & chimney exterior")}
                  {sub.id === "balcony-sofa" &&
                    (lang === "te"
                      ? "బాల్కనీ ఫ్లోర్ ప్రెజర్ వాష్ & ఫ్యాబ్రిక్ సోఫా షాంపూ క్లీనింగ్"
                      : "Balcony floor deep buffing & fabric stain removal add-ons")}
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
        <section className="rounded-2xl sm:rounded-3xl bg-[#F0FDF4] border border-[#BBF7D0] p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#166534]" />
            <h3 className="text-sm sm:text-base font-black text-[#166534]">
              {lang === "te" ? "ఓస్మిడా డీప్ క్లీనింగ్ ప్రమాణాలు" : "The Osmida Cleaning Standard"}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-800">
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">₹0 Advance</span>
              <span className="text-[11px] text-slate-600">Pay after room inspection</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">Rotary Machine</span>
              <span className="text-[11px] text-slate-600">Deep floor scrubbing</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">Acid-Free Care</span>
              <span className="text-[11px] text-slate-600">Tiles & grout safe</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">Black Uniform</span>
              <span className="text-[11px] text-slate-600">ID checked crew</span>
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
        initialTab="cleaning"
      />
    </main>
  );
}
