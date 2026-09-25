# Osmida Production Launch Checklist & External Setup Guide
**Location Focus:** Nellore, Andhra Pradesh  
**Brand Identity:** Osmida Deep Heritage Teal (`#0C6266`), Warm Saffron Amber CTA (`#E68A00`)  

This document details all external accounts, regulatory approvals, and manual configuration steps that must be completed outside the codebase before going live with real Nellore customers and service partners.

---

## 📋 Summary Table of External Tasks

| Task | Provider | Estimated Time | Necessity | Cost |
| :--- | :--- | :--- | :--- | :--- |
| **1. TRAI DLT Registration** | Vilpower / Jio / Airtel DLT | 2–4 Business Days | **Mandatory for SMS in India** | ₹0 - ₹5,900 (depending on operator fee) |
| **2. SMS Provider Setup** | MSG91 | 10 Minutes | **Mandatory** | Pay per SMS (₹0.15–₹0.25/SMS) |
| **3. WhatsApp Cloud API** | Meta Developer Portal | 30 Minutes | **Highly Recommended (Backup OTP)** | 1,000 free conversations/month |
| **4. Transactional Email** | Resend | 15 Minutes | **Mandatory for receipts & admin** | Free (3,000 emails/month) |
| **5. DNS Authentication** | Domain Registrar / Cloudflare | 15–30 Minutes | **Mandatory (Anti-Spam)** | Free |
| **6. Payment Gateway & Route** | Razorpay Route | 1–2 Days (KYC) | **Mandatory for RBI Compliance** | Standard 2% payment fee |
| **7. FCM Web Push** | Firebase Console | 10 Minutes | **Recommended for background alerts** | Free |
| **8. Google OAuth (Sign-in with Gmail)** | Google Cloud Console & Supabase | 10 Minutes | **Recommended for 1-Click Login** | Free |

---

## 1. 🇮🇳 TRAI DLT Registration (India Telecom Mandate)

> [!IMPORTANT]
> Under Telecom Regulatory Authority of India (TRAI) regulations, **no commercial SMS (including OTPs) can be delivered to Indian numbers without DLT (Distributed Ledger Technology) registration.** If you attempt to send SMS without an approved DLT Entity ID and Template ID, Indian telecom operators will drop the message.

