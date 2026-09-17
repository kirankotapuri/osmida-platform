"use client";

import React, { useState } from "react";
import Image from "next/image";

interface IllustrationProps {
  className?: string;
  imageSrc?: string;
  alt?: string;
}

/**
 * 1. Pest Control Illustrated Icon
 * Features: House outline + safety shield + subtle pest control motif
 * Primary color: #FF5A3C (Warm red/orange), Osmida Blue accent: #1E6FFF
 */
export function PestIllustration({ className = "h-20 w-20", imageSrc, alt = "Pest Control" }: IllustrationProps) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative ${className} overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-xs`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 120px, 160px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow Circle */}
      <circle cx="50" cy="50" r="44" fill="#FF5A3C" fillOpacity="0.1" />
      
      {/* Shield Base (Safety) */}
      <path
        d="M50 18L72 26V46C72 61 62.5 73 50 78C37.5 73 28 61 28 46V26L50 18Z"
        fill="#FFFFFF"
        stroke="#FF5A3C"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Internal Shield Gradient / Osmida Blue Top Accent */}
      <path
        d="M50 24L66 30V45C66 56.5 59 66 50 70C41 66 34 56.5 34 45V30L50 24Z"
        fill="#FF5A3C"
        fillOpacity="0.08"
      />

      {/* Bug / Cockroach stylized icon inside shield */}
      {/* Bug Body */}
      <ellipse cx="50" cy="48" rx="8" ry="11" fill="#FF5A3C" />
      {/* Bug Head */}
      <circle cx="50" cy="35" r="5" fill="#111111" />
      {/* Antennae */}
      <path d="M48 31C45 27 41 26 38 27" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 31C55 27 59 26 62 27" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      {/* Bug Legs */}
      <path d="M42 44H34M42 49L34 52M43 54L36 60" stroke="#FF5A3C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M58 44H66M58 49L66 52M57 54L64 60" stroke="#FF5A3C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Small Osmida Blue Checkmark / Protection Badge */}
      <circle cx="68" cy="68" r="11" fill="#1E6FFF" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M64 68L67 71L73 65" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 2. AC Services Illustrated Icon
 * Features: Split AC indoor unit with cool breeze waves and snowflake
 * Primary color: #3BA3FF (Cool Blue), Osmida Blue accent: #1E6FFF
 */
export function AcIllustration({ className = "h-20 w-20", imageSrc, alt = "AC Services" }: IllustrationProps) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative ${className} overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-xs`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 120px, 160px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow Circle */}
      <circle cx="50" cy="50" r="44" fill="#3BA3FF" fillOpacity="0.1" />

      {/* AC Indoor Unit Body */}
      <rect x="20" y="28" width="60" height="26" rx="6" fill="#FFFFFF" stroke="#3BA3FF" strokeWidth="3.5" />
      
      {/* AC Display Indicator Light */}
      <rect x="64" y="34" width="8" height="4" rx="2" fill="#1E6FFF" />
      <circle cx="60" cy="36" r="1.5" fill="#25D366" />

      {/* AC Air Vent Flap */}
      <path d="M25 48H75" stroke="#3BA3FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Dynamic Cool Air Breeze Lines */}
      <path d="M28 58C32 64 42 66 50 63" stroke="#3BA3FF" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M36 65C42 72 54 73 64 68" stroke="#1E6FFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 72C54 78 66 77 72 73" stroke="#3BA3FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Snowflake Badge */}
      <circle cx="28" cy="70" r="11" fill="#3BA3FF" stroke="#FFFFFF" strokeWidth="2" />
      {/* Snowflake arms */}
      <path d="M28 64V76M22 70H34M24 66L32 74M24 74L32 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 3. Home Deep Cleaning Illustrated Icon
 * Features: House silhouette with sparkling bubbles and clean floor mop
 * Primary color: #2FBF9B (Teal/Green), Osmida Blue accent: #1E6FFF
 */
