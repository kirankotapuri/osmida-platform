import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoBookingsStore } from "../../bookings/route";
import { prontoWorkersStore } from "../../partner/register/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const supabase = getSupabaseClient();
    let bookings: any[] = [];

    if (supabase) {
      try {
        let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (status && status !== "all") {
          query = query.eq("status", status);
        }
        const { data, error } = await query;
        if (data && !error) {
          bookings = data.map((b: any) => {
            const cart = b.cart_items && typeof b.cart_items === "object" ? b.cart_items : {};
            return {
              ...b,
              total_amount: b.total_amount || b.service_price || cart.total_amount || Math.round((b.duration_hours || cart.duration_hours || 1.0) * (b.hourly_rate || cart.hourly_rate || 199)),
              duration_hours: b.duration_hours || cart.duration_hours || 1.0,
              hourly_rate: b.hourly_rate || cart.hourly_rate || 199,
              payment_method: b.payment_method || cart.payment_method || "cash",
            };
          });
        }
      } catch (err) {
        console.warn("DB admin bookings note:", err);
      }
    }

    // Merge with in-memory store
    for (const [_, b] of prontoBookingsStore.entries()) {
      if (!bookings.some((existing) => existing.reference_id === b.reference_id)) {
        if (!status || status === "all" || b.status === status) {
          bookings.unshift(b);
        }
      }
    }

    // Also get active workers roster for the manual assignment dropdown
    let workers: any[] = [];
    if (supabase) {
      try {
        const { data } = await supabase.from("service_partners").select("*");
        if (data && data.length > 0) workers = data;
      } catch {}
    }
    for (const [_, w] of prontoWorkersStore.entries()) {
      if (!workers.some((existing) => existing.phone === w.phone)) {
        workers.push(w);
      }
    }

    return NextResponse.json({
      success: true,
      bookings,
      workers,
    });
  } catch (error) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admin bookings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, workerId, workerName, workerPhone } = body;

    if (!referenceId || !workerId) {
      return NextResponse.json(
        { error: "referenceId and workerId are required" },
        { status: 400 }
      );
    }

    const cleanWorkerName = workerName || "Assigned Worker";
    const cleanWorkerPhone = workerPhone || "+91 94901 22849";

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from("bookings")
          .update({
            worker_id: workerId,
            worker_name: cleanWorkerName,
            worker_phone: cleanWorkerPhone,
            status: "assigned",
            updated_at: new Date().toISOString(),
          })
          .eq("reference_id", referenceId);
      } catch (err) {
        console.warn("DB admin assign note:", err);
      }
    }

    let booking = prontoBookingsStore.get(referenceId);
    if (booking) {
      booking.worker_id = workerId;
      booking.worker_name = cleanWorkerName;
      booking.worker_phone = cleanWorkerPhone;
      booking.status = "assigned";
      booking.updated_at = new Date().toISOString();
      prontoBookingsStore.set(referenceId, booking);
    }

    return NextResponse.json({
      success: true,
      message: `Worker ${cleanWorkerName} successfully assigned to booking ${referenceId}.`,
      booking,
    });
  } catch (error) {
    console.error("Admin assign worker error:", error);
    return NextResponse.json({ error: "Failed to assign worker" }, { status: 500 });
  }
}
