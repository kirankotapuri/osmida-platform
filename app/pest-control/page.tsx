"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Language } from "@/lib/translations";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Check,
  Calendar,
  ClipboardCheck,
  Sparkles,
  Eye,
  BadgePercent,
  RotateCcw,
  ChevronDown,
  ArrowRight,
  Shield,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  Droplets,
} from "lucide-react";
import { CategorySelectorModal } from "@/components/CategorySelectorModal";

export default function PestControlPage() {
  const [lang, setLang] = useState<Language>("en");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? "నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో పురుగుల నియంత్రణ (Pest Control) ప్లాన్ల గురించి వివరాలు కావాలి."
        : "Namaskaram Osmida! I would like details about Pest Control plans in Nellore."
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  // Section 4: 5 Core Cards Data with Real Photography
  const planCards = [
    {
      id: "general-1bhk",
      imageSrc: "/images/service-pest-general.jpg",
      titleEn: "General Pest – 1 BHK",
      titleTe: "సాధారణ పురుగులు – 1 BHK",
      scopeEn: [
        "Living room + 1 bedroom + kitchen + washroom(s)",
        "Treatment for cockroaches, ants, mosquitoes, and common pests",
        "Safe, government‑approved chemicals",
        "30‑day warranty on treatment",
        "Trained technicians, minimal disruption",
      ],
      scopeTe: [
        "హాల్ + 1 బెడ్రూమ్ + కిచెన్ + వాష్రూమ్(లు)",
        "బొద్దింకలు, చీమలు, దోమలు మరియు సాధారణ పురుగుల నివారణ",
        "సురక్షితమైన, ప్రభుత్వ ఆమోదం పొందిన రసాయనాలు",
        "చికిత్సపై 30 రోజుల వారంటీ",
        "శిక్షణ పొందిన టెక్నీషియన్లు, సురక్షిత సేవ",
      ],
      priceEn: "From ₹1,499",
      priceTe: "₹1,499 నుండి",
      bookParam: "general-1bhk",
    },
    {
      id: "general-2bhk",
      imageSrc: "/images/service-pest-general.jpg",
      titleEn: "General Pest – 2 BHK",
      titleTe: "సాధారణ పురుగులు – 2 BHK",
      scopeEn: [
        "Living room + 2 bedrooms + kitchen + washroom(s)",
        "Treatment for cockroaches, ants, mosquitoes, and common pests",
        "Safe, government‑approved chemicals",
        "30‑day warranty on treatment",
        "Trained technicians, minimal disruption",
      ],
      scopeTe: [
        "హాల్ + 2 బెడ్రూమ్‌లు + కిచెన్ + వాష్రూమ్(లు)",
        "బొద్దింకలు, చీమలు, దోమలు మరియు సాధారణ పురుగుల నివారణ",
        "సురక్షితమైన, ప్రభుత్వ ఆమోదం పొందిన రసాయనాలు",
        "చికిత్సపై 30 రోజుల వారంటీ",
        "శిక్షణ పొందిన టెక్నీషియన్లు, సురక్షిత సేవ",
      ],
      priceEn: "From ₹1,999",
      priceTe: "₹1,999 నుండి",
      bookParam: "general-2bhk",
    },
    {
      id: "general-3bhk",
      imageSrc: "/images/service-pest-general.jpg",
      titleEn: "General Pest – 3 BHK",
      titleTe: "సాధారణ పురుగులు – 3 BHK",
      scopeEn: [
        "Living room + 3 bedrooms + kitchen + washroom(s)",
        "Treatment for cockroaches, ants, mosquitoes, and common pests",
        "Safe, government‑approved chemicals",
        "30‑day warranty on treatment",
        "Trained technicians, minimal disruption",
      ],
      scopeTe: [
        "హాల్ + 3 బెడ్రూమ్‌లు + కిచెన్ + వాష్రూమ్(లు)",
        "బొద్దింకలు, చీమలు, దోమలు మరియు సాధారణ పురుగుల నివారణ",
        "సురక్షితమైన, ప్రభుత్వ ఆమోదం పొందిన రసాయనాలు",
        "చికిత్సపై 30 రోజుల వారంటీ",
        "శిక్షణ పొందిన టెక్నీషియన్లు, సురక్షిత సేవ",
      ],
      priceEn: "From ₹2,499",
      priceTe: "₹2,499 నుండి",
      bookParam: "general-3bhk",
    },
    {
      id: "bedbug-room",
      imageSrc: "/images/service-pest-bedbug.jpg",
      titleEn: "Bedbug Treatment – Per Room",
      titleTe: "నిద్రపురుగుల చికిత్స – ప్రతి గది",
      scopeEn: [
        "Mattress, bed frame, and nearby walls treated",
        "Targeted action against bedbugs and eggs",
        "Safe chemicals, instructions for preparation provided",
        "15–30 day warranty based on severity",
        "Trained technicians, discreet service",
      ],
      scopeTe: [
        "మ్యాట్రెస్, మంచం ఫ్రేమ్ మరియు సమీప గోడల చికిత్స",
        "నిద్రపురుగులు మరియు వాటి గుడ్లపై ప్రభావవంతమైన చర్య",
        "సురక్షిత రసాయనాలు, సన్నాహక సూచనలు అందించబడతాయి",
        "తీవ్రతను బట్టి 15–30 రోజుల వారంటీ",
        "శిక్షణ పొందిన నిపుణులు, నమ్మకమైన సేవ",
      ],
      priceEn: "From ₹999 per room",
      priceTe: "₹999 నుండి ప్రతి గదికి",
      bookParam: "bedbug",
    },
    {
      id: "termite-sqft",
      imageSrc: "/images/service-pest-termite.jpg",
      titleEn: "Termite Control – Per Sq. Ft.",
      titleTe: "తెల్లచీమల నియంత్రణ – ప్రతి చ.అ.కు",
      scopeEn: [
        "Pre‑construction and post‑construction treatment",
        "Drilling and injection where required",
        "Anti‑termite chemicals as per standard practice",
        "Long‑term warranty options available",
        "Experienced technicians, minimal damage",
      ],
      scopeTe: [
        "నిర్మాణానికి ముందు & తర్వాత పూర్తి చికిత్స",
        "అవసరమైన చోట డ్రిల్లింగ్ & రసాయన ఇంజెక్షన్",
        "ప్రామాణిక నాణ్యత కలిగిన యాంటీ-టెర్మటైట్ రసాయనాలు",
        "దీర్ఘకాలిక వారంటీ ఎంపికలు అందుబాటులో ఉన్నాయి",
        "అనుభవజ్ఞులైన టెక్నీషియన్లు, గోడలకు నష్టం లేకుండా సేవ",
      ],
      priceEn: "From ₹8 per sq. ft.",
      priceTe: "₹8 నుండి ప్రతి చ.అ.కు",
      bookParam: "termite",
    },
  ];

  // Section 4B: Add-Ons Data
  const addOnCards = [
    {
      id: "extra-room",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#FF5A3C] flex items-center justify-center">
          <Home className="h-6 w-6" />
        </div>
      ),
      titleEn: "Extra Room – General Pest",
      titleTe: "అదనపు గది – సాధారణ పురుగులు",
      scopeEn: "Add one more room to your general pest treatment.",
      scopeTe: "మీ సాధారణ పురుగుల చికిత్సకు ఒక అదనపు గదిని చేర్చండి.",
      priceEn: "From ₹499",
      priceTe: "₹499 నుండి",
    },
    {
      id: "kitchen-deep",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#FF5A3C] flex items-center justify-center">
          <Sparkles className="h-6 w-6" />
        </div>
      ),
      titleEn: "Kitchen Deep Treatment",
      titleTe: "కిచెన్ డీప్ ట్రీట్మెంట్",
      scopeEn: "Focused gel baiting and spray in kitchen areas.",
      scopeTe: "కిచెన్ ప్రాంతాల్లో ఫోకస్డ్ జెల్ బెయిటింగ్ మరియు స్ప్రే.",
      priceEn: "From ₹699",
      priceTe: "₹699 నుండి",
    },
    {
      id: "washroom-sanitisation",
      icon: (
        <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#FF5A3C] flex items-center justify-center">
          <Droplets className="h-6 w-6" />
        </div>
      ),
      titleEn: "Washroom Sanitisation",
      titleTe: "వాష్రూమ్ శానిటైజేషన్",
      scopeEn: "Extra disinfection and odour control in washrooms.",
      scopeTe: "వాష్రూమ్లలో అదనపు డిస్ఇన్ఫెక్షన్ మరియు వాసన నియంత్రణ.",
      priceEn: "From ₹399 per washroom",
      priceTe: "₹399 నుండి ప్రతి వాష్రూమ్కు",
    },
  ];

  // Section 5: How it Works Data
  const howItWorksSteps = [
    {
      number: "1",
      icon: <Calendar className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Book online or call us",
      titleTe: "ఆన్లైన్ బుక్ చేయండి లేదా మాకు కాల్ చేయండి",
      descEn: "Tell us about your pest problem and property size.",
      descTe: "మీ పురుగుల సమస్య మరియు ఇంటి పరిమాణం గురించి చెప్పండి.",
    },
    {
      number: "2",
      icon: <ClipboardCheck className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Inspection & slot confirmation",
      titleTe: "పరిశీలన మరియు స్లాట్ ఖాయం",
      descEn: "We’ll call you within 30 minutes to confirm date & time. Free inspection for most cases.",
      descTe: "మేము 30 నిమిషాల్లో మీకు కాల్ చేసి తేదీ మరియు సమయం ఖాయం చేస్తాము. చాలా సందర్భాల్లో ఉచిత పరిశీలన.",
    },
    {
      number: "3",
      icon: <ShieldCheck className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Treatment by verified partners",
      titleTe: "ధృవీకరించబడిన భాగస్వాముల ద్వారా చికిత్స",
      descEn: "Trained technicians use safe chemicals. Warranty included.",
      descTe: "శిక్షణ పొందిన టెక్నీషియన్లు సురక్షితమైన రసాయనాలు వాడతారు. వారంటీ చేర్చబడింది.",
    },
  ];

  // Section 6: Why Choose Osmida Trust Bullets
  const trustBullets = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#1E6FFF]" />,
      titleEn: "Verified partners",
      titleTe: "ధృవీకరించబడిన భాగస్వాములు",
      descEn: "Background-checked, trained technicians.",
      descTe: "నేపథ్య పరిశీలన, శిక్షణ పొందిన టెక్నీషియన్లు.",
    },
    {
      icon: <Eye className="h-6 w-6 text-[#1E6FFF]" />,
      titleEn: "Supervised quality",
      titleTe: "పర్యవేక్షణ నాణ్యత",
      descEn: "We monitor every job for quality.",
      descTe: "మేము ప్రతి పనిని నాణ్యత కోసం పర్యవేక్షిస్తాము.",
    },
    {
      icon: <BadgePercent className="h-6 w-6 text-[#1E6FFF]" />,
      titleEn: "Clear pricing",
      titleTe: "స్పష్టమైన ధరలు",
      descEn: "No hidden charges, fair rates.",
      descTe: "దాచిన ఛార్జీలు లేవు, న్యాయమైన రేట్లు.",
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-[#1E6FFF]" />,
      titleEn: "Easy reschedule & support",
      titleTe: "సులభమైన రీషెడ్యూల్ మరియు సపోర్ట్",
      descEn: "Quick reschedule and responsive support.",
      descTe: "త్వరిత రీషెడ్యూల్ మరియు స్పందించే సపోర్ట్.",
    },
  ];

  // Section 7: FAQ Data
  const faqs = [
    {
      qEn: "How long does the pest control treatment take?",
      qTe: "పురుగుల నియంత్రణ చికిత్స ఎంత సమయం పడుతుంది?",
      aEn: "Most 1–2 BHK treatments take 1.5–2.5 hours, depending on infestation.",
      aTe: "చాలా 1–2 BHK చికిత్సలు 1.5–2.5 గంటలు పడుతుంది, ఇన్ఫెస్టేషన్ బట్టి.",
    },
    {
      qEn: "Is it safe for kids and pets?",
      qTe: "ఇది పిల్లలు మరియు పెట్స్కు సురక్షితమేనా?",
      aEn: "We use safe, approved chemicals. We’ll share precautions before treatment.",
      aTe: "మేము సురక్షితమైన, ఆమోదించబడిన రసాయనాలు వాడతాము. చికిత్సకు ముందు జాగ్రత్తలు చెప్తాము.",
    },
    {
      qEn: "What is the warranty?",
      qTe: "వారంటీ ఏమిటి?",
      aEn: "General pest: 30 days. Bedbug: 15–30 days based on severity. Terms apply.",
      aTe: "సాధారణ పురుగులు: 30 రోజులు. నిద్రపురుగులు: తీవ్రతను బట్టి 15–30 రోజులు. నిబంధనలు వర్తిస్తాయి.",
    },
    {
      qEn: "Do I need to prepare anything before treatment?",
      qTe: "చికిత్సకు ముందు నేను ఏదైనా సిద్ధం చేయాలా?",
      aEn: "We’ll share simple prep steps when you book (like covering food, moving items).",
      aTe: "మీరు బుక్ చేసినప్పుడు మేము సింపుల్ సిద్ధత దశలు చెప్తాము (ఉదా: ఆహారం కవర్ చేయడం, వస్తువులు తరలించడం).",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111111] pt-16 lg:pt-20 pb-20 lg:pb-0 selection:bg-[#1E6FFF] selection:text-white">
      {/* GLOBAL FIXED HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 3. HERO SECTION (Service Title + Intro) */}
      <section className="bg-[#F7F8FA] lg:bg-white border-b border-[#E5E7EB] py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Breadcrumb / Top Tag */}
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-[#555555]">
            <Link href="/" className="hover:text-[#1E6FFF] transition-colors">
              {lang === "te" ? "హోమ్" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-[#111111]">
              {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12">
            {/* Mobile Photo on Top (<1024px) */}
            <div className="lg:hidden w-full flex justify-center py-2">
              <div className="relative w-full max-w-[360px] h-[210px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/service-pest-v2.jpg"
                  alt="Osmida Pest Specialist in Official Uniform"
                  fill
                  className="object-cover object-top"
                  sizes="360px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Official Osmida Pest Specialist
                </div>
              </div>
            </div>

            {/* Left Content (≈60% width) */}
            <div className="w-full lg:w-[58%] text-left space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5A3C]/30 bg-[#FF5A3C]/10 px-3 py-1 text-xs font-bold text-[#FF5A3C]">
                <span>🛡️</span>
                <span>{lang === "te" ? "30 రోజుల రీవిజిట్ వారంటీ" : "30-Day Free Revisit Warranty"}</span>
              </div>

              {/* H1 Title */}
              <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#111111] leading-snug tracking-tight">
                {lang === "te"
                  ? "నెల్లూరులో ఇళ్లు మరియు షాప్ల కోసం పురుగుల నియంత్రణ"
                  : "Pest Control for Homes & Shops in Nellore"}
              </h1>

              {/* Intro Paragraph */}
              <p className="text-[14px] sm:text-[16px] lg:text-[17px] font-normal text-[#555555] leading-relaxed max-w-[680px]">
                {lang === "te"
                  ? "మేము నెల్లూరులో ఇళ్లు, షాప్లు మరియు కార్యాలయాల కోసం సాధారణ పురుగుల నియంత్రణ, నిద్రపురుగుల చికిత్స మరియు తెల్లచీమల నియంత్రణ అందిస్తాము. సురక్షితమైన రసాయనాలు, శిక్షణ పొందిన టెక్నీషియన్లు, చికిత్సపై వారంటీ."
                  : "We provide general pest control, bedbug treatment, and termite control for homes, shops, and offices in Nellore. Safe chemicals, trained technicians, and warranty on treatment."}
              </p>

              {/* Trust Badges Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#555555]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "సురక్షిత రసాయనాలు" : "Govt-Approved Safe Sprays"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "శిక్షణ పొందిన టెక్నీషియన్లు" : "Verified Osmida Technicians"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "30 నిమిషాల్లో కాల్" : "30-Min Call Confirmation"}</span>
                </div>
              </div>

              {/* Quick Jump / Book button */}
              <div className="pt-3 flex items-center gap-3">
                <a
                  href="#service-plans"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#1E6FFF] hover:bg-[#0F4BD6] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <span>{lang === "te" ? "ప్లాన్లు చూడండి & బుక్ చేయండి" : "View Plans & Book"}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+917676358162"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] px-5 py-3.5 text-sm font-semibold text-[#111111] shadow-xs transition-all duration-200 active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4 text-[#1E6FFF]" />
                  <span>{lang === "te" ? "కాల్ చేయండి" : "Call 76763 58162"}</span>
                </a>
              </div>
            </div>

            {/* Desktop Photo (≈42% width) */}
            <div className="hidden lg:flex lg:w-[42%] justify-end">
              <div className="relative w-full max-w-[450px] h-[300px] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <Image
                  src="/images/service-pest-v2.jpg"
                  alt="Osmida Pest Specialist in Official Uniform"
                  fill
                  className="object-cover object-top"
                  sizes="450px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Official Osmida Uniform & Certified Pest Tech
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICE OPTIONS (Cards Grid) */}
      <section id="service-plans" className="bg-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Section Heading */}
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-[#111111]">
              {lang === "te"
                ? "మీ పురుగుల నియంత్రణ ప్లాన్ ఎంచుకోండి"
                : "Choose Your Pest Control Plan"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te"
                ? "సులభమైన బుకింగ్, పారదర్శక ధరలు మరియు 30 రోజుల వారంటీ"
                : "Simple booking, transparent prices & 30-day warranty"}
            </p>

            {/* Urban Company Image 2-Style Interactive Drawer Trigger */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 px-5 py-2.5 text-xs font-bold text-rose-700 shadow-2xs transition-all active:scale-[0.98]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>
                  {lang === "te"
                    ? "⚡ పాప్-అప్ డ్రాయర్‌లో అన్ని ప్యాకేజీలు చూడండి (Urban Company శైలి)"
                    : "⚡ Open Interactive Pest Drawer (Urban Company Style)"}
                </span>
              </button>
            </div>
          </div>

          {/* Grid: 3 Columns on Desktop, 2 on Tablet, 1 Column on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planCards.map((card) => {
              const scopeItems = lang === "te" ? card.scopeTe : card.scopeEn;
              const title = lang === "te" ? card.titleTe : card.titleEn;
              const subTitle = lang === "te" ? card.titleEn : card.titleTe;
              const price = lang === "te" ? card.priceTe : card.priceEn;

              return (
                <div
                  key={card.id}
                  className="rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Real Photography Header */}
                    <div className="relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-xs">
                      <Image
                        src={card.imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Card Title (EN / TEL stacked) */}
                    <div className="text-center">
                      <h3 className="text-[18px] lg:text-[20px] font-bold text-[#111111]">
                        {title}
                      </h3>
                      <p className="text-xs font-semibold text-[#888888] mt-0.5">
                        {subTitle}
                      </p>
                    </div>

                    {/* What's Included Section Header & Bullets */}
                    <div className="mt-5 pt-4 border-t border-[#F0F2F5]">
                      <p className="text-[13px] lg:text-[14px] font-semibold text-[#555555] mb-2.5">
                        {lang === "te" ? "ఇది ఏమి కలిగి ఉంది" : "What’s included"}
                      </p>
                      <div className="space-y-2">
                        {scopeItems.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[14px] lg:text-[15px] font-normal text-[#555555]">
                            <span className="text-[#FF5A3C] font-bold mt-0.5">-</span>
                            <span className="leading-snug">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA Button */}
                  <div className="mt-6 pt-4 border-t border-[#F0F2F5]">
                    <div className="flex items-baseline justify-between mb-3.5">
                      <span className="text-xs font-medium text-[#555555]">
                        {lang === "te" ? "ప్రారంభ ధర" : "Standard Price"}
                      </span>
                      <span className="text-[16px] lg:text-[17px] font-semibold text-[#1E6FFF]">
                        {price}
                      </span>
                    </div>

                    <Link
                      href={`/book?service=pest-control&plan=${card.bookParam}`}
                      className="w-full flex items-center justify-center gap-2 rounded-[10px] bg-[#1E6FFF] hover:bg-[#0F4BD6] text-white py-3 lg:py-3.5 text-center text-[15px] lg:text-[16px] font-semibold shadow-xs transition-all duration-200 active:scale-[0.98]"
                    >
                      <span>{lang === "te" ? "బుక్ చేయండి" : "Book Now"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4B. ADD-ONS (OPTIONAL) SECTION */}
      <section className="bg-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-[1200px]">
          {/* Section Heading & Subtext */}
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-[20px] lg:text-[22px] font-bold text-[#111111]">
              {lang === "te" ? "ఆప్షనల్ యాడ్‑ఆన్లు" : "Add‑Ons (Optional)"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te"
                ? "మీ పురుగుల నియంత్రణ చికిత్సను ఈ ఆప్షనల్ సర్వీస్లతో మెరుగుపరచుకోండి."
                : "Enhance your pest control treatment with these optional services."}
            </p>
          </div>

          {/* Add-Ons Grid (3 Columns on Desktop, 1 on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {addOnCards.map((addon) => (
              <div
                key={addon.id}
                className="rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">{addon.icon}</div>
                  <div>
                    <h3 className="text-[16px] lg:text-[17px] font-bold text-[#111111] leading-snug">
                      {lang === "te" ? addon.titleTe : addon.titleEn}
                    </h3>
                    <p className="text-xs font-semibold text-[#888888] mt-0.5">
                      {lang === "te" ? addon.titleEn : addon.titleTe}
                    </p>
                    <p className="text-[14px] text-[#555555] mt-2.5 leading-relaxed">
                      {lang === "te" ? addon.scopeTe : addon.scopeEn}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#F0F2F5] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#777777]">
                    {lang === "te" ? "ధర" : "Price"}
                  </span>
                  <span className="text-[15px] lg:text-[16px] font-semibold text-[#1E6FFF]">
                    {lang === "te" ? addon.priceTe : addon.priceEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Steps) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Centered Heading */}
          <div className="text-center mb-10">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-[#111111]">
              {lang === "te" ? "ఇది ఎలా పనిచేస్తుంది" : "How It Works"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te" ? "3 సులభమైన దశల్లో పూర్తి పురుగుల నివారణ" : "3 simple steps to a pest-free home"}
            </p>
          </div>

          {/* 3 Steps in a Row (Desktop), Stacked (Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {howItWorksSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-[16px] bg-white border border-[#E5E7EB] p-6 text-center shadow-xs flex flex-col items-center hover:border-[#1E6FFF]/50 transition-all duration-200"
              >
                {/* Circular Icon (64-80px) in Blue on White */}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F6FF] border-2 border-[#1E6FFF]/20 shadow-xs">
                  {step.icon}
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E6FFF] text-xs font-black text-white shadow-xs">
                    {step.number}
                  </span>
                </div>

                {/* Step Title (1 line) */}
                <h3 className="text-[16px] lg:text-[17px] font-bold text-[#111111] mb-2 leading-snug">
                  {lang === "te" ? step.titleTe : step.titleEn}
                </h3>

                {/* Short Description (1-2 lines) */}
                <p className="text-[14px] lg:text-[15px] font-normal text-[#555555] leading-relaxed">
                  {lang === "te" ? step.descTe : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE OSMIDA (Trust Bullets) */}
      <section className="bg-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-[1200px]">
          {/* Section Heading */}
          <div className="text-center mb-10">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-[#111111]">
              {lang === "te"
                ? "నెల్లూరు వారు Osmida ను ఎందుకు ఎంచుకుంటారు"
                : "Why Nellore Chooses Osmida"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te"
                ? "విశ్వసనీయత, నాణ్యమైన పర్యవేక్షణ మరియు పారదర్శక సేవలు"
                : "Trust, verified quality monitoring & transparent service"}
            </p>
          </div>

          {/* 4 Trust Bullets in 2x2 Grid (Desktop), Single Column (Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {trustBullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-5 shadow-xs hover:border-[#1E6FFF]/40 transition-all duration-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
                  {bullet.icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#111111]">
                    {lang === "te" ? bullet.titleTe : bullet.titleEn}
                  </h3>
                  <p className="mt-1 text-[14px] font-normal text-[#555555] leading-relaxed">
                    {lang === "te" ? bullet.descTe : bullet.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ (Frequently Asked Questions) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-[800px]">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[20px] lg:text-[22px] font-bold text-[#111111]">
              {lang === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Frequently Asked Questions"}
            </h2>
            <p className="mt-1.5 text-xs text-[#555555]">
              {lang === "te" ? "పురుగుల నియంత్రణకు సంబంధించిన ముఖ్యమైన సందేహాలు" : "Common questions about our pest control treatments"}
            </p>
          </div>

          {/* Stacked Q&A Items */}
          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-[12px] border border-[#E5E7EB] bg-white transition-all duration-200 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-[15px] sm:text-[17px] text-[#111111] hover:text-[#1E6FFF] transition-colors"
                  >
                    <span>{lang === "te" ? faq.qTe : faq.qEn}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#888888] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#1E6FFF]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-[14px] sm:text-[15px] font-normal text-[#555555] leading-relaxed border-t border-[#F0F2F5]">
                      <p className="pt-3">{lang === "te" ? faq.aTe : faq.aEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA (Call / WhatsApp) */}
      <section className="bg-[#0B0B0F] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-[700px] space-y-4">
          <h2 className="text-[22px] lg:text-[24px] font-bold text-white leading-tight">
            {lang === "te" ? "ఏ ప్లాన్ కావాలో తెలియడం లేదా?" : "Not sure which plan you need?"}
          </h2>

          <p className="text-[15px] lg:text-[16px] font-normal text-[#CCCCCC] leading-relaxed max-w-[540px] mx-auto">
            {lang === "te"
              ? "మా టీమ్తో మాట్లాడండి. మేము సరైన ప్లాన్ సూచించి, 2 నిమిషాల్లో బుక్ చేసుకోవడంలో సహాయపడతాము."
              : "Talk to our team. We’ll suggest the right plan and help you book in 2 minutes."}
          </p>

          {/* Two Big Buttons: Side by Side (Desktop), Stacked (Mobile) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Call Now */}
            <a
              href="tel:+917676358162"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#1E6FFF] hover:bg-[#0F4BD6] px-7 py-3.5 text-center text-[15px] lg:text-[16px] font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Phone className="h-4 w-4 fill-white" />
              <span>
                {lang === "te"
                  ? "ఇప్పుడు కాల్ చేయండి (76763 58162)"
                  : "Call Now (76763 58162)"}
              </span>
            </a>

            {/* WhatsApp Us */}
            <button
              type="button"
              onClick={openWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#25D366] hover:bg-[#1FA851] px-7 py-3.5 text-center text-[15px] lg:text-[16px] font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4 text-white" />
              <span>{lang === "te" ? "వాట్సాప్ చేయండి" : "WhatsApp Us"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-COLUMN FOOTER */}
      <footer className="border-t border-[#222226] bg-[#0B0B0F] px-4 sm:px-6 lg:px-8 py-12 text-[#999999]">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-3">
            <Link href="/" className="text-lg font-black tracking-wider text-white">
              OSMIDA
            </Link>
            <p className="text-xs text-[#888888] leading-relaxed">
              {lang === "te"
                ? "నెల్లూరులో పురుగుల నివారణ, ఏసీ సర్వీసింగ్ మరియు డీప్ క్లీనింగ్ నమ్మకమైన సేవలు."
                : "Professional & verified doorstep home services across Nellore, Andhra Pradesh."}
            </p>
            <p className="text-xs text-[#666666]">
              Trunk Road, Fathekhanpet, Nellore - 524003
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              {lang === "te" ? "సర్వీసులు" : "Services"}
            </h4>
            <ul className="space-y-1.5 text-[#AAAAAA]">
              <li>
                <Link href="/pest-control" className="text-white font-semibold">
                  {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
                </Link>
              </li>
              <li>
                <Link href="/ac-services" className="hover:text-white transition-colors">
                  {lang === "te" ? "ఏసీ సర్వీసింగ్" : "AC Servicing & Repair"}
                </Link>
              </li>
              <li>
                <Link href="/home-deep-cleaning" className="hover:text-white transition-colors">
                  {lang === "te" ? "హోమ్ డీప్ క్లీనింగ్" : "Home Deep Cleaning"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              {lang === "te" ? "కంపెనీ" : "Company"}
            </h4>
            <ul className="space-y-1.5 text-[#AAAAAA]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {lang === "te" ? "మా గురించి" : "About Osmida"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {lang === "te" ? "నిబంధనలు" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {lang === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white transition-colors">
                  {lang === "te" ? "రద్దు మరియు రీఫండ్" : "Cancellation & Refund"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white">
              {lang === "te" ? "సంప్రదించండి" : "Direct Support"}
            </h4>
            <p className="text-[#AAAAAA]">
              {lang === "te" ? "ఉదయం 8:00 నుండి రాత్రి 9:00 వరకు" : "Available 8:00 AM – 9:00 PM"}
            </p>
            <div className="pt-1">
              <a
                href="tel:+917676358162"
                className="inline-flex items-center gap-1.5 font-bold text-[#1E6FFF] hover:underline"
              >
                <span>📞 +91 76763 58162</span>
              </a>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
              >
                <span>💬 WhatsApp Support</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] border-t border-[#222226] mt-8 pt-4 text-center text-xs text-[#555555]">
          © {new Date().getFullYear()} Osmida Services Private Limited. All rights reserved. Made for Nellore.
        </div>
      </footer>

      {/* MOBILE STICKY CONTACT BAR */}
      <FloatingContactBar lang={lang} selectedServiceName="Pest Control" />

      {/* URBAN COMPANY-STYLE MOBILE BOTTOM NAV */}
      <MobileBottomNav lang={lang} onOpenServices={() => setIsModalOpen(true)} />

      {/* URBAN COMPANY IMAGE 2 CATEGORY SELECTOR MODAL */}
      <CategorySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        initialTab="pest"
      />
    </main>
  );
}
