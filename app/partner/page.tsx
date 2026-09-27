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
  Languages,
  Timer,
  Headphones,
  Check,
  Building2,
  Plus,
  Siren,
  Share2,
  AlertTriangle,
} from "lucide-react";
import { ServicePartner, PartnerJob, DEFAULT_PARTNERS } from "@/lib/partnerMatching";
import { PARTNER_STRINGS, PartnerLanguage } from "@/lib/partnerTranslations";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 45-Second Dispatch Urgency Countdown Bar for incoming job offers
function JobOfferCountdown({
  initialSeconds = 45,
  onExpire,
  lang,
}: {
  initialSeconds?: number;
  onExpire?: () => void;
  lang: string;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onExpire]);

  const percentage = (secondsLeft / initialSeconds) * 100;
  const isUrgent = secondsLeft <= 15;

  return (
    <div className="space-y-1 mb-3">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className={`flex items-center gap-1.5 ${isUrgent ? "text-rose-400 animate-pulse" : "text-amber-300"}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === "te" ? "స్పందించడానికి మిగిలిన సమయం:" : "Acceptance Window:"}</span>
        </span>
        <span
          className={`font-mono text-xs px-2 py-0.5 rounded-md ${
            isUrgent
              ? "bg-rose-500/25 text-rose-300 font-black animate-pulse border border-rose-500/40"
              : "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
          }`}
        >
          {secondsLeft}s
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${
            isUrgent ? "bg-rose-500" : secondsLeft <= 25 ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Client-side instant camera image compressor + watermark
async function compressAndWatermarkImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1024;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(e.target?.result as string);
        ctx.drawImage(img, 0, 0, w, h);

        // Watermark band
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, h - 32, w, 32);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(
          `OSMIDA NELLORE QC • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          12,
          h - 11
        );

        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

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
  const [skipPhotos, setSkipPhotos] = useState<boolean>(false);
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
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot_pin">("login");
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

  // Forgot PIN states
  const [resetPhone, setResetPhone] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetStep, setResetStep] = useState<"phone" | "verify">("phone");
  const [resetSuggestedOtp, setResetSuggestedOtp] = useState<string | null>(null);
  const [resetAadhaarLast4, setResetAadhaarLast4] = useState("");
  const [resetNewPin, setResetNewPin] = useState("");
  const [resetConfirmPin, setResetConfirmPin] = useState("");
  const [isResettingPin, setIsResettingPin] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Language State (Defaults to English when opening; partner can toggle to Telugu at any time)
  const [lang, setLang] = useState<PartnerLanguage>("en");
  const t = PARTNER_STRINGS[lang];

  const toggleLanguage = () => {
    const nextLang: PartnerLanguage = lang === "en" ? "te" : "en";
    setLang(nextLang);
    try {
      sessionStorage.setItem("osmida_partner_lang", nextLang);
      localStorage.setItem("osmida_partner_lang", nextLang);
    } catch {}
  };

  // Stopwatch timer for active in-progress job
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isAtGateReported, setIsAtGateReported] = useState<boolean>(false);

  // Push Notification state
  const [pushNotificationStatus, setPushNotificationStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [isEnablingPush, setIsEnablingPush] = useState(false);

  // Field Device & Dispatch Performance States
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Haptic feedback trigger for tactile confirmation while riding/working
  const triggerHaptic = useCallback((pattern: number | number[] = 40) => {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {}
  }, []);

  // Screen Wake Lock controller: Keeps screen awake while on duty / active job
  const requestWakeLock = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
        if (!wakeLockRef.current) {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
          setIsWakeLockActive(true);
          wakeLockRef.current.addEventListener("release", () => {
            wakeLockRef.current = null;
            setIsWakeLockActive(false);
          });
        }
      }
    } catch (e) {
      console.warn("Screen wake lock request note:", e);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsWakeLockActive(false);
      }
    } catch {}
  }, []);

  // Sync wake lock with online status and active work
  useEffect(() => {
    if (isOnline || activeJob) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isOnline, activeJob, requestWakeLock, releaseWakeLock]);

  // Battery monitoring for field technicians
  useEffect(() => {
    if (typeof navigator !== "undefined" && "getBattery" in (navigator as any)) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          const onLevelChange = () => setBatteryLevel(Math.round(battery.level * 100));
          battery.addEventListener("levelchange", onLevelChange);
          return () => battery.removeEventListener("levelchange", onLevelChange);
        })
        .catch(() => {});
    }
  }, []);

  // Hidden native camera file inputs
  const beforeCameraInputRef = useRef<HTMLInputElement>(null);
  const afterCameraInputRef = useRef<HTMLInputElement>(null);

  // Native camera image capture handler
  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressAndWatermarkImage(file);
      if (type === "before") {
        setBeforePhoto(compressedDataUrl);
      } else {
        setAfterPhoto(compressedDataUrl);
      }
      setStatusMessage({
        type: "success",
        text: type === "before" ? "Before photo captured & QC timestamped!" : "After photo captured & QC timestamped!",
      });
    } catch (err) {
      console.warn("Camera capture note:", err);
    }
  };

  // Device network state for offline resilience
  const [isDeviceOnline, setIsDeviceOnline] = useState<boolean>(true);

  // Customer rating state for job completion
  const [customerRating, setCustomerRating] = useState<number>(5);
  const [customerTags, setCustomerTags] = useState<string[]>([]);
  const [isSendingSos, setIsSendingSos] = useState<boolean>(false);

  // Network online/offline listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDeviceOnline(navigator.onLine);
    const handleOnline = () => {
      setIsDeviceOnline(true);
      setStatusMessage({
        type: "success",
        text: lang === "te" ? "ఇంటర్నెట్ తిరిగి కనెక్ట్ అయ్యింది. డేటా సింక్ అయ్యింది." : "Internet connection restored. Synchronized successfully.",
      });
    };
    const handleOffline = () => {
      setIsDeviceOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [lang]);

  // Emergency SOS Alert Handler
  const handleEmergencySos = async () => {
    if (!partner) return;
    const confirmed = confirm(
      lang === "te"
        ? "మీరు అత్యవసర పరిస్థితిలో ఉన్నారా? ఇది మీ లైవ్ GPS లొకేషన్‌ను నెల్లూరు హబ్‌కు పంపుతుంది మరియు అత్యవసర విభాగానికి కాల్ చేస్తుంది."
        : "Are you in an emergency? This will transmit your live GPS coordinates to the Nellore Central Hub and dial Emergency Support."
    );
    if (!confirmed) return;

    setIsSendingSos(true);
    let lat: number | null = null;
    let lng: number | null = null;

    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (geoErr) {
        console.warn("GPS lookup note:", geoErr);
      }
    }

    try {
      await fetch("/api/partner/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: partner.id,
          partnerName: partner.name,
          partnerPhone: partner.phone,
          jobId: activeJob?.id || null,
          lat,
          lng,
          customerAddress: activeJob?.customer_address || null,
          locality: activeJob?.locality || partner.assigned_hub,
        }),
      });

      setStatusMessage({
        type: "success",
        text: t.sosAlertSent,
      });

      window.location.href = "tel:9490122849";
    } catch (sosErr) {
      console.warn("SOS error:", sosErr);
      window.location.href = "tel:9490122849";
    } finally {
      setIsSendingSos(false);
    }
  };

  // Live stopwatch update
  useEffect(() => {
    if (!activeJob || activeJob.status !== "in_progress") {
      setElapsedSeconds(0);
      return;
    }
    const startMs = activeJob.started_at ? new Date(activeJob.started_at).getTime() : Date.now();
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - startMs) / 1000));
      setElapsedSeconds(diff);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status, activeJob?.started_at]);

  // Load saved session & language on mount and inject worker-specific PWA manifest
  useEffect(() => {
    try {
      // Start with English by default when opening; partner can toggle to Telugu
      const sessionLang = sessionStorage.getItem("osmida_partner_lang") as PartnerLanguage;
      if (sessionLang === "te") {
        setLang("te");
      } else {
        setLang("en");
        try {
          localStorage.removeItem("osmida_partner_lang");
        } catch {}
      }

      document.title = "Osmida Partner | Nellore Dispatch Portal";

      const saved = localStorage.getItem("osmida_partner_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPartner(parsed);
        setIsOnline(parsed.status !== "offline");
      }
      if (typeof window !== "undefined") {
        if (!("Notification" in window)) {
          setPushNotificationStatus("unsupported");
        } else {
          setPushNotificationStatus(Notification.permission as any);
        }
      }
    } catch {} finally {
      setTimeout(() => setIsAppLoading(false), 250);
    }
  }, []);

  const prevJobIdsRef = useRef<Set<string>>(new Set());
  const isInitialJobLoadRef = useRef<boolean>(true);
  const [buzzerPlaying, setBuzzerPlaying] = useState(false);
  const isOnlineRef = useRef<boolean>(isOnline);

  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  // Pending voice announcement if the app was backgrounded when job arrived
  const pendingVoiceAlertRef = useRef<{ textTe: string; textEn: string } | null>(null);

  // Dedicated speech synthesis trigger with mobile recovery
  const speakVoiceGuide = useCallback((customText?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel(); // Unstuck any hanging utterance
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const alertSpeech =
        customText ||
        (lang === "te"
          ? "కొత్త పని ఆర్డర్ వచ్చింది. దయచేసి చూడండి."
          : "New Osmida job order received. Please check.");

      const utterance = new SpeechSynthesisUtterance(alertSpeech);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      utterance.lang = lang === "te" ? "te-IN" : "en-IN";

      // Try selecting localized voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const match = voices.find((v) =>
          lang === "te"
            ? v.lang.toLowerCase().includes("te") || v.name.toLowerCase().includes("telugu")
            : v.lang.toLowerCase().includes("en-in") || v.lang.toLowerCase().includes("en")
        );
        if (match) utterance.voice = match;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  }, [lang]);

  // Synthesize loud dispatch alert chime via Web Audio API + vibration + voice guide
  const playJobAlertBuzzer = useCallback((jobDetails?: { service_name?: string; payout_amount?: number; locality?: string }) => {
    // If partner is offline, strictly suppress buzzer and voice
    if (!isOnlineRef.current) return;

    try {
      setBuzzerPlaying(true);
      setTimeout(() => setBuzzerPlaying(false), 1600);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // 1. Melodic 3-tone harmonic dispatch chime (C5-E5-G5: 523Hz, 659Hz, 784Hz)
        const chimeSequence = [
          { freq: 523.25, start: 0, dur: 0.18 },
          { freq: 659.25, start: 0.16, dur: 0.18 },
          { freq: 783.99, start: 0.32, dur: 0.28 },
        ];
        chimeSequence.forEach(({ freq, start, dur }) => {
          const st = ctx.currentTime + start;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0.001, st);
          gain.gain.linearRampToValueAtTime(0.3, st + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, st + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + dur);
        });

        // 2. Urgent dual-tone siren sequence: 880Hz & 1200Hz bursts
        const toneSequence = [
          { f1: 880, f2: 1200, start: 0.65, dur: 0.16 },
          { f1: 960, f2: 1320, start: 0.85, dur: 0.16 },
          { f1: 880, f2: 1200, start: 1.05, dur: 0.2 },
          { f1: 1040, f2: 1400, start: 1.3, dur: 0.3 },
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
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([400, 150, 400, 150, 600]);
      }

      // Voice guidance handling
      const isHidden = typeof document !== "undefined" && document.visibilityState === "hidden";
      if (isHidden) {
        // App is minimized / on home screen: mobile browsers suspend speech in background.
        // Queue the voice announcement so it plays immediately when the app is reopened!
        pendingVoiceAlertRef.current = {
          textTe: "కొత్త పని ఆర్డర్ వచ్చింది. దయచేసి చూడండి.",
          textEn: "New Osmida job order received. Please check.",
        };
        // Also attempt speech in case mobile OS allows background speech
        speakVoiceGuide();

        // Send high-priority system notification to lock screen / status bar with voice cue
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            const notifTitle = lang === "te" ? "🚨 కొత్త పని ఆర్డర్ వచ్చింది!" : "🚨 New Job Order Received!";
            const notifBody = jobDetails
              ? `${jobDetails.service_name} • ₹${jobDetails.payout_amount} • ${jobDetails.locality || "Nellore"}`
              : (lang === "te" ? "కొత్త ఆర్డర్ వచ్చింది. యాప్ తెరవండి." : "New order waiting. Tap to accept.");
            new Notification(notifTitle, {
              body: notifBody,
              icon: "/icons/partner-icon-192x192.png",
              badge: "/icons/partner-icon-192x192.png",
              vibrate: [400, 150, 400, 150, 600],
              tag: "osmida-dispatch-alert",
              renotify: true,
              requireInteraction: true,
            } as any);
          } catch (notifErr) {
            console.warn("Background notification note:", notifErr);
          }
        }
      } else {
        // App is foregrounded: play voice guide immediately!
        setTimeout(() => {
          speakVoiceGuide();
        }, 300);
      }
    } catch (err) {
      console.warn("Audio buzzer dispatch error:", err);
    }
  }, [lang, speakVoiceGuide]);

  // Listen for user returning to the partner app from mobile home / lock screen
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        // Re-acquire screen wake lock if online or active
        if (isOnlineRef.current || activeJob) {
          requestWakeLock();
        }

        // Partner came back to the app from home screen!
        if (pendingVoiceAlertRef.current && isOnlineRef.current) {
          const cue = lang === "te" ? pendingVoiceAlertRef.current.textTe : pendingVoiceAlertRef.current.textEn;
          pendingVoiceAlertRef.current = null;
          // Unstuck speech and speak loud and clear
          setTimeout(() => {
            speakVoiceGuide(cue);
          }, 250);
        } else if (isOnlineRef.current && offeredJobs.length > 0) {
          setTimeout(() => {
            if (window.speechSynthesis && window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          }, 200);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [lang, speakVoiceGuide, offeredJobs.length]);

  // Fetch jobs for partner
  const fetchJobs = useCallback(async (partnerId: string, forceCheckOnline?: boolean) => {
    const currentlyOnline = forceCheckOnline !== undefined ? forceCheckOnline : isOnlineRef.current;

    // If partner is offline, strictly clear offered jobs and do not sound alerts
    if (!currentlyOnline) {
      setOfferedJobs([]);
      prevJobIdsRef.current.clear();
      pendingVoiceAlertRef.current = null;
    }

    setIsLoadingJobs(true);
    try {
      const res = await fetch(`/api/partner/jobs?partnerId=${encodeURIComponent(partnerId)}&isOnline=${currentlyOnline}`);
      const data = await res.json();
      if (data.success) {
        if (!currentlyOnline) {
          setOfferedJobs([]);
          setActiveJob(data.activeJob || null);
          setCompletedJobs(data.completedJobs || []);
          return;
        }

        const newOffered = data.offeredJobs || [];
        setOfferedJobs(newOffered);
        setActiveJob(data.activeJob || null);
        setCompletedJobs(data.completedJobs || []);

        // Detect newly broadcast jobs for foreground alert buzzer and voice guide
        const currentIds = new Set<string>(newOffered.map((j: PartnerJob) => String(j.id)));
        if (!isInitialJobLoadRef.current) {
          const newlyAddedJobs = newOffered.filter((j: PartnerJob) => !prevJobIdsRef.current.has(j.id));
          if (newlyAddedJobs.length > 0) {
            const firstJob = newlyAddedJobs[0];
            playJobAlertBuzzer({
              service_name: firstJob.service_name,
              payout_amount: firstJob.payout_amount,
              locality: firstJob.locality,
            });
            setStatusMessage({
              type: "success",
              text: lang === "te"
                ? `🚨 కొత్త పని ఆర్డర్! ${firstJob.service_name} (₹${firstJob.payout_amount})`
                : `🚨 NEW JOB ALERT! ${firstJob.service_name} (₹${firstJob.payout_amount})`,
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
  }, [lang, playJobAlertBuzzer]);

  useEffect(() => {
    if (!partner) return;

    fetchJobs(partner.id, isOnline);
    // Poll every 4 seconds when ONLINE for instantaneous dispatch; slow poll (12s) when offline for active job sync
    const pollInterval = isOnline ? 4000 : 12000;
    const interval = setInterval(() => {
      fetchJobs(partner.id, isOnlineRef.current);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [partner?.id, isOnline, fetchJobs]);

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
      const isPartnerActive = data.partner.status !== "offline";
      setIsOnline(isPartnerActive);
      isOnlineRef.current = isPartnerActive;
      localStorage.setItem("osmida_partner_session", JSON.stringify(data.partner));
      fetchJobs(data.partner.id, isPartnerActive);
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Send OTP for PIN reset
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setResetSuccessMessage("");
    setResetSuggestedOtp(null);

    const clean = resetPhone.replace(/\D/g, "").slice(-10);
    if (!clean || clean.length !== 10) {
      setAuthError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsResettingPin(true);
    try {
      const res = await fetch("/api/partner/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", phone: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }
      if (data.demoCode) {
        setResetSuggestedOtp(data.demoCode);
      }
      setResetSuccessMessage(data.message || `Verification code sent to +91 ${clean}`);
      setResetStep("verify");
    } catch (err: any) {
      setAuthError(err.message || "Failed to send verification code");
    } finally {
      setIsResettingPin(false);
    }
  };

  // Reset PIN handler with OTP verification
  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setResetSuccessMessage("");
    setIsResettingPin(true);

    try {
      const res = await fetch("/api/partner/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_pin",
          phone: resetPhone,
          otp: resetOtp,
          newPin: resetNewPin,
          confirmPin: resetConfirmPin,
          aadhaarLast4: resetAadhaarLast4,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset PIN");
      }

      setResetSuccessMessage("PIN reset successful! Please log in with your new PIN.");
      setLoginPhone(resetPhone);
      setLoginPin(resetNewPin);
      setTimeout(() => {
        setAuthMode("login");
        setResetStep("phone");
        setResetOtp("");
      }, 1500);
    } catch (err: any) {
      setAuthError(err.message || "Failed to reset PIN");
    } finally {
      setIsResettingPin(false);
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
      isOnlineRef.current = true;
      localStorage.setItem("osmida_partner_session", JSON.stringify(data.partner));
      fetchJobs(data.partner.id, true);
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
    prevJobIdsRef.current.clear();
    pendingVoiceAlertRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  };

  // Toggle Online/Offline
  const handleToggleOnline = async () => {
    if (!partner) return;
    triggerHaptic(40);
    const nextOnline = !isOnline;
    const target = nextOnline ? "online" : "offline";

    setIsOnline(nextOnline);
    isOnlineRef.current = nextOnline;

    if (!nextOnline) {
      // Immediately wipe offered jobs upon going offline
      setOfferedJobs([]);
      prevJobIdsRef.current.clear();
      pendingVoiceAlertRef.current = null;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      setStatusMessage({
        type: "error",
        text: lang === "te"
          ? "మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. కొత్త ఆర్డర్‌లు రావు."
          : "You are currently OFFLINE. New job alerts paused.",
      });
    } else {
      setStatusMessage({
        type: "success",
        text: lang === "te"
          ? "మీరు ఆన్‌లైన్‌లోకి వచ్చారు. కొత్త ఆర్డర్‌ల కోసం వేచి చూస్తోంది..."
          : "You are now ONLINE. Scanning for customer orders in Nellore...",
      });
    }

    try {
      await fetch("/api/partner/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId: partner.id, status: target }),
      });
      const updated = { ...partner, status: target };
      setPartner(updated as ServicePartner);
      localStorage.setItem("osmida_partner_session", JSON.stringify(updated));

      if (nextOnline) {
        fetchJobs(partner.id, true);
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Job Execution Action Handler
  const handleJobAction = async (
    action: "accept" | "decline" | "dispatch" | "reach_gate" | "start" | "complete" | "add_time",
    jobId: string
  ) => {
    if (!partner) return;
    setIsActionLoading(true);
    setStatusMessage(null);
    if (action === "reach_gate") {
      setIsAtGateReported(true);
    }

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

      // Tactile haptic feedback for field technician
      if (action === "accept") triggerHaptic([60, 40, 60]);
      else if (action === "reach_gate") triggerHaptic(50);
      else if (action === "start") triggerHaptic([40, 30, 40]);
      else if (action === "complete") triggerHaptic([80, 50, 100]);

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
  // VIEW: SPLASH / LOADING SCREEN
  // -------------------------------------------------------------
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E131F] text-white">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative h-12 w-48">
            <Image
              src="/assets/branding/osmida-wordmark-white.png"
              alt="Osmida Worker Portal"
              width={192}
              height={49}
              className="h-full w-auto object-contain mx-auto"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#38B2AC]">
            <Sparkles className="w-3.5 h-3.5 text-[#38B2AC]" />
            <span>WORKER DISPATCH • NELLORE</span>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <div className="w-2 h-2 rounded-full bg-[#0C6266] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[#FB7D28] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#0C6266] animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGIN & REGISTRATION SCREENS (if not authenticated)
  // -------------------------------------------------------------
  if (!partner) {
    return (
      <main className="min-h-screen bg-[#0E131F] text-white flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-[#161D2F] border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl">
          {/* Logo & Header */}
          <div className="relative text-center mb-6">
            <div className="flex justify-end mb-2">
              <div className="inline-flex items-center bg-black/50 p-0.5 rounded-full border border-white/20 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setLang("en");
                    try {
                      sessionStorage.setItem("osmida_partner_lang", "en");
                      localStorage.setItem("osmida_partner_lang", "en");
                    } catch {}
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    lang === "en"
                      ? "bg-[#0C6266] text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang("te");
                    try {
                      sessionStorage.setItem("osmida_partner_lang", "te");
                      localStorage.setItem("osmida_partner_lang", "te");
                    } catch {}
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    lang === "te"
                      ? "bg-[#E68A00] text-slate-950 font-black shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>
            <div className="relative h-11 w-44 mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/assets/branding/osmida-wordmark-white.png"
                alt="Osmida Partner"
                width={176}
                height={45}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-[#0C6266]/15 border border-[#0C6266]/30 px-3 py-1 rounded-full mb-2 text-xs font-semibold text-[#38B2AC]">
              <Sparkles className="w-3.5 h-3.5" />
              OSMIDA WORKER PORTAL • NELLORE
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t.portalTitle}</h1>
            <p className="text-xs text-gray-400 mt-1">
              {t.subtitle}
            </p>
          </div>

          {/* Tab Switch: Login vs Register */}
          <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl mb-5 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
                setResetSuccessMessage("");
              }}
              className={`py-2 rounded-lg transition ${
                authMode === "login" || authMode === "forgot_pin"
                  ? "bg-[#0C6266] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {authMode === "forgot_pin" ? "Reset PIN" : "Partner Login"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
                setResetSuccessMessage("");
              }}
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

          {resetSuccessMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resetSuccessMessage}</span>
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
          ) : authMode === "login" ? (
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
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-gray-400">Registered 4-digit security PIN</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot_pin");
                      setAuthError("");
                      setResetSuccessMessage("");
                      setResetPhone(loginPhone);
                    }}
                    className="text-[11px] font-bold text-[#38B2AC] hover:underline"
                  >
                    Forgot PIN?
                  </button>
                </div>
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
          ) : (
            /* FORGOT PIN FORM: REAL-WORLD 2-STEP OTP FLOW */
            resetStep === "phone" ? (
              <form onSubmit={handleSendResetOtp} className="space-y-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-white block">Step 1: Enter Registered Mobile</span>
                  <span className="text-[11px] text-gray-400 block">
                    We will send a 4-digit verification code to your registered mobile number via WhatsApp / SMS.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Registered Mobile Number*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-medium">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={resetPhone}
                      onChange={(e) => setResetPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9848011111"
                      className="w-full bg-[#0E131F] border border-white/15 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266]"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isResettingPin || resetPhone.length !== 10}
                    className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-[#E68A00]/25 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                  >
                    {isResettingPin ? "Sending Code..." : "Send Verification Code"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                      setResetSuccessMessage("");
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-xl text-xs transition"
                  >
                    ← Back to Login
                  </button>
                </div>

                {/* Direct WhatsApp Emergency Admin Support */}
                <div className="pt-3 border-t border-white/10 text-center">
                  <span className="text-[11px] text-gray-400 block mb-1.5">Need instant help from operations?</span>
                  <a
                    href={`https://wa.me/917981067780?text=${encodeURIComponent(
                      `Namaste Osmida Dispatch, I am a Nellore partner (Phone: ${resetPhone || loginPhone || "..."}). I forgot my 4-digit PIN. Please help me reset it.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <span>Chat with Osmida Admin on WhatsApp</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPin} className="space-y-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-white block">Step 2: Enter Verification Code &amp; New PIN</span>
                  <span className="text-[11px] text-gray-400 block">
                    Code sent to +91 {resetPhone}.
                  </span>
                </div>

                {resetSuggestedOtp && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                    <span>Test OTP: <strong>{resetSuggestedOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setResetOtp(resetSuggestedOtp)}
                      className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-bold hover:bg-amber-500/30"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    4-Digit Verification Code (OTP)*
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266] tracking-widest text-center font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      New 4-Digit PIN*
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••"
                      className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266] tracking-widest text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Confirm PIN*
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={resetConfirmPin}
                      onChange={(e) => setResetConfirmPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••"
                      className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266] tracking-widest text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Aadhaar Last 4 Digits (Optional / Extra Security)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={resetAadhaarLast4}
                    onChange={(e) => setResetAadhaarLast4(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 8891"
                    className="w-full bg-[#0E131F] border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0C6266] tracking-widest text-center"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isResettingPin || resetOtp.length !== 4 || resetNewPin.length !== 4}
                    className="w-full bg-[#0C6266] hover:bg-[#0E757A] text-white font-bold py-2.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                  >
                    {isResettingPin ? "Verifying & Updating..." : "Verify Code & Save PIN"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResetStep("phone")}
                      className="w-1/2 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-xl text-[11px] transition"
                    >
                      ← Change Number
                    </button>
                    <button
                      type="button"
                      onClick={handleSendResetOtp}
                      disabled={isResettingPin}
                      className="w-1/2 bg-white/5 hover:bg-white/10 text-[#38B2AC] py-2 rounded-xl text-[11px] font-bold transition disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              </form>
            )
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
                        {(demo.categories || []).join(", ").toUpperCase() || "RESIDENTIAL HELP"} • {demo.assigned_hub} Hub ({demo.coverage_localities?.[0] || "Nellore"})
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
      <header className="sticky top-0 z-40 bg-[#101624]/98 backdrop-blur-lg border-b border-white/10 px-3 sm:px-4 py-2.5 shadow-lg">
        <div className="max-w-md mx-auto space-y-2">
          {/* ROW 1: PARTNER PROFILE & PRIMARY DISPATCH STATUS */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Partner Identity with Live Status Indicator */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-xl overflow-hidden border border-white/20 shadow-md bg-[#0A0E17] flex items-center justify-center">
                  <Image src="/icons/icon-192x192.png" alt="Osmida" width={32} height={32} className="object-contain" />
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#101624] ${
                    isOnline ? "bg-emerald-400" : "bg-gray-500"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                    {partner.name}
                  </h2>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" /> {partner.rating}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">
                  {partner.assigned_hub} Hub
                </p>
              </div>
            </div>

            {/* Right: Dual-Language Pill & Main ONLINE/OFFLINE Switch */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-black/60 p-0.5 rounded-full border border-white/15 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setLang("en");
                    try {
                      sessionStorage.setItem("osmida_partner_lang", "en");
                      localStorage.setItem("osmida_partner_lang", "en");
                    } catch {}
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    lang === "en"
                      ? "bg-[#0C6266] text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang("te");
                    try {
                      sessionStorage.setItem("osmida_partner_lang", "te");
                      localStorage.setItem("osmida_partner_lang", "te");
                    } catch {}
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    lang === "te"
                      ? "bg-[#E68A00] text-slate-950 font-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  తెలుగు
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleOnline}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black tracking-wide transition border cursor-pointer active:scale-95 ${
                  isOnline
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/30 ring-1 ring-emerald-500/30"
                    : "bg-gray-800/90 border-gray-600/60 text-gray-300 hover:bg-gray-700/90"
                }`}
              >
                <Power className={`w-3.5 h-3.5 ${isOnline ? "text-emerald-400 animate-pulse" : "text-gray-400"}`} />
                <span>{isOnline ? (lang === "te" ? "ఆన్‌లైన్" : "ONLINE") : (lang === "te" ? "ఆఫ్‌లైన్" : "OFFLINE")}</span>
              </button>
            </div>
          </div>

          {/* ROW 2: STATUS STRIP & FAST SHORTCUTS */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
            {/* Left: Locality & GPS */}
            <div className="flex items-center gap-1.5 text-gray-400 min-w-0 truncate">
              <MapPin className="w-3 h-3 text-[#38B2AC] shrink-0" />
              <span className="truncate">{partner.coverage_localities?.[0] || "Nellore"}</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] text-emerald-400 font-bold shrink-0">GPS Live</span>
              {batteryLevel !== null && (
                <span className="text-[9px] text-gray-400 hidden xs:inline shrink-0">⚡{batteryLevel}%</span>
              )}
            </div>

            {/* Right: Hub Call, SOS, Reset, Logout */}
            <div className="flex items-center gap-1 shrink-0">
              <a
                href="tel:9490122849"
                title="Call Nellore Hub Support (9490122849)"
                className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition cursor-pointer"
              >
                <Headphones className="w-2.5 h-2.5 text-emerald-400" />
                <span>Hub</span>
              </a>

              <button
                type="button"
                onClick={handleEmergencySos}
                disabled={isSendingSos}
                className="flex items-center gap-1 px-2 py-0.5 bg-red-600/25 hover:bg-red-600/40 text-red-300 border border-red-500/50 rounded-lg text-[10px] font-black transition cursor-pointer animate-pulse"
                title={t.emergencySos}
              >
                <Siren className="w-2.5 h-2.5 text-red-400" />
                <span>SOS</span>
              </button>

              <button
                type="button"
                onClick={handleResetJobs}
                title="Reset test data"
                className="p-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-300 border border-white/10 rounded-lg transition flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="p-1 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 rounded-lg transition flex items-center justify-center cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* OFFLINE DEVICE WARNING BANNER */}
      {!isDeviceOnline && (
        <div className="bg-amber-600/25 text-amber-200 border-b border-amber-500/40 px-3 py-1.5 text-center text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* ONLINE / OFFLINE STATUS PILL */}
      <div className={`px-3 py-1.5 text-center text-[11px] font-medium ${isOnline ? "bg-[#0C6266]/15 text-[#38B2AC] border-b border-[#0C6266]/20" : "bg-gray-800 text-gray-400 border-b border-gray-700"}`}>
        {isOnline ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.onlineStatus} • {partner.coverage_localities.slice(0, 2).join(", ")}</span>
          </span>
        ) : (
          <span>{t.offlineStatus}</span>
        )}
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4 py-3 space-y-3">
        {/* COMPACT DISPATCH AUDIO & PUSH ALERT TOOLBAR */}
        <div className="bg-[#121826] border border-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${buzzerPlaying ? "bg-[#E68A00] text-white animate-bounce" : "bg-[#0C6266]/20 text-[#38B2AC]"}`}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {lang === "te" ? "డిస్పాచ్ అలర్ట్ & వాయిస్" : "Dispatch Buzzer & Voice"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {isOnline ? (lang === "te" ? "కొత్త ఆర్డర్ వస్తే మోగుతుంది" : "Siren + Voice guidance active") : (lang === "te" ? "ఆఫ్‌లైన్ - అలర్ట్‌లు లేవు" : "Offline - Alerts paused")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                playJobAlertBuzzer();
                setTimeout(() => {
                  speakVoiceGuide(lang === "te" ? "కొత్త పని ఆర్డర్ వచ్చింది. దయచేసి చూడండి." : "New Osmida job order received. Please check.");
                }, 1200);
              }}
              disabled={buzzerPlaying}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                buzzerPlaying
                  ? "bg-[#E68A00] text-slate-950 font-black"
                  : "bg-white/10 hover:bg-white/15 text-gray-200 border border-white/15"
              }`}
            >
              <Bell className={`w-3 h-3 ${buzzerPlaying ? "animate-spin" : ""}`} />
              <span>{buzzerPlaying ? (lang === "te" ? "మోగుతోంది..." : "Playing...") : (lang === "te" ? "టెస్ట్ సౌండ్" : "Test Sound")}</span>
            </button>

            {pushNotificationStatus !== "granted" && (
              <button
                type="button"
                disabled={isEnablingPush}
                onClick={async () => {
                  if (typeof window === "undefined" || !("Notification" in window)) {
                    alert("Push notifications are not supported in this browser window. On iPhone Safari, tap Share > 'Add to Home Screen'.");
                    return;
                  }
                  setIsEnablingPush(true);
                  try {
                    const perm = await Notification.requestPermission();
                    setPushNotificationStatus(perm as any);
                    if (perm === "granted") {
                      playJobAlertBuzzer();
                      setStatusMessage({ type: "success", text: "Background alerts active!" });
                    }
                  } catch {} finally {
                    setIsEnablingPush(false);
                  }
                }}
                className="px-2 py-1 rounded-xl text-[10px] font-bold bg-[#0C6266] text-white transition cursor-pointer hover:bg-[#094e51] active:scale-95 shrink-0"
              >
                <span>{isEnablingPush ? "..." : "Push"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
              statusMessage.type === "success"
                ? "bg-[#0C6266]/20 border-[#0C6266]/30 text-[#38B2AC]"
                : "bg-red-500/15 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-[#38B2AC]" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
              <span className="truncate">{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-[11px] underline opacity-80 cursor-pointer shrink-0 ml-2">Dismiss</button>
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
                        {(job.category || "Residential Help").toUpperCase()} • 1 VISIT
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

                    {/* 45-SECOND DISPATCH URGENCY COUNTDOWN */}
                    <JobOfferCountdown
                      initialSeconds={45}
                      lang={lang}
                      onExpire={() => handleJobAction("decline", job.id)}
                    />

                    {/* ACCEPT / DECLINE BUTTONS */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          triggerHaptic(40);
                          handleJobAction("decline", job.id);
                        }}
                        disabled={isActionLoading}
                        className="w-full bg-white/10 hover:bg-white/15 text-gray-300 font-semibold py-2.5 rounded-xl text-xs transition active:scale-95"
                      >
                        {lang === "te" ? "తిరస్కరించండి" : "Decline"}
                      </button>
                      <button
                        onClick={() => {
                          triggerHaptic([60, 40, 60]);
                          handleJobAction("accept", job.id);
                        }}
                        disabled={isActionLoading}
                        className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#E68A00]/25 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        {lang === "te" ? "పనిని అంగీకరించండి" : "ACCEPT JOB"}
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
                  <div className="border border-emerald-500/40 rounded-2xl p-4 bg-black/60 text-center space-y-3 shadow-xl">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-black text-emerald-400">
                      <IndianRupee className="w-4 h-4" />
                      <span>{lang === "te" ? `కస్టమర్ చెల్లించాల్సిన మొత్తం: ₹${completedJobModal.qrData.amount}` : `Collect Payment: ₹${completedJobModal.qrData.amount}`}</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl inline-block mx-auto shadow-2xl border-4 border-emerald-500/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={completedJobModal.qrData.qrCodeUrl}
                        alt="Razorpay UPI QR"
                        width={220}
                        height={220}
                        className="rounded-lg object-contain mx-auto"
                        crossOrigin="anonymous"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-200">
                        {lang === "te" ? "PhonePe / Google Pay / Paytm ద్వారా స్కాన్ చేయండి" : "Scan via PhonePe • Google Pay • Paytm • BHIM"}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-semibold">
                        ⚡ Real Razorpay UPI Settlement • Instant Confirmation
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/91${completedJobModal.job.customer_phone}?text=${encodeURIComponent(
                          `Hello ${completedJobModal.job.customer_name}, your Osmida ${completedJobModal.job.service_name} (Ref: ${completedJobModal.job.reference_id}) is completed! Please tap here to pay ₹${completedJobModal.job.total_amount}: ${completedJobModal.qrData.paymentLink}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send on WhatsApp</span>
                      </a>
                      <a
                        href={completedJobModal.qrData.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/10 hover:bg-white/15 text-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1 border border-white/15 active:scale-95 cursor-pointer"
                      >
                        <span>Open Bill Link</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-6 text-emerald-400 text-xs font-bold bg-black/40 rounded-xl border border-white/10">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Real Razorpay UPI QR...</span>
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

                {/* PARTNER RATES CUSTOMER */}
                <div className="bg-black/40 rounded-xl p-3 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-gray-200 block text-center">
                    {t.rateCustomer}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCustomerRating(star)}
                        className="p-1 cursor-pointer transition transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= customerRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Feedback Chips */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {[t.customerPolite, t.easyEntry, t.timelyPayment].map((tag) => {
                      const selected = customerTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setCustomerTags(
                              selected
                                ? customerTags.filter((tg) => tg !== tag)
                                : [...customerTags, tag]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition border cursor-pointer ${
                            selected
                              ? "bg-[#0C6266]/30 border-[#0C6266] text-[#38B2AC]"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCompletedJobModal(null);
                    setCustomerRating(5);
                    setCustomerTags([]);
                  }}
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
                        lang === "te"
                          ? `నమస్కారం ${activeJob.customer_name} గారు, నేను మీ ఒస్మిడా పార్టనర్ ${partner.name}. మీ సర్వీస్ (${activeJob.service_name}, Ref: ${activeJob.reference_id}) కోసం బయలుదేరాను. త్వరలోనే మీ ఇంటికి చేరుకుంటాను.`
                          : `Namaste ${activeJob.customer_name}, I am your Osmida partner ${partner.name}. I have accepted your ${activeJob.service_name} booking (Ref: ${activeJob.reference_id}) and will be arriving shortly.`
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
                    {t.executionSteps}
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
                        {t.step1Title}
                      </span>
                      {activeJob.status === "dispatched" || activeJob.status === "in_progress" ? (
                        <span className="text-[10px] text-[#0C6266] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {t.dispatchedStatus}
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
                        {t.onTheWayBtn}
                      </button>
                    )}

                    {/* TURN-BY-TURN GOOGLE MAPS NAVIGATION BANNER */}
                    {activeJob.status === "dispatched" && (
                      <div className="bg-gradient-to-r from-emerald-950/60 to-[#0C6266]/30 border border-emerald-500/40 rounded-xl p-3 space-y-2 pt-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                            {t.headingToCustomer}
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
                          {t.startGps}
                        </a>

                        {/* 1-TAP AT APARTMENT GATE NOTIFICATION BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleJobAction("reach_gate", activeJob.id)}
                          disabled={isActionLoading || isAtGateReported}
                          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border ${
                            isAtGateReported
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default"
                              : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 cursor-pointer shadow-sm"
                          }`}
                        >
                          <Building2 className="w-4 h-4 text-amber-400" />
                          {isAtGateReported ? t.gateReported : t.atGateBtn}
                        </button>
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
                        {t.step2Title}
                      </span>
                      {activeJob.status === "in_progress" && (
                        <span className="text-[10px] text-[#0C6266] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {t.inProgressStatus}
                        </span>
                      )}
                    </div>

                    {activeJob.status === "in_progress" && (
                      <div className="space-y-2.5 pt-2 border-t border-white/10">
                        {/* LIVE STOPWATCH PROGRESS CARD */}
                        <div className="bg-black/50 border border-white/15 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#E68A00] animate-spin" style={{ animationDuration: "6s" }} />
                              {t.liveStopwatch}
                            </span>
                            <span className="font-mono text-sm font-extrabold text-white tracking-wider">
                              {formatDuration(elapsedSeconds)} / 60:00
                            </span>
                          </div>

                          {/* Visual Progress Bar (60 mins = 3600 secs) */}
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                elapsedSeconds > 3600
                                  ? "bg-rose-500 animate-pulse"
                                  : elapsedSeconds > 2700
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`}
                              style={{ width: `${Math.min(100, (elapsedSeconds / 3600) * 100)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                            <span>{t.hourlyJobTime}</span>
                            {elapsedSeconds > 3600 && (
                              <span className="text-rose-400 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {t.overtimeAlert}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount & +30 Mins Overtime Extension */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div>
                            <span className="text-gray-300 font-bold block">{t.bookingAmount}: ₹{activeJob.total_amount}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">{t.yourShare}: ₹{activeJob.payout_amount}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleJobAction("add_time", activeJob.id)}
                            disabled={isActionLoading}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> {t.extend30Mins}
                          </button>
                        </div>
                      </div>
                    )}

                    {activeJob.status === "dispatched" && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] text-gray-400">
                          {t.askOtpPrompt}
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
                            className="bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 font-extrabold px-4 py-1.5 rounded-lg text-xs transition cursor-pointer"
                          >
                            {t.verifyStartBtn}
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
                        {t.step3Title}
                      </span>
                    </div>

                    {activeJob.status === "in_progress" && (
                      <div className="space-y-3 pt-1">
                        {/* MANDATORY BEFORE & AFTER PHOTOS */}
                        <div>
                          <label className="text-[11px] text-gray-300 block mb-1.5 font-bold">
                            {t.photosLabel}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Before Photo with Real Camera + Canvas Compression */}
                            <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-black/40 space-y-2">
                              <input
                                ref={beforeCameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => handleCameraCapture(e, "before")}
                              />
                              <Camera className="w-5 h-5 text-amber-400 mx-auto" />
                              <span className="text-[10px] text-gray-300 block font-bold">1. {t.beforePhoto}</span>
                              {beforePhoto ? (
                                <div className="space-y-1">
                                  <div className="relative w-full h-20 rounded-lg overflow-hidden border border-emerald-500/40">
                                    <img src={beforePhoto} alt="Before work proof" className="w-full h-full object-cover" />
                                    <div className="absolute top-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => beforeCameraInputRef.current?.click()}
                                    className="text-[9px] text-gray-400 hover:text-white underline block mx-auto cursor-pointer"
                                  >
                                    Retake Photo
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <button
                                    type="button"
                                    onClick={() => beforeCameraInputRef.current?.click()}
                                    className="w-full text-[10px] font-bold text-slate-950 bg-[#E68A00] hover:bg-[#CC7A00] px-2 py-1.5 rounded-lg transition flex items-center justify-center gap-1 shadow cursor-pointer"
                                  >
                                    <Camera className="w-3 h-3" />
                                    {t.captureBefore}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setBeforePhoto(
                                        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80"
                                      )
                                    }
                                    className="text-[9px] text-gray-400 hover:text-gray-300 underline block mx-auto cursor-pointer"
                                  >
                                    Use Sample
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* After Photo with Real Camera + Canvas Compression */}
                            <div className="border border-dashed border-white/20 rounded-xl p-3 text-center bg-black/40 space-y-2">
                              <input
                                ref={afterCameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => handleCameraCapture(e, "after")}
                              />
                              <Camera className="w-5 h-5 text-emerald-400 mx-auto" />
                              <span className="text-[10px] text-gray-300 block font-bold">2. {t.afterPhoto}</span>
                              {afterPhoto ? (
                                <div className="space-y-1">
                                  <div className="relative w-full h-20 rounded-lg overflow-hidden border border-emerald-500/40">
                                    <img src={afterPhoto} alt="After work proof" className="w-full h-full object-cover" />
                                    <div className="absolute top-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full shadow">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => afterCameraInputRef.current?.click()}
                                    className="text-[9px] text-gray-400 hover:text-white underline block mx-auto cursor-pointer"
                                  >
                                    Retake Photo
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <button
                                    type="button"
                                    onClick={() => afterCameraInputRef.current?.click()}
                                    className="w-full text-[10px] font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-2 py-1.5 rounded-lg transition flex items-center justify-center gap-1 shadow cursor-pointer"
                                  >
                                    <Camera className="w-3 h-3" />
                                    {t.captureAfter}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAfterPhoto(
                                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80"
                                      )
                                    }
                                    className="text-[9px] text-gray-400 hover:text-gray-300 underline block mx-auto cursor-pointer"
                                  >
                                    Use Sample
                                  </button>
                                </div>
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
                              {t.skipPhotosLabel}
                            </label>
                          </div>
                        </div>

                        {/* END OTP INPUT (FROM CUSTOMER) */}
                        <div className="bg-black/40 rounded-xl p-3 border border-white/10 space-y-1.5">
                          <label className="text-[11px] text-gray-300 block font-bold">
                            {t.enterEndOtp}
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
                            {t.paymentPending}: ₹{activeJob.total_amount} — QR generated on completion
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
                              ? (lang === "te" ? "ముగించడానికి 2 ఫోటోలు అప్‌లోడ్ చేయండి" : "Upload Both Photos to Complete")
                              : !endOtpInput.trim()
                              ? (lang === "te" ? "కస్టమర్ ఎండ్ OTP నమోదు చేయండి" : "Enter Customer End OTP to Complete")
                              : isActionLoading
                              ? (lang === "te" ? "పని ముగింపు నమోదు అవుతోంది..." : "Completing Job...")
                              : t.completeJobBtn}
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
              <div className="text-center py-10 px-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  isOnline ? "bg-[#0C6266]/25 text-[#0C6266]" : "bg-gray-800 text-gray-400"
                }`}>
                  {isOnline ? (
                    <ShieldCheck className="w-7 h-7" />
                  ) : (
                    <Power className="w-7 h-7 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {isOnline
                      ? (lang === "te" ? "ప్రస్తుతం కొత్త పనులు లేవు" : "No Active Jobs Right Now")
                      : (lang === "te" ? "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు" : "You Are Currently Offline")}
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    {isOnline
                      ? (lang === "te"
                          ? `మీరు ఆన్‌లైన్‌లో ఉన్నారు. ${partner.assigned_hub} నెల్లూరులో కస్టమర్ బుక్ చేయగానే అలర్ట్ వస్తుంది.`
                          : `Keep your status ONLINE. As soon as a customer books in ${partner.assigned_hub} Nellore, you will receive an alert.`)
                      : (lang === "te"
                          ? "కొత్త ఆర్డర్‌లను స్వీకరించడానికి పైన ఉన్న బటన్ ద్వారా లేదా ఇక్కడ ఆన్‌లైన్‌కు మారండి."
                          : "New job alerts are paused while offline. Toggle to ONLINE whenever you are ready to receive bookings.")}
                  </p>
                </div>
                {!isOnline ? (
                  <button
                    type="button"
                    onClick={handleToggleOnline}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" /> {lang === "te" ? "ఆన్‌లైన్‌కు మారండి" : "Go Online Now"}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => fetchJobs(partner.id, true)}
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
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: EARNINGS & PAYOUTS                                     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "earnings" && (() => {
          const totalEarningsToday = (completedJobs.length > 0 ? completedJobs.reduce((sum, j) => sum + (j.payout_amount || 0), 0) : 0) + (partner.payout_balance || 0);
          const cashCollectedToday = completedJobs.filter(j => j.payment_status === "cash_collected" || (j as any).payment_method === "cash").reduce((sum, j) => sum + (j.total_amount || 0), 0);
          const netUpiPayable = Math.max(0, totalEarningsToday - cashCollectedToday);

          return (
            <div className="space-y-4">
              {/* Daily Settlement Card */}
              <div className="bg-gradient-to-br from-[#121c2e] via-[#0E1524] to-[#162138] border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {t.dailySettlement}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Nellore Central Hub • Today&apos;s Ledger
                    </span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Auto-UPI 9:00 PM
                  </span>
                </div>

                {/* Balance Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block">{t.totalEarnedToday}</span>
                    <span className="text-xl font-black text-emerald-400">₹{totalEarningsToday}</span>
                    <span className="text-[9px] text-gray-500 block">70% Partner Share</span>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] text-gray-400 block">{t.cashInHand}</span>
                    <span className="text-xl font-black text-amber-300">₹{cashCollectedToday}</span>
                    <span className="text-[9px] text-gray-500 block">Directly in Hand</span>
                  </div>
                </div>

                {/* Net Payout row */}
                <div className="bg-black/50 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-300 font-semibold block">{t.netUpiTransfer}</span>
                    <span className="text-[10px] text-gray-400">{t.settledTonight}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#0C6266]">₹{netUpiPayable}</span>
                    <span className="text-[9px] text-gray-400 block">via Razorpay X</span>
                  </div>
                </div>

                {/* Verified UPI badge */}
                <div className="bg-black/30 rounded-xl p-2.5 text-xs flex items-center justify-between border border-white/10">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-gray-300">{t.registeredUpi}:</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-white text-[11px]">
                    <span>{partner.upi_id || `${partner.phone}@upi`}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-sans font-semibold">
                      {t.verifiedUpiBadge}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Payout request of ₹${netUpiPayable || partner.payout_balance} initiated to ${partner.upi_id || partner.phone + "@upi"}. Funds will settle within 2 hours.`)}
                  className="w-full bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#E68A00]/20 cursor-pointer"
                >
                  <IndianRupee className="w-4 h-4" />
                  {t.instantTransferBtn}
                </button>

                {/* 1-TAP SHARE EOD SLIP ON WHATSAPP */}
                <a
                  href={`https://wa.me/91${partner.phone}?text=${encodeURIComponent(
                    lang === "te"
                      ? `*ఒస్మిడా నెల్లూరు - రోజువారీ పార్టనర్ పేస్లిప్*\n📅 తేదీ: ${new Date().toLocaleDateString("en-IN")}\n👤 పార్టనర్: ${partner.name} (${partner.phone})\n✅ పూర్తి చేసిన పనులు: ${completedJobs.length}\n💰 మొత్తం సంపాదన (70%): ₹${totalEarningsToday}\n💵 చేతికి అందిన నగదు: ₹${cashCollectedToday}\n🏦 రాత్రి 9:00 UPI బదిలీ: ₹${netUpiPayable}\n💳 జమ అయ్యే UPI: ${partner.upi_id || partner.phone + "@upi"}\n📞 నెల్లూరు హబ్ హెల్ప్‌లైన్: 9490122849`
                      : `*OSMIDA NELLORE - DAILY PARTNER PAYSLIP*\n📅 Date: ${new Date().toLocaleDateString("en-IN")}\n👤 Partner: ${partner.name} (${partner.phone})\n✅ Completed Jobs: ${completedJobs.length}\n💰 Total Service Earnings (70%): ₹${totalEarningsToday}\n💵 Cash In Hand: ₹${cashCollectedToday}\n🏦 Net 9:00 PM UPI Settlement: ₹${netUpiPayable}\n💳 Target UPI ID: ${partner.upi_id || partner.phone + "@upi"}\n📞 Nellore Hub Support: 9490122849`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer mt-2"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === "te" ? "నేటి సంపాదనను వాట్సాప్‌లో పంపండి" : "Share Today's Ledger on WhatsApp"}</span>
                </a>
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
                  {t.completedJobsHistory}
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
                    {t.noCompletedJobs}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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

            {/* Refer / Share Partner Portal */}
            <div className="bg-[#0C6266]/15 border border-[#0C6266]/30 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#38B2AC]" />
                <span className="font-bold text-white">Invite Another Helper to Osmida</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Know someone looking for house cleaning, kitchen cleaning, or domestic help work in Nellore? Share the partner registration portal.
              </p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Namaste! Join Osmida as a verified house cleaning, kitchen cleaning, or domestic help partner in Nellore. Earn daily payouts with 70% share and instant 9:00 PM settlements: https://osmida.com/partner"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition text-xs shadow-md shadow-emerald-950/40"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share Partner Link on WhatsApp</span>
              </a>
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#101624]/95 backdrop-blur-xl border-t border-white/10 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-3 text-center px-2">
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition cursor-pointer active:scale-95 ${
              activeTab === "jobs"
                ? "text-[#38B2AC] font-black"
                : "text-gray-400 hover:text-gray-200 font-semibold"
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5" />
              {offeredJobs.length > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#E68A00] text-slate-950 text-[10px] font-black flex items-center justify-center animate-bounce">
                  {offeredJobs.length}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-wide">{t.navJobs}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition cursor-pointer active:scale-95 ${
              activeTab === "earnings"
                ? "text-[#38B2AC] font-black"
                : "text-gray-400 hover:text-gray-200 font-semibold"
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[11px] tracking-wide">{t.navEarnings}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-xl transition cursor-pointer active:scale-95 ${
              activeTab === "profile"
                ? "text-[#38B2AC] font-black"
                : "text-gray-400 hover:text-gray-200 font-semibold"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] tracking-wide">{t.navProfile}</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
