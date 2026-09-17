"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";

import { NelloreBookingFlow } from "@/components/NelloreBookingFlow";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { SafetyPromise } from "@/components/SafetyPromise";
import { VoiceNoteBanner } from "@/components/VoiceNoteBanner";
import { FaqSection } from "@/components/FaqSection";
import {
  PestIllustration,
  AcIllustration,
  CleaningIllustration,
  HeroIllustration,
} from "@/components/ServiceIllustrations";
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
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [selectedServiceId, setSelectedServiceId] = useState<
    "pest-control" | "ac-services" | "home-cleaning"
  >("pest-control");

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
      "Osmida provides pest control, AC servicing, and home deep cleaning in Nellore with 30-day warranty, verified local experts, and 30-minute call confirmation.",
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
      className="min-h-screen bg-[#F7F8FA] text-[#111111] selection:bg-[#1E6FFF] selection:text-white pt-16 lg:pt-20 pb-20 lg:pb-0"
    >
      {/* Invisible Schema Script for Nellore Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. FIXED BLACK HEADER (Section 1 Detailed Spec: 80px desktop, 64px mobile) */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. TOP TRUST STRIP */}
      <div className="bg-[#EBF2FE] border-b border-[#D5E4FC] px-4 py-2 text-center text-xs font-bold text-[#0F4BD6]">
        <span>
          {lang === "te"
            ? "⚡ నెల్లూరు నగరంలో 30 నిమిషాల్లో కాల్ నిర్ధారణ • ₹0 అడ్వాన్స్ • 30 రోజుల వారంటీ గ్యారెంటీ"
            : "⚡ Nellore's #1 Home Service • 30-Min Call Confirmation • ₹0 Advance • 30-Day Guarantee"}
        </span>
      </div>

      {/* 3. SECTION 2: HERO SECTION (Exact Spec) */}
      <section className="relative px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-12 bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left/Center Text Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Trust Badge Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D1D5DB] bg-[#F7F8FA] px-3.5 py-1 text-xs font-bold text-[#111111] shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[#1E6FFF] animate-ping" />
                  <span>
                    {lang === "te"
                      ? "నెల్లూరులో 500+ ఇళ్లకు నమ్మకమైన సేవలు"
                      : "Serving 500+ Homes Across Nellore"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>4.8 / 5 Rating</span>
                </div>
              </div>

              {/* H1 Headline (Section 2 Spec) */}
              <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-black tracking-tight text-[#111111] leading-tight sm:leading-snug">
                {lang === "te" ? (
                  <>
                    నెల్లూరులో ధృవీకరించబడిన{" "}
                    <span className="text-[#1E6FFF]">హోమ్ సేవలు</span>
                  </>
                ) : (
                  <>
                    Verified home services in{" "}
                    <span className="text-[#1E6FFF]">Nellore</span>
                  </>
                )}
              </h1>

              {/* Subheading (Section 2 Spec) */}
              <p className="text-sm sm:text-base lg:text-[17px] text-[#555555] leading-relaxed max-w-xl">
                {lang === "te"
                  ? "పురుగుల నియంత్రణ, ఏసీ సర్వీస్, ఇంటి డీప్ క్లీనింగ్ – పర్యవేక్షణ నాణ్యత, న్యాయమైన ధరలు."
                  : "Pest control, AC service, and home deep cleaning – supervised quality, fair prices."}
              </p>

              {/* Quick Trust Highlights (30-day, ₹0 advance, 30 min) */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#444444] pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్" : "₹0 Advance Payment"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#1E6FFF]" />
                  <span>{lang === "te" ? "30 నిమిషాల్లో నిర్ధారణ" : "30-Min Call Confirmation"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#FF5A3C]" />
                  <span>{lang === "te" ? "30 రోజుల ఉచిత వారంటీ" : "30-Day Service Warranty"}</span>
                </span>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="tel:+917676358162"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-6 text-center text-sm font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
                >
                  <Phone className="h-4 w-4 fill-white" />
                  <span>{lang === "te" ? "కాల్: 76763 58162" : "Call 76763 58162"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => openWhatsAppDirect()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1FA851] py-3.5 px-6 text-center text-sm font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                  <span>{lang === "te" ? "వాట్సాప్‌లో మాట్లాడండి" : "WhatsApp Us"}</span>
                </button>
              </div>
            </div>

            {/* Right Hero Custom Illustration / Real Photo */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[440px] transition-transform duration-300 hover:scale-[1.02]">
                <HeroIllustration
                  className="w-full h-auto drop-shadow-md"
                  imageSrc="/images/hero-tech-v2.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: 3 SERVICE CARDS GRID (Exact Spec) */}
      <section id="services" className="px-4 sm:px-6 py-12 sm:py-16 bg-[#F7F8FA]">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
              {lang === "te" ? "ముఖ్యమైన సేవలు" : "Our Core Services"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
              {lang === "te" ? "మీకు అవసరమైన సేవను ఎంచుకోండి" : "Select Your Home Service"}
            </h2>
            <p className="text-xs sm:text-sm text-[#555555]">
              {lang === "te"
                ? "నెల్లూరులో సర్టిఫైడ్ నిపుణులు • వారంటీ రక్షణ • పని పూర్తయిన తర్వాతే చెల్లింపు"
                : "Transparent rates, verified local technicians, and zero advance payment."}
            </p>
          </div>

          {/* 3-Column Grid on Desktop / 1-Column on Mobile */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Card 1: Pest Control */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4 text-center">
                {/* Custom Illustrated Icon / Photo */}
                <div className="flex justify-center pt-2">
                  <PestIllustration
                    className="h-28 w-36 sm:h-32 sm:w-44 transition-transform duration-200 group-hover:scale-105"
                    imageSrc="/images/service-pest-v2.jpg"
                    alt="Pest Control Service"
                  />
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#1E6FFF] transition-colors">
                    {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
                  </h3>
                  <p className="text-[11px] font-bold text-[#FF5A3C] uppercase tracking-wider">
                    {lang === "te" ? "30 రోజుల ఉచిత వారంటీ" : "30-Day Free Warranty"}
                  </p>
                </div>

                {/* Short Description (Section 2 Spec) */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed min-h-[40px]">
                  {lang === "te"
                    ? "వారంటీతో ఇల్లు మరియు షాప్ పురుగుల నియంత్రణ."
                    : "Home & shop pest control with warranty."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[11px] text-[#444444] pt-1">
                  <span className="bg-[#FFF5F3] border border-[#FF5A3C]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "బొద్దింకలు" : "Cockroaches"}
                  </span>
                  <span className="bg-[#FFF5F3] border border-[#FF5A3C]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "నల్లులు" : "Bedbugs"}
                  </span>
                  <span className="bg-[#FFF5F3] border border-[#FF5A3C]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "చెదలు" : "Termites"}
                  </span>
                </div>

                {/* Price Line (Section 2 Spec) */}
                <div className="pt-2">
                  <span className="text-base sm:text-lg font-semibold text-[#1E6FFF]">
                    {lang === "te" ? "₹1,499 నుండి" : "From ₹1,499"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Book Now + Full Details */}
              <div className="pt-6 space-y-2.5">
                <Link
                  href="/book?service=pest-control"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-4 text-center text-sm font-semibold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/pest-control"
                  className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#555555] hover:text-[#1E6FFF] py-1.5 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: AC Services */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4 text-center">
                {/* Custom Illustrated Icon / Photo */}
                <div className="flex justify-center pt-2">
                  <AcIllustration
                    className="h-28 w-36 sm:h-32 sm:w-44 transition-transform duration-200 group-hover:scale-105"
                    imageSrc="/images/service-ac-v2.jpg"
                    alt="AC Services"
                  />
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#1E6FFF] transition-colors">
                    {lang === "te" ? "ఏసీ సర్వీస్" : "AC Services"}
                  </h3>
                  <p className="text-[11px] font-bold text-[#3BA3FF] uppercase tracking-wider">
                    {lang === "te" ? "15 రోజుల లీక్ వారంటీ" : "15-Day Leak Warranty"}
                  </p>
                </div>

                {/* Short Description (Section 2 Spec) */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed min-h-[40px]">
                  {lang === "te"
                    ? "సర్టిఫైడ్ టెక్నీషియన్లతో ఏసీ రిపేర్, సర్వీస్, ఇన్స్టాల్."
                    : "AC repair, service, installation by certified technicians."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[11px] text-[#444444] pt-1">
                  <span className="bg-[#F0F8FF] border border-[#3BA3FF]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "జెట్ పంప్ వాష్" : "Jet Pump Wash"}
                  </span>
                  <span className="bg-[#F0F8FF] border border-[#3BA3FF]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "కూలింగ్ చెక్" : "Cooling Check"}
                  </span>
                  <span className="bg-[#F0F8FF] border border-[#3BA3FF]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "వాటర్ లీకేజ్" : "Leak Fix"}
                  </span>
                </div>

                {/* Price Line (Section 2 Spec) */}
                <div className="pt-2">
                  <span className="text-base sm:text-lg font-semibold text-[#1E6FFF]">
                    {lang === "te" ? "₹699 నుండి" : "From ₹699"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Book Now + Full Details */}
              <div className="pt-6 space-y-2.5">
                <Link
                  href="/book?service=ac-services"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-4 text-center text-sm font-semibold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/ac-services"
                  className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#555555] hover:text-[#1E6FFF] py-1.5 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Home Deep Cleaning */}
            <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-1">
              <div className="space-y-4 text-center">
                {/* Custom Illustrated Icon / Photo */}
                <div className="flex justify-center pt-2">
                  <CleaningIllustration
                    className="h-28 w-36 sm:h-32 sm:w-44 transition-transform duration-200 group-hover:scale-105"
                    imageSrc="/images/service-cleaning-v2.jpg"
                    alt="Home Deep Cleaning"
                  />
                </div>

                {/* Service Title */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#1E6FFF] transition-colors">
                    {lang === "te" ? "ఇంటి డీప్ క్లీనింగ్" : "Home Deep Cleaning"}
                  </h3>
                  <p className="text-[11px] font-bold text-[#2FBF9B] uppercase tracking-wider">
                    {lang === "te" ? "24-గంటల క్వాలిటీ హామీ" : "24-Hr Quality Assurance"}
                  </p>
                </div>

                {/* Short Description (Section 2 Spec) */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed min-h-[40px]">
                  {lang === "te"
                    ? "అపార్ట్మెంట్లు మరియు ఇళ్లకు ప్రొఫెషనల్ డీప్ క్లీనింగ్."
                    : "Professional deep cleaning for apartments & homes."}
                </p>

                {/* Inclusions Teaser Chips */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[11px] text-[#444444] pt-1">
                  <span className="bg-[#EBFBF7] border border-[#2FBF9B]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "కిచెన్ డీగ్రీసింగ్" : "Kitchen Scrub"}
                  </span>
                  <span className="bg-[#EBFBF7] border border-[#2FBF9B]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "బాత్‌రూమ్ డీస్కేలింగ్" : "Bathrooms"}
                  </span>
                  <span className="bg-[#EBFBF7] border border-[#2FBF9B]/20 px-2.5 py-0.5 rounded-md font-medium">
                    {lang === "te" ? "ఫ్లోర్ డీప్ వాష్" : "Floor Polish"}
                  </span>
                </div>

                {/* Price Line (Section 2 Spec) */}
                <div className="pt-2">
                  <span className="text-base sm:text-lg font-semibold text-[#1E6FFF]">
                    {lang === "te" ? "₹2,499 నుండి" : "From ₹2,499"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Book Now + Full Details */}
              <div className="pt-6 space-y-2.5">
                <Link
                  href="/book?service=home-cleaning"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-4 text-center text-sm font-semibold text-white shadow-md active:scale-[0.98] transition-all"
                >
                  <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/home-deep-cleaning"
                  className="w-full flex items-center justify-center gap-1 text-xs font-bold text-[#555555] hover:text-[#1E6FFF] py-1.5 transition-colors"
                >
                  <span>{lang === "te" ? "పూర్తి వివరాలు & రేట్లు చూడండి" : "View Full Details & Scope"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* 6. NELLORE CUSTOMER TESTIMONIALS (TaskRabbit Human Focus) */}
      <section id="testimonials" className="border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
              {lang === "te" ? "నెల్లూరు ప్రజల నమ్మకం" : "Local Nellore Families"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mt-3">
              {lang === "te" ? "మా కస్టమర్ల అనుభవాలు" : "What Our Customers Say in Nellore"}
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] mt-2">
              {lang === "te"
                ? "సమయపాలన, మర్యాదపూర్వక ప్రవర్తన మరియు నమ్మకమైన సేవ."
                : "Real feedback from local residents and businesses across Nellore."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Srinivasulu Reddy",
                area: "Magunta Layout, Nellore",
                service: "Pest Control (Cockroaches)",
                serviceTe: "బొద్దింకల నివారణ",
                comment: "Excellent service! Within 2 hours of booking, the technician arrived in uniform. Cockroaches completely gone from the kitchen.",
                commentTe: "బుక్ చేసిన 2 గంటల్లోనే టెక్నీషియన్ యూనిఫాంలో వచ్చారు. కిచెన్‌లో బొద్దింకల బెడద పూర్తిగా తగ్గింది.",
                rating: 5
              },
              {
                name: "Anusha K.",
                area: "Pogathota, Nellore",
                service: "AC Jet Pump Service",
                serviceTe: "ఏసీ జెట్ పంప్ సర్వీస్",
                comment: "They brought their own drop sheets and water bucket. No mess on my wall or floor, and AC cooling is like a new machine.",
                commentTe: "గోడలకు, నేలకి ఎటువంటి మరకలు లేకుండా డ్రాప్ షీట్లతో చాలా జాగ్రత్తగా క్లీన్ చేశారు. కూలింగ్ అద్భుతంగా ఉంది.",
                rating: 5
              },
              {
                name: "Venkat Rao",
                area: "Trunk Road, Nellore",
                service: "Home Deep Cleaning",
                serviceTe: "ఇంటి డీప్ క్లీనింగ్",
                comment: "Before Gruhapravesam, Osmida team cleaned our 3 BHK house thoroughly. Bathrooms and kitchen counters shine spotless.",
                commentTe: "గృహప్రవేశం కోసం మా 3 BHK ఇంటిని శుభ్రం చేయించాం. బాత్రూమ్‌లు, కిచెన్ కొత్తగా మెరుస్తున్నాయి.",
                rating: 5
              }
            ].map((review, i) => (
              <div key={i} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, r) => (
                    <Star key={r} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#333333] italic leading-relaxed">
                  &ldquo;{lang === "te" ? review.commentTe : review.comment}&rdquo;
                </p>
                <div className="pt-2 border-t border-[#F0F2F5]">
                  <p className="font-bold text-[#111111] text-xs sm:text-sm">{review.name}</p>
                  <p className="text-[11px] text-[#1E6FFF] font-semibold">📍 {review.area}</p>
                  <p className="text-[10px] text-[#555555] mt-0.5">
                    {lang === "te" ? review.serviceTe : review.service}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



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
                  ? "నెల్లూరు నగరంలో పురుగుల నివారణ, ఏసీ సర్వీస్, మరియు హోమ్ డీప్ క్లీనింగ్ నమ్మకమైన సేవా సంస్థ."
                  : "Nellore's premier local home services platform. Zero advance fee, verified technicians, and 30-day warranty."}
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

      {/* 11. FLOATING MOBILE CONTACT BAR (Sticky Call in Blue & WhatsApp in Green) */}
      <FloatingContactBar
        lang={lang}
        selectedServiceName={SERVICES_DATA.find((s) => s.id === selectedServiceId)?.titleEn}
      />
    </main>
  );
}