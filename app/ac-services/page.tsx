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
import { AC_SUBCATEGORIES, AC_SERVICE_ITEMS } from "@/lib/ucServiceData";
import {
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  BadgePercent,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export default function AcServicesPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("service-wash");
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
    "name": "AC Servicing, Foam Jet Cleaning & Repair in Nellore",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Osmida AC Services Nellore",
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
      "lowPrice": "299",
      "highPrice": "1999",
      "priceCurrency": "INR",
    },
  };

  const faqs = [
    {
      qEn: "How does the waterproof jacket prevent mess inside my room?",
      qTe: "వాటర్‌ప్రూఫ్ జాకెట్ గదిలో మురికి మరకలు పడకుండా ఎలా కాపాడుతుంది?",
      aEn: "Our technicians secure a high-grade waterproof funnel bag around your indoor AC unit. All dirty water and foam during the high-pressure jet wash drain straight into a closed bucket, keeping your painted walls, curtains, and floor completely spotless.",
      aTe: "మా టెక్నీషియన్లు ఇండోర్ ఏసీ చుట్టూ వాటర్‌ప్రూఫ్ ఫన్నెల్ బ్యాగ్ అమర్చుతారు. ప్రెజర్ వాష్ సమయంలో వచ్చే మురికి నీరు మొత్తం ఒక బకెట్‌లోకి వెళ్లిపోతుంది. గోడలకు, ఫ్లోర్‌కు చుక్క నీరు కూడా అంటదు.",
    },
    {
      qEn: "What is covered under the 15-day AC warranty?",
      qTe: "15 రోజుల ఏసీ వారంటీలో ఏమేమి ఉంటాయి?",
      aEn: "If you face any cooling drops or water dripping within 15 days of our foam jet service, our partner technician will re-inspect and fix it completely free of charge.",
      aTe: "ఫోమ్ జెట్ సర్వీస్ చేసిన 15 రోజుల్లో కూలింగ్ తగ్గినా లేదా వాటర్ లీకేజ్ అయినా, మా నిపుణులు ఉచితంగా రీ-విజిట్ చేసి సరిచేస్తారు.",
    },
    {
      qEn: "Do I have to pay any advance before booking?",
      qTe: "బుకింగ్ చేసేటప్పుడు ఏదైనా అడ్వాన్స్ చెల్లించాలా?",
      aEn: "No! Booking is 100% free with ₹0 advance. You only pay after the technician completes the service and you verify satisfactory cooling.",
      aTe: "లేదు! బుకింగ్ పూర్తిగా ఉచితం (₹0 అడ్వాన్స్). టెక్నీషియన్ పని పూర్తి చేసి, కూలింగ్ సంతృప్తికరంగా ఉందని మీరు చూసిన తర్వాతే చెల్లించాలి.",
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
                {lang === "te" ? "ఏసీ సర్వీసింగ్ & రిపేర్ నెల్లూరు" : "AC Servicing & Repair in Nellore"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {lang === "te"
                  ? "స్థానిక అనుభవజ్ఞులతో వాటర్‌ప్రూఫ్ జాకెట్ ఫోమ్ జెట్ వాష్ • ₹0 అడ్వాన్స్ • 15 రోజుల కూలింగ్ వారంటీ"
                  : "Water jacket foam jet cleaning by established Nellore technicians • ₹0 advance • 15-day warranty"}
              </p>
            </div>

            {/* Rating pill */}
            <div className="flex flex-col items-end shrink-0 pt-1">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900">
                <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                <span>4.84</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">2.6k bookings</span>
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
              <span>{lang === "te" ? "15 రోజుల వారంటీ" : "15-Day Leak Warranty"}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
              <BadgePercent className="h-3 w-3" />
              <span>{lang === "te" ? "నిర్ణీత ధరలు" : "Transparent Rates"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. STICKY SUBCATEGORY PILL TABS (Urban Company Signature) */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          {AC_SUBCATEGORIES.map((sub) => {
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
        {AC_SUBCATEGORIES.map((sub) => {
          const subItems = AC_SERVICE_ITEMS.filter((item) => item.subcategory === sub.id);
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
                  {sub.id === "service-wash" &&
                    (lang === "te"
                      ? "గోడలు మరకలు కాకుండా వాటర్‌ప్రూఫ్ జాకెట్ ఫోమ్ జెట్ వాష్"
                      : "Deep foam jet cleaning with waterproof jacket for zero wall mess")}
                  {sub.id === "repair-gas" &&
                    (lang === "te"
                      ? "కూలింగ్ సమస్యలు, గ్యాస్ లీక్ చెక్ & స్వచ్ఛమైన గ్యాస్ రీఫిల్"
                      : "Cooling diagnostics, water leak fix & 100% virgin gas refilling")}
                  {sub.id === "install-shift" &&
                    (lang === "te"
                      ? "సురక్షిత అన్‌ఇన్‌స్టాల్, ఇన్‌స్టాలేషన్ & నెల్లూరు పరిధిలో షిఫ్టింగ్"
                      : "Safe uninstallation, installation & shifting within Nellore")}
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
              {lang === "te" ? "ఓస్మిడా ఏసీ సర్వీస్ వాగ్దానం" : "The Osmida AC Guarantee"}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-800">
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">₹0 Advance</span>
              <span className="text-[11px] text-slate-600">Pay after cooling test</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">15-Day Warranty</span>
              <span className="text-[11px] text-slate-600">Free leak revisit</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">Black Uniform</span>
              <span className="text-[11px] text-slate-600">ID checked pros</span>
            </div>
            <div className="rounded-xl bg-white/80 p-2.5 border border-emerald-200">
              <span className="block text-emerald-800 font-black">30-Min Call</span>
              <span className="text-[11px] text-slate-600">Prompt coordination</span>
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
        initialTab="ac"
      />
    </main>
  );
}