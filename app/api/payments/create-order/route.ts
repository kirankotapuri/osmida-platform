import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, amount, customerName, customerPhone } = body;

    if (!referenceId || !amount) {
      return NextResponse.json(
        { error: "referenceId and amount are required" },
        { status: 400 }
      );
    }

    const orderResult = await createRazorpayOrder({
      referenceId,
      amountInRupees: Number(amount),
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "9848011111",
    });

    if (!orderResult.success) {
      return NextResponse.json(
        { error: orderResult.error || "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      keyId: orderResult.keyId,
      isSimulated: orderResult.isSimulated,
    });
  } catch (err: any) {
    console.error("Order creation route error:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
