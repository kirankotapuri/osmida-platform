import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  matchPartnersForBooking,
  DEFAULT_PARTNERS,
  ServicePartner,
  PartnerJob,
} from "@/lib/partnerMatching";
import { globalActiveJobs } from "../jobs/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      referenceId,
      customerName,
      customerPhone,
      customerAddress,
      locality,
      selectedService,
      category,
      totalAmount,
      inspectionDate,
      timeSlot,
    } = body;

    if (!referenceId || !locality) {
      return NextResponse.json({ error: "referenceId and locality are required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let partners: ServicePartner[] = [...DEFAULT_PARTNERS];

    if (supabase) {
      try {
        const { data, error } = await supabase.from("service_partners").select("*");
        if (data && !error && data.length > 0) {
          partners = data as ServicePartner[];
        }
      } catch (err) {
        console.warn("DB partners fetch note:", err);
      }
    }

    // Run the Tree-Matching Algorithm for Residential House Help & Cleaning
    const targetCat = category || "cleaning";
    const matchResult = matchPartnersForBooking(targetCat, locality, partners);
    const assignedPartner = matchResult.primaryMatch;

    if (!assignedPartner) {
      return NextResponse.json({
        success: false,
        message: "No available online partners found for this service & locality.",
      });
    }

    const price = typeof totalAmount === "number" ? totalAmount : 199;
    const payout = Math.round(price * 0.7); // 70% partner payout
    const startOtp = String(Math.floor(1000 + Math.random() * 9000));

    const newJob: PartnerJob = {
      id: `job-${referenceId}`,
      reference_id: referenceId,
      partner_id: assignedPartner.id,
      status: "offered",
      service_name: selectedService || "Bathroom Cleaning & House Help",
      category: targetCat,
      customer_name: customerName || "Customer",
      customer_phone: customerPhone || "",
      customer_address: customerAddress || `${locality}, Nellore`,
      locality: locality,
      date: inspectionDate || new Date().toISOString().split("T")[0],
      time_slot: timeSlot || "Earliest Slot",
      total_amount: price,
      payout_amount: payout,
      start_otp: startOtp,
      offered_at: new Date().toISOString(),
    };

    // Store in active jobs feed
    globalActiveJobs.set(newJob.id, newJob);

    // Persist to Supabase if table is ready
    if (supabase) {
      try {
        await supabase.from("partner_job_assignments").insert({
          id: newJob.id,
          reference_id: referenceId,
          partner_id: assignedPartner.id,
          service_name: newJob.service_name,
          customer_name: newJob.customer_name,
          customer_phone: newJob.customer_phone,
          customer_address: newJob.customer_address,
          locality: newJob.locality,
          payout_amount: newJob.payout_amount,
          start_otp: newJob.start_otp,
          status: "offered",
        });
      } catch (dbErr) {
        console.warn("DB assignment insert note:", dbErr);
      }
    }

    console.log(`[Quick Dispatch] Job ${referenceId} in ${locality} dispatched to partner ${assignedPartner.name} (${assignedPartner.phone})`);

    return NextResponse.json({
      success: true,
      referenceId,
      assignedPartner: {
        id: assignedPartner.id,
        name: assignedPartner.name,
        phone: assignedPartner.phone,
        hub: assignedPartner.assigned_hub,
        rating: assignedPartner.rating,
      },
      fallbackQueueCount: matchResult.fallbackQueue.length,
      startOtp,
      payout,
      message: `Job offered to ${assignedPartner.name} (${assignedPartner.assigned_hub} Hub)`,
    });
  } catch (error) {
    console.error("Dispatch algorithm error:", error);
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}
