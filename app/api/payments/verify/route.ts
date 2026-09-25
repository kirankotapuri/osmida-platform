import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { prontoBookingsStore } from "@/app/api/bookings/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, orderId, paymentId, signature } = body;

    if (!referenceId || !orderId || !paymentId) {
      return NextResponse.json(
        { error: "referenceId, orderId, and paymentId are required" },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: signature || "simulated_valid_signature",
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed" },
        { status: 400 }
      );
    }

    // Update in-memory booking
    const booking = prontoBookingsStore.get(referenceId);
    if (booking) {
      booking.payment_method = "online";
      booking.payment_status = "escrow_held";
      booking.escrow_status = "held";
      (booking as any).razorpay_payment_id = paymentId;
      (booking as any).razorpay_order_id = orderId;
      (booking as any).paid_at = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and held securely in escrow.",
      paymentStatus: "escrow_held",
      escrowStatus: "held",
    });
  } catch (err: any) {
    console.error("Payment verification route error:", err);
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
