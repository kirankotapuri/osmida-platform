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
    service_name: "Split AC Foam Jet Deep Clean (x2 Units)",
    category: "ac",
    customer_name: "Kiran Kotapuri",
    customer_phone: "7981067780",
    customer_address: "House #14/2, Near Gandhi Statue, Pogathota",
    locality: "Pogathota, Nellore",
    date: new Date().toISOString().split("T")[0],
    time_slot: "Today, 3:00 PM - 5:30 PM",
    total_amount: 1198,
    payout_amount: 840, // 70% share for partner
    start_otp: "4826",
    offered_at: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("partnerId");

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let jobs: PartnerJob[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("partner_job_assignments")
          .select("*")
          .eq("partner_id", partnerId)
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
      if (job.partner_id === partnerId && !jobs.some((j) => j.id === id)) {
        jobs.unshift(job);
      }
    }

    // If partner has zero jobs, seed 1 live interactive job for immediate test experience
    if (jobs.length === 0) {
      const sample = seedSampleJob(partnerId);
      globalActiveJobs.set(sample.id, sample);
      jobs.push(sample);
    }

    const offeredJobs = jobs.filter((j) => j.status === "offered");
    const activeJob = jobs.find((j) => ["accepted", "dispatched", "in_progress"].includes(j.status)) || null;
    const completedJobs = jobs.filter((j) => j.status === "completed");

    return NextResponse.json({
      success: true,
      offeredJobs,
      activeJob,
      completedJobs,
    });
  } catch (error) {
    console.error("Partner jobs fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
