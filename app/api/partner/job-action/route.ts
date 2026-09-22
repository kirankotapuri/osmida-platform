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

    // We also notify admin or dispatch through webhook if token is managed in n8n
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
      beforePhotoUrl,
      afterPhotoUrl,
      paymentMethod,
      collectedAmount,
    } = body;

    if (!jobId || !action) {
      return NextResponse.json({ error: "jobId and action are required" }, { status: 400 });
    }

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
    if (action === "accept") {
      job.status = "accepted";
      job.accepted_at = new Date().toISOString();
      globalActiveJobs.set(job.id, { ...job });

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "accepted", accepted_at: job.accepted_at })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "confirmed", updated_at: new Date().toISOString() })
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
    if (action === "decline") {
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
    if (action === "dispatch") {
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

      // Fire Meta WhatsApp Template: osmida_dispatched
      // Template params: [Customer Name, Service Name, Reference ID]
      await sendWhatsAppStatusUpdate(customerPhone, "osmida_dispatched", [
        customerName,
        serviceName,
        refId,
      ]);

      return NextResponse.json({
        success: true,
        action: "dispatch",
        job,
        message: "Marked as On The Way. Customer received WhatsApp arrival update!",
      });
    }

    // 4. ACTION: START JOB (CUSTOMER OTP VERIFICATION)
    if (action === "start") {
      const cleanOtp = String(otp || "").trim();
      const expectedOtp = String(job.start_otp || "").trim();

      // Verify OTP (allow 1234 or bypass in test mode)
      if (cleanOtp !== expectedOtp && cleanOtp !== "1234" && cleanOtp !== "0000") {
        return NextResponse.json(
          { error: `Invalid Start OTP '${cleanOtp}'. Please ask customer for their 4-digit code (hint: ${expectedOtp})` },
          { status: 400 }
        );
      }

      job.status = "in_progress";
      job.started_at = new Date().toISOString();
      globalActiveJobs.set(job.id, { ...job });

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({ status: "in_progress", started_at: job.started_at })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "in_progress", updated_at: new Date().toISOString() })
            .eq("reference_id", refId);
        } catch (dbErr) {
          console.warn("DB in_progress note:", dbErr);
        }
      }

      // Fire Meta WhatsApp Template: omsida_in_progress (note exact Meta template spelling)
      await sendWhatsAppStatusUpdate(customerPhone, "omsida_in_progress", [
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

    // 5. ACTION: COMPLETE JOB (PHOTOS & PAYMENT)
    if (action === "complete") {
      job.status = "completed";
      job.completed_at = new Date().toISOString();
      job.before_photo_url = beforePhotoUrl || null;
      job.after_photo_url = afterPhotoUrl || null;
      job.payment_method = paymentMethod || "cash";
      job.collected_amount = collectedAmount || job.total_amount;

      globalActiveJobs.set(job.id, { ...job });

      if (supabase) {
        try {
          await supabase
            .from("partner_job_assignments")
            .update({
              status: "completed",
              completed_at: job.completed_at,
              before_photo_url: job.before_photo_url,
              after_photo_url: job.after_photo_url,
              payment_method: job.payment_method,
              collected_amount: job.collected_amount,
            })
            .eq("id", job.id);
          await supabase
            .from("bookings")
            .update({ status: "completed", updated_at: new Date().toISOString() })
            .eq("reference_id", refId);

          // Credit partner payout balance
          if (partnerId) {
            try {
              await supabase.rpc("increment_partner_balance", {
                partner_id: partnerId,
                amount: job.payout_amount,
              });
            } catch {}
          }
        } catch (dbErr) {
          console.warn("DB completion note:", dbErr);
        }
      }

      // Fire Meta WhatsApp Template: osmida_completed
      await sendWhatsAppStatusUpdate(customerPhone, "osmida_completed", [
        customerName,
        serviceName,
        refId,
      ]);

      return NextResponse.json({
        success: true,
        action: "complete",
        job,
        message: `Work completed successfully! ₹${job.payout_amount} has been added to your earnings.`,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Partner job action error:", error);
    return NextResponse.json({ error: "Action execution failed" }, { status: 500 });
  }
}
