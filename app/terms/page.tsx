"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language } from "@/lib/translations";
import { ArrowLeft, ShieldCheck, CheckCircle2, FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
          <span className="text-[#1E6FFF] flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "సేవా నిబంధనలు" : "Terms of Service"}</span>
          </span>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="px-4 py-10 sm:py-14">
        <article className="mx-auto max-w-3xl space-y-8 text-left">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
              {lang === "te" ? "చట్టపరమైన నిబంధనలు" : "Terms & Conditions"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-3">
              {lang === "te" ? "సేవా నిబంధనలు (Terms of Service)" : "Terms of Service"}
            </h1>
            <p className="text-xs text-[#555555] mt-1">
              Last Updated: September 17, 2026 • Osmida Facility Services (Operated by Finkfold)
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#444444] leading-relaxed shadow-xs">
            {/* Clause 1 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E6FFF]" />
                <span>1. {lang === "te" ? "సేవల పరిధి (Scope of Services)" : "Scope of Services"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా (ఫింక్‌ఫోల్డ్ సంస్థ ఆధ్వర్యంలో) నెల్లూరు నగరంలో పెస్ట్ కంట్రోల్ (బొద్దింకలు, నల్లులు, చెదలు), ఏసీ సర్వీస్ (జెట్ పంప్ వాష్, లీకేజ్ రిపేర్), మరియు హోమ్ డీప్ క్లీనింగ్ సేవలను నిర్వహిస్తుంది. ప్రతి సర్వీస్ ప్రారంభానికి ముందు స్పష్టమైన స్కోప్ వివరించబడుతుంది."
                  : "Osmida Facility Services (operated by Finkfold) manages professional pest control, air conditioning servicing, and residential/commercial deep cleaning across designated localities in Nellore, Andhra Pradesh. Service scopes are confirmed before commencement."}
              </p>
            </section>

            {/* Clause 2 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#25D366]" />
                <span>2. {lang === "te" ? "₹0 ముందస్తు చెల్లింపు విధానం (Zero Advance Payment)" : "Transparent Pricing & ₹0 Advance Policy"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మా దగ్గర ఎలాంటి ముందస్తు బుకింగ్ ఫీజు ఉండదు. మా టెక్నీషియన్ మీ ఇంటికి వచ్చి పని పూర్తయిన తర్వాత, మీ సంతృప్తి చూసుకున్న తర్వాత మాత్రమే మీరు UPI లేదా నగదు రూపంలో చెల్లించాలి. ఎలాంటి దాచిన ఛార్జీలు ఉండవు."
                  : "Osmida charges ₹0 advance fee for inspection visits and standard home service bookings. Final payment is due only upon completion of service and customer sign-off. Accepted payment methods include UPI (Google Pay, PhonePe, Paytm) and cash directly to the service coordinator."}
              </p>
            </section>

            {/* Clause 3 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E6FFF]" />
                <span>3. {lang === "te" ? "సర్వీస్ వారంటీ & రీ-విజిట్ నిబంధనలు" : "Service Warranty & Rework Terms"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "పురుగుల నివారణ సేవలకు 30 రోజుల ఉచిత రీవిజిట్ వారంటీ ఉంటుంది (ట్రీట్ చేసిన గదుల్లో అదే రకమైన పురుగుల సమస్యకు వర్తిస్తుంది). ఏసీ ఫోమ్ జెట్ సర్వీస్‌పై 15 రోజుల కూలింగ్ మరియు లీక్ వారంటీ ఉంటుంది; భర్తీ చేసిన కొత్త స్పేర్ పార్ట్సుపై 30 రోజుల వారంటీ ఉంటుంది. హోమ్ డీప్ క్లీనింగ్ పూర్తయ్యాక 24 గంటల లోపు తనిఖీ నిర్వహించబడుతుంది."
                  : "General pest control includes a 30-day rework warranty covering the same pest type within treated premises. AC Foam Jet servicing carries a 15-day cooling & water leakage warranty, with a 30-day warranty on newly replaced genuine spare parts. Home deep cleaning includes a 24-hour customer sign-off & corrective touch-up window. Warranty does not apply if treated premises suffer subsequent water flooding, structural construction alterations, or cross-contamination from untreated external zones."}
              </p>
            </section>

            {/* Clause 4 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>4. {lang === "te" ? "కస్టమర్ సహకారం & విద్యుత్ / నీటి సదుపాయం" : "Customer Responsibilities & Utilities"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "సర్వీస్ సమయంలో అవసరమైన విద్యుత్ మరియు నల్లా నీటి సదుపాయాన్ని కస్టమర్ అందించాలి. విలువైన ఆభరణాలు మరియు నగదును ముందుగానే సురక్షిత ప్రదేశంలో ఉంచుకోవాలని కోరడమైనది."
                  : "Customers are requested to provide running water and electrical connection necessary for jet pumps and vacuum equipment. Customers are advised to secure cash and high-value jewelry in advance of any service crew arrival."}
              </p>
            </section>

            {/* Clause 5 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E6FFF]" />
                <span>5. {lang === "te" ? "చట్టపరమైన పరిధి (Jurisdiction)" : "Governing Law & Legal Jurisdiction"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఈ నిబంధనలు భారతీయ చట్టాలకు లోబడి ఉంటాయి. ఏవైనా వివాదాలు తలెత్తితే అవి నెల్లూరు జిల్లా న్యాయస్థానాల పరిధికి మాత్రమే వర్తిస్తాయి."
                  : "These terms are governed by the laws of India. Any disputes arising out of services rendered shall be subject to the exclusive jurisdiction of the courts in Nellore, Andhra Pradesh."}
              </p>
            </section>

            {/* Entity info */}
            <div className="border-t border-[#E5E7EB] pt-6 space-y-1.5 text-xs text-[#666666]">
              <p><strong className="text-[#111111]">Operating Legal Entity:</strong> Finkfold</p>
              <p><strong className="text-[#111111]">Brand:</strong> Osmida Facility Services</p>
              <p><strong className="text-[#111111]">Registered Office:</strong> Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh - 524003</p>
              <p><strong className="text-[#111111]">Customer Helplines:</strong> +91 76763 58162 | +91 62815 33239</p>
              <p><strong className="text-[#111111]">Email:</strong> osmidaindia@gmail.com</p>
            </div>
          </div>
        </article>
      </div>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] px-4 sm:px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link href="/" className="text-white font-black tracking-widest text-sm">
            OSMIDA NELLORE
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-white font-bold">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:text-white">Cancellation Policy</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <FloatingContactBar lang={lang} selectedServiceName="Terms Inquiry" />
    </main>
  );
}