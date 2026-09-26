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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const newPin = String(body.newPin || "").trim();
    const confirmPin = String(body.confirmPin || "").trim();
    const aadhaarLast4 = String(body.aadhaarLast4 || "").trim();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return NextResponse.json({ error: "New PIN must be exactly 4 digits" }, { status: 400 });
    }

    if (newPin !== confirmPin) {
      return NextResponse.json({ error: "PINs do not match. Please verify." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let partner: ServicePartner | null = null;
    let updatedInDb = false;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("service_partners")
          .select("*")
          .eq("phone", phone)
          .maybeSingle();

        if (data && !error) {
          // If partner has aadhaar_last4 stored, verify it if entered
          if (data.aadhaar_last4 && aadhaarLast4 && data.aadhaar_last4 !== aadhaarLast4) {
            return NextResponse.json({ error: "Aadhaar digits do not match our registered records" }, { status: 400 });
          }

          const { data: updated, error: updateErr } = await supabase
            .from("service_partners")
            .update({
              auth_pin: newPin,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.id)
            .select()
            .single();

          if (!updateErr && updated) {
            partner = updated as ServicePartner;
            updatedInDb = true;
          }
        }
      } catch (dbErr) {
        console.warn("DB reset pin error:", dbErr);
      }
    }

    // Fallback if testing with mock partners
    if (!updatedInDb) {
      const match = DEFAULT_PARTNERS.find((p) => p.phone === phone);
      if (match) {
        match.auth_pin = newPin;
        partner = { ...match };
      }
    }

    if (!partner) {
      return NextResponse.json(
        { error: "No partner account found with this phone number. Please register or contact Osmida Support." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Security PIN has been reset successfully! You can now login.",
      partner,
    });
  } catch (error) {
    console.error("Reset PIN error:", error);
    return NextResponse.json({ error: "Failed to reset PIN. Please try again." }, { status: 500 });
  }
}
