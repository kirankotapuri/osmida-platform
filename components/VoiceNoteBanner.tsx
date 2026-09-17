"use client";

import React from "react";
import { Mic, MessageSquare, Phone, Camera } from "lucide-react";
import { Language, UI_TEXT } from "@/lib/translations";

export function VoiceNoteBanner({ lang }: { lang: Language }) {
  const t = UI_TEXT[lang];

  const handleWhatsAppVoice = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? "నమస్కారం ఆస్మిడా! నా సమస్యను వాయిస్ మెసేజ్ లేదా ఫొటో ద్వారా పంపుతున్నాను. దయచేసి పరిశీలించి కాల్ చేయండి."
        : "Namaskaram Osmida! I am sending a voice note / photo of my problem. Please review and call me back."
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  return (
    <section className="px-4 sm:px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8 space-y-3 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-[#1FA851]">
                <Mic className="h-3.5 w-3.5 animate-pulse text-[#25D366]" />
                <span>{lang === "te" ? "ఫారమ్ నింపాల్సిన పనిలేదు" : "Zero Typing Required"}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-[#111111] leading-tight">
                {t.voiceNoteTitle}
              </h3>

              <p className="text-xs sm:text-sm text-[#555555] max-w-xl">
                {t.voiceNoteSub}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#555555]">
                <span className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <Mic className="h-4 w-4 text-[#25D366]" />
                  {lang === "te" ? "వాయిస్ మెసేజ్" : "Voice Note"}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <Camera className="h-4 w-4 text-[#1E6FFF]" />
                  {lang === "te" ? "ఫొటో లేదా వీడియో" : "Photo / Video"}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-[#111111]">
                  <Phone className="h-4 w-4 text-[#111111]" />
                  {lang === "te" ? "డైరెక్ట్ కాల్" : "Direct Phone Call"}
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={handleWhatsAppVoice}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1FA851] py-4 px-5 text-sm font-black text-white shadow-md transition-all active:scale-[0.97]"
              >
                <MessageSquare className="h-5 w-5 fill-white" />
                <span>{lang === "te" ? "వాట్సాప్ ఓపెన్ చేయండి" : "Open WhatsApp"}</span>
              </button>

              <a
                href="tel:+917676358162"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3.5 px-5 text-xs font-black text-white transition-all shadow-md active:scale-[0.97]"
              >
                <Phone className="h-4 w-4 text-white" />
                <span>{lang === "te" ? "కాల్ 76763 58162" : "Call 76763 58162"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
