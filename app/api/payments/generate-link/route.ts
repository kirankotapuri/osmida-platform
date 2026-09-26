import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

function getAuthHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
}

/**
 * POST /api/payments/generate-link
 * Creates a Razorpay Payment Link for a completed job.
 * The partner presents this QR / link to the customer for payment.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, amount, customerName, customerPhone, description } = body;

    if (!referenceId || !amount) {
      return NextResponse.json(
        { error: "referenceId and amount are required" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    // If no real keys, return a simulated link for dev
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        success: true,
        paymentLink: `https://rzp.io/l/sim_${referenceId}`,
        shortUrl: `https://rzp.io/l/sim_${referenceId}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://rzp.io/l/sim_${referenceId}`,
        amount: amountInPaise,
        isSimulated: true,
      });
    }

    // Create Razorpay Payment Link
    const res = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        accept_partial: false,
        description: description || `Osmida Service Payment - ${referenceId}`,
        customer: {
          name: customerName || "Customer",
          contact: customerPhone ? `+91${customerPhone}` : undefined,
        },
        notify: {
          sms: !!customerPhone,
          email: false,
        },
        reminder_enable: false,
        notes: {
          reference_id: referenceId,
          platform: "Osmida Nellore",
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://osmida.com"}/booking/${referenceId}`,
        callback_method: "get",
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.id) {
      console.error("Razorpay Payment Link error:", data);
      return NextResponse.json(
        { error: data.error?.description || "Failed to create payment link" },
        { status: 500 }
      );
    }

    // Generate QR code URL from the payment link (using open QR service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.short_url)}`;

    // Update booking payment status in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("bookings")
          .update({
            payment_method: "online",
            payment_status: "link_generated",
            updated_at: new Date().toISOString(),
          })
          .eq("reference_id", referenceId);
      } catch (dbErr) {
        console.warn("DB payment link update note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      paymentLinkId: data.id,
      paymentLink: data.short_url,
      shortUrl: data.short_url,
      qrCodeUrl,
      amount: data.amount,
      status: data.status,
    });
  } catch (err: any) {
    console.error("Payment link generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate payment link" },
      { status: 500 }
    );
  }
}