export function CleaningIllustration({ className = "h-20 w-20", imageSrc, alt = "Home Cleaning" }: IllustrationProps) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative ${className} overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-xs`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          sizes="(max-width: 768px) 120px, 160px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow Circle */}
      <circle cx="50" cy="50" r="44" fill="#2FBF9B" fillOpacity="0.1" />

      {/* House Silhouette Badge */}
      <path
        d="M50 20L22 42V78H78V42L50 20Z"
        fill="#FFFFFF"
        stroke="#2FBF9B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Internal Floor Sparkle Line */}
      <path d="M28 66H72" stroke="#2FBF9B" strokeWidth="2" strokeDasharray="4 3" />

      {/* Mop / Wiper Motif */}
      <line x1="38" y1="74" x2="62" y2="42" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      <rect x="30" y="70" width="18" height="6" rx="2" fill="#1E6FFF" />

      {/* Clean Bubbles */}
      <circle cx="68" cy="40" r="7" fill="#E8F8F4" stroke="#2FBF9B" strokeWidth="2" />
      <circle cx="60" cy="28" r="4" fill="#2FBF9B" />
      <circle cx="34" cy="34" r="5" fill="#E8F8F4" stroke="#2FBF9B" strokeWidth="1.5" />

      {/* Sparkle 4-point Star Badge */}
      <g transform="translate(62, 58)">
        <circle cx="10" cy="10" r="10" fill="#2FBF9B" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M10 4V16M4 10H16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 4. Hero Section High-Definition Illustration / Image Wrapper
 * Features: Professional technician in uniform with Osmida logo,
 * clean Nellore modern home scene, trust badges (Pest, AC, Cleaning).
 */
export function HeroIllustration({ className = "w-full max-w-md h-auto", imageSrc }: IllustrationProps) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative aspect-[16/9] sm:aspect-[4/3] ${className} overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-lg`}>
        <Image
          src={imageSrc}
          alt="Osmida Verified Home Services in Nellore"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          priority
          sizes="(max-width: 1024px) 100vw, 450px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft Background Card / Ambient Glow */}
      <rect x="20" y="20" width="460" height="320" rx="24" fill="#F0F4FA" />
      <circle cx="390" cy="90" r="70" fill="#E1ECFE" />
      <circle cx="100" cy="270" r="90" fill="#E8F8F4" />

      {/* Stylized Modern Indian Home Background Wall & Window */}
      <rect x="60" y="60" width="380" height="240" rx="16" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Window with sunlight */}
      <rect x="90" y="90" width="90" height="80" rx="10" fill="#EBF2FE" stroke="#3BA3FF" strokeWidth="2" />
      <path d="M135 90V170M90 130H180" stroke="#3BA3FF" strokeWidth="2" />

      {/* Wall AC Unit being serviced */}
      <rect x="240" y="85" width="130" height="42" rx="6" fill="#FFFFFF" stroke="#3BA3FF" strokeWidth="2.5" />
      <rect x="335" y="95" width="16" height="6" rx="2" fill="#1E6FFF" />
      <path d="M250 116H360" stroke="#3BA3FF" strokeWidth="2" strokeLinecap="round" />
      {/* Cool breeze waves */}
      <path d="M260 134C280 144 320 144 340 134" stroke="#3BA3FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />

      {/* Potted plant on side (clean home vibe) */}
      <path d="M96 230L102 260H122L128 230H96Z" fill="#8C6E53" />
      <path d="M112 210C100 215 95 225 105 230C115 225 110 215 112 210Z" fill="#2FBF9B" />
      <path d="M112 210C124 215 129 225 119 230C109 225 114 215 112 210Z" fill="#25D366" />

      {/* Verified Professional Technician in Uniform */}
      {/* Body & Osmida Black T-shirt */}
      <path d="M210 300V240C210 220 230 205 255 205C280 205 300 220 300 240V300H210Z" fill="#0B0B0F" />
      {/* White 'OSMIDA' wordmark on shirt */}
      <rect x="238" y="235" width="34" height="8" rx="2" fill="#FFFFFF" />
      <text x="240" y="241" fill="#0B0B0F" fontSize="6" fontWeight="900" letterSpacing="0.5">OSMIDA</text>

      {/* Neck & Head */}
      <rect x="246" y="185" width="18" height="22" rx="4" fill="#D99B77" />
      <circle cx="255" cy="170" r="22" fill="#D99B77" />
      {/* Neat Hair */}
      <path d="M233 166C233 150 244 146 255 146C266 146 277 150 277 166C277 160 268 152 255 152C242 152 233 160 233 166Z" fill="#1A1A1A" />
      {/* Friendly Smile */}
      <circle cx="248" cy="168" r="2" fill="#1A1A1A" />
      <circle cx="262" cy="168" r="2" fill="#1A1A1A" />
      <path d="M250 178C252 181 258 181 260 178" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Professional ID Card Lanyard in Blue */}
      <path d="M242 205L251 228M268 205L259 228" stroke="#1E6FFF" strokeWidth="2" />
      <rect x="250" y="228" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#1E6FFF" strokeWidth="1" />

      {/* Floating 3 Core Service Trust Badges (Urban Company style) */}
      
      {/* Badge 1: Pest Control Shield (Left) */}
      <g transform="translate(60, 160)">
        <rect width="110" height="42" rx="21" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(255, 90, 60, 0.15))" stroke="#E5E7EB" />
        <circle cx="22" cy="21" r="14" fill="#FF5A3C" fillOpacity="0.15" />
        <text x="17" y="26" fontSize="13">🛡️</text>
        <text x="42" y="19" fill="#111111" fontSize="10" fontWeight="bold">Pest Control</text>
        <text x="42" y="30" fill="#FF5A3C" fontSize="9" fontWeight="600">30-Day Warranty</text>
      </g>

      {/* Badge 2: AC Servicing (Top Right) */}
      <g transform="translate(320, 40)">
        <rect width="120" height="42" rx="21" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(59, 163, 255, 0.15))" stroke="#E5E7EB" />
        <circle cx="22" cy="21" r="14" fill="#3BA3FF" fillOpacity="0.15" />
        <text x="17" y="26" fontSize="13">❄️</text>
        <text x="42" y="19" fill="#111111" fontSize="10" fontWeight="bold">AC Services</text>
        <text x="42" y="30" fill="#1E6FFF" fontSize="9" fontWeight="600">Jet Pump Wash</text>
      </g>

      {/* Badge 3: Deep Cleaning (Bottom Right) */}
      <g transform="translate(320, 240)">
        <rect width="125" height="42" rx="21" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(47, 191, 155, 0.15))" stroke="#E5E7EB" />
        <circle cx="22" cy="21" r="14" fill="#2FBF9B" fillOpacity="0.15" />
        <text x="17" y="26" fontSize="13">✨</text>
        <text x="42" y="19" fill="#111111" fontSize="10" fontWeight="bold">Deep Cleaning</text>
        <text x="42" y="30" fill="#2FBF9B" fontSize="9" fontWeight="600">Spotless Shine</text>
      </g>
    </svg>
  );
}

