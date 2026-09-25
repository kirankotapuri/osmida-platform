/**
 * WhatsApp Business Cloud API integration for Osmida OTP and transaction alerts.
 */

export async function sendWhatsAppOtp(phone: string, otpCode: string): Promise<boolean> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) return false;

  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || "1275804505618996";

  if (!token) {
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v25.0/${phoneId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${cleanPhone}`,
      type: "template",
      template: {
        name: "osmida_verification_code",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: otpCode }],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [{ type: "text", text: otpCode }],
          },
        ],
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return res.ok && !!data.messages;
  } catch (err) {
    console.warn("WhatsApp OTP dispatch exception:", err);
    return false;
  }
}
