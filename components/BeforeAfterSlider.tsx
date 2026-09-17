"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title: string;
  description: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before Service",
  afterLabel = "Osmida Cleaned",
  title,
  description,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-7 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-[#555555] mt-1">{description}</p>
      </div>

      <div
        ref={containerRef}
        className="relative h-64 sm:h-80 w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-[#E5E7EB]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Base Layer: AFTER Image */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-bold text-white shadow-md">
            ✓ {afterLabel}
          </span>
        </div>

        {/* Clipped Layer: BEFORE Image */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            {beforeLabel}
          </span>
        </div>

        {/* Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#1E6FFF] shadow-lg text-white text-xs font-black">
            ⇄
          </div>
        </div>
      </div>
    </div>
  );
}