/**
 * 5. Dedicated Pest Control Hero Illustration
 * Spec: Nellore-style home/shop front, Osmida technician in black t-shirt with white logo,
 * spray pump & nozzle wand, cockroach, ant, mosquito, and protection shield with checkmark.
 */
export function PestHeroIllustration({
  className = "w-full max-w-[450px] h-[240px] sm:h-[300px]",
  imageSrc = "/images/service-pest-v2.jpg",
}: {
  className?: string;
  imageSrc?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative aspect-[4/3] ${className} overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-lg`}>
        <Image
          src={imageSrc}
          alt="Pest Control Services in Nellore"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          priority
          sizes="(max-width: 1024px) 100vw, 450px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 450 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow & Geometry */}
      <rect x="10" y="10" width="430" height="280" rx="24" fill="#F7F8FA" />
      <circle cx="360" cy="80" r="60" fill="#FF5A3C" fillOpacity="0.08" />
      <circle cx="80" cy="220" r="70" fill="#1E6FFF" fillOpacity="0.06" />

      {/* Nellore Style Home / Shop Front */}
      {/* Roof */}
      <path d="M40 140L140 70L240 140H40Z" fill="#FFE8E2" stroke="#FF5A3C" strokeWidth="2.5" strokeLinejoin="round" />
      {/* House Walls */}
      <rect x="55" y="140" width="170" height="110" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      {/* Door */}
      <rect x="115" y="180" width="40" height="70" rx="3" fill="#0B0B0F" />
      <circle cx="148" cy="216" r="3" fill="#FFFFFF" />
      {/* Window */}
      <rect x="70" y="160" width="32" height="32" rx="4" fill="#EBF2FE" stroke="#3BA3FF" strokeWidth="1.5" />
      <path d="M86 160V192M70 176H102" stroke="#3BA3FF" strokeWidth="1.5" />
      {/* Balcony / Shop Awning Stripes */}
      <path d="M48 136H232" stroke="#FF5A3C" strokeWidth="3" strokeLinecap="round" />

      {/* Spray Mist (safe organic droplet clouds) */}
      <circle cx="210" cy="180" r="14" fill="#E1ECFE" fillOpacity="0.8" />
      <circle cx="225" cy="165" r="18" fill="#E1ECFE" fillOpacity="0.6" />
      <circle cx="195" cy="160" r="12" fill="#E1ECFE" fillOpacity="0.5" />

      {/* Technician in Osmida Uniform (Black T-shirt, White Logo) */}
      {/* Body & T-shirt */}
      <path d="M260 280V205C260 185 280 170 305 170C330 170 350 185 350 205V280H260Z" fill="#0B0B0F" />
      {/* White 'OSMIDA' wordmark */}
      <rect x="288" y="200" width="34" height="8" rx="2" fill="#FFFFFF" />
      <text x="290" y="206" fill="#0B0B0F" fontSize="6" fontWeight="900" letterSpacing="0.5">OSMIDA</text>

      {/* Neck & Head */}
      <rect x="296" y="152" width="18" height="20" rx="4" fill="#D99B77" />
      <circle cx="305" cy="138" r="20" fill="#D99B77" />
      {/* Hair & Mask */}
      <path d="M285 134C285 120 295 116 305 116C315 116 325 120 325 134C325 128 317 122 305 122C293 122 285 128 285 134Z" fill="#1A1A1A" />
      {/* Eyes */}
      <circle cx="299" cy="135" r="2" fill="#1A1A1A" />
      <circle cx="311" cy="135" r="2" fill="#1A1A1A" />
      {/* Protective Safety Mask (White) */}
      <path d="M294 142C294 138 316 138 316 142V150C316 154 294 154 294 150Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />

      {/* Back Spray Pump Canister */}
      <rect x="345" y="195" width="24" height="60" rx="6" fill="#1E6FFF" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="352" y="187" width="10" height="8" rx="2" fill="#0B0B0F" />
      <path d="M357 187V175C357 170 340 170 335 175L240 215" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Spray Wand in hand */}
      <line x1="240" y1="215" x2="200" y2="185" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="185" r="4" fill="#1E6FFF" />

      {/* Floating Trust Shield Badge (Top Left) */}
      <g transform="translate(25, 30)">
        <rect width="130" height="42" rx="21" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(30, 111, 255, 0.12))" stroke="#E5E7EB" />
        <circle cx="22" cy="21" r="14" fill="#1E6FFF" />
        <path d="M17 21L21 25L27 17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="44" y="18" fill="#111111" fontSize="10" fontWeight="bold">Safe Chemicals</text>
        <text x="44" y="30" fill="#1E6FFF" fontSize="9" fontWeight="600">Govt Approved</text>
      </g>

      {/* Bug Badges with cross / shield */}
      {/* 1. Cockroach with cross */}
      <g transform="translate(370, 140)">
        <circle cx="20" cy="20" r="20" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(255, 90, 60, 0.2))" stroke="#FF5A3C" strokeWidth="1.5" />
        <text x="11" y="26" fontSize="16">🪳</text>
        <circle cx="28" cy="12" r="7" fill="#FF5A3C" />
        <path d="M25 9L31 15M31 9L25 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 2. Ant */}
      <g transform="translate(360, 215)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.08))" stroke="#E5E7EB" strokeWidth="1" />
        <text x="8" y="22" fontSize="14">🐜</text>
        <circle cx="24" cy="8" r="6" fill="#1E6FFF" />
        <path d="M21 8L23 10L27 6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 3. Mosquito */}
      <g transform="translate(20, 205)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.08))" stroke="#E5E7EB" strokeWidth="1" />
        <text x="8" y="22" fontSize="14">🦟</text>
        <circle cx="24" cy="8" r="6" fill="#FF5A3C" />
        <path d="M22 6L26 10M26 6L22 10" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 6. Plan Card 1: 1 BHK General Pest Icon
 */
export function Pest1BhkIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#FFF5F3" />
      {/* Small 1-room home outline */}
      <path d="M20 40L40 22L60 40V62H20V40Z" fill="#FFFFFF" stroke="#FF5A3C" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="34" y="46" width="12" height="16" rx="2" fill="#111111" />
      {/* 1 Bug Icon */}
      <circle cx="56" cy="30" r="12" fill="#FF5A3C" />
      <text x="49" y="35" fontSize="11">🪳</text>
      {/* Shield check */}
      <circle cx="24" cy="58" r="9" fill="#1E6FFF" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M21 58L23 60L27 56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 7. Plan Card 2: 2 BHK General Pest Icon
 */
export function Pest2BhkIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#FFF5F3" />
      {/* 2-Room Home Outline */}
      <path d="M16 42L36 24L56 42V62H16V42Z" fill="#FFFFFF" stroke="#FF5A3C" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 30L64 16L74 26V62H56" fill="#FFFFFF" stroke="#FF5A3C" strokeWidth="2" strokeLinejoin="round" />
      <rect x="28" y="48" width="12" height="14" rx="2" fill="#111111" />
      <rect x="44" y="48" width="8" height="8" rx="1" fill="#EBF2FE" stroke="#3BA3FF" strokeWidth="1" />
      {/* Two bugs */}
      <circle cx="64" cy="42" r="11" fill="#FF5A3C" />
      <text x="58" y="47" fontSize="10">🪳</text>
      <circle cx="20" cy="26" r="9" fill="#1E6FFF" />
      <text x="14" y="30" fontSize="8">🐜</text>
    </svg>
  );
}

/**
 * 8. Plan Card 3: Bedbug Treatment Icon
 */
export function BedbugIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#FFF8F0" />
      {/* Bed Headboard */}
      <rect x="16" y="32" width="48" height="8" rx="2" fill="#8C6E53" />
      {/* Mattress */}
      <rect x="20" y="40" width="40" height="14" rx="3" fill="#FFFFFF" stroke="#8C6E53" strokeWidth="2" />
      {/* Pillow */}
      <rect x="24" y="42" width="14" height="6" rx="2" fill="#E5E7EB" />
      {/* Bed legs */}
      <path d="M22 54V64M58 54V64" stroke="#8C6E53" strokeWidth="2.5" strokeLinecap="round" />
      {/* Red Bedbug target circle */}
      <circle cx="56" cy="30" r="13" fill="#FF5A3C" stroke="#FFFFFF" strokeWidth="2" />
      <text x="49" y="35" fontSize="12">🪲</text>
      {/* Cross mark */}
      <circle cx="64" cy="22" r="6" fill="#111111" />
      <path d="M62 20L66 24M66 20L62 24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 9. Plan Card 4: Termite Control Icon
 */
export function TermiteIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#F0F6FF" />
      {/* Wooden Beam / Foundation Wall */}
      <rect x="18" y="48" width="44" height="18" rx="2" fill="#D2B48C" stroke="#8C6E53" strokeWidth="2" />
      {/* Wood grain lines */}
      <path d="M24 54H56M20 60H58" stroke="#8C6E53" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 4" />
      {/* House Pillar above */}
      <path d="M28 22H52V48H28V22Z" fill="#FFFFFF" stroke="#1E6FFF" strokeWidth="2" />
      <path d="M24 22L40 12L56 22" stroke="#1E6FFF" strokeWidth="2.5" strokeLinecap="round" />
      {/* Drill & injection needle effect */}
      <path d="M50 36L64 24" stroke="#FF5A3C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="64" cy="24" r="3" fill="#FF5A3C" />
      {/* Termite Bug Badge */}
      <circle cx="24" cy="36" r="11" fill="#1E6FFF" stroke="#FFFFFF" strokeWidth="2" />
      <text x="18" y="41" fontSize="10">🛡️</text>
    </svg>
  );
}

/**
 * 10. Dedicated AC Services Hero Illustration
 * Spec: Split AC indoor unit on wall, outdoor unit, Osmida technician checking pressure with gauge,
 * tool kit nearby, snowflake (cooling), wrench, gas cylinder, drill.
 */
export function AcHeroIllustration({
  className = "w-full max-w-[450px] h-[240px] sm:h-[300px]",
  imageSrc = "/images/service-ac-v2.jpg",
}: {
  className?: string;
  imageSrc?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative aspect-[4/3] ${className} overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-lg`}>
        <Image
          src={imageSrc}
          alt="AC Services in Nellore"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          priority
          sizes="(max-width: 1024px) 100vw, 450px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 450 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="430" height="280" rx="24" fill="#F7F8FA" />
      <circle cx="360" cy="80" r="60" fill="#3BA3FF" fillOpacity="0.08" />
      <circle cx="80" cy="220" r="70" fill="#1E6FFF" fillOpacity="0.06" />

      {/* Wall Split AC Unit */}
      <rect x="50" y="55" width="160" height="52" rx="8" fill="#FFFFFF" stroke="#3BA3FF" strokeWidth="2.5" />
      <rect x="180" y="68" width="16" height="8" rx="2" fill="#1E6FFF" />
      <path d="M60 92H195" stroke="#3BA3FF" strokeWidth="2" strokeLinecap="round" />
      {/* Cool breeze waves */}
      <path d="M70 114C90 126 130 126 150 114" stroke="#3BA3FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M85 124C105 136 145 136 165 124" stroke="#1E6FFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Outdoor Condenser Unit on right */}
      <rect x="50" y="170" width="110" height="85" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="105" cy="212" r="30" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
      {/* Fan blades */}
      <path d="M105 185V239M78 212H132" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="105" cy="212" r="6" fill="#1E6FFF" />

      {/* Copper Connecting Pipes */}
      <path d="M130 107V150C130 160 140 170 150 170" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Technician in Osmida Black Uniform */}
      <path d="M260 280V205C260 185 280 170 305 170C330 170 350 185 350 205V280H260Z" fill="#0B0B0F" />
      <rect x="288" y="200" width="34" height="8" rx="2" fill="#FFFFFF" />
      <text x="290" y="206" fill="#0B0B0F" fontSize="6" fontWeight="900" letterSpacing="0.5">OSMIDA</text>

      {/* Head */}
      <rect x="296" y="152" width="18" height="20" rx="4" fill="#D99B77" />
      <circle cx="305" cy="138" r="20" fill="#D99B77" />
      <path d="M285 134C285 120 295 116 305 116C315 116 325 120 325 134C325 128 317 122 305 122C293 122 285 128 285 134Z" fill="#1A1A1A" />
      <circle cx="299" cy="135" r="2" fill="#1A1A1A" />
      <circle cx="311" cy="135" r="2" fill="#1A1A1A" />
      <path d="M300 144C302 147 308 147 310 144" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Manifold Pressure Gauge in hand */}
      <circle cx="230" cy="200" r="14" fill="#FFFFFF" stroke="#1E6FFF" strokeWidth="2.5" />
      <circle cx="230" cy="200" r="3" fill="#1E6FFF" />
      <line x1="230" y1="200" x2="238" y2="194" stroke="#FF5A3C" strokeWidth="2" strokeLinecap="round" />
      <path d="M225 214V235L200 245" stroke="#3BA3FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M235 214V235L260 230" stroke="#FF5A3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Refrigerant Gas Cylinder on Ground */}
      <rect x="180" y="215" width="28" height="55" rx="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="187" y="207" width="14" height="8" rx="2" fill="#333333" />
      <text x="186" y="246" fill="#FFFFFF" fontSize="8" fontWeight="bold">R32</text>

      {/* Floating Badges */}
      {/* 1. Snowflake Cooling Badge */}
      <g transform="translate(25, 25)">
        <rect width="125" height="38" rx="19" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(59, 163, 255, 0.15))" stroke="#E5E7EB" />
        <circle cx="20" cy="19" r="13" fill="#3BA3FF" fillOpacity="0.15" />
        <text x="14" y="24" fontSize="13">❄️</text>
        <text x="39" y="17" fill="#111111" fontSize="10" fontWeight="bold">Super Cooling</text>
        <text x="39" y="28" fill="#1E6FFF" fontSize="9" fontWeight="600">Foam Jet Wash</text>
      </g>

      {/* 2. Tool & Wrench Badge */}
      <g transform="translate(365, 140)">
        <circle cx="20" cy="20" r="20" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.08))" stroke="#1E6FFF" strokeWidth="1.5" />
        <text x="12" y="26" fontSize="16">🔧</text>
      </g>

      {/* 3. Certified Tech Badge */}
      <g transform="translate(355, 215)">
        <rect width="80" height="32" rx="16" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.08))" stroke="#E5E7EB" />
        <circle cx="16" cy="16" r="10" fill="#25D366" />
        <path d="M13 16L15 18L19 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="20" fill="#111111" fontSize="9" fontWeight="bold">Certified</text>
      </g>
    </svg>
  );
}

