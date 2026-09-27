"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OsmidaHeader } from "@/components/OsmidaHeader";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language } from "@/lib/translations";
import { Phone, ArrowLeft, Clock, Share2 } from "lucide-react";

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>("en");

  // Read query params from booking form
  const rawRef = searchParams.get("ref");
  const refId = rawRef || `OSM-${Math.floor(10000 + Math.random() * 90000)}`;

  const service = searchParams.get("service") || "Pest Control";
  const plan = searchParams.get("plan") || "";
  const locality = searchParams.get("locality") || "Nellore";
  const slot = searchParams.get("slot") || "Morning (9 AM – 12 PM)";
  const dateParam = searchParams.get("date") || "";

  // Format date cleanly (e.g., 20 Sep 2026)
  const formatPreferredDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthsEn = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const monthsTe = [
          "జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్",
          "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్",
        ];
        const monthName = lang === "te" ? monthsTe[monthIndex] : monthsEn[monthIndex];
        return `${day} ${monthName} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatPreferredDate(dateParam);
  const displayDateTime = formattedDate
    ? `${formattedDate}, ${slot}`
    : slot;

  const displayService = plan && !service.includes(plan)
    ? `${service} – ${plan}`
    : service;

  // WhatsApp click-to-chat URL with prefilled reference & summary
  const whatsappText = encodeURIComponent(
    lang === "te"
      ? `నమస్కారం ఆస్మిడా! నా బుకింగ్ రెఫరెన్స్: ${refId}\n• సర్వీస్: ${displayService}\n• ప్రాంతం: ${locality}\n• సమయం: ${displayDateTime}\n\nదయచేసి 30 నిమిషాల్లో కాల్ చేసి ఖాయం చేయండి.`
      : `Namaskaram Osmida! My booking reference: ${refId}\n• Service: ${displayService}\n• Locality: ${locality}\n• Preferred Time: ${displayDateTime}\n\nPlease call me to confirm my appointment.`
  );
  const whatsappUrl = `https://wa.me/917676358162?text=${whatsappText}`;

  // WhatsApp share URL to forward booking details to family members at home
  const shareFamilyText = encodeURIComponent(
    `*Osmida Service Booking Confirmed (Nellore)*\n\n` +
      `📋 *Booking Ref:* ${refId}\n` +
      `🛠️ *Service:* ${displayService}\n` +
      `📍 *Location:* ${locality}, Nellore\n` +
      `🕒 *Time Slot:* ${displayDateTime}\n` +
      `💰 *Payment:* Pay after service inspection via UPI / Cash\n\n` +
      `Track technician live: https://osmida.com/my-bookings`
  );
  const shareFamilyUrl = `https://wa.me/?text=${shareFamilyText}`;

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-20 lg:pb-16 flex flex-col justify-between">
      {/* 1. FIXED HEADER */}
      <OsmidaHeader />

      {/* 2. CONFIRMATION CONTAINER */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* CONFIRMATION CARD */}
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EB]/70 p-5 sm:p-7 lg:p-8 animate-in fade-in slide-in-from-bottom-3 duration-250 text-center">
          {/* 4. SUCCESS ICON */}
          <div className="flex justify-center mb-6">
            <div
              aria-label="Success"
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#25D366] border-2 border-[#1FA851] ring-4 ring-[#25D366]/20 flex items-center justify-center text-white shadow-md animate-in zoom-in-75 duration-250"
            >
              <svg
                className="w-10 h-10 sm:w-11 sm:h-11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* 5. TITLE (H1) */}
          <h1 className="text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-[#111111] mb-3 leading-tight">
            {lang === "te"
              ? "ధన్యవాదాలు! మేము మీకు త్వరలో కాల్ చేస్తాము."
              : "Thank You! We’ll Call You Soon."}
          </h1>

          {/* 6. SUBTEXT (WHAT HAPPENS NEXT) */}
          <div className="space-y-1 mb-6 text-[#555555]">
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-relaxed">
              {lang === "te"
                ? "మా బృందం 30 నిమిషాల్లో మీ అపాయింట్మెంట్ ఖాయం చేయడానికి కాల్ చేస్తుంది."
                : "Our team will call you within 30 minutes to confirm your appointment."}
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#777777]">
              {lang === "te"
                ? "చాలా సేవలకు ఉచిత పరిశీలన అందుబాటులో ఉంది."
                : "Free inspection is available for most services."}
            </p>
          </div>

          {/* 7. REFERENCE ID & BOOKING SUMMARY BOX */}
          <div className="bg-[#F0F5FF] border border-[#D6E4FF] rounded-lg sm:rounded-xl p-3.5 sm:p-4 mb-6 text-left space-y-2.5">
            {/* Reference ID */}
            <div className="flex items-center justify-between border-b border-[#D6E4FF]/70 pb-2">
              <span className="text-[13px] sm:text-[14px] font-semibold text-[#555555]">
                {lang === "te" ? "రెఫరెన్స్ ID:" : "Reference ID:"}
              </span>
              <span className="text-[14px] sm:text-[15px] font-bold font-mono text-[#0F4BD6] tracking-wider">
                {refId}
              </span>
            </div>

            {/* Service */}
            <div className="text-[13px] sm:text-[14px] text-[#111111] leading-snug flex items-start justify-between gap-2">
              <span className="font-semibold text-[#555555] shrink-0">
                {lang === "te" ? "సర్వీస్:" : "Service:"}
              </span>
              <span className="font-normal text-right">{displayService}</span>
            </div>

            {/* Locality */}
            <div className="text-[13px] sm:text-[14px] text-[#111111] leading-snug flex items-start justify-between gap-2">
              <span className="font-semibold text-[#555555] shrink-0">
                {lang === "te" ? "ప్రాంతం:" : "Locality:"}
              </span>
              <span className="font-normal text-right">{locality}</span>
            </div>

            {/* Preferred Time */}
            <div className="text-[13px] sm:text-[14px] text-[#111111] leading-snug flex items-start justify-between gap-2">
              <span className="font-semibold text-[#555555] shrink-0">
                {lang === "te" ? "ఇష్టమైన సమయం:" : "Preferred Time:"}
              </span>
              <span className="font-normal text-right">{displayDateTime}</span>
            </div>
          </div>

          {/* PRIMARY QUICK-COMMERCE TRACKING BUTTON */}
          <div className="mb-4">
            <Link
              href="/my-bookings"
              className="w-full h-[52px] sm:h-[56px] px-6 rounded-xl bg-[#0C6266] hover:bg-[#094E51] text-white font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.98] shadow-md shadow-[#0C6266]/20"
            >
              <Clock className="h-5 w-5 text-white animate-pulse" />
              <span>{lang === "te" ? "లైవ్ పార్టనర్ స్టేటస్ & OTP చూడండి" : "Track Service Partner Live"}</span>
            </Link>
          </div>

          {/* 8. ACTION BUTTONS (SHARE WITH FAMILY / HELPLINE CALL) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
            {/* Button 1 – Share with Family */}
            <a
              href={shareFamilyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share Booking on WhatsApp"
              className="flex-1 h-[48px] sm:h-[52px] px-4 rounded-xl bg-[#25D366] hover:bg-[#1FA851] text-white font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-sm"
            >
              <Share2 className="h-4 w-4 text-white" />
              <span>{lang === "te" ? "కుటుంబానికి షేర్ చేయండి" : "Share on WhatsApp"}</span>
            </a>

            {/* Button 2 – Helpline Call */}
            <a
              href="tel:+917676358162"
              aria-label="Call Now button"
              className="flex-1 h-[48px] sm:h-[52px] px-4 rounded-xl bg-[#0B0B0F] hover:bg-[#15151A] text-white font-semibold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] shadow-sm"
            >
              <Phone className="h-4 w-4 text-white" />
              <span>{lang === "te" ? "హెల్ప్‌లైన్ కాల్" : "Call Helpline"}</span>
            </a>
          </div>

          {/* 9. SMALL SUPPORT TEXT */}
          <div className="pt-2 text-center space-y-1">
            <p className="text-[13px] sm:text-[14px] text-[#777777]">
              {lang === "te"
                ? "సహాయం కావాలా? ఎప్పుడైనా మాకు కాల్ చేయండి లేదా వాట్సాప్ చేయండి."
                : "Need help? Call us or WhatsApp us anytime."}
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#777777]">
              {lang === "te" ? "ఈమెయిల్: " : "Email: "}
              <a
                href="mailto:osmidaindia@gmail.com"
                className="text-[#1E6FFF] hover:underline"
              >
                osmidaindia@gmail.com
              </a>
            </p>
          </div>

          {/* Back to Home link */}
          <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555555] hover:text-[#1E6FFF] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "హోమ్ పేజీకి తిరిగి వెళ్లండి" : "Return to Home"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 10. MOBILE BOTTOM FLOATING BAR */}
      <FloatingContactBar lang={lang} selectedServiceName={displayService} />
    </main>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center text-sm font-bold text-slate-500">
          Loading booking status...
        </div>
      }
    >
      <ConfirmationInner />
    </Suspense>
  );
}
