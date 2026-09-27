"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";
import {
  Home,
  LayoutGrid,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

interface MobileBottomNavProps {
  lang: Language;
  onOpenServices: () => void;
}

export function MobileBottomNav({
  lang,
  onOpenServices,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [activeBookingCount, setActiveBookingCount] = useState(0);

  useEffect(() => {
    const checkBookings = () => {
      if (typeof window !== "undefined") {
        const countStr = localStorage.getItem("osmida_active_bookings_count");
        const count = countStr ? parseInt(countStr, 10) : 0;
        const lastRef = localStorage.getItem("osmida_last_booking_ref");

        if (count > 0 || lastRef) {
          setHasActiveBooking(true);
          setActiveBookingCount(count || 1);
        } else {
          setHasActiveBooking(false);
          setActiveBookingCount(0);
        }
      }
    };

    checkBookings();
    window.addEventListener("storage", checkBookings);
    window.addEventListener("osmida_booking_change", checkBookings);
    window.addEventListener("osmida_auth_change", checkBookings);

    return () => {
      window.removeEventListener("storage", checkBookings);
      window.removeEventListener("osmida_booking_change", checkBookings);
      window.removeEventListener("osmida_auth_change", checkBookings);
    };
  }, []);

  const handleHomeScroll = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
    >
      <nav className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
        {/* 1. Osmida / Home Tab */}
        {isHomePage ? (
          <button
            type="button"
            onClick={handleHomeScroll}
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-950 focus:outline-none transition-transform active:scale-95"
            aria-label="Osmida Home"
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <Home className="h-5 w-5 text-slate-950 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-slate-950">
              {lang === "te" ? "ఓస్మిడా" : "Osmida"}
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 py-1 text-slate-500 hover:text-slate-900 focus:outline-none transition-transform active:scale-95"
            aria-label="Osmida Home"
          >
            <div className="flex h-6 w-6 items-center justify-center">
              <Home className="h-5 w-5 text-slate-500 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-medium tracking-tight">
              {lang === "te" ? "ఓస్మిడా" : "Osmida"}
            </span>
          </Link>
        )}

        {/* 2. Services Tab (with Red Dot Badge) */}
        <button
          type="button"
          onClick={onOpenServices}
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-slate-950 focus:outline-none transition-transform active:scale-95"
          aria-label="Services Catalog"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <LayoutGrid className="h-5 w-5 stroke-[2] text-slate-800" />
            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white" />
          </div>
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight">
            {lang === "te" ? "సర్వీసులు" : "Services"}
          </span>
        </button>

        {/* 3. Bookings Tab (Live Quick-Commerce Tracker) */}
        <Link
          href="/my-bookings"
          className={`flex flex-col items-center justify-center gap-1 py-1 focus:outline-none transition-transform active:scale-95 ${
            pathname === "/my-bookings" ? "text-[#0C6266]" : "text-slate-600 hover:text-slate-950"
          }`}
          aria-label="My Bookings"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <ClipboardList
              className={`h-5 w-5 ${
                pathname === "/my-bookings"
                  ? "stroke-[2.4] text-[#0C6266]"
                  : "stroke-[2] text-slate-800"
              }`}
            />
            {hasActiveBooking && (
              <span className="absolute -top-1 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white items-center justify-center text-[7px] text-white font-black">
                  {activeBookingCount > 1 ? activeBookingCount : ""}
                </span>
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              pathname === "/my-bookings"
                ? "font-bold text-[#0C6266]"
                : "font-semibold text-slate-800"
            }`}
          >
            {lang === "te" ? "ఆర్డర్లు" : "Bookings"}
          </span>
        </Link>

        {/* 4. WhatsApp Support Tab */}
        <a
          href="https://wa.me/917676358162?text=Hi%20Osmida%2C%20I%20want%20to%20know%20about%20your%20services%20in%20Nellore."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-600 hover:text-slate-950 focus:outline-none transition-transform active:scale-95"
          aria-label="WhatsApp Support"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <svg className="h-5 w-5 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.153.57 4.175 1.564 5.922l-1.564 5.706 5.86-1.537c1.701.928 3.654 1.458 5.733 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
            </svg>
            <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white" />
          </div>
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight">
            {lang === "te" ? "వాట్సాప్" : "WhatsApp"}
          </span>
        </a>

        {/* 5. Book Now Tab */}
        <Link
          href="/book"
          className="flex flex-col items-center justify-center gap-1 py-1 text-slate-900 focus:outline-none transition-transform active:scale-95"
          aria-label="Book Now"
        >
          <div className="relative flex items-center justify-center h-6 w-6">
            <CalendarCheck className="h-5 w-5 stroke-[2.2] text-slate-900" />
          </div>
          <span className="text-[10px] font-bold text-slate-900 tracking-tight">
            {lang === "te" ? "బుక్ (₹0)" : "Book (₹0)"}
          </span>
        </Link>
      </nav>
    </aside>
  );
}
