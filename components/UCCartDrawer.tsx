"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cartContext";
import { Language } from "@/lib/translations";
import { NELLORE_LOCALITIES } from "@/lib/constants";
import { X, Plus, Minus, Trash2, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function UCCartDrawer({ lang }: { lang: Language }) {
  const { items, totalAmount, totalItems, isCartDrawerOpen, setIsCartDrawerOpen, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState<string>("Kailasapuram");
  const [address, setAddress] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("Morning (9:00 AM – 12:00 PM)");
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync selected locality from localStorage when drawer is opened
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLoc = localStorage.getItem("osmida_selected_locality");
      if (savedLoc) {
        setLocality(savedLoc);
      }
    }
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!contactName.trim()) {
      setErrorMsg(lang === "te" ? "దయచేసి మీ పేరు రాయండి" : "Please enter your name");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg(lang === "te" ? "దయచేసి 10 అంకెల మొబైల్ నంబర్ రాయండి" : "Please enter a valid 10-digit phone number");
      return;
    }
    if (!address.trim()) {
      setErrorMsg(lang === "te" ? "దయచేసి మీ ఇంటి అడ్రస్ లేదా వీధి పేరు రాయండి" : "Please enter your street address / house no.");
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsSummary = items
        .map((i) => `${i.titleEn} (x${i.quantity}) - ₹${i.price * i.quantity}`)
        .join(", ");

      const payload = {
        referenceId: `OSM-${Date.now().toString().slice(-6)}`,
        businessName: contactName.trim(),
        contactPerson: contactName.trim(),
        whatsappNumber: cleanPhone,
        locality: locality,
        siteAddress: address.trim(),
        selectedService: itemsSummary,
        facilityType: "Home",
        timeSlot: `${selectedDate}, ${selectedSlot}`,
        inspectionDate: new Date().toISOString().split("T")[0],
        contactConsent: true,
        serviceUrgency: "Standard",
        floorArea: "Standard",
        notes: `Total: ₹${totalAmount} (₹0 Advance Booking via UC Cart)`,
        cartItems: items.map((item) => ({
          id: item.id,
          title: item.titleEn,
          category: item.category,
          subcategory: item.subcategory,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        totalAmount: totalAmount,
        advanceAmount: 0,
        bookingType: "cart_order",
        category: items[0]?.category || "general",
        paymentStatus: "pending",
      };

      const res = await fetch("/api/book-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Even if API returns 503 (storage not configured), we still confirm locally and open WhatsApp dispatch
      const waText = encodeURIComponent(
        `*New Osmida Service Booking (₹0 Advance)*\n\n` +
          `👤 *Customer:* ${contactName}\n` +
          `📞 *Phone:* ${cleanPhone}\n` +
          `📍 *Area:* ${locality}, Nellore\n` +
          `🏠 *Address:* ${address}\n` +
          `🕒 *Slot:* ${selectedDate}, ${selectedSlot}\n\n` +
          `🛠️ *Services Ordered:*\n${items
            .map((i) => `• ${i.titleEn} x${i.quantity} = ₹${i.price * i.quantity}`)
            .join("\n")}\n\n` +
          `💰 *Total Amount:* ₹${totalAmount}\n` +
          `🛡️ *Advance Paid:* ₹0 (Pay after completion)\n\n` +
          `Please confirm arrival in 30 minutes.`
      );

      clearCart();
      setIsCartDrawerOpen(false);

      // Open WhatsApp confirmation coordinator in background and route to confirmation
      window.open(`https://wa.me/917676358162?text=${waText}`, "_blank");
      router.push("/booking-confirmed");
    } catch {
      setIsSubmitting(false);
      setErrorMsg("Network error. Please try again or book via direct call.");
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {lang === "te" ? "మీ కార్ట్" : "Your Cart"} ({totalItems} {totalItems === 1 ? "item" : "items"})
            </h2>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{lang === "te" ? "₹0 ముందస్తు అడ్వాన్స్ • పని చూశాకే చెల్లింపు" : "₹0 Advance • Pay after service inspection"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto divide-y divide-slate-100 py-3 space-y-4 pr-1">
          {/* 1. Item List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-1">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {lang === "te" ? item.titleTe : item.titleEn}
                  </h4>
                  <p className="text-xs font-black text-slate-900 mt-0.5">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-2 py-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-0.5 text-slate-700 hover:text-black active:scale-90"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3 stroke-[3]" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 min-w-[14px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-0.5 text-slate-700 hover:text-black active:scale-90"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                  </button>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* 2. Slot & Date Selector */}
          <div className="pt-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "te" ? "సమయం & తేదీ ఎంచుకోండి" : "Select Slot & Date"}
            </h4>

            {/* Date Pills */}
            <div className="grid grid-cols-3 gap-2">
              {["Today", "Tomorrow", "Day After"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    selectedDate === d
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Slot Pills */}
            <div className="space-y-1.5">
              {[
                "Morning (9:00 AM – 12:00 PM)",
                "Afternoon (12:00 PM – 3:00 PM)",
                "Evening (3:00 PM – 7:00 PM)",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSlot === s
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{s}</span>
                  </div>
                  {selectedSlot === s && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Address & Contact Form */}
          <form onSubmit={handleBooking} className="pt-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === "te" ? "నెల్లూరులో మీ చిరునామా" : "Your Nellore Address"}
            </h4>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === "te" ? "మీ పేరు *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === "te" ? "మొబైల్ నంబర్ *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === "te" ? "ప్రాంతం (Locality) *" : "Locality *"}
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950"
                >
                  {NELLORE_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}, Nellore
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {lang === "te" ? "ఇంటి నం. / వీధి *" : "Door No. / Street *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Main Rd"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950"
                />
              </div>
            </div>

            {/* Bill Summary */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Advance Payable Now</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200 text-sm">
                <span>Pay After Service</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 hover:bg-black py-3.5 px-4 text-center text-sm font-black text-white shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? (lang === "te" ? "నిర్ధారిస్తున్నాము..." : "Confirming...")
                  : (lang === "te" ? "బుకింగ్ నిర్ధారించండి (₹0 అడ్వాన్స్) →" : "Confirm Booking (₹0 Advance) →")}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
