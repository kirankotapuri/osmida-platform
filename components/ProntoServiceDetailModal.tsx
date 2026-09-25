"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { ProntoService } from "@/lib/prontoServices";

interface ProntoServiceDetailModalProps {
  service: ProntoService | null;
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_IMAGES: Record<string, string> = {
  bathroom_cleaning: "/images/isometric_bathroom_mini.jpg",
  kitchen_cleaning: "/images/isometric_kitchen_mini.jpg",
  dishwashing: "/images/isometric_dishes_mini.jpg",
  general_house_help: "/images/isometric_livingroom_mini.jpg",
};

const NELLORE_AREAS = [
  "Haranathapuram",
  "Magunta Layout",
  "Vedayapalem",
  "Pogathota",
  "Dargamitta",
  "Balaji Nagar",
  "Nawabpet",
  "Children's Park Road",
];

export function ProntoServiceDetailModal({
  service,
  isOpen,
  onClose,
}: ProntoServiceDetailModalProps) {
  if (!isOpen || !service) return null;

  const imageSrc = SERVICE_IMAGES[service.id] || "/images/isometric_bathroom_mini.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-8 shadow-2xl border border-[#DFE8E8] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-[#F4F8F8] hover:bg-[#EBF4F5] text-[#475559] transition-colors focus:outline-hidden"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Breadcrumb */}
        <div className="text-[11px] font-bold text-[#475559] uppercase tracking-wider">
          Home / Services / <span className="text-[#0C6266]">{service.name}</span>
        </div>

        {/* Hero Card Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-2">
          <div className="space-y-2.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF4F5] border border-[#B6D7D8] px-3 py-0.5 text-xs font-bold text-[#0C6266]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>Standardized Scope • Flat ₹199/hr</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F171A] tracking-tight">
              {service.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#475559] font-medium leading-relaxed">
              {service.tagline}. Book a 1-hour to 2-hour visit on your schedule with zero advance payment.
            </p>

            <div className="pt-2">
              <Link
                href={`/book?services=${service.id}&duration=1`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#E68A00]/25"
              >
                <span>Book This Service (₹199/hr)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Miniature visual */}
          <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-xl overflow-hidden border border-[#DFE8E8] bg-[#F4F8F8] shrink-0 shadow-inner">
            <Image
              src={imageSrc}
              alt={service.name}
              fill
              className="object-cover"
              sizes="208px"
            />
          </div>
        </div>

        {/* WHAT'S INCLUDED VS NOT INCLUDED */}
        <div className="rounded-xl border border-[#DFE8E8] bg-[#F4F8F8] p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* What's Included */}
            <div className="space-y-3 bg-white p-4 rounded-lg border border-[#B6D7D8] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0C6266] uppercase tracking-wider">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0C6266] text-white">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>What&apos;s Included</span>
              </div>
              <ul className="space-y-2 text-xs text-[#0F171A] font-medium">
                {service.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's NOT Included */}
            <div className="space-y-3 bg-white p-4 rounded-lg border border-[#DFE8E8] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#475559] uppercase tracking-wider">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F1F5F5] border border-[#DFE8E8] text-[#475559] font-bold">
                  –
                </span>
                <span>Not Included</span>
              </div>
              <ul className="space-y-2 text-xs text-[#475559] font-medium">
                {service.notIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#64748B] font-bold shrink-0 mt-0.5">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-[#475559] text-center font-medium">
            Clear scopes protect both residents and helpers, ensuring predictable quality at a flat ₹199/hr rate.
          </p>
        </div>

        {/* Nellore Localities Coverage */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold text-[#0F171A] uppercase tracking-wider">
            Available across Nellore Apartments
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {NELLORE_AREAS.map((area, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-[#475559] bg-[#F4F8F8] px-3 py-1 rounded-full border border-[#DFE8E8]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Booking Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DFE8E8]">
          <div className="text-xs text-[#475559] font-medium">
            Payment held in escrow • Pay only after Before/After photo review
          </div>
          <Link
            href={`/book?services=${service.id}&duration=1`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] text-white px-6 py-3 text-xs font-bold transition-all shadow-md shadow-[#E68A00]/20"
          >
            <span>Proceed to Book (₹199/hr)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
