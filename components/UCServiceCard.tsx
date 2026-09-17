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
  badge?: string;
  optionsCount?: string;
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
    <div className="flex items-start justify-between gap-3.5 py-4 border-b border-slate-100 last:border-b-0">
      {/* Left Column: Title, Rating, Price, Bullets, View Details */}
      <div className="flex-1 min-w-0 pr-1 space-y-1.5">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {lang === "te" ? item.titleTe : item.titleEn}
        </h3>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1 font-bold">
            <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
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
          <span className="text-sm sm:text-base font-extrabold text-slate-900">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.originalPrice && (
            <>
              <span className="text-xs text-slate-400 line-through">
                ₹{item.originalPrice.toLocaleString("en-IN")}
              </span>
              {discountPercent && discountPercent > 0 && (
                <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.2 rounded-md">
                  {discountPercent}% off
                </span>
              )}
            </>
          )}
        </div>

        {/* Inclusions (Urban Company Bullet Format) */}
        <ul className="space-y-1 pt-1 text-xs text-slate-600">
          {(lang === "te" ? item.inclusionsTe : item.inclusionsEn)
            .slice(0, 3)
            .map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-tight">
                <span className="text-slate-400 font-bold">•</span>
                <span className="line-clamp-2">{bullet}</span>
              </li>
            ))}
        </ul>

        {/* View details */}
        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="inline-block text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 transition-colors"
          >
            {lang === "te" ? "పూర్తి వివరాలు చూడండి" : "View details"}
          </button>
        )}
      </div>

      {/* Right Column: Square Thumbnail with Badge + Add Pill Button */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-100 shadow-2xs border border-slate-100">
          {item.badge && (
            <div className="absolute top-0 left-0 right-0 z-10 bg-[#007F5F] text-white text-[8px] font-bold py-0.5 text-center leading-tight uppercase tracking-tight">
              {item.badge}
            </div>
          )}
          <Image
            src={item.imageSrc}
            alt={item.titleEn}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        {/* Add Pill Button & Options Subtitle */}
        <div className="-mt-3 z-10 flex flex-col items-center">
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
              className="flex items-center justify-center gap-1 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-50 px-5 py-1 text-xs font-extrabold text-slate-950 shadow-xs transition-all active:scale-95"
            >
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2.5 rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-black text-white shadow-md">
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

          {item.optionsCount && quantity === 0 && (
            <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {item.optionsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
