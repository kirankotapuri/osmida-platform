"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Language } from "@/lib/translations";

interface HowItWorksVideoSectionProps {
  lang: Language;
  onOpenBookingModal?: (serviceId: "pest" | "ac" | "cleaning") => void;
  customVideoUrl?: string;
}

export function HowItWorksVideoSection({
  lang,
  onOpenBookingModal,
  customVideoUrl,
}: HowItWorksVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [showRealVideo, setShowRealVideo] = useState(false);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        if (currentTime >= duration - 1) {
          video.currentTime = 0;
          setCurrentTime(0);
        }
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Video play error:", err);
        video.muted = false;
        video.play().then(() => setIsPlaying(true)).catch((e) => console.error(e));
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
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
    if (currentTime < 6) {
      return {
        te: "నమస్కారం! నెల్లూరులో ఒస్మిడా హోమ్ సర్వీసెస్ బుక్ చేసుకోవడం చాలా సులభం.",
        en: "Welcome! Booking home services on Osmida in Nellore is super easy.",
      };
    } else if (currentTime < 16) {
      return {
        te: "దశ 1: ఒస్మిడా వెబ్‌సైట్‌లో ఏసీ సర్వీస్, పురుగుల నివారణ, లేదా హోమ్ డీప్ క్లీనింగ్ ఎంచుకోండి.",
        en: "Step 1: Select AC services, pest control, or home deep cleaning with clear prices.",
      };
    } else if (currentTime < 28) {
      return {
        te: "దశ 2: మీ నెల్లూరు ఏరియా, సమయం మరియు మొబైల్ నంబర్ నమోదు చేయండి. పాస్‌వర్డ్ లేదా లాగిన్ అవసరం లేదు.",
        en: "Step 2: Enter your Nellore locality, time, and mobile number. No password or login needed.",
      };
    } else if (currentTime < 38) {
      return {
        te: "దశ 3: వెంటనే బుకింగ్ కన్ఫర్మ్ అవుతుంది. 30 నిమిషాల్లో మా నెల్లూరు టీమ్ కాల్ చేసి సమయాన్ని ఖరారు చేస్తారు.",
        en: "Step 3: Instant booking confirmation. Our Nellore team calls in 30 mins to confirm arrival.",
      };
    } else {
      return {
        te: "అధికారిక బ్లాక్ యూనిఫామ్‌తో టెక్నీషియన్ వచ్చి పని చేస్తారు. ₹0 అడ్వాన్స్ • పని చూశాకే చెల్లించండి!",
        en: "Established local technician arrives in official black uniform. ₹0 advance • Pay only after inspecting work!",
      };
    }
  };

  const currentSubtitle = getSubtitles();

  const steps = [
    {
      num: "01",
      icon: CheckCircle2,
      titleEn: "Choose Service",
      titleTe: "సర్వీస్ ఎంచుకోండి",
      descEn: "Select AC, Pest Control, or Cleaning package with fixed Nellore prices.",
      descTe: "నిర్ణీత రేట్లతో మీకు అవసరమైన సర్వీస్ ప్యాకేజీని ఎంచుకోండి.",
    },
    {
      num: "02",
      icon: Clock,
      titleEn: "Select Time Slot",
      titleTe: "సమయాన్ని నిర్ణయించండి",
      descEn: "Pick your preferred date & time. No app download or password needed.",
      descTe: "యాప్ డౌన్‌లోడ్ లేకుండా కేవలం మీ ఫోన్ నంబర్‌తో స్లాట్ ఎంచుకోండి.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      titleEn: "Pay After Service",
      titleTe: "పని చూశాకే చెల్లింపు",
      descEn: "Verified local pro arrives in uniform. Pay ₹0 advance, only after satisfaction.",
      descTe: "అధికారిక యూనిఫామ్‌లో నిపుణుడు వస్తారు. ₹0 అడ్వాన్స్, పని చూశాకే చెల్లించండి.",
    },
  ];

  return (
    <section
      id="how-to-book-video"
      className="bg-slate-50/80 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Header (Light, clean, high-contrast) */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>{lang === "te" ? "సులభమైన 3 దశలు" : "Simple 3-Step Process"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {lang === "te"
              ? "ఒస్మిడాలో సర్వీస్ బుకింగ్ ఎలా పనిచేస్తుంది?"
              : "How Osmida Works in Nellore"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {lang === "te"
              ? "కేవలం 60 సెకన్లలో బుకింగ్ పూర్తవుతుంది. ఎటువంటి ముందస్తు అడ్వాన్స్ లేదు. స్థానిక నిపుణుల ద్వారా నమ్మకమైన సేవలు."
              : "Book in 60 seconds without advance payment. Partnered with established local pros for hassle-free doorstep service."}
          </p>
        </div>

        {/* 3 Step Visual Flow Cards (High-Contrast, Airy, Human-Friendly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-slate-400 font-mono tracking-wider">
                      STEP {step.num}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">
                    {lang === "te" ? step.titleTe : step.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === "te" ? step.descTe : step.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Elegant 45s Telugu Video Card (No Clumsy Over-Sized Dark Blue Clash) */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                ▶
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {lang === "te" ? "45-సెకన్ల వీడియో గైడ్ (తెలుగులో)" : "45-Second Telugu Explainer Video"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {lang === "te" ? "నెల్లూరు హోమ్ సర్వీసెస్ బుకింగ్ డెమో" : "Step-by-step booking walkthrough"}
                </p>
              </div>
            </div>

            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                {lang === "te" ? "ఆడియో ప్లే అవుతోంది" : "Playing Audio"}
              </span>
            )}
          </div>

          {/* Video Container */}
          <div
            ref={containerRef}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner group"
          >
            {showRealVideo && customVideoUrl ? (
              <iframe
                src={customVideoUrl}
                title="How to Book Osmida Services in Telugu"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src="/videos/how-to-book-telugu.mp4"
                  poster="/images/how-to-book-telugu-thumb.jpg"
                  playsInline
                  preload="metadata"
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current && videoRef.current.duration) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handlePlayPause}
                />

                {/* Big Play Overlay */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 backdrop-blur-2xs cursor-pointer transition-opacity"
                    onClick={handlePlayPause}
                  >
                    <button
                      type="button"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
                      aria-label="Play Video"
                    >
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1 fill-slate-900" />
                    </button>
                    <span className="mt-3 text-xs sm:text-sm font-black text-white drop-shadow-md bg-black/60 px-3.5 py-1 rounded-full border border-white/20">
                      {lang === "te" ? "▶ వీడియో ప్లే చేయండి" : "▶ Watch 45s Telugu Guide"}
                    </span>
                  </div>
                )}

                {/* Switcher if external exists */}
                {customVideoUrl && (
                  <button
                    onClick={() => setShowRealVideo(!showRealVideo)}
                    className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20"
                  >
                    <Tv className="h-3 w-3 text-blue-400" />
                    <span>{showRealVideo ? "Internal" : "YouTube"}</span>
                  </button>
                )}

                {/* Synced Subtitle Banner (Light high-contrast pill) */}
                <div className="absolute bottom-12 left-2 right-2 sm:left-6 sm:right-6 z-20 pointer-events-none">
                  <div className="bg-black/85 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5 max-w-xl mx-auto shadow-lg text-center">
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-snug">
                      🗣️ {currentSubtitle.te}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-300 mt-0.5">
                      {currentSubtitle.en}
                    </p>
                  </div>
                </div>

                {/* Scrubber Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2.5 sm:p-3 z-20 flex flex-col gap-1.5">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        className="p-1 rounded-md hover:bg-white/20 transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleRestart}
                        className="p-1 rounded-md hover:bg-white/20 transition-colors"
                        title="Restart"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                      <span className="text-[10px] font-mono font-bold text-slate-200">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1 rounded-md hover:bg-white/20 transition-colors flex items-center gap-1 text-[10px]"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span className="hidden sm:inline font-bold">
                          {isMuted ? "Muted" : "Telugu"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleFullScreen}
                        className="p-1 rounded-md hover:bg-white/20 transition-colors"
                        title="Full Screen"
                      >
                        <Maximize className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
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
              onClick={() => onOpenBookingModal?.("ac")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black px-4 py-2 text-xs font-black text-white shadow-xs transition-all active:scale-95"
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
