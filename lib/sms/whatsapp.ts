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

  const endpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

  // 1. Try sending via approved WhatsApp Template
  try {
    const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME || "osmida_verification_code";
    const templatePayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${cleanPhone}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: otpCode }],
          },
        ],
      },
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(templatePayload),
    });

    const data = await res.json();
    if (res.ok && !!data.messages) {
      return true;
    }

    // 2. Direct text message fallback if template is not registered or approved yet
    console.warn("WhatsApp template send note:", data, "- attempting direct WhatsApp text fallback");
    const textPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${cleanPhone}`,
      type: "text",
      text: {
        body: `Your Osmida login verification code is: ${otpCode}. Valid for 10 minutes. Welcome to Osmida Residential Services, Nellore!`,
      },
    };

    const textRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(textPayload),
    });

    const textData = await textRes.json();
    return textRes.ok && !!textData.messages;
  } catch (err) {
    console.warn("WhatsApp OTP dispatch exception:", err);
    return false;
  }
}
