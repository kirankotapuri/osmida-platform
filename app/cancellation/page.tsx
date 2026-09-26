"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProntoHeader } from "@/components/ProntoHeader";
import { ProntoFooter } from "@/components/ProntoFooter";
import { Language } from "@/lib/translations";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Clock,
  Calendar,
  Sparkles,
  HelpCircle,
  Globe,
  RotateCcw,
} from "lucide-react";

export default function CancellationPage() {
  const [lang, setLang] = useState<Language>("en");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#0C6266] selection:text-white flex flex-col justify-between">
      {/* 1. PRONTO HEADER */}
      <ProntoHeader />

      {/* 2. BREADCRUMB & LANGUAGE TOGGLE */}
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs font-bold">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#0C6266] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{lang === "te" ? "హోమ్ పేజీకి తిరిగి వెళ్ళు" : "Back to Home"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "te" : "en")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>{lang === "en" ? "తెలుగు లో చదవండి" : "Read in English"}</span>
            </button>
            <span className="text-emerald-600 font-bold hidden sm:flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>₹0 Cancellation Fee</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN ARTICLE */}
      <main className="flex-1 px-4 py-8 sm:py-12">
        <article className="mx-auto max-w-3xl space-y-6 text-left">
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
              <span>{lang === "te" ? "రద్దు మరియు రీఫండ్ హామీ" : "Cancellation & Refund Policy"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              {lang === "te" ? "రద్దు & రీషెడ్యూల్ నిబంధనలు" : "Cancellation & Refund Policy"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Effective Date: September 2026 • Osmida Facility Services (Operated by Finkfold, Nellore)
            </p>
          </div>

          {/* Policy Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
            {/* Clause 1: Free Rescheduling */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0C6266]" />
                <span>1. {lang === "te" ? "పూర్తి ఉచిత రీషెడ్యూల్ (Free Rescheduling Anytime)" : "100% Free Rescheduling Anytime"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీ పనుల్లో ఏదైనా అనుకోని మార్పు వస్తే, టెక్నీషియన్ బయలుదేరక ముందు ఎప్పుడైనా మీ అపాయింట్‌మెంట్‌ను మరొక తేదీకి లేదా సమయానికి పూర్తిగా ఉచితంగా మార్చుకోవచ్చు. దీనికి ఎలాంటి అదనపు రుసుము ఉండదు."
                  : "We understand that plans can change. You can freely reschedule your booking to any other convenient date or time slot prior to helper dispatch without any penalty or rescheduling charges."}
              </p>
            </section>

            {/* Clause 2: Zero Advance = Zero Refund Hassle */}
            <section className="space-y-2 border-t border-slate-100 pt-5">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>2. {lang === "te" ? "₹0 ముందస్తు చెల్లింపు = రీఫండ్ వేచి చూసే ఇబ్బంది లేదు" : "Zero Advance = Zero Refund Waiting"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా ఎలాంటి ముందస్తు అడ్వాన్స్ వసూలు చేయదు. కాబట్టి మీరు బుకింగ్ రద్దు చేసుకున్నా బ్యాంక్ రీఫండ్ కోసం 7-10 రోజులు వేచి చూడాల్సిన ఇబ్బంది ఉండదు. మీ డబ్బు మీ ఖాతాలోనే సురక్షితంగా ఉంటుంది."
                  : "Because Osmida operates on a strict ₹0 advance policy, you are never trapped waiting 7 to 10 banking days for refund reversals. If you need to cancel before service dispatch, you owe exactly ₹0."}
              </p>
            </section>

            {/* Clause 3: How to Cancel */}
            <section className="space-y-2 border-t border-slate-100 pt-5">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0C6266]" />
                <span>3. {lang === "te" ? "రద్దు లేదా రీషెడ్యూల్ ఎలా చేయాలి?" : "How to Cancel or Change Your Slot?"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీ బుకింగ్ రద్దు చేసుకోవడానికి లేదా సమయం మార్చుకోవడానికి మీ బుకింగ్ రిఫరెన్స్ నంబర్‌తో మా వాట్సాప్ లేదా హెల్ప్‌లైన్‌కు ఒక్క సందేశం పంపితే సరిపోతుంది:"
                  : "To cancel or modify your booking, simply send your Booking Reference ID via WhatsApp or call our local Nellore coordination desk:"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://wa.me/917676358162?text=Hello%20Osmida,%20I%20would%20like%20to%20reschedule%20or%20cancel%20my%20booking."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
                >
                  <span>💬 WhatsApp Helpline (+91 76763 58162)</span>
                </a>
                <Link
                  href="/my-bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
                >
                  <span>📋 Manage in Track Bookings</span>
                </Link>
              </div>
            </section>

            {/* Clause 4: Quality Escalation & Free Rework */}
            <section className="space-y-2 border-t border-slate-100 pt-5">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0C6266]" />
                <span>4. {lang === "te" ? "పని నాణ్యత సంతృప్తి చెందకపోతే?" : "What if You Are Not Satisfied?"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీరు పనిని స్వయంగా చూసి సంతృప్తి చెందిన తర్వాత మాత్రమే చెల్లిస్తారు. ఏదైనా సర్వీస్ లోపం ఉంటే, 24 గంటల లోపు మాకు తెలియజేస్తే, ఉచిత రీ-విజిట్ లేదా సరిచేసే సదుపాయం కల్పించబడుతుంది."
                  : "Under our Escrow Protection model, you pay only after inspecting the completed service. If any area was missed or not up to standard, notify our coordinator within 24 hours for a prompt, complimentary touch-up visit."}
              </p>
            </section>

            {/* Legal Entity details */}
            <div className="border-t border-slate-200 pt-6 space-y-1.5 text-xs text-slate-600">
              <p><strong className="text-slate-900">Legal Operating Entity:</strong> Finkfold</p>
              <p><strong className="text-slate-900">Consumer Brand:</strong> Osmida Facility Services</p>
              <p><strong className="text-slate-900">Registered Office:</strong> Fathekhanpet, Pendemvari Street, Nellore, AP - 524003</p>
              <p><strong className="text-slate-900">Direct Helplines:</strong> +91 76763 58162 | +91 62815 33239</p>
              <p><strong className="text-slate-900">Support Hours:</strong> 8:00 AM – 8:00 PM (Monday through Sunday)</p>
            </div>
          </div>
        </article>
      </main>

      {/* 4. PRONTO FOOTER */}
      <ProntoFooter />
    </div>
  );
}
