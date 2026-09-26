"use client";

import React, { useState } from "react";
import {
  SERVICES_DATA,
  NELLORE_AREAS,
  PROPERTY_SIZES,
  TIME_SLOTS,
  UI_TEXT,
  Language,
  ServiceDefinition
} from "@/lib/translations";
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  Share2
} from "lucide-react";

interface NelloreBookingFlowProps {
  lang: Language;
  onLanguageChange?: (newLang: Language) => void;
  initialServiceId?: "pest-control" | "ac-services" | "home-cleaning";
  initialSubtypeId?: string;
}

export function NelloreBookingFlow({
  lang,
  onLanguageChange,
  initialServiceId,
  initialSubtypeId
}: NelloreBookingFlowProps) {
  const t = UI_TEXT[lang];

  // Match initial service
  const matchedService = SERVICES_DATA.find((s) => s.id === initialServiceId) || SERVICES_DATA[0];

  // Match initial subtype if provided (e.g. "bedbug", "termite", "cockroach")
  const matchedSubtype = initialSubtypeId
    ? matchedService.subtypes.find(
        (sub) =>
          sub.id.toLowerCase() === initialSubtypeId.toLowerCase() ||
          initialSubtypeId.toLowerCase().includes(sub.id.toLowerCase())
      )?.id || matchedService.subtypes[0]?.id || ""
    : matchedService.subtypes[0]?.id || "";

  // Infer initial property size if specified in plan (e.g. 1bhk, 2bhk)
  const defaultSize = initialSubtypeId && initialSubtypeId.includes("1bhk") ? "1bhk" : "2bhk";

  // Steps: 1=Service, 2=Details, 3=Form, 4=Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(initialServiceId ? 2 : 1);
  const [selectedService, setSelectedService] = useState<ServiceDefinition>(matchedService);
  const [selectedSubtype, setSelectedSubtype] = useState<string>(matchedSubtype);
  const [propertySize, setPropertySize] = useState<string>(defaultSize);
  const [timeSlot, setTimeSlot] = useState<string>("morning");

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState(NELLORE_AREAS[0].en);
  const [notes, setNotes] = useState("");
  const [isQuoteRequest, setIsQuoteRequest] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [referenceId, setReferenceId] = useState("");


  const handleSelectService = (service: ServiceDefinition) => {
    setSelectedService(service);
    setSelectedSubtype(service.subtypes[0]?.id || "");
    setCurrentStep(2);
    setErrorMessage("");
  };

  const handleProceedToForm = (asQuote: boolean = false) => {
    setIsQuoteRequest(asQuote);
    setCurrentStep(3);
    setErrorMessage("");
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage(
        lang === "te"
          ? "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి (ఉదా: 9848012345)"
          : "Please enter a valid 10-digit mobile number (e.g., 9848012345)"
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage(
        lang === "te" ? "దయచేసి మీ పేరు నమోదు చేయండి" : "Please enter your name"
      );
      return;
    }

    setIsSubmitting(true);
    const generatedRef = `OSM-NEL-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const selectedSubObj = selectedService.subtypes.find((st) => st.id === selectedSubtype);
      const chosenSubName = selectedSubObj ? selectedSubObj.labelEn : selectedService.titleEn;

      const payload = {
        referenceId: generatedRef,
        facilityType: propertySize === "commercial" ? "commercial_shop" : "residential",
        selectedService: selectedService.id === "pest-control" ? "pest-shield" : selectedService.id,
        locality: locality,
        timeSlot: timeSlot,
        siteAddress: `${locality}, Nellore`,
        contactPerson: name.trim(),
        businessName: propertySize === "commercial" ? `${name}'s Commercial Site` : `${name}'s Residence`,
        whatsappNumber: cleanPhone,
        contactConsent: true,
        notes: `[Nellore Urban Company Flow] Subtype: ${chosenSubName} | Size: ${propertySize} | Type: ${
          isQuoteRequest ? "Quote/Inspection Request" : "Standard Booking"
        } | User Notes: ${notes || "None"}`,
        mainPestIssue: selectedService.id === "pest-control" ? selectedSubtype : undefined,
        floorArea: propertySize,
        bookingType: isQuoteRequest ? "quote_request" : "standard_booking",
        category: selectedService.id,
      };

      const response = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const resJson = await response.json().catch(() => null);
        throw new Error(resJson?.error || "Booking failed");
      }

      setReferenceId(generatedRef);
      setCurrentStep(4); // Confirmation
    } catch (err: any) {
      console.error("Booking submission handled:", err);
      setReferenceId(generatedRef);
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    const selectedSubObj = selectedService.subtypes.find((st) => st.id === selectedSubtype);
    const subTitle = lang === "te" ? selectedSubObj?.labelTe : selectedSubObj?.labelEn;

    const message = encodeURIComponent(
      lang === "te"
        ? `నమస్కారం ఆస్మిడా! నా బుకింగ్ వివరాలు:\n• రిఫరెన్స్ నంబర్: ${referenceId}\n• సేవ: ${selectedService.titleTe} (${subTitle})\n• ప్రాంతం: ${locality}\n• సమయం: ${timeSlot}\n• పేరు: ${name}\n\nదయచేసి 30 నిమిషాల్లో కాల్ చేసి స్లాట్ ఖాయం చేయండి.`
        : `Namaskaram Osmida! My booking details:\n• Booking Ref: ${referenceId}\n• Service: ${selectedService.titleEn} (${subTitle})\n• Locality: ${locality}, Nellore\n• Slot: ${timeSlot}\n• Name: ${name}\n\nPlease call me back within 30 minutes to confirm.`
    );
    window.open(`https://wa.me/917676358162?text=${message}`, "_blank");
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all">
      {/* Top Header & Progress Stepper */}
      <div className="border-b border-[#E5E7EB] bg-[#F7F8FA] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 1 && currentStep < 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="flex items-center gap-1 text-xs font-bold text-[#555555] hover:text-[#111111] bg-white px-3 py-1.5 rounded-xl border border-[#D1D5DB] transition-all active:scale-[0.97]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.back}</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E6FFF] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-[#1E6FFF]">
                {lang === "te" ? "తక్షణ బుకింగ్ (₹0)" : "Instant Booking (₹0)"}
              </span>
            </div>
          </div>

          {/* Language Toggle */}
          {onLanguageChange && (
            <button
              type="button"
              onClick={() => onLanguageChange(lang === "en" ? "te" : "en")}
              className="flex items-center gap-1.5 rounded-full border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-black text-[#111111] hover:border-[#1E6FFF] hover:text-[#1E6FFF] transition-all shadow-sm active:scale-[0.97]"
            >
              <span>🌐</span>
              <span>{lang === "en" ? "తెలుగు" : "English"}</span>
            </button>
          )}
        </div>

        {/* Step Progress Line */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { num: 1, label: t.step1 },
            { num: 2, label: t.step2 },
            { num: 3, label: t.step3 },
            { num: 4, label: t.step4 }
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-all duration-250 ${
                    isCompleted
                      ? "bg-[#25D366]"
                      : isCurrent
                      ? "bg-[#1E6FFF]"
                      : "bg-[#E5E7EB]"
                  }`}
                />
                <p
                  className={`text-[10px] text-center font-bold transition-colors ${
                    isCurrent
                      ? "text-[#1E6FFF]"
                      : isCompleted
                      ? "text-[#25D366]"
                      : "text-[#999999]"
                  }`}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* BODY CONTENT BY STEP */}
      <div className="p-4 sm:p-6 bg-white">
        {/* ============================================================ */}
        {/* SCREEN 1: CHOOSE SERVICE                                      */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
                {lang === "te" ? "ఈ రోజు మీకు ఏ సేవ కావాలి?" : "What do you need help with today?"}
              </h2>
              <p className="text-xs text-[#555555] mt-1">
                {lang === "te"
                  ? "నెల్లూరు స్థానిక ప్రముఖ నిపుణులు • పారదర్శక ధరలు • 60 సెకన్లలో బుకింగ్"
                  : "Pick a service below to see exact inclusions & book in 60 seconds."}
              </p>
            </div>

            <div className="grid gap-3 pt-2">
              {SERVICES_DATA.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleSelectService(service)}
                  className="group relative flex items-center justify-between p-4 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#1E6FFF] hover:shadow-md transition-all text-left active:scale-[0.97]"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: `${service.colorHex}15` }}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-[#111111] group-hover:text-[#1E6FFF] transition-colors">
                          {lang === "te" ? service.titleTe : service.titleEn}
                        </h3>
                      </div>
                      <p className="text-xs text-[#555555] mt-0.5">
                        {lang === "te" ? service.subTe : service.subEn}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-black text-[#1E6FFF] bg-[#1E6FFF]/10 border border-[#1E6FFF]/20 px-2 py-0.5 rounded-md">
                          {lang === "te" ? service.priceTe : service.priceEn}
                        </span>
                        <span className="text-[10px] text-[#555555] font-semibold hidden xs:inline-block">
                          {lang === "te" ? service.badgeTe : service.badgeEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] group-hover:bg-[#1E6FFF] group-hover:text-white transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Call / WhatsApp Direct Box */}
            <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-4">
              <p className="text-xs font-black text-[#111111] text-center">
                {lang === "te"
                  ? "ఫారమ్ నింపే సమయం లేదా? నేరుగా కాల్ లేదా వాట్సాప్ చేయండి:"
                  : "Prefer to talk or send a voice note? Contact us directly:"}
              </p>
              <div className="mt-3 flex gap-2">
                <a
                  href={`tel:${t.callNumber}`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-3 text-xs font-black text-white shadow-md transition-all active:scale-[0.97]"
                >
                  <Phone className="h-4 w-4 fill-white" />
                  <span>{t.callNow}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(
                      lang === "te"
                        ? "నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో హోమ్ సర్వీస్ గురించి వివరాలు కావాలి. దయచేసి కాల్ చేయండి."
                        : "Namaskaram Osmida! I need home services in Nellore. Please call me back."
                    );
                    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1FA851] py-3 text-xs font-black text-white shadow-md transition-all active:scale-[0.97]"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                  <span>{t.whatsappUs}</span>
                </button>
              </div>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-[#555555]">
              <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <p className="font-bold text-[#111111]">🤝 Established</p>
                <p>{lang === "te" ? "స్థానిక నిపుణులు" : "Local Partners"}</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <p className="font-bold text-[#111111]">🛡️ Warranty</p>
                <p>{lang === "te" ? "సర్వీస్ రక్షణ" : "Terms Apply"}</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <p className="font-bold text-[#111111]">💰 ₹0 Advance</p>
                <p>Pay After Work</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: SERVICE DETAILS & SELECTION                         */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-5">
            {/* Header info badge */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB]">
              <span className="text-3xl">{selectedService.icon}</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#111111]">
                  {lang === "te" ? selectedService.titleTe : selectedService.titleEn}
                </h3>
                <span className="inline-block text-[11px] font-bold text-[#1E6FFF]">
                  {lang === "te" ? selectedService.badgeTe : selectedService.badgeEn}
                </span>
              </div>
            </div>

            {/* Sub-service / Pest issue buttons */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-2">
                {t.selectPestOrIssue}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {selectedService.subtypes.map((sub) => {
                  const isSelected = selectedSubtype === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubtype(sub.id)}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition-all active:scale-[0.97] ${
                        isSelected
                          ? "border-[#1E6FFF] bg-[#F0F6FF] ring-2 ring-[#1E6FFF]/30 shadow-sm"
                          : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB] text-[#555555]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{sub.icon}</span>
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-[#1E6FFF]" />
                        ) : sub.popular ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                            Popular
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs font-black text-[#111111] mt-2 leading-tight">
                        {lang === "te" ? sub.labelTe : sub.labelEn}
                      </p>
                      {sub.descEn && (
                        <p className="text-[10px] text-[#555555] mt-1 line-clamp-1">
                          {lang === "te" ? sub.descTe : sub.descEn}
                        </p>
                      )}
                      <p className="text-[11px] font-black text-[#1E6FFF] mt-1.5">
                        {lang === "te" ? sub.startingPriceTe : sub.startingPriceEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Size Chips */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-2">
                {t.selectSize}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROPERTY_SIZES.map((size) => {
                  const isSelected = propertySize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setPropertySize(size.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black text-center transition-all active:scale-[0.97] ${
                        isSelected
                          ? "border-[#1E6FFF] bg-[#F0F6FF] text-[#1E6FFF] shadow-sm ring-1 ring-[#1E6FFF]/50"
                          : "border-[#E5E7EB] bg-white text-[#555555] hover:border-[#D1D5DB]"
                      }`}
                    >
                      {lang === "te" ? size.labelTe : size.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What's included (4-6 bullet points) */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-4 space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-[#111111]">
                ✓ {t.whatsIncluded}
              </p>
              <ul className="space-y-1.5 text-xs text-[#555555]">
                {(lang === "te" ? selectedService.includedTe : selectedService.includedEn).map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#25D366] shrink-0 mt-0.5" />
                      <span className="text-[#111111]">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Transparent Exclusions */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 text-xs text-[#555555]">
              <p className="font-bold text-[#111111] text-[11px] mb-1">
                ⚠️ {t.whatsExcluded}
              </p>
              <ul className="space-y-1 text-[11px]">
                {(lang === "te" ? selectedService.excludedTe : selectedService.excludedEn).map((ex, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#999999]">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dual Paths: Quick Book vs Request Free Inspection */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleProceedToForm(false)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-4 text-center text-sm font-black text-white transition-all shadow-md active:scale-[0.97]"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t.bookNow}</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToForm(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white hover:bg-[#F7F8FA] py-3 text-center text-xs font-bold text-[#111111] transition-all active:scale-[0.97]"
              >
                <Phone className="h-3.5 w-3.5 text-[#1E6FFF]" />
                <span>{t.requestCall}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: MINIMAL 6-FIELD BOOKING FORM                        */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111111]">
                {t.formHeading}
              </h3>
              <p className="text-xs text-[#555555] mt-0.5">
                {t.formSub}
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Selected Summary Pill */}
            <div className="flex items-center justify-between rounded-xl bg-[#F0F6FF] border border-[#1E6FFF]/20 px-3.5 py-2.5 text-xs">
              <div>
                <p className="font-black text-[#111111]">
                  {lang === "te" ? selectedService.titleTe : selectedService.titleEn}
                </p>
                <p className="text-[11px] text-[#555555]">
                  {selectedService.subtypes.find((s) => s.id === selectedSubtype)?.[
                    lang === "te" ? "labelTe" : "labelEn"
                  ]} • {propertySize.toUpperCase()}
                </p>
              </div>
              <span className="font-bold text-[#1E6FFF] bg-white border border-[#1E6FFF]/30 px-2 py-1 rounded-md">
                {isQuoteRequest ? "Free Inspection" : "Zero Advance"}
              </span>
            </div>

            {/* Field 1: Name */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                1. {t.nameLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-3 text-sm text-[#111111] placeholder-[#999999] focus:border-[#1E6FFF] focus:ring-2 focus:ring-[#1E6FFF]/20 focus:outline-none"
              />
            </div>

            {/* Field 2: Phone Number with Auto +91 */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                2. {t.phoneLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center rounded-xl border border-[#D1D5DB] bg-white overflow-hidden focus-within:border-[#1E6FFF] focus-within:ring-2 focus-within:ring-[#1E6FFF]/20">
                <span className="bg-[#F7F8FA] px-3.5 py-3 text-xs font-black text-[#555555] border-r border-[#E5E7EB]">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-transparent px-3.5 py-3 text-sm text-[#111111] placeholder-[#999999] focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Field 3: Nellore Locality Dropdown */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                3. {t.areaLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-3 text-sm text-[#111111] focus:border-[#1E6FFF] focus:ring-2 focus:ring-[#1E6FFF]/20 focus:outline-none"
                >
                  {NELLORE_AREAS.map((area) => (
                    <option key={area.en} value={area.en}>
                      {area.en} ({area.te})
                    </option>
                  ))}
                </select>
                <MapPin className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-[#1E6FFF]" />
              </div>
            </div>

            {/* Field 4: Preferred Time Slot */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                4. {t.selectSlot}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = timeSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlot(slot.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all active:scale-[0.97] ${
                        isSelected
                          ? "border-[#1E6FFF] bg-[#F0F6FF] text-[#1E6FFF] shadow-sm ring-1 ring-[#1E6FFF]/50"
                          : "border-[#E5E7EB] bg-white text-[#555555] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <span className="text-base">{slot.icon}</span>
                      <p className="text-[10px] font-bold mt-1">
                        {lang === "te" ? slot.labelTe.split(" ")[0] : slot.labelEn.split(" ")[0]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Optional Note */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                5. {t.notesLabel}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-xs text-[#111111] placeholder-[#999999] focus:border-[#1E6FFF] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1E6FFF] hover:bg-[#0F4BD6] py-4 text-center text-sm font-black text-white transition-all shadow-md disabled:opacity-50 active:scale-[0.97]"
              >
                {isSubmitting ? (
                  <span>{t.submitting}</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{t.confirmBooking}</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-[#555555] mt-2">
                🔒 {lang === "te" ? "ముందస్తు చెల్లింపు లేదు • పని పూర్తయి పరిశీలించాకే చెల్లించండి" : "Zero advance payment • Pay only after service & inspection"}
              </p>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* SCREEN 4: CONFIRMATION & SHARE                               */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-5 text-center py-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border-2 border-[#25D366] text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.3)] animate-bounce">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                {t.successTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] mt-1.5 max-w-sm mx-auto">
                {t.successSub}
              </p>
            </div>

            {/* Receipt Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-4 text-left space-y-2.5 text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-[#555555]">{t.refId}:</span>
                <span className="font-mono font-black text-[#1E6FFF] text-sm tracking-wider">{referenceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#555555]">{t.serviceBooked}:</span>
                <span className="font-bold text-[#111111]">{lang === "te" ? selectedService.titleTe : selectedService.titleEn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#555555]">{t.areaBooked}:</span>
                <span className="font-bold text-[#111111]">{locality}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#555555]">{t.slotBooked}:</span>
                <span className="font-bold text-[#111111] capitalize">{timeSlot}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] text-[11px]">
                <span className="text-[#555555]">Payment:</span>
                <span className="font-bold text-[#25D366]">Pay after service via QR / Cash</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={openWhatsAppConfirmation}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1FA851] py-3.5 text-xs font-black text-white transition-all shadow-md active:scale-[0.97]"
              >
                <Share2 className="h-4 w-4" />
                <span>{t.saveOnWhatsApp}</span>
              </button>
              <a
                href={`tel:${t.callNumber}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#D1D5DB] bg-white hover:bg-[#F7F8FA] py-3 text-xs font-bold text-[#111111] transition-all active:scale-[0.97]"
              >
                <Phone className="h-4 w-4 text-[#1E6FFF]" />
                <span>{t.urgentCallText} {t.callDisplay}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setName("");
                setPhone("");
                setNotes("");
              }}
              className="text-xs text-[#555555] hover:text-[#111111] underline pt-1"
            >
              {t.bookAnother}
            </button>

            <div className="pt-2 text-[10px] text-[#999999] border-t border-[#E5E7EB]">
              <p>Osmida Facility Services &bull; {t.localAddress}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
