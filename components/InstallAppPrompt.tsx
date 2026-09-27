"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  MoreVertical,
  Smartphone,
  ChevronDown,
  Sparkles,
  HardHat,
  Home,
} from "lucide-react";

export function InstallAppPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Detect whether currently on Partner portal or Customer portal
  const isPartnerPortal =
    Boolean(pathname?.startsWith("/partner")) ||
    (typeof window !== "undefined" &&
      (window.location.hostname.startsWith("partner.") ||
        window.location.hostname.startsWith("parnter.")));

  useEffect(() => {
    // Check if already running in standalone mode (already installed on phone homescreen)
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

    // Handle Android / Chrome / Edge / Samsung Internet install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for custom trigger event from anywhere in the app
    const handleTriggerInstall = () => {
      setIsMinimized(false);
      if (isAppleDevice) {
        setShowIOSModal(true);
      } else if (!deferredPrompt) {
        setShowAndroidModal(true);
      }
    };
    window.addEventListener("osmida_trigger_install", handleTriggerInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("osmida_trigger_install", handleTriggerInstall);
    };
  }, [deferredPrompt]);

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
          setDeferredPrompt(null);
          setIsMinimized(true);
        }
      } catch {
        setShowAndroidModal(true);
      }
    } else {
      setShowAndroidModal(true);
    }
  };

  // If already opened as an installed standalone app from homescreen, don't show prompt
  if (isStandalone) return null;

  const appTitle = isPartnerPortal ? "Osmida Partner App" : "Osmida Customer App";
  const appBadge = isPartnerPortal ? "Partner App" : "Customer App";
  const appSubtitle = isPartnerPortal
    ? "Add to home screen for 1-tap worker jobs & payouts"
    : "Add to home screen for fast 1-tap Nellore bookings";
  const appIcon = "/icons/icon-192x192.png";

  return (
    <>
      {/* PERMANENT FLOATING INSTALL WIDGET (NEVER CLOSES - ALWAYS VISIBLE) */}
      <aside
        aria-label={`Install ${appTitle} on Home Screen`}
        className="fixed bottom-20 sm:bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
      >
        {isMinimized ? (
          /* Sleek Collapsed Floating Pill (Always Visible on Screen) */
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 bg-slate-950/95 text-white hover:bg-slate-900 border border-white/25 rounded-full px-3.5 py-2.5 shadow-2xl backdrop-blur-xl transition active:scale-95 cursor-pointer group ring-1 ring-white/10"
            title={`Open ${appTitle} installation`}
          >
            <div className="relative w-6 h-6 rounded-lg overflow-hidden bg-[#0C6266] p-0.5 flex items-center justify-center shrink-0 border border-white/20">
              <Image
                src={appIcon}
                alt={appTitle}
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>

            <div className="flex items-center gap-1.5">
              {isPartnerPortal ? (
                <HardHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              )}
              <span className="text-xs font-black tracking-tight text-white group-hover:text-teal-300 transition">
                {isPartnerPortal ? "Partner App" : "Customer App"}
              </span>
            </div>

            <span className="bg-[#E68A00] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
              <Download className="w-2.5 h-2.5" />
              Install
            </span>
          </button>
        ) : (
          /* Expanded Floating Action Card */
          <div className="bg-slate-950/95 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/25 flex items-center justify-between gap-3 backdrop-blur-xl max-w-[340px] sm:max-w-md ring-1 ring-white/10">
            {/* App Icon + Clear Customer/Partner Indicator */}
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
                  <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight truncate">
                    {appTitle}
                  </span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isPartnerPortal
                        ? "bg-amber-400 text-slate-950"
                        : "bg-teal-400 text-slate-950"
                    }`}
                  >
                    {appBadge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 truncate">
                  {appSubtitle}
                </p>
              </div>
            </div>

            {/* Action Buttons: 1-Tap Install + Minimize Pill Toggle (Never close permanently) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-[#0C6266]/40 cursor-pointer active:scale-95 whitespace-nowrap border border-white/10"
              >
                <Download className="w-3.5 h-3.5 text-teal-300" />
                <span>Install</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Minimize to floating pill"
                className="p-1.5 text-gray-400 hover:text-white transition rounded-lg cursor-pointer bg-white/5 hover:bg-white/10"
                aria-label="Minimize install prompt"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white">{appTitle}</h3>
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        isPartnerPortal ? "bg-amber-400 text-slate-950" : "bg-teal-400 text-slate-950"
                      }`}
                    >
                      {appBadge}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">Add to Phone Home Screen</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAndroidModal(false);
                  setIsMinimized(true);
                }}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close dialog and keep floating"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Follow these 2 quick steps to install {appTitle} on your phone:
            </p>

            <div className="space-y-3 bg-black/50 rounded-2xl p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 text-amber-400 flex items-center justify-center shrink-0 font-black">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white">1. Tap Chrome Menu (3 Dots)</span>
                  <span className="text-[11px] text-gray-400">At top-right corner of Chrome browser</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0C6266]/30 text-teal-400 flex items-center justify-center shrink-0 font-black">
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
                setIsMinimized(true);
              }}
              className="w-full bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Done &bull; Keep Floating
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
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white">Install on iPhone</h3>
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        isPartnerPortal ? "bg-amber-400 text-slate-950" : "bg-teal-400 text-slate-950"
                      }`}
                    >
                      {appBadge}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">{appTitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowIOSModal(false);
                  setIsMinimized(true);
                }}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close dialog and keep floating"
              >
                <ChevronDown className="w-5 h-5" />
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
                setIsMinimized(true);
              }}
              className="w-full bg-[#0C6266] hover:bg-[#094e51] text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Got it &bull; Keep Floating
            </button>
          </div>
        </div>
      )}
    </>
  );
}
