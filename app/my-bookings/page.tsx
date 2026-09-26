"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProntoHeader } from "@/components/ProntoHeader";
import { ProntoFooter } from "@/components/ProntoFooter";
import { Language } from "@/lib/translations";
import { DEFAULT_APP_SETTINGS } from "@/lib/prontoServices";
import { GoogleMapsLocationModal } from "@/components/GoogleMapsLocationModal";
import { CustomerLoginModal } from "@/components/CustomerLoginModal";
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
  Building2,
  Compass,
  Check,
  Mail,
} from "lucide-react";

export default function MyBookingsPage() {
  const [lang, setLang] = useState<Language>("en");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "dashboard">("phone");
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [savedPhone, setSavedPhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Customer Profile State
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileLocality, setProfileLocality] = useState("Pogathota");
  const [profileApartment, setProfileApartment] = useState("");
  const [profileFlat, setProfileFlat] = useState("");
  const [profileTower, setProfileTower] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileGoogleMapsUrl, setProfileGoogleMapsUrl] = useState<string | null>(null);

  // Profile Save UI State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false);

  const applyProfileData = (prof: any) => {
    if (!prof) return;
    if (prof.name) setProfileName(prof.name);
    if (prof.email) setProfileEmail(prof.email);
    if (prof.avatar) setProfileAvatar(prof.avatar);
    if (prof.phone) {
      setPhone(prof.phone);
      setSavedPhone(prof.phone);
    }
    if (prof.locality) setProfileLocality(prof.locality);
    if (prof.apartmentName) setProfileApartment(prof.apartmentName);
    if (prof.flatNumber) setProfileFlat(prof.flatNumber);
    if (prof.towerBlock) setProfileTower(prof.towerBlock);
    if (prof.address) setProfileAddress(prof.address);
    if (prof.googleMapsUrl) setProfileGoogleMapsUrl(prof.googleMapsUrl);
  };

  useEffect(() => {
    // Check if phone, email, or profile stored
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("tab") === "profile") {
        setActiveTab("profile");
      }

      const storedPhone = localStorage.getItem("osmida_customer_phone");
      const storedEmail = localStorage.getItem("osmida_customer_email");
      const storedName = localStorage.getItem("osmida_customer_name");
      const storedAvatar = localStorage.getItem("osmida_customer_avatar");
      const storedProfile = localStorage.getItem("osmida_customer_profile");

      if (storedAvatar) setProfileAvatar(storedAvatar);
      if (storedName) setProfileName(storedName);
      if (storedEmail) setProfileEmail(storedEmail);

      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          applyProfileData(parsed);
          setStep("dashboard");
        } catch {}
      }

      if (storedPhone || storedEmail) {
        if (storedPhone) {
          setPhone(storedPhone);
          setSavedPhone(storedPhone);
        }
        setStep("dashboard");
        // Auto-fetch profile & bookings with demo code or existing session
        fetchBookings(storedPhone || "", storedEmail || "", "1234", true);
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

  const fetchBookings = async (
    phoneNum: string,
    emailStr: string,
    code: string,
    isSilent = false
  ) => {
    if (!isSilent) setIsLoading(true);
    setErrorMsg("");
    try {
      const payload: Record<string, any> = { otp: code };
      if (phoneNum) payload.phone = phoneNum;
      if (emailStr) payload.email = emailStr;
      if (emailStr && !phoneNum) payload.action = "fetch_by_email";

      const res = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        if (phoneNum) {
          setSavedPhone(phoneNum);
          if (typeof window !== "undefined") {
            localStorage.setItem("osmida_customer_phone", phoneNum);
          }
        }
        if (emailStr && typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_email", emailStr);
        }
        if (data.profile) {
          applyProfileData(data.profile);
          if (typeof window !== "undefined") {
            localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile));
            if (data.profile.name) {
              localStorage.setItem("osmida_customer_name", data.profile.name);
            }
          }
        }
        setStep("dashboard");
      } else if (!isSilent) {
        setErrorMsg(data.error || "Invalid OTP code.");
      }
    } catch {
      if (!isSilent) setErrorMsg("Failed to connect to Osmida server.");
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMsg("Please enter the 4-digit OTP.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    fetchBookings(cleanPhone, profileEmail, otp.trim());
  };

  const handleLoginModalSuccess = (profile: any) => {
    applyProfileData(profile);
    setStep("dashboard");
    if (profile.email) {
      setProfileEmail(profile.email);
      if (typeof window !== "undefined") localStorage.setItem("osmida_customer_email", profile.email);
    }
    if (profile.phone) {
      setPhone(profile.phone);
      setSavedPhone(profile.phone);
      if (typeof window !== "undefined") localStorage.setItem("osmida_customer_phone", profile.phone);
    }
    fetchBookings(profile.phone || "", profile.email || "", "1234", true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveSuccess("");
    setProfileSaveError("");
    setIsSavingProfile(true);

    const cleanPhone = (savedPhone || phone).replace(/\D/g, "").slice(-10);
    const cleanEmail = profileEmail.trim().toLowerCase();
    const payload = {
      name: profileName.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      avatar: profileAvatar || null,
      locality: profileLocality,
      apartmentName: profileApartment.trim(),
      flatNumber: profileFlat.trim(),
      towerBlock: profileTower.trim(),
      address: profileAddress.trim(),
      googleMapsUrl: profileGoogleMapsUrl,
    };

    try {
      const res = await fetch("/api/customer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSaveSuccess("Profile and address saved! When booking, this will autofill in 1 click.");
        if (typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile || payload));
          localStorage.setItem("osmida_customer_name", profileName.trim());
          if (cleanPhone) localStorage.setItem("osmida_customer_phone", cleanPhone);
          if (cleanEmail) localStorage.setItem("osmida_customer_email", cleanEmail);
          if (profileAvatar) localStorage.setItem("osmida_customer_avatar", profileAvatar);
          window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: data.profile || payload }));
        }
      } else {
        setProfileSaveError(data.error || "Failed to save profile.");
      }
    } catch {
      setProfileSaveError("Network connection error. Could not save profile.");
    } finally {
      setIsSavingProfile(false);
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
    if (loc.locality) setProfileLocality(loc.locality);
    if (loc.apartmentName) setProfileApartment(loc.apartmentName);
    if (loc.streetAddress) setProfileAddress(loc.streetAddress);
    if (loc.googleMapsUrl) setProfileGoogleMapsUrl(loc.googleMapsUrl);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("osmida_customer_phone");
      localStorage.removeItem("osmida_customer_email");
      localStorage.removeItem("osmida_customer_name");
      localStorage.removeItem("osmida_customer_avatar");
      localStorage.removeItem("osmida_customer_profile");
      window.dispatchEvent(new CustomEvent("osmida_auth_change"));
    }
    setSavedPhone("");
    setPhone("");
    setProfileEmail("");
    setProfileAvatar("");
    setOtp("");
    setBookings([]);
    setProfileName("");
    setProfileApartment("");
    setProfileFlat("");
    setProfileTower("");
    setProfileAddress("");
    setProfileGoogleMapsUrl(null);
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
          <div className="flex items-center gap-3">
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt={profileName || "User"}
                className="h-12 w-12 rounded-2xl object-cover border-2 border-[#0C6266]/30 shadow-xs shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-[#0C6266] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs">
                {(profileName || profileEmail || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0C6266]/10 text-[#0C6266] px-3 py-0.5 text-xs font-bold mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0C6266]" />
                <span>
                  {profileEmail ? `Google Verified (${profileEmail})` : "Customer Portal • WhatsApp Login"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profileName ? `Welcome back, ${profileName}` : "My Osmida Account"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Check service visits, manage your saved Nellore apartment address, and track home help pros.
              </p>
            </div>
          </div>

          {step === "dashboard" && (
            <button
              type="button"
              onClick={handleLogout}
              className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500" />
              <span>Sign Out ({profileEmail ? profileEmail.split("@")[0] : savedPhone ? savedPhone.slice(-4) : "Account"})</span>
            </button>
          )}
        </div>

        {/* STEP 1: PHONE & GOOGLE LOGIN FORM */}
        {step === "phone" && (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0C6266]/10 text-[#0C6266]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">Sign In to Osmida</h2>
              <p className="text-xs text-slate-500 font-medium">
                Log in to check previous bookings, track assigned helpers, and autofill saved addresses.
              </p>
            </div>

            {/* 1-Click Google Sign-in */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                or sign in with whatsapp
              </span>
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition-all disabled:opacity-50 shadow-sm cursor-pointer"
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
                Sent to +91 {phone}. Enter the 4-digit code (use 1234 for quick login).
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
                  className="w-1/3 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 4}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-black transition-all disabled:opacity-50 shadow-sm cursor-pointer"
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

        {/* STEP 3: CUSTOMER DASHBOARD (TABS) */}
        {step === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Action: New Booking Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div>
                <h3 className="text-sm font-black text-slate-900">Need home cleaning or help today?</h3>
                <p className="text-xs text-slate-500 font-medium">Flat ₹199/hr • Your saved address will autofill</p>
              </div>
              <Link
                href="/book"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 px-4 py-2.5 text-xs font-black transition-all shadow-sm active:scale-95 whitespace-nowrap self-start sm:self-auto"
              >
                <span>Book New Visit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "bookings"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-[#0C6266]" />
                <span>My Visits & Bookings ({bookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-[#0C6266]" />
                <span>Saved Profile & Address</span>
              </button>
            </div>

            {/* TAB 1: BOOKINGS LIST */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
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
                      {activeBookings.map((b) => {
                        const mapsUrl =
                          b.google_maps_url ||
                          (b.cart_items && b.cart_items.google_maps_url) ||
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            (b.site_address || b.apartment_name || "Nellore") + ", Nellore, Andhra Pradesh"
                          )}`;

                        return (
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
                                  {b.selected_service || "Home Service"} ({b.duration_hours || 1.0} hrs)
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-xs font-black text-slate-900">₹{b.total_amount}</p>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                    b.payment_method === "cash"
                                      ? "text-[#E68A00] bg-[#FFF9E6] border-[#E68A00]/30"
                                      : "text-[#0C6266] bg-[#0C6266]/10 border-[#0C6266]/20"
                                  }`}
                                >
                                  {b.payment_method === "cash" ? "Cash on Delivery" : "Escrow Held"}
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

                            {/* Tracking & Navigation CTA */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[220px]">
                                  {b.apartment_name || b.locality || "Nellore"}
                                </span>
                                <a
                                  href={mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View on Google Maps"
                                  className="text-[10px] font-bold text-[#0C6266] underline hover:text-[#094e51] flex items-center gap-0.5"
                                >
                                  <span>Maps</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              </div>

                              <Link
                                href={`/booking/${b.reference_id}`}
                                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
                              >
                                <span>Open Live Tracker</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
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

            {/* TAB 2: SAVED RESIDENTIAL PROFILE & ADDRESS */}
            {activeTab === "profile" && (
              <div className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#0C6266]" />
                      <span>Saved Residential Address & Profile</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      This address is automatically prefilled whenever you book home help on Osmida.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMapsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C6266]/10 hover:bg-[#0C6266]/20 text-[#0C6266] text-xs font-bold transition-all border border-[#0C6266]/30 self-start sm:self-auto cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5 text-[#0C6266]" />
                    <span>📍 Find on Google Maps / GPS</span>
                  </button>
                </div>

                {profileSaveSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{profileSaveSuccess}</span>
                  </div>
                )}

                {profileSaveError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-semibold animate-in fade-in">
                    {profileSaveError}
                  </div>
                )}

                {/* Connected Google Account Banner */}
                {profileEmail && (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0FDF4] border border-emerald-200/80 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {profileAvatar ? (
                        <img
                          src={profileAvatar}
                          alt={profileName || "Google Account"}
                          className="h-10 w-10 rounded-full object-cover border border-emerald-300 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#0C6266] text-white flex items-center justify-center font-black text-sm shrink-0">
                          {(profileName || profileEmail || "G").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-extrabold text-slate-900 text-xs truncate">
                            {profileName || "Google Resident"}
                          </p>
                          <span className="text-[10px] font-black text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                            Google Connected
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-mono truncate mt-0.5">
                          {profileEmail}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100/60 border border-emerald-300 px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified Profile</span>
                    </span>
                  </div>
                )}

                {/* Google Maps Attached Banner */}
                {profileGoogleMapsUrl && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF4F5] border border-[#B6D7D8] text-xs text-[#0C6266] font-semibold">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#0C6266] shrink-0" />
                      <span>Google Maps GPS Pin Attached to Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={profileGoogleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#0C6266] underline hover:text-[#094e51] flex items-center gap-1"
                      >
                        <span>Open Pin</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsMapsModalOpen(true)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#B6D7D8] text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Your Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Venkat Rao"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        WhatsApp Mobile Number*
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="94901 22849"
                          value={savedPhone || phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPhone(val);
                            setSavedPhone(val);
                          }}
                          className="w-full rounded-xl border border-slate-300 pl-11 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0C6266]"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Used for helper arrival updates & OTPs</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address (Gmail)
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-[#0C6266]"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">For digital receipts & password recovery</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nellore Locality*
                      </label>
                      <select
                        value={profileLocality}
                        onChange={(e) => setProfileLocality(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266] bg-white"
                      >
                        {DEFAULT_APP_SETTINGS.service_zones.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Apartment / Gated Community Name*
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sri Sai Residency, Pogathota"
                        value={profileApartment}
                        onChange={(e) => setProfileApartment(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Flat / Door Number*
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 302"
                        value={profileFlat}
                        onChange={(e) => setProfileFlat(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tower / Block (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Block B, 3rd Floor"
                        value={profileTower}
                        onChange={(e) => setProfileTower(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Street / Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Children's Park, Behind Apollo Pharmacy"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#0C6266]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">
                      💡 When you book for yourself, this address is automatically selected. If you book for someone else, you can choose another location without affecting this profile.
                    </p>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 stroke-[3]" />
                          <span>Save Profile & Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Login Modal */}
      <CustomerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginModalSuccess}
      />

      {/* Google Maps Location Modal */}
      <GoogleMapsLocationModal
        isOpen={isMapsModalOpen}
        onClose={() => setIsMapsModalOpen(false)}
        onSelectLocation={handleLocationFromMap}
        currentLocality={profileLocality}
      />

      {/* Pronto Global Footer */}
      <div className="mt-16">
        <ProntoFooter />
      </div>
    </div>
  );
}
