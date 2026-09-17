"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Maximize,
  Tv
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
  const [activeChapter, setActiveChapter] = useState<1 | 2 | 3>(1);
  const [showRealVideo, setShowRealVideo] = useState(false);

  // Sync active chapter with video timestamp:
  // 0 - 16s: Chapter 1 (Service Selection)
  // 16 - 28s: Chapter 2 (Details: Locality & Mobile)
  // 28 - 45s: Chapter 3 (Confirmation, 30-min call, ₹0 advance)
  useEffect(() => {
    if (currentTime < 16) {
      setActiveChapter(1);
    } else if (currentTime < 28) {
      setActiveChapter(2);
    } else {
      setActiveChapter(3);
    }
  }, [currentTime]);

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

  const jumpToChapter = async (chapter: 1 | 2 | 3) => {
    let targetTime = 0;
    if (chapter === 1) targetTime = 0;
    if (chapter === 2) targetTime = 16;
    if (chapter === 3) targetTime = 28;

    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      if (!isPlaying) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.warn(e);
        }
      }
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
        en: "Verified technician arrives in official black uniform. ₹0 advance • Pay only after inspecting work!",
      };
    }
  };

  const currentSubtitle = getSubtitles();

  return (
    <section
      id="how-to-book-video"
      className="bg-[#0B0F19] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-xs font-bold text-[#38BDF8]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === "te" ? "🎬 వీడియో గైడ్ (తెలుగులో)" : "🎬 Video Guide (In Telugu)"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            {lang === "te"
              ? "ఒస్మిడాలో సర్వీస్ ఎలా బుక్ చేసుకోవాలి?"
              : "How to Book Services on Osmida"}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === "te"
              ? "కేవలం 60 సెకన్లలో సులభమైన బుకింగ్. ఎటువంటి అడ్వాన్స్ లేదా యాప్ డౌన్‌లోడ్ అవసరం లేదు! ఈ వీడియో చూడండి."
              : "Simple 60-second booking. No advance payment or app download needed. Watch this quick explainer video with Telugu narration."}
          </p>

          {/* Audio Playing Pill */}
          {isPlaying && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-pulse">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>{lang === "te" ? "🔊 తెలుగు ఆడియో ప్లే అవుతోంది" : "🔊 Playing Telugu Audio"}</span>
            </div>
          )}
        </div>

        {/* Video Player Display Container */}
        <div
          ref={containerRef}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
        >
          {/* 16:9 Video Canvas Screen */}
          <div className="relative aspect-video w-full bg-black overflow-hidden group">
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
                {/* Genuine HTML5 Video Element with synchronized video & authentic Telugu audio */}
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

                {/* Big Play Button Overlay when Paused */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-2xs cursor-pointer transition-opacity"
                    onClick={handlePlayPause}
                  >
                    <button
                      type="button"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1E6FFF] hover:bg-[#0F4BD6] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:ring-8 group-hover:ring-blue-500/30"
                      aria-label="Play Video"
                    >
                      <Play className="h-7 w-7 sm:h-9 sm:w-9 ml-1 fill-white" />
                    </button>
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white border border-white/20 shadow-lg">
                        {lang === "te" ? "▶ వీడియో ప్లే చేయండి (తెలుగు ఆడియోతో)" : "▶ Play Video (With Telugu Audio)"}
                      </span>
                      <p className="text-xs text-slate-200 mt-1.5 font-medium drop-shadow-md">
                        {lang === "te" ? "45 సెకన్లలో స్పష్టమైన వివరణ" : "Clear explanation in 45 seconds"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Real Video / External Switcher */}
                {customVideoUrl && (
                  <button
                    onClick={() => setShowRealVideo(!showRealVideo)}
                    className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 transition-colors"
                  >
                    <Tv className="h-3.5 w-3.5 text-blue-400" />
                    <span>{showRealVideo ? "అంతర్గత వీడియో" : "YouTube వీడియో"}</span>
                  </button>
                )}

                {/* Subtitle / Narration Banner (Bottom Center) */}
                <div className="absolute bottom-16 left-2 right-2 sm:left-8 sm:right-8 z-20 pointer-events-none">
                  <div className="bg-black/90 backdrop-blur-md border border-white/15 rounded-xl p-2.5 sm:p-3.5 max-w-2xl mx-auto shadow-2xl text-center transition-all duration-300">
                    <p className="text-[11px] sm:text-sm font-bold text-white leading-snug">
                      🗣️ {currentSubtitle.te}
                    </p>
                    <p className="text-[9px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 line-clamp-2">
                      {currentSubtitle.en}
                    </p>
                  </div>
                </div>

                {/* Real-time Tracking Scrubber Control Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3 sm:p-4 z-20 flex flex-col gap-2">
                  {/* Progress Bar Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1E6FFF]"
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        title="Restart"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      <span className="text-[11px] font-mono font-bold text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>

                      {/* Current chapter pill */}
                      <span className="hidden sm:inline-block text-[11px] font-bold text-[#38BDF8] bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-500/30">
                        {activeChapter === 1
                          ? "దశ 1: సర్వీస్ ఎంపిక"
                          : activeChapter === 2
                          ? "దశ 2: వివరాల నమోదు"
                          : "దశ 3: ధృవీకరణ & చెల్లింపు"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4 text-rose-400" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-emerald-400" />
                        )}
                        <span className="text-[10px] font-bold hidden sm:inline">
                          {isMuted ? "ఆడియో ఆఫ్" : "తెలుగు ఆడియో"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFullScreen}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        title="Full Screen"
                      >
                        <Maximize className="h-4 w-4" />
                      </button>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        HD 720p
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 3 Clickable Chapter Steps Beneath Player */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-900/90 border-t border-slate-800">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => jumpToChapter(1)}
              className={`p-4 sm:p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                activeChapter === 1
                  ? "bg-blue-600/20 border-l-4 md:border-l-0 md:border-t-4 border-[#1E6FFF]"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    ⏱️ 0:00 - 0:16
                  </span>
                  <span className="h-5 w-5 rounded-full bg-blue-500/20 text-[#38BDF8] text-[11px] font-black flex items-center justify-center">
                    1
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {lang === "te" ? "దశ 1: సర్వీస్ ఎంపిక" : "Step 1: Choose Service"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {lang === "te"
                    ? "ఏసీ సర్వీస్, పురుగుల నివారణ లేదా డీప్ క్లీనింగ్ ఎంచుకోండి."
                    : "Pick AC service, pest control, or deep cleaning."}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                <span>{lang === "te" ? "ఈ భాగం వినండి & చూడండి" : "Jump to Chapter"}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => jumpToChapter(2)}
              className={`p-4 sm:p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                activeChapter === 2
                  ? "bg-blue-600/20 border-l-4 md:border-l-0 md:border-t-4 border-[#1E6FFF]"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    ⏱️ 0:16 - 0:28
                  </span>
                  <span className="h-5 w-5 rounded-full bg-blue-500/20 text-[#38BDF8] text-[11px] font-black flex items-center justify-center">
                    2
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {lang === "te" ? "దశ 2: వివరాల నమోదు" : "Step 2: Enter Details"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {lang === "te"
                    ? "నెల్లూరు ఏరియా & ఫోన్ నంబర్ ఇవ్వండి (లాగిన్ అవసరం లేదు)."
                    : "Enter your Nellore area & mobile (no password needed)."}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                <span>{lang === "te" ? "ఈ భాగం వినండి & చూడండి" : "Jump to Chapter"}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => jumpToChapter(3)}
              className={`p-4 sm:p-5 text-left transition-all duration-200 flex flex-col justify-between ${
                activeChapter === 3
                  ? "bg-blue-600/20 border-l-4 md:border-l-0 md:border-t-4 border-[#1E6FFF]"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    ⏱️ 0:28 - 0:45
                  </span>
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black flex items-center justify-center">
                    3
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {lang === "te" ? "దశ 3: ధృవీకరణ & చెల్లింపు" : "Step 3: Confirm & Pay"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {lang === "te"
                    ? "30 నిమిషాల్లో కాల్ • ₹0 అడ్వాన్స్ • పని అయ్యాకే చెల్లింపు."
                    : "30-min call • ₹0 advance • Pay only after inspection."}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span>{lang === "te" ? "ఈ భాగం వినండి & చూడండి" : "Jump to Chapter"}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          </div>
        </div>

        {/* 4 Bottom Trust Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-[#38BDF8] flex items-center justify-center mx-auto mb-2 font-black text-sm">
              ₹0
            </div>
            <p className="text-xs font-black text-white">
              {lang === "te" ? "సున్నా అడ్వాన్స్" : "₹0 Advance"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "te" ? "పని చూశాకే చెల్లించండి" : "Pay after service inspection"}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 font-black text-sm">
              30m
            </div>
            <p className="text-xs font-black text-white">
              {lang === "te" ? "30 నిమిషాల్లో కాల్" : "30-Min Call"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "te" ? "నెల్లూరు కోఆర్డినేటర్ నిర్ధారణ" : "Local coordinator confirms slot"}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2 font-black text-sm">
              ID
            </div>
            <p className="text-xs font-black text-white">
              {lang === "te" ? "అధికారిక యూనిఫామ్" : "Official Uniform"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "te" ? "బ్లాక్ ఒస్మిడా టీషర్ట్ & బ్యాడ్జ్" : "Black Osmida t-shirt & ID card"}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 font-black text-sm">
              🛡️
            </div>
            <p className="text-xs font-black text-white">
              {lang === "te" ? "30 రోజుల వారంటీ" : "30-Day Warranty"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "te" ? "ఉచిత రీవిజిట్ గ్యారెంటీ" : "Free revisit guarantee"}
            </p>
          </div>
        </div>

        {/* Action Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/book"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 px-8 py-4 text-sm font-black text-slate-950 shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95"
          >
            <span>{lang === "te" ? "ఆన్‌లైన్‌లో ఇప్పుడే బుక్ చేయండి (₹0 అడ్వాన్స్)" : "Book Service Online Now (₹0 Advance)"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://wa.me/917676358162?text=హలో%20ఒస్మిడా,%20నాకు%20సర్వీస్%20బుకింగ్%20కోసం%20సహాయం%20కావాలి."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-6 py-4 text-sm font-bold text-white transition-all duration-200 active:scale-95"
          >
            <MessageSquare className="h-4 w-4 text-[#25D366]" />
            <span>{lang === "te" ? "వాట్సాప్‌లో సహాయం పొందండి" : "Get Help on WhatsApp"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
