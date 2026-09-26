"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Menu,
  X,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  HelpCircle,
  Phone,
  Calendar,
  ChevronDown,
  Check,
  User,
  LogOut,
} from "lucide-react";
import { CustomerLoginModal } from "./CustomerLoginModal";
import { createClient } from "@supabase/supabase-js";

const NELLORE_LOCALITIES = [
  "Haranathapuram",
  "Magunta Layout",
  "Vedayapalem",
  "Pogathota",
  "Dargamitta",
  "Balaji Nagar",
  "Nellore Central",
];

export function OsmidaHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState("Haranathapuram");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAvatar, setCustomerAvatar] = useState("");

  const syncAuth = () => {
    if (typeof window !== "undefined") {
      const phone = localStorage.getItem("osmida_customer_phone") || "";
      const email = localStorage.getItem("osmida_customer_email") || "";
      const name = localStorage.getItem("osmida_customer_name") || "";
      const avatar = localStorage.getItem("osmida_customer_avatar") || "";
      const profStr = localStorage.getItem("osmida_customer_profile");
      let prof: any = null;
      try {
        if (profStr) prof = JSON.parse(profStr);
      } catch {}

      setCustomerPhone(phone || prof?.phone || "");
      setCustomerEmail(email || prof?.email || "");
      setCustomerName(name || prof?.name || (email ? email.split("@")[0] : ""));
      setCustomerAvatar(avatar || prof?.avatar || "");
    }
  };

  // Check customer login status on mount & listen to auth changes (Local + Supabase OAuth)
  useEffect(() => {
    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("osmida_auth_change", syncAuth);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let authSubscription: any = null;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check active session immediately on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const user = session.user;
            const uEmail = user.email || "";
            const uName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              (uEmail ? uEmail.split("@")[0] : "Resident");
            const uAvatar =
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              "";
            const uPhone = user.phone || user.user_metadata?.phone || "";

            setCustomerEmail(uEmail);
            setCustomerName(uName);
            setCustomerAvatar(uAvatar);
            if (uPhone) setCustomerPhone(uPhone);

            if (typeof window !== "undefined") {
              if (uEmail) localStorage.setItem("osmida_customer_email", uEmail);
              if (uName) localStorage.setItem("osmida_customer_name", uName);
              if (uAvatar) localStorage.setItem("osmida_customer_avatar", uAvatar);
            }
          }
        });

        // Listen for live login / logout events
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") && session?.user) {
            const user = session.user;
            const uEmail = user.email || "";
            const uName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              (uEmail ? uEmail.split("@")[0] : "Resident");
            const uAvatar =
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              "";
            const uPhone = user.phone || user.user_metadata?.phone || "";

            setCustomerEmail(uEmail);
            setCustomerName(uName);
            setCustomerAvatar(uAvatar);
            if (uPhone) setCustomerPhone(uPhone);

            if (typeof window !== "undefined") {
              if (uEmail) localStorage.setItem("osmida_customer_email", uEmail);
              if (uName) localStorage.setItem("osmida_customer_name", uName);
              if (uAvatar) localStorage.setItem("osmida_customer_avatar", uAvatar);
            }
          } else if (event === "SIGNED_OUT") {
            setCustomerEmail("");
            setCustomerName("");
            setCustomerAvatar("");
            setCustomerPhone("");
          }
        });
        authSubscription = data?.subscription;
      } catch (err) {
        console.warn("Supabase auth sync notice:", err);
      }
    }

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("osmida_auth_change", syncAuth);
      authSubscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Signout notice:", err);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("osmida_customer_phone");
      localStorage.removeItem("osmida_customer_email");
      localStorage.removeItem("osmida_customer_name");
      localStorage.removeItem("osmida_customer_avatar");
      localStorage.removeItem("osmida_customer_profile");
      window.dispatchEvent(new CustomEvent("osmida_auth_change"));
    }
    setCustomerPhone("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerAvatar("");
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLoginSuccess = (profile: any) => {
    if (profile?.phone) setCustomerPhone(profile.phone);
    if (profile?.name) setCustomerName(profile.name);
    if (profile?.email) setCustomerEmail(profile.email);
    if (profile?.avatar) setCustomerAvatar(profile.avatar);
    syncAuth();
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E1EBEB] transition-all shadow-xs">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Working Nellore Locality Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 focus:outline-hidden group" aria-label="Osmida Home">
            <span className="text-2xl sm:text-[28px] font-black tracking-tight text-[#0C6266] group-hover:opacity-90 transition-opacity select-none">
              Osmida
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0C6266] bg-[#EBF4F5] border border-[#B6D7D8] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Nellore
            </span>
          </Link>

          {/* Interactive Working Locality Dropdown (Takes minimal space, never pushes nav) */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#0C6266] bg-[#EBF4F5] hover:bg-[#DFEFEF] px-2.5 py-1 rounded-full border border-[#B6D7D8] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              title="Click to select Nellore locality"
            >
              <MapPin className="h-3 w-3 text-[#0C6266] shrink-0" />
              <span className="max-w-[110px] truncate">{selectedLocality}</span>
              <ChevronDown className="h-3 w-3 text-[#0C6266] shrink-0" />
            </button>

            {locationDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLocationDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white p-1.5 shadow-2xl border border-[#DFE8E8] z-40 animate-in fade-in duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#475559] border-b border-[#F4F8F8] mb-1">
                    Select Nellore Locality
                  </div>
                  <div className="space-y-0.5">
                    {NELLORE_LOCALITIES.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocality(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          selectedLocality === loc
                            ? "bg-[#0C6266] text-white"
                            : "text-[#0F171A] hover:bg-[#F4F8F8]"
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocality === loc && (
                          <Check className="w-3.5 h-3.5 text-white shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Zero wrapping with whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-bold text-[#475559]">
          <button
            type="button"
            onClick={() => scrollTo("services-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            Services &amp; Pricing
          </button>
          <button
            type="button"
            onClick={() => scrollTo("how-it-works-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo("guarantee-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            Our Guarantee
          </button>
          <button
            type="button"
            onClick={() => scrollTo("faqs-section")}
            className="hover:text-[#0C6266] transition-colors cursor-pointer whitespace-nowrap py-1"
          >
            FAQs
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Customer Account / Login Pill */}
          {customerPhone || customerEmail || customerName ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-800 transition shadow-2xs cursor-pointer"
              >
                {customerAvatar ? (
                  <img
                    src={customerAvatar}
                    alt={customerName || "Profile"}
                    className="h-5 w-5 rounded-full object-cover shrink-0 border border-[#0C6266]/30"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-[#0C6266] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {(customerName || customerEmail || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[90px] truncate font-bold text-[#0F171A]">
                  {customerName || (customerEmail ? customerEmail.split("@")[0] : `+91 ${customerPhone.slice(-4)}`)}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs space-y-1">
                  <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-slate-100">
                    {customerAvatar ? (
                      <img
                        src={customerAvatar}
                        alt={customerName}
                        className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#0C6266]/20 shadow-2xs"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#0C6266] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {(customerName || customerEmail || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-900 truncate leading-tight">
                        {customerName || "Resident"}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                        {customerEmail || (customerPhone ? `+91 ${customerPhone}` : "Customer")}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/my-bookings"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#0C6266]" />
                    <span>My Bookings &amp; Visits</span>
                  </Link>
                  <Link
                    href="/my-bookings?tab=profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition"
                  >
                    <User className="h-3.5 w-3.5 text-[#0C6266]" />
                    <span>Saved Profile &amp; Address</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition text-left cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0F171A] hover:text-[#0C6266] transition-colors px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#0C6266]/40 bg-white cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 text-[#0C6266]" />
              <span>Login</span>
            </button>
          )}

          {/* Compact on Mobile (Book • ₹199), Full on Desktop */}
          <Link
            href="/book"
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-black transition-all shadow-xs shadow-[#E68A00]/25 whitespace-nowrap"
          >
            <span className="sm:hidden">Book • ₹199</span>
            <span className="hidden sm:inline">Book in 60s (₹199/hr)</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[#0F171A] hover:text-[#0C6266] rounded-xl hover:bg-[#F4F8F8] active:scale-90 transition-all border border-[#DFE8E8]/80 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY & MENU */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 top-14 sm:top-16 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-Down Menu Sheet */}
          <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-[#DFE8E8] shadow-2xl px-4 pt-3.5 pb-6 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden rounded-b-3xl">
            {/* Customer Account / Login Banner on Mobile */}
            {customerPhone || customerEmail || customerName ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0C6266]/10 border border-[#0C6266]/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  {customerAvatar ? (
                    <img
                      src={customerAvatar}
                      alt={customerName || "Profile"}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#0C6266]/30 shadow-2xs"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#0C6266] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {(customerName || customerEmail || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {customerName || "Osmida Resident"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {customerEmail || (customerPhone ? `+91 ${customerPhone}` : "Customer")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-[#0C6266] hover:bg-[#0C6266]/15 px-2 py-1 rounded-lg transition"
                  >
                    Portal
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[11px] font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#0C6266]/30 text-left transition shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[#0C6266]/10 text-[#0C6266] flex items-center justify-center font-bold">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Resident Login</p>
                    <p className="text-[10px] text-slate-500">Access your saved addresses &amp; previous bookings</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#0C6266] group-hover:translate-x-0.5 transition" />
              </button>
            )}

            {/* Quick Location Badge */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#0C6266] bg-[#EBF4F5] px-3 py-1.5 rounded-xl border border-[#B6D7D8]">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>Serving {selectedLocality}, Nellore</span>
              </div>
              <span className="font-extrabold text-[10px] bg-[#0C6266] text-white px-2 py-0.5 rounded-md">
                15–30 Mins
              </span>
            </div>

            {/* Menu Links with Icons */}
            <div className="grid grid-cols-1 gap-1 text-xs font-bold text-[#0F171A]">
              <button
                type="button"
                onClick={() => scrollTo("services-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Services &amp; Pricing</p>
                  <p className="text-[10px] text-[#475559] font-normal">Flat ₹199/hr • 4 Core Services</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("how-it-works-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">How It Works</p>
                  <p className="text-[10px] text-[#475559] font-normal">Dual OTP system • Live tracking</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("guarantee-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Our Launch Guarantee</p>
                  <p className="text-[10px] text-[#475559] font-normal">₹0 Advance • Pay after verification</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => scrollTo("faqs-section")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F4F8F8] text-left transition text-[#475559] hover:text-[#0C6266] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF4F5] text-[#0C6266] flex items-center justify-center shrink-0">
                  <HelpCircle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F171A]">Frequently Asked Questions</p>
                  <p className="text-[10px] text-[#475559] font-normal">Common questions answered</p>
                </div>
              </button>
            </div>

            {/* Track Booking Card */}
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F8F8] border border-[#DFE8E8] hover:border-[#0C6266]/40 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0C6266]/10 text-[#0C6266] flex items-center justify-center font-bold shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F171A] group-hover:text-[#0C6266] transition">
                    Track Active Booking
                  </p>
                  <p className="text-[10px] text-[#475559]">View helper arrival &amp; Before/After photos</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#475559] group-hover:text-[#0C6266] transition shrink-0" />
            </Link>

            {/* Direct WhatsApp Callout */}
            <a
              href="https://wa.me/917676358162"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#EBF4F5] border border-[#B6D7D8] text-xs font-bold text-[#0C6266] hover:bg-[#DFEFEF] transition"
            >
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0C6266] shrink-0" />
                <span>WhatsApp Help: +91 7676358162</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-[#0C6266] text-white px-2 py-0.5 rounded-md shrink-0">
                Chat
              </span>
            </a>

            {/* Primary Action Button */}
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white py-3.5 text-xs font-black transition-all shadow-md shadow-[#E68A00]/25"
            >
              <span>Book House Help in 60s (₹199/hr)</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>
        </>
      )}
    </header>

    {/* CUSTOMER LOGIN MODAL */}
    <CustomerLoginModal
      isOpen={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onLoginSuccess={handleLoginSuccess}
    />
  </>
  );
}

export const ProntoHeader = OsmidaHeader;

