"use client";

import React, { useState, useEffect } from "react";
import {
  OSMIDA_SERVICES,
  DURATION_OPTIONS,
  DEFAULT_APP_SETTINGS,
  OsmidaService,
} from "@/lib/osmidaServices";
import { Language } from "@/lib/translations";
import { useServiceLocations } from "@/lib/serviceLocations";
import {
  Bath,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Info,
  Check,
  Building2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OsmidaServiceCatalogProps {
  lang: Language;
}

export function OsmidaServiceCatalog({ lang }: OsmidaServiceCatalogProps) {
  const router = useRouter();
  const { locations: dynamicLocations } = useServiceLocations();
  const [hourlyRate, setHourlyRate] = useState<number>(DEFAULT_APP_SETTINGS.hourly_rate);
  const [selectedDuration, setSelectedDuration] = useState<number>(1.5);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "bathroom_cleaning",
    "kitchen_cleaning",
  ]);

  // Fetch dynamic rate from settings API
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings?.hourly_rate) {
          setHourlyRate(Number(data.settings.hourly_rate));
        }
      } catch (err) {
        console.warn("Using default hourly rate:", err);
      }
    }
    loadSettings();
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const totalPrice = Math.round(selectedDuration * hourlyRate);

  const handleProceedToBooking = () => {
    // Save selections in localStorage for seamless booking prefill
    if (typeof window !== "undefined") {
      localStorage.setItem("osmida_booking_services", JSON.stringify(selectedServices));
      localStorage.setItem("osmida_booking_duration", String(selectedDuration));
      localStorage.setItem("osmida_booking_rate", String(hourlyRate));
      localStorage.setItem("osmida_booking_total", String(totalPrice));
    }
    const query = new URLSearchParams({
      services: selectedServices.join(","),
      duration: String(selectedDuration),
    });
    router.push(`/book?${query.toString()}`);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Bath":
        return <Bath className="h-6 w-6 text-emerald-600" />;
      case "ChefHat":
        return <ChefHat className="h-6 w-6 text-amber-600" />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="h-6 w-6 text-sky-600" />;
      case "Sparkles":
      default:
        return <Sparkles className="h-6 w-6 text-purple-600" />;
    }
  };

  return (
    <section id="services-catalog" className="py-8 sm:py-12 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header & Pricing Value Prop */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-900 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>
              {lang === "te"
                ? "నెల్లూరు అపార్ట్‌మెంట్ కేర్ • ₹0 అడ్వాన్స్ • పే ఆఫ్టర్ సర్వీస్"
                : "Nellore Apartment Care • ₹0 Advance • Escrow Protected"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === "te"
              ? "నిమిషాల్లో ప్రారంభమయ్యే హోమ్ సర్వీసెస్"
              : "Standardized Home Help at a Flat Hourly Rate"}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {lang === "te"
              ? `ఒకే ఫ్లాట్ గంట రేటు: గంటకు కేవలం ₹${hourlyRate}. మీకు కావలసిన పనులను ఎంచుకోండి — మా నిపుణులు వరుసగా పూర్తి చేస్తారు.`
              : `Single flat rate: just ₹${hourlyRate}/hour. Pick any combination of the 4 tasks below, select duration, and pay only after you inspect the before/after photos.`}
          </p>
        </div>

        {/* Duration Selection Bar */}
        <div className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-500" />
              {lang === "te" ? "సమయం ఎంచుకోండి (Duration):" : "Step 1: Select Visit Duration"}
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ₹{hourlyRate}/hr
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = selectedDuration === opt.hours;
              return (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setSelectedDuration(opt.hours)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl border-2 transition-all active:scale-98 text-center ${
                    isSelected
                      ? "border-[#0F172A] bg-slate-900 text-white shadow-md"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-800"
                  }`}
                >
                  <span className="text-sm sm:text-base font-black">
                    {lang === "te" ? opt.labelTe : opt.label}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
                      isSelected ? "text-emerald-400" : "text-slate-600"
                    }`}
                  >
                    ₹{Math.round(opt.hours * hourlyRate)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 text-center mt-2.5 font-medium">
            {lang === "te"
              ? DURATION_OPTIONS.find((d) => d.hours === selectedDuration)?.recommendedForTe
              : DURATION_OPTIONS.find((d) => d.hours === selectedDuration)?.recommendedFor}
          </p>
        </div>

        {/* Service Task Selector Counter */}
        <div className="mt-8 flex items-center justify-between max-w-6xl mx-auto px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {lang === "te"
                ? "Step 2: ఈ విజిట్‌లో చేయించాలనుకున్న పనులు ఎంచుకోండి"
                : "Step 2: Choose Tasks to Cover During Your Visit"}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === "te"
                ? "ఒకే విజిట్‌లో మీ వర్కర్ మీరు ఎంచుకున్న పనులను క్రమపద్ధతిలో పూర్తి చేస్తారు."
                : "One visit covers your selected tasks in sequence within the chosen duration."}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
            {selectedServices.length} / 4 {lang === "te" ? "ఎంచుకోబడ్డాయి" : "selected"}
          </span>
        </div>

        {/* 4 SERVICE CARDS (STRICTLY THESE 4, WITH FIXED INCLUDED/NOT INCLUDED BLOCKS) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {OSMIDA_SERVICES.map((svc) => {
            const isSelected = selectedServices.includes(svc.id);
            return (
              <div
                key={svc.id}
                onClick={() => toggleService(svc.id)}
                className={`relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 transition-all cursor-pointer border-2 shadow-xs hover:shadow-md ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Header Row: Title & Checkbox */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 border border-slate-200/80 shrink-0">
                        {getServiceIcon(svc.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-slate-900">
                            {lang === "te" ? svc.nameTe : svc.name}
                          </h4>
                          {svc.popular && (
                            <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 uppercase tracking-wide">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {lang === "te" ? svc.taglineTe : svc.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Checkbox Button */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all shrink-0 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* FIXED BLOCK: WHAT'S INCLUDED (CORE TO PRD) */}
                  <div className="mt-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{lang === "te" ? "చేర్చబడినవి (What's Included):" : "What's Included:"}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-medium pl-1">
                      {(lang === "te" ? svc.includedTe : svc.included).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* FIXED BLOCK: WHAT'S NOT INCLUDED (CORE TO PRD) */}
                  <div className="mt-3 rounded-xl bg-rose-50/70 border border-rose-200/70 p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                      <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span>{lang === "te" ? "చేర్చబడనివి (Not Included):" : "What's Not Included:"}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-950 font-medium pl-1">
                      {(lang === "te" ? svc.notIncludedTe : svc.notIncluded).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {isSelected
                      ? lang === "te"
                        ? "✓ ఈ విజిట్‌లో జోడించబడింది"
                        : "✓ Included in this visit"
                      : lang === "te"
                      ? "+ జోడించడానికి క్లిక్ చేయండి"
                      : "+ Click to add to visit"}
                  </span>
                  <span className="font-extrabold text-slate-800">
                    Flat ₹{hourlyRate}/hr
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nellore Gated Communities Notice */}
        <div className="mt-8 rounded-2xl bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
              <Building2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black">
                {lang === "te"
                  ? "నెల్లూరు అపార్ట్‌మెంట్‌లు & సొసైటీలకు ప్రాధాన్యత"
                  : "Serving Gated Communities & Apartments Across Nellore"}
              </h4>
              <p className="text-xs text-slate-300 font-medium">
                {dynamicLocations && dynamicLocations.length > 0
                  ? dynamicLocations.slice(0, 5).join(", ") + (dynamicLocations.length > 5 ? " & nearby." : ".")
                  : "Haranathapuram, Pogathota, Magunta Layout, Vedayapalem, Ramamurthy Nagar & nearby."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-emerald-300 font-bold hidden md:inline">
              ₹0 Advance • Escrow Protected
            </span>
            <button
              type="button"
              onClick={handleProceedToBooking}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 transition-all shadow-sm"
            >
              <span>{lang === "te" ? "బుక్ చేయండి" : "Book Your Pro"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM CHECKOUT TRAY (MOBILE & DESKTOP) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:p-4 shadow-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold">
                {selectedServices.length} {lang === "te" ? "పనులు" : "tasks"} • {selectedDuration} {lang === "te" ? "గంటలు" : "hrs"}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-2xl font-black text-slate-900">
                  ₹{totalPrice}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Pay After Service
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleProceedToBooking}
              className="flex items-center gap-2 rounded-xl bg-[#0F172A] hover:bg-black text-white px-5 sm:px-7 py-3 text-xs sm:text-sm font-black transition-all active:scale-95 shadow-md group"
            >
              <span>{lang === "te" ? "స్లాట్ ఎంచుకోండి" : "Book Visit"}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ProntoServiceCatalog = OsmidaServiceCatalog;

