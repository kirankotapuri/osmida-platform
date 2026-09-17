"use client";

import React from "react";
import Image from "next/image";

export interface SubcategoryTabItem {
  id: string;
  nameEn: string;
  nameTe: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

interface UCSubcategoryTabsProps {
  items: SubcategoryTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  lang: "en" | "te";
}

export function UCSubcategoryTabs({
  items,
  activeId,
  onSelect,
  lang,
}: UCSubcategoryTabsProps) {
  return (
    <div className="bg-white border-y border-slate-100 py-3 sticky top-14 sm:top-16 z-20 shadow-2xs">
      <div className="mx-auto max-w-xl px-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          {items.map((item) => {
            const isSelected = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className="group flex flex-col items-center focus:outline-none transition-transform active:scale-95"
              >
                {/* Icon Container */}
                <div
                  className={`relative h-15 w-15 sm:h-17 sm:w-17 rounded-2xl overflow-hidden p-0.5 transition-all ${
                    isSelected
                      ? "ring-2 ring-slate-950 bg-slate-100 shadow-xs"
                      : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border border-slate-200/70"
                  }`}
                >
                  {item.badge && (
                    <div className="absolute top-0 left-0 right-0 z-10 bg-[#007F5F] text-white text-[8px] font-black py-0.5 text-center leading-tight tracking-tight uppercase">
                      {item.badge}
                    </div>
                  )}
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.nameEn}
                      fill
                      className="object-cover"
                      sizes="70px"
                    />
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-1.5 leading-tight text-center line-clamp-2 ${
                    isSelected ? "text-slate-950 font-black" : "text-slate-700"
                  }`}
                >
                  {lang === "te" ? item.nameTe : item.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
