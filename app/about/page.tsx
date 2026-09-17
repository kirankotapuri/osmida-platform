"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language, UI_TEXT } from "@/lib/translations";
import { Phone, ArrowLeft, ShieldCheck, MapPin, Award, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const [lang, setLang] = useState<Language>("en");
  const t = UI_TEXT[lang];

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
          <span className="text-[#1E6FFF]">
            📍 Fathekhanpet, Nellore
          </span>
        </div>
      </div>

      {/* 3. CONTENT BODY */}
      <div className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-8 text-left">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
              {lang === "te" ? "మా గురించి" : "Our Story & Mission"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mt-3">
              {lang === "te" ? "నెల్లూరు ప్రజల కోసం నమ్మకమైన హోమ్ సర్వీసెస్" : "Nellore's Most Trusted Home Services Platform"}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#555555] leading-relaxed">
              {lang === "te"
                ? "ఆస్మిడా (Osmida) నెల్లూరు నగరంలో పుట్టి, నెల్లూరు కుటుంబాలు మరియు వ్యాపార సంస్థల కోసం ప్రారంభించబడింది. నమ్మకమైన టెక్నీషియన్లను వెతకడం, సరైన రేట్లతో పనిచేయించడం ఎంత కష్టమో మేము చూశాము."
                : "Osmida was built specifically for Nellore. We saw firsthand how stressful it is for families to find trustworthy technicians who show up on time, quote fair prices, and stand by their work."}
            </p>
          </div>

          {/* Core Values */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                titleEn: "100% Verified Local Experts",
                titleTe: "పూర్తిగా విచారించిన స్థానిక నిపుణులు",
                descEn: "Every partner is verified with ID cards, professional tools, and polite customer etiquette.",
                descTe: "అన్ని గుర్తింపు కార్డులు పరిశీలించి, మర్యాదగా ప్రవర్తించే స్థానిక నిపుణులను మాత్రమే పంపుతాము."
              },
              {
                titleEn: "Zero Advance • Pay After Service",
                titleTe: "₹0 అడ్వాన్స్ • పని అయ్యాకే పేమెంట్",
                descEn: "You never pay a single rupee upfront. Only pay via UPI or cash after inspecting the completed job.",
                descTe: "ముందుగా ఎలాంటి అడ్వాన్స్ ఇవ్వక్కర్లేదు. పని చూసి సంతృప్తి చెందిన తర్వాతే చెల్లించండి."
              },
              {
                titleEn: "30-Day Free Revisit Guarantee",
                titleTe: "30 రోజుల ఉచిత రీవిజిట్ వారంటీ",
                descEn: "If pests return or AC leaks within 30 days, we come back and fix it completely free of cost.",
                descTe: "30 రోజుల్లో సమస్య మళ్లీ కనిపిస్తే ఉచితంగా రీ-ట్రీట్మెంట్ చేస్తాము."
              },
              {
                titleEn: "Nellore-First Support",
                titleTe: "స్థానిక నెల్లూరు సపోర్ట్",
                descEn: "Our team speaks fluent Telugu and English. Reach our local coordinator directly on phone or WhatsApp.",
                descTe: "మా స్థానిక బృందం మీతో తెలుగులో మాట్లాడి మీ సమస్యను పరిష్కరిస్తుంది."
              }
            ].map((v, i) => (
              <div key={i} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-2 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-[#25D366]" />
                <h3 className="font-black text-[#111111] text-base">
                  {lang === "te" ? v.titleTe : v.titleEn}
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  {lang === "te" ? v.descTe : v.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Operating details */}
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 space-y-3 text-xs text-[#555555]">
            <h3 className="text-sm font-black text-[#111111]">
              Legal & Operating Identity
            </h3>
            <p>• Brand: Osmida Facility Services</p>
            <p>• Operating Entity: Finkfold</p>
            <p>• Registered Operating Address: Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh - 524003, India</p>
            <p>• Customer Support: +91 76763 58162 | osmidaindia@gmail.com</p>
            <p>• Working Hours: 8:00 AM – 8:00 PM (All 7 Days)</p>
          </div>

          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-6 text-sm font-black text-white transition-all shadow-md active:scale-[0.97]"
            >
              <span>{lang === "te" ? "సర్వీస్ బుక్ చేయండి" : "Book a Service Now"}</span>
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
      <FloatingContactBar lang={lang} selectedServiceName="Osmida Nellore" />
    </main>
  );
}
