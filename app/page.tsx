"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";

import { NelloreBookingFlow } from "@/components/NelloreBookingFlow";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { SafetyPromise } from "@/components/SafetyPromise";
import { VoiceNoteBanner } from "@/components/VoiceNoteBanner";
import { FaqSection } from "@/components/FaqSection";
import { CategorySelectorModal } from "@/components/CategorySelectorModal";
import { HowItWorksVideoSection } from "@/components/HowItWorksVideoSection";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { UCCartDrawer } from "@/components/UCCartDrawer";
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
  Zap,
  Search,
  ChevronRight,
  SlidersHorizontal,
  Play,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [selectedServiceId, setSelectedServiceId] = useState<
    "pest-control" | "ac-services" | "home-cleaning"
  >("pest-control");
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
      className="min-h-screen bg-[#F7F8FA] text-[#111111] selection:bg-[#1E6FFF] selection:text-white pt-14 sm:pt-16 lg:pt-20 pb-20 lg:pb-0"
    >
      {/* Invisible Schema Script for Nellore Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. FIXED BLACK HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. TOP TRUST STRIP */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-3 sm:px-4 py-1.5 sm:py-2 text-center text-[11px] sm:text-xs font-bold text-slate-800">
        <span>
          {lang === "te"
            ? "⚡ నెల్లూరులో తొలిసారిగా • స్థానిక ప్రముఖ నిపుణులతో భాగస్వామ్యం • ₹0 అడ్వాన్స్ • 30 రోజుల వరకు వారంటీ (నిబంధనలు వర్తిస్తాయి)"
            : "⚡ Launching 1st in Nellore • Partnered with Established Local Pros • ₹0 Advance • Up to 30-Day Warranty (Terms Apply)"}
        </span>
      </div>

      {/* 3. URBAN COMPANY MOBILE SEARCH BAR (Screenshot 1) */}
      <section className="bg-white px-3 sm:px-6 pt-3 pb-2">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => openCategoryModal("ac")}
            className="w-full flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-[#F8F9FA] hover:bg-white hover:border-slate-400 p-3 sm:p-3.5 shadow-2xs transition-all text-left group"
            aria-label="Search services"
          >
            <Search className="h-4.5 w-4.5 text-slate-500 group-hover:text-slate-900 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-500 font-medium truncate">
              {lang === "te"
                ? "శోధించండి: 'ఏసీ జెట్ వాష్', 'పురుగుల మందు', 'డీప్ క్లీనింగ్'..."
                : "Search for 'AC Foam Jet', 'Pest Control', 'Deep Cleaning'..."}
            </span>
          </button>
        </div>
      </section>

      {/* 4. THE ICONIC URBAN COMPANY 4-SQUIRCLE CATEGORY GRID (Screenshot 1) */}
      <section className="bg-white px-3 sm:px-6 py-4 border-b border-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {/* Squircle 1: AC Services */}
            <button
              type="button"
              onClick={() => openCategoryModal("ac")}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="relative h-18 w-18 sm:h-22 sm:w-22 rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EAEAEA] border border-slate-200/60 flex items-center justify-center p-2.5 transition-all group-hover:scale-105 shadow-2xs">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden">
                  <Image
                    src="/images/service-ac-foamjet.jpg"
                    alt="AC Services"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-1.5 leading-tight group-hover:text-black">
                {lang === "te" ? "ఏసీ సర్వీస్" : "AC Services"}
              </span>
              <span className="text-[10px] font-extrabold text-slate-700 mt-0.5">
                From ₹599
              </span>
            </button>

            {/* Squircle 2: Pest Control */}
            <button
              type="button"
              onClick={() => openCategoryModal("pest")}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="relative h-18 w-18 sm:h-22 sm:w-22 rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EAEAEA] border border-slate-200/60 flex items-center justify-center p-2.5 transition-all group-hover:scale-105 shadow-2xs">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden">
                  <Image
                    src="/images/service-pest-general.jpg"
                    alt="Pest Control"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-1.5 leading-tight group-hover:text-black">
                {lang === "te" ? "పురుగుల నివారణ" : "Pest Control"}
              </span>
              <span className="text-[10px] font-extrabold text-slate-700 mt-0.5">
                From ₹1,499
              </span>
            </button>

            {/* Squircle 3: Home Cleaning */}
            <button
              type="button"
              onClick={() => openCategoryModal("cleaning")}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="relative h-18 w-18 sm:h-22 sm:w-22 rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EAEAEA] border border-slate-200/60 flex items-center justify-center p-2.5 transition-all group-hover:scale-105 shadow-2xs">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden">
                  <Image
                    src="/images/service-cleaning-home.jpg"
                    alt="Deep Cleaning"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-1.5 leading-tight group-hover:text-black">
                {lang === "te" ? "డీప్ క్లీనింగ్" : "Deep Cleaning"}
              </span>
              <span className="text-[10px] font-extrabold text-slate-700 mt-0.5">
                1 BHK ₹2,499
              </span>
            </button>

            {/* Squircle 4: Video Guide */}
            <a
              href="#how-to-book-video"
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="relative h-18 w-18 sm:h-22 sm:w-22 rounded-2xl bg-[#F5F5F7] group-hover:bg-[#EAEAEA] border border-slate-200/60 flex items-center justify-center p-2.5 transition-all group-hover:scale-105 shadow-2xs">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                  <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 mt-1.5 leading-tight group-hover:text-black">
                {lang === "te" ? "వీడియో గైడ్" : "Video Guide"}
              </span>
              <span className="text-[10px] font-extrabold text-slate-700 mt-0.5">
                1 Min Telugu
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. IN THE SPOTLIGHT HERO BANNER (Urban Company Screenshot 2 & 3) */}
      <section className="bg-white px-3 sm:px-6 py-5 border-b border-slate-100">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {lang === "te" ? "నెల్లూరులో ప్రముఖమైనవి" : "In the spotlight"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Banner 1: AC Foam Jet */}
            <div
              onClick={() => openCategoryModal("ac")}
              className="cursor-pointer group relative rounded-2xl bg-[#EDE7DE] border border-[#E3DCD1] p-4 sm:p-5 flex items-center justify-between gap-3 overflow-hidden shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-1.5 z-10 flex-1 min-w-0 pr-1">
                <span className="inline-block bg-[#3E102F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {lang === "te" ? "కొత్త ప్రారంభం" : "New launch"}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {lang === "te" ? "గోడలు మురికి కాకుండా ఏసీ జెట్ వాష్" : "Water jacket AC foam jet wash"}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === "te" ? "ప్రారంభ ధర ₹599 • ₹0 అడ్వాన్స్" : "Starting ₹599 • ₹0 Advance"}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    className="inline-block bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs border border-slate-200 transition-transform active:scale-95"
                  >
                    {lang === "te" ? "ఇప్పుడే బుక్ చేయండి" : "Book now"}
                  </button>
                </div>
              </div>
              <div className="relative h-24 w-28 sm:h-28 sm:w-36 rounded-xl overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/service-ac-foamjet.jpg"
                  alt="AC Foam Jet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="140px"
                />
              </div>
            </div>

            {/* Banner 2: Full Home Deep Clean */}
            <div
              onClick={() => openCategoryModal("cleaning")}
              className="cursor-pointer group relative rounded-2xl bg-[#F4F4F6] border border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-3 overflow-hidden shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-1.5 z-10 flex-1 min-w-0 pr-1">
                <span className="inline-block bg-[#166534] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {lang === "te" ? "పండుగ క్లీన్" : "Trending"}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {lang === "te" ? "శ్రమ లేకుండా మీ ఇల్లు మెరిసిపోయేలా" : "A cleaner home, without any hassle"}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === "te" ? "హోమ్ డీప్ క్లీన్ 1 BHK ₹2,499 నుండి" : "Full home clean starting from ₹2,499"}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    className="inline-block bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-xl shadow-xs border border-slate-200 transition-transform active:scale-95"
                  >
                    {lang === "te" ? "ఇప్పుడే బుక్ చేయండి" : "Book now"}
                  </button>
                </div>
              </div>
              <div className="relative h-24 w-28 sm:h-28 sm:w-36 rounded-xl overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/service-cleaning-home.jpg"
                  alt="Full Home Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="140px"
                />
              </div>
            </div>
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
            <div
              onClick={() => openCategoryModal("ac")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
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
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "స్ప్లిట్ ఏసీ ఫోమ్ జెట్" : "Foam-jet split AC"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.86</span>
                <span className="text-slate-500">(1.4k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹599
              </div>
            </div>

            {/* Item 2: General Pest Control */}
            <div
              onClick={() => openCategoryModal("pest")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
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
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "సాధారణ పురుగులు (1 BHK)" : "General pest (1 BHK)"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.89</span>
                <span className="text-slate-500">(890)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹1,499
              </div>
            </div>

            {/* Item 3: Intense Bathroom Scrubbing */}
            <div
              onClick={() => openCategoryModal("cleaning")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-cleaning-bathroom.jpg"
                  alt="Bathroom Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "బాత్‌రూమ్ డీప్ స్క్రబ్" : "Bathroom deep scrub"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.85</span>
                <span className="text-slate-500">(1.1k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹499
              </div>
            </div>

            {/* Item 4: Home Deep Clean */}
            <div
              onClick={() => openCategoryModal("cleaning")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 shadow-2xs">
                <Image
                  src="/images/service-cleaning-home.jpg"
                  alt="Home Deep Cleaning"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="176px"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "ఫుల్ హోమ్ డీప్ క్లీన్ (1 BHK)" : "Full home clean (1 BHK)"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.82</span>
                <span className="text-slate-500">(620)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹2,499
              </div>
            </div>

            {/* Item 5: Bedbug Treatment */}
            <div
              onClick={() => openCategoryModal("pest")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
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
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "నిద్రపురుగులు (ప్రతి గది)" : "Bedbug treatment (Room)"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.87</span>
                <span className="text-slate-500">(430)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹999
              </div>
            </div>

            {/* Item 6: AC Repair */}
            <div
              onClick={() => openCategoryModal("ac")}
              className="w-38 sm:w-44 flex-shrink-0 cursor-pointer group"
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
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {lang === "te" ? "ఏసీ చెకప్ & రిపేర్" : "AC checkup & repair"}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                <span className="font-bold">4.78</span>
                <span className="text-slate-500">(865k)</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                ₹299
              </div>
            </div>
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

      {/* 4. SECTION 2: 3 SERVICE CARDS GRID (Mobile Aligned) */}
      <section id="services" className="px-3 sm:px-6 py-10 sm:py-16 bg-[#F7F8FA]">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
              {lang === "te" ? "ముఖ్యమైన సేవలు" : "Our Core Services"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
              {lang === "te" ? "మీకు అవసరమైన సేవను ఎంచుకోండి" : "Select Your Home Service"}
            </h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              {lang === "te"
                ? "నెల్లూరులో ప్రముఖ స్థానిక భాగస్వాములు • వారంటీ రక్షణ • పని పూర్తయిన తర్వాతే చెల్లింపు"
                : "Established Nellore partners, transparent pricing, and zero advance payment."}
            </p>
          </div>

          {/* 3-Column Grid on Desktop / 1-Column on Mobile */}
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-3">
            {/* Card 1: Pest Control */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-3 sm:space-y-4 text-center">
                {/* Service Photo with Official Uniform */}
                <div className="flex justify-center pt-1">
                  <div className="relative h-32 sm:h-36 w-full max-w-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/service-pest-v2.jpg"
                      alt="Osmida Pest Specialist in Official Uniform"
                      fill
                      className="object-cover object-top"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-gray-900 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      Official Uniform
                    </div>
                  </div>
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-black transition-colors">
                    {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === "te" ? "30 రోజుల ఉచిత రీవిజిట్ వారంటీ (నిబంధనలు వర్తిస్తాయి)" : "30-Day Revisit Warranty (Terms Apply)"}
                  </p>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === "te"
                    ? "వారంటీతో ఇల్లు మరియు షాప్ పురుగుల నియంత్రణ."
                    : "Home & shop pest control with warranty."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-700 pt-0.5">
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "బొద్దింకలు" : "Cockroaches"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "నల్లులు" : "Bedbugs"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "చెదలు" : "Termites"}
                  </span>
                </div>

                {/* Price Line */}
                <div className="pt-1">
                  <span className="text-base sm:text-lg font-black text-[#0F172A]">
                    {lang === "te" ? "₹1,499 నుండి" : "From ₹1,499"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Primary View Plans + Secondary Details */}
              <div className="pt-4 sm:pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openCategoryModal("pest")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-black py-3 sm:py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300" />
                  <span>{lang === "te" ? "ప్లాన్లు ఎంచుకోండి & బుక్ చేయండి" : "View Plans & Book"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <Link
                  href="/pest-control"
                  className="w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-black py-1 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: AC Services */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-3 sm:space-y-4 text-center">
                {/* Service Photo with Official Uniform */}
                <div className="flex justify-center pt-1">
                  <div className="relative h-32 sm:h-36 w-full max-w-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/service-ac-v2.jpg"
                      alt="Osmida AC Service Technician in Official Uniform"
                      fill
                      className="object-cover object-top"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-gray-900 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      Official Uniform
                    </div>
                  </div>
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-black transition-colors">
                    {lang === "te" ? "ఏసీ సర్వీస్" : "AC Services"}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === "te" ? "15 రోజుల కూలింగ్ & లీక్ వారంటీ" : "15-Day Cooling & Leak Warranty"}
                  </p>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === "te"
                    ? "స్థానిక అనుభవజ్ఞులతో ఏసీ రిపేర్, సర్వీస్, ఇన్‌స్టాలేషన్."
                    : "AC repair, foam jet service, installation by local experts."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-700 pt-0.5">
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "ఫోమ్ జెట్ వాష్" : "Foam Jet Wash"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "కూలింగ్ చెక్" : "Cooling Check"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "గ్యాస్ రీఫిల్" : "Gas Refill"}
                  </span>
                </div>

                {/* Price Line */}
                <div className="pt-1">
                  <span className="text-base sm:text-lg font-black text-[#0F172A]">
                    {lang === "te" ? "₹599 నుండి" : "From ₹599"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Primary View Plans + Secondary Details */}
              <div className="pt-4 sm:pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openCategoryModal("ac")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-black py-3 sm:py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300" />
                  <span>{lang === "te" ? "ప్లాన్లు ఎంచుకోండి & బుక్ చేయండి" : "View Plans & Book"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <Link
                  href="/ac-services"
                  className="w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-black py-1 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Home Deep Cleaning */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-3 sm:space-y-4 text-center">
                {/* Service Photo with Official Uniform */}
                <div className="flex justify-center pt-1">
                  <div className="relative h-32 sm:h-36 w-full max-w-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/service-cleaning-v2.jpg"
                      alt="Osmida Cleaning Professional in Official Uniform"
                      fill
                      className="object-cover object-top"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-gray-900 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
                      Official Uniform
                    </div>
                  </div>
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] group-hover:text-black transition-colors">
                    {lang === "te" ? "ఇంటి డీప్ క్లీనింగ్" : "Home Deep Cleaning"}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === "te" ? "24-గంటల క్వాలిటీ చెక్" : "24-Hr Quality Check"}
                  </p>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === "te"
                    ? "అపార్ట్మెంట్లు మరియు ఇళ్లకు ప్రొఫెషనల్ డీప్ క్లీనింగ్."
                    : "Professional deep cleaning for apartments & homes."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-700 pt-0.5">
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "కిచెన్ డీగ్రీసింగ్" : "Kitchen Scrub"}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "బాత్‌రూమ్ డీస్కేలింగ్" : "Bathrooms"}
                  </span>
                </div>

                {/* Price Line */}
                <div className="pt-1">
                  <span className="text-base sm:text-lg font-black text-[#0F172A]">
                    {lang === "te" ? "1 BHK ₹2,499 నుండి" : "1 BHK From ₹2,499"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Primary View Plans + Secondary Details */}
              <div className="pt-4 sm:pt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => openCategoryModal("cleaning")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-black py-3 sm:py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300" />
                  <span>{lang === "te" ? "ప్లాన్లు ఎంచుకోండి & బుక్ చేయండి" : "View Plans & Book"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <Link
                  href="/home-deep-cleaning"
                  className="w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 hover:text-black py-1 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2B. HOW TO BOOK VIDEO EXPLAINER (Telugu Video Guide) */}
      <HowItWorksVideoSection
        lang={lang}
        onOpenBookingModal={openCategoryModal}
      />

      {/* 5. FAST 60-SECOND BOOKING SECTION (Hybrid Flow Option) */}
      <section id="booking-section" className="px-4 sm:px-6 py-12 bg-white border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E6FFF] bg-[#1E6FFF]/10 px-3 py-1 rounded-full">
              <Zap className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "తక్షణ బుకింగ్ (60 సెకన్లు)" : "Instant 60-Second Booking"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
              {lang === "te" ? "నేరుగా ఇప్పుడే షెడ్యూల్ చేయండి" : "Schedule Service Without Advance Payment"}
            </h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              {lang === "te"
                ? "మీ సర్వీస్ ఎంచుకోండి, వివరాలు ఇవ్వండి, 30 నిమిషాల్లో మా కోఆర్డినేటర్ కాల్ చేసి సమయాన్ని ఖరారు చేస్తారు."
                : "Pick your service, choose your time slot, and our local coordinator will call in 30 minutes."}
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <NelloreBookingFlow
              key={selectedServiceId}
              lang={lang}
              onLanguageChange={setLang}
              initialServiceId={selectedServiceId}
            />
          </div>
        </div>
      </section>

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
      <FloatingContactBar
        lang={lang}
        selectedServiceName={SERVICES_DATA.find((s) => s.id === selectedServiceId)?.titleEn}
      />

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

      {/* 14. URBAN COMPANY FLOATING CART BAR & SLIDE-UP DRAWER */}
      <UCFloatingCartBar lang={lang} />
      <UCCartDrawer lang={lang} />
    </main>
  );
}