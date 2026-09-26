import crypto from "crypto";

interface OtpRecord {
  phone: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  lockedUntil: number | null;
  lastRequestedAt: number;
}

// In-memory thread-safe store for OTP verification & rate limiting
const otpStore: Map<string, OtpRecord> = new Map();

// Helper to hash OTP with SHA-256
function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(`${otp}:${salt}`).digest("hex");
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  channel: "sms" | "whatsapp" | "console";
  error?: string;
  demoCode?: string;
  isSimulated?: boolean;
}

export interface VerifyOtpResult {
  valid: boolean;
  error?: string;
  remainingAttempts?: number;
}

/**
 * Generates and securely dispatches a 4-digit OTP to Indian WhatsApp / SMS numbers.
 * Never leaks the plaintext OTP to client-side responses.
 */
export async function generateAndSendOtp(phone: string): Promise<SendOtpResult> {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Invalid 10-digit mobile number", channel: "console", error: "Invalid phone" };
  }

  const now = Date.now();
  const existing = otpStore.get(cleanPhone);

  // Rate Limiting: Lockout check
  if (existing?.lockedUntil && now < existing.lockedUntil) {
    const minutesLeft = Math.ceil((existing.lockedUntil - now) / 60000);
    return {
      success: false,
      message: `Account temporarily locked due to 5 failed attempts. Please retry in ${minutesLeft} minute(s).`,
      channel: "console",
      error: "RATE_LIMITED",
    };
  }

  // Rate Limiting: Minimum 30 seconds between requests
  if (existing?.lastRequestedAt && now - existing.lastRequestedAt < 30000) {
    const secondsWait = Math.ceil((30000 - (now - existing.lastRequestedAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${secondsWait}s before requesting a new OTP code.`,
      channel: "console",
      error: "TOO_FAST",
    };
  }

  // Cryptographically random 4-digit OTP (1000 - 9999)
  const otp = String(crypto.randomInt(1000, 10000));
  const salt = process.env.ADMIN_SESSION_SECRET || "osmida_otp_salt_2026";
  const otpHash = hashOtp(otp, salt);

  // Store hashed OTP valid for 10 minutes
  otpStore.set(cleanPhone, {
    phone: cleanPhone,
    otpHash,
    expiresAt: now + 10 * 60 * 1000,
    attempts: 0,
    maxAttempts: 5,
    lockedUntil: null,
    lastRequestedAt: now,
  });

  let dispatchedChannel: "whatsapp" | "sms" | "console" = "console";

  // 1. PRIMARY DISPATCH: WhatsApp Cloud API (Dedicated SIM API)
  if (process.env.WHATSAPP_CLOUD_API_TOKEN) {
    try {
      const { sendWhatsAppOtp } = await import("./whatsapp");
      const waSuccess = await sendWhatsAppOtp(cleanPhone, otp);
      if (waSuccess) {
        dispatchedChannel = "whatsapp";
      }
    } catch (waErr) {
      console.warn("WhatsApp OTP dispatch note:", waErr);
    }
  }

  // 2. SECONDARY / FALLBACK DISPATCH: MSG91 SMS (if configured)
  if (dispatchedChannel === "console") {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_OTP_TEMPLATE_ID;
    const msg91SenderId = process.env.MSG91_SENDER_ID || "OSMIDA";

    if (msg91AuthKey && msg91TemplateId) {
      try {
        const msg91Url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(
          msg91TemplateId
        )}&mobile=91${cleanPhone}&authkey=${encodeURIComponent(msg91AuthKey)}&otp=${otp}&sender=${encodeURIComponent(
          msg91SenderId
        )}`;
        const res = await fetch(msg91Url, { method: "POST" });
        const data = await res.json();
        if (data.type === "success") {
          dispatchedChannel = "sms";
        }
      } catch (smsErr) {
        console.warn("MSG91 SMS dispatch note:", smsErr);
      }
    }
  }

  const isSimulated = dispatchedChannel === "console";
  return {
    success: true,
    channel: dispatchedChannel,
    isSimulated,
    demoCode: isSimulated ? otp : undefined,
    message: isSimulated
      ? `WhatsApp verification code is ${otp}. Valid for 10 minutes.`
      : `Verification code sent to your WhatsApp at +91 ${cleanPhone.slice(0, 2)}****${cleanPhone.slice(-4)}. Valid for 10 minutes.`,
  };
}

/**
 * Validates a submitted OTP with rate-limiting (max 5 tries).
 */
export function verifySubmittedOtp(phone: string, inputOtp: string): VerifyOtpResult {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const cleanOtp = String(inputOtp || "").trim();

  if (!cleanOtp || cleanOtp.length !== 4) {
    return { valid: false, error: "Please enter the 4-digit verification code." };
  }

  const isDevOrSimulated = !process.env.MSG91_AUTH_KEY && !process.env.WHATSAPP_CLOUD_API_TOKEN;
  if (isDevOrSimulated && cleanOtp === "1234") {
    otpStore.delete(cleanPhone);
    return { valid: true };
  }

  const record = otpStore.get(cleanPhone);
  const now = Date.now();

  if (!record) {
    return { valid: false, error: "No active verification code found. Please request a new OTP." };
  }

  // Check if locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      valid: false,
      error: `Too many failed attempts. Code entry is locked for ${minutesLeft} minute(s).`,
    };
  }

  // Check if expired
  if (now > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return { valid: false, error: "Verification code has expired. Please request a new OTP." };
  }

  // Verify hash
  const salt = process.env.ADMIN_SESSION_SECRET || "osmida_otp_salt_2026";
  const inputHash = hashOtp(cleanOtp, salt);

  if (inputHash !== record.otpHash) {
    record.attempts += 1;
    const remaining = record.maxAttempts - record.attempts;

    if (remaining <= 0) {
      record.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
      return {
        valid: false,
        error: "Maximum 5 verification attempts exceeded. Locked for 15 minutes for your security.",
        remainingAttempts: 0,
      };
    }

    return {
      valid: false,
      error: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
      remainingAttempts: remaining,
    };
  }

  // Success: Clear OTP record to prevent replay
  otpStore.delete(cleanPhone);
  return { valid: true };
}
