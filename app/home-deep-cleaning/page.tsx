"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { Language } from "@/lib/translations";
import {
  CleaningHeroIllustration,
  Clean1BhkIllustration,
  Clean2BhkIllustration,
  Clean3BhkIllustration,
  CleanKitchenBathIllustration,
} from "@/components/ServiceIllustrations";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  ClipboardCheck,
  Sparkles,
  Eye,
  BadgePercent,
  RotateCcw,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomeDeepCleaningPage() {
  const [lang, setLang] = useState<Language>("en");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      lang === "te"
        ? "నమస్కారం ఆస్మిడా! నాకు నెల్లూరులో హోమ్ డీప్ క్లీనింగ్ (Home Deep Cleaning) ప్యాకేజీల గురించి వివరాలు కావాలి."
        : "Namaskaram Osmida! I would like details about Home Deep Cleaning packages in Nellore."
    );
    window.open(`https://wa.me/917676358162?text=${text}`, "_blank");
  };

  // Section 4: 4 Cleaning Cards Data (3 Core + 1 Add-On)
  const planCards = [
    {
      id: "clean-1bhk",
      isAddon: false,
      icon: <Clean1BhkIllustration className="h-16 w-16" />,
      titleEn: "1 BHK Deep Clean",
      titleTe: "1 BHK డీప్ క్లీన్",
      scopeEn: [
        "Living room + 1 bedroom + kitchen + washroom(s)",
        "Floors, walls (reachable), doors, switches, fans (reachable)",
        "Internal glass, mirrors, kitchen counters & sinks",
      ],
      scopeTe: [
        "హాల్ + 1 బెడ్రూమ్ + కిచెన్ + వాష్రూమ్(లు)",
        "ఫ్లోర్లు, గోడలు (చేరుకోగలిగే), డోర్లు, స్విచ్లు, ఫ్యాన్లు (చేరుకోగలిగే)",
        "ఇంటర్నల్ గ్లాస్, అద్దాలు, కిచెన్ కౌంటర్లు మరియు సింక్లు",
      ],
      priceEn: "From ₹2,499",
      priceTe: "₹2,499 నుండి",
      bookParam: "1bhk",
    },
    {
      id: "clean-2bhk",
      isAddon: false,
      icon: <Clean2BhkIllustration className="h-16 w-16" />,
      titleEn: "2 BHK Deep Clean",
      titleTe: "2 BHK డీప్ క్లీన్",
      scopeEn: [
        "Living room + 2 bedrooms + kitchen + washrooms",
        "Floors, walls (reachable), doors, switches, fans (reachable)",
        "Internal glass, mirrors, kitchen counters & sinks",
      ],
      scopeTe: [
        "హాల్ + 2 బెడ్రూమ్‌లు + కిచెన్ + వాష్రూమ్‌లు",
        "ఫ్లోర్లు, గోడలు (చేరుకోగలిగే), డోర్లు, స్విచ్లు, ఫ్యాన్లు (చేరుకోగలిగే)",
        "ఇంటర్నల్ గ్లాస్, అద్దాలు, కిచెన్ కౌంటర్లు మరియు సింక్లు",
      ],
      priceEn: "From ₹3,499",
      priceTe: "₹3,499 నుండి",
      bookParam: "2bhk",
    },
    {
      id: "clean-3bhk",
      isAddon: false,
      icon: <Clean3BhkIllustration className="h-16 w-16" />,
      titleEn: "3 BHK Deep Clean",
      titleTe: "3 BHK డీప్ క్లీన్",
      scopeEn: [
        "Living room + 3 bedrooms + kitchen + washrooms",
        "Floors, walls (reachable), doors, switches, fans (reachable)",
        "Internal glass, mirrors, kitchen counters & sinks",
      ],
      scopeTe: [
        "హాల్ + 3 బెడ్రూమ్‌లు + కిచెన్ + వాష్రూమ్‌లు",
        "ఫ్లోర్లు, గోడలు (చేరుకోగలిగే), డోర్లు, స్విచ్లు, ఫ్యాన్లు (చేరుకోగలిగే)",
        "ఇంటర్నల్ గ్లాస్, అద్దాలు, కిచెన్ కౌంటర్లు మరియు సింక్లు",
      ],
      priceEn: "From ₹4,499",
      priceTe: "₹4,499 నుండి",
      bookParam: "3bhk",
    },
    {
      id: "clean-kitchen-bath",
      isAddon: true,
      icon: <CleanKitchenBathIllustration className="h-16 w-16" />,
      titleEn: "Kitchen / Bathroom Deep Clean",
      titleTe: "కిచెన్ / బాత్రూమ్ డీప్ క్లీన్",
      scopeEn: [
        "Deep degreasing of kitchen counters, sinks, floors",
        "Deep scrub & disinfection of toilets, basins, floors",
        "Safe chemicals, odour control",
      ],
      scopeTe: [
        "కిచెన్ కౌంటర్లు, సింక్‌లు, ఫ్లోర్ల నుండి నూనె జిడ్డు తొలగింపు",
        "టాయిలెట్లు, బేసిన్‌లు, ఫ్లోర్ల లోతైన స్క్రబ్బింగ్ & క్రిమిసంహారక",
        "సురక్షిత రసాయనాలు, వాసన నియంత్రణ",
      ],
      priceEn: "From ₹699",
      priceTe: "₹699 నుండి",
      bookParam: "addon",
    },
  ];

  // Section 5: How it Works Data (Cleaning-Specific)
  const howItWorksSteps = [
    {
      number: "1",
      icon: <Calendar className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Book online or call us",
      titleTe: "ఆన్లైన్ బుక్ చేయండి లేదా మాకు కాల్ చేయండి",
      descEn: "Tell us about your home size and cleaning needs.",
      descTe: "మీ ఇంటి పరిమాణం మరియు క్లీనింగ్ అవసరాలు చెప్పండి.",
    },
    {
      number: "2",
      icon: <ClipboardCheck className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Slot confirmation",
      titleTe: "స్లాట్ ఖాయం",
      descEn: "We’ll call you within 30 minutes to confirm date & time.",
      descTe: "మేము 30 నిమిషాల్లో మీకు కాల్ చేసి తేదీ మరియు సమయం ఖాయం చేస్తాము.",
    },
    {
      number: "3",
      icon: <Sparkles className="h-7 w-7 text-[#1E6FFF]" />,
      titleEn: "Deep clean by trained staff",
      titleTe: "శిక్షణ పొందిన సిబ్బంది ద్వారా డీప్ క్లీన్",
      descEn: "Trained cleaners use safe chemicals. Supervised quality.",
      descTe: "శిక్షణ పొందిన సిబ్బంది సురక్షితమైన రసాయనాలు వాడతారు. పర్యవేక్షణ నాణ్యత.",
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

  // Section 7: FAQ Data (Cleaning-Specific)
  const faqs = [
    {
      qEn: "How long does a 2 BHK deep clean take?",
      qTe: "2 BHK డీప్ క్లీన్ ఎంత సమయం పడుతుంది?",
      aEn: "Most 2 BHK deep cleans take 4–6 hours with 2 cleaners, depending on condition.",
      aTe: "చాలా 2 BHK డీప్ క్లీన్లు 2 క్లీనర్లతో 4–6 గంటలు పడుతుంది, పరిస్థితిని బట్టి.",
    },
    {
      qEn: "Do I need to move furniture before cleaning?",
      qTe: "క్లీనింగ్ కు ముందు నేను ఫర్నిచర్ తరలించాలా?",
      aEn: "Small items should be cleared. For heavy furniture, our team will clean around it. You can request extra help when booking.",
      aTe: "చిన్న వస్తువులు తీసి ఉంచాలి. భారీ ఫర్నిచర్ చుట్టూ మా టీమ్ శుభ్రం చేస్తుంది. అదనపు సహాయం కావాలంటే బుకింగ్ సమయంలో చెప్పండి.",
    },
    {
      qEn: "Are the cleaning chemicals safe for kids and pets?",
      qTe: "క్లీనింగ్ రసాయనాలు పిల్లలు మరియు పెట్స్కు సురక్షితమేనా?",
      aEn: "We use safe, standard household cleaning chemicals. We’ll share simple precautions before starting.",
      aTe: "మేము సురక్షితమైన, ప్రామాణిక ఇంటి క్లీనింగ్ రసాయనాలు వాడతాము. ప్రారంభించే ముందు సింపుల్ జాగ్రత్తలు చెప్తాము.",
    },
    {
      qEn: "Can you clean inside wardrobes and cabinets?",
      qTe: "మీరు వార్డ్రోబ్లు మరియు క్యాబినెట్ల లోపల శుభ్రం చేస్తారా?",
      aEn: "Standard deep cleaning covers external surfaces. Inside wardrobes/cabinets can be done as an add‑on on request.",
      aTe: "స్టాండర్డ్ డీప్ క్లీనింగ్ బాహ్య ఉపరితలాలను కవర్ చేస్తుంది. వార్డ్రోబ్లు/క్యాబినెట్ల లోపల అవసరమైతే అదనపు సర్వీస్ గా చేయవచ్చు.",
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
              {lang === "te" ? "హోమ్ డీప్ క్లీనింగ్" : "Home Deep Cleaning"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12">
            {/* Mobile Illustration on Top (<1024px) */}
            <div className="lg:hidden w-full flex justify-center py-2">
              <CleaningHeroIllustration className="w-full max-w-[360px] h-[210px]" imageSrc="/images/service-cleaning-v2.jpg" />
            </div>

            {/* Left Content (≈58–60% width) */}
            <div className="w-full lg:w-[58%] text-left space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2FBF9B]/30 bg-[#2FBF9B]/10 px-3 py-1 text-xs font-bold text-[#0E8A6B]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{lang === "te" ? "పర్యవేక్షణ నాణ్యత • సురక్షిత రసాయనాలు" : "Supervised Quality • Safe Chemicals"}</span>
              </div>

              {/* H1 Title */}
              <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#111111] leading-snug tracking-tight">
                {lang === "te"
                  ? "నెల్లూరులో ఇంటి డీప్ క్లీనింగ్ – 1/2/3 BHK మరియు కిచెన్లు"
                  : "Home Deep Cleaning in Nellore – 1/2/3 BHK & Kitchens"}
              </h1>

              {/* Intro Paragraph */}
              <p className="text-[14px] sm:text-[16px] lg:text-[17px] font-normal text-[#555555] leading-relaxed max-w-[680px]">
                {lang === "te"
                  ? "అపార్ట్మెంట్లు మరియు స్వంత ఇళ్లకు ప్రొఫెషనల్ డీప్ క్లీనింగ్. మేము ఫ్లోర్లు, గోడలు, కిచెన్, వాష్రూమ్లు మరియు చేరుకోగలిగే గ్లాస్ ప్రాంతాలను శిక్షణ పొందిన సిబ్బంది మరియు సురక్షితమైన రసాయనాలతో శుభ్రం చేస్తాము."
                  : "Professional deep cleaning for apartments and independent homes in Nellore. We clean floors, walls, kitchen, washrooms, and reachable glass areas with trained staff and safe chemicals."}
              </p>

              {/* Trust Badges Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#555555]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "ఫ్లోర్ స్క్రబ్బింగ్" : "Single-Disc Floor Scrubbing"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#25D366]" />
                  <span>{lang === "te" ? "సురక్షిత రసాయనాలు" : "Safe Standard Chemicals"}</span>
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

            {/* Desktop Illustration (≈42% width) */}
            <div className="hidden lg:flex lg:w-[42%] justify-end">
              <CleaningHeroIllustration className="w-full max-w-[450px] h-[300px]" imageSrc="/images/service-cleaning-v2.jpg" />
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
              {lang === "te" ? "మీ డీప్ క్లీనింగ్ ప్లాన్ ఎంచుకోండి" : "Choose Your Deep Cleaning Plan"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te"
                ? "పూర్తి ఇల్లు, కిచెన్ మరియు వాష్రూమ్‌ల కోసం సమగ్ర డీప్ క్లీనింగ్"
                : "Comprehensive deep cleaning packages for apartments, villas & kitchens"}
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
                  className="rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Add-On Badge if applicable */}
                    {card.isAddon && (
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full bg-[#EBF2FE] border border-[#1E6FFF]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#1E6FFF] uppercase tracking-wider">
                          {lang === "te" ? "యాడ్-ఆన్" : "Add-On"}
                        </span>
                      </div>
                    )}

                    {/* Centered Icon (~64-80px) */}
                    <div className="flex justify-center mb-4">
                      {card.icon}
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

                    {/* Scope (3 bullet points) */}
                    <div className="mt-5 pt-4 border-t border-[#F0F2F5] space-y-2.5">
                      {scopeItems.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-[14px] lg:text-[15px] font-normal text-[#555555]">
                          <span className="text-[#1E6FFF] font-bold mt-0.5">-</span>
                          <span className="leading-snug">{bullet}</span>
                        </div>
                      ))}
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
                      href={`/book?service=home-cleaning&plan=${card.bookParam}`}
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

      {/* 5. HOW IT WORKS (3 Steps) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Centered Heading */}
          <div className="text-center mb-10">
            <h2 className="text-[22px] lg:text-[24px] font-bold text-[#111111]">
              {lang === "te" ? "ఇది ఎలా పనిచేస్తుంది" : "How It Works"}
            </h2>
            <p className="mt-2 text-sm text-[#555555]">
              {lang === "te" ? "3 సులభమైన దశల్లో మీ ఇంటికి స్పష్టమైన మెరుపు" : "3 simple steps to a pristine, sparkling clean home"}
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

      {/* 7. FAQ (Frequently Asked Questions - Cleaning-Specific) */}
      <section className="bg-[#F7F8FA] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-[800px]">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[20px] lg:text-[22px] font-bold text-[#111111]">
              {lang === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Frequently Asked Questions"}
            </h2>
            <p className="mt-1.5 text-xs text-[#555555]">
              {lang === "te" ? "ఇంటి డీప్ క్లీనింగ్ గురించి ముఖ్యమైన సమాధానాలు" : "Common questions about our home deep cleaning service"}
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
                <Link href="/pest-control" className="hover:text-white transition-colors">
                  {lang === "te" ? "పురుగుల నియంత్రణ" : "Pest Control"}
                </Link>
              </li>
              <li>
                <Link href="/ac-services" className="hover:text-white transition-colors">
                  {lang === "te" ? "ఏసీ సర్వీసింగ్" : "AC Servicing & Repair"}
                </Link>
              </li>
              <li>
                <Link href="/home-deep-cleaning" className="text-white font-semibold">
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
      <FloatingContactBar lang={lang} selectedServiceName="Home Deep Cleaning" />
    </main>
  );
}
