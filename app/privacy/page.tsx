"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { DataDeletionForm } from "@/components/DataDeletionForm";
import { Language } from "@/lib/translations";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Phone } from "lucide-react";

export default function PrivacyPage() {
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
            <Lock className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "సురక్షిత డేటా గోప్యత" : "Privacy & Data Protection"}</span>
          </span>
        </div>
      </div>

      {/* 3. MAIN ARTICLE */}
      <div className="px-4 py-10 sm:py-14">
        <article className="mx-auto max-w-3xl space-y-8 text-left">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
              {lang === "te" ? "చట్టపరమైన సమాచారం" : "Legal & Transparency"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-3">
              {lang === "te" ? "గోప్యతా విధానం (Privacy Policy)" : "Privacy Policy"}
            </h1>
            <p className="text-xs text-[#555555] mt-1">
              Last Updated: September 17, 2026 • Osmida Facility Services (Operated by Finkfold)
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#444444] leading-relaxed shadow-xs">
            {/* Section 1 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1E6FFF]" />
                <span>1. {lang === "te" ? "మేము సేకరించే సమాచారం" : "Information We Collect"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీరు బుకింగ్ ఫారమ్ సమర్పించినప్పుడు మీ పేరు, మొబైల్ నంబర్, నెల్లూరు ప్రాంతం/చిరునామా, మరియు మీరు ఎంచుకున్న సర్వీస్ వివరాలను మాత్రమే మేము సేకరిస్తాము. మేము క్రెడిట్ కార్డులు లేదా నెట్ బ్యాంకింగ్ పాస్‌వర్డ్‌లను ఎప్పుడూ అడగము."
                  : "Osmida Facility Services collects only the essential contact details (name, phone number, address, locality in Nellore, and selected service requirement) necessary to fulfill your home inspection and service dispatch."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#1E6FFF]" />
                <span>2. {lang === "te" ? "సమాచార వినియోగం (డేటా అమ్మబడదు)" : "Purpose of Data Processing (Zero Broker Sharing)"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీ వివరాలు కేవలం మీ అపాయింట్‌మెంట్ నిర్ధారణ, టెక్నీషియన్ రాక, మరియు డిజిటల్ బిల్లింగ్/వారంటీ కార్డు అందించడానికి మాత్రమే ఉపయోగించబడతాయి. మీ ఫోన్ నంబర్‌ను మేము ఏ విధమైన మార్కెటింగ్ లేదా ప్రకటనల బ్రోకర్లకు అమ్మము."
                  : "We strictly use your details to schedule site audits, dispatch verified technicians, share service reports via WhatsApp, and honor warranty service calls. We do NOT sell or license customer databases to third-party telemarketers or advertisers."}
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#1E6FFF]" />
                <span>3. {lang === "te" ? "పని ఫోటోలు మరియు గోప్యత" : "Work Photography & Premises Privacy"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "నాణ్యత తనిఖీ కోసం టెక్నీషియన్ తీసే బిఫోర్ & ఆఫ్టర్ ఫోటోలు మీ పని రికార్డు కోసమే ఉంచబడతాయి. మీ వ్యక్తిగత గోప్యతను గౌరవిస్తాము; ముందస్తు అనుమతి లేకుండా ఎలాంటి ప్రైవేట్ ప్రాంతాల ఫోటోలు ప్రచురించబడవు."
                  : "Timestamped before-and-after photographs taken during deep cleaning or AC servicing are recorded strictly for quality audit and warranty tracking. No photographs revealing family members or private personal belongings are published without your express written consent."}
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#1E6FFF]" />
                <span>4. {lang === "te" ? "డేటా తొలగింపు హక్కు (Data Deletion)" : "Data Deletion Request"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీరు ఎప్పుడైనా మీ వ్యక్తిగత డేటాను మా సిస్టమ్ నుండి తొలగించమని అడగవచ్చు. క్రింది ఫారమ్ ఉపయోగించి మీ అభ్యర్థనను పంపవచ్చు:"
                  : "You have the full right to request deletion of your contact details once your service and warranty window conclude. You can submit your deletion request below:"}
              </p>
              <div className="pt-2">
                <DataDeletionForm />
              </div>
            </section>

            {/* Section 5: Legal entity */}
            <div className="border-t border-[#E5E7EB] pt-6 space-y-1.5 text-xs text-[#666666]">
              <p><strong className="text-[#111111]">Legal Operating Entity:</strong> Finkfold</p>
              <p><strong className="text-[#111111]">Operating Brand:</strong> Osmida Facility Services</p>
              <p><strong className="text-[#111111]">Registered Address:</strong> Fathekhanpet, Pendemvari Street, Nellore, AP - 524003, India</p>
              <p><strong className="text-[#111111]">Grievance Officer Contact:</strong> +91 76763 58162 | osmidaindia@gmail.com</p>
            </div>
          </div>
        </article>
      </div>

      {/* 4. EXPANDED FOOTER */}
      <footer className="border-t border-white/10 bg-[#0B0B0F] px-4 sm:px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link href="/" className="text-white font-black tracking-widest text-sm">
            OSMIDA NELLORE
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="text-white font-bold">Privacy Policy</Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:text-white">Cancellation Policy</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <FloatingContactBar lang={lang} selectedServiceName="Privacy Support" />
    </main>
  );
}