/**
 * 11. Card 1: AC Foam Jet Service Icon
 */
export function AcFoamJetIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#F0F8FF" />
      <rect x="15" y="26" width="50" height="22" rx="4" fill="#FFFFFF" stroke="#3BA3FF" strokeWidth="2" />
      <rect x="52" y="31" width="8" height="4" rx="1" fill="#1E6FFF" />
      <path d="M19 42H61" stroke="#3BA3FF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Foam droplets & water jet */}
      <circle cx="28" cy="56" r="5" fill="#3BA3FF" fillOpacity="0.2" stroke="#3BA3FF" strokeWidth="1" />
      <circle cx="40" cy="60" r="7" fill="#3BA3FF" fillOpacity="0.15" stroke="#3BA3FF" strokeWidth="1" />
      <circle cx="52" cy="54" r="4" fill="#3BA3FF" fillOpacity="0.2" stroke="#3BA3FF" strokeWidth="1" />
      {/* Snowflake badge */}
      <circle cx="62" cy="20" r="10" fill="#1E6FFF" />
      <text x="57" y="25" fill="#FFFFFF" fontSize="11">❄️</text>
    </svg>
  );
}

/**
 * 12. Card 2: AC Repair & Diagnosis Icon
 */
export function AcRepairIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#FFFBF0" />
      {/* Wrench & screwdriver crossed */}
      <circle cx="40" cy="40" r="28" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
      <path d="M26 54L38 42M42 38L54 26" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 26C51 23 47 24 45 26L42 29L51 38L54 35C56 33 57 29 54 26Z" fill="#1E6FFF" />
      {/* Diagnostic Pulse / Gauge */}
      <circle cx="56" cy="56" r="11" fill="#FF5A3C" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="50" y="61" fill="#FFFFFF" fontSize="10">🔍</text>
    </svg>
  );
}

