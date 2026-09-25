/**
 * Transactional Email Provider Integration via Resend API
 * 
 * Domain Configuration Warning (TRAI / Anti-Spam Best Practice):
 * The sending domain (e.g. osmida.com) must have SPF, DKIM, and DMARC DNS
 * records properly configured in your DNS provider (Cloudflare/GoDaddy/Route53),
 * otherwise transactional emails will land in spam or be rejected.
 */

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || "Osmida <bookings@osmida.com>";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_ALERT_EMAIL || "osmidaindia@gmail.com";

/**
 * Core Resend Dispatcher
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<EmailSendResult> {
  const recipients = Array.isArray(to) ? to : [to];

  if (!RESEND_API_KEY) {
    console.log(`[Resend Email Simulated] To: ${recipients.join(", ")} | Subject: ${subject}`);
    return { success: true, id: "simulated-resend-id" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: recipients,
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, id: data.id };
    }
    return { success: false, error: data.message || "Failed to dispatch email via Resend" };
  } catch (err: any) {
    console.error("Resend API Exception:", err);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Customer Booking Confirmation Email
 */
export async function sendCustomerBookingConfirmationEmail({
  customerEmail,
  customerName,
  referenceId,
  serviceName,
  scheduledTime,
  address,
  amount,
  paymentMethod,
}: {
  customerEmail: string;
  customerName: string;
  referenceId: string;
  serviceName: string;
  scheduledTime: string;
  address: string;
  amount: number;
  paymentMethod: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed - Osmida Nellore</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F8F8; margin: 0; padding: 24px; color: #1F2937; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(12, 98, 102, 0.08); }
        .header { background-color: #0C6266; padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background-color: #E68A00; color: #ffffff; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 12px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .info-table td { padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
        .label { color: #6B7280; width: 38%; }
        .value { color: #111827; font-weight: 600; text-align: right; }
        .cta-btn { display: block; width: 100%; box-sizing: border-box; background-color: #0C6266; color: #ffffff; text-decoration: none; text-align: center; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px; margin-top: 24px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Osmida Nellore</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Doorstep Residential Services</p>
        </div>
        <div class="content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="margin: 0; font-size: 18px; color: #111827;">Booking Confirmed!</h2>
            <span class="badge">#${referenceId}</span>
          </div>
          <p style="font-size: 14px; color: #4B5563; margin-top: 0;">
            Hello <strong>${customerName}</strong>, your doorstep service is confirmed with a verified Nellore partner. ₹0 advance — pay only after service completion.
          </p>

          <table class="info-table">
            <tr>
              <td class="label">Service</td>
              <td class="value">${serviceName}</td>
            </tr>
            <tr>
              <td class="label">Scheduled Time</td>
              <td class="value">${scheduledTime}</td>
            </tr>
            <tr>
              <td class="label">Doorstep Address</td>
              <td class="value">${address}</td>
            </tr>
            <tr>
              <td class="label">Total Amount</td>
              <td class="value">₹${amount}</td>
            </tr>
            <tr>
              <td class="label">Payment Mode</td>
              <td class="value">${paymentMethod === "cash" ? "Cash on Delivery" : "Online Escrow (Held Securely)"}</td>
            </tr>
          </table>

          <a href="https://osmida.com/booking/${referenceId}" class="cta-btn" style="color: #ffffff;">
            Track Booking Live & View Helper
          </a>
        </div>
        <div class="footer">
          <p style="margin: 0;">Osmida Facility Services • Nellore, Andhra Pradesh</p>
          <p style="margin: 4px 0 0 0;">Need help? WhatsApp us at +91-7676358162</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Booking Confirmed #${referenceId} - Osmida Nellore`,
    html,
  });
}

/**
 * 2. Service Completion & Payment Receipt Email
 */
export async function sendCustomerReceiptEmail({
  customerEmail,
  customerName,
  referenceId,
  serviceName,
  partnerName,
  amountPaid,
  paymentMethod,
}: {
  customerEmail: string;
  customerName: string;
  referenceId: string;
  serviceName: string;
  partnerName: string;
  amountPaid: number;
  paymentMethod: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - Osmida</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F8F8; margin: 0; padding: 24px; color: #1F2937; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(12, 98, 102, 0.08); }
        .header { background-color: #0C6266; padding: 28px 24px; text-align: center; color: #ffffff; }
        .content { padding: 28px 24px; }
        .amount-box { background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px; text-align: center; margin: 16px 0; }
        .amount-value { font-size: 26px; font-weight: 800; color: #166534; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .info-table td { padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
        .label { color: #6B7280; width: 40%; }
        .value { color: #111827; font-weight: 600; text-align: right; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin: 0; font-size: 22px;">Payment Receipt</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Osmida Doorstep Services Nellore</p>
        </div>
        <div class="content">
          <p style="font-size: 14px; color: #4B5563; margin-top: 0;">
            Hi <strong>${customerName}</strong>, thank you for choosing Osmida. Your service has been completed by <strong>${partnerName}</strong>.
          </p>

          <div class="amount-box">
            <span style="font-size: 12px; color: #166534; font-weight: 600; text-transform: uppercase;">Amount Settled</span>
            <div class="amount-value">₹${amountPaid}</div>
            <span style="font-size: 12px; color: #15803D;">Status: Paid via ${paymentMethod === "cash" ? "Cash" : "Online Escrow"}</span>
          </div>

          <table class="info-table">
            <tr>
              <td class="label">Reference ID</td>
              <td class="value">#${referenceId}</td>
            </tr>
            <tr>
              <td class="label">Service Completed</td>
              <td class="value">${serviceName}</td>
            </tr>
            <tr>
              <td class="label">Verified Partner</td>
              <td class="value">${partnerName}</td>
            </tr>
            <tr>
              <td class="label">Warranty</td>
              <td class="value">30-Day Osmida Guarantee</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p style="margin: 0;">Osmida Facility Services • GST & TDS Compliant Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Official Receipt for Booking #${referenceId} - Osmida`,
    html,
  });
}

/**
 * 3. Real-time Admin Alert Email
 */
export async function sendAdminNewBookingAlert({
  referenceId,
  customerName,
  customerPhone,
  serviceName,
  locality,
  amount,
  paymentMethod,
}: {
  referenceId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  locality: string;
  amount: number;
  paymentMethod: string;
}) {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
      <h2 style="color: #0C6266;">🚨 New Booking Created on Osmida</h2>
      <p>A new customer order has been placed and requires dispatch matching:</p>
      <ul>
        <li><strong>Booking ID:</strong> #${referenceId}</li>
        <li><strong>Customer:</strong> ${customerName} (+91 ${customerPhone})</li>
        <li><strong>Locality:</strong> ${locality}</li>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Gross Amount:</strong> ₹${amount} (${paymentMethod})</li>
      </ul>
      <p><a href="https://osmida.com/admin" style="background-color: #0C6266; color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px;">Open Admin Dispatch Console</a></p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[ADMIN ALERT] New Booking #${referenceId} in ${locality}`,
    html,
  });
}
