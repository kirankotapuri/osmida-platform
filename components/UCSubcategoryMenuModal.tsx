"use client";

import React, { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

export interface MenuSubcategory {
  id: string;
  nameEn: string;
  nameTe: string;
  itemCount: number;
}

interface UCSubcategoryMenuModalProps {
  categories: MenuSubcategory[];
  activeId: string;
  onSelect: (id: string) => void;
  lang: "en" | "te";
}

export function UCSubcategoryMenuModal({
  categories,
  activeId,
  onSelect,
  lang,
}: UCSubcategoryMenuModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating ≡ Menu Pill Button (Urban Company Screenshot 3) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900/95 backdrop-blur-md px-4 py-2 text-white shadow-xl hover:bg-black transition-transform active:scale-95 border border-white/15"
          aria-label="Open subcategory menu"
        >
          <Menu className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wide">
            {lang === "te" ? "మెనూ" : "Menu"}
          </span>
        </button>
      </div>

      {/* Slide-Up Bottom Sheet Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 z-10 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {lang === "te" ? "విభాగాలు (Categories)" : "Select Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 py-2">
              {categories.map((cat) => {
                const isSelected = activeId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full flex items-center justify-between py-3.5 px-3 text-left rounded-xl transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-950 font-bold"
                        : "hover:bg-slate-50 text-slate-800 font-medium"
                    }`}
                  >
                    <div>
                      <span className="text-sm">
                        {lang === "te" ? cat.nameTe : cat.nameEn}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {cat.itemCount} {cat.itemCount === 1 ? "option" : "options"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
