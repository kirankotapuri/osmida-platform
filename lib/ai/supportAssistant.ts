// ==============================================================================
// OSMIDA AI: CUSTOMER SUPPORT & CONCIERGE ASSISTANT (PHASE C)
// Answers queries about Pronto services, scope inclusions/exclusions, live booking status,
// Start/End OTPs, worker arrival, and complaint policies in Nellore.
// ==============================================================================

import { PRONTO_SERVICES } from "../prontoServices";
import { prontoBookingsStore } from "@/app/api/bookings/route";
import { createClient } from "@supabase/supabase-js";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SupportChatInput {
  message: string;
  history?: ChatMessage[];
  referenceId?: string;
  customerPhone?: string;
}

export interface SupportChatOutput {
  reply: string;
  suggestedQuickReplies?: string[];
  bookingContext?: any;
  actionPayload?: {
    type: "navigate_booking" | "navigate_book_form" | "call_support";
    url?: string;
    phone?: string;
  };
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Searches for active booking by referenceId or phone number
 */
async function lookupBooking(referenceId?: string, customerPhone?: string): Promise<any | null> {
  if (referenceId) {
    const mem = prontoBookingsStore.get(referenceId);
    if (mem) return mem;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from("bookings").select("*");
      if (referenceId) {
        query = query.eq("reference_id", referenceId);
      } else if (customerPhone) {
        const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
        query = query.eq("phone", cleanPhone);
      } else {
        return null;
      }
      const { data } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (data) return data;
    } catch (err) {
      console.warn("DB lookup error in support chat:", err);
    }
  }

  // Scan memory store for phone if referenceId wasn't given
  if (customerPhone) {
    const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
    for (const [_, b] of prontoBookingsStore.entries()) {
      if (String(b.phone || b.customer_phone).includes(cleanPhone)) {
        return b;
      }
    }
  }

  return null;
}

/**
 * Processes a customer support chat turn.
 */
export async function handleSupportChat(
  input: SupportChatInput
): Promise<SupportChatOutput> {
  const { message, history = [], referenceId, customerPhone } = input;
  const userText = (message || "").trim();

  // Try extracting reference ID from text if not explicitly passed
  const refMatch = userText.match(/OSM-[A-Z0-9-]+/i);
  const activeRef = referenceId || (refMatch ? refMatch[0].toUpperCase() : undefined);

  // Look up booking if ref or phone is present
  const booking = await lookupBooking(activeRef, customerPhone);

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (apiKey) {
    try {
      const servicesContext = PRONTO_SERVICES.map(
        (s) => `### ${s.name} (ID: ${s.id})
- Included: ${s.included.join(", ")}
- NOT Included: ${s.notIncluded.join(", ")}`
      ).join("\n\n");

      let bookingContextText = "No active booking record attached.";
      if (booking) {
        bookingContextText = `Current Booking Record:
- Reference ID: ${booking.reference_id}
- Customer: ${booking.customer_name} (${booking.phone || ""})
- Service: ${booking.selected_service}
- Status: ${booking.status}
- Worker Assigned: ${booking.worker_name || "Assigning nearby pro in Nellore"}
- Start OTP: ${booking.start_otp || booking.otp_start || "Pending"} (Give to worker on arrival)
- End OTP: ${booking.end_otp || booking.otp_end || "Pending"} (Give only when job finishes and photos verified)
- Escrow Status: ${booking.escrow_status || "held"}
- Total Amount: ₹${booking.total_amount}`;
      }

      const systemPrompt = `You are "Sita", Osmida's friendly, highly knowledgeable AI Concierge for apartment residential services in Nellore, Andhra Pradesh.
You speak warm, professional English, and you understand Telugu and Hinglish perfectly.

KEY POLICIES:
1. ONLY 4 SERVICES OFFERED (Standardized residential model):
${servicesContext}
2. FLAT PRICING: ₹199 per hour across all 4 services. No surge pricing, no hidden fees.
3. DUAL OTP SECURITY:
   - Start OTP: Shown on customer's tracking screen. Worker must enter it on arrival to start the job timer.
   - End OTP: Released ONLY after the worker finishes and uploads Before + After photos.
4. QUALITY & ESCROW GUARANTEE:
   - Payment is held in secure escrow. Released to worker only after Before/After photos are verified.
   - If work is missed within standard checklist: Osmida sends a free 30-minute touchup or issues a refund.
   - If customer asks for excluded work (e.g. chemical acid grout restoration, interior wall painting, deep chimney overhaul), politely explain it is not included to keep prices at ₹199/hr.
5. NELLORE LOCALITY COVERAGE: Haranathapuram, Magunta Layout, Vedayapalem, Pogathota, Dargamitta, Balaji Nagar, Nawabpet, VRC, and surrounding apartments.

${bookingContextText}

Instructions:
- If customer asks about an active booking, refer directly to the booking details above.
- If customer asks for their OTP, tell them their Start OTP or End OTP clearly.
- If customer asks what is included/excluded in a service, give a crisp bulleted summary.
- Keep replies conversational, helpful, and concise (under 3-4 sentences unless explaining service checklist).
- Suggest 2-3 helpful quick-reply follow-ups.`;

      const messages: { role: "user" | "assistant"; content: string }[] = [];
      for (const h of history.slice(-6)) {
        if (h.role === "user" || h.role === "assistant") {
          messages.push({ role: h.role, content: h.content });
        }
      }
      messages.push({ role: "user", content: userText });

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 450,
          temperature: 0.3,
          system: systemPrompt,
          messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.content?.[0]?.text || "";
        return {
          reply,
          suggestedQuickReplies: generateQuickReplies(userText, booking),
          bookingContext: booking
            ? {
                referenceId: booking.reference_id,
                status: booking.status,
                startOtp: booking.start_otp || booking.otp_start,
                workerName: booking.worker_name,
              }
            : undefined,
        };
      }
    } catch (apiErr) {
      console.warn("Claude support chat API warning, falling back to rule engine:", apiErr);
    }
  }

  // Deterministic Grounded Fallback Response Engine
  return generateRuleBasedSupportReply(userText, booking);
}

