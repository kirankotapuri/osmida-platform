"use client";

import React from "react";
import { Language, TRUST_PROMISES, UI_TEXT } from "@/lib/translations";

export function SafetyPromise({ lang }: { lang: Language }) {
  const t = UI_TEXT[lang];

  return (
    <section className="border-t border-[#E5E7EB] bg-white px-4 sm:px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
            {lang === "te" ? "భద్రత & నాణ్యత" : "Trust & Guarantee"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111111] mt-3">
            {t.safetyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] mt-2">
            {lang === "te"
              ? "నెల్లూరులో మీ ఇంటికి తెలియని వారిని రప్పించడంలో ఉన్న భయాన్ని మేము అర్థం చేసుకున్నాము. అందుకే ఈ 4 రక్షణలు:"
              : "We understand inviting technicians into your home requires complete trust. Here is our 4-point guarantee:"}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PROMISES.map((promise, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#E5E7EB] bg-[#F7F8FA] p-6 space-y-3 hover:border-[#1E6FFF]/40 hover:shadow-md transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#E5E7EB] text-2xl shadow-sm">
                {promise.icon}
              </div>
              <h3 className="text-base font-black text-[#111111]">
                {lang === "te" ? promise.titleTe : promise.titleEn}
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                {lang === "te" ? promise.descTe : promise.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
