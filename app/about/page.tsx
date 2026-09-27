"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OsmidaHeader } from "@/components/OsmidaHeader";
import { OsmidaFooter } from "@/components/OsmidaFooter";
import { Language, UI_TEXT } from "@/lib/translations";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  Clock,
  Phone,
  Globe,
  HeartHandshake,
} from "lucide-react";

export default function AboutPage() {
  const [lang, setLang] = useState<Language>("en");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#0C6266] selection:text-white flex flex-col justify-between">
      {/* 1. OSMIDA HEADER */}
      <OsmidaHeader />

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
            <span className="text-[#0C6266] hidden sm:flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#E68A00]" />
              <span>Fathekhanpet, Nellore</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. CONTENT BODY */}
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C6266]/10 text-[#0C6266] border border-[#0C6266]/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>{lang === "te" ? "మా కథ & లక్ష్యం" : "Our Story & Mission"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              {lang === "te"
                ? "నెల్లూరు ప్రజల కోసం నమ్మకమైన ఆధునిక హోమ్ సర్వీసెస్"
                : "Nellore's Most Trusted Managed Home Services"}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {lang === "te"
                ? "ఆస్మిడా (ఫింక్‌ఫోల్డ్ ఆధ్వర్యంలో) నెల్లూరులో అపార్ట్‌మెంట్లు మరియు గృహాల కోసం ప్రత్యేకంగా రూపొందించబడిన ఆధునిక హోమ్ సర్వీస్ ప్లాట్‌ఫామ్. స్థానిక అనుభవజ్ఞులైన సహాయకులతో, నిర్ణీత ₹199/గంట రేటుతో, అధికారిక యూనిఫాం మరియు వారంటీ రక్షణతో నాణ్యమైన సేవలను అందిస్తున్నాము."
                : "Osmida (operated by Finkfold) is Nellore's apartment-first residential support platform. We partner directly with verified, top-rated local helpers and technicians — bringing transparent hourly pricing (flat ₹199/hr), supervised standards, official Osmida uniforms, and escrow-protected post-service payment."}
            </p>
          </div>

          {/* Core Values */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                titleEn: "Verified Local Nellore Helpers",
                titleTe: "ధృవీకరించబడిన స్థానిక నిపుణులు",
                descEn: "Background-checked with Aadhaar identity verification, official uniforms, and quality standards.",
                descTe: "ఆధార్ కార్డు ద్వారా ధృవీకరించబడిన స్థానిక అనుభవజ్ఞులు, అధికారిక యూనిఫాం మరియు పర్యవేక్షిత నాణ్యత.",
              },
              {
                titleEn: "Zero Advance • Pay After Service",
                titleTe: "₹0 అడ్వాన్స్ • పని పూర్తయ్యాకే పేమెంట్",
                descEn: "No advance payment ever. Inspect the service in person and pay only when fully satisfied via UPI or cash.",
                descTe: "ఎలాంటి ముందస్తు చెల్లింపు లేదు. పనిని స్వయంగా చూసి సంతృప్తి చెందిన తర్వాత మాత్రమే UPI లేదా నగదు చెల్లించండి.",
              },
              {
                titleEn: "Photo Proof & Free Touch-up Guarantee",
                titleTe: "ఫోటో ప్రూఫ్ & ఉచిత రీవర్క్ రక్షణ",
                descEn: "Before & After photo proof with every visit. 24-hr review window for apartment cleaning and house help to ensure 100% satisfaction.",
                descTe: "ప్రతి సేవకు బిఫోర్ & ఆఫ్టర్ ఫోటో ప్రూఫ్. పూర్తి సంతృప్తి కోసం 24 గంటల ఉచిత రీవర్క్ విండో రక్షణ.",
              },
              {
                titleEn: "Apartment & Community First",
                titleTe: "అపార్ట్‌మెంట్ల కోసం ప్రత్యేక వేగం",
                descEn: "Quick 15-minute response in top Nellore localities like Haranathapuram, Magunta Layout, and Vedayapalem.",
                descTe: "హరనాథపురం, మాగుంట లేఅవుట్, వేదాయపాలెం మరియు నెల్లూరు ప్రధాన ప్రాంతాలలో వేగవంతమైన సహాయం.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0C6266] shrink-0" />
                  <h3 className="font-bold text-sm text-slate-900">
                    {lang === "te" ? v.titleTe : v.titleEn}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === "te" ? v.descTe : v.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Operating Entity Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 text-xs sm:text-sm text-slate-700 shadow-xs">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-[#0C6266]" />
              <span>{lang === "te" ? "కార్పొరేట్ మరియు ఆపరేషన్స్ వివరాలు" : "Operations & Corporate Entity"}</span>
            </h2>
            <p>
              Osmida is the consumer services brand operated by <strong>Finkfold</strong>, legally registered and operating out of Nellore, Andhra Pradesh.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
              <p><strong className="text-slate-900">Registered Office:</strong> Fathekhanpet, Pendemvari Street, Nellore - 524003</p>
              <p><strong className="text-slate-900">Operating Hours:</strong> 8:00 AM – 8:00 PM Daily</p>
              <p><strong className="text-slate-900">Customer Helpline:</strong> +91 76763 58162</p>
              <p><strong className="text-slate-900">Business Inquiry:</strong> +91 62815 33239</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0C6266] hover:bg-[#095054] py-3.5 px-6 text-sm font-black text-white transition-all shadow-md active:scale-[0.98]"
            >
              <span>{lang === "te" ? "సర్వీస్ బుక్ చేయండి (₹199/గంట)" : "Book House Help (₹199/hr)"}</span>
            </Link>
            <a
              href="https://wa.me/917676358162?text=Hello%20Osmida,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 py-3.5 px-6 text-sm font-bold text-slate-800 transition-all shadow-xs"
            >
              <span>💬 Chat on WhatsApp (+91 76763 58162)</span>
            </a>
          </div>
        </div>
      </main>

      {/* 4. OSMIDA FOOTER */}
      <OsmidaFooter />
    </div>
  );
}
