// ==============================================================================
// OSMIDA AI: BOOKING INTENT PARSER (PHASE C)
// Converts free-text customer requests (e.g. "need bathroom & dishes cleaned tomorrow 10am in Haranathapuram")
// into structured Pronto booking payloads. Supports English, Hinglish & Telugu keywords.
// ==============================================================================

import { PRONTO_SERVICES } from "../prontoServices";

export interface ParsedBookingIntent {
  services: string[]; // ['bathroom_cleaning', 'kitchen_cleaning', 'dishwashing', 'general_house_help']
  serviceNames: string[];
  duration_hours: number;
  date?: string; // YYYY-MM-DD
  time_slot?: "morning_09_12" | "afternoon_13_16" | "evening_16_19";
  time_slot_label?: string;
  locality?: string;
  apartment_hint?: string;
  booking_type: "instant" | "scheduled" | "recurring";
  summary: string;
  confidence: number;
  clarifications_needed?: string[];
}

export interface ParseIntentInput {
  text: string;
  referenceDate?: string;
}

const NELLORE_LOCALITIES = [
  "Haranathapuram",
  "Magunta Layout",
  "Vedayapalem",
  "Pogathota",
  "Dargamitta",
  "Balaji Nagar",
  "Nawabpet",
  "VRC Centre",
  "Ramamurthy Nagar",
  "Children's Park Road",
  "Stonehousepet",
  "BV Nagar",
  "Fathekhanpet",
  "Kisan Nagar",
  "Mini Bypass Road",
  "Current Office Centre",
];

/**
 * Parses freeform user text into a structured Osmida Pronto booking configuration.
 */