/**
 * 13. Card 3: Gas Top-Up / Refill Icon
 */
export function AcGasRefillIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#ECFDF5" />
      {/* Refrigerant Gas Tank */}
      <rect x="28" y="28" width="24" height="40" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
      <rect x="34" y="20" width="12" height="8" rx="2" fill="#111111" />
      <circle cx="40" cy="42" r="6" fill="#10B981" fillOpacity="0.15" />
      <text x="33" y="58" fill="#10B981" fontSize="8" fontWeight="bold">GAS</text>
      {/* Pressure Gauge */}
      <circle cx="56" cy="24" r="10" fill="#1E6FFF" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="50" y="29" fill="#FFFFFF" fontSize="10">⚡</text>
    </svg>
  );
}

/**
 * 14. Card 4: AC Installation Icon
 */
export function AcInstallationIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#F0F4FA" />
      {/* Wall Bracket Outline */}
      <rect x="18" y="26" width="44" height="24" rx="3" fill="#FFFFFF" stroke="#1E6FFF" strokeWidth="2" />
      {/* Drill bit / Tool */}
      <path d="M46 54L60 62M58 48L64 56" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      {/* Copper Pipe Coil */}
      <path d="M22 56C22 52 26 50 30 50C34 50 38 52 38 56C38 60 42 62 46 62" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Check Badge */}
      <circle cx="22" cy="24" r="9" fill="#25D366" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M19 24L21 26L25 22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 15. Dedicated Home Deep Cleaning Hero Illustration
 * Spec: Nellore home interior (living room + kitchen visible), Osmida cleaner in black uniform with white logo,
 * mop, bucket, floor scrubber, sparkles/shine lines, badges: "Safe Chemicals", "Supervised Quality".
 */
