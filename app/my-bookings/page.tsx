"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProntoHeader } from "@/components/ProntoHeader";
import { Language } from "@/lib/translations";
import {
  Phone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Loader2,
  Calendar,
  MapPin,
  Lock,
  Sparkles,
  ArrowLeft,
  User,
  LogOut,
} from "lucide-react";

export default function MyBookingsPage() {
  const [lang, setLang] = useState<Language>("en");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "dashboard">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [savedPhone, setSavedPhone] = useState("");

  useEffect(() => {
    // Pre-fill phone if previously used
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("osmida_customer_phone");
      if (stored) {
        setPhone(stored);
      }
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, action: "send_otp" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setInfoMsg(data.message || "OTP sent! Enter 1234 to log in.");
      } else {
        setErrorMsg(data.error || "Failed to send OTP. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async (phoneNum: string, code: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNum, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setSavedPhone(phoneNum);
        localStorage.setItem("osmida_customer_phone", phoneNum);
        setStep("dashboard");
      } else {
        setErrorMsg(data.error || "Invalid OTP code.");
      }
    } catch {
      setErrorMsg("Failed to connect to Osmida server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMsg("Please enter the 4-digit OTP.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    fetchBookings(cleanPhone, otp.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("osmida_customer_phone");
    setSavedPhone("");
    setPhone("");
    setOtp("");
    setBookings([]);
    setStep("phone");
  };

  const activeBookings = bookings.filter((b) => b.status !== "completed");
  const pastBookings = bookings.filter((b) => b.status === "completed");

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
          <span>Back to Home</span>
        </Link>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C6266]/10 text-[#0C6266] px-3 py-0.5 text-xs font-bold mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>Customer Portal • Secure OTP Login</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Osmida Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              View active service visits, check Start/End OTPs, and track your Nellore home help pro.
            </p>
          </div>

          {step === "dashboard" && (
            <button
              type="button"
              onClick={handleLogout}
              className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition-all shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
              <span>Sign Out ({savedPhone.slice(-4)})</span>
            </button>
          )}
        </div>

        {/* STEP 1: PHONE LOGIN FORM */}
        {step === "phone" && (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0C6266]/10 text-[#0C6266]">
                <Phone className="h-6 w-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">Enter Your Phone Number</h2>
              <p className="text-xs text-slate-500 font-medium">
                We will verify your 10-digit WhatsApp mobile to load your bookings.
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-semibold">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                  WhatsApp Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="94901 22849"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-12 pr-3.5 text-xs font-bold text-slate-900 focus:border-[#0C6266] focus:outline-hidden focus:ring-1 focus:ring-[#0C6266]/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition-all disabled:opacity-50 shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Get Login OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION FORM */}
        {step === "otp" && (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0C6266]/10 text-[#0C6266]">
                <KeyRound className="h-6 w-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">Enter Verification Code</h2>
              <p className="text-xs text-slate-500 font-medium">
                Sent to +91 {phone}. Enter the 4-digit code sent to your mobile.
              </p>
            </div>

            {infoMsg && (
              <p className="text-xs text-[#0C6266] bg-[#0C6266]/10 border border-[#0C6266]/30 p-2.5 rounded-xl font-semibold">
                {infoMsg}
              </p>
            )}
            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-semibold">
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                  4-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-widest text-lg font-black rounded-xl border border-slate-300 py-2.5 text-slate-900 focus:border-[#0C6266] focus:outline-hidden focus:ring-1 focus:ring-[#0C6266]/20"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Change
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 4}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition-all disabled:opacity-50 shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Open</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: CUSTOMER BOOKINGS DASHBOARD */}
        {step === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Action: New Booking */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div>
                <h3 className="text-sm font-black text-slate-900">Need another apartment service?</h3>
                <p className="text-xs text-slate-500 font-medium">Flat ₹199/hr • 1 visit covers multiple tasks</p>
              </div>
              <Link
                href="/book"
                className="flex items-center gap-1.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 px-4 py-2.5 text-xs font-black transition-all shadow-sm active:scale-95"
              >
                <span>Book New Visit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Active Bookings Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0C6266]" />
                <span>Active Visits ({activeBookings.length})</span>
              </h2>

              {activeBookings.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 border border-slate-200 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-600">No active visits right now.</p>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-1 text-xs font-black text-[#0C6266] hover:underline"
                  >
                    <span>Schedule your first visit</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((b) => (
                    <div
                      key={b.reference_id}
                      className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3 hover:border-[#0C6266]/40 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-[#0C6266] bg-[#0C6266]/10 px-2 py-0.5 rounded-md">
                              {b.reference_id}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                b.status === "in_progress" || b.status === "in-progress"
                                  ? "bg-[#E68A00]/15 text-[#995C00] animate-pulse"
                                  : b.status === "confirmed" || b.status === "assigned"
                                  ? "bg-[#0C6266]/10 text-[#0C6266]"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {b.status.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-xs font-black text-slate-900 pt-1">
                            {b.selected_service || "Home Service"} ({b.duration_hours || 1.5} hrs)
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs font-black text-slate-900">₹{b.total_amount}</p>
                          <span className="text-[10px] font-semibold text-[#0C6266] bg-[#0C6266]/10 px-2 py-0.5 rounded border border-[#0C6266]/20">
                            Escrow Held
                          </span>
                        </div>
                      </div>

                      {/* Dual OTP Row */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-500 block">
                            Start OTP (Arrival)
                          </span>
                          <span className="font-mono text-sm font-black text-[#0C6266]">
                            {b.start_otp || b.otp_start || "1234"}
                          </span>
                          <p className="text-[9px] text-slate-400">Share with pro at door</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-500 block">
                            End OTP (Finish)
                          </span>
                          <span className="font-mono text-sm font-black text-slate-700">
                            {b.end_otp || b.otp_end || "5678"}
                          </span>
                          <p className="text-[9px] text-slate-400">Share only after cleanup</p>
                        </div>
                      </div>

                      {/* Tracking CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{b.apartment_name || b.locality || "Nellore"}</span>
                        </div>
                        <Link
                          href={`/booking/${b.reference_id}`}
                          className="flex items-center gap-1.5 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs"
                        >
                          <span>Open Live Tracker</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Completed Bookings */}
            {pastBookings.length > 0 && (
              <div className="space-y-3 pt-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Past Completed Visits ({pastBookings.length})</span>
                </h2>

                <div className="space-y-2.5">
                  {pastBookings.map((b) => (
                    <div
                      key={b.reference_id}
                      className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700">{b.reference_id}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Completed & Paid
                          </span>
                        </div>
                        <p className="font-bold text-slate-900">
                          {b.selected_service} • ₹{b.total_amount}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(b.created_at || Date.now()).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <Link
                        href={`/booking/${b.reference_id}`}
                        className="rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-1.5 font-bold text-xs"
                      >
                        Receipt & Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
