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
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Language } from "@/lib/translations";

interface HowItWorksVideoSectionProps {
  lang: Language;
  onOpenBookingModal?: (serviceId: "pest" | "ac" | "cleaning") => void;
  sectionId?: string;
}

export function HowItWorksVideoSection({
  lang,
  onOpenBookingModal,
  sectionId = "how-to-book-video",
}: HowItWorksVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);

  // Synchronize state with video element events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= duration - 0.5) {
        videoRef.current.currentTime = 0;
      }

      // Try playing with audio unmuted first (since this is triggered by user gesture)
      try {
        videoRef.current.muted = isMuted;
        await videoRef.current.play();
        setIsPlaying(true);
        setAudioBlocked(false);
      } catch (err) {
        console.warn("Unmuted play blocked by browser policy, falling back to muted:", err);
        // Fallback to muted playback if browser restricts audio
        try {
          videoRef.current.muted = true;
          setIsMuted(true);
          setAudioBlocked(true);
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (fatal) {
          console.error("Video play failed:", fatal);
        }
      }
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      setAudioBlocked(false);
      // Ensure volume is up
      videoRef.current.volume = 1.0;
    }
  };

  const handleUnmuteDirect = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.volume = 1.0;
    setIsMuted(false);
    setAudioBlocked(false);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleJumpToStep = (targetSec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
      if (!isPlaying) {
        videoRef.current.muted = isMuted;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          videoRef.current!.muted = true;
          setIsMuted(true);
          videoRef.current!.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => console.error(err));
      } else {
        document.exitFullscreen().catch((err) => console.error(err));
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
        te: "దశ 1: ఒస్మిడా వెబ్‌సైట్‌లో ఏసీ సర్వీస్, పురుగుల నివారణ, లేదా హోమ్ క్లీనింగ్ ఎంచుకోండి.",
        en: "Step 1: Select verified AC service, pest control, or deep cleaning with clear prices.",
      };
    } else if (currentTime < 23) {
      return {
        step: 2,
        te: "దశ 2: మీ నెల్లూరు ఏరియా, సమయం నమోదు చేయండి. ₹0 అడ్వాన్స్ • 30 నిమిషాల్లో కాల్ వస్తుంది.",
        en: "Step 2: Pick your Nellore locality and time slot. ₹0 Advance • 30-min pro arrival.",
      };
    } else if (currentTime < 35) {
      return {
        step: 3,
        te: "దశ 3: అధికారిక బ్లాక్ యూనిఫామ్‌తో ధృవీకరించబడిన లోకల్ నిపుణుడు మీ ఇంటి వద్దకు వస్తారు.",
        en: "Step 3: Verified local technician arrives in official black Osmida uniform with tools.",
      };
    } else {
      return {
        step: 4,
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
            <span>{lang === "te" ? "తెలుగు వీడియో గైడ్" : "1-Min Telugu Video Walkthrough"}</span>
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

        {/* Video Player Card */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                ▶
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  {lang === "te" ? "45-సెకన్ల తెలుగు వీడియో గైడ్" : "45-Second Telugu Video Walkthrough"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {lang === "te" ? "నెల్లూరు హోమ్ సర్వీసెస్ బుకింగ్ డెమో" : "Official Osmida Nellore Service Demo"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio Status Pill */}
              <button
                type="button"
                onClick={handleToggleMute}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                  isMuted || audioBlocked
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }`}
                title="Toggle Audio"
              >
                {isMuted || audioBlocked ? (
                  <>
                    <VolumeX className="h-3 w-3 text-rose-500" />
                    <span>{lang === "te" ? "ఆడియో ఆన్ చేయండి" : "Tap for Sound"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3 text-emerald-600" />
                    <span>{lang === "te" ? "తెలుగు ఆడియో ఆన్" : "Telugu Audio Active"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div
            ref={containerRef}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black shadow-inner group select-none cursor-pointer"
            onClick={handlePlayPause}
          >
            {/* Real HTML5 Video */}
            <video
              ref={videoRef}
              src="/videos/how-to-book-telugu.mp4"
              poster="/images/how-to-book-telugu-thumb.jpg"
              playsInline
              preload="metadata"
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="w-full h-full object-cover"
            />

            {/* Unmute Alert Overlay if browser blocked unmuted autoplay */}
            {isPlaying && (isMuted || audioBlocked) && (
              <div
                className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 bg-black/85 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-xs shadow-lg animate-pulse"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnmuteDirect();
                }}
              >
                <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                <span>{lang === "te" ? "🔊 తెలుగు ఆడియో వినడానికి ఇక్కడ నొక్కండి" : "🔊 Tap here to unmute Telugu voiceover"}</span>
              </div>
            )}

            {/* Big Center Play Overlay (When Paused) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/45 backdrop-blur-2xs cursor-pointer transition-opacity"
                onClick={handlePlayPause}
              >
                <button
                  type="button"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Play Video"
                >
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-1 fill-slate-900" />
                </button>
                <span className="mt-3 text-xs sm:text-sm font-black text-white drop-shadow-md bg-black/75 px-4 py-1.5 rounded-full border border-white/20">
                  {lang === "te" ? "▶ తెలుగు వీడియో చూడండి (ఆడియోతో)" : "▶ Watch 45s Walkthrough (With Telugu Audio)"}
                </span>
              </div>
            )}

            {/* Subtitle Bar Inside Video Container */}
            <div
              className="absolute bottom-12 inset-x-3 sm:inset-x-6 z-20 pointer-events-none text-center"
            >
              <div className="inline-block max-w-xl mx-auto rounded-xl bg-black/80 backdrop-blur-md border border-white/15 px-3.5 py-2 text-center shadow-lg">
                <p className="text-xs sm:text-sm font-black text-white leading-snug">
                  🗣️ {currentSubtitle.te}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-200 mt-0.5 leading-snug">
                  {currentSubtitle.en}
                </p>
              </div>
            </div>

            {/* Scrubber Controls Bar */}
            <div
              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-2.5 sm:p-3 z-30 flex flex-col gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="range"
                min={0}
                max={duration || 45}
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
                      {isMuted ? (lang === "te" ? "మ్యూట్" : "Muted") : (lang === "te" ? "తెలుగు ఆడియో" : "Telugu Audio")}
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
              onClick={() => onOpenBookingModal?.("ac")}
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