export async function parseBookingIntent(
  input: ParseIntentInput
): Promise<ParsedBookingIntent> {
  const text = (input.text || "").trim();
  if (!text) {
    return {
      services: ["general_house_help"],
      serviceNames: ["General House Help"],
      duration_hours: 1,
      booking_type: "instant",
      summary: "Default 1-hour General House Help",
      confidence: 0.5,
      clarifications_needed: ["Please specify which services you need."],
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (apiKey) {
    try {
      const todayIso = new Date().toISOString().split("T")[0];
      const prompt = `You are Osmida's AI Booking Concierge in Nellore, Andhra Pradesh, India.
Osmida provides 4 residential home services strictly:
1. 'bathroom_cleaning' (Bathroom Cleaning)
2. 'kitchen_cleaning' (Kitchen Cleaning)
3. 'dishwashing' (Dishwashing)
4. 'general_house_help' (General House Help / Sweeping / Mopping)

Recognized Nellore Localities: ${NELLORE_LOCALITIES.join(", ")}
Today's Date: ${todayIso}

Parse the following customer request into a structured JSON booking specification:
"${text}"

Rules:
- Identify one or more matching service IDs from the 4 allowed. If unspecified or vague maid/cleaning, default to ['general_house_help'].
- Duration: Must be one of 1, 1.5, 2, 2.5, 3 hours. If not specified, calculate based on service count: 1 service = 1 hr, 2 services = 1.5 or 2 hrs, 3+ services = 2.5 hrs.
- Date: YYYY-MM-DD. Handle relative terms like "today", "tomorrow" (repu), day names.
- Time Slot: "morning_09_12" | "afternoon_13_16" | "evening_16_19".
- Locality: Best match among Nellore areas, or null if unknown.
- Booking Type: "instant" (for now/today immediate), "scheduled" (for future date/time), or "recurring" (daily, weekly, repu nunchi daily).

Respond ONLY with valid JSON strictly matching:
{
  "services": string[],
  "duration_hours": number,
  "date": string or null,
  "time_slot": "morning_09_12" | "afternoon_13_16" | "evening_16_19" or null,
  "locality": string or null,
  "apartment_hint": string or null,
  "booking_type": "instant" | "scheduled" | "recurring",
  "summary": string,
  "confidence": number,
  "clarifications_needed": string[]
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          temperature: 0.1,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.content?.[0]?.text || "{}";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const serviceNames = (parsed.services || []).map(
            (id: string) =>
              PRONTO_SERVICES.find((s) => s.id === id)?.name || id
          );
          return {
            services: parsed.services?.length ? parsed.services : ["general_house_help"],
            serviceNames,
            duration_hours: Number(parsed.duration_hours) || 1,
            date: parsed.date || undefined,
            time_slot: parsed.time_slot || undefined,
            time_slot_label: getTimeSlotLabel(parsed.time_slot),
            locality: parsed.locality || undefined,
            apartment_hint: parsed.apartment_hint || undefined,
            booking_type: parsed.booking_type || "instant",
            summary: parsed.summary || "Custom Osmida Pronto Booking",
            confidence: parsed.confidence || 0.9,
            clarifications_needed: parsed.clarifications_needed || [],
          };
        }
      }
    } catch (apiErr) {
      console.warn("Claude Intent Parser error, using heuristic fallback:", apiErr);
    }
  }

  // Deterministic Fallback Heuristic Parser (Supports English, Telugu & Hinglish)
  return parseIntentHeuristic(text);
}

function parseIntentHeuristic(text: string): ParsedBookingIntent {
  const lower = text.toLowerCase();
  const detectedServices: string[] = [];

  // Service 1: Bathroom Cleaning
  if (
    lower.includes("bath") ||
    lower.includes("toilet") ||
    lower.includes("washroom") ||
    lower.includes("latrine") ||
    lower.includes("snanam") ||
    lower.includes("restroom")
  ) {
    detectedServices.push("bathroom_cleaning");
  }

  // Service 2: Kitchen Cleaning
  if (
    lower.includes("kitchen") ||
    lower.includes("vanta") ||
    lower.includes("stove") ||
    lower.includes("gas table") ||
    lower.includes("countertop")
  ) {
    detectedServices.push("kitchen_cleaning");
  }

  // Service 3: Dishwashing
  if (
    lower.includes("dish") ||
    lower.includes("utensil") ||
    lower.includes("bartan") ||
    lower.includes("ginnalu") ||
    lower.includes("patralu") ||
    lower.includes("thomal") ||
    lower.includes("plates")
  ) {
    detectedServices.push("dishwashing");
  }

  // Service 4: General House Help
  if (
    lower.includes("maid") ||
    lower.includes("sweep") ||
    lower.includes("mop") ||
    lower.includes("dust") ||
    lower.includes("house help") ||
    lower.includes("pocha") ||
    lower.includes("jharu") ||
    lower.includes("oomp") ||
    lower.includes("chimm") ||
    lower.includes("clean") ||
    detectedServices.length === 0
  ) {
    // If explicit general or nothing else matched, include general house help
    if (
      lower.includes("sweep") ||
      lower.includes("mop") ||
      lower.includes("dust") ||
      lower.includes("house help") ||
      lower.includes("maid") ||
      detectedServices.length === 0
    ) {
      if (!detectedServices.includes("general_house_help")) {
        detectedServices.push("general_house_help");
      }
    }
  }

  const finalServices = detectedServices.length > 0 ? detectedServices : ["general_house_help"];
  const serviceNames = finalServices.map(
    (id) => PRONTO_SERVICES.find((s) => s.id === id)?.name || id
  );

  // Duration Detection
  let durationHours = 1;
  const hourMatch = lower.match(/(\d+(\.\d+)?)\s*(hr|hour|ganta|hrs|hours)/);
  if (hourMatch) {
    const parsedH = parseFloat(hourMatch[1]);
    if ([1, 1.5, 2, 2.5, 3].includes(parsedH)) {
      durationHours = parsedH;
    } else if (parsedH <= 1.25) {
      durationHours = 1;
    } else if (parsedH <= 1.75) {
      durationHours = 1.5;
    } else if (parsedH <= 2.25) {
      durationHours = 2;
    } else {
      durationHours = 2.5;
    }
  } else {
    // Estimate based on service count
    if (finalServices.length === 1) durationHours = 1;
    else if (finalServices.length === 2) durationHours = 1.5;
    else if (finalServices.length >= 3) durationHours = 2;
  }

  // Booking Type & Date Detection
  let bookingType: "instant" | "scheduled" | "recurring" = "instant";
  let targetDate: string | undefined = undefined;
  const now = new Date();

  if (
    lower.includes("daily") ||
    lower.includes("every day") ||
    lower.includes("prathi roju") ||
    lower.includes("recurring") ||
    lower.includes("monthly")
  ) {
    bookingType = "recurring";
  } else if (
    lower.includes("tomorrow") ||
    lower.includes("repu") ||
    lower.includes("next day")
  ) {
    bookingType = "scheduled";
    const tmrw = new Date(now.getTime() + 86400000);
    targetDate = tmrw.toISOString().split("T")[0];
  } else if (lower.includes("today") || lower.includes("eeroju") || lower.includes("now") || lower.includes("urgent")) {
    bookingType = "instant";
    targetDate = now.toISOString().split("T")[0];
  }

  // Time Slot Detection
  let timeSlot: "morning_09_12" | "afternoon_13_16" | "evening_16_19" | undefined = undefined;
  if (
    lower.includes("morning") ||
    lower.includes("podduna") ||
    lower.includes("9am") ||
    lower.includes("10am") ||
    lower.includes("11am") ||
    lower.includes("9 am") ||
    lower.includes("10 am")
  ) {
    timeSlot = "morning_09_12";
  } else if (
    lower.includes("afternoon") ||
    lower.includes("lunch") ||
    lower.includes("madhyahnam") ||
    lower.includes("1pm") ||
    lower.includes("2pm") ||
    lower.includes("3pm")
  ) {
    timeSlot = "afternoon_13_16";
  } else if (
    lower.includes("evening") ||
    lower.includes("sayantram") ||
    lower.includes("night") ||
    lower.includes("5pm") ||
    lower.includes("6pm") ||
    lower.includes("7pm")
  ) {
    timeSlot = "evening_16_19";
  }

  // Locality Detection
  let matchedLocality: string | undefined = undefined;
  for (const loc of NELLORE_LOCALITIES) {
    if (lower.includes(loc.toLowerCase())) {
      matchedLocality = loc;
      break;
    }
  }

  // Apartment Hint Detection
  let apartmentHint: string | undefined = undefined;
  const aptKeywords = ["towers", "residency", "enclave", "apartments", "heights", "villas", "complex", "meadows"];
  for (const kw of aptKeywords) {
    if (lower.includes(kw)) {
      const words = text.split(/\s+/);
      const kwIdx = words.findIndex((w) => w.toLowerCase().includes(kw));
      if (kwIdx !== -1) {
        const start = Math.max(0, kwIdx - 1);
        const end = Math.min(words.length, kwIdx + 2);
        apartmentHint = words.slice(start, end).join(" ");
        break;
      }
    }
  }

  const summary = `${serviceNames.join(" + ")} for ${durationHours} hr (${bookingType}${
    matchedLocality ? ` in ${matchedLocality}` : ""
  })`;

  return {
    services: finalServices,
    serviceNames,
    duration_hours: durationHours,
    date: targetDate,
    time_slot: timeSlot,
    time_slot_label: getTimeSlotLabel(timeSlot),
    locality: matchedLocality,
    apartment_hint: apartmentHint,
    booking_type: bookingType,
    summary,
    confidence: 0.88,
    clarifications_needed: !matchedLocality ? ["Please select your Nellore apartment or locality."] : [],
  };
}

function getTimeSlotLabel(slot?: string): string {
  if (slot === "morning_09_12") return "Morning (9 AM - 12 PM)";
  if (slot === "afternoon_13_16") return "Afternoon (1 PM - 4 PM)";
  if (slot === "evening_16_19") return "Evening (4 PM - 7 PM)";
  return "Flexible / Immediate";
}
