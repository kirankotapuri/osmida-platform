"use client";

import React from "react";
import Image from "next/image";
import { Star, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { Language } from "@/lib/translations";

export interface UCServiceItemData {
  id: string;
  titleEn: string;
  titleTe: string;
  price: number;
  originalPrice?: number;
  durationEn: string;
  durationTe: string;
  rating: string;
  reviews: string;
  inclusionsEn: string[];
  inclusionsTe: string[];
  exclusionsEn?: string[];
  exclusionsTe?: string[];
  imageSrc: string;
  category: "ac" | "pest" | "cleaning";
  subcategory: string;
}

interface UCServiceCardProps {
  item: UCServiceItemData;
  lang: Language;
  onViewDetails?: (item: UCServiceItemData) => void;
}

export function UCServiceCard({ item, lang, onViewDetails }: UCServiceCardProps) {
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const discountPercent = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <div className="flex items-start justify-between gap-4 py-5 border-b border-slate-100 last:border-b-0">
      {/* Left: Info, Pricing, Bullets, View Details */}
      <div className="flex-1 min-w-0 pr-1 space-y-2">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {lang === "te" ? item.titleTe : item.titleEn}
        </h3>

        {/* Rating & Duration */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1 font-bold">
            <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
            <span>{item.rating}</span>
          </div>
          <span className="text-slate-500">({item.reviews})</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-[11px]">
            {lang === "te" ? item.durationTe : item.durationEn}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-base font-black text-slate-900">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.originalPrice && (
            <>
              <span className="text-xs text-slate-500 line-through">
                ₹{item.originalPrice.toLocaleString("en-IN")}
              </span>
              {discountPercent && discountPercent > 0 && (
                <span className="text-[10px] font-bold text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.2 rounded-md">
                  {discountPercent}% off
                </span>
              )}
            </>
          )}
        </div>

        {/* Inclusion Bullets (UC Signature) */}
        <ul className="space-y-1 pt-1 text-xs text-slate-600">
          {(lang === "te" ? item.inclusionsTe : item.inclusionsEn)
            .slice(0, 3)
            .map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-tight">
                <Check className="h-3.5 w-3.5 text-slate-700 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet}</span>
              </li>
            ))}
        </ul>

        {/* View Details Link */}
        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="inline-block text-xs font-bold text-slate-900 hover:text-black hover:underline pt-1 transition-colors"
          >
            {lang === "te" ? "పూర్తి వివరాలు చూడండి" : "View details"}
          </button>
        )}
      </div>

      {/* Right: Square Thumbnail & Overlapping + ADD Button */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-100 shadow-2xs border border-slate-100">
          <Image
            src={item.imageSrc}
            alt={item.titleEn}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        {/* Urban Company Signature + ADD / Counter Button (Overlapping Bottom Edge) */}
        <div className="-mt-3.5 z-10">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() =>
                addItem({
                  id: item.id,
                  titleEn: item.titleEn,
                  titleTe: item.titleTe,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  imageSrc: item.imageSrc,
                  category: item.category,
                  subcategory: item.subcategory,
                  duration: item.durationEn,
                })
              }
              className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-5 py-1 text-xs font-bold text-slate-900 shadow-sm transition-all active:scale-95"
            >
              <Plus className="h-3 w-3 stroke-[3]" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2.5 rounded-lg bg-slate-950 px-2 py-1 text-xs font-black text-white shadow-md">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="p-0.5 hover:text-slate-300 active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3 stroke-[3]" />
              </button>
              <span className="min-w-[14px] text-center font-bold text-white text-xs">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="p-0.5 hover:text-slate-300 active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
