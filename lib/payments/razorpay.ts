import crypto from "crypto";

/**
 * Razorpay & Razorpay Route (Split Payments / Marketplace Escrow) Integration
 * 
 * Complies with RBI Payment Aggregator regulations:
 * Funds are split between Osmida platform fee and the service worker via Razorpay Route,
 * avoiding direct custom escrow fund holding.
 */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

function getAuthHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
}

export interface RazorpayOrderResult {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId: string;
  isSimulated?: boolean;
  error?: string;
}

/**
 * Creates a Razorpay Order for customer booking
 */
export async function createRazorpayOrder({
  referenceId,
  amountInRupees,
  customerName,
  customerPhone,
}: {
  referenceId: string;
  amountInRupees: number;
  customerName: string;
  customerPhone: string;
}): Promise<RazorpayOrderResult> {
  const amountInPaise = Math.round(amountInRupees * 100);

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log(
      `[Razorpay Route Simulated] Created simulated order for #${referenceId} (₹${amountInRupees})`
    );
    return {
      success: true,
      orderId: `order_sim_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID || "rzp_test_simulated_key",
      isSimulated: true,
    };
  }

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: referenceId.slice(0, 40),
        notes: {
          platform: "Osmida Nellore",
          reference_id: referenceId,
          customer_name: customerName,
          customer_phone: customerPhone,
        },
      }),
    });

    const data = await res.json();
    if (res.ok && data.id) {
      return {
        success: true,
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId: RAZORPAY_KEY_ID,
      };
    }

    return {
      success: false,
      keyId: RAZORPAY_KEY_ID,
      error: data.error?.description || "Failed to create Razorpay Order",
    };
  } catch (err: any) {
    console.error("Razorpay Order Exception:", err);
    return { success: false, keyId: RAZORPAY_KEY_ID, error: err.message };
  }
}

/**
 * Verifies Razorpay Webhook or Checkout payment signature
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!RAZORPAY_KEY_SECRET) {
    // If running in development without credentials, accept simulated signature
    return paymentId.startsWith("pay_sim_") || signature === "simulated_valid_signature";
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

/**
 * Razorpay Route: Transfers worker payout share to worker's linked Razorpay account
 * e.g., ₹140 out of ₹199 is transferred directly to worker, ₹59 platform fee retained.
 */
export async function transferWorkerPayoutViaRoute({
  paymentId,
  workerAccountId,
  payoutAmountInRupees,
  referenceId,
}: {
  paymentId: string;
  workerAccountId: string;
  payoutAmountInRupees: number;
  referenceId: string;
}) {
  const payoutPaise = Math.round(payoutAmountInRupees * 100);

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log(
      `[Razorpay Route Escrow Released] Transferred ₹${payoutAmountInRupees} to worker account ${workerAccountId} for booking #${referenceId}`
    );
    return {
      success: true,
      transferId: `trf_sim_${Date.now()}`,
      amount: payoutPaise,
      currency: "INR",
      isSimulated: true,
    };
  }

  try {
    // Razorpay Route Transfer API: POST /v1/payments/{payment_id}/transfers
    const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        transfers: [
          {
            account: workerAccountId,
            amount: payoutPaise,
            currency: "INR",
            notes: {
              reference_id: referenceId,
              payout_type: "worker_settlement",
            },
            on_hold: 0, // Direct release on customer approval
          },
        ],
      }),
    });

    const data = await res.json();
    if (res.ok && data.items && data.items.length > 0) {
      return {
        success: true,
        transferId: data.items[0].id,
        amount: data.items[0].amount,
      };
    }

    return {
      success: false,
      error: data.error?.description || "Failed to execute Razorpay Route transfer",
    };
  } catch (err: any) {
    console.error("Razorpay Route Transfer Exception:", err);
    return { success: false, error: err.message };
  }
}
