"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ProntoHeader } from "@/components/ProntoHeader";
import { Language } from "@/lib/translations";
import {
  PRONTO_SERVICES,
  DURATION_OPTIONS,
  DEFAULT_APP_SETTINGS,
} from "@/lib/prontoServices";
import { OsmidaSupportChat } from "@/components/OsmidaSupportChat";
import {
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  Phone,
  User,
  Calendar,
  Check,
  AlertCircle,
  CreditCard,
  Lock,
  Navigation,
  Compass,
  ExternalLink,
} from "lucide-react";
import { GoogleMapsLocationModal } from "@/components/GoogleMapsLocationModal";
import { CustomerLoginModal } from "@/components/CustomerLoginModal";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Language>("en");

  // Pre-fill from query or localStorage
  const [selectedServices, setSelectedServices] = useState<string[]>(["bathroom_cleaning"]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1.0);
  const [hourlyRate, setHourlyRate] = useState<number>(DEFAULT_APP_SETTINGS.hourly_rate);

  // Booking Type: instant | scheduled | recurring
  const [bookingType, setBookingType] = useState<"instant" | "scheduled" | "recurring">("instant");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("Morning (9 AM – 12 PM)");
  const [recurringFrequency, setRecurringFrequency] = useState<string>("Weekly (Every Saturday)");

  // Address & Resident Details
  const [locality, setLocality] = useState<string>("Pogathota");
  const [apartmentName, setApartmentName] = useState<string>("");
  const [flatNumber, setFlatNumber] = useState<string>("");
  const [towerBlock, setTowerBlock] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Customer Profile & Booking For State
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const [savedProfile, setSavedProfile] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);

  // Payment mode state
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    // Initial date default: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split("T")[0]);

    // Read from searchParams
    const servicesParam = searchParams.get("services");
    if (servicesParam) {
      const ids = servicesParam.split(",").filter(Boolean);
      setSelectedServices(ids);
      // Auto-adjust default duration recommendation based on selected task count
      if (!searchParams.get("duration")) {
        if (ids.length === 1) setSelectedDuration(1.0);
        else if (ids.length === 2) setSelectedDuration(1.5);
        else if (ids.length >= 3) setSelectedDuration(2.0);
      }
    } else {
      // Default clean slate: 1 task, 1.0 hour, ₹199
      setSelectedServices(["bathroom_cleaning"]);
      setSelectedDuration(1.0);
    }

    const durationParam = searchParams.get("duration");
    if (durationParam) {
      setSelectedDuration(Number(durationParam) || 1.0);
    }

    // Pre-fill phone & load customer profile if returning customer
    if (typeof window !== "undefined") {
      const storedPhone = localStorage.getItem("osmida_customer_phone");
      const storedProfile = localStorage.getItem("osmida_customer_profile");

      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          setSavedProfile(parsed);
          setIsLoggedIn(true);
          if (parsed.phone && !phone) setPhone(parsed.phone);
          if (parsed.name && !customerName) setCustomerName(parsed.name);
          if (parsed.locality) setLocality(parsed.locality);
          if (parsed.apartmentName) setApartmentName(parsed.apartmentName);
          if (parsed.flatNumber) setFlatNumber(parsed.flatNumber);
          if (parsed.towerBlock) setTowerBlock(parsed.towerBlock);
          if (parsed.address) setStreetAddress(parsed.address);
          if (parsed.googleMapsUrl) setGoogleMapsUrl(parsed.googleMapsUrl);
        } catch {}
      } else if (storedPhone) {
        setPhone(storedPhone);
        setIsLoggedIn(true);
        fetch(`/api/customer/profile?phone=${storedPhone}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.profile) {
              setSavedProfile(d.profile);
              localStorage.setItem("osmida_customer_profile", JSON.stringify(d.profile));
              if (d.profile.name) setCustomerName(d.profile.name);
              if (d.profile.locality) setLocality(d.profile.locality);
              if (d.profile.apartmentName) setApartmentName(d.profile.apartmentName);
              if (d.profile.flatNumber) setFlatNumber(d.profile.flatNumber);
              if (d.profile.towerBlock) setTowerBlock(d.profile.towerBlock);
              if (d.profile.address) setStreetAddress(d.profile.address);
              if (d.profile.googleMapsUrl) setGoogleMapsUrl(d.profile.googleMapsUrl);
            }
          })
          .catch(() => {});
      }
    }

    const localityParam = searchParams.get("locality");
    if (localityParam) setLocality(localityParam);

    const aptParam = searchParams.get("apartment");
    if (aptParam) setApartmentName(aptParam);

    const typeParam = searchParams.get("type");
    if (typeParam && ["instant", "scheduled", "recurring"].includes(typeParam)) {
      setBookingType(typeParam as any);
    }

    const dateParam = searchParams.get("date");
    if (dateParam) setScheduledDate(dateParam);

    const timeSlotParam = searchParams.get("timeSlot");
    if (timeSlotParam) {
      if (timeSlotParam === "morning_09_12") setTimeSlot("Morning (9 AM – 12 PM)");
      else if (timeSlotParam === "afternoon_13_16") setTimeSlot("Afternoon (1 PM – 4 PM)");
      else if (timeSlotParam === "evening_16_19") setTimeSlot("Evening (4 PM – 7 PM)");
      else setTimeSlot(timeSlotParam);
    }

    // Fetch dynamic rate from API
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings?.hourly_rate) {
          setHourlyRate(Number(data.settings.hourly_rate));
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }

      // Automatically adjust duration recommendation to match task count
      if (next.length === 1) {
        setSelectedDuration(1.0);
      } else if (next.length === 2) {
        setSelectedDuration(1.5);
      } else if (next.length >= 3) {
        setSelectedDuration(2.0);
      }

      return next;
    });
  };

  const totalPrice = Math.round(selectedDuration * hourlyRate);

  const handleBookingForToggle = (mode: "self" | "other") => {
    setBookingFor(mode);
    if (mode === "other") {
      // Clear location details so customer can enter recipient's address
      setApartmentName("");
      setFlatNumber("");
      setTowerBlock("");
      setStreetAddress("");
      setGoogleMapsUrl(null);
    } else {
      // Restore from saved personal profile
      if (savedProfile) {
        if (savedProfile.locality) setLocality(savedProfile.locality);
        if (savedProfile.apartmentName) setApartmentName(savedProfile.apartmentName);
        if (savedProfile.flatNumber) setFlatNumber(savedProfile.flatNumber);
        if (savedProfile.towerBlock) setTowerBlock(savedProfile.towerBlock);
        if (savedProfile.address) setStreetAddress(savedProfile.address);
        if (savedProfile.googleMapsUrl) setGoogleMapsUrl(savedProfile.googleMapsUrl);
        if (savedProfile.name && !customerName) setCustomerName(savedProfile.name);
      }
    }
  };

  const handleLoginSuccess = (profile: any) => {
    setIsLoggedIn(true);
    setSavedProfile(profile);
    if (profile.phone) setPhone(profile.phone);
    if (profile.name) setCustomerName(profile.name);
    if (bookingFor === "self") {
      if (profile.locality) setLocality(profile.locality);
      if (profile.apartmentName) setApartmentName(profile.apartmentName);
      if (profile.flatNumber) setFlatNumber(profile.flatNumber);
      if (profile.towerBlock) setTowerBlock(profile.towerBlock);
      if (profile.address) setStreetAddress(profile.address);
      if (profile.googleMapsUrl) setGoogleMapsUrl(profile.googleMapsUrl);
    }
  };

  const handleLocationFromMap = (loc: {
    locality: string;
    streetAddress: string;
    apartmentName?: string;
    latitude?: number;
    longitude?: number;
    googleMapsUrl?: string;
  }) => {
    if (loc.locality) setLocality(loc.locality);
    if (loc.apartmentName) setApartmentName(loc.apartmentName);
    if (loc.streetAddress) setStreetAddress(loc.streetAddress);
    if (loc.googleMapsUrl) setGoogleMapsUrl(loc.googleMapsUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setFormError(
        lang === "te"
          ? "దయచేసి సరైన 10 అంకెల వాట్సాప్ మొబైల్ నంబర్ నమోదు చేయండి."
          : "Please enter a valid 10-digit WhatsApp mobile number."
      );
      return;
    }

    if (!customerName.trim()) {
      setFormError(
        lang === "te"
          ? "దయచేసి మీ పేరును నమోదు చేయండి."
          : "Please enter your name."
      );
      return;
    }

    if (!apartmentName.trim() && !streetAddress.trim()) {
      setFormError(
        lang === "te"
          ? "దయచేసి అపార్ట్‌మెంట్ పేరు లేదా ఇంటి నంబర్ నమోదు చేయండి."
          : "Please enter your apartment name or street address."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        selectedServices,
        durationHours: selectedDuration,
        hourlyRate,
        totalAmount: totalPrice,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        locality,
        apartmentName: apartmentName.trim(),
        flatNumber: flatNumber.trim(),
        towerBlock: towerBlock.trim(),
        address: streetAddress.trim(),
        bookingType,
        scheduledDate: bookingType === "instant" ? new Date().toISOString().split("T")[0] : scheduledDate,
        timeSlot:
          bookingType === "instant"
            ? "Within 60 mins"
            : bookingType === "recurring"
            ? `${recurringFrequency} • ${timeSlot}`
            : timeSlot,
        notes: notes.trim(),
        paymentMethod: paymentMode,
        bookingFor,
        googleMapsUrl,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Success: save customer phone and profile if booking for self
      if (typeof window !== "undefined") {
        localStorage.setItem("osmida_customer_phone", cleanPhone);
        if (bookingFor === "self") {
          const profileData = {
            name: customerName.trim(),
            phone: cleanPhone,
            locality,
            apartmentName: apartmentName.trim(),
            flatNumber: flatNumber.trim(),
            towerBlock: towerBlock.trim(),
            address: streetAddress.trim(),
            googleMapsUrl,
          };
          localStorage.setItem("osmida_customer_profile", JSON.stringify(profileData));
          localStorage.setItem("osmida_customer_name", customerName.trim());
          // Sync with backend profile store in background
          fetch("/api/customer/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          }).catch(() => {});
        }
      }
      router.push(`/booking/${data.referenceId}`);
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <ProntoHeader />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{lang === "te" ? "సర్వీస్ కేటలాగ్‌కి తిరిగి వెళ్ళండి" : "Back to Services"}</span>
        </Link>

        {/* Page Title */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 px-3 py-0.5 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>Escrow Protected • Pay After Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {lang === "te" ? "మీ ఇంటి సహాయాన్ని బుక్ చేసుకోండి" : "Book Your Home Help Visit"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {lang === "te"
              ? "నెల్లూరు అపార్ట్‌మెంట్‌ల కోసం ఫ్లాట్ అవర్లీ రేటు. సర్వీస్ పూర్తయిన తర్వాతే చెల్లించండి."
              : "Standardized residential tasks for Nellore apartments. 1 visit covers your sequence of tasks."}
          </p>
        </div>

        {formError && (
          <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-3 text-xs text-rose-800 font-semibold animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. CONFIRM SERVICES */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {lang === "te" ? "1. ఎంచుకున్న పనులు (Tasks)" : "1. Tasks to Cover"}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {selectedServices.length} {lang === "te" ? "ఎంచుకోబడ్డాయి" : "selected"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRONTO_SERVICES.map((s) => {
                const isChecked = selectedServices.includes(s.id);
                const imageMap: Record<string, string> = {
                  bathroom_cleaning: "/images/isometric_bathroom_mini.jpg",
                  kitchen_cleaning: "/images/isometric_kitchen_mini.jpg",
                  dishwashing: "/images/isometric_dishes_mini.jpg",
                  general_house_help: "/images/isometric_livingroom_mini.jpg",
                };
                const imgSrc = imageMap[s.id] || "/images/isometric_bathroom_mini.jpg";

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isChecked
                        ? "border-[#0C6266] bg-[#EBF4F5] text-[#0C6266] shadow-xs"
                        : "border-[#DFE8E8] bg-white text-[#475559] hover:border-[#B6D7D8]"
                    }`}
                  >
                    <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2 bg-[#F4F8F8]">
                      <Image
                        src={imgSrc}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                      {isChecked && (
                        <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C6266] text-white shadow-xs">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#0F171A]">{s.name}</span>
                    <span className="text-[10px] text-[#0C6266] font-bold mt-0.5">
                      {isChecked ? "✓ Selected" : "+ Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. DURATION SELECTOR */}
          <div className="rounded-xl bg-white p-4 sm:p-5 border border-[#DFE8E8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#475559]">
                {lang === "te" ? "2. సమయం (Duration)" : "2. Visit Duration"}
              </span>
              <span className="text-xs font-bold text-[#0C6266] bg-[#EBF4F5] px-2 py-0.5 rounded border border-[#B6D7D8]">
                Flat ₹{hourlyRate}/hr
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = selectedDuration === opt.hours;
                return (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setSelectedDuration(opt.hours)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      isSelected
                        ? "border-[#0C6266] bg-[#0C6266] text-white shadow-sm"
                        : "border-[#DFE8E8] hover:border-[#B6D7D8] bg-[#F4F8F8] text-[#0F171A]"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">
                      {lang === "te" ? opt.labelTe : opt.label}
                    </div>
                    <div
                      className={`text-[11px] font-bold mt-0.5 ${
                        isSelected ? "text-[#E68A00]" : "text-[#475559]"
                      }`}
                    >
                      ₹{Math.round(opt.hours * hourlyRate)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. BOOKING TYPE: INSTANT / SCHEDULED / RECURRING */}
          <div className="rounded-xl bg-white p-4 sm:p-5 border border-[#DFE8E8] shadow-2xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475559]">
              {lang === "te" ? "3. రాక సమయం (When Do You Need Help?)" : "3. When Do You Need Help?"}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBookingType("instant")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  bookingType === "instant"
                    ? "border-[#0C6266] bg-[#EBF4F5] text-[#0C6266] font-bold"
                    : "border-[#DFE8E8] bg-[#F4F8F8] text-[#475559]"
                }`}
              >
                <div className="text-xs font-bold">⚡ {lang === "te" ? "ఇప్పుడే (Instant)" : "Instant"}</div>
                <div className="text-[10px] text-[#475559] mt-0.5">Within 60 mins</div>
              </button>

              <button
                type="button"
                onClick={() => setBookingType("scheduled")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  bookingType === "scheduled"
                    ? "border-[#0C6266] bg-[#EBF4F5] text-[#0C6266] font-bold"
                    : "border-[#DFE8E8] bg-[#F4F8F8] text-[#475559]"
                }`}
              >
                <div className="text-xs font-bold">📅 {lang === "te" ? "షెడ్యూల్డ్" : "Scheduled"}</div>
                <div className="text-[10px] text-[#475559] mt-0.5">Specific Slot</div>
              </button>

              <button
                type="button"
                onClick={() => setBookingType("recurring")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  bookingType === "recurring"
                    ? "border-[#0C6266] bg-[#EBF4F5] text-[#0C6266] font-bold"
                    : "border-[#DFE8E8] bg-[#F4F8F8] text-[#475559]"
                }`}
              >
                <div className="text-xs font-bold">🔁 {lang === "te" ? "రొటీన్ ప్లాన్" : "Recurring"}</div>
                <div className="text-[10px] text-[#475559] mt-0.5">Weekly / Daily</div>
              </button>
            </div>

            {/* Scheduled Slot Selection */}
            {bookingType === "scheduled" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {lang === "te" ? "తేదీ (Date)" : "Select Date"}
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {lang === "te" ? "సమయం స్లాట్ (Time Slot)" : "Preferred Slot"}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900 bg-white"
                  >
                    <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                    <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
                    <option value="Evening (4 PM – 8 PM)">Evening (4 PM – 8 PM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Recurring Frequency Selection */}
            {bookingType === "recurring" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {lang === "te" ? "ఫ్రీక్వెన్సీ (Frequency)" : "Frequency Plan"}
                  </label>
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900 bg-white"
                  >
                    <option value="Daily (Morning Routine)">Daily (Every Day)</option>
                    <option value="Weekly (Every Saturday)">Weekly (Every Saturday)</option>
                    <option value="Weekly (Every Sunday)">Weekly (Every Sunday)</option>
                    <option value="Bi-Weekly (Twice a week)">Bi-Weekly (2x per week)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {lang === "te" ? "సమయం స్లాట్ (Time Slot)" : "Time Slot"}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900 bg-white"
                  >
                    <option value="Morning (8 AM – 11 AM)">Morning (8 AM – 11 AM)</option>
                    <option value="Afternoon (1 PM – 4 PM)">Afternoon (1 PM – 4 PM)</option>
                    <option value="Evening (5 PM – 8 PM)">Evening (5 PM – 8 PM)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 4. ADDRESS & APARTMENT DETAILS */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {lang === "te" ? "4. అడ్రస్ & అపార్ట్‌మెంట్ వివరాలు" : "4. Address & Apartment Details (Nellore)"}
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  {bookingFor === "self"
                    ? "Service visit will arrive at your home"
                    : "Service visit for recipient's apartment / address"}
                </p>
              </div>

              {/* Realtime Google Maps / GPS button */}
              <button
                type="button"
                onClick={() => setIsMapsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C6266]/10 hover:bg-[#0C6266]/20 text-[#0C6266] text-xs font-bold transition-all border border-[#0C6266]/30 cursor-pointer self-start sm:self-auto shadow-2xs active:scale-98"
              >
                <Compass className="h-3.5 w-3.5 text-[#0C6266]" />
                <span>📍 Find on Google Maps / GPS</span>
              </button>
            </div>

            {/* Returning Customer Login Banner if not logged in */}
            {!isLoggedIn ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-900 font-semibold">
                    Already booked on Osmida? <span className="font-bold">Log in with WhatsApp</span> to autofill your saved address in 1 click.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="rounded-lg bg-[#0C6266] hover:bg-[#094e51] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  👤 Log In
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Logged in as <strong className="text-emerald-950">{savedProfile?.name || phone}</strong>
                    {savedProfile?.apartmentName && ` • ${savedProfile.apartmentName}`}
                  </span>
                </div>
                <Link
                  href="/my-bookings"
                  className="text-[11px] font-bold text-[#0C6266] hover:underline whitespace-nowrap self-start sm:self-auto"
                >
                  Manage Saved Profile ↗
                </Link>
              </div>
            )}

            {/* Booking For Toggle: Self vs Other */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Who are you booking this service for?
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleBookingForToggle("self")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    bookingFor === "self"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏠 Booking for My Home
                </button>
                <button
                  type="button"
                  onClick={() => handleBookingForToggle("other")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    bookingFor === "other"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎁 Booking for Someone Else
                </button>
              </div>
              {bookingFor === "other" && (
                <p className="text-[11px] text-amber-800 font-medium bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/70 mt-1">
                  💡 Booking for parents, friends, or another apartment. Your personal saved address profile will not be overwritten.
                </p>
              )}
            </div>

            {/* Google Maps Attached Badge */}
            {googleMapsUrl && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Google Maps GPS Pin Linked</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#0C6266] underline font-bold hover:text-[#094e51]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "ప్రాంతం (Locality in Nellore)*" : "Nellore Locality*"}
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-slate-900 bg-white"
                >
                  {DEFAULT_APP_SETTINGS.service_zones.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "అపార్ట్‌మెంట్ / గేటెడ్ కమ్యూనిటీ పేరు*" : "Apartment / Society Name*"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Sai Residency, Haranathapuram"
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "ఫ్లాట్ నంబర్ (Flat No)*" : "Flat / Door Number*"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "టవర్ / బ్లాక్ (Tower/Block)" : "Tower / Block (Optional)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block B, 3rd Floor"
                  value={towerBlock}
                  onChange={(e) => setTowerBlock(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "స్ట్రీట్ లేదా ల్యాండ్‌మార్క్" : "Street / Landmark"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Children's Park, Behind Apollo Pharmacy"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 5. RESIDENT / RECIPIENT CONTACT */}
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {lang === "te"
                  ? "5. సంప్రదింపు వివరాలు"
                  : bookingFor === "self"
                  ? "5. Resident Contact (Your Details)"
                  : "5. Recipient Contact Details"}
              </span>
              {bookingFor === "other" && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Service Recipient
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {bookingFor === "self" ? "Your Name*" : "Recipient's Name*"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={bookingFor === "self" ? "e.g. Venkat Rao" : "e.g. Smt. Lakshmi (Mother)"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {bookingFor === "self" ? "WhatsApp Number*" : "Recipient Mobile Number*"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="94901 22849"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-300 pl-11 p-2.5 text-xs font-bold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === "te" ? "ఏదైనా ప్రత్యేక సూచనలు (Special Instructions)" : "Special Instructions / Notes"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please bring extra floor wiper, ring bell twice"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 6. PAYMENT MODE SELECTION */}
          <div className="rounded-xl bg-[#EBF4F5] border border-[#B6D7D8] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0C6266] flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[#0C6266]" />
                <span>{lang === "te" ? "6. చెల్లింపు విధానం (Payment Mode)" : "6. Choose Payment Mode"}</span>
              </span>
              <span className="text-xs font-bold text-[#0C6266]">
                ₹0 Upfront • Pay After Service
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMode("cash")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === "cash"
                    ? "bg-white border-[#0C6266] ring-2 ring-[#0C6266]/20 shadow-xs"
                    : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">💵 Cash on Delivery</span>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      paymentMode === "cash" ? "border-[#0C6266] bg-[#0C6266]" : "border-slate-300"
                    }`}
                  >
                    {paymentMode === "cash" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="text-[11px] text-[#475559] font-medium leading-relaxed">
                  Pay ₹{totalPrice} in cash directly to your pro after they finish all cleaning tasks.
                </p>
              </button>

              {/* Option 2: Online Payment via Escrow */}
              <button
                type="button"
                onClick={() => setPaymentMode("online")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === "online"
                    ? "bg-white border-[#0C6266] ring-2 ring-[#0C6266]/20 shadow-xs"
                    : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">🛡️ Online Escrow</span>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      paymentMode === "online" ? "border-[#0C6266] bg-[#0C6266]" : "border-slate-300"
                    }`}
                  >
                    {paymentMode === "online" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="text-[11px] text-[#475559] font-medium leading-relaxed">
                  Pay via UPI / Card. Funds held securely in escrow until you verify before/after photos.
                </p>
              </button>
            </div>

            {/* Transparent Pricing Breakdown / Tally Card */}
            <div className="rounded-xl bg-white p-4 border border-[#B6D7D8] space-y-2.5 text-xs shadow-xs">
              <div className="flex items-center justify-between font-bold text-[#0F171A] border-b border-[#F4F8F8] pb-2">
                <span className="font-extrabold text-[#0F171A]">Order Summary &amp; Transparent Tally</span>
                <span className="text-[10px] text-[#16A34A] bg-[#16A34A]/10 font-black px-2 py-0.5 rounded-full">
                  Zero Hidden Fees
                </span>
              </div>

              <div className="flex items-center justify-between text-[#475559]">
                <span>Selected Tasks ({selectedServices.length}):</span>
                <span className="font-bold text-[#0F171A] max-w-[220px] truncate text-right">
                  {selectedServices
                    .map((id) => PRONTO_SERVICES.find((s) => s.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#475559]">
                <span>Visit Duration:</span>
                <span className="font-bold text-[#0F171A]">{selectedDuration} {selectedDuration === 1 ? "Hour" : "Hours"}</span>
              </div>

              <div className="flex items-center justify-between text-[#475559]">
                <span>Flat Hourly Rate:</span>
                <span className="font-bold text-[#0F171A]">₹{hourlyRate}/hr</span>
              </div>

              <div className="flex items-center justify-between text-[#475559] bg-[#F4F8F8] px-2.5 py-1.5 rounded-lg border border-[#DFE8E8]">
                <span>Price Calculation:</span>
                <span className="font-mono font-bold text-[#0F171A]">
                  {selectedDuration} hrs × ₹{hourlyRate} = ₹{totalPrice}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#16A34A] font-semibold pt-1">
                <span>Advance Required Now:</span>
                <span className="font-extrabold">₹0 (Pay only after service)</span>
              </div>

              <div className="pt-2 border-t border-[#DFE8E8] flex items-center justify-between text-sm font-black text-[#0F171A]">
                <span>Total Payable After Service:</span>
                <span className="text-lg text-[#0C6266] font-black">₹{totalPrice}</span>
              </div>

              {bookingType === "recurring" && (
                <p className="text-[10px] text-[#475559] italic text-right">
                  * Billed at ₹{totalPrice} per visit ({recurringFrequency}). Pay after each visit.
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || selectedServices.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-98 text-white p-4 text-sm font-bold transition-all shadow-md shadow-[#E68A00]/25 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Your Booking & OTPs...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>
                  Confirm Booking (₹{totalPrice} • {paymentMode === "online" ? "Online Escrow" : "Cash on Delivery"})
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Google Maps Location Modal */}
      <GoogleMapsLocationModal
        isOpen={isMapsModalOpen}
        onClose={() => setIsMapsModalOpen(false)}
        onSelectLocation={handleLocationFromMap}
        currentLocality={locality}
      />

      {/* Customer Login Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* AI Support Chat Concierge */}
      <OsmidaSupportChat />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
