import { NextResponse } from "next/server";
import { handleSupportChat } from "@/lib/ai/supportAssistant";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, referenceId, customerPhone } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    const result = await handleSupportChat({
      message: message.trim(),
      history: history || [],
      referenceId,
      customerPhone,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Support Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate support reply", details: error.message },
      { status: 500 }
    );
  }
}
