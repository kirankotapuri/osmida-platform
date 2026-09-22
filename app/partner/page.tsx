"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Power,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Camera,
  IndianRupee,
  Star,
  Wallet,
  User,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  FileCheck,
  Upload,
} from "lucide-react";
import { ServicePartner, PartnerJob, DEFAULT_PARTNERS } from "@/lib/partnerMatching";

export default function PartnerPortalPage() {
  // Auth state
  const [partner, setPartner] = useState<ServicePartner | null>(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("1234");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App state
  const [activeTab, setActiveTab] = useState<"jobs" | "earnings" | "profile">("jobs");
  const [isOnline, setIsOnline] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [offeredJobs, setOfferedJobs] = useState<PartnerJob[]>([]);
  const [activeJob, setActiveJob] = useState<PartnerJob | null>(null);
  const [completedJobs, setCompletedJobs] = useState<PartnerJob[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Action states
  const [startOtpInput, setStartOtpInput] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("osmida_partner_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPartner(parsed);
        setIsOnline(parsed.status !== "offline");
      }
    } catch {}
  }, []);

  // Fetch jobs for partner
  const fetchJobs = useCallback(async (partnerId: string) => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch(`/api/partner/jobs?partnerId=${encodeURIComponent(partnerId)}`);
      const data = await res.json();
      if (data.success) {
        setOfferedJobs(data.offeredJobs || []);
        setActiveJob(data.activeJob || null);
        setCompletedJobs(data.completedJobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  useEffect(() => {
    if (partner) {
      fetchJobs(partner.id);
      const interval = setInterval(() => fetchJobs(partner.id), 10000); // 10s live polling
      return () => clearInterval(interval);
    }
  }, [partner, fetchJobs]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/partner/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone, pin: loginPin }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setPartner(data.partner);
      setIsOnline(data.partner.status !== "offline");
      localStorage.setItem("osmida_partner_session", JSON.stringify(data.partner));
      fetchJobs(data.partner.id);
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick demo login helper
  const handleQuickLogin = (demo: ServicePartner) => {
    setLoginPhone(demo.phone);
    setLoginPin(demo.auth_pin || "1234");
    setPartner(demo);
    setIsOnline(true);
    localStorage.setItem("osmida_partner_session", JSON.stringify(demo));
    fetchJobs(demo.id);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("osmida_partner_session");
    setPartner(null);
    setOfferedJobs([]);
    setActiveJob(null);
  };

  // Toggle Online/Offline
  const handleToggleOnline = async () => {
    if (!partner) return;
    const target = isOnline ? "offline" : "online";
    setIsOnline(!isOnline);

    try {
      await fetch("/api/partner/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId: partner.id, status: target }),
      });
      const updated = { ...partner, status: target };
      setPartner(updated as ServicePartner);
      localStorage.setItem("osmida_partner_session", JSON.stringify(updated));
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Job Execution Action Handler
  const handleJobAction = async (action: "accept" | "decline" | "dispatch" | "start" | "complete", jobId: string) => {
    if (!partner) return;
    setIsActionLoading(true);
    setStatusMessage(null);

    try {
      const payload: any = {
        action,
        jobId,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerPhone: partner.phone,
      };

      if (action === "start") {
        if (!startOtpInput.trim()) {
          throw new Error("Please enter customer's 4-digit start OTP");
        }
        payload.otp = startOtpInput.trim();
      }

      if (action === "complete") {
        payload.paymentMethod = paymentMethod;
        payload.beforePhotoUrl = beforePhoto || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500";
        payload.afterPhotoUrl = afterPhoto || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500";
      }

      const res = await fetch("/api/partner/job-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Action failed");
      }

      setStatusMessage({ type: "success", text: data.message });
      setStartOtpInput("");
      setBeforePhoto(null);
      setAfterPhoto(null);

      // Refresh partner job state
      await fetchJobs(partner.id);

      // Update partner balance if completed
      if (action === "complete") {
        setPartner((prev) => (prev ? { ...prev, payout_balance: prev.payout_balance + (activeJob?.payout_amount || 0) } : null));
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to execute action" });
    } finally {
      setIsActionLoading(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW: LOGIN SCREEN (if not authenticated)
  // -------------------------------------------------------------
  if (!partner) {
    return (
      <main className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#161D2F] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#00D084]/10 border border-[#00D084]/30 px-3 py-1 rounded-full mb-3 text-xs font-semibold text-[#00D084]">
              <Sparkles className="w-3.5 h-3.5" />
              OSMIDA PARTNER NETWORK
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Partner Portal</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Urban Company Style Quick-Dispatch for Nellore Technicians
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Mobile Number (10 Digits)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-medium">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9848011111"
                  className="w-full bg-[#0E131F] border border-white/15 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D084]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D084] tracking-widest text-center"
              />
              <span className="block text-[11px] text-gray-400 mt-1">Default PIN for all technicians is 1234</span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#00D084] hover:bg-[#00b573] text-[#0E131F] font-bold py-3 rounded-xl transition shadow-lg shadow-[#00D084]/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Login to Dispatch Hub"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Immediate Field Testing */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-2.5 text-center">
              Quick Test Login as Verified Nellore Partner:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {DEFAULT_PARTNERS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleQuickLogin(demo)}
                  type="button"
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 text-left flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#00D084]/20 text-[#00D084] flex items-center justify-center font-bold text-xs">
                      {demo.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#00D084] transition">{demo.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {demo.categories.join(", ").toUpperCase()} • {demo.assigned_hub} Hub ({demo.coverage_localities[0]})
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#00D084] flex items-center gap-0.5">
                    Select <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGGED IN PARTNER DASHBOARD
  // -------------------------------------------------------------
  return (
    <main className="min-h-screen bg-[#0A0E17] text-white pb-24">
      {/* 1. TOP STATUS BAR & HEADER */}
      <header className="sticky top-0 z-40 bg-[#121826]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00D084]/20 border border-[#00D084]/30 flex items-center justify-center font-black text-[#00D084] text-sm">
              {partner.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white leading-tight">{partner.name}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                  <Star className="w-2.5 h-2.5 fill-amber-300" /> {partner.rating}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {partner.assigned_hub} Hub • {partner.completed_jobs_count} Jobs Done
              </p>
            </div>
          </div>

          {/* ONLINE / OFFLINE TOGGLE */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                isOnline
                  ? "bg-[#00D084]/20 border-[#00D084] text-[#00D084] shadow-sm shadow-[#00D084]/30"
                  : "bg-gray-800 border-gray-600 text-gray-400"
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${isOnline ? "animate-pulse" : ""}`} />
              {isOnline ? "ONLINE" : "OFFLINE"}
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ONLINE STATUS BANNER */}
      <div className={`px-4 py-2 text-center text-xs font-medium ${isOnline ? "bg-[#00D084]/10 text-[#00D084] border-b border-[#00D084]/20" : "bg-gray-800 text-gray-400 border-b border-gray-700"}`}>
        {isOnline ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-ping" />
            Ready for Quick-Commerce Dispatch in {partner.coverage_localities.slice(0, 3).join(", ")}
          </span>
        ) : (
          "You are currently OFFLINE. Toggle to ONLINE above to receive job alerts."
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
              statusMessage.type === "success"
                ? "bg-[#00D084]/15 border-[#00D084]/30 text-[#00D084]"
                : "bg-red-500/15 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs underline opacity-80">Dismiss</button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: JOBS VIEW (OFFERED + ACTIVE WORK)                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {/* A. NEW INCOMING JOB ALERT (IF ANY) */}
            {offeredJobs.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00D084] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00D084] animate-ping" />
                    Incoming Job Alert ({offeredJobs.length})
                  </span>
                  <span className="text-[11px] text-gray-400">Tap to claim</span>
                </div>

                {offeredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gradient-to-br from-[#1A233A] to-[#121826] border-2 border-[#00D084] rounded-2xl p-4 shadow-xl shadow-[#00D084]/10 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#00D084]/20 text-[#00D084] font-bold text-[11px] uppercase tracking-wide">
                        {job.category.toUpperCase()} SERVICE
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Your Payout</span>
                        <span className="text-lg font-extrabold text-[#00D084]">₹{job.payout_amount}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">{job.service_name}</h3>

                    <div className="bg-black/30 rounded-xl p-3 space-y-1.5 text-xs text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00D084] shrink-0" />
                        <span className="font-semibold text-white">{job.locality}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{job.time_slot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Customer: {job.customer_name}</span>
                      </div>
                    </div>

                    {/* ACCEPT / DECLINE BUTTONS */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleJobAction("decline", job.id)}
                        disabled={isActionLoading}
                        className="w-full bg-white/10 hover:bg-white/15 text-gray-300 font-semibold py-2.5 rounded-xl text-xs transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleJobAction("accept", job.id)}
                        disabled={isActionLoading}
                        className="w-full bg-[#00D084] hover:bg-[#00b573] text-[#0A0E17] font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#00D084]/30"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ACCEPT JOB
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* B. ACTIVE JOB IN EXECUTION (URBAN COMPANY 3-STEP FLOW) */}
            {activeJob ? (
              <div className="bg-[#141B2B] border border-white/15 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      ACTIVE WORK IN PROGRESS
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{activeJob.service_name}</h3>
                    <p className="text-xs text-gray-400">Ref: {activeJob.reference_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">Guaranteed Payout</span>
                    <p className="text-base font-bold text-[#00D084]">₹{activeJob.payout_amount}</p>
                  </div>
                </div>

                {/* Customer Details & Actions */}
                <div className="bg-black/30 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{activeJob.customer_name}</p>
                      <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#00D084]" /> {activeJob.customer_address}
                      </p>
                    </div>
                  </div>

                  {/* 1-Tap Call & 1-Tap Navigate */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <a
                      href={`tel:${activeJob.customer_phone}`}
                      className="bg-white/10 hover:bg-white/15 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#00D084]" />
                      Call Customer
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${activeJob.customer_address}, Nellore`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition border border-blue-500/30"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Google Maps
                    </a>
                  </div>
                </div>

                {/* 3-STEP URBAN COMPANY EXECUTION */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                    Execution Steps (WhatsApp Synced):
                  </span>

                  {/* STEP 1: ON THE WAY */}
                  <div className="border border-white/10 rounded-xl p-3 bg-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeJob.status === "dispatched" || activeJob.status === "in_progress"
                            ? "bg-[#00D084] text-black"
                            : "bg-white/20 text-white"
                        }`}>1</span>
                        Step 1: On The Way
                      </span>
                      {activeJob.status === "dispatched" || activeJob.status === "in_progress" ? (
                        <span className="text-[10px] text-[#00D084] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Dispatched
                        </span>
                      ) : null}
                    </div>

                    {activeJob.status === "accepted" && (
                      <button
                        onClick={() => handleJobAction("dispatch", activeJob.id)}
                        disabled={isActionLoading}
                        className="w-full bg-[#00D084] hover:bg-[#00b573] text-black font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        I am On The Way (Alert Customer)
                      </button>
                    )}
                  </div>

                  {/* STEP 2: START JOB (CUSTOMER OTP VERIFICATION) */}
                  <div className="border border-white/10 rounded-xl p-3 bg-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeJob.status === "in_progress" ? "bg-[#00D084] text-black" : "bg-white/20 text-white"
                        }`}>2</span>
                        Step 2: Start Job (Customer OTP)
                      </span>
                      {activeJob.status === "in_progress" && (
                        <span className="text-[10px] text-[#00D084] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </div>

                    {activeJob.status === "dispatched" && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] text-gray-400">
                          Ask customer for their 4-digit code shown on their WhatsApp / booking screen:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="4-digit OTP"
                            value={startOtpInput}
                            onChange={(e) => setStartOtpInput(e.target.value)}
                            className="bg-black/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-center tracking-widest font-mono text-white focus:outline-none focus:border-[#00D084] flex-1"
                          />
                          <button
                            onClick={() => handleJobAction("start", activeJob.id)}
                            disabled={isActionLoading}
                            className="bg-[#00D084] hover:bg-[#00b573] text-black font-bold px-4 py-1.5 rounded-lg text-xs transition"
                          >
                            Verify & Start
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-500 block">Hint for demo test: {activeJob.start_otp}</span>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: COMPLETE WORK (PHOTOS & PAYMENT) */}
                  <div className="border border-white/10 rounded-xl p-3 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                          3
                        </span>
                        Step 3: Completion & Proof
                      </span>
                    </div>

                    {activeJob.status === "in_progress" && (
                      <div className="space-y-3 pt-1">
                        {/* Photo proof simulation */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border border-dashed border-white/20 rounded-lg p-2.5 text-center bg-black/30">
                            <Camera className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <span className="text-[10px] text-gray-300 block font-medium">Before Photo</span>
                            <span className="text-[9px] text-[#00D084]">Attached</span>
                          </div>
                          <div className="border border-dashed border-white/20 rounded-lg p-2.5 text-center bg-black/30">
                            <Camera className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <span className="text-[10px] text-gray-300 block font-medium">After Photo</span>
                            <span className="text-[9px] text-[#00D084]">Attached</span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="text-[11px] text-gray-400 block mb-1 font-semibold">Payment Collection Mode:</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("cash")}
                              className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                                paymentMethod === "cash"
                                  ? "bg-[#00D084]/20 border-[#00D084] text-[#00D084]"
                                  : "bg-white/5 border-white/10 text-gray-400"
                              }`}
                            >
                              Cash (₹{activeJob.total_amount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("upi")}
                              className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                                paymentMethod === "upi"
                                  ? "bg-[#00D084]/20 border-[#00D084] text-[#00D084]"
                                  : "bg-white/5 border-white/10 text-gray-400"
                              }`}
                            >
                              Customer UPI
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleJobAction("complete", activeJob.id)}
                          disabled={isActionLoading}
                          className="w-full bg-[#00D084] hover:bg-[#00b573] text-black font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#00D084]/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Work Completion
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* If no jobs at all */}
            {offeredJobs.length === 0 && !activeJob && (
              <div className="text-center py-12 px-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-[#00D084]/20 text-[#00D084] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">No Active Jobs Right Now</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                  Keep your status ONLINE. As soon as a customer books in {partner.assigned_hub} Nellore, you will receive an alert.
                </p>
                <button
                  onClick={() => fetchJobs(partner.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-300 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Dispatch Feed
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: EARNINGS & PAYOUTS                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "earnings" && (
          <div className="space-y-4">
            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-br from-[#162138] to-[#0E1524] border border-[#00D084]/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">Available Payout Balance</span>
                <span className="text-xs bg-[#00D084]/20 text-[#00D084] font-bold px-2 py-0.5 rounded">
                  Daily Settlement
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#00D084]">₹{partner.payout_balance}</span>
                <span className="text-xs text-gray-400">INR</span>
              </div>

              <div className="bg-black/40 rounded-xl p-3 text-xs flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#00D084]" />
                  <span className="text-gray-300">Registered UPI ID:</span>
                </div>
                <span className="font-mono font-bold text-white">{partner.upi_id || `${partner.phone}@upi`}</span>
              </div>

              <button
                onClick={() => alert(`Payout request of ₹${partner.payout_balance} initiated to ${partner.upi_id || partner.phone + "@upi"}. Funds will settle within 2 hours.`)}
                className="w-full bg-[#00D084] hover:bg-[#00b573] text-black font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <IndianRupee className="w-4 h-4" />
                Request Instant UPI Transfer
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 block mb-1">Total Jobs Done</span>
                <span className="text-xl font-bold text-white">{partner.completed_jobs_count}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 block mb-1">Partner Share</span>
                <span className="text-xl font-bold text-[#00D084]">70%</span>
              </div>
            </div>

            {/* Completed Job History */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Recently Completed Jobs
              </span>

              {completedJobs.length > 0 ? (
                completedJobs.map((job) => (
                  <div key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{job.service_name}</p>
                      <p className="text-gray-400 text-[11px]">{job.locality} • {job.date}</p>
                    </div>
                    <span className="font-extrabold text-[#00D084] text-sm">+₹{job.payout_amount}</span>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center text-xs text-gray-400">
                  Completed jobs will appear here with your payout breakdown.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PROFILE & COVERAGE                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#00D084]/20 text-[#00D084] font-black flex items-center justify-center text-lg">
                  {partner.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white">{partner.name}</h3>
                  <p className="text-xs text-gray-400">+91 {partner.phone}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#00D084] font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Osmida Certified Partner
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold mb-1">Assigned Dispatch Hub:</span>
                  <span className="inline-block bg-[#00D084]/20 text-[#00D084] font-bold px-2.5 py-1 rounded-lg">
                    {partner.assigned_hub} Nellore Hub
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block font-semibold mb-1">Service Categories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.categories.map((cat) => (
                      <span key={cat} className="bg-white/10 text-gray-200 px-2.5 py-0.5 rounded-full uppercase text-[11px] font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block font-semibold mb-1">Managed Coverage Localities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.coverage_localities.map((loc) => (
                      <span key={loc} className="bg-white/10 text-gray-200 px-2 py-0.5 rounded text-[11px]">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Sign Out of Partner Portal
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM NAVIGATION BAR                                         */}
      {/* ------------------------------------------------------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121826]/95 backdrop-blur-md border-t border-white/10 py-2">
        <div className="max-w-xl mx-auto grid grid-cols-3 text-center">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              activeTab === "jobs" ? "text-[#00D084]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5" />
              {offeredJobs.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#00D084] text-black text-[9px] font-black flex items-center justify-center">
                  {offeredJobs.length}
                </span>
              )}
            </div>
            <span>Live Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              activeTab === "earnings" ? "text-[#00D084]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              activeTab === "profile" ? "text-[#00D084]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
