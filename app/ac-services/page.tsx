"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Language } from "@/lib/translations";
import { UCServiceCard, UCServiceItemData } from "@/components/UCServiceCard";
import { UCFloatingCartBar } from "@/components/UCFloatingCartBar";
import { UCServiceDetailModal } from "@/components/UCServiceDetailModal";
import { UCSubcategoryTabs, SubcategoryTabItem } from "@/components/UCSubcategoryTabs";
import { UCSubcategoryMenuModal, MenuSubcategory } from "@/components/UCSubcategoryMenuModal";
import {
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Search,
  Share2,
  ChevronDown,
  CheckCircle2,
  Play,
} from "lucide-react";
import { HowItWorksVideoSection } from "@/components/HowItWorksVideoSection";

export default function AcServicesPage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("service");
  const [selectedDetailItem, setSelectedDetailItem] = useState<UCServiceItemData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleOpenDetail = (item: UCServiceItemData) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const scrollToSubcategory = (subId: string) => {
    setActiveTab(subId);
    const element = document.getElementById(subId);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // 4 UC Subcategory Icons with Badges (Screenshot 3)
  const subcategoryTabs: SubcategoryTabItem[] = [
    {
      id: "annual-plan",
      nameEn: "Annual plan",
      nameTe: "వార్షిక ప్లాన్",
      image: "/images/service-ac-annual.jpg",
      badge: "Up to 30% OFF",
    },
    {
      id: "service",
      nameEn: "Service",
      nameTe: "సర్వీస్ & వాష్",
      image: "/images/service-ac-foamjet.jpg",
    },
    {
      id: "repair-gas",
      nameEn: "Repair & gas refill",
      nameTe: "రిపేర్ & గ్యాస్",
      image: "/images/service-ac-gasrefill.jpg",
    },
    {
      id: "install-shift",
      nameEn: "Installation/uninstall",
      nameTe: "ఇన్‌స్టాలేషన్",
      image: "/images/service-ac-install.jpg",
    },
  ];

  const menuCategories: MenuSubcategory[] = [
    { id: "annual-plan", nameEn: "Annual plan", nameTe: "వార్షిక ప్లాన్", itemCount: 2 },
    { id: "service", nameEn: "Service", nameTe: "సర్వీస్", itemCount: 5 },
    { id: "repair-gas", nameEn: "Repair & gas refill", nameTe: "రిపేర్ & గ్యాస్", itemCount: 3 },
    { id: "install-shift", nameEn: "Installation/uninstall", nameTe: "ఇన్‌స్టాలేషన్", itemCount: 3 },
  ];

  // AC Service Data mapped to UC exact structure
  const annualPlanItems: UCServiceItemData[] = [
    {
      id: "ac-annual-2times",
      titleEn: "Annual plan (2 times/year)",
      titleTe: "వార్షిక ప్లాన్ (సంవత్సరానికి 2 సార్లు)",
      price: 798,
      originalPrice: 1198,
      durationEn: "2 visits / yr",
      durationTe: "సంవత్సరానికి 2 విజిట్లు",
      rating: "4.73",
      reviews: "65k",
      optionsCount: "14 options",
      inclusionsEn: [
        "Get 1st deep foam-jet service now. Choose 2nd service anytime in 2026",
        "Applicable for both window or split ACs",
        "Includes complete gas pressure check & drain pipe flush",
        "Priority pro dispatch in Nellore within 30 mins",
      ],
      inclusionsTe: [
        "మొదటి ఫోమ్ జెట్ సర్వీస్ ఇప్పుడే తీసుకోండి. 2వ సర్వీస్ 2026లో ఎప్పుడైనా పొందండి",
        "విండో లేదా స్ప్లిట్ ఏసీ రెండింటికీ వర్తిస్తుంది",
        "పూర్తి గ్యాస్ ప్రెజర్ చెక్ మరియు డ్రెయిన్ పైప్ వాష్ ఉచితం",
        "నెల్లూరులో 30 నిమిషాల్లో ప్రయారిటీ టెక్నీషియన్ విజిట్",
      ],
      exclusionsEn: ["Major spare parts like compressor replacement"],
      exclusionsTe: ["కంప్రెసర్ వంటి భారీ స్పేర్ పార్ట్స్ మినహాయింపు"],
      imageSrc: "/images/service-ac-annual.jpg",
      category: "ac",
      subcategory: "annual-plan",
    },
  ];

  const serviceWashItems: UCServiceItemData[] = [
    {
      id: "ac-foam-jet-1ac",
      titleEn: "Foam-jet AC service (1 AC)",
      titleTe: "ఫోమ్-జెట్ ఏసీ సర్వీస్ (1 AC)",
      price: 599,
      originalPrice: 699,
      durationEn: "45 mins",
      durationTe: "45 నిమిషాలు",
      rating: "4.86",
      reviews: "1.4k",
      badge: "Free gas check",
      optionsCount: "7 options",
      inclusionsEn: [
        "Applicable for both window or split ACs",
        "Indoor unit deep cleaning with foam & jet spray",
        "Waterproof funnel jacket to protect room walls & floor",
        "Outdoor condenser unit washed & cleaned",
        "15-day cooling & leak warranty included",
      ],
      inclusionsTe: [
        "విండో లేదా స్ప్లిట్ ఏసీ రెండింటికీ వర్తిస్తుంది",
        "ఫోమ్ & హై-ప్రెజర్ వాటర్ జెట్‌తో ఇండోర్ యూనిట్ డీప్ క్లీనింగ్",
        "గోడలు, ఫ్లోర్ పాడవకుండా స్పెషల్ వాటర్‌ప్రూఫ్ జాకెట్",
        "అవుట్‌డోర్ కండెన్సర్ యూనిట్ శుభ్రం చేయడం",
        "15 రోజుల ఉచిత కూలింగ్ & లీక్ వారంటీ",
      ],
      exclusionsEn: ["Gas refilling or spare parts replacement"],
      exclusionsTe: ["గ్యాస్ రీఫిల్ లేదా స్పేర్ పార్ట్స్"],
      imageSrc: "/images/service-ac-foamjet.jpg",
      category: "ac",
      subcategory: "service",
    },
    {
      id: "ac-foam-jet-2acs",
      titleEn: "Foam-jet service (2 ACs)",
      titleTe: "ఫోమ్-జెట్ సర్వీస్ (2 ACs)",
      price: 1198,
      originalPrice: 1398,
      durationEn: "2 hrs",
      durationTe: "2 గంటలు",
      rating: "4.77",
      reviews: "15k",
      badge: "Free gas check",
      optionsCount: "₹599/AC",
      inclusionsEn: [
        "Applicable for both window or split ACs",
        "Indoor unit deep cleaning with foam & jet spray for 2 ACs",
        "Waterproof jacket for mess-free service",
        "Outdoor unit jet wash + gas pressure test",
      ],
      inclusionsTe: [
        "2 ఏసీలకు ఫోమ్ మరియు హై ప్రెజర్ జెట్ వాష్",
        "వాటర్‌ప్రూఫ్ జాకెట్‌తో గది పరిశుభ్రంగా ఉంటుంది",
        "అవుట్‌డోర్ యూనిట్ ప్రెజర్ క్లీనింగ్",
        "15 రోజుల సర్వీస్ వారంటీ",
      ],
      imageSrc: "/images/service-ac-2pack.jpg",
      category: "ac",
      subcategory: "service",
    },
    {
      id: "ac-foam-jet-3acs",
      titleEn: "Foam-jet service (3 ACs)",
      titleTe: "ఫోమ్-జెట్ సర్వీస్ (3 ACs)",
      price: 1749,
      originalPrice: 2097,
      durationEn: "3 hrs",
      durationTe: "3 గంటలు",
      rating: "4.80",
      reviews: "8.2k",
      badge: "Free gas check",
      optionsCount: "₹583/AC",
      inclusionsEn: [
        "Deep foam jet wash for 3 AC units",
        "Save up to ₹348 compared to individual bookings",
        "Full condenser and blower cleaning",
      ],
      inclusionsTe: [
        "3 ఏసీలకు పూర్తి ఫోమ్ జెట్ వాష్",
        "విడివిడిగా బుక్ చేయడం కంటే ₹348 ఆదా",
        "15 రోజుల ఉచిత కూలింగ్ గ్యారెంటీ",
      ],
      imageSrc: "/images/service-ac-3pack.jpg",
      category: "ac",
      subcategory: "service",
    },
    {
      id: "ac-jet-wash-window",
      titleEn: "Window AC Deep Jet Wash",
      titleTe: "విండో ఏసీ డీప్ జెట్ వాష్",
      price: 499,
      originalPrice: 599,
      durationEn: "45 mins",
      durationTe: "45 నిమిషాలు",
      rating: "4.81",
      reviews: "820",
      inclusionsEn: [
        "Complete front grill and filter wash",
        "Coil and fan blade pressure cleaning",
        "Electrical box check & performance test",
      ],
      inclusionsTe: [
        "ఫ్రంట్ గ్రిల్ & ఫిల్టర్ల పూర్తి వాష్",
        "కాయిల్ & ఫ్యాన్ బ్లేడ్ ప్రెజర్ క్లీనింగ్",
        "కూలింగ్ పనితీరు పరిశీలన",
      ],
      imageSrc: "/images/service-ac-window.jpg",
      category: "ac",
      subcategory: "service",
    },
    {
      id: "ac-anti-rust-coating",
      titleEn: "Anti-Rust Coil Protective Coating",
      titleTe: "కాయిల్ రక్షణ యాంటీ-రస్ట్ కోటింగ్",
      price: 399,
      originalPrice: 499,
      durationEn: "30 mins",
      durationTe: "30 నిమిషాలు",
      rating: "4.79",
      reviews: "450",
      inclusionsEn: [
        "Specialized protective acrylic spray on condenser & cooling coils",
        "Prevents gas leaks and corrosion from coastal salty Nellore air",
        "Increases AC coil lifespan significantly",
      ],
      inclusionsTe: [
        "కండెన్సర్ కాయిల్స్‌పై ప్రత్యేక యాక్రిలిక్ స్ప్రే",
        "సముద్రపు ఉప్పు గాలి వల్ల వచ్చే తుప్పు & గ్యాస్ లీకేజ్ నివారణ",
        "ఏసీ కాయిల్స్ మన్నికను పెంచుతుంది",
      ],
      imageSrc: "/images/service-ac-antirust.jpg",
      category: "ac",
      subcategory: "service",
    },
  ];

  const repairGasItems: UCServiceItemData[] = [
    {
      id: "ac-repair-inspection",
      titleEn: "AC repair",
      titleTe: "ఏసీ రిపేర్ & చెకప్",
      price: 299,
      originalPrice: 399,
      durationEn: "30 mins",
      durationTe: "30 నిమిషాలు",
      rating: "4.73",
      reviews: "488k",
      optionsCount: "1 option",
      inclusionsEn: [
        "Complete check-up to identify issues before repair",
        "Cooling temperature & amperage test with digital multimeter",
        "Inspection fee adjusted if you approve repairs",
      ],
      inclusionsTe: [
        "రిపేర్‌కు ముందు సమస్యను గుర్తించడానికి సమగ్ర తనిఖీ",
        "కూలింగ్ టెంపరేచర్ & ఆంపియర్ టెస్ట్",
        "రిపేర్ చేయిస్తే ఈ ఇన్‌స్పెక్షన్ ఫీజు మినహాయించబడుతుంది",
      ],
      imageSrc: "/images/service-ac-repair.jpg",
      category: "ac",
      subcategory: "repair-gas",
    },
    {
      id: "ac-gas-refill-check",
      titleEn: "Gas refill & check-up",
      titleTe: "గ్యాస్ రీఫిల్ & చెకప్",
      price: 1999,
      originalPrice: 2499,
      durationEn: "2 hrs 30 mins",
      durationTe: "2 గంటల 30 నిమిషాలు",
      rating: "4.77",
      reviews: "1.3M",
      inclusionsEn: [
        "High-pressure nitrogen leak test before refill",
        "100% pure virgin refrigerant gas (R32 / R410A / R22)",
        "Precision digital weighing scale refill",
        "30-day gas leak warranty included",
      ],
      inclusionsTe: [
        "గ్యాస్ నింపే ముందు నైట్రోజన్ లీక్ టెస్ట్",
        "100% స్వచ్ఛమైన ఒరిజినల్ గ్యాస్ రీఫిల్",
        "డిజిటల్ స్కేల్ ద్వారా ఖచ్చితమైన బరువుతో నింపడం",
        "30 రోజుల పూర్తి గ్యాస్ వారంటీ",
      ],
      imageSrc: "/images/service-ac-gasrefill.jpg",
      category: "ac",
      subcategory: "repair-gas",
    },
    {
      id: "ac-water-leak-fix",
      titleEn: "Water leakage & drain fix",
      titleTe: "వాటర్ లీకేజ్ & డ్రెయిన్ క్లీనింగ్",
      price: 349,
      originalPrice: 449,
      durationEn: "30 mins",
      durationTe: "30 నిమిషాలు",
      rating: "4.80",
      reviews: "210",
      inclusionsEn: [
        "Drain tray and drain pipe unclogging with pressure flush",
        "Indoor back-tray alignment to stop water drops on wall",
        "15-day leak warranty",
      ],
      inclusionsTe: [
        "డ్రెయిన్ ట్రే & పైపులోని చెత్తను క్లీన్ చేసి నీటి ప్రవాహం సరిచేయడం",
        "గోడపై నీళ్లు కారకుండా ఇండోర్ యూనిట్ అలైన్‌మెంట్",
        "15 రోజుల లీక్ వారంటీ",
      ],
      imageSrc: "/images/service-ac-drainfix.jpg",
      category: "ac",
      subcategory: "repair-gas",
    },
  ];

  const installShiftItems: UCServiceItemData[] = [
    {
      id: "ac-installation",
      titleEn: "AC installation",
      titleTe: "ఏసీ ఇన్‌స్టాలేషన్",
      price: 899,
      originalPrice: 1199,
      durationEn: "1 hr 30 mins",
      durationTe: "1 గంట 30 నిమిషాలు",
      rating: "4.73",
      reviews: "523k",
      optionsCount: "2 options",
      inclusionsEn: [
        "Installation of indoor & outdoor with core drilling",
        "Heavy-duty outdoor bracket mounting with spirit-level balancing",
        "Vacuum pump air-purging & cooling verification",
      ],
      inclusionsTe: [
        "ఇండోర్ & అవుట్‌డోర్ యూనిట్ల ప్రొఫెషనల్ ఫిట్టింగ్",
        "స్ప్రిట్ లెవల్ బ్యాలెన్సింగ్‌తో అవుట్‌డోర్ బ్రాకెట్ మౌంటింగ్",
        "వాక్యూమ్ పంప్ ద్వారా పైపులలోని గాలి తొలగించి కూలింగ్ టెస్ట్",
      ],
      imageSrc: "/images/service-ac-install.jpg",
      category: "ac",
      subcategory: "install-shift",
    },
    {
      id: "ac-uninstallation",
      titleEn: "AC uninstallation",
      titleTe: "ఏసీ అన్‌ఇన్‌స్టాలేషన్",
      price: 499,
      originalPrice: 599,
      durationEn: "45 mins",
      durationTe: "45 నిమిషాలు",
      rating: "4.75",
      reviews: "41k",
      optionsCount: "2 options",
      inclusionsEn: [
        "Zero gas loss pump-down procedure to lock gas in condenser",
        "Safe dismounting of indoor unit, outdoor unit & copper pipe",
        "Neat wire rolling and packaging",
      ],
      inclusionsTe: [
        "గ్యాస్ వృథా కాకుండా పంప్-డౌన్ లాకింగ్ పద్ధతి",
        "ఇండోర్, అవుట్‌డోర్ & కాపర్ పైపులను సురక్షితంగా విప్పడం",
        "వైర్లను భద్రంగా చుట్టి ఇవ్వడం",
      ],
      imageSrc: "/images/service-ac-uninstall.jpg",
      category: "ac",
      subcategory: "install-shift",
    },
    {
      id: "ac-complete-shifting",
      titleEn: "Complete AC Shifting (Within Nellore)",
      titleTe: "ఏసీ కంప్లీట్ షిఫ్టింగ్ (నెల్లూరులో)",
      price: 1299,
      originalPrice: 1699,
      durationEn: "2 hrs 30 mins",
      durationTe: "2 గంటల 30 నిమిషాలు",
      rating: "4.82",
      reviews: "180",
      optionsCount: "1 option",
      inclusionsEn: [
        "Zero gas loss uninstallation at old home",
        "Safe transport & complete re-installation at new site",
        "Vacuum test & complete cooling check",
      ],
      inclusionsTe: [
        "పాత ఇంట్లో సురక్షితంగా విప్పి గ్యాస్ లాక్ చేయడం",
        "కొత్త ప్రదేశానికి తరలించి తిరిగి ఫిట్టింగ్ చేయడం",
        "కూలింగ్ టెస్ట్ పూర్తి చేయడం",
      ],
      imageSrc: "/images/service-ac-shifting.jpg",
      category: "ac",
      subcategory: "install-shift",
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Osmida AC Service & Repair Nellore",
        text: "Book AC Foam Jet Service in Nellore at ₹599 with ₹0 advance!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-28">
      {/* 1. TOP APP HEADER */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 2. CATEGORY TOP BAR (Screenshot 3 Header) */}
      <div className="pt-14 sm:pt-16 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-slate-800" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToSubcategory("service")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
              aria-label="Search services"
            >
              <Search className="h-4 w-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors"
              aria-label="Share service"
            >
              <Share2 className="h-4 w-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* 3. HERO CARD (Screenshot 3: AC Service & Repair in 60 mins) */}
        <div className="mx-auto max-w-xl px-4 pb-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left Headline */}
            <div className="space-y-1">
              <span className="inline-block bg-[#007F5F] text-white text-[10px] font-black px-2 py-0.5 rounded-xs tracking-wider uppercase">
                ★ INSTANT
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {lang === "te" ? "ఏసీ సర్వీస్ & రిపేర్ 60 నిమిషాల్లో" : "AC service &\nrepair in 60 mins"}
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {lang === "te" ? "ప్రారంభ ధర ₹299" : "Starts at ₹299"}
              </p>
            </div>

            {/* Right Hero Image (Technician in black uniform & cap servicing AC - Interactive Video Trigger) */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("ac-video-guide");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative h-28 w-32 sm:h-32 sm:w-36 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100 group cursor-pointer focus:outline-none"
              aria-label="Watch AC Service Video Guide"
            >
              <Image
                src="/images/ac-tech-hero.jpg"
                alt="AC Technician Servicing"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="144px"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-white/40 backdrop-blur-xs border border-white/60 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Play className="h-4 w-4 fill-white text-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-1.5 inset-x-1.5 bg-black/75 backdrop-blur-xs text-white text-[8px] font-black py-0.5 rounded text-center tracking-wider uppercase">
                VIDEO GUIDE
              </div>
            </button>
          </div>

          {/* 4. RATING & OSMIDA COVER GUARANTEE STRIP (Screenshot 3) */}
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">AC</span>
                <div className="flex items-center gap-1 text-xs text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  <span className="font-black">4.86</span>
                  <span className="text-slate-500">(1.4k reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#007F5F] px-2 py-0.5 rounded-md text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#007F5F]" />
                <span>{lang === "te" ? "ధృవీకరించిన నిపుణులు" : "Verified Pros"}</span>
              </div>
            </div>

            {/* Osmida Cover Banner */}
            <div className="flex items-center justify-between rounded-xl bg-[#F8F9FA] px-3 py-2 text-xs border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-extrabold text-slate-900">OSMIDA COVER</span>
                <span className="text-slate-500 text-[11px]">
                  {lang === "te"
                    ? "సర్వీస్ & రిపేర్లపై 30 రోజుల వరకు వారంటీ"
                    : "Upto 30 days warranty on repairs"}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* AC Diagnosis & Causes 1-Min Video Explainer Strip */}
            <div className="mt-2 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-3 shadow-sm border border-slate-700/60 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs">
                  <Play className="h-4 w-4 fill-emerald-400 ml-0.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-xs uppercase tracking-wide">
                      {lang === "te" ? "వీడియో గైడ్" : "1-MIN VIDEO"}
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {lang === "te" ? "డయాగ్నోసిస్ & కారణాలు" : "How Diagnosis & Causes Work"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 truncate">
                    {lang === "te"
                      ? "కూలింగ్ సమస్యలు, గ్యాస్ ప్రెజర్ టెస్ట్ & ఫోమ్ జెట్ వాష్ వివరణ"
                      : "See how causes are tested, gas checked & foam-jet done with ₹0 advance"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("ac-video-guide");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#how-to-book-video";
                  }
                }}
                className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all shadow-xs active:scale-95"
              >
                {lang === "te" ? "చూడండి" : "Watch"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. STICKY SUBCATEGORY ICON TABS (Screenshot 3) */}
      <UCSubcategoryTabs
        items={subcategoryTabs}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 6. CONTENT SECTIONS */}
      <div className="mx-auto max-w-xl px-4 divide-y divide-slate-100">
        {/* SECTION A: ANNUAL PLAN */}
        <section id="annual-plan" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "వార్షిక ప్లాన్" : "Annual plan"}
            </h2>
          </div>

          {/* UC Annual Plan Promo Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 relative overflow-hidden shadow-2xs">
            <div className="inline-block bg-[#007F5F] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-2">
              10% OFF
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Annual service plan
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate-400 line-through">₹899</span>
                  <span className="text-sm font-black text-[#007F5F]">₹399/AC</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {lang === "te"
                    ? "సంవత్సరానికి 2 లేదా అంతకంటే ఎక్కువ సర్వీసులపై ఆదా"
                    : "Save on 2/3/4 repairs per year in Nellore"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/images/service-ac-annual.jpg"
                  alt="Annual Plan"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {annualPlanItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION B: SERVICE & FOAM JET */}
        <section id="service" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "సర్వీస్ & వాష్" : "Service"}
            </h2>
          </div>

          {/* UC Foam-jet AC service Hero Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 relative overflow-hidden shadow-2xs">
            <div className="inline-block bg-[#007F5F] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-1.5">
              Free gas check
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Foam-jet AC service
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === "te"
                    ? "మెరుగైన కూలింగ్ కోసం ఏసీ వెంట్స్ డీప్ క్లీన్"
                    : "Deep clean AC vents for efficient cooling"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/images/service-ac-foamjet.jpg"
                  alt="Foam Jet Service"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {serviceWashItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION C: REPAIR & GAS REFILL */}
        <section id="repair-gas" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "రిపేర్ & గ్యాస్ రీఫిల్" : "Repair & gas refill"}
            </h2>
          </div>

          {/* UC Repair & Gas Refill Hero Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 relative overflow-hidden shadow-2xs">
            <div className="inline-block bg-[#007F5F] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-1.5">
              Digital Testing
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {lang === "te" ? "ఏసీ డయాగ్నోసిస్ & గ్యాస్ రీఫిల్" : "AC Repair & Gas Refill"}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === "te"
                    ? "డిజిటల్ మీటర్ చెకప్ • 100% ఒరిజినల్ గ్యాస్ • 30 రోజుల వారంటీ"
                    : "Digital manifold test • 100% pure virgin gas • 30-day leak warranty"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/images/service-ac-gasrefill.jpg"
                  alt="AC Repair & Gas Refill"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {repairGasItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION D: INSTALLATION / UNINSTALLATION */}
        <section id="install-shift" className="pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "ఇన్‌స్టాలేషన్ & షిఫ్టింగ్" : "Installation/uninstallation"}
            </h2>
          </div>

          {/* UC Installation & Shifting Hero Banner Card */}
          <div className="mb-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 p-4 relative overflow-hidden shadow-2xs">
            <div className="inline-block bg-[#007F5F] text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-1.5">
              Precision Level
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {lang === "te" ? "పర్ఫెక్ట్ లెవల్ ఫిట్టింగ్ & షిఫ్టింగ్" : "Precision Mounting & Shifting"}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === "te"
                    ? "కోర్ డ్రిల్లింగ్ • జీరో గ్యాస్ లాస్ అన్‌ఇన్‌స్టాల్ • సేఫ్ ట్రాన్స్‌పోర్ట్"
                    : "Core drilling • Zero gas-loss pump-down • Safe local transport in Nellore"}
                </p>
              </div>

              <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/images/service-ac-install.jpg"
                  alt="AC Installation & Shifting"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          </div>

          {installShiftItems.map((item) => (
            <UCServiceCard
              key={item.id}
              item={item}
              lang={lang}
              onViewDetails={handleOpenDetail}
            />
          ))}
        </section>

        {/* SECTION E: VIDEO GUIDE SECTION */}
        <section id="ac-video-guide" className="pt-6 pb-4">
          <div className="mb-4">
            <div className="inline-block bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-xs uppercase mb-1">
              {lang === "te" ? "వీడియో గైడ్" : "1-Min Telugu Video"}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {lang === "te" ? "ఏసీ సర్వీస్ & డయాగ్నోసిస్ విధానం" : "How AC Diagnosis & Service Works"}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === "te"
                ? "డయాగ్నోసిస్ ఎలా జరుగుతుంది, సమస్యల కారణాలు, మరియు ఫోమ్ జెట్ వాష్ వివరణ"
                : "Watch step-by-step how our verified technicians inspect causes and service your AC with ₹0 advance"}
            </p>
          </div>
          <HowItWorksVideoSection
            lang={lang}
            defaultService="ac"
            sectionId="ac-video-guide"
          />
        </section>
      </div>

      {/* 7. FLOATING ≡ MENU MODAL */}
      <UCSubcategoryMenuModal
        categories={menuCategories}
        activeId={activeTab}
        onSelect={scrollToSubcategory}
        lang={lang}
      />

      {/* 8. FLOATING CART DOCK */}
      <UCFloatingCartBar lang={lang} />

      {/* 10. SERVICE DETAIL BOTTOM SHEET MODAL */}
      <UCServiceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedDetailItem}
        lang={lang}
      />
    </main>
  );
}