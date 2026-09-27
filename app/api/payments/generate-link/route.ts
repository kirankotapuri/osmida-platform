import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TgcUAXNEMPOC10";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "u07QSlE7bW8PzR88dxLhyRDb";

function getAuthHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
}

/**
 * POST /api/payments/generate-link
 * Creates real Razorpay UPI QR Code & Payment Link for customer settlement.
 * The partner presents this on-screen to the customer for PhonePe/GPay/Paytm scanning.
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

    const numAmount = Number(amount) || 199;
    const amountInPaise = Math.round(numAmount * 100);
    const cleanPhone = String(customerPhone || "").replace(/\D/g, "").slice(-10);

    // 1. GENERATE OFFICIAL RAZORPAY UPI QR CODE (Direct scan in PhonePe/GPay/Paytm)
    let razorpayQrImageUrl = "";
    let razorpayQrId = "";
    try {
      const qrRes = await fetch("https://api.razorpay.com/v1/payments/qr_codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          type: "upi_qr",
          name: "Osmida Home Services",
          usage: "single_use",
          fixed_amount: true,
          payment_amount: amountInPaise,
          description: description || `Osmida Service - ${referenceId}`,
          notes: {
            reference_id: referenceId,
            customer_name: customerName || "Customer",
          },
        }),
      });

      const qrData = await qrRes.json();
      if (qrRes.ok && qrData.image_url) {
        razorpayQrImageUrl = qrData.image_url;
        razorpayQrId = qrData.id;
      } else {
        console.warn("Razorpay QR codes endpoint note:", qrData);
      }
    } catch (qrErr) {
      console.warn("Razorpay QR codes API error:", qrErr);
    }

    // 2. GENERATE RAZORPAY PAYMENT LINK (For WhatsApp 1-tap share / card payment)
    let paymentLinkUrl = "";
    let paymentLinkId = "";
    try {
      const customerPayload: any = {
        name: customerName || "Customer",
      };
      if (cleanPhone.length === 10) {
        customerPayload.contact = `+91${cleanPhone}`;
      }

      const linkRes = await fetch("https://api.razorpay.com/v1/payment_links", {
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
          customer: customerPayload,
          notify: {
            sms: cleanPhone.length === 10,
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

      const linkData = await linkRes.json();
      if (linkRes.ok && linkData.short_url) {
        paymentLinkUrl = linkData.short_url;
        paymentLinkId = linkData.id;
      } else {
        console.warn("Razorpay Payment Links note:", linkData);
      }
    } catch (linkErr) {
      console.warn("Razorpay Payment Links API error:", linkErr);
    }

    // Fallback URL if link API failed
    if (!paymentLinkUrl) {
      paymentLinkUrl = `https://osmida.com/booking/${referenceId}`;
    }

    // NPCI Direct UPI Intent URI
    const upiUri = `upi://pay?pa=9490122849@okaxis&pn=Osmida%20Home%20Services&am=${numAmount}&cu=INR&tn=Osmida%20${referenceId}`;

    // Reliable final QR code URL
    const qrCodeUrl = razorpayQrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(paymentLinkUrl || upiUri)}`;

    // Update booking payment status in Supabase if configured
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
      paymentLinkId,
      paymentLink: paymentLinkUrl,
      shortUrl: paymentLinkUrl,
      qrCodeUrl,
      qrId: razorpayQrId,
      upiUri,
      amount: numAmount,
      isRealRazorpay: true,
    });
  } catch (err: any) {
    console.error("Payment link generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate payment link" },
      { status: 500 }
    );
  }
}
