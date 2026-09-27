"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from "lucide-react";

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed on homescreen)
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS (Safari)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Check if previously dismissed in this session
    const isDismissed = sessionStorage.getItem("osmida_a2hs_dismissed") === "true";

    // Handle Android / Chrome / Desktop beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        // Show banner after 3 seconds of browsing
        setTimeout(() => setShowBanner(true), 2500);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleTriggerInstall = () => {
      setShowBanner(true);
      if (isAppleDevice) {
        setShowIOSModal(true);
      }
    };
    window.addEventListener("osmida_trigger_install", handleTriggerInstall);

    // If on iOS and not dismissed, show gentle prompt after 4 seconds
    if (isAppleDevice && !isDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 3500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("osmida_trigger_install", handleTriggerInstall);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("osmida_trigger_install", handleTriggerInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instructions if browser hasn't fired event yet
      alert("To install Osmida: Tap your browser's menu (three dots at top right) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem("osmida_a2hs_dismissed", "true");
    } catch {}
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* FLOATING INSTALL BANNER */}
      <aside
        aria-label="Install Osmida Application"
        className="fixed bottom-18 lg:bottom-5 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-slate-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/15 flex items-center justify-between gap-3">
          {/* App Icon + Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 bg-[#0C6266] border border-white/20 p-1 flex items-center justify-center">
              <Image
                src="/icons/icon-192x192.png"
                alt="Osmida App"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight truncate">
                  Install Osmida App
                </span>
                <span className="bg-[#E68A00] text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-gray-300 truncate">
                Add to home screen for 1-tap bookings
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-[#0C6266]/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-gray-400 hover:text-white transition rounded-lg cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS SAFARI "ADD TO HOME SCREEN" INSTRUCTIONS MODAL */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 text-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0C6266] p-1 flex items-center justify-center">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Osmida"
                    width={28}
                    height={28}
                  />
                </div>
                <span className="font-bold text-sm">Install Osmida on iPhone</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Install Osmida on your home screen for quick 1-tap bookings without visiting the browser:
            </p>

            <div className="space-y-3 bg-black/40 rounded-2xl p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <span>1. Tap the <strong>Share</strong> button in Safari toolbar.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span>2. Scroll down &amp; tap <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>3. Tap <strong>Add</strong> at top right to finish!</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSModal(false);
                setShowBanner(false);
              }}
              className="w-full bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
