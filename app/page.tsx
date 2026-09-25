"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  MapPin,
  Sparkles,
} from "lucide-react";
import { ProntoHeader } from "@/components/ProntoHeader";
import { ProntoServiceDetailModal } from "@/components/ProntoServiceDetailModal";
import { AiQuickBookBar } from "@/components/AiQuickBookBar";
import { OsmidaSupportChat } from "@/components/OsmidaSupportChat";
import { PRONTO_SERVICES, ProntoService } from "@/lib/prontoServices";

const COMMUNITY_PARTNERS = [
  "Haranathapuram Enclave",
  "Magunta Layout Heights",
  "Sri Sai Residency",
  "Green Meadows Apartments",
  "Vedayapalem Central",
  "Balaji Nagar Towers",
];

const LAUNCH_GUARANTEES = [
  {
    icon: "₹0",
    title: "₹0 Advance Required",
    subtitle: "Pay Only After Service",
    description: "You don't pay a single rupee upfront. After the helper completes your chores and uploads photos, you pay only if satisfied.",
    badge: "Zero Risk",
  },
  {
    icon: "30m",
    title: "Free 30-Min Touchup Redo",
    subtitle: "Missed a Spot? We Rectify It",
    description: "If any spot or standard checklist item is missed, your helper stays for up to 30 extra minutes to make it right at no extra charge.",
    badge: "Quality Guarantee",
  },
  {
    icon: "📷",
    title: "Before & After Photo Proof",
    subtitle: "Transparent Phone Verification",
    description: "Review timestamped before-and-after photos directly on your live booking screen before sharing your 4-digit completion code.",
    badge: "Photo QC Proof",
  },
  {
    icon: "🛡️",
    title: "Aadhaar & Background Verified",
    subtitle: "Safe for Nellore Apartment Families",
    description: "Every partner undergoes government identity verification, background checks, and apartment etiquette training.",
    badge: "Safety First",
  },
];

const FAQS = [
  {
    q: "How does the flat ₹199 hourly pricing work?",
    a: "Osmida charges a single, transparent flat rate of ₹199 per hour across all 4 services. 1 booking visit covers your sequence of tasks (e.g. 1 hour of bathroom cleaning + 30 mins of dishwashing = ₹299 for 1.5 hrs). No hidden travel fees or surge charges.",
  },
  {
    q: "How do the Start OTP and End OTP work?",
    a: "When your helper arrives at your apartment door, you share your 4-digit Start OTP to begin the visit timer. When work is completed and Before/After photos are uploaded, you share your End OTP to close the job and release the escrow payment.",
  },
  {
    q: "Are the house helpers verified and safe?",
    a: "Yes. 100% of our service partners undergo police background verification, Aadhaar identity authentication, and standardized hygiene and skill training before entering any customer home.",
  },
  {
    q: "What if I am not satisfied with the cleaning quality?",
    a: "Your payment is held safely in escrow until you verify the work. If any standard checklist item was missed, Osmida immediately sends a helper for a free 30-minute touchup redo or issues a refund under our Quality Guarantee.",
  },
  {
    q: "What tasks are NOT included in the service?",
    a: "To ensure safety and keep hourly prices affordable, we do not include heavy chemical acid grout restoration, deep chimney motor overhauls, exterior balcony ledge climbing, or heavy furniture shifting.",
  },
  {
    q: "Which apartment localities in Nellore do you cover?",
    a: "We currently cover all major apartments in Haranathapuram, Magunta Layout, Vedayapalem, Pogathota, Dargamitta, Balaji Nagar, Nawabpet, VRC Centre, and Children's Park Road.",
  },
];

