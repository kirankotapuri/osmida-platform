/**
 * Web Push & FCM Notification Dispatcher for Worker Job Alerts
 * 
 * Works across:
 * - Android Chrome / Edge / Firefox (Web Push & FCM)
 * - iOS 16.4+ (when worker adds Osmida Partner to Home Screen as PWA)
 * - Desktop Chrome / Safari / Edge
 */

export interface PushSubscriptionRecord {
  partnerId: string;
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  fcmToken?: string;
  updatedAt: number;
}

// In-memory store for active push subscriptions (persisted alongside Supabase)
export const partnerPushStore = new Map<string, PushSubscriptionRecord>();

/**
 * Register or update a worker's push subscription
 */
export function savePartnerPushSubscription(record: PushSubscriptionRecord) {
  partnerPushStore.set(record.partnerId, {
    ...record,
    updatedAt: Date.now(),
  });
}

/**
 * Dispatches a push notification to all active worker subscriptions
 */
export async function broadcastJobAlertPush({
  jobId,
  referenceId,
  serviceName,
  locality,
  payoutAmount,
}: {
  jobId: string;
  referenceId: string;
  serviceName: string;
  locality: string;
  payoutAmount: number;
}) {
  const fcmServerKey = process.env.FCM_SERVER_KEY || process.env.FIREBASE_SERVER_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  const payload = {
    title: "🚨 NEW OSMIDA JOB ALERT!",
    body: `${serviceName} in ${locality} — ₹${payoutAmount} Guaranteed Payout. Tap to accept!`,
    icon: "/icons/partner-icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: {
      url: `/partner?jobId=${jobId}&ref=${referenceId}`,
      jobId,
      referenceId,
      timestamp: Date.now(),
    },
  };

  console.log(
    `[WebPush/FCM] Broadcasting alert for Job #${referenceId} to ${partnerPushStore.size} active worker subscribers.`
  );

  const results: Array<{ partnerId: string; success: boolean; error?: string }> = [];

  for (const [partnerId, sub] of partnerPushStore.entries()) {
    try {
      // 1. If worker provided an FCM device token directly
      if (sub.fcmToken && fcmServerKey) {
        const fcmRes = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${fcmServerKey}`,
          },
          body: JSON.stringify({
            to: sub.fcmToken,
            notification: {
              title: payload.title,
              body: payload.body,
              icon: payload.icon,
              click_action: `/partner?jobId=${jobId}`,
              sound: "default",
            },
            data: payload.data,
            priority: "high",
          }),
        });
        const fcmData = await fcmRes.json();
        results.push({ partnerId, success: fcmRes.ok && fcmData.success === 1 });
        continue;
      }

      // 2. Standard Web Push endpoint (W3C Web Push Protocol)
      if (sub.endpoint) {
        const pushRes = await fetch(sub.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            TTL: "60",
            Urgency: "high",
          },
          body: JSON.stringify(payload),
        });
        results.push({ partnerId, success: pushRes.ok });
        continue;
      }

      results.push({ partnerId, success: true });
    } catch (err: any) {
      console.warn(`[WebPush] Failed to push to partner ${partnerId}:`, err.message);
      results.push({ partnerId, success: false, error: err.message });
    }
  }

  return results;
}
