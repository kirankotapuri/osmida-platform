import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PARTNERS, ServicePartner } from "@/lib/partnerMatching";
import { generateAndSendOtp, verifySubmittedOtp } from "@/lib/sms/otpService";

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
    const action = body.action || "reset_pin";
    const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let partner: ServicePartner | null = null;

    // Check if partner exists in Supabase
    if (supabase) {
      try {
        const { data } = await supabase
          .from("service_partners")
          .select("*")
          .eq("phone", phone)
          .maybeSingle();
        if (data) {
          partner = data as ServicePartner;
        }
      } catch (e) {
        console.warn("DB partner lookup warning:", e);
      }
    }

    // Fallback check against default mock partners
    if (!partner) {
      const match = DEFAULT_PARTNERS.find((p) => p.phone === phone);
      if (match) {
        partner = { ...match };
      }
    }

    if (!partner) {
      return NextResponse.json(
        { error: "No partner account found with this phone number. Please register first or contact Osmida Support." },
        { status: 404 }
      );
    }

    // -------------------------------------------------------------
    // ACTION 1: SEND VERIFICATION CODE (OTP) TO PARTNER PHONE
    // -------------------------------------------------------------
    if (action === "send_otp") {
      const otpRes = await generateAndSendOtp(phone);
      if (!otpRes.success) {
        return NextResponse.json(
          { error: otpRes.message || "Failed to dispatch verification code" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: otpRes.message || `Verification code sent to +91 ${phone} via WhatsApp / SMS.`,
        channel: otpRes.channel,
        demoCode: otpRes.demoCode,
        isSimulated: otpRes.isSimulated,
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: VERIFY OTP AND RESET 4-DIGIT PIN
    // -------------------------------------------------------------
    const otp = String(body.otp || "").trim();
    const newPin = String(body.newPin || "").trim();
    const confirmPin = String(body.confirmPin || "").trim();
    const aadhaarLast4 = String(body.aadhaarLast4 || "").trim();

    if (!otp) {
      return NextResponse.json({ error: "Please enter the 4-digit verification code sent to your phone" }, { status: 400 });
    }

    // Verify OTP code
    const verification = verifySubmittedOtp(phone, otp);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Invalid verification code. Please check and retry." },
        { status: 400 }
      );
    }

    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      return NextResponse.json({ error: "New PIN must be exactly 4 digits" }, { status: 400 });
    }

    if (newPin !== confirmPin) {
      return NextResponse.json({ error: "PINs do not match. Please verify." }, { status: 400 });
    }

    let updatedInDb = false;

    if (supabase) {
      try {
        const partnerAadhaar = (partner as any).aadhaar_last4 || (partner as any).aadhaar_number?.slice(-4);
        if (partnerAadhaar && aadhaarLast4 && partnerAadhaar !== aadhaarLast4) {
          return NextResponse.json({ error: "Aadhaar digits do not match our registered records" }, { status: 400 });
        }

        const { data: updated, error: updateErr } = await supabase
          .from("service_partners")
          .update({
            auth_pin: newPin,
            updated_at: new Date().toISOString(),
          })
          .eq("phone", phone)
          .select()
          .single();

        if (!updateErr && updated) {
          partner = updated as ServicePartner;
          updatedInDb = true;
        }
      } catch (dbErr) {
        console.warn("DB reset pin error:", dbErr);
      }
    }

    if (!updatedInDb) {
      const match = DEFAULT_PARTNERS.find((p) => p.phone === phone);
      if (match) {
        match.auth_pin = newPin;
        partner = { ...match };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Security PIN has been reset successfully! You can now login with your new PIN.",
      partner,
    });
  } catch (error) {
    console.error("Reset PIN error:", error);
    return NextResponse.json({ error: "Failed to reset PIN. Please try again." }, { status: 500 });
  }
}
