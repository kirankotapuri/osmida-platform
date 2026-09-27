import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoWorkersStore } from "../../partner/register/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { workerId, phone, approvalStatus } = body;

    if (!approvalStatus || (!workerId && !phone)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase.from("service_partners").update({
          approval_status: approvalStatus,
          updated_at: new Date().toISOString(),
        });
        if (workerId) {
          query = query.eq("id", workerId);
        } else if (cleanPhone) {
          query = query.eq("phone", cleanPhone);
        }
        await query;
      } catch (err) {
        console.warn("DB update partner note:", err);
      }
    }

    // Update in-memory
    if (cleanPhone) {
      const worker = prontoWorkersStore.get(cleanPhone);
      if (worker) {
        worker.approval_status = approvalStatus;
        prontoWorkersStore.set(cleanPhone, worker);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Partner status updated to ${approvalStatus}`,
    });
  } catch (error) {
    console.error("Admin worker status update error:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}
