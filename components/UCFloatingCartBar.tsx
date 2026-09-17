"use client";

import React from "react";
import { useCart } from "@/lib/cartContext";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Language } from "@/lib/translations";

export function UCFloatingCartBar({ lang }: { lang: Language }) {
  const { totalItems, totalAmount, setIsCartDrawerOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-xl pointer-events-auto">
        <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-3 sm:p-3.5 text-white shadow-xl border border-white/10 animate-in slide-in-from-bottom-4 duration-200">
          {/* Left: Summary & Advance info */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  ({totalItems} {totalItems === 1 ? "service" : "services"})
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold">
                {lang === "te" ? "₹0 అడ్వాన్స్ • పని అయ్యాకే చెల్లింపు" : "₹0 Advance • Pay after service"}
              </p>
            </div>
          </div>

          {/* Right: View Cart CTA */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 px-4 py-2 text-xs font-black text-slate-950 shadow-sm transition-transform active:scale-95"
          >
            <span>{lang === "te" ? "కార్ట్ చూడండి" : "View Cart"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