export default function HomePage() {
  const [selectedModalService, setSelectedModalService] = useState<ProntoService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroPhone, setHeroPhone] = useState("");

  const handleOpenModal = (service: ProntoService) => {
    setSelectedModalService(service);
    setIsModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#F4F8F8] text-[#0F171A] font-sans selection:bg-[#0C6266]/20 selection:text-[#0C6266]">
      {/* 1. OSMIDA HEADER */}
      <ProntoHeader />

      {/* 2. HERO SECTION (Deep Heritage Teal & Warm Saffron Amber) */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#EBF4F5] via-[#F4F8F8] to-white pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF4F5] border border-[#B6D7D8] px-3.5 py-1 text-xs font-bold text-[#0C6266] shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-[#0C6266] animate-pulse" />
                <span>Nellore&apos;s trusted house help in minutes</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F171A] tracking-tight leading-[1.15]">
                Trusted house help <br className="hidden sm:inline" />
                in <span className="text-[#0C6266]">minutes!</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475559] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                From daily dishwashing to deep bathroom scrubbing, verified apartment house help at your doorstep. Standardized tasks at a flat ₹199/hr rate.
              </p>

              {/* Quick Instant Booking Bar */}
              <div className="max-w-md mx-auto lg:mx-0 pt-1">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#475559]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter WhatsApp mobile..."
                      value={heroPhone}
                      onChange={(e) => setHeroPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-lg border border-[#DFE8E8] bg-white py-3 pl-12 pr-4 text-xs font-bold text-[#0F171A] placeholder:text-slate-400 focus:border-[#0C6266] focus:outline-hidden focus:ring-2 focus:ring-[#0C6266]/20 shadow-xs"
                    />
                  </div>
                  <Link
                    href={`/book${heroPhone.length === 10 ? `?phone=${heroPhone}` : ""}`}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-6 py-3 text-xs font-bold transition-all shadow-md shadow-[#E68A00]/25"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <p className="mt-2 text-[11px] text-[#475559] font-medium text-left">
                  Doorstep arrival in 15–30 mins across Nellore apartments • ₹0 advance
                </p>
              </div>

              {/* AI Quick Prompt Input */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <AiQuickBookBar compact={true} />
              </div>

              {/* Genuine Launch Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-bold text-[#0F171A]">
                <div className="flex items-center gap-1.5 text-[#0C6266] bg-[#EBF4F5] px-3 py-1 rounded-full border border-[#B6D7D8]">
                  <Sparkles className="h-3.5 w-3.5 text-[#E68A00]" />
                  <span className="font-black text-[#0F171A]">Now Live in Nellore</span>
                  <span className="text-[#475559] font-medium">• ₹0 Advance</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#475559]">
                  <ShieldCheck className="h-4 w-4 text-[#0C6266]" />
                  <span>Pay Only After Service</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#475559]">
                  <Clock className="h-4 w-4 text-[#0C6266]" />
                  <span>Photo QC Verified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Teal Ambient Backdrop Glow */}
              <div className="absolute -inset-4 bg-radial from-[#B6D7D8]/60 via-[#EBF4F5]/40 to-transparent rounded-full blur-2xl -z-10" />

              <div className="relative h-[380px] sm:h-[460px] w-[300px] sm:w-[360px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-linear-to-b from-[#EBF4F5] to-[#D1E7E8]">
                <Image
                  src="/images/pronto_hero_helper.jpg"
                  alt="Osmida Professional House Help in Nellore"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 300px, 360px"
                />

                {/* Floating Micro Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-[#DFE8E8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-[#16A34A] animate-ping" />
                    <span className="text-xs font-bold text-[#0F171A]">Verified Helpers Online</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#0C6266] bg-[#EBF4F5] px-2 py-0.5 rounded-full">
                    Nellore Central
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APARTMENT COMMUNITIES BAR */}
      <section className="bg-white py-6 border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#475559]">
            Trusted by leading Nellore apartment communities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-[#475559]">
            {COMMUNITY_PARTNERS.map((partner, idx) => (
              <span
                key={idx}
                className="bg-[#F4F8F8] hover:bg-[#EBF4F5] px-3.5 py-1.5 rounded-full border border-[#DFE8E8] transition-colors"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STAT CARDS: "NO MORE PLANNING AROUND YOUR HOUSE HELP" */}
      <section className="bg-[#F4F8F8] py-12 sm:py-16 border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0C6266] uppercase tracking-wider">
              Simpler • Faster • Predictable
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F171A] tracking-tight">
              No more planning around your house help.
            </h2>
            <p className="text-xs sm:text-sm text-[#475559] font-medium">
              Standardized residential tasks, flat ₹199/hr pricing, and guaranteed arrival on your schedule.
            </p>
          </div>

          {/* 3 Authentic Launch Commitment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="rounded-xl bg-[#EBF4F5] border border-[#B6D7D8] p-5 sm:p-6 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-1 text-[#0C6266] font-black text-2xl sm:text-3xl">
                <span>₹199/hr</span>
              </div>
              <p className="text-xs font-bold text-[#0F171A] uppercase tracking-wide">
                Flat Hourly Rate
              </p>
              <p className="text-[11px] text-[#475559]">Transparent pricing with zero hidden travel charges</p>
            </div>

            <div className="rounded-xl bg-[#EBF4F5] border border-[#B6D7D8] p-5 sm:p-6 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-1 text-[#0C6266] font-black text-2xl sm:text-3xl">
                <span>₹0 Advance</span>
              </div>
              <p className="text-xs font-bold text-[#0F171A] uppercase tracking-wide">
                Pay After Inspection
              </p>
              <p className="text-[11px] text-[#475559]">Inspect Before/After photos first before paying</p>
            </div>

            <div className="rounded-xl bg-[#EBF4F5] border border-[#B6D7D8] p-5 sm:p-6 text-center space-y-1 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center gap-1 text-[#0C6266] font-black text-2xl sm:text-3xl">
                <Check className="h-6 w-6 stroke-[3]" />
                <span>100%</span>
              </div>
              <p className="text-xs font-bold text-[#0F171A] uppercase tracking-wide">
                Police & Aadhaar Vetted
              </p>
              <p className="text-[11px] text-[#475559]">Verified helpers trained for Nellore apartments</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SNABBIT SCOPE-CARD STRUCTURE: 4 CORE SERVICES GRID */}
      <section id="services-section" className="py-14 sm:py-20 bg-white border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold text-[#0C6266] uppercase tracking-wider">
              Fixed Scope • Flat ₹199 / Hour
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F171A] tracking-tight">
              Standardized Residential Services
            </h2>
            <p className="text-xs sm:text-sm text-[#475559] font-medium">
              Full transparency before you book. What&apos;s included and not included is clearly listed on each service card.
            </p>
          </div>

          {/* Snabbit-Style Scope Cards Grid (4 Core Services with visible Included & Not Included) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRONTO_SERVICES.map((s) => {
              const imageMap: Record<string, string> = {
                bathroom_cleaning: "/images/isometric_bathroom_mini.jpg",
                kitchen_cleaning: "/images/isometric_kitchen_mini.jpg",
                dishwashing: "/images/isometric_dishes_mini.jpg",
                general_house_help: "/images/isometric_livingroom_mini.jpg",
              };
              const imgSrc = imageMap[s.id] || "/images/isometric_bathroom_mini.jpg";

              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-[#DFE8E8] bg-white p-5 shadow-xs hover:shadow-lg hover:border-[#0C6266]/40 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-4">
                    {/* Visual Thumbnail */}
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-[#F4F8F8] border border-[#DFE8E8]">
                      <Image
                        src={imgSrc}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 280px"
                      />
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-[#0C6266] text-white px-2.5 py-0.5 text-[11px] font-black shadow-xs">
                        ₹199/hr
                      </span>
                    </div>

                    {/* Title & Short Tagline */}
                    <div>
                      <h3 className="text-base font-bold text-[#0F171A]">
                        {s.name}
                      </h3>
                      <p className="text-xs text-[#475559] font-medium mt-1">
                        {s.tagline}
                      </p>
                    </div>

                    {/* SNABBIT SCOPE: What's Included (Visible directly) */}
                    <div className="bg-[#F4F8F8] rounded-lg p-3 border border-[#DFE8E8] text-[11px] space-y-2">
                      <div className="flex items-center gap-1.5 text-[#16A34A] font-bold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>What&apos;s Included</span>
                      </div>
                      <ul className="space-y-1 text-[#0F171A] font-medium">
                        {s.included.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#16A34A] font-bold shrink-0">✓</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SNABBIT SCOPE: What's NOT Included (Visible directly) */}
                    <div className="bg-[#F1F5F5] rounded-lg p-3 border border-[#DFE8E8] text-[11px] space-y-2">
                      <div className="flex items-center gap-1.5 text-[#475559] font-bold text-[11px]">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#DFE8E8] text-[#475559] text-[10px] font-bold">–</span>
                        <span>Not Included</span>
                      </div>
                      <ul className="space-y-1 text-[#475559] font-medium">
                        {s.notIncluded.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#64748B] font-bold shrink-0">–</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions: View Modal or Book Instantly */}
                  <div className="space-y-2 pt-2 border-t border-[#DFE8E8]">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(s)}
                      className="w-full text-center text-xs font-semibold text-[#475559] hover:text-[#0C6266] transition-colors py-1 cursor-pointer"
                    >
                      View Full Details ↗
                    </button>
                    <Link
                      href={`/book?services=${s.id}&duration=1`}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Book for ₹199/hr</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multi-Service Combo Banner */}
          <div className="rounded-xl border border-[#B6D7D8] bg-[#EBF4F5] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0C6266] text-white shrink-0 shadow-xs">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F171A]">
                  Combine Multiple Tasks in 1 Visit!
                </h4>
                <p className="text-xs text-[#475559] font-medium">
                  Book 1.5 or 2 hours and our helper will finish your sequence of chores (Bathroom + Kitchen + Dishes).
                </p>
              </div>
            </div>

            <Link
              href="/book"
              className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#0C6266] hover:bg-[#095054] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-xs"
            >
              <span>Custom Chore Booking</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#E68A00]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SIMPLE 3 STEPS TO A CLEANER HOME (Deep Ocean Dark Section) */}
      <section id="how-it-works-section" className="bg-[#072426] text-white py-16 sm:py-24 border-b border-[#0C4144]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold text-[#E68A00] uppercase tracking-wider">
              Seamless 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Simple steps to a cleaner home.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Transparent escrow protection, doorstep arrival tracking, and verified Before/After photos.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="rounded-xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 01
                </span>
                <h3 className="text-lg font-bold text-white">Pick services & duration</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Select 1, 1.5, or 2 hours. Choose any sequence of tasks at flat ₹199/hr. Instant or scheduled.
                </p>
              </div>

              <div className="relative h-60 w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                <Image
                  src="/images/pronto_app_mockups.jpg"
                  alt="Step 1 Booking Mockup"
                  fill
                  className="object-cover object-left"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 02
                </span>
                <h3 className="text-lg font-bold text-white">Doorstep Start OTP</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Verified Nellore helper arrives in 15–30 mins. Share your 4-digit code to start the service timer.
                </p>
              </div>

              <div className="relative h-60 w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                <Image
                  src="/images/pronto_app_mockups.jpg"
                  alt="Step 2 Arrival Mockup"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 03
                </span>
                <h3 className="text-lg font-bold text-white">Photo QC & Escrow Pay</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Inspect Before & After photo proof. Share End OTP only when satisfied to release escrow payment.
                </p>
              </div>

              <div className="relative h-60 w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                <Image
                  src="/images/pronto_app_mockups.jpg"
                  alt="Step 3 Inspection Mockup"
                  fill
                  className="object-cover object-right"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR LAUNCH COMMITMENT (100% HONEST - ZERO FAKE REVIEWS) */}
      <section id="guarantee-section" className="py-16 sm:py-20 bg-white border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold text-[#0C6266] uppercase tracking-wider">
              100% Risk-Free For Nellore Homes
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F171A] tracking-tight">
              Our Launch Commitment to You.
            </h2>
            <p className="text-xs sm:text-sm text-[#475559] font-medium leading-relaxed">
              We are newly launching our doorstep services in Nellore. We don&apos;t use fake reviews — instead, we earn your trust on every single visit with ironclad safety and satisfaction guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAUNCH_GUARANTEES.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#DFE8E8] bg-[#F4F8F8] p-6 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-xl bg-[#0C6266]/15 text-[#0C6266] flex items-center justify-center font-black text-sm">
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-bold text-[#0C6266] bg-[#EBF4F5] border border-[#B6D7D8] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F171A] text-sm">{item.title}</h3>
                    <p className="text-[11px] font-semibold text-[#0C6266]">{item.subtitle}</p>
                  </div>
                  <p className="text-xs text-[#475559] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Founder Transparency Note */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-[#EBF4F5] border border-[#B6D7D8] p-4 sm:p-5 text-center space-y-1.5 shadow-2xs">
            <p className="text-xs font-bold text-[#0F171A]">
              🤝 A Note from the Osmida Nellore Team
            </p>
            <p className="text-[11px] text-[#475559] leading-relaxed">
              We are starting fresh in Nellore. Because we don&apos;t fabricate reviews, you are booking with total honesty. Be among our first Nellore customers with ₹0 advance and complete Before/After photo proof!
            </p>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs-section" className="py-16 sm:py-20 bg-[#F4F8F8] border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#0C6266] uppercase tracking-wider">
              Answers & Scope Clarification
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F171A] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#475559] font-medium">
              Everything you need to know about Osmida apartment house help in Nellore.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#DFE8E8] bg-white overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-[#F4F8F8] transition-colors focus:outline-hidden"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0F171A]">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#475559] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0C6266]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[#475559] font-medium leading-relaxed border-t border-[#DFE8E8] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM APP BANNER */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-linear-to-r from-[#EBF4F5] via-[#F4F8F8] to-[#EBF4F5] border border-[#B6D7D8] p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="relative h-48 sm:h-64 max-w-lg mx-auto rounded-xl overflow-hidden shadow-xl border-4 border-white bg-slate-950">
              <Image
                src="/images/pronto_app_mockups.jpg"
                alt="Get Osmida House Help in Minutes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F171A] tracking-tight">
                Get trusted house help in minutes.
              </h2>
              <p className="text-xs sm:text-sm text-[#475559] font-medium">
                Standardized residential chores for Nellore apartments. 1 visit covers all your needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/book"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-8 py-3.5 text-xs font-bold transition-all shadow-md shadow-[#E68A00]/25"
              >
                <span>Book Instant Visit (₹199/hr)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/my-bookings"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-white hover:bg-[#F4F8F8] border border-[#DFE8E8] text-[#0F171A] px-6 py-3.5 text-xs font-bold transition-all shadow-2xs"
              >
                <span>Track Active Booking</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CLEAN DARK FOOTER */}
      <footer className="bg-[#072426] text-white pt-14 pb-10 border-t border-[#0C4144]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs">
            <div className="col-span-2 space-y-3">
              <span className="text-2xl font-black tracking-tight text-[#E68A00] font-sans">
                Osmida
              </span>
              <p className="text-slate-300 text-xs font-medium max-w-xs leading-relaxed">
                Nellore&apos;s apartment-first residential home support. Verified helpers, flat ₹199 hourly rate, and dual OTP security.
              </p>
              <div className="text-[11px] text-slate-400 font-medium">
                Operating across Haranathapuram, Magunta Layout, Vedayapalem, Pogathota, and all Nellore apartments.
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Services
              </h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                {PRONTO_SERVICES.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(s)}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Standards
              </h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li>Fixed Scopes</li>
                <li>Dual OTP Protection</li>
                <li>Photo QC Verification</li>
                <li>Escrow Held Payment</li>
                <li>Free 30-min Touchup Redo</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Nellore Localities
              </h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li>Haranathapuram</li>
                <li>Magunta Layout</li>
                <li>Vedayapalem</li>
                <li>Pogathota</li>
                <li>Balaji Nagar</li>
                <li>Children&apos;s Park Road</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-[#E68A00] uppercase tracking-wider text-[11px]">
                Customer Support
              </h4>
              <ul className="space-y-2 text-slate-300 font-semibold">
                <li>
                  <Link href="/my-bookings" className="text-white hover:text-[#E68A00] transition-colors flex items-center gap-1.5">
                    <span>📋 Track My Booking</span>
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-white hover:text-[#E68A00] transition-colors flex items-center gap-1.5">
                    <span>⚡ Book House Help (₹199/hr)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation" className="text-slate-300 hover:text-white transition-colors">
                    🛡️ Quality Guarantee &amp; Redo
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/917676358162"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E68A00] hover:underline transition-colors font-bold flex items-center gap-1"
                  >
                    <span>💬 WhatsApp: +91 7676358162</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#0C4144] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} Osmida Home Services Nellore. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-slate-200">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-200">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/cancellation" className="hover:text-slate-200">
                Cancellation & Refund
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. SERVICE DETAIL MODAL */}
      <ProntoServiceDetailModal
        service={selectedModalService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 12. FLOATING CONCIERGE SUPPORT */}
      <OsmidaSupportChat />
    </main>
  );
}