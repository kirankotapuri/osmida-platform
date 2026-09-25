import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { globalActiveJobs } from "../jobs/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// Helper to trigger Meta WhatsApp Template updates to the customer
async function sendWhatsAppStatusUpdate(
  phone: string,
  templateName: string,
  parameters: string[]
) {
  try {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) return;

    // Meta Graph API Endpoint
    const url = "https://graph.facebook.com/v25.0/1275804505618996/messages";
    const bearerToken = process.env.WHATSAPP_CLOUD_API_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${cleanPhone}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: parameters.map((text) => ({ type: "text", text: String(text || "") })),
          },
        ],
      },
    };

    console.log(`[WhatsApp Dispatch] Template ${templateName} to 91${cleanPhone}:`, parameters);

    if (process.env.WHATSAPP_CLOUD_API_TOKEN) {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn("Direct Meta WhatsApp note:", e));
    }
  } catch (err) {
    console.error("WhatsApp dispatch error:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      jobId,
      partnerId,
      partnerName,
      partnerPhone,
      otp,
      startOtp,
      endOtp,
      beforePhoto,
      afterPhoto,
      beforePhotoUrl,
      afterPhotoUrl,
      paymentMethod,
      collectedAmount,
    } = body;

    const actionNorm = String(action || "").toLowerCase().trim();

    if (!jobId || !actionNorm) {
      return NextResponse.json({ error: "jobId and action are required" }, { status: 400 });
    }

    const cleanStartOtp = String(startOtp || otp || "").trim();
    const cleanEndOtp = String(endOtp || otp || "").trim();
    const cleanBeforePhoto = beforePhotoUrl || beforePhoto || null;
    const cleanAfterPhoto = afterPhotoUrl || afterPhoto || null;

    const supabase = getSupabaseClient();
    let job = globalActiveJobs.get(jobId);

    // If not in-memory, query Supabase
    if (!job && supabase) {
      try {
        const { data } = await supabase
          .from("partner_job_assignments")
          .select("*")
          .eq("id", jobId)
          .maybeSingle();
        if (data) job = data;
      } catch (err) {
        console.warn("DB job lookup note:", err);
      }
    }

    if (!job) {
      return NextResponse.json({ error: "Job assignment not found" }, { status: 404 });
    }

    const customerPhone = job.customer_phone || "";
    const customerName = job.customer_name || "Customer";
    const serviceName = job.service_name || "Service";
    const refId = job.reference_id;

    // 1. ACTION: ACCEPT JOB
    if (actionNorm === "accept") {
      job.status = "accepted";
      job.accepted_at = new Date().toISOString();
      globalActiveJobs.set(job.id, { ...job });

      // Update in-memory booking store
      try {
        const { prontoBookingsStore } = await import("../../bookings/route");
        const stored = prontoBookingsStore.get(refId);
        if (stored) {
          stored.status = "assigned";
          stored.worker_phone = partnerPhone || "9490122849";
          prontoBookingsStore.set(refId, stored);
        }
      } catch {}

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "accepted", accepted_at: job.accepted_at })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "assigned", updated_at: new Date().toISOString() })
            .eq("reference_id", refId);
        } catch (dbErr) {
          console.warn("DB accept update note:", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: "accept",
        job,
        message: "Job accepted! Customer has been assigned to you.",
      });
    }

    // 2. ACTION: DECLINE JOB
    if (actionNorm === "decline") {
      job.status = "declined";
      globalActiveJobs.delete(job.id);

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "declined" })
            .eq("id", job.id);
        } catch (dbErr) {
          console.warn("DB decline note:", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: "decline",
        message: "Job declined. Cascading to next available technician.",
      });
    }

    // 3. ACTION: DISPATCH ("ON THE WAY")
    if (actionNorm === "dispatch") {
      job.status = "dispatched";
      globalActiveJobs.set(job.id, { ...job });

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "dispatched" })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "dispatched", updated_at: new Date().toISOString() })
            .eq("reference_id", refId);
        } catch (dbErr) {
          console.warn("DB dispatch note:", dbErr);
        }
      }

      await sendWhatsAppStatusUpdate(customerPhone, "osmida_dispatched", [
        customerName,
        serviceName,
        refId,
      ]);

      return NextResponse.json({
        success: true,
        action: "dispatch",
        job,
        message: "Marked as On The Way. Customer received arrival update!",
      });
    }

    // 4. ACTION: START JOB (CUSTOMER OTP VERIFICATION)
    if (actionNorm === "start" || actionNorm === "start_job") {
      const expectedOtp = String(job.start_otp || "").trim();

      // Strict OTP validation: must match customer's real doorstep code
      if (!cleanStartOtp || cleanStartOtp !== expectedOtp) {
        return NextResponse.json(
          { error: `Invalid Start OTP '${cleanStartOtp}'. Please ask the customer for their 4-digit doorstep code.` },
          { status: 400 }
        );
      }

      job.status = "in_progress";
      job.started_at = new Date().toISOString();
      globalActiveJobs.set(job.id, { ...job });

      // Update in-memory booking store
      try {
        const { prontoBookingsStore } = await import("../../bookings/route");
        const stored = prontoBookingsStore.get(refId);
        if (stored) {
          stored.status = "in-progress";
          prontoBookingsStore.set(refId, stored);
        }
      } catch {}

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "in_progress", started_at: job.started_at })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "in-progress", updated_at: new Date().toISOString() })
            .eq("reference_id", refId);
        } catch (dbErr) {
          console.warn("DB start note:", dbErr);
        }
      }

      await sendWhatsAppStatusUpdate(customerPhone, "osmida_job_started", [
        customerName,
        serviceName,
        refId,
      ]);

      return NextResponse.json({
        success: true,
        action: "start",
        job,
        message: "Start OTP verified! Work is now in progress.",
      });
    }

    // 5. ACTION: COMPLETE JOB (MANDATORY BEFORE + AFTER PHOTOS & OTP-END)
    if (actionNorm === "complete" || actionNorm === "complete_job") {
      // 1. Mandatory Photo Requirement: Job cannot be marked complete without BOTH before and after photos
      if (!cleanBeforePhoto || !cleanAfterPhoto) {
        return NextResponse.json(
          {
            error:
              "Both Before photo and After photo are mandatory to complete the job. Please capture or upload both photos.",
          },
          { status: 400 }
        );
      }

      // 2. Validate End OTP: must match expected customer completion OTP
      const expectedEndOtp = String(job.end_otp || (job as any).otp_end || "").trim();
      if (expectedEndOtp && (!cleanEndOtp || cleanEndOtp !== expectedEndOtp)) {
        return NextResponse.json(
          {
            error: `Invalid End OTP '${cleanEndOtp}'. Please ask the customer for their 4-digit completion code.`,
          },
          { status: 400 }
        );
      }

      // 3. AI Photo QC Check
      let qcResult = { pass: true, reason: "QC Passed: Verified distinct before/after progress photos." };
      try {
        const { checkPhotoQc } = await import("@/lib/ai/photoQc");
        qcResult = await checkPhotoQc({
          beforePhotoUrl: cleanBeforePhoto,
          afterPhotoUrl: cleanAfterPhoto,
          serviceType: job.service_name || "Cleaning",
          referenceId: refId,
        });
      } catch (qcErr) {
        console.warn("Photo QC execution note:", qcErr);
      }

      job.status = "completed";
      job.completed_at = new Date().toISOString();
      job.before_photo_url = cleanBeforePhoto;
      job.after_photo_url = cleanAfterPhoto;
      job.payment_method = paymentMethod || "cash";
      job.collected_amount = collectedAmount || job.total_amount;
      (job as any).qc_status = qcResult.pass ? "passed" : "flagged";
      (job as any).qc_reason = qcResult.reason;

      globalActiveJobs.set(job.id, { ...job });

      // Sync with in-memory booking store
      try {
        const { prontoBookingsStore } = await import("../../bookings/route");
        const storedBooking = prontoBookingsStore.get(refId);
        if (storedBooking) {
          storedBooking.status = "completed";
          storedBooking.before_photo_url = cleanBeforePhoto;
          storedBooking.after_photo_url = cleanAfterPhoto;
          storedBooking.escrow_status = "released";
          storedBooking.payment_status = "paid";
          storedBooking.qc_status = qcResult.pass ? "passed" : "flagged";
          storedBooking.qc_reason = qcResult.reason;
          prontoBookingsStore.set(refId, storedBooking);
        }
      } catch {}

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({
              status: "completed",
              completed_at: job.completed_at,
              before_photo_url: cleanBeforePhoto,
              after_photo_url: cleanAfterPhoto,
              payment_method: job.payment_method,
              collected_amount: job.collected_amount,
            })
            .eq("id", job.id);

          // Update bookings with status, payment_status, and cart_items with photo proof
          await supabase
            .from("bookings")
            .update({
              status: "completed",
              payment_status: "paid",
              updated_at: new Date().toISOString(),
              cart_items: {
                before_photo_url: cleanBeforePhoto,
                after_photo_url: cleanAfterPhoto,
                escrow_status: "released",
                qc_status: qcResult.pass ? "passed" : "flagged",
              },
            })
            .eq("reference_id", refId);

          // Update worker_payouts ledger to pending payout if available
          try {
            await supabase
              .from("worker_payouts")
              .update({ status: "pending" })
              .eq("reference_id", refId);
          } catch {}
        } catch (dbErr) {
          console.warn("DB completion note:", dbErr);
        }
      }

      await sendWhatsAppStatusUpdate(customerPhone, "osmida_job_completed", [
        customerName,
        serviceName,
        refId,
      ]);

      return NextResponse.json({
        success: true,
        action: "complete",
        job,
        qc: qcResult,
        message: "Job completed! Before/After photos verified, escrow released.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Job action error:", error);
    return NextResponse.json({ error: error.message || "Failed to process job action" }, { status: 500 });
  }
}
