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
import { OsmidaHeader } from "@/components/OsmidaHeader";
import { OsmidaFooter } from "@/components/OsmidaFooter";
import { OsmidaServiceDetailModal } from "@/components/OsmidaServiceDetailModal";
import { OSMIDA_SERVICES, OsmidaService } from "@/lib/osmidaServices";
import { useServiceLocations } from "@/lib/serviceLocations";

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
    title: "Aadhaar & In-Person Verified",
    subtitle: "Safe for Nellore Apartment Families",
    description: "Every partner undergoes Aadhaar identity verification, in-person onboarding, and apartment etiquette training.",
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
    a: "Yes. 100% of our service partners undergo Aadhaar identity authentication, in-person onboarding vetting, and standardized hygiene and skill training before entering any customer home.",
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
  const { locations: serviceLocations } = useServiceLocations();
  const [selectedModalService, setSelectedModalService] = useState<OsmidaService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [lastBookingRef, setLastBookingRef] = useState<string | null>(null);

  React.useEffect(() => {
    const checkActive = () => {
      if (typeof window !== "undefined") {
        const countStr = localStorage.getItem("osmida_active_bookings_count");
        const count = countStr ? parseInt(countStr, 10) : 0;
        const ref = localStorage.getItem("osmida_last_booking_ref");
        if (count > 0 || ref) {
          setHasActiveBooking(true);
          setLastBookingRef(ref);
        } else {
          setHasActiveBooking(false);
          setLastBookingRef(null);
        }
      }
    };
    checkActive();
    window.addEventListener("storage", checkActive);
    window.addEventListener("osmida_booking_change", checkActive);
    return () => {
      window.removeEventListener("storage", checkActive);
      window.removeEventListener("osmida_booking_change", checkActive);
    };
  }, []);

  const handleOpenModal = (service: OsmidaService) => {
    setSelectedModalService(service);
    setIsModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#F4F8F8] text-[#0F171A] font-sans selection:bg-[#0C6266]/20 selection:text-[#0C6266]">
      {/* 1. OSMIDA HEADER */}
      <OsmidaHeader />

      {/* QUICK-COMMERCE FLOATING ACTIVE ORDER TRACKER */}
      {hasActiveBooking && (
        <div className="sticky top-16 sm:top-20 z-30 px-4 py-2.5 bg-gradient-to-r from-[#0C6266] to-[#0E131F] text-white shadow-md border-b border-white/10 animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                Active Order
              </span>
              <span className="font-medium text-white truncate">
                {lastBookingRef ? `Booking Ref: ${lastBookingRef}` : "Technician dispatched to your Nellore locality"}
              </span>
            </div>
            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0C6266] hover:bg-emerald-50 text-[11px] font-black transition shrink-0 shadow-sm"
            >
              <span>Track Live Status & OTP</span>
              <ArrowRight className="w-3 h-3 stroke-[3]" />
            </Link>
          </div>
        </div>
      )}

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

              {/* Primary Call to Action Buttons */}
              <div className="pt-2 max-w-lg mx-auto lg:mx-0 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href="/book"
                    className="flex-1 flex items-center justify-center gap-2.5 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] active:scale-95 text-white px-7 py-3.5 sm:py-4 text-sm sm:text-base font-black transition-all shadow-lg shadow-[#E68A00]/25 cursor-pointer whitespace-nowrap"
                  >
                    <span>Book House Help in 60s</span>
                    <ArrowRight className="h-4 w-4 stroke-[3]" />
                  </Link>

                  <a
                    href="#services-section"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#F4F8F8] active:scale-95 text-[#0C6266] border border-[#B6D7D8] px-6 py-3.5 sm:py-4 text-sm font-bold transition-all shadow-2xs whitespace-nowrap"
                  >
                    <span>View 4 Services</span>
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-[#475559] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
                  <span>Doorstep arrival in 15–30 mins across Nellore • Flat ₹199/hr • ₹0 Advance</span>
                </div>
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

              <div className="relative h-[400px] sm:h-[460px] w-full max-w-[310px] sm:max-w-[360px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-linear-to-b from-[#EBF4F5] to-[#D1E7E8]">
                {/* Official Osmida Uniform Callout Badge */}
                <div className="absolute top-3.5 left-3.5 bg-[#0C6266]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/20 z-10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E68A00]" />
                  <span>Osmida Uniformed Helper</span>
                </div>

                <Image
                  src="/images/osmida_hero_helper.jpg"
                  alt="Osmida Professional Uniformed House Help in Nellore"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 768px) 310px, 360px"
                />

                {/* Floating Micro Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-[#DFE8E8] flex items-center justify-between z-10">
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

      {/* 3. ACTIVE LOCALITY EXPANSION STRIP */}
      <section className="bg-white py-6 border-b border-[#DFE8E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0C6266] bg-[#EBF4F5] border border-[#B6D7D8] px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Now Expanding Across Nellore Apartment Communities</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-[#475559]">
            {serviceLocations.map((locality, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-[#F4F8F8] hover:bg-[#EBF4F5] px-3.5 py-1.5 rounded-full border border-[#DFE8E8] transition-colors"
              >
                <MapPin className="h-3 w-3 text-[#0C6266] shrink-0" />
                <span>{locality}</span>
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
                Aadhaar Verified Partners
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
            {OSMIDA_SERVICES.map((s) => {
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
            <div className="rounded-2xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group shadow-xl">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 01
                </span>
                <h3 className="text-lg font-bold text-white">Pick services & duration</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Select 1, 1.5, or 2 hours. Choose any sequence of tasks at flat ₹199/hr. Instant or scheduled.
                </p>
              </div>

              {/* Step 1 Native UI Screen */}
              <div className="relative rounded-2xl border border-[#165054] bg-[#072427] p-4 shadow-2xl space-y-3 font-sans">
                {/* Mini App Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-[11px] font-black text-white tracking-wide">Osmida • Select Tasks</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#E68A00] bg-[#E68A00]/15 px-2 py-0.5 rounded-full border border-[#E68A00]/30">
                    Flat ₹199/hr
                  </span>
                </div>

                {/* Selected Chores Sequence */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#0C6266] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-white font-bold">Bathroom Scrubbing</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">1.0 hr</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#0C6266] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-white font-bold">Kitchen Utensils</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">0.5 hr</span>
                  </div>
                </div>

                {/* Live Estimated Cost & ₹0 Advance Indicator */}
                <div className="pt-1 flex items-center justify-between border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">1.5 hrs sequence</p>
                    <p className="text-sm font-black text-white">
                      ₹299 <span className="text-[10px] text-[#16A34A] font-extrabold">• ₹0 Advance</span>
                    </p>
                  </div>
                  <div className="text-[10px] font-extrabold bg-[#E68A00] text-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group shadow-xl">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 02
                </span>
                <h3 className="text-lg font-bold text-white">Doorstep Start OTP</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Verified Nellore helper arrives in 15–30 mins. Share your 4-digit code to start the service timer.
                </p>
              </div>

              {/* Step 2 Native UI Screen */}
              <div className="relative rounded-2xl border border-[#165054] bg-[#072427] p-4 shadow-2xl space-y-3 font-sans">
                {/* Mini App Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-ping" />
                    <span className="text-[11px] font-black text-white tracking-wide">Helper At Doorstep</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0C6266] bg-[#EBF4F5] px-2 py-0.5 rounded-full">
                    Nellore Central
                  </span>
                </div>

                {/* Helper Profile Card */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#0C6266] text-white flex items-center justify-center font-bold text-xs border border-white/20 shrink-0">
                    LK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">Lakshmi K.</p>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-400">Aadhaar Verified Partner</p>
                  </div>
                </div>

                {/* 4-Digit Start OTP Box */}
                <div className="rounded-xl bg-[#E68A00]/10 border border-[#E68A00]/30 p-2.5 text-center space-y-1.5">
                  <p className="text-[10px] font-extrabold text-[#E68A00] uppercase tracking-wider">
                    Share Start OTP with helper
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {["4", "8", "2", "9"].map((digit, i) => (
                      <span
                        key={i}
                        className="w-8 h-8 rounded-lg bg-black/50 border border-[#E68A00]/50 text-white font-mono text-sm font-black flex items-center justify-center shadow-inner"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400">Timer begins only after helper enters this</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-[#0B2E31] border border-[#104347] p-6 flex flex-col justify-between space-y-6 hover:border-[#E68A00]/50 transition-all group shadow-xl">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#E68A00]/20 border border-[#E68A00]/40 text-[#E68A00] px-3 py-1 text-xs font-bold uppercase">
                  Step 03
                </span>
                <h3 className="text-lg font-bold text-white">Photo QC & Escrow Pay</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Inspect Before & After photo proof. Share End OTP only when satisfied to release escrow payment.
                </p>
              </div>

              {/* Step 3 Native UI Screen */}
              <div className="relative rounded-2xl border border-[#165054] bg-[#072427] p-4 shadow-2xl space-y-3 font-sans">
                {/* Mini App Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span className="text-[11px] font-black text-white tracking-wide">Work Completed</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#16A34A] bg-[#16A34A]/15 px-2 py-0.5 rounded-full border border-[#16A34A]/30">
                    QC Verified
                  </span>
                </div>

                {/* Before / After Proof Badges */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Before Photo</span>
                    <div className="h-8 rounded-lg bg-black/40 flex items-center justify-center text-[10px] text-slate-300 font-semibold border border-white/5">
                      📷 Untidy Sink
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 space-y-1">
                    <span className="text-[9px] font-bold text-[#16A34A] uppercase tracking-wider">After Photo</span>
                    <div className="h-8 rounded-lg bg-[#16A34A]/20 flex items-center justify-center text-[10px] text-white font-bold border border-[#16A34A]/40">
                      ✨ Spotless Clean
                    </div>
                  </div>
                </div>

                {/* Escrow Release Card */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Escrow Protection</p>
                    <p className="text-xs font-black text-white">₹299 Held Safe</p>
                  </div>
                  <div className="text-[10px] font-extrabold bg-[#16A34A] hover:bg-[#15803D] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <span>Release Pay</span>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
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
            <div className="relative h-60 sm:h-80 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
              <Image
                src="/images/osmida_app_real.jpg"
                alt="Osmida Customer App - Trusted House Help in Nellore"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <div className="absolute top-3 left-3 bg-[#0C6266]/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#E68A00]" />
                <span>Real Osmida Experience</span>
              </div>
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
      <OsmidaFooter />

      {/* 11. SERVICE DETAIL MODAL */}
      <OsmidaServiceDetailModal
        service={selectedModalService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}