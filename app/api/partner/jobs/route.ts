import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PartnerJob } from "@/lib/partnerMatching";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory mock/active jobs store for demo and immediate field testing
export const globalActiveJobs: Map<string, PartnerJob> = new Map();

// Helper to seed a sample live job if none exist
function seedSampleJob(partnerId: string): PartnerJob {
  const ref = `OSM-NEL-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    id: `job-${ref}`,
    reference_id: ref,
    partner_id: partnerId,
    status: "offered",
    service_name: "Bathroom Deep Clean & Kitchen Sanitization",
    category: "cleaning",
    customer_name: "Kiran Kotapuri",
    customer_phone: "7981067780",
    customer_address: "House #14/2, Near Gandhi Statue, Pogathota",
    locality: "Pogathota, Nellore",
    date: new Date().toISOString().split("T")[0],
    time_slot: "Today, 3:00 PM - 5:00 PM",
    total_amount: 398, // 2 hrs @ ₹199/hr
    payout_amount: 280, // 70% share for partner (₹140/hr)
    start_otp: "4826",
    offered_at: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("partnerId") || "default-partner-pogathota";
    const isOnlineParam = searchParams.get("isOnline");

    const supabase = getSupabaseClient();
    let jobs: PartnerJob[] = [];
    let isOffline = isOnlineParam === "false";

    // If isOnline param not explicitly passed, inspect partner status from Supabase
    if (supabase && isOnlineParam === null) {
      try {
        const { data: partnerRow } = await supabase
          .from("service_partners")
          .select("status")
          .eq("id", partnerId)
          .maybeSingle();

        if (partnerRow && partnerRow.status === "offline") {
          isOffline = true;
        }
      } catch (checkErr) {
        console.warn("DB partner status check note:", checkErr);
      }
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("partner_job_assignments")
          .select("*")
          .or(`partner_id.eq.${partnerId},status.eq.offered`)
          .order("created_at", { ascending: false });

        if (data && !error && data.length > 0) {
          jobs = data as PartnerJob[];
        }
      } catch (err) {
        console.warn("DB jobs query note:", err);
      }
    }

    // Include any in-memory active jobs
    for (const [id, job] of globalActiveJobs.entries()) {
      const isMatch =
        job.partner_id === partnerId ||
        job.partner_id === "default-partner-pogathota" ||
        job.status === "offered";
      if (isMatch && !jobs.some((j) => j.id === id || j.reference_id === job.reference_id)) {
        jobs.unshift(job);
      }
    }

    // Only seed sample job if explicitly requested with ?seed=true and partner is NOT offline
    const shouldSeed = searchParams.get("seed") === "true";
    if (jobs.length === 0 && shouldSeed && !isOffline) {
      const sample = seedSampleJob(partnerId);
      globalActiveJobs.set(sample.id, sample);
      jobs.push(sample);
    }

    // Offline partners must NEVER receive offered jobs
    const offeredJobs = isOffline ? [] : jobs.filter((j) => j.status === "offered");
    const activeJob = jobs.find((j) => ["accepted", "dispatched", "in_progress"].includes(j.status)) || null;
    const completedJobs = jobs.filter((j) => j.status === "completed");

    return NextResponse.json({
      success: true,
      jobs: isOffline ? jobs.filter((j) => j.status !== "offered") : jobs,
      offeredJobs,
      activeJob,
      completedJobs,
      isOnline: !isOffline,
    });
  } catch (error) {
    console.error("Partner jobs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
