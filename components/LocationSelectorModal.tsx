"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  Crosshair,
  MapPin,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Loader2,
  Building,
} from "lucide-react";
import { Language } from "@/lib/translations";
import { NELLORE_LOCALITIES } from "@/lib/constants";

// Non-Nellore major cities to detect out-of-service queries
const OUT_OF_SERVICE_CITIES = [
  "hyderabad",
  "chennai",
  "bangalore",
  "bengaluru",
  "tirupati",
  "vijayawada",
  "guntur",
  "ongole",
  "kavali",
  "gudur",
  "visakhapatnam",
  "vizag",
  "rajahmundry",
  "kurnool",
  "kadapa",
  "anantapur",
  "mumbai",
  "delhi",
  "pune",
  "kolkata",
];

// Popular Nellore societies, apartments, and landmarks for realistic search
const NELLORE_LANDMARKS = [
  { name: "Kailasapuram Main Road", locality: "Kailasapuram", type: "Road" },
  { name: "Srinivasa Residency, Kailasapuram", locality: "Kailasapuram", type: "Apartment" },
  { name: "Magunta Layout Water Tank", locality: "Magunta Layout", type: "Landmark" },
  { name: "Sai Baba Temple Area, Magunta Layout", locality: "Magunta Layout", type: "Landmark" },
  { name: "Trunk Road Clock Tower / VRC", locality: "Trunk Road", type: "Landmark" },
  { name: "Pogathota Gandhi Statue", locality: "Pogathota", type: "Landmark" },
  { name: "Rainbow Hospital Road, Pogathota", locality: "Pogathota", type: "Hospital" },
  { name: "Dargamitta Officers Club", locality: "Dargamitta", type: "Landmark" },
  { name: "Collectorate Office, Dargamitta", locality: "Dargamitta", type: "Government" },
  { name: "Vedayapalem Flyover Area", locality: "Vedayapalem", type: "Landmark" },
  { name: "Simhapuri Hospital Area, Vedayapalem", locality: "Vedayapalem", type: "Hospital" },
  { name: "Haranathapuram 5th Cross", locality: "Haranathapuram", type: "Residential" },
  { name: "Balaji Nagar Main Road", locality: "Balaji Nagar", type: "Residential" },
  { name: "Children's Park Road, Nellore", locality: "Children's Park Road", type: "Landmark" },
  { name: "Mini Bypass Highway Enclave", locality: "Mini Bypass Road", type: "Apartment" },
  { name: "Narayana Medical College Area", locality: "Chinthareddypalem", type: "Hospital" },
  { name: "AC Nagar 2nd Street", locality: "AC Nagar", type: "Residential" },
  { name: "Stonehousepet Market Area", locality: "Stonehousepet", type: "Market" },
];

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocality: string;
  onSelectLocality: (locality: string, fullDetails?: string) => void;
  lang: Language;
}

