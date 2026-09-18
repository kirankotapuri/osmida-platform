"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Maximize,
  Tv,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  MapPin,
  Calendar,
  Star,
  Check,
  Smartphone,
} from "lucide-react";
import { Language } from "@/lib/translations";

interface HowItWorksVideoSectionProps {
  lang: Language;
  onOpenBookingModal?: (serviceId: "pest" | "ac" | "cleaning") => void;
  customVideoUrl?: string;
  defaultService?: "ac" | "pest" | "cleaning";
  sectionId?: string;
}

export function HowItWorksVideoSection({
  lang,
  onOpenBookingModal,
  customVideoUrl,
  defaultService = "ac",
  sectionId = "how-to-book-video",
}: HowItWorksVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [showRealVideo, setShowRealVideo] = useState(false);

  // Autonomous animation timer ensuring 100% guaranteed playback & animation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration - 0.25) {
            setIsPlaying(false);
            return 0;
          }
          return +(prev + 0.25).toFixed(2);
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (_) {}
      }
    } else {
      if (currentTime >= duration - 1) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = currentTime;
          videoRef.current.muted = true; // Muted playback is permitted across all browsers
          await videoRef.current.play();
        } catch (err) {
          console.warn("Video element fallback to animated webapp simulation:", err);
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = val;
      } catch (_) {}
    }
  };

  const handleJumpToStep = (targetSec: number) => {
    setCurrentTime(targetSec);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = targetSec;
      } catch (_) {}
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } catch (_) {}
    }
    setIsPlaying(true);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const handleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Synchronized Telugu & English captions for audio timestamps
  const getSubtitles = () => {
    if (currentTime < 11) {
      return {
        step: 1,
        phase: "service-selection",
        te: "దశ 1: ఒస్మిడా వెబ్‌సైట్‌లో ఏసీ సర్వీస్, పురుగుల నివారణ, లేదా హోమ్ క్లీనింగ్ ఎంచుకోండి.",
        en: "Step 1: Select verified AC service, pest control, or deep cleaning with clear prices.",
      };
    } else if (currentTime < 23) {
      return {
        step: 2,
        phase: "booking-slot",
        te: "దశ 2: మీ నెల్లూరు ఏరియా, సమయం నమోదు చేయండి. ₹0 అడ్వాన్స్ • 30 నిమిషాల్లో కాల్ వస్తుంది.",
        en: "Step 2: Pick your Nellore locality and time slot. ₹0 Advance • 30-min pro arrival.",
      };
    } else if (currentTime < 35) {
      return {
        step: 3,
        phase: "pro-arrival",
        te: "దశ 3: అధికారిక బ్లాక్ యూనిఫామ్‌తో ధృవీకరించబడిన లోకల్ నిపుణుడు మీ ఇంటి వద్దకు వస్తారు.",
        en: "Step 3: Verified local technician arrives in official black Osmida uniform with tools.",
      };
    } else {
      return {
        step: 4,
        phase: "inspection-pay",
        te: "దశ 4: సర్వీస్ పూర్తయి, మీరు సంతృప్తి చెందిన తర్వాతే చెల్లించండి. ₹0 ముందస్తు అడ్వాన్స్!",
        en: "Step 4: Quality inspected. Pay via UPI or Cash only after 100% satisfaction. ₹0 Advance!",
      };
    }
  };

  const currentSubtitle = getSubtitles();

  const steps = [
    {
      num: "01",
      sec: 0,
      icon: CheckCircle2,
      titleEn: "Choose Service",
      titleTe: "సర్వీస్ ఎంచుకోండి",
      descEn: "Select AC, Pest Control, or Cleaning package with fixed Nellore prices.",
      descTe: "నిర్ణీత రేట్లతో మీకు అవసరమైన సర్వీస్ ప్యాకేజీని ఎంచుకోండి.",
    },
    {
      num: "02",
      sec: 12,
      icon: Clock,
      titleEn: "Select Time Slot",
      titleTe: "సమయాన్ని నిర్ణయించండి",
      descEn: "Pick your preferred date & time. No app download or password needed.",
      descTe: "యాప్ డౌన్‌లోడ్ లేకుండా కేవలం మీ ఫోన్ నంబర్‌తో స్లాట్ ఎంచుకోండి.",
    },
    {
      num: "03",
      sec: 24,
      icon: ShieldCheck,
      titleEn: "Verified Pro Arrival",
      titleTe: "నిపుణుడి రాక",
      descEn: "Technician arrives in official black Osmida uniform with complete kit.",
      descTe: "అధికారిక బ్లాక్ యూనిఫామ్ & టూల్స్‌తో లోకల్ టెక్నీషియన్ వస్తారు.",
    },
    {
      num: "04",
      sec: 36,
      icon: CreditCard,
      titleEn: "Pay After Service",
      titleTe: "పని చూశాకే చెల్లింపు",
      descEn: "Inspect service first. Pay ₹0 advance, only after 100% satisfaction.",
      descTe: "పని చూసి సంతృప్తి చెందిన తర్వాతే చెల్లించండి. ₹0 ముందస్తు అడ్వాన్స్.",
    },
  ];

  return (
    <section
      id={sectionId}
      className="bg-slate-50/80 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>{lang === "te" ? "లైవ్ వెబ్‌యాప్ యానిమేషన్" : "Interactive WebApp Demo"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
            {lang === "te"
              ? "ఒస్మిడాలో సర్వీస్ బుకింగ్ ఎలా పనిచేస్తుంది?"
              : "How Osmida Works in Nellore"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {lang === "te"
              ? "కేవలం 60 సెకన్లలో బుకింగ్ పూర్తవుతుంది. ఎటువంటి ముందస్తు అడ్వాన్స్ లేదు. స్థానిక నిపుణుల ద్వారా నమ్మకమైన సేవలు."
              : "Book in 60 seconds with ₹0 advance payment. Partnered with verified Nellore technicians for hassle-free doorstep service."}
          </p>
        </div>

        {/* 4-Step Clickable Sequence Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isActive = currentSubtitle.step === idx + 1;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleJumpToStep(step.sec)}
                className={`relative flex flex-col justify-between rounded-2xl p-3 sm:p-4 text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md border-2 border-emerald-500 scale-[1.02]"
                    : "bg-white text-slate-900 border border-slate-200/90 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl shadow-2xs ${
                        isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-black ${
                        isActive ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      STEP {step.num}
                    </span>
                  </div>
                  <h3
                    className={`text-xs sm:text-sm font-black mb-1 leading-tight ${
                      isActive ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {lang === "te" ? step.titleTe : step.titleEn}
                  </h3>
                  <p
                    className={`text-[11px] leading-snug line-clamp-2 ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {lang === "te" ? step.descTe : step.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Animated WebApp Video Player Card */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                ▶
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {lang === "te" ? "45-సెకన్ల వీడియో & వెబ్‌యాప్ డెమో" : "45-Second Interactive WebApp Video"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {lang === "te" ? "నెల్లూరు హోమ్ సర్వీసెస్ బుకింగ్ డెమో" : "Live step-by-step service walkthrough"}
                </p>
              </div>
            </div>

            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {lang === "te" ? "లైవ్ యానిమేషన్ నడుస్తోంది" : "Live Animation Playing"}
              </span>
            )}
          </div>

          {/* Video / Animated Simulation Container */}
          <div
            ref={containerRef}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner group select-none"
          >
            {/* Real Video Element (Plays in background or when video file decoded) */}
            <video
              ref={videoRef}
              src="/videos/how-to-book-telugu.mp4"
              poster="/images/how-to-book-telugu-thumb.jpg"
              playsInline
              preload="metadata"
              muted={isMuted}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                showRealVideo ? "opacity-100 z-10" : "opacity-30 pointer-events-none"
              }`}
              onClick={handlePlayPause}
            />

            {/* INTERACTIVE WEBAPP ANIMATION STAGE (Animates According to Our WebApp) */}
            {!showRealVideo && (
              <div
                className="absolute inset-0 z-0 flex flex-col justify-between p-3 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white cursor-pointer"
                onClick={handlePlayPause}
              >
                {/* Mock App Header Strip */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-[10px]">
                      O
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black tracking-wider text-white">OSMIDA</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                          NELLORE
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400">Doorstep Home Services • ₹0 Advance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-bold text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Scene {currentSubtitle.step}/4</span>
                  </div>
                </div>

                {/* DYNAMIC SCENE DISPLAY BASED ON CURRENT TIME */}
                <div className="my-auto py-1">
                  {/* SCENE 1: 0s - 11s -> SERVICE SELECTION */}
                  {currentSubtitle.phase === "service-selection" && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          1. Select Your Service
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">Tap to Choose</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* AC Service Card */}
                        <div
                          className={`rounded-xl p-2 text-center transition-all ${
                            defaultService === "ac"
                              ? "bg-emerald-500/20 border-2 border-emerald-400 scale-[1.03] shadow-md shadow-emerald-500/20"
                              : "bg-white/10 border border-white/10"
                          }`}
                        >
                          <div className="relative h-12 w-full rounded-lg overflow-hidden mb-1">
                            <Image
                              src="/images/service-ac-v2.jpg"
                              alt="AC Service"
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">AC Foam Jet</div>
                          <div className="text-[10px] font-black text-emerald-400">₹599</div>
                        </div>

                        {/* Pest Control Card */}
                        <div
                          className={`rounded-xl p-2 text-center transition-all ${
                            defaultService === "pest"
                              ? "bg-emerald-500/20 border-2 border-emerald-400 scale-[1.03] shadow-md shadow-emerald-500/20"
                              : "bg-white/10 border border-white/10"
                          }`}
                        >
                          <div className="relative h-12 w-full rounded-lg overflow-hidden mb-1">
                            <Image
                              src="/images/service-pest-v2.jpg"
                              alt="Pest Control"
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">Pest Control</div>
                          <div className="text-[10px] font-black text-emerald-400">₹1,499</div>
                        </div>

                        {/* Bathroom Cleaning Card */}
                        <div
                          className={`rounded-xl p-2 text-center transition-all ${
                            defaultService === "cleaning"
                              ? "bg-emerald-500/20 border-2 border-emerald-400 scale-[1.03] shadow-md shadow-emerald-500/20"
                              : "bg-white/10 border border-white/10"
                          }`}
                        >
                          <div className="relative h-12 w-full rounded-lg overflow-hidden mb-1">
                            <Image
                              src="/images/service-cleaning-bathroom.jpg"
                              alt="Bathroom Cleaning"
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">Bath & Kitchen</div>
                          <div className="text-[10px] font-black text-emerald-400">₹449</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-emerald-950/80 border border-emerald-500/40 p-2 text-[10px] text-emerald-200">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span>Added to Cart • ₹0 Advance Payment</span>
                        </span>
                        <span className="font-mono font-black text-white">Cart: 1 item</span>
                      </div>
                    </div>
                  )}

                  {/* SCENE 2: 11s - 23s -> CHOOSE LOCALITY & TIME SLOT */}
                  {currentSubtitle.phase === "booking-slot" && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                          2. Nellore Locality & Slot
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">60-Sec Fast Booking</span>
                      </div>

                      <div className="rounded-xl bg-white/10 border border-white/15 p-2.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/10">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="font-bold">Magunta Layout, Nellore</span>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                            Servicing Area
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Calendar className="h-3.5 w-3.5 text-blue-400" />
                            <span className="font-bold">Today • 04:00 PM Slot</span>
                          </div>
                          <span className="text-[9px] font-bold text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded">
                            30-Min Arrival
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-2 text-white shadow-md">
                        <span className="text-[11px] font-black">
                          {lang === "te" ? "బుకింగ్ నిర్ధారించండి (₹0 అడ్వాన్స్)" : "Confirm Booking (₹0 Advance)"}
                        </span>
                        <span className="text-[10px] bg-white text-slate-900 px-2 py-0.5 rounded font-black">
                          CONFIRMED ✓
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SCENE 3: 23s - 35s -> VERIFIED PRO ARRIVAL IN UNIFORM */}
                  {currentSubtitle.phase === "pro-arrival" && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          3. Verified Pro Arrival
                        </span>
                        <span className="text-[9px] font-bold text-emerald-400">On The Way</span>
                      </div>

                      <div className="rounded-xl bg-white/10 border border-white/15 p-2.5 flex items-center gap-3">
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-white/30 shrink-0">
                          <Image
                            src="/images/service-ac-v2.jpg"
                            alt="Technician"
                            fill
                            className="object-cover object-top"
                            sizes="56px"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-white truncate">Suresh K. (Osmida Pro)</h5>
                            <span className="flex items-center text-[10px] text-amber-400 font-bold">
                              ★ 4.9 (1.2k)
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-300">Official Black Osmida Uniform • Verified Kit</p>
                          <div className="flex items-center gap-2 pt-0.5 text-[9px] text-emerald-300 font-bold">
                            <span>✓ Background Checked</span>
                            <span>✓ Direct Nellore Partner</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-800/90 border border-white/10 p-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-300">Pro Dispatch Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Doorstep Arrival Confirmed
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SCENE 4: 35s - 45s -> INSPECT WORK & PAY AFTER SERVICE */}
                  {currentSubtitle.phase === "inspection-pay" && (
                    <div className="space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          4. Work Done & Pay After
                        </span>
                        <span className="text-[9px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded">
                          100% Satisfied
                        </span>
                      </div>

                      <div className="rounded-xl bg-white/10 border border-white/15 p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/10">
                          <span className="text-slate-300">Doorstep Work Inspection:</span>
                          <span className="text-emerald-400 font-black">Passed & Verified ✓</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/10">
                          <span className="text-slate-300">Advance Paid:</span>
                          <span className="text-white font-bold">₹0 (Zero Advance)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-white">Amount Due After Inspection:</span>
                          <span className="text-emerald-400 text-sm">UPI / Cash</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black">
                        <span>★★★★★</span>
                        <span className="text-[10px] text-slate-300 font-medium ml-1">
                          {lang === "te" ? "నెల్లూరు వినియోగదారుల రేటింగ్" : "Rated 4.9/5 in Nellore"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle Bar Inside Video Container */}
                <div className="rounded-xl bg-black/85 backdrop-blur-md border border-white/15 p-2 text-center">
                  <p className="text-[11px] sm:text-xs font-black text-white leading-snug">
                    🗣️ {currentSubtitle.te}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-300 mt-0.5 leading-snug">
                    {currentSubtitle.en}
                  </p>
                </div>
              </div>
            )}

            {/* Big Center Play Overlay (When Paused) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 backdrop-blur-2xs cursor-pointer transition-opacity"
                onClick={handlePlayPause}
              >
                <button
                  type="button"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Play Video"
                >
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1 fill-slate-900" />
                </button>
                <span className="mt-3 text-xs sm:text-sm font-black text-white drop-shadow-md bg-black/70 px-4 py-1.5 rounded-full border border-white/20">
                  {lang === "te" ? "▶ వెబ్‌యాప్ వీడియో ప్లే చేయండి" : "▶ Watch Live WebApp Demo (45s)"}
                </span>
              </div>
            )}

            {/* Switcher if external exists */}
            {customVideoUrl && (
              <button
                onClick={() => setShowRealVideo(!showRealVideo)}
                className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 cursor-pointer"
              >
                <Tv className="h-3 w-3 text-blue-400" />
                <span>{showRealVideo ? "Animation" : "Video"}</span>
              </button>
            )}

            {/* Scrubber Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-2.5 sm:p-3 z-30 flex flex-col gap-1.5">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                    title="Restart"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-200">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1.5 rounded-md hover:bg-white/20 transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    <span className="hidden sm:inline font-bold">
                      {isMuted ? "Muted" : "Telugu Audio"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFullScreen}
                    className="p-1.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
                    title="Full Screen"
                  >
                    <Maximize className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clean 1-Tap Booking CTA below video */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-100">
            <span className="text-xs text-slate-600 font-medium text-center sm:text-left">
              {lang === "te"
                ? "ఎటువంటి ముందస్తు చెల్లింపు లేదు • 30 నిమిషాల్లో కాల్ వస్తుంది"
                : "₹0 Advance payment • Local technician confirmed in 30 minutes"}
            </span>
            <button
              type="button"
              onClick={() => onOpenBookingModal?.(defaultService)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black px-4 py-2 text-xs font-black text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>{lang === "te" ? "సర్వీస్ ప్లాన్లు చూడండి" : "Explore Service Plans"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
