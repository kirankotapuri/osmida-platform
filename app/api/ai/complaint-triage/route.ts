import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { triageComplaint } from "@/lib/ai/complaintTriage";
import { prontoBookingsStore } from "@/app/api/bookings/route";
import { prontoComplaintsStore } from "@/app/api/admin/complaints/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, complaintText, photos } = body;

    if (!complaintText) {
      return NextResponse.json(
        { error: "complaintText is required for triage" },
        { status: 400 }
      );
    }

    // Lookup booking record
    let booking = referenceId ? prontoBookingsStore.get(referenceId) : null;
    const supabase = getSupabaseClient();

    if (!booking && referenceId && supabase) {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("reference_id", referenceId)
          .maybeSingle();
        if (data) booking = data;
      } catch (err) {
        console.warn("DB lookup error:", err);
      }
    }

    const jobRecord = {
      referenceId: referenceId || "OSM-PRN-0000",
      serviceName: booking?.selected_service || "Bathroom Cleaning + Kitchen Cleaning",
      totalAmount: booking?.total_amount || 299,
      durationHours: booking?.duration_hours || 1.5,
      customerName: booking?.customer_name || "Resident",
      locality: booking?.locality || "Nellore",
      beforePhotoUrl: booking?.before_photo_url || null,
      afterPhotoUrl: booking?.after_photo_url || null,
    };

    const triageResult = await triageComplaint({
      complaintText,
      photos: photos || (booking?.after_photo_url ? [booking.after_photo_url] : []),
      jobRecord,
    });

    // Attach AI triage recommendation to complaint in-memory store
    for (const [id, c] of prontoComplaintsStore.entries()) {
      if (c.reference_id === referenceId) {
        c.ai_recommendation = triageResult;
        prontoComplaintsStore.set(id, c);
      }
    }

    return NextResponse.json({
      success: true,
      triage: triageResult,
    });
  } catch (error: any) {
    console.error("Complaint Triage API error:", error);
    return NextResponse.json(
      { error: "Failed to triage complaint", details: error.message },
      { status: 500 }
    );
  }
}
