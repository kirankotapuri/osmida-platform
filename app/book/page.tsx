"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Language } from "@/lib/translations";
import { Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

// Locality options for Nellore
const LOCALITIES = [
  "Nellore Bazar",
  "Kovuru Road",
  "Muthukur Road",
  "Dargamitta",
  "Venkatampeta",
  "Indrapuri",
  "Saraswathi Nagar",
  "Magunta Layout",
  "Pogathota",
  "Vedayapalem",
  "Haranathapuram",
  "Stonehouse Pet",
  "Children's Park Road",
  "Podalakur Road",
  "Ramamurthy Nagar",
  "Other",
];

// Service definitions with plans and localized titles
interface PlanOption {
  id: string;
  en: string;
  te: string;
}

const SERVICE_PLANS: Record<
  "pest-control" | "ac-services" | "home-deep-cleaning",
  {
    nameEn: string;
    nameTe: string;
    plans: PlanOption[];
  }
> = {
  "pest-control": {
    nameEn: "Pest Control",
    nameTe: "పురుగుల నియంత్రణ",
    plans: [
      { id: "general-1bhk", en: "General Pest – 1 BHK", te: "సాధారణ పురుగులు – 1 BHK" },
      { id: "general-2bhk", en: "General Pest – 2 BHK", te: "సాధారణ పురుగులు – 2 BHK" },
      { id: "general-3bhk", en: "General Pest – 3 BHK", te: "సాధారణ పురుగులు – 3 BHK" },
      { id: "bedbug", en: "Bedbug Treatment – Per Room", te: "నిద్రపురుగుల చికిత్స – ప్రతి గది" },
      { id: "termite", en: "Termite Control – Per Sq. Ft.", te: "తెల్లచీమల నియంత్రణ – ప్రతి చ.అ.కు" },
      { id: "other", en: "Other", te: "ఇతర" },
    ],
  },
  "ac-services": {
    nameEn: "AC Services",
    nameTe: "ఏసీ సర్వీస్",
    plans: [
      { id: "foam-jet", en: "AC Foam Jet Service", te: "ఏసీ ఫోమ్ జెట్ సర్వీస్" },
      { id: "repair-diagnosis", en: "AC Repair & Diagnosis", te: "ఏసీ రిపేర్ & డయాగ్నోసిస్" },
      { id: "gas-refill", en: "Gas Top‑Up / Refill", te: "గ్యాస్ టాప్‑అప్ / రీఫిల్" },
      { id: "ac-installation", en: "AC Installation", te: "ఏసీ ఇన్స్టాల్" },
      { id: "other", en: "Other", te: "ఇతర" },
    ],
  },
  "home-deep-cleaning": {
    nameEn: "Home Deep Cleaning",
    nameTe: "ఇంటి డీప్ క్లీనింగ్",
    plans: [
      { id: "1bhk", en: "1 BHK Deep Clean", te: "1 BHK డీప్ క్లీన్" },
      { id: "2bhk", en: "2 BHK Deep Clean", te: "2 BHK డీప్ క్లీన్" },
      { id: "3bhk", en: "3 BHK Deep Clean", te: "3 BHK డీప్ క్లీన్" },
      { id: "kitchen-bathroom", en: "Kitchen / Bathroom Deep Clean", te: "కిచెన్ / బాత్రూమ్ డీప్ క్లీన్" },
      { id: "other", en: "Other", te: "ఇతర" },
    ],
  },
};

const PROPERTY_SIZES_HOME = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK or more",
  "Independent House",
  "Villa / Duplex",
];

const PROPERTY_SIZES_AC = ["1 AC", "2 ACs", "3 ACs", "4 or more ACs"];

const TIME_SLOTS = [
  { id: "morning", en: "Morning (9 AM – 12 PM)", te: "ఉదయం (9 AM – 12 PM)" },
  { id: "afternoon", en: "Afternoon (12 PM – 4 PM)", te: "మధ్యాహ్నం (12 PM – 4 PM)" },
  { id: "evening", en: "Evening (4 PM – 8 PM)", te: "సాయంత్రం (4 PM – 8 PM)" },
  {
    id: "call-to-confirm",
    en: "Call me to confirm",
    te: "నాకు కాల్ చేసి ఖాయం చేయండి",
  },
];

function BookingFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Language state (defaults to "en", switchable)
  const [lang, setLang] = useState<Language>("en");

  // Read URL query parameters
  const initialServiceParam = searchParams.get("service") || "";
  const initialPlanParam = searchParams.get("plan") || "";

  // Normalize service param
  let matchedServiceKey: "" | "pest-control" | "ac-services" | "home-deep-cleaning" = "";
  if (initialServiceParam === "pest-control" || initialServiceParam.includes("pest")) {
    matchedServiceKey = "pest-control";
  } else if (initialServiceParam === "ac-services" || initialServiceParam.includes("ac")) {
    matchedServiceKey = "ac-services";
  } else if (
    initialServiceParam === "home-deep-cleaning" ||
    initialServiceParam.includes("clean")
  ) {
    matchedServiceKey = "home-deep-cleaning";
  }

  // Normalize plan param
  let matchedPlanKey = "";
  if (matchedServiceKey && initialPlanParam) {
    const availablePlans = SERVICE_PLANS[matchedServiceKey].plans;
    const found = availablePlans.find(
      (p) =>
        p.id.toLowerCase() === initialPlanParam.toLowerCase() ||
        initialPlanParam.toLowerCase().includes(p.id.toLowerCase()) ||
        p.id.toLowerCase().includes(initialPlanParam.toLowerCase())
    );
    if (found) {
      matchedPlanKey = found.id;
    }
  }

  // Determine whether URL had pre-selected service/plan
  const hasPreselectedParams = Boolean(matchedServiceKey || matchedPlanKey);

  // Form Field States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("");
  const [service, setService] = useState<"" | "pest-control" | "ac-services" | "home-deep-cleaning">(
    matchedServiceKey
  );
  const [plan, setPlan] = useState(matchedPlanKey);
  const [propertySize, setPropertySize] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredSlot, setPreferredSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Validation & Error States
  interface FormErrors {
    name?: string;
    phone?: string;
    locality?: string;
    service?: string;
    plan?: string;
    propertySize?: string;
    dateTime?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for auto-scrolling to first error
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const localityRef = useRef<HTMLSelectElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const planRef = useRef<HTMLSelectElement>(null);
  const propertySizeRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // When service changes, reset or re-validate plan & property size
  const handleServiceChange = (newService: "" | "pest-control" | "ac-services" | "home-deep-cleaning") => {
    setService(newService);
    setPlan("");
    setPropertySize("");
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: undefined }));
    }
  };

  // Get localized summary label for summary box
  const getSummaryLabel = () => {
    if (!service) return "";
    const servObj = SERVICE_PLANS[service];
    const sName = lang === "te" ? servObj.nameTe : servObj.nameEn;
    const planObj = servObj.plans.find((p) => p.id === plan);
    const pName = planObj ? (lang === "te" ? planObj.te : planObj.en) : "";
    return pName ? `${sName} – ${pName}` : sName;
  };

  // Today's date in YYYY-MM-DD for min attribute
  const todayDateString = new Date().toISOString().split("T")[0];

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Name validation
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name =
        lang === "te"
          ? "దయచేసి మీ పేరును నమోదు చేయండి."
          : "Please enter your name.";
    }

    // 2. Phone validation (10 digits after +91)
    const cleanDigits = phone.replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length !== 10) {
      newErrors.phone =
        lang === "te"
          ? "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి."
          : "Please enter a valid 10‑digit mobile number.";
    }

    // 3. Locality validation
    if (!locality) {
      newErrors.locality =
        lang === "te"
          ? "దయచేసి మీ ప్రాంతాన్ని ఎంచుకోండి."
          : "Please select your locality.";
    }

    // 4. Service validation
    if (!service) {
      newErrors.service =
        lang === "te"
          ? "దయచేసి ఒక సర్వీస్ ఎంచుకోండి."
          : "Please select a service.";
    }

    // 5. Plan validation
    if (!plan) {
      newErrors.plan =
        lang === "te"
          ? "దయచేసి ఒక ప్లాన్ ఎంచుకోండి."
          : "Please select a plan.";
    }

    // 6. Property Size / Number of ACs validation
    if (!propertySize) {
      if (service === "ac-services") {
        newErrors.propertySize =
          lang === "te"
            ? "దయచేసి ఏసీల సంఖ్య ఎంచుకోండి."
            : "Please select number of ACs.";
      } else {
        newErrors.propertySize =
          lang === "te"
            ? "దయచేసి ఇంటి పరిమాణం ఎంచుకోండి."
            : "Please select property size.";
      }
    }

    // 7. Preferred Date & Time Slot validation
    if (!preferredDate || !preferredSlot) {
      newErrors.dateTime =
        lang === "te"
          ? "దయచేసి ఇష్టమైన తేదీ మరియు సమయం ఎంచుకోండి."
          : "Please select a preferred date and time.";
    }

    setErrors(newErrors);

    // Scroll to the first error field smoothly
    if (newErrors.name && nameRef.current) {
      nameRef.current.focus();
      nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.phone && phoneRef.current) {
      phoneRef.current.focus();
      phoneRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.locality && localityRef.current) {
      localityRef.current.focus();
      localityRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.service && serviceRef.current) {
      serviceRef.current.focus();
      serviceRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.plan && planRef.current) {
      planRef.current.focus();
      planRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.propertySize && propertySizeRef.current) {
      propertySizeRef.current.focus();
      propertySizeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (newErrors.dateTime && dateRef.current) {
      dateRef.current.focus();
      dateRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const cleanDigits = phone.replace(/\D/g, "");
    const generatedRef = `OSM-NEL-${Math.floor(1000 + Math.random() * 9000)}`;

    const currentServiceObj = service ? SERVICE_PLANS[service] : null;
    const currentPlanObj = currentServiceObj?.plans.find((p) => p.id === plan);
    const serviceName = currentServiceObj?.nameEn || service;
    const planName = currentPlanObj?.en || plan;

    const timeSlotObj = TIME_SLOTS.find((s) => s.id === preferredSlot);
    const slotLabel = timeSlotObj ? timeSlotObj.en : preferredSlot;

    try {
      const payload = {
        referenceId: generatedRef,
        facilityType:
          propertySize === "Shop / Office" ? "commercial_shop" : "residential",
        selectedService: service === "pest-control" ? "pest-shield" : service,
        locality: locality,
        timeSlot: slotLabel,
        inspectionDate: preferredDate,
        siteAddress: `${locality}, Nellore`,
        contactPerson: name.trim(),
        businessName:
          propertySize === "Shop / Office"
            ? `${name.trim()}'s Office`
            : `${name.trim()}'s Residence`,
        whatsappNumber: cleanDigits,
        contactConsent: true,
        notes: `[Shared Booking Wizard] Service: ${serviceName} | Plan: ${planName} | Size/ACs: ${propertySize} | Date: ${preferredDate} | Slot: ${slotLabel} | Notes: ${
          notes.trim() || "None"
        }`,
        floorArea: propertySize,
      };

      const response = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Whether success or local backend fallback, proceed to confirmation
    } catch (err) {
      console.error("Submission handled:", err);
    } finally {
      // Redirect to Confirmation Page with details
      const queryParams = new URLSearchParams({
        ref: generatedRef,
        service: serviceName,
        plan: planName,
        locality: locality,
        slot: slotLabel,
        date: preferredDate,
      });
      router.push(`/booking-confirmed?${queryParams.toString()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-16">
      {/* 1. FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. TOP BREADCRUMB / TRUST STRIP */}
      <div className="border-b border-[#E5E7EB] bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between text-xs font-bold">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#555555] hover:text-[#1E6FFF] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "హోమ్ పేజీ" : "Home"}</span>
          </Link>
          <span className="text-[#25D366] flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {lang === "te"
                ? "₹0 అడ్వాన్స్ • సురక్షిత బుకింగ్"
                : "₹0 Advance • Pay After Service"}
            </span>
          </span>
        </div>
      </div>

      {/* 3. SECTION 5: FORM CONTAINER & FORM CARD */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex justify-center items-center">
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E5E7EB]/70 p-5 sm:p-7 lg:p-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
          {/* FORM HEADER */}
          <div className="mb-6">
            {/* Title (H2) */}
            <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold text-[#111111] mb-2 leading-tight">
              {lang === "te" ? "మీ సర్వీస్ బుక్ చేయండి" : "Book Your Service"}
            </h2>

            {/* Subtext */}
            <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-normal text-[#555555] mb-3 sm:mb-4 leading-relaxed">
              {lang === "te"
                ? "మీ స్లాట్ ఖాయం చేయడానికి మేము 30 నిమిషాల్లో మీకు కాల్ చేస్తాము."
                : "We’ll call you within 30 minutes to confirm your slot."}
            </p>

            {/* Optional Summary Box (if service / plan pre-selected) */}
            {hasPreselectedParams && service && (
              <div className="bg-[#F0F5FF] border border-[#D6E4FF] rounded-lg sm:rounded-xl p-3 sm:p-3.5 mb-2 text-[14px] sm:text-[15px] text-[#111111] flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#1E6FFF] shrink-0 mt-0.5" />
                <span>
                  {lang === "te"
                    ? `మీరు బుక్ చేస్తున్నారు: ${getSummaryLabel()}`
                    : `You are booking: ${getSummaryLabel()}`}
                </span>
              </div>
            )}
          </div>

          {/* FORM FIELDS */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Field 1 – Name */}
            <div>
              <label
                htmlFor="booking-name"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "పేరు" : "Name"} <span className="text-[#D93025]">*</span>
              </label>
              <input
                ref={nameRef}
                id="booking-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={lang === "te" ? "మీ పూర్తి పేరు" : "Your full name"}
                className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[15px] sm:text-[16px] text-[#111111] placeholder:text-[#9AA0A6] transition-colors duration-150 focus:outline-none ${
                  errors.name
                    ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                    : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                }`}
              />
              {errors.name && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Field 2 – Phone Number */}
            <div>
              <label
                htmlFor="booking-phone"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "ఫోన్ నంబర్" : "Phone Number"}{" "}
                <span className="text-[#D93025]">*</span>
              </label>
              <div
                className={`flex items-center w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border transition-colors duration-150 ${
                  errors.phone
                    ? "border-[#D93025] ring-1 ring-[#D93025]"
                    : "border-[#D1D5DB] focus-within:border-[#1E6FFF] focus-within:ring-1 focus-within:ring-[#1E6FFF]"
                }`}
              >
                <div className="h-full px-3.5 bg-[#F7F8FA] border-r border-[#D1D5DB] flex items-center justify-center text-[#555555] font-semibold text-[14px] sm:text-[15px] rounded-l-lg sm:rounded-l-xl select-none">
                  +91
                </div>
                <input
                  ref={phoneRef}
                  id="booking-phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="9876543210"
                  className="flex-1 h-full px-3.5 sm:px-4 text-[15px] sm:text-[16px] text-[#111111] placeholder:text-[#9AA0A6] bg-transparent focus:outline-none rounded-r-lg sm:rounded-r-xl"
                />
              </div>
              {errors.phone && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Field 3 – Locality */}
            <div>
              <label
                htmlFor="booking-locality"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "ప్రాంతం" : "Locality"}{" "}
                <span className="text-[#D93025]">*</span>
              </label>
              <select
                ref={localityRef}
                id="booking-locality"
                value={locality}
                onChange={(e) => {
                  setLocality(e.target.value);
                  if (errors.locality) setErrors((prev) => ({ ...prev, locality: undefined }));
                }}
                className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[15px] sm:text-[16px] bg-white transition-colors duration-150 focus:outline-none ${
                  !locality ? "text-[#9AA0A6]" : "text-[#111111]"
                } ${
                  errors.locality
                    ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                    : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                }`}
              >
                <option value="">
                  {lang === "te"
                    ? "మీ ప్రాంతం ఎంచుకోండి"
                    : "Select your locality"}
                </option>
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc} className="text-[#111111]">
                    {loc}
                  </option>
                ))}
              </select>
              {errors.locality && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.locality}
                </p>
              )}
            </div>

            {/* Field 4 – Service */}
            <div>
              <label
                htmlFor="booking-service"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "సర్వీస్" : "Service"}{" "}
                <span className="text-[#D93025]">*</span>
              </label>
              <select
                ref={serviceRef}
                id="booking-service"
                value={service}
                onChange={(e) =>
                  handleServiceChange(
                    e.target.value as "" | "pest-control" | "ac-services" | "home-deep-cleaning"
                  )
                }
                className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[15px] sm:text-[16px] bg-white transition-colors duration-150 focus:outline-none ${
                  !service ? "text-[#9AA0A6]" : "text-[#111111]"
                } ${
                  errors.service
                    ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                    : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                }`}
              >
                <option value="">
                  {lang === "te" ? "సర్వీస్ ఎంచుకోండి" : "Select service"}
                </option>
                <option value="pest-control" className="text-[#111111]">
                  Pest Control / పురుగుల నియంత్రణ
                </option>
                <option value="ac-services" className="text-[#111111]">
                  AC Services / ఏసీ సర్వీస్
                </option>
                <option value="home-deep-cleaning" className="text-[#111111]">
                  Home Deep Cleaning / ఇంటి డీప్ క్లీనింగ్
                </option>
              </select>
              {errors.service && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.service}
                </p>
              )}
            </div>

            {/* Field 5 – Plan / Package (Dynamic based on selected service) */}
            <div>
              <label
                htmlFor="booking-plan"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "ప్లాన్" : "Plan"} <span className="text-[#D93025]">*</span>
              </label>
              <select
                ref={planRef}
                id="booking-plan"
                disabled={!service}
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  if (errors.plan) setErrors((prev) => ({ ...prev, plan: undefined }));
                }}
                className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[15px] sm:text-[16px] bg-white transition-colors duration-150 focus:outline-none disabled:bg-[#F7F8FA] disabled:text-[#9AA0A6] disabled:cursor-not-allowed ${
                  !plan ? "text-[#9AA0A6]" : "text-[#111111]"
                } ${
                  errors.plan
                    ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                    : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                }`}
              >
                <option value="">
                  {service
                    ? lang === "te"
                      ? "ప్లాన్ ఎంచుకోండి"
                      : "Select plan"
                    : lang === "te"
                    ? "ముందుగా సర్వీస్ ఎంచుకోండి"
                    : "Select a service first"}
                </option>
                {service &&
                  SERVICE_PLANS[service].plans.map((p) => (
                    <option key={p.id} value={p.id} className="text-[#111111]">
                      {p.en} / {p.te}
                    </option>
                  ))}
              </select>
              {errors.plan && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.plan}
                </p>
              )}
            </div>

            {/* Field 6 – Property Size / Number of ACs (Changes by Service) */}
            <div>
              <label
                htmlFor="booking-size"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {service === "ac-services"
                  ? lang === "te"
                    ? "ఏసీల సంఖ్య"
                    : "Number of ACs"
                  : lang === "te"
                  ? "ఇంటి పరిమాణం"
                  : "Property Size"}{" "}
                <span className="text-[#D93025]">*</span>
              </label>
              <select
                ref={propertySizeRef}
                id="booking-size"
                value={propertySize}
                onChange={(e) => {
                  setPropertySize(e.target.value);
                  if (errors.propertySize)
                    setErrors((prev) => ({ ...prev, propertySize: undefined }));
                }}
                className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[15px] sm:text-[16px] bg-white transition-colors duration-150 focus:outline-none ${
                  !propertySize ? "text-[#9AA0A6]" : "text-[#111111]"
                } ${
                  errors.propertySize
                    ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                    : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                }`}
              >
                <option value="">
                  {service === "ac-services"
                    ? lang === "te"
                      ? "ఏసీల సంఖ్య ఎంచుకోండి"
                      : "Select number of ACs"
                    : lang === "te"
                    ? "ఇంటి పరిమాణం ఎంచుకోండి"
                    : "Select property size"}
                </option>
                {service === "ac-services"
                  ? PROPERTY_SIZES_AC.map((sz) => (
                      <option key={sz} value={sz} className="text-[#111111]">
                        {sz}
                      </option>
                    ))
                  : PROPERTY_SIZES_HOME.map((sz) => (
                      <option key={sz} value={sz} className="text-[#111111]">
                        {sz}
                      </option>
                    ))}
              </select>
              {errors.propertySize && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.propertySize}
                </p>
              )}
            </div>

            {/* Field 7 – Preferred Date & Time */}
            <div>
              <label className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5">
                {lang === "te"
                  ? "ఇష్టమైన తేదీ మరియు సమయం"
                  : "Preferred Date & Time"}{" "}
                <span className="text-[#D93025]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Date Picker */}
                <div>
                  <input
                    ref={dateRef}
                    type="date"
                    min={todayDateString}
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.dateTime)
                        setErrors((prev) => ({ ...prev, dateTime: undefined }));
                    }}
                    className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[14px] sm:text-[15px] text-[#111111] bg-white transition-colors duration-150 focus:outline-none ${
                      errors.dateTime
                        ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                        : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                    }`}
                  />
                </div>

                {/* Time Slot Select */}
                <div>
                  <select
                    value={preferredSlot}
                    onChange={(e) => {
                      setPreferredSlot(e.target.value);
                      if (errors.dateTime)
                        setErrors((prev) => ({ ...prev, dateTime: undefined }));
                    }}
                    className={`w-full h-[48px] sm:h-[52px] rounded-lg sm:rounded-xl border px-3.5 sm:px-4 text-[14px] sm:text-[15px] bg-white transition-colors duration-150 focus:outline-none ${
                      !preferredSlot ? "text-[#9AA0A6]" : "text-[#111111]"
                    } ${
                      errors.dateTime
                        ? "border-[#D93025] focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025]"
                        : "border-[#D1D5DB] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF]"
                    }`}
                  >
                    <option value="">
                      {lang === "te" ? "సమయం ఎంచుకోండి" : "Select time slot"}
                    </option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id} className="text-[#111111]">
                        {lang === "te" ? slot.te : slot.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.dateTime && (
                <p className="text-[12px] sm:text-[13px] text-[#D93025] mt-1.5 animate-in fade-in duration-150">
                  {errors.dateTime}
                </p>
              )}
            </div>

            {/* Field 8 – Notes (Optional) */}
            <div>
              <label
                htmlFor="booking-notes"
                className="block text-[14px] sm:text-[15px] font-semibold text-[#111111] mb-1.5"
              >
                {lang === "te" ? "గమనికలు (ఐచ్ఛికం)" : "Notes (Optional)"}
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  lang === "te"
                    ? "మీ సమస్య గురించి లేదా ఏదైనా ప్రత్యేక అవసరాలు మాకు చెప్పండి."
                    : "Tell us about your problem or any special requirements."
                }
                className="w-full rounded-lg sm:rounded-xl border border-[#D1D5DB] p-3.5 sm:p-4 text-[14px] sm:text-[15px] text-[#111111] placeholder:text-[#9AA0A6] focus:border-[#1E6FFF] focus:ring-1 focus:ring-[#1E6FFF] focus:outline-none transition-colors duration-150"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[52px] sm:h-[56px] rounded-xl bg-[#1E6FFF] hover:bg-[#0F4BD6] text-white font-semibold text-[16px] shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{lang === "te" ? "బుక్ అవుతోంది…" : "Booking…"}</span>
                  </>
                ) : (
                  <span>{lang === "te" ? "తర్వాతి దశకు" : "Continue"}</span>
                )}
              </button>
            </div>

            {/* Small Legal / Trust Text */}
            <div className="pt-2 text-center">
              <p className="text-[12px] sm:text-[13px] text-[#777777] leading-relaxed">
                {lang === "te" ? (
                  <>
                    దీని ద్వారా మీరు మా{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-[#1E6FFF] underline underline-offset-2 hover:text-[#0F4BD6]"
                    >
                      నిబంధనలు
                    </Link>{" "}
                    మరియు{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-[#1E6FFF] underline underline-offset-2 hover:text-[#0F4BD6]"
                    >
                      గోప్యతా విధానానికి
                    </Link>{" "}
                    అంగీకరిస్తున్నారు. మీ వివరాలను ఈ బుకింగ్ గురించి మిమ్మల్ని సంప్రదించడానికి మాత్రమే వాడతాము.
                  </>
                ) : (
                  <>
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-[#1E6FFF] underline underline-offset-2 hover:text-[#0F4BD6]"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-[#1E6FFF] underline underline-offset-2 hover:text-[#0F4BD6]"
                    >
                      Privacy Policy
                    </Link>
                    . We’ll only use your details to contact you about this booking.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center text-sm font-bold text-slate-500">
          Loading booking form...
        </div>
      }
    >
      <BookingFormInner />
    </Suspense>
  );
}
