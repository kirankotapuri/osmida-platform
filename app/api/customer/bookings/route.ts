import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
    const { phone, otp, action } = body;

    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // 1. Send OTP action
    if (action === "send_otp") {
      const { generateAndSendOtp } = await import("@/lib/sms/otpService");
      const sendResult = await generateAndSendOtp(cleanPhone);
      if (!sendResult.success) {
        return NextResponse.json(
          { error: sendResult.message },
          { status: sendResult.error === "RATE_LIMITED" ? 429 : 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: sendResult.message,
        channel: sendResult.channel,
      });
    }

    // 2. Verify OTP & Fetch Customer Bookings
    const cleanOtp = String(otp || "").trim();
    const { verifySubmittedOtp } = await import("@/lib/sms/otpService");
    const verifyResult = verifySubmittedOtp(cleanPhone, cleanOtp);

    if (!verifyResult.valid) {
      return NextResponse.json(
        {
          error: verifyResult.error || "Invalid verification code",
          remainingAttempts: verifyResult.remainingAttempts,
        },
        { status: verifyResult.remainingAttempts === 0 ? 429 : 400 }
      );
    }

    const supabase = getSupabaseClient();
    const customerBookings: any[] = [];

    // Query Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .ilike("phone", `%${cleanPhone}%`)
          .order("created_at", { ascending: false });

        if (data && !error) {
          const parsed = data.map((b) => {
            const cart = b.cart_items && typeof b.cart_items === "object" ? b.cart_items : {};
            return {
              ...b,
              total_amount: b.total_amount || b.service_price || cart.total_amount || Math.round((b.duration_hours || cart.duration_hours || 1.0) * (b.hourly_rate || cart.hourly_rate || 199)),
              duration_hours: b.duration_hours || cart.duration_hours || 1.0,
              hourly_rate: b.hourly_rate || cart.hourly_rate || 199,
              payment_method: b.payment_method || cart.payment_method || "cash",
              otp_start: b.otp_start || cart.otp_start || b.start_otp,
              otp_end: b.otp_end || cart.otp_end || b.end_otp,
            };
          });
          customerBookings.push(...parsed);
        }
      } catch (err) {
        console.warn("DB customer bookings query note:", err);
      }
    }

    // Merge in-memory store
    for (const [_, b] of prontoBookingsStore.entries()) {
      const bPhone = String(b.phone || b.customer_phone || "").replace(/\D/g, "").slice(-10);
      if (bPhone === cleanPhone) {
        if (!customerBookings.some((existing) => existing.reference_id === b.reference_id)) {
          customerBookings.unshift(b);
        }
      }
    }

    const latest = customerBookings[0] || null;
    const profile = latest ? {
      name: latest.customer_name || latest.contact_person || "",
      phone: cleanPhone,
      locality: latest.locality || "Pogathota",
      apartmentName: latest.apartment_name || (latest.cart_items && latest.cart_items.apartment_name) || "",
      flatNumber: latest.flat_number || (latest.cart_items && latest.cart_items.flat_number) || "",
      towerBlock: latest.tower_block || (latest.cart_items && latest.cart_items.tower_block) || "",
      address: latest.address || latest.site_address || "",
    } : null;

    return NextResponse.json({
      success: true,
      phone: cleanPhone,
      bookings: customerBookings,
      profile,
    });
  } catch (error: any) {
    console.error("Customer bookings error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve bookings", details: error.message },
      { status: 500 }
    );
  }
}