export function CleaningHeroIllustration({
  className = "w-full max-w-[450px] h-[240px] sm:h-[300px]",
  imageSrc = "/images/service-cleaning-v2.jpg",
}: {
  className?: string;
  imageSrc?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imageSrc && !imgError) {
    return (
      <div className={`relative aspect-[4/3] ${className} overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-lg`}>
        <Image
          src={imageSrc}
          alt="Home Deep Cleaning in Nellore"
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          priority
          sizes="(max-width: 1024px) 100vw, 450px"
        />
      </div>
    );
  }

  return (
    <svg className={className} viewBox="0 0 450 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="430" height="280" rx="24" fill="#F7F8FA" />
      <circle cx="360" cy="80" r="60" fill="#2FBF9B" fillOpacity="0.08" />
      <circle cx="80" cy="220" r="70" fill="#1E6FFF" fillOpacity="0.06" />

      {/* Living Room & Kitchen Corner Backdrop */}
      <rect x="40" y="60" width="200" height="150" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
      {/* Kitchen Counter & Shelves */}
      <rect x="50" y="130" width="80" height="70" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="55" y="140" width="25" height="18" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
      <rect x="90" y="140" width="32" height="18" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
      <line x1="50" y1="130" x2="130" y2="130" stroke="#0F172A" strokeWidth="2" />

      {/* Spotless Floor Reflections */}
      <path d="M40 210H240L210 270H40V210Z" fill="#E8F8F4" fillOpacity="0.6" />
      <path d="M60 230L90 230M110 230L150 230M80 250L130 250" stroke="#2FBF9B" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />

      {/* Cleaner in Osmida Uniform */}
      <path d="M260 280V205C260 185 280 170 305 170C330 170 350 185 350 205V280H260Z" fill="#0B0B0F" />
      <rect x="288" y="200" width="34" height="8" rx="2" fill="#FFFFFF" />
      <text x="290" y="206" fill="#0B0B0F" fontSize="6" fontWeight="900" letterSpacing="0.5">OSMIDA</text>

      {/* Head */}
      <rect x="296" y="152" width="18" height="20" rx="4" fill="#D99B77" />
      <circle cx="305" cy="138" r="20" fill="#D99B77" />
      <path d="M285 134C285 120 295 116 305 116C315 116 325 120 325 134C325 128 317 122 305 122C293 122 285 128 285 134Z" fill="#1A1A1A" />
      <circle cx="299" cy="135" r="2" fill="#1A1A1A" />
      <circle cx="311" cy="135" r="2" fill="#1A1A1A" />
      <path d="M300 144C302 147 308 147 310 144" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Floor Scrubber / Mop in Hand */}
      <line x1="260" y1="225" x2="200" y2="255" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="255" r="16" fill="#2FBF9B" stroke="#0B0B0F" strokeWidth="2" />
      <circle cx="200" cy="255" r="6" fill="#FFFFFF" />

      {/* Bucket on side */}
      <path d="M150 220L155 250H175L180 220H150Z" fill="#1E6FFF" stroke="#0B0B0F" strokeWidth="1.5" />
      <path d="M152 220C152 210 178 210 178 220" stroke="#0B0B0F" strokeWidth="1.5" fill="none" />

      {/* Sparkles / Shine Lines */}
      <g transform="translate(130, 95)">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="#FFB800" />
      </g>
      <g transform="translate(210, 160)">
        <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z" fill="#2FBF9B" />
      </g>
      <g transform="translate(60, 190)">
        <path d="M8 0L9 6L16 8L9 10L8 16L7 10L0 8L7 6L8 0Z" fill="#1E6FFF" />
      </g>

      {/* Floating Trust Badges */}
      {/* 1. Safe Chemicals */}
      <g transform="translate(25, 25)">
        <rect width="130" height="38" rx="19" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(47, 191, 155, 0.15))" stroke="#E5E7EB" />
        <circle cx="20" cy="19" r="13" fill="#2FBF9B" fillOpacity="0.15" />
        <text x="14" y="24" fontSize="13">✨</text>
        <text x="39" y="17" fill="#111111" fontSize="10" fontWeight="bold">Safe Chemicals</text>
        <text x="39" y="28" fill="#2FBF9B" fontSize="9" fontWeight="600">Child & Pet Friendly</text>
      </g>

      {/* 2. Supervised Quality */}
      <g transform="translate(350, 150)">
        <rect width="85" height="32" rx="16" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.08))" stroke="#E5E7EB" />
        <circle cx="16" cy="16" r="10" fill="#1E6FFF" />
        <path d="M13 16L15 18L19 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="31" y="20" fill="#111111" fontSize="9" fontWeight="bold">Supervised</text>
      </g>
    </svg>
  );
}

