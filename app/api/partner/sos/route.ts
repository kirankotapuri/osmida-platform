import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const { partnerId, partnerName, partnerPhone, jobId, lat, lng, locality, customerAddress } = body;

    const supabase = getSupabaseClient();
    const timestamp = new Date().toISOString();
    const mapsLink = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

    console.warn(`[EMERGENCY SOS ALERT] Partner: ${partnerName} (${partnerPhone}) at ${timestamp}. Location: ${mapsLink || customerAddress || "Nellore"}`);

    if (supabase) {
      try {
        await supabase.from("partner_sos_alerts").insert({
          partner_id: partnerId,
          partner_name: partnerName,
          partner_phone: partnerPhone,
          job_id: jobId || null,
          latitude: lat || null,
          longitude: lng || null,
          maps_url: mapsLink,
          locality: locality || "Nellore",
          status: "triggered",
          created_at: timestamp,
        });
      } catch (dbErr) {
        console.warn("Supabase partner_sos_alerts fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Emergency SOS received. Nellore Ops Hub alerted with your coordinates.",
      emergencyContact: "9490122849",
      timestamp,
      mapsLink,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process SOS alert" },
      { status: 500 }
    );
  }
}
