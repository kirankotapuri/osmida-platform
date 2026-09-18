"use client";

import React, { useState } from "react";
import { NELLORE_LOCALITIES } from "@/lib/constants";

export function BookingWizard({ initialService = "kitchen-deep-clean" }: { initialService?: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [facilityType, setFacilityType] = useState("restaurant");
  const [selectedService, setSelectedService] = useState(initialService);
  const [mainPestIssue, setMainPestIssue] = useState("not_sure");
  const [pestPremisesType, setPestPremisesType] = useState("restaurant_cafe");
  const [approximateSize, setApproximateSize] = useState("not_sure");
  const [kitchenDetails, setKitchenDetails] = useState({ burners: "", hood: "yes", filters: "", size: "", operational: "yes", workTime: "after_closing" });
  const [washroomDetails, setWashroomDetails] = useState({ units: "", scaling: "moderate", odour: "not_sure", water: "yes", inUse: "no", damage: "" });
  const [pestDetails, setPestDetails] = useState({ seenWhere: "", foodStorage: "not_sure", lastTreatment: "", businessHours: "" });
  const [acDetails, setAcDetails] = useState({ serviceType: "AC Servicing", acType: "split", tonnage: "not_sure", numberOfAc: "1", issue: "", source: "" });
  const [locality, setLocality] = useState<string>(NELLORE_LOCALITIES[0]);
  const [timeSlot, setTimeSlot] = useState("afternoon_downtime");
  const [inspectionDate, setInspectionDate] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [serviceUrgency, setServiceUrgency] = useState("within_week");
  const [floorArea, setFloorArea] = useState("");
  const [notes, setNotes] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isPestBooking = selectedService === "pest-shield";
  const isAcBooking = selectedService === "ac-services";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp number (e.g., 9848012345)");
      return;
    }

    if (!businessName.trim()) {
      setErrorMessage("Please enter your business or establishment name");
      return;
    }

    if (!contactConsent) {
      setErrorMessage("Please confirm that Osmida may contact you about this request");
      return;
    }

    setIsSubmitting(true);
    const ref = `OSM-NEL-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const response = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: ref,
          facilityType,
          selectedService,
          locality,
          timeSlot,
          inspectionDate,
          siteAddress,
          contactPerson,
          serviceUrgency,
          floorArea,
          notes,
          contactConsent,
          mainPestIssue: isPestBooking ? mainPestIssue : undefined,
          pestPremisesType: isPestBooking ? pestPremisesType : undefined,
          approximateSize: isPestBooking ? approximateSize : undefined,
          pestDetails: isPestBooking ? pestDetails : undefined,
          kitchenDetails: selectedService === "kitchen-deep-clean" ? kitchenDetails : undefined,
          washroomDetails: selectedService === "washroom-sanitation" ? washroomDetails : undefined,
          acDetails: isAcBooking ? acDetails : undefined,
          bookingType: "inspection",
          category: isAcBooking ? "ac" : isPestBooking ? "pest" : "cleaning",
          businessName,
          whatsappNumber: cleanNumber,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Booking submission failed");
      }
      setReferenceId(ref);
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking submission error:", error);
      setErrorMessage(error instanceof Error ? error.message : "We could not save your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-[#0D1117] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-3xl text-emerald-400">✓</span>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-white">Inspection Booked Successfully!</h3>
        <p className="mt-2 text-sm text-slate-300">
          We have logged your request for <strong className="text-white">{businessName}</strong> ({locality}, Nellore).
        </p>
        <div className="my-5 inline-block rounded-xl border border-white/10 bg-black/50 px-4 py-2">
          <p className="text-xs text-slate-400">Your Booking Reference</p>
          <p className="text-lg font-mono font-bold text-emerald-400">{referenceId}</p>
        </div>
        <p className="text-xs text-slate-400">
          Our supervisor will confirm your arrival slot via WhatsApp. For urgent assistance, call <strong className="text-white">+91 7676358162</strong>.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setStep(1);
          }}
          className="mt-6 text-xs text-slate-400 underline hover:text-white"
        >
          Book another inspection
        </button>
      </div>
    );
  }

  return (
    <div id="booking-wizard" className="rounded-3xl border border-white/15 bg-[#0D1117] p-6 sm:p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Scheduled Service Windows
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">Book Free 10-Min Site Inspection</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center ${step >= 1 ? "bg-white text-black" : "bg-white/10"}`}>1</span>
          <span className="text-white/20">-</span>
          <span className={`h-6 w-6 rounded-full flex items-center justify-center ${step >= 2 ? "bg-white text-black" : "bg-white/10"}`}>2</span>
          <span className="text-white/20">-</span>
          <span className={`h-6 w-6 rounded-full flex items-center justify-center ${step === 3 ? "bg-white text-black" : "bg-white/10"}`}>3</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {errorMessage}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              1. Select Your Establishment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "restaurant", label: "Restaurant / Cafe", icon: "🍳" },
                { id: "clinic", label: "Clinic / Diagnostic", icon: "🏥" },
                { id: "gym", label: "Gym / Fitness", icon: "🏋️" },
                { id: "office", label: "Commercial Office", icon: "🏢" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFacilityType(item.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition ${
                    facilityType === item.id
                      ? "border-emerald-400 bg-emerald-500/10 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/30"
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Preferred inspection date</label>
            <input type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              2. Select Required Service Package
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "kitchen-deep-clean",
                  title: "Osmida Restaurant Hygiene Reset",
                  price: "From ₹3,499 (Or Free Inspection First)",
                  badge: "Popular"
                },
                {
                  id: "washroom-sanitation",
                  title: "Commercial Washroom Deep Cleaning & Descaling",
                  price: "From ₹1,499 (Or Free Inspection First)",
                  badge: "High Demand"
                },
                {
                  id: "pest-shield",
                  title: "Commercial Pest Management Programme",
                  price: "Free Site Inspection",
                  badge: "Inspection Required"
                },
                {
                  id: "ac-services",
                  title: "AC Services",
                  price: "Estimate after diagnosis",
                  badge: "Coming Soon"
                },
                {
                  id: "free-audit",
                  title: "Free Site Inspection & Written Quotation",
                  price: "₹0 Free Inspection; scope and price confirmed after assessment",
                  badge: "Recommended"
                }
              ].map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    selectedService === svc.id
                      ? "border-emerald-400 bg-emerald-500/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/30"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{svc.title}</p>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-emerald-400 font-semibold">
                        {svc.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{svc.price}</p>
                  </div>
                  <input
                    type="radio"
                    checked={selectedService === svc.id}
                    onChange={() => setSelectedService(svc.id)}
                    className="accent-emerald-400 h-4 w-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {isPestBooking && (
            <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pest Assessment Details</p>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Main pest issue</label>
                <select value={mainPestIssue} onChange={(e) => setMainPestIssue(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                  <option value="cockroaches">Cockroaches</option>
                  <option value="rats_rodents">Rats / rodents</option>
                  <option value="flies_mosquitoes">Flies / mosquitoes</option>
                  <option value="ants">Ants</option>
                  <option value="bed_bugs">Bed bugs</option>
                  <option value="termites">Termites</option>
                  <option value="general_inspection">General inspection</option>
                  <option value="not_sure">Not sure</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Premises type</label>
                <select value={pestPremisesType} onChange={(e) => setPestPremisesType(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400">
                  <option value="restaurant_cafe">Restaurant / cafe</option>
                  <option value="clinic_diagnostic">Clinic / diagnostic centre</option>
                  <option value="gym_fitness">Gym / fitness centre</option>
                  <option value="office_shop">Office / shop</option>
                  <option value="apartment_warehouse">Apartment / warehouse</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Approximate size</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["small", "medium", "large", "not_sure"].map((size) => (
                    <button key={size} type="button" onClick={() => setApproximateSize(size)} className={`rounded-xl border px-3 py-2.5 text-xs capitalize transition ${approximateSize === size ? "border-emerald-400 bg-emerald-500/10 text-white font-bold" : "border-white/10 text-slate-300 hover:border-white/30"}`}>
                      {size.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <input value={pestDetails.seenWhere} onChange={(e) => setPestDetails({ ...pestDetails, seenWhere: e.target.value })} placeholder="Where was the pest seen?" className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={pestDetails.foodStorage} onChange={(e) => setPestDetails({ ...pestDetails, foodStorage: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="yes">Food-storage/kitchen involved</option><option value="no">Food-storage/kitchen not involved</option><option value="not_sure">Not sure</option></select>
                <input value={pestDetails.lastTreatment} onChange={(e) => setPestDetails({ ...pestDetails, lastTreatment: e.target.value })} placeholder="Last pest treatment, if any" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <input value={pestDetails.businessHours} onChange={(e) => setPestDetails({ ...pestDetails, businessHours: e.target.value })} placeholder="Current business hours" className="sm:col-span-2 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
              </div>
            </div>
          )}

          {selectedService === "kitchen-deep-clean" && (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Kitchen Details</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={kitchenDetails.burners} onChange={(e) => setKitchenDetails({ ...kitchenDetails, burners: e.target.value })} placeholder="Number of burners" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <input value={kitchenDetails.filters} onChange={(e) => setKitchenDetails({ ...kitchenDetails, filters: e.target.value })} placeholder="Number of exhaust filters" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <input value={kitchenDetails.size} onChange={(e) => setKitchenDetails({ ...kitchenDetails, size: e.target.value })} placeholder="Approximate kitchen size" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <select value={kitchenDetails.hood} onChange={(e) => setKitchenDetails({ ...kitchenDetails, hood: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="yes">Exhaust hood/chimney present</option><option value="no">No exhaust hood/chimney</option><option value="not_sure">Not sure</option></select>
                <select value={kitchenDetails.operational} onChange={(e) => setKitchenDetails({ ...kitchenDetails, operational: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="yes">Kitchen currently operational</option><option value="no">Kitchen currently closed</option></select>
                <select value={kitchenDetails.workTime} onChange={(e) => setKitchenDetails({ ...kitchenDetails, workTime: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="after_closing">Preferred work time: after closing</option><option value="morning">Preferred work time: morning</option><option value="other">Preferred work time: other</option></select>
              </div>
            </div>
          )}

          {selectedService === "washroom-sanitation" && (
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Washroom Details</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={washroomDetails.units} onChange={(e) => setWashroomDetails({ ...washroomDetails, units: e.target.value })} placeholder="Number of toilets/urinals" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <select value={washroomDetails.scaling} onChange={(e) => setWashroomDetails({ ...washroomDetails, scaling: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="low">Hard-water scaling: low</option><option value="moderate">Hard-water scaling: moderate</option><option value="severe">Hard-water scaling: severe</option><option value="not_sure">Scaling: not sure</option></select>
                <select value={washroomDetails.odour} onChange={(e) => setWashroomDetails({ ...washroomDetails, odour: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="yes">Odour issue present</option><option value="no">No known odour issue</option><option value="not_sure">Not sure</option></select>
                <select value={washroomDetails.water} onChange={(e) => setWashroomDetails({ ...washroomDetails, water: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="yes">Water supply available</option><option value="no">Water supply unavailable</option><option value="not_sure">Not sure</option></select>
                <select value={washroomDetails.inUse} onChange={(e) => setWashroomDetails({ ...washroomDetails, inUse: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="no">Area currently not in use</option><option value="yes">Area currently in use</option></select>
                <input value={washroomDetails.damage} onChange={(e) => setWashroomDetails({ ...washroomDetails, damage: e.target.value })} placeholder="Damaged tiles, fixtures, or plumbing?" className="sm:col-span-2 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
              </div>
            </div>
          )}

          {isAcBooking && (
            <div className="space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">AC Service Details</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={acDetails.serviceType} onChange={(e) => setAcDetails({ ...acDetails, serviceType: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option>AC Installation</option><option>AC Repair & Troubleshooting</option><option>AC Servicing</option><option>AC AMC</option></select>
                <select value={acDetails.acType} onChange={(e) => setAcDetails({ ...acDetails, acType: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="split">Split AC</option><option value="window">Window AC</option><option value="cassette">Cassette AC</option><option value="not_sure">Do not know</option></select>
                <select value={acDetails.tonnage} onChange={(e) => setAcDetails({ ...acDetails, tonnage: e.target.value })} className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="1_ton">1 ton</option><option value="1_5_ton">1.5 ton</option><option value="2_ton">2 ton</option><option value="not_sure">Do not know</option></select>
                <input value={acDetails.numberOfAc} onChange={(e) => setAcDetails({ ...acDetails, numberOfAc: e.target.value })} placeholder="Number of ACs" className="rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <input value={acDetails.issue} onChange={(e) => setAcDetails({ ...acDetails, issue: e.target.value })} placeholder="Issue or requirement" className="sm:col-span-2 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
                <input value={acDetails.source} onChange={(e) => setAcDetails({ ...acDetails, source: e.target.value })} placeholder="How did you hear about us? (optional)" className="sm:col-span-2 rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-white py-3.5 text-sm font-bold text-black transition hover:bg-slate-200"
          >
            Next: Choose Location & Time Slot
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Locality in Nellore
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
            >
              {NELLORE_LOCALITIES.map((loc) => (
                <option key={loc} value={loc} className="bg-[#0D1117]">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {isPestBooking ? "Preferred inspection time" : "Select Preferred Inspection Time Slot"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: "morning", label: "Morning Slot", time: "9:00 AM - 12:00 PM" },
                { id: "afternoon_downtime", label: "Post-Lunch Break", time: "3:00 PM - 5:30 PM" },
                { id: "night_closing", label: isPestBooking ? "Evening / After Business Hours" : "Closing / Night", time: "9:30 PM - 11:30 PM" },
              ].map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setTimeSlot(slot.id)}
                  className={`rounded-2xl border p-3.5 text-left transition ${
                    timeSlot === slot.id
                      ? "border-emerald-400 bg-emerald-500/10 text-white font-bold"
                      : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/30"
                  }`}
                >
                  <p className="text-xs font-bold text-white">{slot.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 rounded-2xl border border-white/20 py-3.5 text-xs font-semibold text-white hover:bg-white/5"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-2/3 rounded-2xl bg-white py-3.5 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              Next: Contact Details
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Business / Establishment Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Hotel Amaravathi / Dr. Rao Clinic"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Contact Person</label>
            <input type="text" required placeholder="Your name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Exact site address or area</label>
            <input type="text" required placeholder="Building, street, landmark" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              WhatsApp Number (For Instant Confirmation)
            </label>
            <div className="flex items-center rounded-2xl border border-white/15 bg-black/60 px-4 py-3 focus-within:border-emerald-400">
              <span className="text-sm font-semibold text-slate-400 mr-2">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9848012345"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Approximate floor area or units</label>
              <input type="text" placeholder="e.g., 800 sq ft / 4 rooms" value={floorArea} onChange={(e) => setFloorArea(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Service urgency</label>
              <select value={serviceUrgency} onChange={(e) => setServiceUrgency(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"><option value="urgent">Urgent</option><option value="within_week">Within a week</option><option value="planned">Planned / flexible</option></select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Notes about grease, pests, odour, stains, or other issues</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Tell us what you would like inspected" className="w-full resize-none rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-400">
            <input type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} className="mt-0.5 accent-emerald-400" />
            <span>I agree that Osmida may contact me regarding this inspection request and quotation.</span>
          </label>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-400">
            ✓ Free inspection • No advance payment required • Written scope and quotation after assessment
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 rounded-2xl border border-white/20 py-3.5 text-xs font-semibold text-white hover:bg-white/5"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 rounded-2xl bg-emerald-400 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? "Booking Inspection..." : "Confirm Free Inspection (₹0)"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}