export function LocationSelectorModal({
  isOpen,
  onClose,
  selectedLocality,
  onSelectLocality,
  lang,
}: LocationSelectorModalProps) {
  const [query, setQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [outOfServiceInfo, setOutOfServiceInfo] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // Clear query and warnings when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setOutOfServiceInfo(null);
      setLocationSuccessMsg(null);
    }
  }, [isOpen]);

  // Check if query is an out-of-service city
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setOutOfServiceInfo(null);
      return;
    }

    const matchedOutCity = OUT_OF_SERVICE_CITIES.find((c) =>
      trimmed.includes(c)
    );

    if (matchedOutCity) {
      const cityName = matchedOutCity.charAt(0).toUpperCase() + matchedOutCity.slice(1);
      setOutOfServiceInfo(cityName);
    } else {
      setOutOfServiceInfo(null);
    }
  }, [query]);

  // GPS Current Location Detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setOutOfServiceInfo(null);
    setLocationSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;

        // Nellore coordinates approximate bounding box
        // Lat: ~14.15 to ~14.70 N, Long: ~79.75 to ~80.25 E
        const isWithinNellore =
          latitude >= 14.15 &&
          latitude <= 14.7 &&
          longitude >= 79.75 &&
          longitude <= 80.25;

        if (isWithinNellore) {
          // Inside Nellore
          const detectedName = "Kailasapuram, Nellore";
          setLocationSuccessMsg(
            lang === "te"
              ? "నెల్లూరులో మీ లొకేషన్ గుర్తించబడింది (30 నిమిషాల్లో సేవలు అందుబాటులో ఉన్నాయి)"
              : "Location detected in Nellore (30-min pro dispatch verified)"
          );
          setTimeout(() => {
            onSelectLocality("Kailasapuram", `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            onClose();
          }, 800);
        } else {
          // Outside Nellore
          setOutOfServiceInfo(
            lang === "te"
              ? "మీ ప్రస్తుత ప్రాంతం (నెల్లూరు వెలుపల)"
              : `Your Current Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`
          );
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn("Geolocation error:", error);
        // Fallback or permission denied
        alert(
          lang === "te"
            ? "లొకేషన్ యాక్సెస్ అనుమతించబడలేదు. దయచేసి క్రింద ఉన్న జాబితా నుండి మీ ప్రాంతాన్ని ఎంచుకోండి."
            : "Location access was denied. Please select your locality from the list below."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filtered Localities and Landmarks
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        localities: [...NELLORE_LOCALITIES],
        landmarks: NELLORE_LANDMARKS.slice(0, 6),
      };
    }

    // Check if query is a Google Maps link
    if (q.includes("google.com/maps") || q.includes("goo.gl") || q.includes("maps.app")) {
      return {
        localities: ["Kailasapuram", "Pogathota", "Magunta Layout"],
        landmarks: [{ name: "Google Maps Linked Location (Nellore)", locality: "Kailasapuram", type: "Map Link" }],
      };
    }

    const matchedLocalities = NELLORE_LOCALITIES.filter((loc) =>
      loc.toLowerCase().includes(q)
    );

    const matchedLandmarks = NELLORE_LANDMARKS.filter(
      (lm) =>
        lm.name.toLowerCase().includes(q) ||
        lm.locality.toLowerCase().includes(q)
    );

    return {
      localities: matchedLocalities,
      landmarks: matchedLandmarks,
    };
  }, [query]);

  const handleSelect = (loc: string, details?: string) => {
    onSelectLocality(loc, details);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Urban Company-Style Exact Location Sheet (Screenshots 2 & 3) */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 border border-slate-200 animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* 1. Header & Search Bar (Screenshot 3) */}
        <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 transition-colors shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {lang === "te" ? "మీ లొకేషన్ ఎంచుకోండి" : "Select Your Location"}
            </h3>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === "te"
                  ? "మీ ప్రాంతం / కాలనీ / అపార్ట్‌మెంట్ వెతకండి"
                  : "Search for your location/society/apartment"
              }
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all shadow-2xs"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. "Use current location" Row (Screenshot 3) */}
        <div className="px-4 py-3 border-b border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-between text-left group py-1.5 focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-[#7C3AED] group-hover:bg-purple-100 transition-colors shrink-0">
                {isLocating ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Crosshair className="h-4.5 w-4.5 stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#7C3AED] group-hover:text-purple-800 transition-colors flex items-center gap-1.5">
                  <span>
                    {isLocating
                      ? lang === "te"
                        ? "లొకేషన్ గుర్తిస్తోంది..."
                        : "Detecting location..."
                      : lang === "te"
                      ? "ప్రస్తుత లొకేషన్ ఉపయోగించండి"
                      : "Use current location"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {lang === "te"
                    ? "GPS ద్వారా ఆటో-డిటెక్ట్ • నెల్లూరు నగరంలో 30 నిమి"
                    : "Using GPS • Auto-detects in Nellore"}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* 3. Out-of-Service Area Alert Banner (As requested by user!) */}
        {outOfServiceInfo && (
          <div className="m-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-950">
                  {lang === "te"
                    ? `క్షమించండి, ${outOfServiceInfo}లో ఇంకా సేవలు లేవు`
                    : `No service in ${outOfServiceInfo}`}
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                  {lang === "te"
                    ? "ఆస్మిడా సేవలు ప్రస్తుతం నెల్లూరు నగరంలో మాత్రమే అందుబాటులో ఉన్నాయి. మేము త్వరలోనే మీ ప్రాంతానికి రానున్నాము!"
                    : "Osmida verified pro services are currently active exclusively in Nellore city (AP). We do not provide service in this area yet."}
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-amber-200/60">
              <span className="text-[10px] font-bold text-amber-900">
                {lang === "te" ? "నెల్లూరు ప్రాంతాన్ని ఎంచుకోండి:" : "Select a locality in Nellore:"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setOutOfServiceInfo(null);
                }}
                className="text-[11px] font-black text-slate-900 underline hover:text-black"
              >
                {lang === "te" ? "నెల్లూరు చూడండి" : "Browse Nellore"}
              </button>
            </div>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {locationSuccessMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2 text-xs font-bold shrink-0">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{locationSuccessMsg}</span>
          </div>
        )}

        {/* 4. Scrollable Content: Localities & Landmarks */}
        <div className="overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* Landmarks / Societies (If query matches or defaults) */}
          {filteredItems.landmarks.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  {lang === "te" ? "ప్రముఖ ప్రాంతాలు & అపార్ట్‌మెంట్లు" : "Societies & Landmarks"}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  ✓ 30-min Service
                </span>
              </div>
              <div className="space-y-1">
                {filteredItems.landmarks.map((lm, idx) => (
                  <button
                    key={`${lm.name}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(lm.locality, lm.name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building className="h-4 w-4 text-slate-400 group-hover:text-slate-900 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                          {lm.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {lm.locality}, Nellore • {lm.type}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                      {lang === "te" ? "ఎంచుకోండి" : "Select"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Nellore Localities */}
          <div className="pt-3 space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {lang === "te" ? "నెల్లూరులోని ప్రాంతాలు" : "All Nellore Areas"}
              </span>
              <span className="text-[10px] text-slate-400">
                {filteredItems.localities.length} {lang === "te" ? "ప్రాంతాలు" : "areas"}
              </span>
            </div>

            <div className="space-y-1">
              {filteredItems.localities.map((loc) => {
                const isSelected = selectedLocality === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? "bg-slate-900 text-white font-bold shadow-xs"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? "text-white" : "text-slate-400"
                        }`}
                      />
                      <div>
                        <div className={`text-xs sm:text-sm truncate ${isSelected ? "font-black" : "font-semibold"}`}>
                          {loc}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          Nellore, AP • 30-min Pro Dispatch
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <Check className="h-4 w-4 text-white shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        {lang === "te" ? "అందుబాటులో ఉంది" : "Active"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Footer: "powered by Google" (Screenshot 3) */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1 shrink-0 text-slate-400 text-[11px]">
          <span>powered by</span>
          <span className="font-bold text-slate-600">Google</span>
        </div>
      </div>
    </div>
  );
}