function generateRuleBasedSupportReply(text: string, booking: any | null): SupportChatOutput {
  const lower = text.toLowerCase();

  // 1. Status / Worker / OTP inquiry with active booking
  if (booking) {
    if (
      lower.includes("otp") ||
      lower.includes("pin") ||
      lower.includes("code") ||
      lower.includes("start") ||
      lower.includes("end")
    ) {
      const startOtp = booking.start_otp || booking.otp_start || "1234";
      const endOtp = booking.end_otp || booking.otp_end || "5678";
      return {
        reply: `Here are your secure OTPs for Booking ${booking.reference_id}:
• Start OTP (Arrival): ${startOtp} — Give this to ${booking.worker_name || "your pro"} when they arrive at your door.
• End OTP (Completion): ${endOtp} — Give this only when work is completed and you're satisfied with the cleanup!`,
        suggestedQuickReplies: ["View Live Photos", "Call My Pro", "Rate Service"],
        bookingContext: { referenceId: booking.reference_id, status: booking.status, startOtp, endOtp },
      };
    }

    if (
      lower.includes("where") ||
      lower.includes("status") ||
      lower.includes("worker") ||
      lower.includes("pro") ||
      lower.includes("maid") ||
      lower.includes("track")
    ) {
      const statusText =
        booking.status === "in_progress"
          ? "in progress right now"
          : booking.status === "confirmed"
          ? "confirmed and your pro is en route"
          : booking.status === "completed"
          ? "completed successfully"
          : "being assigned to a nearby pro";

      return {
        reply: `Booking ${booking.reference_id} is currently ${statusText}.
• Worker: ${booking.worker_name || "Assigning nearby verified partner"}
• Service: ${booking.selected_service} (${booking.duration_hours || 1} hr)
• Escrow: Payment is held safely until you give the completion OTP.`,
        suggestedQuickReplies: ["Show my OTPs", "Track Live Booking", "How do I complain?"],
        bookingContext: { referenceId: booking.reference_id, status: booking.status },
        actionPayload: {
          type: "navigate_booking",
          url: `/booking/${booking.reference_id}`,
        },
      };
    }
  }

  // 2. Bathroom Cleaning Scope
  if (lower.includes("bath") || lower.includes("toilet") || lower.includes("washroom")) {
    return {
      reply: `Bathroom Cleaning (₹199/hr) includes:
✓ Deep scrubbing of floor tiles, sink, & toilet bowl
✓ Mirror & fixture wiping
✓ Cleaning of reachable wall tiles

Note: Hard water stain chemical acid restoration and old grout regrouting are NOT included to maintain speed and partner safety.`,
      suggestedQuickReplies: ["Book Bathroom Cleaning", "Kitchen Cleaning scope", "Book Now"],
    };
  }

  // 3. Kitchen Cleaning Scope
  if (lower.includes("kitchen") || lower.includes("stove") || lower.includes("counter")) {
    return {
      reply: `Kitchen Cleaning (₹199/hr) includes:
✓ Countertop & sink scrub
✓ Gas stove surface wipe
✓ Outer cabinet & fridge door wiping
✓ Kitchen floor sweeping & mopping

Note: Deep chimney motor degreasing and cleaning inside loaded cabinets are NOT included.`,
      suggestedQuickReplies: ["Book Kitchen Cleaning", "Dishwashing scope", "Book Now"],
    };
  }

  // 4. Dishwashing Scope
  if (lower.includes("dish") || lower.includes("utensil") || lower.includes("bartan") || lower.includes("plates")) {
    return {
      reply: `Dishwashing (₹199/hr) includes:
✓ Washing regular utensils, cookware, plates, and glasses
✓ Sink rinse and wiping down the drying area

Note: Burnt carbon deposit restoration or broken glass handling is NOT included.`,
      suggestedQuickReplies: ["Book Dishwashing", "General House Help scope", "Book Now"],
    };
  }

  // 5. General House Help Scope
  if (lower.includes("house help") || lower.includes("maid") || lower.includes("sweep") || lower.includes("mop") || lower.includes("dust")) {
    return {
      reply: `General House Help (₹199/hr) includes:
✓ Thorough broom sweeping & floor wet mopping
✓ Dusting reachable tabletops, shelves & ceiling fans
✓ Trash bag clearing & bin replacement

Note: Exterior balcony ledge hanging, ladder heights, and heavy furniture shifting are NOT included.`,
      suggestedQuickReplies: ["Book General House Help", "Check Pricing", "Book 2 Hours"],
    };
  }

  // 6. Generic Pricing Query
  if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("charge") || lower.includes("how much")) {
    return {
      reply: `Osmida charges a single, transparent flat rate: ₹199 per hour across all 4 services!
There are no surge fees, no travel charges for covered Nellore apartments, and payment is kept in escrow until the job passes inspection.`,
      suggestedQuickReplies: ["Book 1 Hour (₹199)", "What services are included?", "Which apartments are covered?"],
      actionPayload: { type: "navigate_book_form", url: "/book" },
    };
  }

  // 7. Nellore Localities / Apartments
  if (lower.includes("nellore") || lower.includes("area") || lower.includes("apartment") || lower.includes("where")) {
    return {
      reply: `Osmida is live in major apartment communities across Nellore, including Haranathapuram, Magunta Layout, Vedayapalem, Pogathota, Dargamitta, Balaji Nagar, Nawabpet, and Children's Park Road. Our pros typically reach your apartment within 15–30 minutes for instant requests!`,
      suggestedQuickReplies: ["Book in Haranathapuram", "Book in Magunta Layout", "Check Rates"],
    };
  }

  // 8. General Greeting / Fallback
  return {
    reply: `Hello! I'm Sita, your Osmida Nellore concierge. We provide reliable residential support for apartments at just ₹199/hr:
1. Bathroom Cleaning
2. Kitchen Cleaning
3. Dishwashing
4. General House Help

How can I assist your home today?`,
    suggestedQuickReplies: [
      "Book a Service (₹199/hr)",
      "What is included in Kitchen Cleaning?",
      "How do Start/End OTPs work?",
    ],
  };
}

function generateQuickReplies(text: string, booking: any | null): string[] {
  if (booking) {
    return ["What is my Start OTP?", "Where is my worker?", "How do I release payment?"];
  }
  return [
    "What is included in Bathroom Cleaning?",
    "Book 1.5 hrs for Kitchen + Dishes",
    "Which Nellore apartments are covered?",
  ];
}
