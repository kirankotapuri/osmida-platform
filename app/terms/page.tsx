"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OsmidaHeader } from "@/components/OsmidaHeader";
import { OsmidaFooter } from "@/components/OsmidaFooter";
import { Language } from "@/lib/translations";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Clock,
  MapPin,
  Globe,
  Sparkles,
  Banknote,
} from "lucide-react";

export default function TermsPage() {
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
              <FileText className="h-3.5 w-3.5" />
              <span>User Agreement</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN ARTICLE */}
      <main className="flex-1 px-4 py-8 sm:py-12">
        <article className="mx-auto max-w-3xl space-y-6 text-left">
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C6266]/10 text-[#0C6266] border border-[#0C6266]/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>{lang === "te" ? "చట్టపరమైన నిబంధనలు" : "Terms & Conditions"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              {lang === "te" ? "సేవా నిబంధనలు (Terms of Service)" : "Terms of Service"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Effective Date: September 2026 • Osmida Facility Services (Operated by Finkfold, Nellore)
            </p>
          </div>

          {/* Clauses Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-7 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
            {/* Clause 1: Scope */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0C6266]" />
                <span>1. {lang === "te" ? "సేవల పరిధి (Scope of Services)" : "Scope of Services"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా (ఫింక్‌ఫోల్డ్ ఆధ్వర్యంలో) నెల్లూరు నగరంలో అపార్ట్‌మెంట్-కేంద్రీకృత గృహ సహాయ సేవలను (బాత్‌రూమ్ క్లీనింగ్, కిచెన్ డీగ్రీసింగ్, గిన్నెల వాషింగ్, ఫ్లోర్ మాపింగ్ మరియు సాధారణ గృహ సహాయం) ఫ్లాట్ ₹199/గంట రేటుతో అందిస్తుంది. ఎలాంటి ముందస్తు చెల్లింపు లేకుండా, ఫోటో ప్రూఫ్ ఆధారంగా సేవలు నిర్వహించబడతాయి."
                  : "Osmida Facility Services (operated by Finkfold) provides apartment-first residential support across Nellore. Services include on-demand hourly house help (bathroom deep cleaning, kitchen degreasing, dishwashing, floor mopping & dusting) at transparent hourly rates (flat ₹199/hr) with ₹0 advance and verified Before/After photo proof."}
              </p>
            </section>

            {/* Clause 2: ₹0 Advance & Payment */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-600" />
                <span>2. {lang === "te" ? "₹0 ముందస్తు చెల్లింపు - పని పూర్తయ్యాకే చెల్లించండి" : "Transparent Pricing & ₹0 Advance Policy"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మా వద్ద ఎటువంటి ముందస్తు బుకింగ్ ఫీజు లేదా డిపాజిట్ ఉండదు. మా సహాయకులు మీ నివాసానికి వచ్చి పని పూర్తి చేసిన తర్వాత, మీ పూర్తి సంతృప్తి చూసుకున్న తర్వాత మాత్రమే మీరు నగదు లేదా UPI (Google Pay, PhonePe, Paytm) ద్వారా చెల్లించాలి."
                  : "Osmida collects ₹0 advance fees for on-demand bookings or site inspections. You pay strictly upon completion of the service and after your physical verification and satisfaction. Payment can be made directly via UPI QR code or cash to the Osmida supervisor."}
              </p>
            </section>

            {/* Clause 3: Quality Guarantee & Rework */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0C6266]" />
                <span>3. {lang === "te" ? "నాణ్యత హామీ మరియు ఉచిత రీ-విజిట్ నిబంధనలు" : "Quality Guarantee & Free Rework Policy"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "మీరు పొందిన సేవలో ఏదైనా లోపం ఉంటే, సేవ పూర్తయిన 24 గంటల లోపు మాకు తెలియజేయండి. ఉచిత రీ-విజిట్ లేదా సరిచేత వెంటనే కల్పించబడుతుంది. ప్రతి సేవకు బిఫోర్ & ఆఫ్టర్ ఫోటో ప్రూఫ్ తప్పనిసరిగా అందించబడుతుంది."
                  : "We stand behind the quality of our verified helpers. Customers have a 24-hour review window for hourly house help to report any oversight for a free touch-up visit. Every completed service includes mandatory Before/After photo proof."}
              </p>
            </section>

            {/* Clause 4: Customer Responsibilities */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>4. {lang === "te" ? "కస్టమర్ బాధ్యతలు & భద్రత" : "Customer Responsibilities & Household Safety"}</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  {lang === "te"
                    ? "సర్వీస్ సమయంలో అవసరమైన నీరు మరియు విద్యుత్ సౌకర్యాన్ని కస్టమర్ అందించాలి."
                    : "Customers must provide necessary running water and electrical points for vacuum machines or cleaning tools."}
                </li>
                <li>
                  {lang === "te"
                    ? "విలువైన నగలు, నగదు మరియు ముఖ్యమైన పత్రాలను సహాయకుడు రాకముందే సురక్షితమైన లాకర్‌లో భద్రపరుచుకోవాలి."
                    : "Residents are strongly advised to secure high-value cash, jewelry, and delicate items prior to the worker's arrival."}
                </li>
                <li>
                  {lang === "te"
                    ? "మా సిబ్బందితో గౌరవప్రదంగా మరియు మర్యాదపూర్వకంగా ప్రవర్తించాలి. భద్రమైన పని వాతావరణం కల్పించాలి."
                    : "Workers and technicians must be treated with dignity and provided a safe, harassment-free working environment."}
                </li>
              </ul>
            </section>

            {/* Clause 5: Verification & Safety */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>5. {lang === "te" ? "సిబ్బంది ధృవీకరణ మరియు యూనిఫాం" : "Helper Background Verification & Identity"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఆస్మిడా ప్రతి సహాయకుడి యొక్క ఆధార్ కార్డ్, స్థానిక చిరునామా మరియు నైపుణ్యాలను వ్యక్తిగతంగా ధృవీకరిస్తుంది. మా సిబ్బంది అధికారిక యూనిఫాం మరియు ఫోటో ఐడీ బ్యాడ్జ్ ధరించి మాత్రమే మీ నివాసానికి చేరుకుంటారు."
                  : "All Osmida workers are locally onboarded in Nellore, background-checked via Aadhaar verification, and issued official Osmida uniforms and photo identification cards. Customers may verify helper credentials directly from their tracking dashboard."}
              </p>
            </section>

            {/* Clause 6: Governing Law */}
            <section className="space-y-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0C6266]" />
                <span>6. {lang === "te" ? "చట్టపరమైన పరిధి (Jurisdiction)" : "Governing Law & Legal Jurisdiction"}</span>
              </h2>
              <p>
                {lang === "te"
                  ? "ఈ నిబంధనలు భారతీయ చట్టాలకు లోబడి ఉంటాయి. సేవలకు సంబంధించి ఏవైనా వివాదాలు తలెత్తితే అవి కేవలం నెల్లూరు జిల్లా న్యాయస్థానాల పరిధికి మాత్రమే వర్తిస్తాయి."
                  : "These Terms of Service are governed by the laws of India. Any disputes arising out of or related to services booked through Osmida shall be subject to the exclusive jurisdiction of the competent courts in Nellore, Andhra Pradesh."}
              </p>
            </section>

            {/* Entity Info Box */}
            <div className="border-t border-slate-200 pt-6 space-y-1.5 text-xs text-slate-600">
              <p><strong className="text-slate-900">Legal Operating Entity:</strong> Finkfold</p>
              <p><strong className="text-slate-900">Consumer Brand:</strong> Osmida Facility Services</p>
              <p><strong className="text-slate-900">Registered Office:</strong> Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh - 524003</p>
              <p><strong className="text-slate-900">Helpline:</strong> +91 76763 58162 | +91 62815 33239</p>
              <p><strong className="text-slate-900">Customer Support:</strong> support@osmida.com / osmidaindia@gmail.com</p>
            </div>
          </div>
        </article>
      </main>

      {/* 4. OSMIDA FOOTER */}
      <OsmidaFooter />
    </div>
  );
}