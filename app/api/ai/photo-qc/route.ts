import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkPhotoQc } from "@/lib/ai/photoQc";
import { prontoBookingsStore } from "@/app/api/bookings/route";

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
    const { beforePhotoUrl, afterPhotoUrl, serviceType, referenceId } = body;

    if (!beforePhotoUrl || !afterPhotoUrl) {
      return NextResponse.json(
        { error: "Both beforePhotoUrl and afterPhotoUrl are required for QC verification" },
        { status: 400 }
      );
    }

    const qcResult = await checkPhotoQc({
      beforePhotoUrl,
      afterPhotoUrl,
      serviceType: serviceType || "Bathroom Cleaning",
      referenceId,
    });

    // If referenceId provided, store QC results on booking
    if (referenceId) {
      const storedBooking = prontoBookingsStore.get(referenceId);
      if (storedBooking) {
        storedBooking.qc_status = qcResult.pass ? "passed" : "flagged";
        storedBooking.qc_reason = qcResult.reason;
        prontoBookingsStore.set(referenceId, storedBooking);
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase
            .from("bookings")
            .update({
              notes: `[AI Photo QC: ${qcResult.pass ? "PASSED" : "FLAGGED"}] ${qcResult.reason}`,
              updated_at: new Date().toISOString(),
            })
            .eq("reference_id", referenceId);
        } catch (dbErr) {
          console.warn("DB QC notes update warning:", dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      pass: qcResult.pass,
      reason: qcResult.reason,
      confidence: qcResult.confidence,
      qc: qcResult,
    });
  } catch (error: any) {
    console.error("Photo QC API error:", error);
    return NextResponse.json(
      { error: "Failed to perform Photo QC check", details: error.message },
      { status: 500 }
    );
  }
}
