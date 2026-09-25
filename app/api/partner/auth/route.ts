import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PARTNERS, ServicePartner } from "@/lib/partnerMatching";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory status store for resilience if database table migration is pending
const activeStatusCache = new Map<string, { status: "online" | "offline" }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const pin = String(body.pin || "").trim();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    if (!pin) {
      return NextResponse.json({ error: "Please enter your 4-digit PIN" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let partner: ServicePartner | null = null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("service_partners")
          .select("*")
          .eq("phone", phone)
          .maybeSingle();

        if (data && !error) {
          if (data.auth_pin && data.auth_pin !== pin) {
            return NextResponse.json({ error: "Invalid 4-digit PIN. Please try again." }, { status: 401 });
          }
          partner = data as ServicePartner;
        }
      } catch (err) {
        console.warn("DB partner lookup note:", err);
      }
    }

    // Fallback to verified local partner profiles
    if (!partner) {
      const match = DEFAULT_PARTNERS.find((p) => p.phone === phone);
      if (match) {
        if (match.auth_pin && match.auth_pin !== pin) {
          return NextResponse.json({ error: "Invalid 4-digit PIN. Please try again." }, { status: 401 });
        }
        partner = { ...match };
      } else {
        return NextResponse.json(
          { error: "Partner account not found for this phone. Please contact Osmida Operations to register." },
          { status: 404 }
        );
      }
    }

    // Apply any cached status
    if (activeStatusCache.has(partner.id)) {
      partner.status = activeStatusCache.get(partner.id)!.status;
    }

    return NextResponse.json({
      success: true,
      partner,
      message: `Welcome back, ${partner.name}!`,
    });
  } catch (error) {
    console.error("Partner auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const partnerId = String(body.partnerId || "");
    const newStatus = body.status as "online" | "offline";

    if (!partnerId || !["online", "offline"].includes(newStatus)) {
      return NextResponse.json({ error: "Invalid partnerId or status" }, { status: 400 });
    }

    // Update in-memory cache
    activeStatusCache.set(partnerId, { status: newStatus });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from("service_partners")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", partnerId);
      } catch (dbErr) {
        console.warn("DB status update note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: `Status updated to ${newStatus.toUpperCase()}`,
    });
  } catch (error) {
    console.error("Partner status toggle error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
