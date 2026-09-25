/**
 * MSG91 SMS Provider Integration for Osmida (India Telecom / TRAI DLT Compliant)
 * 
 * Pre-requisite for India Delivery:
 * Requires DLT Entity Registration, Approved Header/Sender ID (e.g., OSMIDA),
 * and DLT-approved Template IDs on portals like Vilpower/Jio/Airtel DLT.
 */

export interface Msg91SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || "";
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || "OSMIDA";
const MSG91_OTP_TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID || "";
const MSG91_BOOKING_TEMPLATE_ID = process.env.MSG91_BOOKING_TEMPLATE_ID || "";
const MSG91_WORKER_ALERT_TEMPLATE_ID = process.env.MSG91_WORKER_ALERT_TEMPLATE_ID || "";

/**
 * Sends a real 4-digit OTP via MSG91 OTP API
 */
export async function sendOtpViaMsg91(phone: string, otp: string): Promise<Msg91SendResult> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, error: "Invalid 10-digit mobile number" };
  }

  if (!MSG91_AUTH_KEY) {
    console.log(`[MSG91 SMS Note] No MSG91_AUTH_KEY set. Simulated delivery of OTP ${otp} to +91 ${cleanPhone}`);
    return { success: true, messageId: "simulated-msg91" };
  }

  try {
    const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(
      MSG91_OTP_TEMPLATE_ID
    )}&mobile=91${cleanPhone}&authkey=${encodeURIComponent(MSG91_AUTH_KEY)}&otp=${otp}&sender=${encodeURIComponent(
      MSG91_SENDER_ID
    )}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.type === "success") {
      return { success: true, messageId: data.message };
    }
    return { success: false, error: data.message || "Failed to send OTP via MSG91" };
  } catch (err: any) {
    console.error("MSG91 OTP API Request Error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a transactional booking confirmation SMS to customer
 */
export async function sendBookingConfirmationSms(
  phone: string,
  referenceId: string,
  serviceName: string,
  timeSlot: string
): Promise<Msg91SendResult> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) return { success: false, error: "Invalid phone" };

  if (!MSG91_AUTH_KEY || !MSG91_BOOKING_TEMPLATE_ID) {
    console.log(
      `[MSG91 Transactional SMS] Booking confirmed: #${referenceId} (${serviceName}) for +91 ${cleanPhone}`
    );
    return { success: true, messageId: "simulated-booking-sms" };
  }

  try {
    const payload = {
      template_id: MSG91_BOOKING_TEMPLATE_ID,
      sender: MSG91_SENDER_ID,
      short_url: "0",
      recipients: [
        {
          mobiles: `91${cleanPhone}`,
          ref_id: referenceId,
          service: serviceName,
          slot: timeSlot,
        },
      ],
    };

    const res = await fetch("https://control.msg91.com/api/v5/flow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: res.ok && data.type === "success", messageId: data.message };
  } catch (err: any) {
    console.error("MSG91 Booking SMS Error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a job assignment dispatch SMS to the field worker/partner
 */
export async function sendWorkerJobAlertSms(
  workerPhone: string,
  bookingRef: string,
  locality: string,
  serviceName: string,
  payoutAmount: number
): Promise<Msg91SendResult> {
  const cleanPhone = workerPhone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) return { success: false, error: "Invalid phone" };

  if (!MSG91_AUTH_KEY || !MSG91_WORKER_ALERT_TEMPLATE_ID) {
    console.log(
      `[MSG91 Worker Alert SMS] Job #${bookingRef} in ${locality} (₹${payoutAmount}) alerted to +91 ${cleanPhone}`
    );
    return { success: true, messageId: "simulated-worker-sms" };
  }

  try {
    const payload = {
      template_id: MSG91_WORKER_ALERT_TEMPLATE_ID,
      sender: MSG91_SENDER_ID,
      recipients: [
        {
          mobiles: `91${cleanPhone}`,
          ref_id: bookingRef,
          locality: locality,
          service: serviceName,
          payout: String(payoutAmount),
        },
      ],
    };

    const res = await fetch("https://control.msg91.com/api/v5/flow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: MSG91_AUTH_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: res.ok && data.type === "success", messageId: data.message };
  } catch (err: any) {
    console.error("MSG91 Worker Job SMS Error:", err);
    return { success: false, error: err.message };
  }
}
