"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language, UI_TEXT } from "@/lib/translations";
import { CheckCircle2, Phone, MessageSquare, Share2, ArrowLeft, Home, MapPin, Calendar } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref") || `OSM-NEL-${Math.floor(1000 + Math.random() * 9000)}`;
  const service = searchParams.get("service") || "Home Service";
  const locality = searchParams.get("locality") || "Nellore";
  const slot = searchParams.get("slot") || "Morning";

  const [lang, setLang] = useState<Language>("en");
  const t = UI_TEXT[lang];

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? `నమస్కారం ఆస్మిడా! నా బుకింగ్ వివరాలు:\n• రిఫరెన్స్: ${refId}\n• సేవ: ${service}\n• ప్రాంతం: ${locality}\n• సమయం: ${slot}\n\nదయచేసి 30 నిమిషాల్లో కాల్ చేసి ఖాయం చేయండి.`
        : `Namaskaram Osmida! My booking details:\n• Booking Ref: ${refId}\n• Service: ${service}\n• Area: ${locality}, Nellore\n• Slot: ${slot}\n\nPlease call me back within 30 minutes to confirm.`
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-20 lg:pb-0">
      {/* 1. FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. CONFIRMATION CARD */}
      <div className="px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border-2 border-[#25D366] text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.25)] animate-bounce">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">
              {t.successTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-2 max-w-sm mx-auto leading-relaxed">
              {t.successSub}
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-5 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
              <span className="text-[#555555]">{t.refId}:</span>
              <span className="font-mono font-black text-[#1E6FFF] text-base tracking-wider">{refId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555555]">{t.serviceBooked}:</span>
              <span className="font-bold text-[#111111]">{service}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555555]">{t.areaBooked}:</span>
              <span className="font-bold text-[#111111]">{locality}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555555]">{t.slotBooked}:</span>
              <span className="font-bold text-[#111111] capitalize">{slot}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] text-[11px]">
              <span className="text-[#555555]">Payment:</span>
              <span className="font-bold text-[#25D366]">₹0 Advance • Pay after service (UPI / Cash)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1FA851] py-4 text-xs sm:text-sm font-black text-white transition-all shadow-md active:scale-[0.97]"
            >
              <Share2 className="h-4 w-4" />
              <span>{t.saveOnWhatsApp}</span>
            </button>

            <a
              href="tel:+917676358162"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white hover:bg-[#F7F8FA] py-3.5 text-xs font-bold text-[#111111] transition-all active:scale-[0.97]"
            >
              <Phone className="h-4 w-4 text-[#1E6FFF]" />
              <span>{t.urgentCallText} +91 76763 58162</span>
            </a>
          </div>

          <div className="pt-2 border-t border-[#E5E7EB]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#555555] hover:text-[#1E6FFF] transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "హోమ్ పేజీకి తిరిగి వెళ్లండి" : "Return to Home"}</span>
            </Link>
          </div>
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

      {/* Mobile Sticky Bar */}
      <FloatingContactBar lang={lang} selectedServiceName={service} />
    </main>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center text-sm font-bold text-slate-500">Loading booking status...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
