"use client";

import React from "react";
import Image from "next/image";
import { X, Star, Check, AlertCircle, ShieldCheck, Plus, Minus } from "lucide-react";
import { UCServiceItemData } from "./UCServiceCard";
import { useCart } from "@/lib/cartContext";
import { Language } from "@/lib/translations";

interface UCServiceDetailModalProps {
  item: UCServiceItemData | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function UCServiceDetailModal({
  item,
  isOpen,
  onClose,
  lang,
}: UCServiceDetailModalProps) {
  const { getItemQuantity, addItem, updateQuantity, setIsCartDrawerOpen } = useCart();

  if (!isOpen || !item) return null;

  const quantity = getItemQuantity(item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Close Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {lang === "te" ? "సర్వీస్ వివరాలు" : "Service Details"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {/* Header Media */}
          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-2xs border border-slate-100">
            <Image
              src={item.imageSrc}
              alt={item.titleEn}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {lang === "te" ? item.titleTe : item.titleEn}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                <span>{item.rating}</span>
              </div>
              <span>({item.reviews} reviews)</span>
              <span>•</span>
              <span>{lang === "te" ? item.durationTe : item.durationEn}</span>
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              ₹{item.price.toLocaleString("en-IN")}
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {lang === "te" ? "సర్వీసులో ఏముంటుంది?" : "What's Included"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {(lang === "te" ? item.inclusionsTe : item.inclusionsEn).map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Excluded */}
          {item.exclusionsEn && item.exclusionsEn.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {lang === "te" ? "చేర్చబడనివి" : "What's Excluded"}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                {(lang === "te" ? item.exclusionsTe || item.exclusionsEn : item.exclusionsEn).map(
                  (exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Warranty & Guarantee */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">
                {lang === "te" ? "సర్వీస్ వారంటీ & ₹0 అడ్వాన్స్" : "Service Warranty & ₹0 Advance"}
              </p>
              <p className="text-slate-500 text-[11px]">
                {lang === "te"
                  ? "అధికారిక బ్లాక్ యూనిఫాం నిపుణులు. పని చూశాకే చెల్లింపు."
                  : "Verified pro in official black uniform. Pay only after satisfactory completion."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA Button */}
        <div className="pt-3 border-t border-slate-100">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => {
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
                });
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3 px-4 text-center text-sm font-bold text-white shadow-md active:scale-98 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === "te" ? "కార్ట్‌కి చేర్చండి (₹" + item.price + ")" : "Add to Cart (₹" + item.price + ")"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-100 border border-slate-200 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 text-slate-700 hover:text-black active:scale-90"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-slate-900 text-sm min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 text-slate-700 hover:text-black active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsCartDrawerOpen(true);
                }}
                className="flex-1 rounded-2xl bg-slate-950 hover:bg-black py-3 px-4 text-center text-sm font-bold text-white shadow-md active:scale-98 transition-all"
              >
                {lang === "te" ? "కార్ట్ చూడండి" : "View Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
