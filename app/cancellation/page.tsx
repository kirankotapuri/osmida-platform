"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language, UI_TEXT } from "@/lib/translations";
import { Phone, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CancellationPage() {
  const [lang, setLang] = useState<Language>("en");

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-20 lg:pb-0 selection:bg-[#1E6FFF] selection:text-white">
      {/* 1. FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. BREADCRUMB */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs font-bold">
          <Link href="/" className="flex items-center gap-1.5 text-[#555555] hover:text-[#1E6FFF]">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "హోమ్ పేజీ" : "Back to Home"}</span>
          </Link>
          <span className="text-[#25D366]">
            {lang === "te" ? "₹0 రద్దు రుసుము" : "Zero Cancellation Fee"}
          </span>
        </div>
      </div>

      {/* 3. CONTENT */}
      <div className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">
            {lang === "te" ? "రద్దు మరియు రీషెడ్యూల్ నిబంధనలు" : "Cancellation & Reschedule Policy"}
          </h1>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-[#555555] leading-relaxed shadow-xs">
            <section className="space-y-2">
              <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>1. {lang === "te" ? "ఉచిత రీషెడ్యూల్ (Free Rescheduling)" : "Free Rescheduling Anytime"}</span>
              </h3>
              <p>
                {lang === "te"
                  ? "మీకు ఏదైనా అత్యవసర పని ఉంటే, టెక్నీషియన్ బయలుదేరే ముందు ఎప్పుడైనా మీ సమయాన్ని ఉచితంగా మార్చుకోవచ్చు. దీనికి ఎలాంటి అదనపు రుసుము ఉండదు."
                  : "Life happens! You can reschedule your appointment to another time or day completely free of charge before our technician is dispatched to your location."}
              </p>
            </section>

            <section className="space-y-2 border-t border-[#E5E7EB] pt-4">
              <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>2. {lang === "te" ? "ముందస్తు పేమెంట్ లేదు - సులభమైన రద్దు" : "Zero Advance = Zero Refund Hassle"}</span>
              </h3>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా ఎటువంటి ముందస్తు అడ్వాన్స్ వసూలు చేయదు. కాబట్టి మీరు బుకింగ్ రద్దు చేసుకున్నా రీఫండ్ కోసం వేచి చూడాల్సిన సమస్య ఉండదు."
                  : "Because Osmida collects zero advance payment, there are no painful refund waiting periods. If you need to cancel, simply call or WhatsApp our coordinator."}
              </p>
            </section>

            <section className="space-y-2 border-t border-[#E5E7EB] pt-4">
              <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                <span>3. {lang === "te" ? "ఎలా రద్దు చేసుకోవాలి?" : "How to Cancel or Reschedule?"}</span>
              </h3>
              <p>
                {lang === "te"
                  ? "మీ రిఫరెన్స్ నంబర్‌తో మా హెల్ప్‌లైన్ +91 76763 58162 కు కాల్ చేయండి లేదా వాట్సాప్‌లో మెసేజ్ పంపండి."
                  : "Send your Booking Reference ID on WhatsApp or call our support desk at +91 76763 58162 (8:00 AM – 8:00 PM)."}
              </p>
            </section>
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
            <Link href="/cancellation" className="text-white font-bold">Cancellation Policy</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <FloatingContactBar lang={lang} selectedServiceName="Cancellation Support" />
    </main>
  );
}