/**
 * 16. Card 1: 1 BHK Deep Clean Icon
 */
export function Clean1BhkIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#E8F8F4" />
      {/* 1 BHK Small House Outline */}
      <path d="M22 42L40 24L58 42V62H22V42Z" fill="#FFFFFF" stroke="#2FBF9B" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="34" y="48" width="12" height="14" rx="2" fill="#111111" />
      {/* Floor Mop */}
      <line x1="52" y1="36" x2="64" y2="54" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="58" y="52" width="12" height="5" rx="1.5" fill="#2FBF9B" />
      {/* Sparkle Badge */}
      <circle cx="22" cy="24" r="9" fill="#FFB800" />
      <path d="M22 19V29M17 24H27" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 17. Card 2: 2 BHK Deep Clean Icon
 */
export function Clean2BhkIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#E8F8F4" />
      {/* 2 BHK House Outline */}
      <path d="M16 42L36 24L56 42V62H16V42Z" fill="#FFFFFF" stroke="#2FBF9B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 30L64 16L74 26V62H56" fill="#FFFFFF" stroke="#2FBF9B" strokeWidth="2" strokeLinejoin="round" />
      <rect x="28" y="48" width="12" height="14" rx="2" fill="#111111" />
      <rect x="44" y="48" width="8" height="8" rx="1" fill="#EBF2FE" stroke="#3BA3FF" strokeWidth="1" />
      {/* Scrubber Badge */}
      <circle cx="62" cy="46" r="10" fill="#1E6FFF" />
      <text x="57" y="50" fill="#FFFFFF" fontSize="9">✨</text>
    </svg>
  );
}

