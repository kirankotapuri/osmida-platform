"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Lock,
  FileText,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { OSMIDA_SERVICES } from "@/lib/osmidaServices";

export function OsmidaFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#062426] text-white pt-14 pb-10 border-t border-[#0C4144]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 text-xs">
          {/* Column 1 & 2: Brand Information */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Osmida Home">
              <div className="relative h-8 w-32 shrink-0 group-hover:opacity-90 transition-opacity">
                <Image
                  src="/assets/branding/osmida-wordmark-white.png"
                  alt="Osmida"
                  width={128}
                  height={33}
                  className="h-full w-auto object-contain object-left"
                />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#E68A00] bg-[#E68A00]/15 border border-[#E68A00]/30 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Nellore
              </span>
            </Link>

            <p className="text-slate-300 text-xs font-medium max-w-sm leading-relaxed">
              Nellore&apos;s apartment-first residential home support service. Verified local helpers, flat ₹199 hourly rate, photo-verified quality checks, and escrow-protected post-service payment.
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#E68A00] shrink-0 mt-0.5" />
                <span>Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh - 524003</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#E68A00] shrink-0" />
                <span>Operating Daily: 8:00 AM – 8:00 PM across Nellore</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Legal Operating Entity: Finkfold (India)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Residential Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#E68A00] uppercase tracking-wider text-[11px]">
              Services
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              {OSMIDA_SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/book?services=${s.id}`}
                    className="hover:text-white transition-colors block"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Actions & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Customer Support
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>
                <Link
                  href="/book"
                  className="text-white hover:text-[#E68A00] transition-colors flex items-center gap-1.5 font-bold"
                >
                  <span>⚡ Book House Help (₹199/hr)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="text-white hover:text-[#E68A00] transition-colors flex items-center gap-1.5 font-bold"
                >
                  <span>📋 Track My Booking</span>
                </Link>
              </li>
              <li>
                <a
                  href="tel:+917676358162"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Call: +91 76763 58162</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917676358162?text=Hello%20Osmida,%20I%20have%20a%20question%20about%20your%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline transition-colors flex items-center gap-1.5 font-bold"
                >
                  <span>💬 WhatsApp: +91 7676358162</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@osmida.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>support@osmida.com</span>
                </a>
              </li>
              <li className="pt-2 border-t border-[#0C4144]">
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E68A00] hover:text-amber-300 transition-colors"
                  title="Osmida Partner Portal - Join as Helper or Cleaner in Nellore"
                >
                  <span>👷 Osmida Partner Portal &amp; Jobs (ఉద్యోగాలు) ↗</span>
                </Link>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Earn daily with 70% share &bull; Nellore Dispatch
                </p>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust, Legal & Transparency */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Legal &amp; Transparency
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3 w-3 text-slate-400" />
                  <span>Terms &amp; Conditions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Cancellation &amp; Refund</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy#data-deletion"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
                >
                  <span>Data Deletion Request</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors block text-slate-400 hover:text-slate-200"
                >
                  About Osmida Nellore
                </Link>
              </li>
              <li className="pt-1 border-t border-[#0C4144]/60">
                <Link
                  href="/admin"
                  className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <span>🔐 Admin Operations Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Localities Supported Tag Ribbon */}
        <div className="pt-6 border-t border-[#0C4144]/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
          <span className="font-bold text-slate-300 shrink-0">Serving All Nellore Localities:</span>
          <div className="flex flex-wrap gap-2 text-slate-300">
            {[
              "Haranathapuram",
              "Magunta Layout",
              "Vedayapalem",
              "Pogathota",
              "Balaji Nagar",
              "Dargamitta",
              "Children's Park Road",
              "Kisan Nagar",
              "Chinthareddypalem",
              "Nellore Central",
            ].map((loc) => (
              <span
                key={loc}
                className="bg-[#093538] px-2 py-0.5 rounded-md border border-[#0C4A4E] text-[10px]"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-6 border-t border-[#0C4144] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {currentYear} Osmida Facility Services (Operated by Finkfold). All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/cancellation" className="hover:text-white transition-colors">
              Cancellation &amp; Refund
            </Link>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>₹0 Advance Escrow Protection</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const ProntoFooter = OsmidaFooter;