### Step 1: Register as Principal Entity (PE)
Register on any **ONE** of the major Indian telecom DLT portals (registration is shared across all operators):
- **Vilpower (Vodafone Idea):** [https://www.vilpower.in](https://www.vilpower.in) *(Recommended: fast turnaround)*
- **Jio DLT:** [https://trueconnect.jio.com](https://trueconnect.jio.com)
- **Airtel DLT:** [https://www.airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication)

**Documents Needed:**
- Sole Proprietorship / Individual / Partnership / Company Registration document.
- Organization PAN & Authorized Signatory PAN + Aadhaar.
- Business address proof in Nellore / Andhra Pradesh.

### Step 2: Register Header (Sender ID)
- Header Type: **Service Implicit** (for OTP & Transactional alerts)
- Header Name: **`OSMIDA`** (6 capital letters)

### Step 3: Register Content Templates
Register the following 3 exact message templates. Variable tags must be specified as `{#var#}`:

1. **Customer Verification OTP Template:**
   ```text
   Your Osmida verification code is {#var#}. Valid for 10 minutes. Do not share this code with anyone. - OSMIDA
   ```
2. **Booking Confirmation Template:**
   ```text
   Hello {#var#}, your Osmida booking #{#var#} for {#var#} is confirmed for {#var#}. Track live at osmida.com. - OSMIDA
   ```
3. **Worker Dispatch Alert Template:**
   ```text
   New Osmida Job Alert #{#var#} in {#var#}. Payout: Rs.{#var#}. Check your Osmida Partner app now. - OSMIDA
   ```

### Step 4: Link DLT to MSG91
1. Sign up on **MSG91** ([https://msg91.com](https://msg91.com)).
2. Go to **Dashboard > Settings > DLT Details** and enter your approved **DLT Entity ID (PE ID)**.
3. Add your approved **Sender ID (`OSMIDA`)** and approved **Template IDs**.
4. In `.env.local` / Production Environment, set:
   ```env
   MSG91_AUTH_KEY=your_msg91_authkey_here
   MSG91_SENDER_ID=OSMIDA
   MSG91_OTP_TEMPLATE_ID=your_dlt_otp_template_id
   MSG91_BOOKING_TEMPLATE_ID=your_dlt_booking_template_id
   MSG91_WORKER_ALERT_TEMPLATE_ID=your_dlt_worker_template_id
   ```

---

## 2. 💬 WhatsApp Business API Setup (Immediate Backup)

Because DLT approval can take 2–4 business days, Osmida includes a **WhatsApp Business Cloud API** integration (`lib/sms/whatsapp.ts`) that functions immediately.

1. Go to **Meta for Developers**: [https://developers.facebook.com](https://developers.facebook.com)
2. Create an App -> Type: **Business** -> Add **WhatsApp** product.
3. Obtain your **Temporary Access Token** (or Permanent System User Token) and **Phone Number ID**.
4. Under Message Templates, submit the template `osmida_verification_code` (Category: Authentication, Language: English).
5. In `.env.local`, set:
   ```env
   WHATSAPP_CLOUD_API_TOKEN=your_meta_system_user_token
   WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
   ```

---

## 3. ✉️ Transactional Email & DNS Records (Resend)

> [!WARNING]
> If your domain does not have SPF, DKIM, and DMARC DNS records configured, emails will be rejected by Google (Gmail) and Microsoft (Outlook) under their strict 2024+ sender requirements.

### Step 1: Resend Setup
1. Sign up on **Resend** ([https://resend.com](https://resend.com)).
2. Go to **Domains** -> Click **Add Domain** -> Enter `osmida.com`.

### Step 2: Add DNS Records to Your Domain Registrar / DNS Host (Cloudflare, GoDaddy, etc.)
Add the 3 DNS records provided in your Resend Dashboard:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | `osmida.com` | `v=spf1 include:amazonses.com ~all` | Auto / 3600 |
| **CNAME** | `resend._domainkey.osmida.com` | `dkim.resend.com` *(or exact value in dashboard)* | Auto / 3600 |
| **TXT** | `_dmarc.osmida.com` | `v=DMARC1; p=none; rua=mailto:osmidaindia@gmail.com` | Auto / 3600 |

### Step 3: Verify and Set Environment Variables
Once Resend shows the domain as **"Verified"**, copy your API key and update `.env.local`:
```env
RESEND_API_KEY=re_123456789abcdef...
RESEND_FROM_EMAIL=Osmida <bookings@osmida.com>
ADMIN_ALERT_EMAIL=osmidaindia@gmail.com
```

---

## 4. 💳 Payment Gateway with Split Payments (Razorpay Route)

> [!IMPORTANT]
> **RBI Compliance Note:** Do not attempt to collect customer online payments into a private bank account and manually hold them as "escrow". Holding third-party funds without an RBI Payment Aggregator (PA) license violates RBI regulations. Osmida uses **Razorpay Route**, an RBI-authorized marketplace split-settlement solution.

### Step 1: Create a Razorpay Business Account
1. Sign up on **Razorpay** ([https://razorpay.com](https://razorpay.com)).
2. An **Individual / Sole Proprietorship** account is sufficient to start (no private limited company required).
3. Complete KYC:
   - Personal PAN & Aadhaar of founder.
   - Cancelled cheque or bank statement of your Nellore bank account.
   - Business Category: *Facility Management / Cleaning Services / House Help*.

### Step 2: Activate "Route" (Split Payments)
1. Go to **Razorpay Dashboard > Settings > Route**.
2. Activate Route feature. This allows splitting customer payments into:
   - **Worker Payout:** ₹140/hr (transferred to worker's linked account).
   - **Platform Commission:** ₹59/hr (retained in Osmida merchant account).

### Step 3: Configure Environment Variables
Copy your Live API Keys (or Test API Keys for final staging):
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

---

## 5. 📱 PWA & Worker Background Push Alerts (FCM)

### Web Push Setup:
1. Open **Firebase Console** ([https://console.firebase.google.com](https://console.firebase.google.com)).
2. Add project **"Osmida Dispatch"**.
3. Under **Project Settings > Cloud Messaging > Web Push Certificates**, click **Generate Key Pair**.
4. In `.env.local`, set:
   ```env
   FCM_SERVER_KEY=your_firebase_server_key
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_vapid_key
   VAPID_PRIVATE_KEY=your_private_vapid_key
   ```

### Field Testing Instructions for Nellore Workers:
1. **Android Devices:**
   - Open Chrome and visit `https://osmida.com/partner`.
   - Tap the three dots menu -> **"Install app"** or **"Add to Home screen"**.
   - The app installs as a standalone app titled **"Osmida Partner"** with the custom teal badge.
2. **iOS / iPhones (iOS 16.4+):**
   - Open Safari and visit `https://osmida.com/partner`.
   - Tap the **Share** button (box with upward arrow) at the bottom.
   - Scroll down and tap **"Add to Home Screen"**.
   - Tap **"Add"**. Launch from Home Screen.
   - Tap **"Enable Push"** to receive background job chimes.
   - **Important Fallback Rule:** As flagged in the UI, advise workers to *keep the app open in foreground while online* for 100% immediate dispatch buzzer audio.

---

## 6. 🌐 Google OAuth & 1-Click Gmail Sign-In

To allow customers to sign in with their Gmail accounts with 1 click:

### Step 1: Google Cloud Console Setup
1. Visit [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID**:
   - Application Type: **Web application**
   - Name: `Osmida Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for testing)
     - `https://osmida.com`
     - `https://www.osmida.com`
   - Authorized redirect URIs:
     - `https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client Secret**.

### Step 2: Enable in Supabase Dashboard
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) -> Your Osmida Project.
2. Navigate to **Authentication** -> **Providers** -> **Google**.
3. Toggle Google **ON**.
4. Paste the **Client ID** and **Client Secret** obtained from Google Cloud Console.
5. In **Authentication** -> **URL Configuration**:
   - Site URL: `https://osmida.com`
   - Redirect URLs:
     - `https://osmida.com/**`
     - `http://localhost:3000/**`
     - `https://osmida.com/auth/callback`

---

## 7. 🔐 Production Security Environment Variables Checklist

Ensure your production environment variables (on Vercel, Supabase, or AWS) contain the following secure values:

```env
# Platform Admin Security
ADMIN_USERNAME=osmida_ops_nellore
ADMIN_PASSWORD=<STRONG_RANDOM_PASSWORD_HERE>
ADMIN_SESSION_SECRET=<64_CHAR_RANDOM_SECRET>

# SMS Gateway (MSG91 & TRAI DLT)
MSG91_AUTH_KEY=
MSG91_SENDER_ID=OSMIDA
MSG91_OTP_TEMPLATE_ID=
MSG91_BOOKING_TEMPLATE_ID=
MSG91_WORKER_ALERT_TEMPLATE_ID=

# WhatsApp Cloud API Backup
WHATSAPP_CLOUD_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# Transactional Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=Osmida <bookings@osmida.com>
ADMIN_ALERT_EMAIL=osmidaindia@gmail.com

# Payment Gateway (Razorpay Route)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Background Push Notifications
FCM_SERVER_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

---
*Created for Osmida Nellore Production Deployment • September 2026*
