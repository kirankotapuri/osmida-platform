"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { NelloreBookingFlow } from "@/components/NelloreBookingFlow";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language, UI_TEXT, SERVICES_DATA } from "@/lib/translations";
import { Phone, ArrowLeft, ShieldCheck, Star } from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "pest-control";
  const planParam = searchParams.get("plan") || "";

  // Normalize param
  let initialServiceId: "pest-control" | "ac-services" | "home-cleaning" = "pest-control";
  if (serviceParam.includes("ac")) {
    initialServiceId = "ac-services";
  } else if (serviceParam.includes("clean")) {
    initialServiceId = "home-cleaning";
  }

  const [lang, setLang] = useState<Language>("en");
  const t = UI_TEXT[lang];

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-20 lg:pb-0">
      {/* 1. FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. BREADCRUMB */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs font-bold">
          <Link href="/" className="flex items-center gap-1.5 text-[#555555] hover:text-[#1E6FFF]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "హోమ్ పేజీ" : "Home"}</span>
          </Link>
          <span className="text-[#25D366] flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>{lang === "te" ? "₹0 అడ్వాన్స్ • సురక్షిత బుకింగ్" : "₹0 Advance • Pay After Work"}</span>
          </span>
        </div>
      </div>

      {/* 3. BOOKING WIZARD WRAPPER */}
      <div className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">
              {lang === "te" ? "నెల్లూరు హోమ్ సర్వీస్ బుకింగ్" : "Book Verified Home Service"}
            </h1>
            <p className="text-xs text-[#555555] mt-1">
              {lang === "te"
                ? "30 నిమిషాల్లో కాల్ నిర్ధారణ • స్థానిక నెల్లూరు నిపుణులు"
                : "30-minute confirmation call • Pay after service is completed"}
            </p>
          </div>

          <NelloreBookingFlow
            lang={lang}
            onLanguageChange={setLang}
            initialServiceId={initialServiceId}
            initialSubtypeId={planParam}
          />
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] px-4 sm:px-6 py-12 text-slate-400 mt-12">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link href="/" className="text-white font-black tracking-widest text-sm">
            OSMIDA NELLORE
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:text-white">Cancellation Policy</Link>
          </div>
        </div>
      </footer>

      <FloatingContactBar lang={lang} selectedServiceName="Osmida Service" />
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center text-sm font-bold text-slate-500">Loading booking flow...</div>}>
      <BookingContent />
    </Suspense>
  );
}
