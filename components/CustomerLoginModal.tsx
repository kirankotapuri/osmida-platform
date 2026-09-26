"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  User,
  KeyRound,
  Lock,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Primary auth channel: 'phone' (WhatsApp Mobile) vs 'email' (Gmail)
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");

  // Email states
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFlow, setEmailFlow] = useState<"otp_request" | "otp_verify" | "password_login" | "forgot_password">("otp_request");

  // Phone states
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [suggestedCode, setSuggestedCode] = useState<string | null>(null);
  const [resetLinkUrl, setResetLinkUrl] = useState<string | null>(null);

  if (!isOpen || !mounted) return null;

  // ----------------------------------------------------------------
  // 1-TAP INSTANT RESIDENT DEMO LOGIN (Zero Friction Testing)
  // ----------------------------------------------------------------
  const handleQuickDemoLogin = () => {
    const demoProfile = {
      name: "Kiran Kumar",
      phone: "9490122849",
      email: "kiran@osmida.com",
      locality: "Haranathapuram",
      apartmentName: "Sri Balaji Enclave",
      flatNumber: "Flat 302",
      towerBlock: "Tower B",
      address: "Near Children's Park, Haranathapuram, Nellore",
      googleMapsUrl: "https://maps.google.com/?q=14.4426,79.9865",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("osmida_customer_phone", demoProfile.phone);
      localStorage.setItem("osmida_customer_email", demoProfile.email);
      localStorage.setItem("osmida_customer_name", demoProfile.name);
      localStorage.setItem("osmida_customer_profile", JSON.stringify(demoProfile));
      window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: demoProfile }));
    }
    onLoginSuccess(demoProfile);
    onClose();
  };

  // ----------------------------------------------------------------
  // GOOGLE 1-CLICK AUTH
  // ----------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
          },
        });
        if (error) throw error;
      } else {
        // Fallback: prompt for Gmail address
        setAuthMethod("email");
        setEmailFlow("otp_request");
        setInfoMsg("Please enter your Gmail address below to receive your instant verification code.");
      }
    } catch (err: any) {
      const rawMsg = String(err?.message || err?.msg || JSON.stringify(err) || "");
      if (
        rawMsg.includes("Unsupported provider") ||
        rawMsg.includes("provider is not enabled") ||
        rawMsg.includes("validation_failed")
      ) {
        setAuthMethod("email");
        setEmailFlow("otp_request");
        setErrorMsg(
          "Google OAuth provider needs to be toggled ON in Supabase Dashboard (Auth > Providers > Google). In the meantime, use instant Gmail code below, or 1-Tap Quick Login!"
        );
      } else {
        setErrorMsg(err.message || "Could not initialize Google Sign-in. Please use Gmail OTP below.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // GMAIL / EMAIL OTP DISPATCH
  // ----------------------------------------------------------------
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setSuggestedCode(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid Gmail or email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_email_otp",
          email: cleanEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEmailFlow("otp_verify");
        if (data.demoCode) {
          setSuggestedCode(data.demoCode);
          setEmailOtp(data.demoCode);
        }
        setInfoMsg(data.message || `Code sent to ${cleanEmail}. Check your inbox!`);
      } else {
        setErrorMsg(data.error || "Failed to send verification code. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // GMAIL / EMAIL OTP VERIFICATION
  // ----------------------------------------------------------------
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOtp.trim()) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setIsLoading(true);

    try {
      const res = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_email_otp",
          email: cleanEmail,
          otp: emailOtp.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_email", cleanEmail);
          if (data.profile) {
            localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile));
            if (data.profile.name) {
              localStorage.setItem("osmida_customer_name", data.profile.name);
            }
            if (data.profile.phone) {
              localStorage.setItem("osmida_customer_phone", data.profile.phone);
            }
          }
          window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: data.profile || { email: cleanEmail } }));
        }
        onLoginSuccess(data.profile || { email: cleanEmail });
        onClose();
      } else {
        setErrorMsg(data.error || "Invalid code. Please try again.");
      }
    } catch {
      setErrorMsg("Failed to connect to Osmida server.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // GMAIL / EMAIL PASSWORD LOGIN
  // ----------------------------------------------------------------
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login_password",
          email: cleanEmail,
          password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_email", cleanEmail);
          if (data.profile) {
            localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile));
            if (data.profile.name) {
              localStorage.setItem("osmida_customer_name", data.profile.name);
            }
          }
          window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: data.profile || { email: cleanEmail } }));
        }
        onLoginSuccess(data.profile || { email: cleanEmail });
        onClose();
      } else {
        setErrorMsg(data.error || "Invalid credentials.");
      }
    } catch {
      setErrorMsg("Network error during login.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // FORGOT PASSWORD RESET LINK DISPATCH
  // ----------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setResetLinkUrl(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Please enter your registered Gmail or email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_password_reset",
          email: cleanEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.resetLink) {
          setResetLinkUrl(data.resetLink);
        }
        setInfoMsg(data.message || `Password reset link sent to ${cleanEmail}. Check your inbox or spam!`);
      } else {
        setErrorMsg(data.error || "Failed to send reset link.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // WHATSAPP MOBILE OTP DISPATCH
  // ----------------------------------------------------------------
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setSuggestedCode(null);

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
        setPhoneStep("otp");
        if (data.demoCode) {
          setSuggestedCode(data.demoCode);
          setPhoneOtp(data.demoCode);
        } else {
          setSuggestedCode("1234");
          setPhoneOtp("1234");
        }
        setInfoMsg(data.message || "OTP sent! Enter 1234 to log in.");
      } else {
        setErrorMsg(data.error || "Failed to send verification code.");
      }
    } catch {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // WHATSAPP MOBILE OTP VERIFY
  // ----------------------------------------------------------------
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phoneOtp.trim()) {
      setErrorMsg("Please enter the 4-digit code.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    setIsLoading(true);

    try {
      const res = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: phoneOtp.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("osmida_customer_phone", cleanPhone);
          if (data.profile) {
            localStorage.setItem("osmida_customer_profile", JSON.stringify(data.profile));
            if (data.profile.name) {
              localStorage.setItem("osmida_customer_name", data.profile.name);
            }
          }
          window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: data.profile || { phone: cleanPhone } }));
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

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/70 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 border border-slate-100 text-left my-6 sm:my-8 animate-in fade-in zoom-in-95 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0C6266]/10 text-[#0C6266]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">Customer Login</h3>
              <p className="text-[10px] text-slate-500 font-medium">Access saved addresses &amp; visits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-2.5 flex items-start gap-2 text-xs text-rose-700 font-semibold animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 flex items-start gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Suggested Code Auto-Fill Banner (Zero Friction) */}
        {suggestedCode && (emailFlow === "otp_verify" || phoneStep === "otp") && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-2.5 flex items-center justify-between gap-2 text-xs text-amber-900 font-semibold animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                Verification Code: <strong className="font-mono font-black text-sm tracking-wider text-amber-950">{suggestedCode}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (authMethod === "email") setEmailOtp(suggestedCode);
                else setPhoneOtp(suggestedCode);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Direct Password Reset Link Banner */}
        {resetLinkUrl && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 space-y-1.5 text-xs text-amber-900 font-semibold animate-in fade-in">
            <p className="font-bold">⚡ Instant Password Reset Link:</p>
            <a
              href={resetLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0C6266] font-extrabold underline hover:text-[#094e51] break-all"
            >
              <span>Click here to set your new password now →</span>
            </a>
          </div>
        )}

        {/* 1-Click Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2.5 px-4 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
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
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 shrink-0">
            or continue with
          </span>
        </div>

        {/* Tab Switcher: WhatsApp Mobile (Primary) vs Gmail */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              authMethod === "phone"
                ? "bg-white text-emerald-900 shadow-2xs border border-emerald-300"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setErrorMsg("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              authMethod === "email"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-[#0C6266]" />
            <span>Gmail / Email</span>
          </button>
        </div>

        {/* 1-Tap Quick Demo Login */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-300/80 py-2.5 px-3 text-xs font-bold text-amber-950 shadow-2xs transition-all active:scale-98 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
          <span>⚡ 1-Tap Instant Login (Nellore Resident Profile)</span>
        </button>

        {/* ------------------------------------------------------------- */}
        {/* EMAIL (GMAIL) AUTH FORMS */}
        {/* ------------------------------------------------------------- */}
        {authMethod === "email" && (
          <div className="space-y-3">
            {/* SUB-FLOW 1: Send Email OTP (Default, Passwordless) */}
            {emailFlow === "otp_request" && (
              <form onSubmit={handleSendEmailOtp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Gmail / Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3.5 text-xs font-medium text-slate-900 focus:border-[#0C6266] focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    We will send a real 6-digit verification code to your Gmail.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.includes("@")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Real Code to Gmail</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailFlow("password_login");
                      setErrorMsg("");
                    }}
                    className="font-bold text-[#0C6266] hover:underline"
                  >
                    Log in with Password →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailFlow("forgot_password");
                      setErrorMsg("");
                    }}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            )}

            {/* SUB-FLOW 2: Verify Email OTP */}
            {emailFlow === "otp_verify" && (
              <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Enter 6-Digit Gmail Code</h4>
                  <p className="text-[11px] text-slate-500">
                    Sent to <strong className="text-slate-700">{email}</strong>
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-widest text-xl font-mono font-black rounded-xl border border-slate-300 py-2.5 text-slate-900 focus:border-[#0C6266] focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailFlow("otp_request")}
                    className="w-1/3 rounded-xl border border-slate-300 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Change
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || emailOtp.length < 4}
                    className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2 text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Verify &amp; Log In</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* SUB-FLOW 3: Email + Password Login */}
            {emailFlow === "password_login" && (
              <form onSubmit={handlePasswordLogin} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Gmail / Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#0C6266] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setEmailFlow("forgot_password")}
                      className="text-[10px] text-[#0C6266] font-bold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2 pl-3 pr-10 text-xs font-medium text-slate-900 focus:border-[#0C6266] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sign In</span>}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailFlow("otp_request")}
                    className="text-[11px] font-bold text-[#0C6266] hover:underline"
                  >
                    ← Sign in with 1-click Gmail OTP instead
                  </button>
                </div>
              </form>
            )}

            {/* SUB-FLOW 4: Forgot Password Request */}
            {emailFlow === "forgot_password" && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Reset Your Password</h4>
                  <p className="text-[11px] text-slate-500">
                    Enter your Gmail address to receive a secure password reset link.
                  </p>
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs font-medium text-slate-900 focus:border-[#0C6266] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.includes("@")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white py-2.5 text-xs font-bold transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Real Reset Link</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailFlow("otp_request")}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* WHATSAPP PHONE AUTH FORMS */}
        {/* ------------------------------------------------------------- */}
        {authMethod === "phone" && (
          <div className="space-y-3">
            {phoneStep === "phone" ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
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
                      className="w-full rounded-xl border border-slate-300 pl-11 pr-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#0C6266] focus:outline-none"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    We will send a 4-digit verification code to your WhatsApp.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 py-2.5 text-xs font-black transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                  ) : (
                    <>
                      <span>Send WhatsApp Verification Code</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="pt-1 text-center">
                  <a
                    href="https://wa.me/917676358162?text=Hello%20Osmida,%20please%20verify%20my%20login."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>💬 Direct WhatsApp Support: +91 76763 58162</span>
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Enter 4-Digit WhatsApp Code</h4>
                  <p className="text-[11px] text-slate-500">Sent to WhatsApp +91 {phone}</p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="••••"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-widest text-xl font-mono font-black rounded-xl border border-slate-300 py-2.5 text-slate-900 focus:border-[#0C6266] focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhoneStep("phone")}
                    className="w-1/3 rounded-xl border border-slate-300 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Change
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || phoneOtp.length !== 4}
                    className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 py-2 text-xs font-black transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                    ) : (
                      <>
                        <span>Verify &amp; Log In</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>⚡ Skip login &amp; continue booking as Guest →</span>
          </button>
          <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Secure Nellore Resident Authentication</span>
          </span>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
