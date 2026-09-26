import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { globalActiveJobs } from "../jobs/route";
import { osmidaBookingsStore } from "@/app/api/bookings/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * POST /api/partner/reset
 * Clears all active/stuck test jobs and bookings so developers/partners can test from scratch.
 */
export async function POST(req: Request) {
  try {
    // 1. Clear in-memory active jobs and booking store
    globalActiveJobs.clear();
    osmidaBookingsStore.clear();

    let dbJobsDeleted = 0;
    let dbBookingsDeleted = 0;

    // 2. Clear from Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Delete all active or test partner assignments
        const { error: delJobsErr, count: jobsCount } = await supabase
          .from("partner_job_assignments")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all

        if (!delJobsErr) {
          dbJobsDeleted = jobsCount || 0;
        }

        // Clean up test bookings
        const { error: delBkErr, count: bkCount } = await supabase
          .from("bookings")
          .delete()
          .like("reference_id", "OSM-%");

        if (!delBkErr) {
          dbBookingsDeleted = bkCount || 0;
        }
      } catch (dbErr) {
        console.warn("Reset DB cleanup note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "All test jobs and bookings have been cleared. You can now test a fresh booking from scratch.",
      memoryCleared: true,
      dbJobsDeleted,
      dbBookingsDeleted,
    });
  } catch (error: any) {
    console.error("Reset test data error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset test jobs" },
      { status: 500 }
    );
  }
}
