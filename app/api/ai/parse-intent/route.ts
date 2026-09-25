import { NextResponse } from "next/server";
import { parseBookingIntent } from "@/lib/ai/intentParser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, referenceDate } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text prompt is required for intent parsing" },
        { status: 400 }
      );
    }

    const intent = await parseBookingIntent({
      text: text.trim(),
      referenceDate,
    });

    return NextResponse.json({
      success: true,
      intent,
    });
  } catch (error: any) {
    console.error("Parse Intent API error:", error);
    return NextResponse.json(
      { error: "Failed to parse booking intent", details: error.message },
      { status: 500 }
    );
  }
}