/**
 * 18. Card 3: 3 BHK Deep Clean Icon
 */
export function Clean3BhkIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#E8F8F4" />
      {/* Large 3 BHK House / Villa */}
      <path d="M12 44L32 24L52 44V64H12V44Z" fill="#FFFFFF" stroke="#2FBF9B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 30L58 14L76 28V64H52" fill="#FFFFFF" stroke="#2FBF9B" strokeWidth="2" strokeLinejoin="round" />
      <rect x="24" y="50" width="10" height="14" rx="2" fill="#111111" />
      <rect x="38" y="50" width="8" height="8" rx="1" fill="#E8F8F4" stroke="#2FBF9B" strokeWidth="1" />
      <rect x="60" y="44" width="8" height="8" rx="1" fill="#E8F8F4" stroke="#2FBF9B" strokeWidth="1" />
      {/* Crown / Premium Clean Badge */}
      <circle cx="68" cy="20" r="10" fill="#FFB800" />
      <text x="63" y="24" fill="#FFFFFF" fontSize="9">👑</text>
    </svg>
  );
}

/**
 * 19. Card 4: Kitchen / Bathroom Deep Clean Icon
 */
export function CleanKitchenBathIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="#FFF9E6" />
      {/* Stove / Counter Top */}
      <rect x="18" y="32" width="44" height="32" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
      <circle cx="30" cy="46" r="6" stroke="#EF4444" strokeWidth="1.5" />
      <circle cx="50" cy="46" r="6" stroke="#EF4444" strokeWidth="1.5" />
      {/* Knobs */}
      <circle cx="30" cy="58" r="2" fill="#0F172A" />
      <circle cx="50" cy="58" r="2" fill="#0F172A" />
      {/* Soap Bubbles / Sparkle */}
      <circle cx="58" cy="22" r="11" fill="#2FBF9B" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="53" y="27" fill="#FFFFFF" fontSize="10">🧼</text>
    </svg>
  );
}
