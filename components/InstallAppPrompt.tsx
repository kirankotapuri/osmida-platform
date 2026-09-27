"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2, MoreVertical, Smartphone } from "lucide-react";

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isPartnerPortal, setIsPartnerPortal] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed on homescreen)
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detect if this is the partner portal
    const isPartner =
      window.location.pathname.startsWith("/partner") ||
      window.location.hostname.startsWith("partner.") ||
      window.location.hostname.startsWith("parnter.");
    setIsPartnerPortal(isPartner);

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
        setTimeout(() => setShowBanner(true), 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleTriggerInstall = () => {
      setShowBanner(true);
      if (isAppleDevice) {
        setShowIOSModal(true);
      } else if (!deferredPrompt) {
        setShowAndroidModal(true);
      }
    };
    window.addEventListener("osmida_trigger_install", handleTriggerInstall);

    // If not dismissed, show install banner after 3 seconds
    if (!isDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
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
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setShowBanner(false);
          setDeferredPrompt(null);
        }
      } catch {
        setShowAndroidModal(true);
      }
    } else {
      setShowAndroidModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem("osmida_a2hs_dismissed", "true");
    } catch {}
  };

  if (isStandalone || !showBanner) return null;

  const appTitle = isPartnerPortal ? "Osmida Partner App" : "Install Osmida App";
  const appSubtitle = isPartnerPortal
    ? "Add to home screen for 1-tap Nellore worker dispatch"
    : "Add to home screen for 1-tap bookings";
  const appIcon = isPartnerPortal ? "/icons/partner-icon-192x192.png" : "/icons/icon-192x192.png";

  return (
    <>
      {/* FLOATING INSTALL BANNER */}
      <aside
        aria-label="Install Osmida Application"
        className="fixed bottom-20 lg:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-slate-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/20 flex items-center justify-between gap-3 backdrop-blur-xl">
          {/* App Icon + Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 bg-[#0C6266] border border-white/20 p-1 flex items-center justify-center">
              <Image
                src={appIcon}
                alt={appTitle}
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight truncate">
                  {appTitle}
                </span>
                <span className="bg-[#E68A00] text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                  App
                </span>
              </div>
              <p className="text-[11px] text-gray-300 truncate">
                {appSubtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-[#0C6266]/30 cursor-pointer active:scale-95"
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

      {/* ANDROID CHROME MANUAL INSTALL INSTRUCTIONS MODAL */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 text-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0C6266] p-1 flex items-center justify-center shrink-0">
                  <Image
                    src={appIcon}
                    alt={appTitle}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{appTitle}</h3>
                  <p className="text-[10px] text-gray-400">Add to Phone Home Screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Follow these 2 quick steps to install {appTitle} on your mobile:
            </p>

            <div className="space-y-3 bg-black/50 rounded-2xl p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-amber-400 flex items-center justify-center shrink-0 font-black">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white">1. Tap Chrome Menu (3 Dots)</span>
                  <span className="text-[11px] text-gray-400">At the top-right corner of your browser</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0C6266]/30 text-[#38B2AC] flex items-center justify-center shrink-0 font-black">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white">2. Tap &ldquo;Install app&rdquo; or &ldquo;Add to Home screen&rdquo;</span>
                  <span className="text-[11px] text-gray-400">Tap &ldquo;Install&rdquo; on the confirmation popup</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowAndroidModal(false);
                setShowBanner(false);
              }}
              className="w-full bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Done &bull; I Added It
            </button>
          </div>
        </div>
      )}

      {/* iOS SAFARI &ldquo;ADD TO HOME SCREEN&rdquo; INSTRUCTIONS MODAL */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 text-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0C6266] p-1 flex items-center justify-center shrink-0">
                  <Image
                    src={appIcon}
                    alt={appTitle}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Install on iPhone</h3>
                  <p className="text-[10px] text-gray-400">{appTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Install {appTitle} on your iPhone home screen for fast 1-tap access:
            </p>

            <div className="space-y-3 bg-black/50 rounded-2xl p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <span>1. Tap the <strong>Share</strong> button at bottom of Safari.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span>2. Scroll down &amp; tap <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
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
