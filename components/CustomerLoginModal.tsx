"use client";

import React, { useState } from "react";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  User,
  KeyRound,
} from "lucide-react";

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: any) => void;
}

export function CustomerLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: CustomerLoginModalProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  if (!isOpen) return null;

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
        setErrorMsg(data.error || "Failed to send verification code. Please try again.");
      }
    } catch {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the 4-digit code.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    setIsLoading(true);

    try {
      const res = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: otp.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        // Save customer phone and profile
        if (typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_phone", cleanPhone);
          if (data.profile) {
            localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile));
            if (data.profile.name) {
              localStorage.setItem("osmida_customer_name", data.profile.name);
            }
          }
        }
        onLoginSuccess(data.profile || { phone: cleanPhone });
        onClose();
      } else {
        setErrorMsg(data.error || "Invalid OTP code. Please try again.");
      }
    } catch {
      setErrorMsg("Failed to connect to Osmida server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0C6266]/10 text-[#0C6266]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Customer Login</h3>
              <p className="text-[10px] text-slate-500 font-medium">Access saved addresses &amp; visits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-semibold">
            {errorMsg}
          </p>
        )}

        {infoMsg && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-semibold">
            {infoMsg}
          </p>
        )}

        {/* STEP 1: Phone Entry */}
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                WhatsApp Phone Number
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
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-12 pr-3 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#0C6266] bg-white"
                  autoFocus
                  required
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              We will send a 4-digit verification code to load your saved home address and bookings.
            </p>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition shadow-sm disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Send Login Code</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Enter 4-Digit Code sent to +91 {phone}
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-widest text-lg font-black rounded-xl border border-slate-300 py-2.5 text-slate-900 focus:outline-hidden focus:border-[#0C6266] bg-white"
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
                className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition shadow-sm disabled:opacity-50 active:scale-98"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Enter</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-slate-100 pt-3 text-center">
          <span className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Secure Nellore Resident Authentication</span>
          </span>
        </div>
      </div>
    </div>
  );
}
