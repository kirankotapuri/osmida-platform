"use client";

import React from "react";
import { Phone } from "lucide-react";
import { Language } from "@/lib/translations";

interface FloatingContactBarProps {
  lang: Language;
  selectedServiceName?: string;
}

export function FloatingContactBar({
  lang,
  selectedServiceName = "Home Services",
}: FloatingContactBarProps) {
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? `నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో ${selectedServiceName} గురించి వివరాలు కావాలి. దయచేసి కాల్ చేయండి.`
        : `Namaskaram Osmida! I need details about ${selectedServiceName} in Nellore. Please call me back.`
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden h-16 w-full bg-[#0B0B0F] border-t border-[#333333] select-none"
      style={{
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.35)",
      }}
      aria-label="Contact quick actions"
    >
      <div className="flex h-full w-full items-stretch">
        {/* Left Button: Call Now (50% width) */}
        <a
          href="tel:+917676358162"
          className="flex flex-1 items-center justify-center gap-2.5 px-4 h-full text-white bg-[#0B0B0F] hover:bg-[#15151A] active:bg-[#1C1C24] active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF]"
          aria-label="Call Now button +91 76763 58162"
        >
          <Phone className="h-[21px] w-[21px] text-white shrink-0 fill-white" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[15px] font-semibold text-white tracking-wide">
              {lang === "te" ? "కాల్ చేయండి" : "Call Now"}
            </span>
            {lang === "te" && (
              <span className="text-[10px] text-[#9AA0A6]">76763 58162</span>
            )}
          </div>
        </a>

        {/* 1px Vertical Divider */}
        <div className="w-[1px] h-full bg-[#333333]" aria-hidden="true" />

        {/* Right Button: WhatsApp (50% width) */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex flex-1 items-center justify-center gap-2.5 px-4 h-full text-white bg-[#0B0B0F] hover:bg-[#15151A] active:bg-[#1C1C24] active:scale-[0.98] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6FFF]"
          aria-label="WhatsApp chat button"
        >
          {/* Crisp WhatsApp SVG Icon */}
          <svg
            className="h-[21px] w-[21px] text-white shrink-0 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[15px] font-semibold text-white tracking-wide">
              {lang === "te" ? "వాట్సాప్" : "WhatsApp"}
            </span>
            {lang === "te" && (
              <span className="text-[10px] text-[#25D366]">మెసేజ్ చేయండి</span>
            )}
          </div>
        </button>
      </div>
    </aside>
  );
}
