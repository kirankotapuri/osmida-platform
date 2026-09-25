"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Check, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface AiQuickBookBarProps {
  onParsed?: (intent: any) => void;
  className?: string;
  compact?: boolean;
}

const SAMPLE_PROMPTS = [
  "Bathroom & kitchen cleaning tomorrow 10am in Haranathapuram",
  "Dishwashing and sweeping 1.5 hrs today in Magunta Layout",
  "Daily house help maid for 1 hour every morning",
  "Repu podduna bathroom cleaning kaavali 1 hour",
];

export function AiQuickBookBar({ onParsed, className = "", compact = false }: AiQuickBookBarProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleParse = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || prompt;
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setParsedResult(null);

    try {
      const res = await fetch("/api/ai/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query.trim() }),
      });
      const data = await res.json();
      if (data.success && data.intent) {
        setParsedResult(data.intent);
        if (onParsed) {
          onParsed(data.intent);
        } else {
          // Navigate to /book with query params
          const params = new URLSearchParams();
          if (data.intent.services?.length) params.set("services", data.intent.services.join(","));
          if (data.intent.duration_hours) params.set("duration", String(data.intent.duration_hours));
          if (data.intent.locality) params.set("locality", data.intent.locality);
          if (data.intent.time_slot) params.set("timeSlot", data.intent.time_slot);
          if (data.intent.booking_type) params.set("type", data.intent.booking_type);
          if (data.intent.date) params.set("date", data.intent.date);
          router.push(`/book?${params.toString()}`);
        }
      } else {
        setErrorMsg("Could not understand request. Please select manually below.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (sample: string) => {
    setPrompt(sample);
    handleParse(undefined, sample);
  };

  return (
    <div
      className={`rounded-2xl border border-primary/20 bg-linear-to-b from-primary/5 via-white to-white p-4 shadow-sm backdrop-blur-xs transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            AI Magic Booking Concierge
          </h3>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          English • Telugu • Hinglish
        </span>
      </div>

      <form onSubmit={handleParse} className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Need 2 bathrooms and kitchen cleaned tomorrow morning at 10 AM in Magunta Layout..."
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-3.5 pr-28 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-1.5 flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 text-white px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xs"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <span>Auto-Fill</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {errorMsg && (
        <p className="mt-2 text-[11px] font-semibold text-rose-600">{errorMsg}</p>
      )}

      {/* Parsed Live Badge */}
      {parsedResult && (
        <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Configured: {parsedResult.serviceNames?.join(" + ") || "Home Service"} ({parsedResult.duration_hours} hr)
              {parsedResult.locality ? ` • ${parsedResult.locality}` : ""}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">
            Ready to book
          </span>
        </div>
      )}

      {/* Suggestion Chips */}
      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Try saying:</span>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(sample)}
              className="rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary border border-slate-200 hover:border-primary/30 px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition-colors text-left"
            >
              &ldquo;{sample}&rdquo;
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
