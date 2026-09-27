import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoBookingsStore } from "../../bookings/route";
import { prontoWorkersStore } from "../../partner/register/route";
import { globalActiveJobs } from "../../partner/jobs/route";

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

    // Merge & Overlay with in-memory prontoBookingsStore
    for (const [_, b] of prontoBookingsStore.entries()) {
      const idx = bookings.findIndex((existing) => existing.reference_id === b.reference_id);
      if (idx >= 0) {
        bookings[idx] = {
          ...bookings[idx],
          status: b.status || bookings[idx].status,
          worker_id: b.worker_id || bookings[idx].worker_id,
          worker_name: b.worker_name || bookings[idx].worker_name,
          worker_phone: b.worker_phone || bookings[idx].worker_phone,
          before_photo_url: b.before_photo_url || bookings[idx].before_photo_url,
          after_photo_url: b.after_photo_url || bookings[idx].after_photo_url,
        };
      } else {
        bookings.unshift(b);
      }
    }

    // Overlay real-time operational status from globalActiveJobs
    for (const [_, job] of globalActiveJobs.entries()) {
      if (!job.reference_id) continue;
      const idx = bookings.findIndex((existing) => existing.reference_id === job.reference_id);
      if (idx >= 0) {
        const rawStatus = String(job.status || bookings[idx].status || "").toLowerCase().trim();
        let liveStatus = rawStatus;
        if (rawStatus === "accepted" || rawStatus === "dispatched" || rawStatus === "at_gate" || rawStatus === "reach_gate") {
          liveStatus = "assigned";
        } else if (rawStatus === "in-progress" || rawStatus === "in_progress") {
          liveStatus = "in_progress";
        }
        bookings[idx].status = liveStatus;
        if (job.partner_id) bookings[idx].worker_id = job.partner_id;
        if (job.matched_partner_name) bookings[idx].worker_name = job.matched_partner_name;
        if (job.before_photo_url) bookings[idx].before_photo_url = job.before_photo_url;
        if (job.after_photo_url) bookings[idx].after_photo_url = job.after_photo_url;
      }
    }

    // Normalize all booking statuses
    bookings = bookings.map((b) => {
      let st = String(b.status || "").toLowerCase().trim();
      if (st === "in-progress" || st === "in_progress") st = "in_progress";
      else if (st === "accepted" || st === "dispatched" || st === "at_gate" || st === "reach_gate") st = "assigned";
      return { ...b, status: st };
    });

    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
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

        // Synchronize with partner_job_assignments table for worker portal
        await supabase
          .from("partner_job_assignments")
          .upsert(
            {
              reference_id: referenceId,
              partner_id: workerId,
              status: "offered",
              assigned_at: new Date().toISOString(),
            },
            { onConflict: "reference_id" }
          );
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

    // Synchronize in-memory job feed for immediate partner app pickup
    const jobKey = `job-${referenceId}`;
    const existingJob = globalActiveJobs.get(jobKey);
    if (existingJob) {
      existingJob.partner_id = workerId;
      existingJob.status = "offered";
      globalActiveJobs.set(jobKey, existingJob);
    } else if (booking) {
      globalActiveJobs.set(jobKey, {
        id: jobKey,
        reference_id: referenceId,
        partner_id: workerId,
        status: "offered",
        service_name: booking.selected_service || "Residential Help",
        customer_name: booking.customer_name || "Customer",
        customer_phone: booking.phone || "",
        customer_address: booking.site_address || booking.locality || "Nellore",
        locality: booking.locality || "Nellore",
        date: booking.inspection_date || new Date().toISOString().split("T")[0],
        time_slot: booking.time_slot || "Today",
        total_amount: booking.total_amount || 199,
        payout_amount: Math.round((booking.total_amount || 199) * 0.7),
        start_otp: booking.otp_start || "1234",
        end_otp: booking.otp_end || "5678",
        offered_at: new Date().toISOString(),
      } as any);
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
