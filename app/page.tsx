"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";

import { FloatingContactBar } from "@/components/FloatingContactBar";
import { SafetyPromise } from "@/components/SafetyPromise";
import { VoiceNoteBanner } from "@/components/VoiceNoteBanner";
import { FaqSection } from "@/components/FaqSection";
import { CategorySelectorModal } from "@/components/CategorySelectorModal";
import { HowItWorksVideoSection } from "@/components/HowItWorksVideoSection";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { Language, UI_TEXT, SERVICES_DATA } from "@/lib/translations";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Sparkles,
  Clock,
  Award,
  ArrowRight,
  Search,
  ChevronRight,
  SlidersHorizontal,
  Play,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"ac" | "pest" | "cleaning">("ac");

  const openCategoryModal = (tab: "ac" | "pest" | "cleaning" = "ac") => {
    setModalTab(tab);
    setIsCategoryModalOpen(true);
  };

  const t = UI_TEXT[lang];

  const openWhatsAppDirect = (serviceTitle: string = "Home Services") => {
    const text = encodeURIComponent(
      lang === "te"
        ? `నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో ${serviceTitle} గురించి వివరాలు కావాలి. దయచేసి కాల్ చేయండి.`
        : `Namaskaram Osmida! I am looking for details regarding ${serviceTitle} in Nellore. Please call me back.`
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  // --- SEO SCHEMA INJECTION FOR NELLORE ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://osmida.com/#business",
    "name": "Osmida Home & Facility Services Nellore",
    "alternateName": "Osmida",
    "url": "https://osmida.com",
    "logo": "https://osmida.com/osmida.jpg",
    "image": "https://osmida.com/osmida.jpg",
    "description":
      "Osmida provides pest control, AC servicing, and home deep cleaning in Nellore. Launching 1st in Nellore partnered with established local technicians, 30-day warranty, and 30-minute call confirmation.",
    "telephone": "+917676358162",
    "email": "osmidaindia@gmail.com",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "UPI, Cash, Bank Transfer",
    "areaServed": [
      { "@type": "City", "name": "Nellore" },
      { "@type": "Place", "name": "Trunk Road, Nellore" },
      { "@type": "Place", "name": "Pogathota, Nellore" },
      { "@type": "Place", "name": "Magunta Layout, Nellore" },
      { "@type": "Place", "name": "Dargamitta, Nellore" },
      { "@type": "Place", "name": "Vedayapalem, Nellore" },
      { "@type": "Place", "name": "Haranathapuram, Nellore" },
      { "@type": "Place", "name": "VRC Centre, Nellore" },
      { "@type": "Place", "name": "Stonehousepet, Nellore" },
      { "@type": "Place", "name": "Nawabpet, Nellore" },
      { "@type": "Place", "name": "Fathekhanpet, Nellore" },
      { "@type": "Place", "name": "Nearby Areas, Nellore" },
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nellore",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "524003",
      "addressCountry": "IN",
    },
  };

  return (
    <main
      id="top"
      className="min-h-screen bg-white text-[#111111] selection:bg-[#0F172A] selection:text-white pt-14 sm:pt-16 pb-24 lg:pb-0"
    >
      {/* Invisible Schema Script for Nellore Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. FIXED BLACK HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. AIRY HIGH-CONTRAST HERO & QUICK SEARCH (Color Psychology: Cleanliness, Hygiene & Instant Readability) */}
      <section className="bg-gradient-to-b from-slate-100/80 via-slate-50 to-white px-3 sm:px-6 pt-5 pb-6 border-b border-slate-100">
        <div className="mx-auto max-w-xl space-y-3 text-center sm:text-left">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {lang === "te" ? "నెల్లూరులో మీ ఇంటి వద్దకే నమ్మకమైన సేవలు" : "Reliable Home Services at Your Doorstep in Nellore"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {lang === "te" ? "స్థానిక అనుభవజ్ఞులైన టెక్నీషియన్లు • ₹0 అడ్వాన్స్ • 30 నిమిషాల్లో కన్ఫర్మేషన్" : "Partnered with verified local technicians • ₹0 Advance • 30-min pro arrival"}
            </p>
          </div>

          {/* White Pill Search Bar */}
          <button
            type="button"
            onClick={() => openCategoryModal("ac")}
            className="w-full flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-3.5 shadow-sm border border-slate-200/90 hover:border-slate-300 transition-all active:scale-98 text-left group"
            aria-label="Search services"
          >
            <Search className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-900 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-500 font-medium truncate">
              {lang === "te"
                ? "శోధించండి: 'ఏసీ సర్వీస్', 'పురుగుల మందు', 'డీప్ క్లీనింగ్'..."
                : "Search for 'AC service', 'pest control', 'deep clean'..."}
            </span>
          </button>

          {/* Value Prop Banner */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-2 text-[11px] sm:text-xs font-semibold text-emerald-900 shadow-2xs">
            <span>
              {lang === "te"
                ? "⚡ నెల్లూరులో ప్రముఖ నిపుణులు • "
                : "⚡ 30-min Pro Dispatch in Nellore • Verified Local Pros • "}
              <strong className="text-emerald-700 font-black">
                {lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్" : "₹0 Advance"}
              </strong>
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {lang === "te" ? "ధృవీకరించబడింది" : "Verified"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. STRICT 3 CORE SERVICES SHOWCASE (AC, Pest Control, Deep Cleaning - No Extras) */}
      <section id="services-section" className="bg-white px-3 sm:px-6 py-5 border-b border-slate-100">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {lang === "te" ? "అధికారిక సేవలు" : "Verified Services"}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {lang === "te" ? "మా 3 ముఖ్యమైన సేవలు" : "Select Your Service"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openCategoryModal("ac")}
              className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-0.5"
            >
              <span>{lang === "te" ? "అన్నీ చూడండి" : "View all"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
            {/* Core Service 1: AC Services */}
            <button
              type="button"
              onClick={() => openCategoryModal("ac")}
              className="group flex flex-col items-center text-center focus:outline-none transition-all active:scale-[0.97] bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-2 sm:p-2.5 shadow-2xs hover:shadow-xs"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/images/service-ac-foamjet.jpg"
                  alt="AC Services"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 30vw, 120px"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-2 leading-tight group-hover:text-blue-600 transition-colors">
                {lang === "te" ? "ఏసీ సర్వీస్" : "AC Service"}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-600 mt-0.5">
                From ₹599
              </span>
            </button>

            {/* Core Service 2: Pest Control */}
            <button
              type="button"
              onClick={() => openCategoryModal("pest")}
              className="group flex flex-col items-center text-center focus:outline-none transition-all active:scale-[0.97] bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-2 sm:p-2.5 shadow-2xs hover:shadow-xs"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/images/service-pest-general.jpg"
                  alt="Pest Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 30vw, 120px"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-2 leading-tight group-hover:text-blue-600 transition-colors">
                {lang === "te" ? "పురుగుల నివారణ" : "Pest Control"}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-600 mt-0.5">
                From ₹1,499
              </span>
            </button>

            {/* Core Service 3: Bathroom & Kitchen Deep Cleaning */}
            <button
              type="button"
              onClick={() => openCategoryModal("cleaning")}
              className="group flex flex-col items-center text-center focus:outline-none transition-all active:scale-[0.97] bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-2xl p-2 sm:p-2.5 shadow-2xs hover:shadow-xs"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/images/bathroom-scrub-banner.jpg"
                  alt="Bathroom & Kitchen Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 30vw, 120px"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 mt-2 leading-tight group-hover:text-blue-600 transition-colors">
                {lang === "te" ? "బాత్‌రూమ్ & కిచెన్" : "Bath & Kitchen"}
              </span>
              <span className="text-[11px] sm:text-xs font-black text-emerald-600 mt-0.5">
                From ₹449
              </span>
            </button>
          </div>

          {/* Quick Telugu Video Explainer Pill */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("how-to-book-video");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full flex items-center justify-between rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200 px-3 py-2 text-left transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-full bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                  <Play className="h-3 w-3 fill-white ml-0.5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900">
                    {lang === "te" ? "1-నిమిషం తెలుగు వీడియో చూడండి" : "Watch 1-Minute Telugu Video Guide"}
                  </span>
                  <p className="text-[10px] text-slate-500 truncate">
                    {lang === "te" ? "ఎలా బుక్ చేయాలి • ₹0 అడ్వాన్స్ • వారంటీ వివరాలు" : "How to book • Zero advance • Local pro warranty"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. "A CLEANER HOME, WITHOUT ANY HASSLE" PROMOTIONAL BANNER (Screenshot 1) */}
      <section className="bg-white px-3 sm:px-6 py-4 border-b border-slate-100">
        <div className="mx-auto max-w-xl">
          <Link
            href="/home-deep-cleaning"
            className="block rounded-3xl bg-[#EDE7E1] p-5 sm:p-6 relative overflow-hidden shadow-sm border border-[#DFD5C8] group hover:shadow-md transition-all"
          >
            <div className="space-y-2 z-10 max-w-[65%] relative">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                A cleaner home, without any hassle
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                {lang === "te"
                  ? "పూర్తి ఇల్లు డీప్ క్లీనింగ్ ₹2,499 నుండి"
                  : "Full home deep cleaning starts at ₹2,499"}
              </p>
              <div className="pt-2">
                <span className="inline-block bg-white text-slate-900 font-black text-xs px-5 py-2 rounded-xl shadow-xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {lang === "te" ? "ఇప్పుడే బుక్ చేయండి" : "Book now"}
                </span>
              </div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-36 sm:w-44 overflow-hidden">
              <Image
                src="/images/home-cleaning-banner.jpg"
                alt="A cleaner home"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                sizes="176px"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. IN THE SPOTLIGHT HERO BANNER CARDS */}
      <section className="bg-white px-3 sm:px-6 py-4 border-b border-slate-100">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "నెల్లూరులో ప్రముఖమైనవి" : "In the spotlight"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Banner 1: AC Foam Jet */}
            <Link
              href="/ac-services"
              className="group relative rounded-2xl bg-[#EDE7DE] border border-[#E3DCD1] p-4 flex items-center justify-between gap-3 overflow-hidden shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-1 z-10 flex-1 min-w-0 pr-1">
                <span className="inline-block bg-[#3E102F] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm">
                  {lang === "te" ? "కొత్త ప్రారంభం" : "New launch"}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {lang === "te" ? "గోడలు మురికి కాకుండా ఏసీ జెట్ వాష్" : "Water jacket AC foam jet wash"}
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  {lang === "te" ? "ప్రారంభ ధర ₹599 • ₹0 అడ్వాన్స్" : "Starting ₹599 • ₹0 Advance"}
                </p>
                <div className="pt-1">
                  <span className="inline-block bg-white text-slate-900 text-xs font-bold px-3.5 py-1 rounded-lg shadow-xs border border-slate-200">
                    {lang === "te" ? "బుక్ చేయండి" : "Book now"}
                  </span>
                </div>
              </div>
              <div className="relative h-20 w-22 rounded-xl overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/service-ac-foamjet.jpg"
                  alt="AC Foam Jet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="88px"
                />
              </div>
            </Link>

            {/* Banner 2: Odorless Pest Control */}
            <Link
              href="/pest-control"
              className="group relative rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-4 flex items-center justify-between gap-3 overflow-hidden shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-1 z-10 flex-1 min-w-0 pr-1">
                <span className="inline-block bg-[#166534] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm">
                  {lang === "te" ? "30 రోజుల వారంటీ" : "30-Day Warranty"}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {lang === "te" ? "వాసన లేని హెర్బల్ జెల్ చికిత్స" : "Odorless herbal Bayer gel"}
                </h3>
                <p className="text-[11px] text-slate-600 font-semibold">
                  {lang === "te" ? "1 BHK ₹1,499 నుండి" : "1 BHK from ₹1,499"}
                </p>
                <div className="pt-1">
                  <span className="inline-block bg-white text-slate-900 text-xs font-bold px-3.5 py-1 rounded-lg shadow-xs border border-slate-200">
                    {lang === "te" ? "బుక్ చేయండి" : "Book now"}
                  </span>
                </div>
              </div>
              <div className="relative h-20 w-22 rounded-xl overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/service-pest-general.jpg"
                  alt="Pest Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="88px"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MOST BOOKED SERVICES HORIZONTAL CAROUSEL (Urban Company Screenshot 4) */}
      <section className="bg-white px-3 sm:px-6 py-5 border-b border-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {lang === "te" ? "అత్యధికంగా బుక్ చేసిన సర్వీసులు" : "Most booked services"}
            </h2>
          </div>

          {/* Horizontal Swipe Row */}
          <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {/* Item 1: AC Foam Jet */}
            <Link
              href="/ac-services"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-ac-foamjet.jpg"
                  alt="Split AC Foam Jet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "స్ప్లిట్ ఏసీ ఫోమ్ జెట్" : "Foam-jet split AC"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.86</span>
                <span className="text-slate-500">(1.4k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹599
              </div>
            </Link>

            {/* Item 2: General Pest Control */}
            <Link
              href="/pest-control"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-pest-general.jpg"
                  alt="General Pest Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "సాధారణ పురుగులు (1 BHK)" : "General pest (1 BHK)"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.89</span>
                <span className="text-slate-500">(890)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹1,499
              </div>
            </Link>

            {/* Item 3: Intense Bathroom Scrubbing */}
            <Link
              href="/home-deep-cleaning?tab=bathroom"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/bathroom-scrub-banner.jpg"
                  alt="Intense Bathroom Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "బాత్‌రూమ్ డీప్ స్క్రబ్" : "Bathroom deep scrub"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.85</span>
                <span className="text-slate-500">(1.1k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹449
              </div>
            </Link>

            {/* Item 4: Chimney & Stove Cleaning */}
            <Link
              href="/home-deep-cleaning?tab=kitchen"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-cleaning-chimney.jpg"
                  alt="Chimney and Stove Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "చిమ్నీ & స్టవ్ క్లీనింగ్" : "Chimney & stove clean"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.88</span>
                <span className="text-slate-500">(940)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹649
              </div>
            </Link>

            {/* Item 5: Refrigerator Deep Clean */}
            <Link
              href="/home-deep-cleaning?tab=kitchen"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-cleaning-fridge.jpg"
                  alt="Refrigerator Deep Clean"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "ఫ్రిజ్ డీప్ క్లీనింగ్" : "Fridge deep clean"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.84</span>
                <span className="text-slate-500">(710)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹349
              </div>
            </Link>

            {/* Item 5: Bedbug Treatment */}
            <Link
              href="/pest-control"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-pest-bedbug.jpg"
                  alt="Bedbug Treatment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "నిద్రపురుగులు (ప్రతి గది)" : "Bedbug treatment (Room)"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.87</span>
                <span className="text-slate-500">(430)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹999
              </div>
            </Link>

            {/* Item 6: AC Repair */}
            <Link
              href="/ac-services"
              className="w-38 sm:w-44 flex-shrink-0 group block cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-ac-repair.jpg"
                  alt="AC Repair"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600">
                {lang === "te" ? "ఏసీ చెకప్ & రిపేర్" : "AC checkup & repair"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.78</span>
                <span className="text-slate-500">(865k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-[#059669] mt-0.5">
                ₹299
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NELLORE LOCAL PROS COLLABORATION & QUALITY ASSURANCE */}
      <section className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-3 sm:px-6 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="max-w-xl space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#166534]" />
                  <span>{lang === "te" ? "నెల్లూరులో మా నమూనా" : "Our Nellore Model"}</span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                  {lang === "te"
                    ? "నెల్లూరులో తొలిసారిగా — స్థానిక ప్రముఖ నిపుణులతో భాగస్వామ్యం"
                    : "Launching 1st in Nellore, Partnered with Established Local Pros"}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === "te"
                    ? "నెల్లూరులోని ప్రముఖ, ఏళ్ల అనుభవం గల స్థానిక టెక్నీషియన్లతో కలసి పనిచేస్తున్నాము. ఓస్మిడా అధికారిక బ్లాక్ యూనిఫాం, ఐడీ కార్డులు, నిర్ణీత ధరలు, ₹0 అడ్వాన్స్ & 30 రోజుల వరకు వారంటీ."
                    : "Collaborating with Nellore's established local technicians. Backed by supervised quality standards, official black uniform, transparent pricing, ₹0 advance, and service warranty."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full lg:w-auto shrink-0 pt-1">
                <div className="flex flex-col items-center justify-center text-center rounded-xl bg-slate-50 border border-slate-200/80 p-2 sm:p-3">
                  <span className="text-base sm:text-lg mb-0.5">🤝</span>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">
                    {lang === "te" ? "స్థానిక ప్రముఖులు" : "Local Pros"}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {lang === "te" ? "నెల్లూరు అనుభవం" : "Nellore verified"}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center rounded-xl bg-slate-50 border border-slate-200/80 p-2 sm:p-3">
                  <span className="text-base sm:text-lg mb-0.5">👔</span>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">
                    {lang === "te" ? "బ్లాక్ యూనిఫాం" : "Black Uniform"}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {lang === "te" ? "ఐడీ ధృవీకరణ" : "Photo ID"}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center text-center rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-2 sm:p-3">
                  <span className="text-base sm:text-lg mb-0.5">🛡️</span>
                  <p className="text-[11px] font-bold text-[#166534] leading-tight">
                    {lang === "te" ? "₹0 అడ్వాన్స్" : "₹0 Advance"}
                  </p>
                  <p className="text-[9px] text-[#166534]/80">
                    {lang === "te" ? "పని చూశాకే" : "Pay after service"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW TO BOOK VIDEO EXPLAINER (Telugu Video Guide) */}
      <HowItWorksVideoSection
        lang={lang}
        onOpenBookingModal={openCategoryModal}
      />

      {/* 4. VOICE NOTE & PHOTO EXIT RAMP (Zero typing for low-literacy users) */}
      <VoiceNoteBanner lang={lang} />

      {/* 5. SAFETY & QUALITY GUARANTEE (Urban Company 4 Guarantees) */}
      <div id="guarantee">
        <SafetyPromise lang={lang} />
      </div>





      {/* 8. NELLORE SERVICE AREA BADGES */}
      <section id="service-area" className="border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 sm:px-6 py-14">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#1E6FFF]" />
            <h3 className="text-lg sm:text-xl font-black text-[#111111]">
              {lang === "te" ? "మేము సేవలందించే నెల్లూరు ప్రాంతాలు" : "Service Areas Across Nellore City"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "Trunk Road", "Magunta Layout", "Pogathota", "Haranathapuram", "Dargamitta",
              "VRC Centre", "Stonehousepet", "Vedayapalem", "Podalakur Road", "Kovur Road",
              "Ramalingapuram", "Santhi Nagar", "Muthukur Road", "Fathekhanpet"
            ].map((loc) => (
              <span
                key={loc}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#111111] font-bold shadow-2xs"
              >
                📍 {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <div id="faq">
        <FaqSection lang={lang} />
      </div>

      {/* 10. EXPANDED BLACK FOOTER WITH FULL SITE LINKS */}
      <footer id="contact" className="border-t border-white/10 bg-[#0B0B0F] px-4 sm:px-6 py-14 text-slate-400">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Main 4-Column Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            {/* Column 1: Brand & Nellore Identity */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-black">
                  <Image src="/osmida.jpg" alt="Osmida" fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <span className="text-base font-black text-white tracking-widest">OSMIDA</span>
                  <p className="text-[10px] font-bold text-[#3BA3FF]">
                    {lang === "te" ? "నెల్లూరు హోమ్ సర్వీసెస్" : "Facility & Home Services"}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {lang === "te"
                  ? "నెల్లూరులో సరికొత్త ప్లాట్‌ఫామ్ — స్థానిక ప్రముఖ నిపుణులతో భాగస్వామ్యం. పురుగుల నివారణ, ఏసీ సర్వీస్, డీప్ క్లీనింగ్."
                  : "Nellore's new managed home services platform — partnering with established local experts. Zero advance fee and 30-day warranty."}
              </p>
              <p className="text-[11px] text-slate-500">
                Operating Entity: Finkfold (Osmida Brand)
              </p>
            </div>

            {/* Column 2: Core Services */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {lang === "te" ? "మా సేవలు" : "Our Services"}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/pest-control" className="hover:text-white transition-colors">
                    {lang === "te" ? "పురుగుల నివారణ (Pest Control)" : "Pest Control Services"}
                  </Link>
                </li>
                <li>
                  <Link href="/ac-services" className="hover:text-white transition-colors">
                    {lang === "te" ? "ఏసీ సర్వీస్ & రిపేర్" : "AC Servicing & Repair"}
                  </Link>
                </li>
                <li>
                  <Link href="/home-deep-cleaning" className="hover:text-white transition-colors">
                    {lang === "te" ? "హోమ్ డీప్ క్లీనింగ్" : "Home Deep Cleaning"}
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-[#1E6FFF] font-bold hover:underline">
                    {lang === "te" ? "ఆన్‌లైన్ బుకింగ్ (₹0 అడ్వాన్స్) →" : "Book Online (₹0 Advance) →"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company & Information */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {lang === "te" ? "కంపెనీ & సమాచారం" : "Company & Info"}
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {lang === "te" ? "ఆస్మిడా గురించి (About Us)" : "About Osmida Nellore"}
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation" className="hover:text-white transition-colors">
                    {lang === "te" ? "రద్దు & రీషెడ్యూల్ విధానం" : "Cancellation & Reschedule"}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {lang === "te" ? "నిబంధనలు (Terms of Service)" : "Terms of Service"}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {lang === "te" ? "గోప్యతా విధానం (Privacy Policy)" : "Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Local Support */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {lang === "te" ? "సంప్రదించండి" : "Contact & Support"}
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a href="tel:+917676358162" className="flex items-center gap-2 text-[#3BA3FF] font-bold hover:underline">
                    <Phone className="h-3.5 w-3.5 fill-[#3BA3FF]" />
                    <span>+91 76763 58162</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/917676358162"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#25D366] font-bold hover:underline"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                    <span>WhatsApp Support</span>
                  </a>
                </li>
                <li className="text-slate-400">
                  ✉️ osmidaindia@gmail.com
                </li>
                <li className="text-slate-400 leading-relaxed">
                  📍 Fathekhanpet, Pendemvari Street, Nellore, AP - 524003
                </li>
                <li className="text-slate-500 text-[11px]">
                  ⏰ Support: 8:00 AM – 8:00 PM (Mon-Sun)
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Osmida Facility Services (Operated by Finkfold). All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-slate-400">Terms</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
              <span>•</span>
              <Link href="/cancellation" className="hover:text-slate-400">Cancellation</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. FLOATING WHATSAPP BUTTON */}
      <FloatingContactBar lang={lang} />

      {/* 12. URBAN COMPANY-STYLE STICKY MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        lang={lang}
        onOpenServices={() => openCategoryModal("ac")}
      />

      {/* 13. URBAN COMPANY-STYLE CATEGORY SELECTOR MODAL */}
      <CategorySelectorModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        lang={lang}
        initialTab={modalTab}
      />

      {/* 14. URBAN COMPANY FLOATING CART BAR */}
      <UCFloatingCartBar lang={lang} />
    </main>
  );
}