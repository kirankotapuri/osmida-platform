"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OsmidaHeader } from "@/components/OsmidaHeader";
import { OsmidaFooter } from "@/components/OsmidaFooter";
import { DataDeletionForm } from "@/components/DataDeletionForm";
import { Language } from "@/lib/translations";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Phone,
  CheckCircle2,
  Calendar,
  Building2,
  AlertTriangle,
  Globe,
} from "lucide-react";

export default function PrivacyPage() {
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
              <Lock className="h-3.5 w-3.5" />
              <span>DPDP Compliant</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN ARTICLE */}
      <main className="flex-1 px-4 py-8 sm:py-12">
        <article className="mx-auto max-w-3xl space-y-6 text-left">
          {/* Header Badge & Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C6266]/10 text-[#0C6266] border border-[#0C6266]/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>{lang === "te" ? "చట్టపరమైన పారదర్శకత" : "Privacy & Data Protection"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              {lang === "te" ? "గోప్యతా విధానం (Privacy Policy)" : "Privacy Policy"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Effective Date: September 2026 • Osmida Facility Services (Operated by Finkfold, Nellore)
            </p>
          </div>

          {/* Core Content Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
            {/* Section 1: Intro & Commitment */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0C6266]" />
                <span>1. {lang === "te" ? "మా నిబద్ధత మరియు పరిధి" : "Our Commitment & Scope"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా (ఫింక్‌ఫోల్డ్ ఆధ్వర్యంలో నడుస్తున్న బ్రాండ్) నెల్లూరు నివాసితుల వ్యక్తిగత గోప్యతను అత్యున్నతంగా గౌరవిస్తుంది. భారత డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం (DPDP Act, 2023) మార్గదర్శకాలకు అనుగుణంగా మేము పనిచేస్తున్నాము. మీ సమాచారం పూర్తిగా రక్షించబడుతుంది."
                  : "Osmida Facility Services (operated by Finkfold) is committed to protecting your privacy and handling your personal data with utmost transparency and care. This Privacy Policy outlines our data practices in compliance with the Digital Personal Data Protection Act (DPDP Act 2023) and applicable Indian information technology regulations."}
              </p>
            </section>

            {/* Section 2: Data We Collect */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0C6266]" />
                <span>2. {lang === "te" ? "మేము సేకరించే వివరాలు" : "Information We Collect"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీ ఆర్డర్‌ను నెరవేర్చడానికి అవసరమైన ప్రాథమిక వివరాలను మాత్రమే మేము సేకరిస్తాము:"
                  : "We only collect information strictly required to coordinate, dispatch, and fulfill your requested home services:"}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong className="text-slate-800">
                    {lang === "te" ? "సంప్రదింపు వివరాలు:" : "Contact Details:"}
                  </strong>{" "}
                  {lang === "te"
                    ? "మీ పేరు, మొబైల్ లేదా వాట్సాప్ నంబర్, ఐచ్ఛిక ఇమెయిల్ చిరునామా."
                    : "Resident name, mobile number / WhatsApp number, and optional email address."}
                </li>
                <li>
                  <strong className="text-slate-800">
                    {lang === "te" ? "సర్వీస్ లొకేషన్:" : "Premises Location:"}
                  </strong>{" "}
                  {lang === "te"
                    ? "నెల్లూరులోని మీ అపార్ట్‌మెంట్ పేరు, ఫ్లాట్ నంబర్, వీధి మరియు పిన్‌కోడ్ (524001 - 524004)."
                    : "Apartment or building name, flat number, street locality, and GPS map pin for prompt arrival."}
                </li>
                <li>
                  <strong className="text-slate-800">
                    {lang === "te" ? "సేవ అవసరాలు:" : "Service Specifications:"}
                  </strong>{" "}
                  {lang === "te"
                    ? "ఎంచుకున్న ఇంటి సహాయ పనులు (ఉదా: గిన్నెల శుభ్రత, వంట సహాయం, డీప్ క్లీనింగ్, పెస్ట్ కంట్రోల్)."
                    : "Selected help modules (dishwashing, floor mopping, kitchen assist, etc.), preferred date, and time slot."}
                </li>
              </ul>
              <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium text-xs">
                🔒 <strong>{lang === "te" ? "ముఖ్య గమనిక:" : "Payment Security:"}</strong>{" "}
                {lang === "te"
                  ? "ఆస్మిడా క్రెడిట్ కార్డు వివరాలు, నెట్ బ్యాంకింగ్ పాస్‌వర్డ్‌లు లేదా పిన్‌లను ఎప్పుడూ నిల్వ చేయదు. పని పూర్తయిన తర్వాత మాత్రమే నేరుగా UPI లేదా నగదు చెల్లించవచ్చు."
                  : "Osmida collects ₹0 upfront advance. We never request or store sensitive banking passwords, credit card CVVs, or financial credentials. Payments are made post-service via secure UPI QR or cash."}
              </p>
            </section>

            {/* Section 3: Purpose Limitation & Zero Broker Sharing */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#0C6266]" />
                <span>3. {lang === "te" ? "సమాచార వినియోగం (జీరో బ్రోకర్ షేరింగ్)" : "Zero Broker Sharing Guarantee"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీ వ్యక్తిగత సమాచారం కేవలం మీ సర్వీస్ బుకింగ్ సమన్వయం, టెక్నీషియన్ రాక, మరియు వారంటీ సేవలకు మాత్రమే ఉపయోగించబడుతుంది. మీ ఫోన్ నంబర్‌ను ఏ విధమైన మార్కెటింగ్ లేదా టెలికాలింగ్ బ్రోకర్లకు అమ్మడం లేదా పంచుకోవడం జరగదు."
                  : "We respect your peace of mind. Your personal phone number and home location are NEVER sold, rented, leased, or licensed to telemarketers, third-party lead brokers, or advertising networks. Contact details are shared strictly with the assigned, ID-verified Osmida helper on the day of service for dispatch navigation."}
              </p>
            </section>

            {/* Section 4: Photography & Quality Audits */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0C6266]" />
                <span>4. {lang === "te" ? "పని నాణ్యత ఫోటోలు & గృహ గోప్యత" : "Work Inspection Photography & Residential Privacy"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "నాణ్యత హామీ కోసం టెక్నీషియన్ తీసే బిఫోర్ & ఆఫ్టర్ ఫోటోలు మీ పని రికార్డు మరియు వారంటీ కోసమే ఉంచబడతాయి. మీ కుటుంబ సభ్యుల లేదా ప్రైవేట్ వస్తువుల ఫోటోలు ఎట్టి పరిస్థితుల్లోనూ బయటకు తీసుకోబడవు."
                  : "For deep cleaning, sofa extraction, or inspection audits, technicians may capture timestamped before-and-after work photos to verify service completion and process rework warranties. No photographs of residents, family members, personal documents, or private personal effects are captured or published without explicit written consent."}
              </p>
            </section>

            {/* Section 5: Data Retention & Deletion Rights */}
            <section id="data-deletion" className="space-y-3 scroll-mt-24">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0C6266]" />
                <span>5. {lang === "te" ? "డేటా తొలగింపు హక్కు (Data Deletion Rights)" : "Your Rights: Access, Correction & Erasure"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీరు ఎప్పుడైనా మీ వ్యక్తిగత సమాచారాన్ని సమీక్షించవచ్చు లేదా తొలగించమని అడగవచ్చు. మీ సర్వీస్ పూర్తయిన తర్వాత క్రింది ఫారమ్ ద్వారా మీ వివరాల తొలగింపును సులభంగా అభ్యర్థించవచ్చు:"
                  : "Under the DPDP Act 2023, you have the right to review, update, or request complete erasure of your customer profile and booking history from our servers. Submit your deletion request directly below:"}
              </p>
              <div className="pt-1">
                <DataDeletionForm />
              </div>
            </section>

            {/* Section 6: Grievance Officer & Entity Details */}
            <div className="border-t border-slate-200 pt-6 space-y-2 text-xs text-slate-600">
              <h3 className="text-sm font-black text-slate-900">
                {lang === "te" ? "చట్టపరమైన మరియు ఫిర్యాదుల సంప్రదింపు" : "Grievance Officer & Legal Notice"}
              </h3>
              <p>
                If you have questions regarding this Privacy Policy, wish to file a grievance, or have data safety inquiries, please contact our Grievance Officer:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-slate-700">
                <p><strong className="text-slate-900">Operating Legal Entity:</strong> Finkfold</p>
                <p><strong className="text-slate-900">Consumer Brand:</strong> Osmida Facility Services</p>
                <p><strong className="text-slate-900">Registered Office:</strong> Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh - 524003, India</p>
                <p><strong className="text-slate-900">Grievance Helpline:</strong> +91 76763 58162 | +91 62815 33239</p>
                <p><strong className="text-slate-900">Official Email:</strong> osmidaindia@gmail.com / support@osmida.com</p>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* 4. OSMIDA FOOTER */}
      <OsmidaFooter />
    </div>
  );
}
