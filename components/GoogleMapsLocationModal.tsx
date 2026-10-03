"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  Search,
  Navigation,
  ExternalLink,
  Check,
  X,
  Loader2,
  Sparkles,
  Building2,
  Compass,
} from "lucide-react";

import { useServiceLocations, DEFAULT_NELLORE_LOCALITIES } from "@/lib/serviceLocations";

interface GoogleMapsLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    locality: string;
    streetAddress: string;
    apartmentName?: string;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
  }) => void;
  currentLocality?: string;
}

const NELLORE_AREAS = DEFAULT_NELLORE_LOCALITIES;

const POPULAR_NELLORE_LANDMARKS = [
  { name: "Balaji Towers", locality: "Magunta Layout", address: "Main Road, Magunta Layout" },
  { name: "Srinivasa Residency", locality: "Pogathota", address: "Near Gandhi Statue, Pogathota" },
  { name: "Gomathy Enclave", locality: "Haranathapuram", address: "1st Line, Haranathapuram" },
  { name: "Sai Baba Temple Area", locality: "Vedayapalem", address: "Vedayapalem Main Road" },
  { name: "Collectorate Road", locality: "Dargamitta", address: "Near Collector Office, Dargamitta" },
  { name: "Children's Park Road", locality: "Balaji Nagar", address: "Opp. Children's Park, Balaji Nagar" },
];

export function GoogleMapsLocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocality = "Pogathota",
}: GoogleMapsLocationModalProps) {
  const { locations: dynamicLocations } = useServiceLocations();
  const availableLocalities = dynamicLocations && dynamicLocations.length > 0 ? dynamicLocations : NELLORE_AREAS;

  const [mounted, setMounted] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(currentLocality);
  const [searchQuery, setSearchQuery] = useState("");
  const [detectedAddress, setDetectedAddress] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [lat, setLat] = useState<number>(14.4426);
  const [lng, setLng] = useState<number>(79.9865);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [gpsSuccess, setGpsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with current locality on open
  useEffect(() => {
    if (currentLocality && availableLocalities.includes(currentLocality)) {
      setSelectedLocality(currentLocality);
    }
  }, [currentLocality, isOpen, availableLocalities]);

  if (!isOpen || !mounted) return null;

  // Realtime GPS Locator
  const handleUseCurrentGpsLocation = () => {
    setIsLocatingGps(true);
    setGpsError("");
    setGpsSuccess(false);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      setIsLocatingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        setGpsSuccess(true);

        try {
          // Reverse geocode via OpenStreetMap Nominatim for Indian address details
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          if (data && data.address) {
            const road = data.address.road || data.address.suburb || data.address.neighbourhood || "";
            const area = data.address.suburb || data.address.neighbourhood || data.address.county || "";
            const postcode = data.address.postcode || "524001";
            const fullStr = [road, area, "Nellore", postcode].filter(Boolean).join(", ");
            setDetectedAddress(fullStr);

            // Match closest Nellore locality
            const matchedArea = availableLocalities.find((a) =>
              fullStr.toLowerCase().includes(a.toLowerCase())
            );
            if (matchedArea) {
              setSelectedLocality(matchedArea);
            }
          } else {
            setDetectedAddress(`Near ${userLat.toFixed(4)}, ${userLng.toFixed(4)}, Nellore`);
          }
        } catch {
          setDetectedAddress(`GPS Coordinates: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}, Nellore`);
        } finally {
          setIsLocatingGps(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setGpsError(
          err.code === 1
            ? "Location permission denied. You can select your area below."
            : "Could not retrieve exact location. Please select your locality below."
        );
        setIsLocatingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectLandmark = (item: (typeof POPULAR_NELLORE_LANDMARKS)[0]) => {
    setSelectedLocality(item.locality);
    setApartmentName(item.name);
    setDetectedAddress(`${item.address}, Nellore`);
    setSearchQuery(item.name);
  };

  const handleConfirmLocation = () => {
    const finalAddress = detectedAddress || searchQuery || `${selectedLocality}, Nellore`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      finalAddress + ", Nellore, Andhra Pradesh"
    )}`;

    onSelectLocation({
      locality: selectedLocality,
      streetAddress: finalAddress,
      apartmentName: apartmentName || undefined,
      latitude: lat,
      longitude: lng,
      googleMapsUrl,
    });
    onClose();
  };

  // Google Maps Embed Query String
  const mapSearchTerm = searchQuery
    ? `${searchQuery}, ${selectedLocality}, Nellore`
    : `${selectedLocality}, Nellore, Andhra Pradesh`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    gpsSuccess ? `${lat},${lng}` : mapSearchTerm
  )}&z=15&output=embed`;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/70 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] text-left my-6 sm:my-8 animate-in fade-in zoom-in-95 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0C6266]/10 text-[#0C6266] shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>Find Location on Google Maps</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live GPS
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Accurate address helps your Osmida helper arrive right on time at your door.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Realtime GPS Quick Locate Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleUseCurrentGpsLocation}
              disabled={isLocatingGps}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 px-4 text-xs font-bold transition shadow-sm active:scale-98"
            >
              {isLocatingGps ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Detecting GPS Location in Nellore...</span>
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  <span>Use My Current GPS Location</span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
              {gpsError}
            </p>
          )}

          {gpsSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
              <Check className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Realtime GPS location locked! Review or refine below.</span>
            </div>
          )}

          {/* Interactive Google Map View */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner h-48 sm:h-56">
            <iframe
              title="Nellore Live Google Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
            />
            {/* Overlay map pin badge */}
            <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
              <Compass className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>Nellore Live Map</span>
            </div>
          </div>

          {/* Locality Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
              1. Nellore Locality / Zone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {availableLocalities.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedLocality(area)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition text-center truncate ${
                    selectedLocality === area
                      ? "bg-[#0C6266] text-white border-[#0C6266] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Apartment / Landmark Search or Manual Address */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
              2. Search Apartment or Enter Street Landmark
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Balaji Towers, Magunta Layout or Main Road"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDetectedAddress(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]/20 bg-white"
              />
            </div>
          </div>

          {/* Quick Popular Nellore Landmarks Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Pick Popular Nellore Landmarks:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_NELLORE_LANDMARKS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLandmark(item)}
                  className="flex items-center gap-1 text-[11px] font-medium bg-[#F4F8F8] hover:bg-[#EBF4F5] text-slate-700 px-2.5 py-1 rounded-lg border border-[#DFE8E8] transition text-left"
                >
                  <Building2 className="h-3 w-3 text-[#0C6266] shrink-0" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Preview Box */}
          <div className="rounded-xl bg-[#F4F8F8] border border-[#DFE8E8] p-3 text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Location:</span>
            <p className="font-bold text-slate-900">
              {detectedAddress || searchQuery || `${selectedLocality}, Nellore`}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                (detectedAddress || selectedLocality) + ", Nellore, Andhra Pradesh"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C6266] hover:underline pt-0.5"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLocation}
            className="w-2/3 flex items-center justify-center gap-1.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 py-2.5 px-4 text-xs font-black transition shadow-sm active:scale-98"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>Confirm &amp; Use Location</span>
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
