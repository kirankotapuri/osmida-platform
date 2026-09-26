"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
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
  Volume2,
  Bell,
  Info,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { ServicePartner, PartnerJob, DEFAULT_PARTNERS } from "@/lib/partnerMatching";

export default function PartnerPortalPage() {
  // Auth state
  const [partner, setPartner] = useState<ServicePartner | null>(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPin, setLoginPin] = useState("");
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
  const [endOtpInput, setEndOtpInput] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");
  const [qrData, setQrData] = useState<{ qrCodeUrl: string; paymentLink: string; amount: number } | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [completedJobModal, setCompletedJobModal] = useState<{
    job: PartnerJob;
    payoutAmount: number;
    platformFee: number;
    paymentMode: "cash" | "upi";
    qrData?: { qrCodeUrl: string; paymentLink: string; amount: number } | null;
  } | null>(null);

  // Registration states (Screen 1: Worker Registration)
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regAadhaarUrl, setRegAadhaarUrl] = useState<string | null>(null);
  const [regSelfieUrl, setRegSelfieUrl] = useState<string | null>(null);
  const [regUpi, setRegUpi] = useState("");
  const [regAccount, setRegAccount] = useState("");
  const [regIfsc, setRegIfsc] = useState("");
  const [regSkills, setRegSkills] = useState<string[]>([
    "Bathroom Cleaning",
    "Kitchen Cleaning",
    "Dishwashing",
    "General House Help",
  ]);

  // Load saved session on mount and inject worker-specific PWA manifest
  useEffect(() => {
    try {
      // Ensure worker app has its own distinct manifest and icon on home screen
      let manifestLink = document.querySelector("link[data-app='partner-manifest']") as HTMLLinkElement | null;
      if (!manifestLink) {
        manifestLink = document.createElement("link");
        manifestLink.rel = "manifest";
        manifestLink.setAttribute("data-app", "partner-manifest");
        manifestLink.href = "/worker-manifest.json";
        document.head.appendChild(manifestLink);
      }
      document.title = "Osmida Partner | Nellore Dispatch Portal";

      const saved = localStorage.getItem("osmida_partner_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPartner(parsed);
        setIsOnline(parsed.status !== "offline");
      }
    } catch {}
  }, []);

  const prevJobIdsRef = useRef<Set<string>>(new Set());
  const isInitialJobLoadRef = useRef<boolean>(true);
  const [buzzerPlaying, setBuzzerPlaying] = useState(false);

  // Synthesize loud dispatch alert chime via Web Audio API + vibration
  const playJobAlertBuzzer = useCallback(() => {
    try {
      setBuzzerPlaying(true);
      setTimeout(() => setBuzzerPlaying(false), 1400);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Urgent dual-tone siren sequence: 880Hz & 1200Hz bursts
      const toneSequence = [
        { f1: 880, f2: 1200, start: 0, dur: 0.16 },
        { f1: 960, f2: 1320, start: 0.2, dur: 0.16 },
        { f1: 880, f2: 1200, start: 0.42, dur: 0.2 },
        { f1: 1040, f2: 1400, start: 0.7, dur: 0.35 },
      ];

      toneSequence.forEach(({ f1, f2, start, dur }) => {
        const startTime = ctx.currentTime + start;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(f1, startTime);

        osc2.type = "square";
        osc2.frequency.setValueAtTime(f2, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + dur);
        osc2.stop(startTime + dur);
      });

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([400, 150, 400, 150, 600]);
      }
    } catch (err) {
      console.warn("Audio buzzer dispatch error:", err);
    }
  }, []);

  // Fetch jobs for partner
  const fetchJobs = useCallback(async (partnerId: string) => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch(`/api/partner/jobs?partnerId=${encodeURIComponent(partnerId)}`);
      const data = await res.json();
      if (data.success) {
        const newOffered = data.offeredJobs || [];
        setOfferedJobs(newOffered);
        setActiveJob(data.activeJob || null);
        setCompletedJobs(data.completedJobs || []);

        // Detect newly broadcast jobs for foreground alert buzzer
        const currentIds = new Set<string>(newOffered.map((j: PartnerJob) => String(j.id)));
        if (!isInitialJobLoadRef.current) {
          const hasNewJob = newOffered.some((j: PartnerJob) => !prevJobIdsRef.current.has(j.id));
          if (hasNewJob) {
            playJobAlertBuzzer();
            setStatusMessage({
              type: "success",
              text: "🚨 NEW JOB ALERT! A customer booking just matched your hub. Accept below!",
            });
          }
        } else {
          isInitialJobLoadRef.current = false;
        }
        prevJobIdsRef.current = currentIds;
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [playJobAlertBuzzer]);

  useEffect(() => {
    if (partner) {
      fetchJobs(partner.id);
      const interval = setInterval(() => fetchJobs(partner.id), 4000); // 4s live polling for instant dispatch
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

  // Register worker handler (Screen 1: Name, Phone, Aadhaar, Selfie, Bank/UPI, Skill checkboxes)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);

    const cleanPhone = regPhone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setAuthError("Please enter a valid 10-digit mobile number");
      setIsLoggingIn(false);
      return;
    }

    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          phone: cleanPhone,
          aadhaarNumber: regAadhaar.trim(),
          aadhaarUrl: regAadhaarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
          selfieUrl: regSelfieUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          upiId: regUpi.trim(),
          bankAccountNo: regAccount.trim(),
          bankIfsc: regIfsc.trim(),
          skills: regSkills,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      setPartner(data.partner);
      setIsOnline(true);
      localStorage.setItem("osmida_partner_session", JSON.stringify(data.partner));
      fetchJobs(data.partner.id);
    } catch (err: any) {
      setAuthError(err.message || "Registration failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick partner selection helper
  const handleQuickLogin = (demo: ServicePartner) => {
    setLoginPhone(demo.phone);
    setLoginPin("");
    setAuthError("");
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

  const [skipPhotos, setSkipPhotos] = useState(false);

  // Job Execution Action Handler
  const handleJobAction = async (action: "accept" | "decline" | "dispatch" | "start" | "complete" | "add_time", jobId: string) => {
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

      if (action === "add_time") {
        payload.extraMinutes = 30;
      }

      if (action === "complete") {
        // Enforce mandatory Before and After photos unless skipped due to camera error
        if (!skipPhotos && (!beforePhoto || !afterPhoto)) {
          throw new Error("Both Before Photo and After Photo are required. If camera is unavailable, check 'Camera unavailable / Customer directly verified work'.");
        }
        if (!endOtpInput.trim()) {
          throw new Error("Please enter the customer's 4-digit End OTP to finalize the job.");
        }
        payload.paymentMethod = paymentMethod;
        payload.beforePhotoUrl = beforePhoto;
        payload.afterPhotoUrl = afterPhoto;
        payload.endOtp = endOtpInput.trim();
        payload.skipPhotos = skipPhotos;
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

      const finishedJob = activeJob;
      setStatusMessage({ type: "success", text: data.message });
      setStartOtpInput("");
      setEndOtpInput("");
      setBeforePhoto(null);
      setAfterPhoto(null);

      // Trigger Instant Earnings Celebration Card & Razorpay QR
      if (action === "complete" && finishedJob) {
        const total = finishedJob.total_amount;
        const payout = finishedJob.payout_amount || Math.round(total * 0.70);
        const fee = total - payout;

        setPartner((prev) => (prev ? { ...prev, payout_balance: prev.payout_balance + payout } : null));

        setCompletedJobModal({
          job: finishedJob,
          payoutAmount: payout,
          platformFee: fee,
          paymentMode: paymentMethod,
          qrData: null,
        });

        generatePaymentQr(finishedJob);
      }

      // Refresh partner job state
      await fetchJobs(partner.id);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to execute action" });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Generate Razorpay Payment QR after job completion
  const generatePaymentQr = async (job: PartnerJob) => {
    setIsGeneratingQr(true);
    try {
      const res = await fetch("/api/payments/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: job.reference_id,
          amount: job.total_amount,
          customerName: job.customer_name,
          customerPhone: job.customer_phone,
          description: `Osmida ${job.service_name} - ${job.reference_id}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const qrInfo = {
          qrCodeUrl: data.qrCodeUrl,
          paymentLink: data.paymentLink,
          amount: job.total_amount,
        };
        setQrData(qrInfo);
        setCompletedJobModal((prev) => (prev ? { ...prev, qrData: qrInfo } : null));
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to generate QR" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "QR generation failed" });
    } finally {
      setIsGeneratingQr(false);
    }
  };

  // Reset all test jobs and bookings for clean testing
  const handleResetJobs = async () => {
    if (!confirm("Clear all test jobs and bookings to start fresh from Step 1?")) return;
    try {
      const res = await fetch("/api/partner/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Cleared! Ready to test fresh customer booking." });
        setQrData(null);
        if (partner) {
          await fetchJobs(partner.id);
        }
      }
    } catch {
      setStatusMessage({ type: "error", text: "Failed to reset test jobs" });
    }
  };

  // -------------------------------------------------------------
  // VIEW: LOGIN & REGISTRATION SCREENS (if not authenticated)
  // -------------------------------------------------------------
  if (!partner) {
    return (
      <main className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-[#161D2F] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="relative h-14 w-14 mx-auto mb-3 rounded-2xl overflow-hidden border border-[#0C6266]/40 bg-[#095054] shadow-lg flex items-center justify-center p-1">
              <Image src="/icon.svg" alt="Osmida Partner" width={48} height={48} className="object-contain" priority />
            </div>
            <div className="inline-flex items-center gap-2 bg-[#0C6266]/15 border border-[#0C6266]/30 px-3 py-1 rounded-full mb-2 text-xs font-semibold text-[#38B2AC]">
              <Sparkles className="w-3.5 h-3.5" />
              OSMIDA WORKER PORTAL • NELLORE
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Partner Portal</h1>
            <p className="text-xs text-gray-400 mt-1">
              Standardized Residential Services in Nellore Apartments
            </p>
          </div>

          {/* Tab Switch: Login vs Register */}
          <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl mb-5 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`py-2 rounded-lg transition ${
                authMode === "login"
                  ? "bg-[#0C6266] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Partner Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`py-2 rounded-lg transition ${
                authMode === "register"
                  ? "bg-[#0C6266] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              New Registration
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* SCREEN 1: REGISTRATION FORM */}
          {authMode === "register" ? (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujatha Reddy"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Phone (WhatsApp Mobile)*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-medium">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="9490122849"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#0E131F] border border-white/15 rounded-xl pl-11 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Aadhaar Number (12 Digits)*
                </label>
                <input
                  type="text"
                  maxLength={12}
                  required
                  placeholder="XXXX-XXXX-XXXX"
                  value={regAadhaar}
                  onChange={(e) => setRegAadhaar(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
                />
              </div>

              {/* Photo & Selfie simulation/pickers */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-white/15 rounded-xl p-2.5 bg-black/30 text-center space-y-1">
                  <span className="text-[10px] text-gray-300 block font-bold">Aadhaar Card Photo</span>
                  <button
                    type="button"
                    onClick={() => setRegAadhaarUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200")}
                    className="text-[10px] font-bold text-[#0C6266] underline"
                  >
                    {regAadhaarUrl ? "✓ Attached" : "+ Upload Photo"}
                  </button>
                </div>
                <div className="border border-white/15 rounded-xl p-2.5 bg-black/30 text-center space-y-1">
                  <span className="text-[10px] text-gray-300 block font-bold">Worker Selfie</span>
                  <button
                    type="button"
                    onClick={() => setRegSelfieUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150")}
                    className="text-[10px] font-bold text-[#0C6266] underline"
                  >
                    {regSelfieUrl ? "✓ Attached" : "+ Take Selfie"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  UPI ID (For Daily Payout Settlements)*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sujatha@okaxis"
                  value={regUpi}
                  onChange={(e) => setRegUpi(e.target.value)}
                  className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
                />
              </div>

              {/* Skill Checkboxes (All 4 Services) */}
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Service Skills (Select All That Apply):
                </label>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    "Bathroom Cleaning",
                    "Kitchen Cleaning",
                    "Dishwashing",
                    "General House Help",
                  ].map((skill) => {
                    const isChecked = regSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setRegSkills((prev) =>
                            prev.includes(skill)
                              ? prev.length > 1
                                ? prev.filter((s) => s !== skill)
                                : prev
                              : [...prev, skill]
                          )
                        }
                        className={`p-2 rounded-lg border text-left flex items-center justify-between text-[11px] transition ${
                          isChecked
                            ? "bg-[#0C6266]/25 border-[#0C6266] text-[#0C6266] font-bold"
                            : "bg-white/5 border-white/10 text-gray-400"
                        }`}
                      >
                        <span>{skill}</span>
                        {isChecked && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-white font-black py-3 rounded-xl transition shadow-lg shadow-[#E68A00]/25 flex items-center justify-center gap-2 text-xs sm:text-sm mt-3 disabled:opacity-50"
              >
                {isLoggingIn ? "Submitting Registration..." : "Complete Registration & Start Jobs"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
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
                    className="w-full bg-[#0E131F] border border-white/15 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
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
                  placeholder="••••"
                  className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266] tracking-widest text-center"
                />
                <span className="block text-[11px] text-gray-400 mt-1">Enter your registered 4-digit partner security PIN</span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-[#E68A00]/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isLoggingIn ? "Authenticating..." : "Login to Dispatch Hub"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Logins for Immediate Field Testing */}
          <div className="mt-6 pt-5 border-t border-white/10">
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
                    <div className="w-7 h-7 rounded-full bg-[#0C6266]/25 text-[#0C6266] flex items-center justify-center font-bold text-xs">
                      {demo.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#0C6266] transition">{demo.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {demo.categories.join(", ").toUpperCase()} • {demo.assigned_hub} Hub ({demo.coverage_localities[0]})
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0C6266] flex items-center gap-0.5">
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
            <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-[#0C6266]/30 bg-[#095054] flex items-center justify-center shrink-0 p-0.5 shadow-sm">
              <Image src="/icon.svg" alt="Osmida" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white leading-tight">{partner.name}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                  <Star className="w-2.5 h-2.5 fill-amber-300" /> {partner.rating}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Osmida Partner • {partner.assigned_hub} Hub
              </p>
            </div>
          </div>

          {/* ONLINE / OFFLINE TOGGLE */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleOnline}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                isOnline
                  ? "bg-[#0C6266]/25 border-[#0C6266] text-[#0C6266] shadow-sm shadow-[#E68A00]/25"
                  : "bg-gray-800 border-gray-600 text-gray-400"
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${isOnline ? "animate-pulse" : ""}`} />
              {isOnline ? "ONLINE" : "OFFLINE"}
            </button>
            <button
              onClick={handleResetJobs}
              title="Reset test data (clear all active jobs to start clean)"
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Test
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
      <div className={`px-4 py-2 text-center text-xs font-medium ${isOnline ? "bg-[#0C6266]/15 text-[#0C6266] border-b border-[#0C6266]/20" : "bg-gray-800 text-gray-400 border-b border-gray-700"}`}>
        {isOnline ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0C6266] animate-ping" />
            Ready for Quick-Commerce Dispatch in {partner.coverage_localities.slice(0, 3).join(", ")}
          </span>
        ) : (
          "You are currently OFFLINE. Toggle to ONLINE above to receive job alerts."
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
        {/* BUZZER TEST & SOUND CONTROLS BAR */}
        <div className="bg-[#121826] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${buzzerPlaying ? "bg-[#E68A00] text-white animate-bounce" : "bg-[#0C6266]/20 text-[#0C6266]"}`}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Dispatch Alert Buzzer</p>
              <p className="text-[10px] text-gray-400">Plays loud dual-tone alarm when job broadcasts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={playJobAlertBuzzer}
            disabled={buzzerPlaying}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              buzzerPlaying
                ? "bg-[#E68A00] text-white"
                : "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15"
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${buzzerPlaying ? "animate-spin" : ""}`} />
            {buzzerPlaying ? "Sounding..." : "Test Buzzer"}
          </button>
        </div>

        {/* WEB PUSH / FCM SUBSCRIPTION CONTROLS */}
        <div className="bg-[#121826] border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Background Push (FCM / Web Push)</p>
              <p className="text-[10px] text-gray-400">Receive alerts even when screen is locked</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (typeof window === "undefined" || !("Notification" in window)) {
                alert("Push notifications are not supported on this browser.");
                return;
              }
              try {
                const perm = await Notification.requestPermission();
                if (perm === "granted" && "serviceWorker" in navigator && partner) {
                  const reg = await navigator.serviceWorker.ready;
                  let sub = await reg.pushManager.getSubscription();
                  if (!sub) {
                    try {
                      sub = await reg.pushManager.subscribe({ userVisibleOnly: true });
                    } catch {}
                  }
                  await fetch("/api/partner/push-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ partnerId: partner.id, subscription: sub }),
                  });
                  setStatusMessage({ type: "success", text: "Background job notifications enabled successfully!" });
                } else {
                  alert("Notification permission was not granted.");
                }
              } catch (err: any) {
                console.warn("Push error:", err);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0C6266] hover:bg-[#094e51] text-white transition flex items-center gap-1.5 shadow"
          >
            Enable Push
          </button>
        </div>

        {/* PLATFORM NOTICE & IOS FALLBACK GUIDANCE */}
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-200">
              ⚡ Keep the app open while online to never miss a job
            </p>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Foreground alerts chime instantly. On iPhone (iOS 16.4+), tap <span className="font-bold underline">Share &gt; Add to Home Screen</span> in Safari to receive background dispatch notifications.
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
              statusMessage.type === "success"
                ? "bg-[#0C6266]/20 border-[#0C6266]/30 text-[#0C6266]"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0C6266] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0C6266] animate-ping" />
                    Incoming Job Alert ({offeredJobs.length})
                  </span>
                  <span className="text-[11px] text-gray-400">Tap to claim</span>
                </div>

                {offeredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gradient-to-br from-[#1A233A] to-[#121826] border-2 border-[#0C6266] rounded-2xl p-4 shadow-xl shadow-[#0C6266]/15 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 bg-[#E68A00]/15 border border-[#E68A00]/30 rounded-xl p-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                          Guaranteed Pay (Immediate Escrow)
                        </span>
                        <span className="text-2xl font-black text-[#E68A00]">₹{job.payout_amount}</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#0C6266]/30 text-[#B6D7D8] font-bold text-[10px] uppercase tracking-wide border border-[#0C6266]">
                        {job.category.toUpperCase()} • 1 VISIT
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 leading-snug">{job.service_name}</h3>

                    <div className="bg-black/30 rounded-xl p-3 space-y-1.5 text-xs text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0C6266] shrink-0" />
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
                        className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#E68A00]/25"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ACCEPT JOB
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── JOB COMPLETED CELEBRATION & POST-SERVICE PAYMENT SCREEN (PRONTO + SNAPIT INSPIRATION) ── */}
            {completedJobModal && (
              <div className="bg-gradient-to-br from-[#121E2C] to-[#0A101D] border-2 border-[#0C6266] rounded-2xl p-5 space-y-4 shadow-2xl animate-in fade-in duration-300">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-[#0C6266]/20 text-[#0C6266] flex items-center justify-center mx-auto mb-2 border border-[#0C6266]/40">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0C6266] bg-[#0C6266]/10 px-2.5 py-0.5 rounded-full border border-[#0C6266]/30">
                    Work Completed &amp; Verified
                  </span>
                  <h3 className="text-lg font-black text-white">{completedJobModal.job.service_name}</h3>
                  <p className="text-xs text-gray-400">
                    Ref: {completedJobModal.job.reference_id} &bull; {completedJobModal.job.customer_name} ({completedJobModal.job.locality})
                  </p>
                </div>

                {/* Instant Earnings Card (Snapit style) */}
                <div className="grid grid-cols-2 gap-2 bg-black/40 rounded-xl p-3 border border-white/10 text-center">
                  <div className="border-r border-white/10 pr-2">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Your Payout (70%)</span>
                    <span className="text-xl font-extrabold text-[#0C6266] block mt-0.5">
                      +₹{completedJobModal.payoutAmount}
                    </span>
                    <span className="text-[9px] text-[#0C6266] block font-medium">Added to 9:00 PM settlement</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Bill</span>
                    <span className="text-xl font-extrabold text-white block mt-0.5">
                      ₹{completedJobModal.job.total_amount}
                    </span>
                    <span className="text-[9px] text-gray-400 block font-medium">Osmida Platform Fee: ₹{completedJobModal.platformFee}</span>
                  </div>
                </div>

                {/* Dynamic Razorpay QR presentation */}
                {completedJobModal.qrData ? (
                  <div className="border border-[#0C6266]/60 rounded-xl p-4 bg-black/50 text-center space-y-3">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#0C6266]">
                      <IndianRupee className="w-4 h-4" />
                      Show QR to Customer to Pay ₹{completedJobModal.qrData.amount}
                    </div>
                    <div className="bg-white rounded-xl p-2.5 inline-block mx-auto shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={completedJobModal.qrData.qrCodeUrl}
                        alt="Razorpay Payment QR"
                        width={210}
                        height={210}
                        className="rounded"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                      Customer scans via PhonePe / Google Pay / Paytm &bull; 100% secure Razorpay payment
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <a
                        href={`https://wa.me/91${completedJobModal.job.customer_phone}?text=${encodeURIComponent(
                          `Hello ${completedJobModal.job.customer_name}, your Osmida ${completedJobModal.job.service_name} (Ref: ${completedJobModal.job.reference_id}) is completed! Please tap here to pay ₹${completedJobModal.job.total_amount}: ${completedJobModal.qrData.paymentLink}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Send Bill on WhatsApp
                      </a>
                      <a
                        href={completedJobModal.qrData.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/10 hover:bg-white/20 text-gray-300 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1"
                      >
                        Open Link <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-4 text-[#0C6266] text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Dynamic Razorpay QR...
                  </div>
                )}

                {/* Cash Alternative */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-gray-300 block">Customer Paid Paper Cash?</span>
                    <span className="text-[10px] text-gray-400">If customer gave ₹{completedJobModal.job.total_amount} in cash directly</span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await fetch("/api/partner/job-action", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            action: "record_cash",
                            jobId: completedJobModal.job.id,
                            collectedAmount: completedJobModal.job.total_amount,
                          }),
                        });
                        alert(`Cash of ₹${completedJobModal.job.total_amount} confirmed received. Osmida platform fee of ₹${completedJobModal.platformFee} will be offset in today's 9:00 PM settlement.`);
                        setCompletedJobModal(null);
                        fetchJobs(partner.id);
                      } catch {
                        setCompletedJobModal(null);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Confirm Cash Received
                  </button>
                </div>

                <button
                  onClick={() => setCompletedJobModal(null)}
                  className="w-full bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#0C6266]/30 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Done &amp; Ready for Next Job
                </button>
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
                    <p className="text-base font-bold text-[#0C6266]">₹{activeJob.payout_amount}</p>
                  </div>
                </div>

                {/* Customer Details & Actions */}
                <div className="bg-black/30 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{activeJob.customer_name}</p>
                      <p className="text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#0C6266]" /> {activeJob.customer_address}
                      </p>
                    </div>
                  </div>

                  {/* 1-Tap Call, WhatsApp & Two-Wheeler GPS Navigation */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    <a
                      href={`tel:${activeJob.customer_phone}`}
                      className="bg-white/10 hover:bg-white/15 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition"
                    >
                      <Phone className="w-3 h-3 text-[#0C6266]" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/91${activeJob.customer_phone}?text=${encodeURIComponent(
                        `Namaste ${activeJob.customer_name}, I am your Osmida partner ${partner.name}. I have accepted your ${activeJob.service_name} booking (Ref: ${activeJob.reference_id}) and will be arriving shortly.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold py-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition border border-emerald-500/20"
                    >
                      <MessageSquare className="w-3 h-3" />
                      WhatsApp
                    </a>
                    <a
                      href={
                        (activeJob as any).google_maps_url ||
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${activeJob.customer_address}, Nellore, Andhra Pradesh`
                        )}&travelmode=two_wheeler`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#0C6266]/25 hover:bg-[#0C6266]/35 text-[#38B2AC] font-semibold py-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition border border-[#0C6266]/30"
                    >
                      <Navigation className="w-3 h-3" />
                      Two-Wheeler GPS
                    </a>
                  </div>
                </div>

                {/* 3-STEP EXECUTION FLOW */}
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
                            ? "bg-[#0C6266] text-black"
                            : "bg-white/20 text-white"
                        }`}>1</span>
                        Step 1: On The Way
                      </span>
                      {activeJob.status === "dispatched" || activeJob.status === "in_progress" ? (
                        <span className="text-[10px] text-[#0C6266] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Dispatched
                        </span>
                      ) : null}
                    </div>

                    {activeJob.status === "accepted" && (
                      <button
                        onClick={() => handleJobAction("dispatch", activeJob.id)}
                        disabled={isActionLoading}
                        className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#E68A00]/25 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        I am On The Way (Alert Customer)
                      </button>
                    )}

                    {/* TURN-BY-TURN GOOGLE MAPS NAVIGATION BANNER */}
                    {activeJob.status === "dispatched" && (
                      <div className="bg-gradient-to-r from-emerald-950/60 to-[#0C6266]/30 border border-emerald-500/40 rounded-xl p-3 space-y-2 pt-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                            Heading to Customer Doorstep
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                            Turn-by-Turn
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-tight">
                          {activeJob.customer_address}
                        </p>
                        <a
                          href={
                            (activeJob as any).google_maps_url ||
                            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              `${activeJob.customer_address}, Nellore, Andhra Pradesh`
                            )}&travelmode=two_wheeler`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs transition shadow-md shadow-emerald-900/50"
                        >
                          <Navigation className="w-4 h-4" />
                          Start Turn-by-Turn Google Maps Navigation
                        </a>
                      </div>
                    )}
                  </div>

                  {/* STEP 2: START JOB (CUSTOMER OTP VERIFICATION) */}
                  <div className="border border-white/10 rounded-xl p-3 bg-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeJob.status === "in_progress" ? "bg-[#0C6266] text-black" : "bg-white/20 text-white"
                        }`}>2</span>
                        Step 2: Start Job (Customer OTP)
                      </span>
                      {activeJob.status === "in_progress" && (
                        <span className="text-[10px] text-[#0C6266] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> In Progress
                        </span>
                      )}
                      {activeJob.status === "in_progress" && (
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                          <div>
                            <span className="text-gray-300 font-bold block">Amount: ₹{activeJob.total_amount}</span>
                            <span className="text-[10px] text-emerald-400">Your Share: ₹{activeJob.payout_amount}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJobAction("add_time", activeJob.id)}
                            disabled={isActionLoading}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            +30 Mins (+₹99)
                          </button>
                        </div>
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
                            className="bg-black/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-center tracking-widest font-mono text-white focus:outline-none focus:border-[#0C6266] flex-1"
                          />
                          <button
                            onClick={() => handleJobAction("start", activeJob.id)}
                            disabled={isActionLoading}
                            className="bg-[#E68A00] hover:bg-[#CC7A00] text-white font-bold px-4 py-1.5 rounded-lg text-xs transition"
                          >
                            Verify & Start
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-500 block">Hint for demo test: {activeJob.start_otp}</span>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: COMPLETE WORK (MANDATORY BEFORE/AFTER PHOTOS & END OTP) */}
                  <div className="border border-white/10 rounded-xl p-3 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                          3
                        </span>
                        Step 3: Completion Proof & End OTP
                      </span>
                    </div>

                    {activeJob.status === "in_progress" && (
                      <div className="space-y-3 pt-1">
                        {/* MANDATORY BEFORE & AFTER PHOTOS */}
                        <div>
                          <label className="text-[11px] text-gray-300 block mb-1.5 font-bold">
                            Photos Before & After Work:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Before Photo */}
                            <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-black/40 space-y-1.5">
                              <Camera className="w-5 h-5 text-gray-400 mx-auto" />
                              <span className="text-[10px] text-gray-300 block font-bold">1. Before Photo</span>
                              {beforePhoto ? (
                                <span className="text-[10px] text-[#0C6266] font-bold block">✓ Photo Attached</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setBeforePhoto(
                                      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80"
                                    )
                                  }
                                  className="text-[10px] font-bold text-[#0C6266] bg-[#0C6266]/20 px-2 py-1 rounded border border-[#0C6266]/30"
                                >
                                  + Capture Before
                                </button>
                              )}
                            </div>

                            {/* After Photo */}
                            <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-black/40 space-y-1.5">
                              <Camera className="w-5 h-5 text-gray-400 mx-auto" />
                              <span className="text-[10px] text-gray-300 block font-bold">2. After Photo</span>
                              {afterPhoto ? (
                                <span className="text-[10px] text-[#0C6266] font-bold block">✓ Photo Attached</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAfterPhoto(
                                      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80"
                                    )
                                  }
                                  className="text-[10px] font-bold text-[#0C6266] bg-[#0C6266]/20 px-2 py-1 rounded border border-[#0C6266]/30"
                                >
                                  + Capture After
                                </button>
                              )}
                            </div>
                          </div>

                          {/* CAMERA BYPASS OPTION */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="checkbox"
                              id="skipPhotosCheck"
                              checked={skipPhotos}
                              onChange={(e) => setSkipPhotos(e.target.checked)}
                              className="rounded border-white/20 bg-black/40 text-[#0C6266] focus:ring-0 cursor-pointer"
                            />
                            <label htmlFor="skipPhotosCheck" className="text-[11px] text-gray-400 cursor-pointer select-none">
                              Camera unavailable / Customer directly verified work
                            </label>
                          </div>
                        </div>

                        {/* END OTP INPUT (FROM CUSTOMER) */}
                        <div className="bg-black/40 rounded-xl p-3 border border-white/10 space-y-1.5">
                          <label className="text-[11px] text-gray-300 block font-bold">
                            Enter Customer&apos;s 4-Digit End OTP (Completion Code):
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="End OTP"
                              value={endOtpInput}
                              onChange={(e) => setEndOtpInput(e.target.value)}
                              className="bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-center tracking-widest font-mono text-white focus:outline-none focus:border-[#0C6266] flex-1"
                            />
                          </div>
                        </div>

                        {/* ── PAYMENT VIA RAZORPAY QR ── */}
                        <div className="bg-black/40 rounded-xl p-3 border border-[#0C6266]/30 space-y-2">
                          <p className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                            <IndianRupee className="w-3.5 h-3.5 text-[#0C6266]" />
                            Payment: ₹{activeJob.total_amount} — QR generated on completion
                          </p>
                          <p className="text-[10px] text-gray-500">
                            After you complete the job, a Razorpay QR code will appear. Show it to the customer to scan and pay instantly via UPI / Card, or collect cash.
                          </p>
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={() => handleJobAction("complete", activeJob.id)}
                          disabled={isActionLoading || (!skipPhotos && (!beforePhoto || !afterPhoto)) || !endOtpInput.trim()}
                          className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 font-extrabold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#E68A00]/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {!skipPhotos && (!beforePhoto || !afterPhoto)
                              ? "Upload Both Photos to Complete"
                              : !endOtpInput.trim()
                              ? "Enter Customer End OTP to Complete"
                              : isActionLoading
                              ? "Completing Job..."
                              : "Complete Job & Settle Payment"}
                          </span>
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
                <div className="w-12 h-12 rounded-full bg-[#0C6266]/25 text-[#0C6266] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">No Active Jobs Right Now</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
                  Keep your status ONLINE. As soon as a customer books in {partner.assigned_hub} Nellore, you will receive an alert.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => fetchJobs(partner.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-300 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Dispatch Feed
                  </button>
                  <button
                    onClick={handleResetJobs}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-400 border border-amber-500/20 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Test Data
                  </button>
                </div>
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
            <div className="bg-gradient-to-br from-[#162138] to-[#0E1524] border border-[#0C6266]/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">Available Payout Balance</span>
                <span className="text-xs bg-[#0C6266]/25 text-[#0C6266] font-bold px-2 py-0.5 rounded">
                  Daily Settlement
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#0C6266]">₹{partner.payout_balance}</span>
                <span className="text-xs text-gray-400">INR</span>
              </div>

              <div className="bg-black/40 rounded-xl p-3 text-xs flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#0C6266]" />
                  <span className="text-gray-300">Registered UPI ID:</span>
                </div>
                <span className="font-mono font-bold text-white">{partner.upi_id || `${partner.phone}@upi`}</span>
              </div>

              <button
                onClick={() => alert(`Payout request of ₹${partner.payout_balance} initiated to ${partner.upi_id || partner.phone + "@upi"}. Funds will settle within 2 hours.`)}
                className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
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
                <span className="text-xl font-bold text-[#0C6266]">70%</span>
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
                    <span className="font-extrabold text-[#0C6266] text-sm">+₹{job.payout_amount}</span>
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
                <div className="w-12 h-12 rounded-full bg-[#0C6266]/25 text-[#0C6266] font-black flex items-center justify-center text-lg">
                  {partner.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white">{partner.name}</h3>
                  <p className="text-xs text-gray-400">+91 {partner.phone}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#0C6266] font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Osmida Certified Partner
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-gray-400 block font-semibold mb-1">Assigned Dispatch Hub:</span>
                  <span className="inline-block bg-[#0C6266]/25 text-[#0C6266] font-bold px-2.5 py-1 rounded-lg">
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
              activeTab === "jobs" ? "text-[#0C6266]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5" />
              {offeredJobs.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#0C6266] text-black text-[9px] font-black flex items-center justify-center">
                  {offeredJobs.length}
                </span>
              )}
            </div>
            <span>Live Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              activeTab === "earnings" ? "text-[#0C6266]" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 py-1 text-[11px] font-bold transition ${
              activeTab === "profile" ? "text-[#0C6266]" : "text-gray-400 hover:text-gray-200"
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
