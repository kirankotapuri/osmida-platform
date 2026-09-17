"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Language, FAQ_LIST, UI_TEXT } from "@/lib/translations";

export function FaqSection({ lang }: { lang: Language }) {
  const t = UI_TEXT[lang];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="border-t border-[#E5E7EB] bg-white px-4 sm:px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-3 py-1 rounded-full">
            {lang === "te" ? "మీ సందేహాలు" : "Common Questions"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mt-3">
            {t.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] mt-2">
            {lang === "te"
              ? "నెల్లూరు కస్టమర్లు సాధారణంగా అడిగే సందేహాలు మరియు సమాధానాలు:"
              : "Clear answers to questions asked by families across Nellore:"}
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-[#111111] pr-4">
                    {lang === "te" ? faq.qTe : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#1E6FFF] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-[#E5E7EB] pt-3 bg-white">
                    <p>{lang === "te" ? faq.aTe : faq.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
