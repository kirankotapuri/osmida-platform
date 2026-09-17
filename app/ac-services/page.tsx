"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Language } from "@/lib/translations";
import { CategorySelectorModal } from "@/components/CategorySelectorModal";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  ClipboardCheck,
  Wrench,
  Eye,
  BadgePercent,
  RotateCcw,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Snowflake,
  SlidersHorizontal,
} from "lucide-react";

export default function AcServicesPage() {
  const [lang, setLang] = useState<Language>("en");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? "నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో ఏసీ సర్వీసింగ్ / రిపేర్ ప్లాన్ల గురించి వివరాలు కావాలి."
        : "Namaskaram Osmida! I would like details about AC Servicing & Repair plans in Nellore."
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  // Urban Company Style AC Visual Category Groups (100% AC Services Only)
  const visualCategoryGroups = [
    {
      groupTitleEn: "AC Servicing & Deep Foam Jet Cleaning",
      groupTitleTe: "ఏసీ సర్వీసింగ్ & డీప్ ఫోమ్ జెట్ క్లీనింగ్",
      items: [
        {
          id: "foam-jet",
          titleEn: "Split AC Foam Jet Service",
          titleTe: "స్ప్లిట్ ఏసీ ఫోమ్ జెట్",
          imageSrc: "/images/service-ac-foamjet.jpg",
          badgeEn: "45 mins",
          badgeTe: "45 నిమిషాలు",
          priceEn: "From ₹599",
          priceTe: "₹599 నుండి",
          bookParam: "foam-jet",
        },
        {
          id: "window-ac",
          titleEn: "Window AC Jet Wash",
          titleTe: "విండో ఏసీ జెట్ వాష్",
          imageSrc: "/images/service-ac-foamjet.jpg",
          badgeEn: "45 mins",
          badgeTe: "45 నిమిషాలు",
          priceEn: "From ₹499",
          priceTe: "₹499 నుండి",
          bookParam: "foam-jet",
        },
        {
          id: "coil-coating",
          titleEn: "Anti-Rust Coil Coating",
          titleTe: "కాయిల్ రక్షణ కోటింగ్",
          imageSrc: "/images/service-ac-repair.jpg",
          badgeEn: "30 mins",
          badgeTe: "30 నిమిషాలు",
          priceEn: "From ₹399",
          priceTe: "₹399 నుండి",
          bookParam: "foam-jet",
        },
      ],
    },
    {
      groupTitleEn: "AC Repair & Cooling Diagnostics",
      groupTitleTe: "రిపేర్ & కూలింగ్ సమస్యల పరిష్కారం",
      items: [
        {
          id: "repair-diagnosis",
          titleEn: "AC Not Cooling / Diagnosis",
          titleTe: "ఏసీ రిపేర్ & డైగ్నాసిస్",
          imageSrc: "/images/service-ac-repair.jpg",
          badgeEn: "30-min call",
          badgeTe: "30 నిమిషాల్లో కాల్",
          priceEn: "From ₹299",
          priceTe: "₹299 నుండి",
          bookParam: "repair-diagnosis",
        },
        {
          id: "gas-refill",
          titleEn: "Gas Leak Check & Refill",
          titleTe: "గ్యాస్ టాప్-అప్ / రీఫిల్",
          imageSrc: "/images/service-ac-repair.jpg",
          badgeEn: "60 mins",
          badgeTe: "60 నిమిషాలు",
          priceEn: "From ₹1,999",
          priceTe: "₹1,999 నుండి",
          bookParam: "gas-refill",
        },
        {
          id: "water-leak",
          titleEn: "Water Leakage Fix",
          titleTe: "వాటర్ లీకేజ్ రిపేర్",
          imageSrc: "/images/service-ac-repair.jpg",
          badgeEn: "30 mins",
          badgeTe: "30 నిమిషాలు",
          priceEn: "From ₹349",
          priceTe: "₹349 నుండి",
          bookParam: "repair-diagnosis",
        },
      ],
    },
    {
      groupTitleEn: "Installation, Uninstallation & Shifting",
      groupTitleTe: "ఇన్స్టాలేషన్, అన్ఇన్స్టాల్ & షిఫ్టింగ్",
      items: [
        {
          id: "ac-installation",
          titleEn: "AC Installation",
          titleTe: "కొత్త ఏసీ ఇన్స్టాలేషన్",
          imageSrc: "/images/service-ac-install.jpg",
          badgeEn: "Same Day",
          badgeTe: "అదే రోజు",
          priceEn: "From ₹899",
          priceTe: "₹899 నుండి",
          bookParam: "ac-installation",
        },
        {
          id: "ac-uninstallation",
          titleEn: "AC Uninstallation",
          titleTe: "ఏసీ అన్ఇన్స్టాల్",
          imageSrc: "/images/service-ac-foamjet.jpg",
          badgeEn: "30 mins",
          badgeTe: "30 నిమిషాలు",
          priceEn: "From ₹499",
          priceTe: "₹499 నుండి",
          bookParam: "ac-installation",
        },
        {
          id: "ac-shifting",
          titleEn: "Complete AC Shifting",
          titleTe: "ఏసీ పూర్తి షిఫ్టింగ్",
          imageSrc: "/images/service-ac-install.jpg",
          badgeEn: "Relocation",
          badgeTe: "సురక్షిత రవాణా",
          priceEn: "From ₹1,299",
          priceTe: "₹1,299 నుండి",
          bookParam: "ac-installation",
        },
      ],
    },
  ];

  // Section 4: Core Detailed Plans
  const planCards = [
    {
      id: "ac-foam-jet",
      imageSrc: "/images/service-ac-foamjet.jpg",
      titleEn: "AC Foam Jet Service",
      titleTe: "ఏసీ ఫోమ్ జెట్ సర్వీస్",
      scopeEn: [
        "Deep cleaning of indoor cooling coils, filters & cross-flow blower",
        "High-pressure water jacket wash (no dirty water on your walls)",
        "Outdoor unit condenser coil high-pressure dust wash",
        "Temperature drop & electrical current check for maximum cooling",
        "15-day cooling & leakage warranty included",
      ],
      scopeTe: [
        "ఇండోర్ కూలింగ్ కాయిల్స్, ఫిల్టర్లు మరియు బ్లోయర్ లోతైన ఫోమ్ జెట్ వాష్",
        "వాటర్ కలెక్షన్ జాకెట్‌తో గోడలపై మరకలు లేకుండా శుభ్రం",
        "అవుట్‌డోర్ కండెన్సర్ యూనిట్‌కు హై-ప్రెజర్ వాటర్ వాష్",
        "గరిష్ట కూలింగ్ కోసం ఉష్ణోగ్రత మరియు విద్యుత్ వినియోగ పరీక్ష",
        "15 రోజుల కూలింగ్ మరియు లీకేజ్ వారంటీ చేర్చబడింది",
      ],
      priceEn: "From ₹599",
      priceTe: "₹599 నుండి",
      bookParam: "foam-jet",
    },
    {
      id: "ac-repair",
      imageSrc: "/images/service-ac-repair.jpg",
      titleEn: "AC Repair & Diagnosis",
      titleTe: "ఏసీ రిపేర్ మరియు డైగ్నాసిస్",
      scopeEn: [
        "Diagnosis for not cooling, water leakage, strange noise, or foul smell",
        "₹299 inspection visit charge (fully adjusted if you proceed with repair)",
        "Transparent quotation with genuine OEM replacement spare parts",
        "Capacitor, sensor, fan motor & PCB circuit testing",
        "30-day warranty on replaced spare parts",
      ],
      scopeTe: [
        "కూలింగ్ రాకపోవడం, వాటర్ లీకేజ్, శబ్దం లేదా వాసనపై సమగ్ర తనిఖీ",
        "₹299 తనిఖీ ఛార్జ్ (రిపేర్ చేయిస్తే బిల్లులో ఈ ఛార్జ్ మినహాయింపు)",
        "ఒరిజినల్ స్పేర్ పార్ట్సుతో పనికి ముందే స్పష్టమైన కొటేషన్",
        "కెపాసిటర్, సెన్సార్, ఫ్యాన్ మోటార్ & PCB సర్క్యూట్ పరీక్ష",
        "భర్తీ చేసిన విడిభాగాలపై 30 రోజుల వారంటీ",
      ],
      priceEn: "From ₹299",
      priceTe: "₹299 నుండి",
      bookParam: "repair-diagnosis",
    },
    {
      id: "ac-gas",
      imageSrc: "/images/service-ac-repair.jpg",
      titleEn: "Gas Top-Up / Refill",
      titleTe: "గ్యాస్ టాప్-అప్ / రీఫిల్",
      scopeEn: [
        "Nitrogen & soap bubble pressure leak testing to find joint leaks",
        "Complete vacuuming and moisture removal before gas charging",
        "100% pure virgin refrigerant (R-32 / R-410A / R-22) filled with manifold gauge",
        "Post-gas charging air vent temperature test (ice-chill guaranteed)",
        "15-day gas leak warranty",
      ],
      scopeTe: [
        "లీక్‌లను గుర్తించడానికి నైట్రోజన్ మరియు సోప్ బబుల్ ప్రెజర్ పరీక్ష",
        "గ్యాస్ నింపే ముందు పూర్తి వాక్యూమింగ్ మరియు తేమ తొలగింపు",
        "డిజిటల్ మీటర్‌తో 100% అసలైన స్వచ్ఛమైన గ్యాస్ (R-32 / R-410A)",
        "గ్యాస్ నింపిన తర్వాత చల్లని గాలి ఉష్ణోగ్రత నిర్ధారణ",
        "గ్యాస్ లీక్‌పై 15 రోజుల వారంటీ",
      ],
      priceEn: "From ₹1,999",
      priceTe: "₹1,999 నుండి",
      bookParam: "gas-refill",
    },
    {
      id: "ac-install",
      imageSrc: "/images/service-ac-install.jpg",
      titleEn: "AC Installation & Shifting",
      titleTe: "ఏసీ ఇన్స్టాలేషన్ & షిఫ్టింగ్",
      scopeEn: [
        "Indoor unit precision level mounting & wall core drilling",
        "Heavy-duty outdoor bracket wall mounting with vibration dampeners",
        "Copper piping connection, electrical wiring & insulation wrapping",
        "Safe gas pumpdown lock during uninstallation or shifting",
        "Leak testing and complete cooling performance trial",
      ],
      scopeTe: [
        "ఇండోర్ యూనిట్ బ్రాకెట్ మౌంటింగ్ మరియు పైపింగ్ డ్రిల్లింగ్",
        "అవుట్‌డోర్ యూనిట్ హెవీ-డ్యూటీ వాల్ స్టాండ్ బిగింపు",
        "కాపర్ పైపింగ్ కనెక్షన్, వైరింగ్ మరియు ఇన్సులేషన్ టేపింగ్",
        "షిఫ్టింగ్ సమయంలో గ్యాస్ లాక్ మరియు సురక్షితమైన అన్‌మౌంటింగ్",
        "లీక్ చెక్ మరియు కూలింగ్ ట్రయల్ రన్ పూర్తి చేయడం",
      ],
      priceEn: "From ₹899",
      priceTe: "₹899 నుండి",
      bookParam: "ac-installation",
    },
  ];

  // Section 4B: Add-Ons Data
  const addOnCards = [
    {
      id: "extra-pipe",
      titleEn: "Extra Copper Piping (per foot)",
      titleTe: "అదనపు కాపర్ పైపింగ్ (అడుగుకు)",
      scopeEn: "Includes high-grade copper tube, twin wire & thermal insulation.",
      scopeTe: "హై-గ్రేడ్ కాపర్ పైప్, వైరింగ్ మరియు థర్మల్ ఇన్సులేషన్ కలిగి ఉంటుంది.",
      priceEn: "₹299 / ft",
      priceTe: "₹299 / అడుగుకు",
    },
    {
      id: "outdoor-stand",
      titleEn: "Heavy-Duty Outdoor Stand",
      titleTe: "హెవీ-డ్యూటీ అవుట్‌డోర్ వాల్ స్టాండ్",
      scopeEn: "Rust-proof powder-coated metal bracket with vibration rubber pads.",
      scopeTe: "రస్ట్-ప్రూఫ్ పౌడర్ కోటెడ్ స్టాండ్ మరియు వైబ్రేషన్ రబ్బర్ ప్యాడ్స్.",
      priceEn: "₹699",
      priceTe: "₹699",
    },
    {
      id: "drain-pipe",
      titleEn: "Drain Pipe Replacement",
      titleTe: "డ్రైన్ పైప్ రీప్లేస్‌మెంట్ (3 మీటర్లు)",
      scopeEn: "High-flexibility UV-resistant water drain pipe with leak sealing.",
      scopeTe: "వాటర్ లీకేజ్ నివారణకు నాణ్యమైన UV-రెసిస్టెంట్ డ్రైన్ పైప్.",
      priceEn: "₹199",
      priceTe: "₹199",
    },
  ];

  // Section 5: How it Works Data (AC-Specific)
  const howItWorksSteps = [
    {
      number: "1",
      icon: <Calendar className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Book online or call us",
      titleTe: "ఆన్లైన్ బుక్ చేయండి లేదా మాకు కాల్ చేయండి",
      descEn: "Tell us your AC issue or service need.",
      descTe: "మీ ఏసీ సమస్య లేదా సర్వీస్ అవసరం గురించి చెప్పండి.",
    },
    {
      number: "2",
      icon: <ClipboardCheck className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Inspection & slot confirmation",
      titleTe: "పరిశీలన మరియు స్లాట్ ఖాయం",
      descEn: "We’ll call within 30 minutes to confirm date & time.",
      descTe: "మేము 30 నిమిషాల్లో మీకు కాల్ చేసి తేదీ మరియు సమయం ఖాయం చేస్తాము.",
    },
    {
      number: "3",
      icon: <Wrench className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Service by certified technicians",
      titleTe: "సర్టిఫైడ్ టెక్నీషియన్ల ద్వారా సర్వీస్",
      descEn: "Safe work, proper testing, and clear billing.",
      descTe: "సురక్షితమైన పని, సరైన పరీక్ష, స్పష్టమైన బిల్లింగ్.",
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

  // Section 7: FAQ Data (AC-Specific)
  const faqs = [
    {
      qEn: "How long does AC servicing take?",
      qTe: "ఏసీ సర్వీస్కు ఎంత సమయం పడుతుంది?",
      aEn: "Most split AC services take 45–60 minutes per AC, depending on condition.",
      aTe: "చాలా స్ప్లిట్ ఏసీ సర్వీస్లు 45–60 నిమిషాలు పడుతుంది, పరిస్థితిని బట్టి.",
    },
    {
      qEn: "Do you provide warranty on gas filling?",
      qTe: "గ్యాస్ ఫిల్లింగ్పై మీరు వారంటీ ఇస్తారా?",
      aEn: "Yes, we provide 7–15 days warranty on gas filling at joints we touched. Terms apply.",
      aTe: "అవును, మేము గ్యాస్ ఫిల్లింగ్పై 7–15 రోజుల వారంటీ ఇస్తాము. నిబంధనలు వర్తిస్తాయి.",
    },
    {
      qEn: "Will there be extra charges for piping?",
      qTe: "పైపింగ్కు అదనపు ఛార్జీలు ఉంటాయా?",
      aEn: "Standard installation includes up to 3 m pipe. Extra piping is charged per foot.",
      aTe: "స్టాండర్డ్ ఇన్స్టాల్లో 3 మీటర్ల వరకు పైప్ ఉంటుంది. అదనపు పైపింగ్కు అడుగుకు ఛార్జ్ వసూలు చేస్తాము.",
    },
    {
      qEn: "Do you service all brands?",
      qTe: "మీరు అన్ని బ్రాండ్ల ఏసీలను సర్వీస్ చేస్తారా?",
      aEn: "Yes, we service all major split and window AC brands.",
      aTe: "అవును, మేము అన్ని ప్రధాన స్ప్లిట్ మరియు విండో ఏసీ బ్రాండ్లను సర్వీస్ చేస్తాము.",
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
              {lang === "te" ? "ఏసీ సర్వీసులు" : "AC Services"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12">
            {/* Mobile Photo on Top (<1024px) */}
            <div className="lg:hidden w-full flex justify-center py-2">
              <div className="relative w-full max-w-[360px] h-[210px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/service-ac-v2.jpg"
                  alt="Osmida AC Service Specialist in Official Uniform"
                  fill
                  className="object-cover object-top"
                  sizes="360px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Official Osmida Technician
                </div>
              </div>
            </div>

            {/* Left Content (≈60% width) */}
            <div className="w-full lg:w-[58%] text-left space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3BA3FF]/30 bg-[#3BA3FF]/10 px-3 py-1 text-xs font-bold text-[#1E6FFF]">
                <Snowflake className="h-3.5 w-3.5" />
                <span>{lang === "te" ? "15 రోజుల లీక్ & కూలింగ్ వారంటీ" : "15-Day Leak & Cooling Warranty"}</span>
              </div>

              {/* H1 Title */}
              <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#111111] leading-snug tracking-tight">
                {lang === "te"
                  ? "నెల్లూరులో ఏసీ సర్వీస్ – రిపేర్, సర్వీస్, ఇన్స్టాల్"
                  : "AC Services in Nellore – Repair, Service, Installation"}
              </h1>

              {/* Intro Paragraph */}
              <p className="text-[14px] sm:text-[16px] lg:text-[17px] font-normal text-[#555555] leading-relaxed max-w-[680px]">
                {lang === "te"
                  ? "మేము నెల్లూరులో ఇళ్లు మరియు షాప్ల కోసం ఏసీ ఫోమ్ జెట్ సర్వీస్, రిపేర్, గ్యాస్ టాప్‑అప్ మరియు కొత్త ఇన్స్టాల్ అందిస్తాము. సర్టిఫైడ్ టెక్నీషియన్లు, సురక్షితమైన పని, స్పష్టమైన ధరలు."
                  : "We provide AC foam jet service, repair, gas top‑up, and new installation for homes and shops in Nellore. Certified technicians, safe work, and clear pricing."}
              </p>

              {/* Trust Badges Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#555555]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "ఫోమ్ జెట్ వాష్" : "High-Pressure Jet Wash"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "సర్టిఫైడ్ టెక్నీషియన్లు" : "Certified HVAC Techs"}</span>
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
                  src="/images/service-ac-v2.jpg"
                  alt="Osmida AC Service Specialist in Official Uniform"
                  fill
                  className="object-cover object-top"
                  sizes="450px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Official Osmida Uniform & Certified HVAC Tech
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4A. URBAN COMPANY STYLE VISUAL SUB-CATEGORY SELECTOR (Image 2) */}
      <section id="service-plans" className="bg-[#FFFFFF] py-10 lg:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-[1200px]">
          {/* Section Header */}
          <div className="text-center mb-8 lg:mb-12">
            <span className="text-[11px] font-bold text-[#1E6FFF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === "te" ? "త్వరిత ఎంపిక" : "Quick Selection"}
            </span>
            <h2 className="text-[22px] lg:text-[26px] font-bold text-[#111111] mt-2.5">
              {lang === "te" ? "మీ ఏసీ అవసరాన్ని ఎంచుకోండి" : "Select Your AC Service"}
            </h2>
            <p className="mt-1 text-sm text-[#555555]">
              {lang === "te"
                ? "మీకు అవసరమైన సర్వీస్ కేటగిరీపై క్లిక్ చేసి నేరుగా బుక్ చేయండి లేదా వివరాలు చూడండి."
                : "Tap your required service to book instantly or explore complete scope."}
            </p>

            {/* Urban Company-Style Interactive Drawer Trigger */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 px-5 py-2.5 text-xs font-bold text-[#1E6FFF] shadow-2xs transition-all active:scale-[0.98]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>
                  {lang === "te"
                    ? "⚡ అన్ని సర్వీస్ కేటగిరీలు చూడండి (ఏసీ, పురుగుల నివారణ, డీప్ క్లీనింగ్)"
                    : "⚡ Explore All Service Categories (AC, Pest Control, Deep Cleaning)"}
                </span>
              </button>
            </div>
          </div>

          {/* Grouped Visual Tiles */}
          <div className="space-y-10">
            {visualCategoryGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3.5">
                {/* Group Heading */}
                <div className="flex items-center gap-2 border-b border-[#F0F2F5] pb-2">
                  <h3 className="text-[16px] lg:text-[18px] font-bold text-[#111111]">
                    {lang === "te" ? group.groupTitleTe : group.groupTitleEn}
                  </h3>
                  <span className="text-xs text-[#888888] font-normal">
                    ({group.items.length} {lang === "te" ? "సేవలు" : "options"})
                  </span>
                </div>

                {/* Visual Tiles Grid (3 Columns on Desktop, 3 Columns on Tablet, 2 on Mobile) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/book?service=ac-services&plan=${item.bookParam}`}
                      className="group relative rounded-2xl bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#1E6FFF] p-3 sm:p-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-between"
                    >
                      {/* Real Photography with Osmida Uniform */}
                      <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                        <Image
                          src={item.imageSrc}
                          alt={item.titleEn}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 160px, 240px"
                        />
                        <div className="absolute top-2 left-2 inline-flex items-center rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-800 shadow-xs">
                          <span>{lang === "te" ? item.badgeTe : item.badgeEn}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-[13px] sm:text-[15px] font-bold text-[#111111] group-hover:text-[#1E6FFF] transition-colors leading-snug line-clamp-2">
                        {lang === "te" ? item.titleTe : item.titleEn}
                      </h4>

                      {/* Price Line */}
                      <div className="mt-2 text-[12px] sm:text-[14px] font-semibold text-[#1E6FFF]">
                        {lang === "te" ? item.priceTe : item.priceEn}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DETAILED SERVICE PLANS (What's Included) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Section Heading */}
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-[#111111]">
              {lang === "te" ? "పూర్తి ప్లాన్ వివరాలు & ప్రయోజనాలు" : "Detailed Plan Scope & Pricing"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te"
                ? "పారదర్శక ధరలు, 5-పాయింట్ చెక్‌లిస్ట్ మరియు 15-30 రోజుల వారంటీ"
                : "Transparent rates, 5-point service checklist & official warranty"}
            </p>
          </div>

          {/* Grid: 2 Columns on Desktop, 1 Column on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
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
                    <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-xs">
                      <Image
                        src={card.imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
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
                            <span className="text-[#1E6FFF] font-bold mt-0.5">-</span>
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
                        {lang === "te" ? "ప్రారంభ ధర" : "Starting From"}
                      </span>
                      <span className="text-[16px] lg:text-[17px] font-semibold text-[#1E6FFF]">
                        {price}
                      </span>
                    </div>

                    <Link
                      href={`/book?service=ac-services&plan=${card.bookParam}`}
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
                ? "మీ ఏసీ సర్వీస్‌కు అవసరమైన అదనపు స్పేర్ పార్ట్‌లు మరియు మౌంటింగ్ సామాగ్రి."
                : "Common add-on spares and accessories for your AC servicing and installation."}
            </p>
          </div>

          {/* Add-Ons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {addOnCards.map((addon) => (
              <div
                key={addon.id}
                className="rounded-[14px] bg-[#FFFFFF] border border-[#E5E7EB] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
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
              {lang === "te" ? "3 సులభమైన దశల్లో పూర్తి ఏసీ సర్వీసింగ్" : "3 simple steps to high-performance cooling"}
            </p>
          </div>

          {/* 3 Steps in a Row (Desktop), Stacked (Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {howItWorksSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-[16px] bg-white border border-[#E5E7EB] p-6 text-center shadow-xs flex flex-col items-center hover:border-[#1E6FFF]/50 transition-all duration-200"
              >
                {/* Circular Icon in Blue on White */}
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

      {/* 7. FAQ (Frequently Asked Questions - AC-Specific) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-[800px]">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[20px] lg:text-[22px] font-bold text-[#111111]">
              {lang === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Frequently Asked Questions"}
            </h2>
            <p className="mt-1.5 text-xs text-[#555555]">
              {lang === "te" ? "ఏసీ సర్వీసింగ్ మరియు రిపేర్ గురించి ముఖ్యమైన సందేహాలు" : "Common questions about our AC servicing & repairs"}
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
            {lang === "te" ? "ఏ సర్వీస్ కావాలో తెలియడం లేదా?" : "Not sure which service you need?"}
          </h2>

          <p className="text-[15px] lg:text-[16px] font-normal text-[#CCCCCC] leading-relaxed max-w-[540px] mx-auto">
            {lang === "te"
              ? "మా టీమ్తో మాట్లాడండి. మేము సరైన సర్వీస్ సూచించి, 2 నిమిషాల్లో బుక్ చేసుకోవడంలో సహాయపడతాము."
              : "Talk to our team. We’ll suggest the right service and help you book in 2 minutes."}
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
                <Link href="/pest-control" className="hover:text-white transition-colors">
                  {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
                </Link>
              </li>
              <li>
                <Link href="/ac-services" className="text-white font-semibold">
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
      <FloatingContactBar lang={lang} selectedServiceName="AC Services" />

      {/* URBAN COMPANY-STYLE MOBILE BOTTOM NAV */}
      <MobileBottomNav lang={lang} onOpenServices={() => setIsModalOpen(true)} />

      {/* URBAN COMPANY IMAGE 2 CATEGORY SELECTOR MODAL */}
      <CategorySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        initialTab="ac"
      />
    </main>
  );
}