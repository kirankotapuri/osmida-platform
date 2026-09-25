import { NextResponse } from "next/server";
import { savePartnerPushSubscription } from "@/lib/notifications/webPush";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { partnerId, subscription, fcmToken } = body;

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
    }

    savePartnerPushSubscription({
      partnerId,
      endpoint: subscription?.endpoint || "",
      keys: subscription?.keys,
      fcmToken: fcmToken || null,
      updatedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Worker push notification subscription registered successfully",
    });
  } catch (err: any) {
    console.error("Push token registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to register push token" }, { status: 500 });
  }
}
