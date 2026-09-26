import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoBookingsStore } from "../route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// Sample mock worker profile to show when worker is assigned
const SAMPLE_WORKER = {
  id: "w-sujatha-01",
  name: "Sujatha Reddy",
  phone: "+91 94901 22849",
  photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  rating: 4.9,
  completed_jobs: 142,
  skills: ["Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"],
  verified_aadhaar: true,
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const { referenceId } = await params;
    if (!referenceId) {
      return NextResponse.json({ error: "referenceId is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let booking = prontoBookingsStore.get(referenceId) || null;

    if (!booking && supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("reference_id", referenceId)
          .maybeSingle();
        if (data && !error) {
          booking = data;
          if (booking.cart_items && typeof booking.cart_items === "object") {
            const cart = booking.cart_items;
            booking = {
              ...booking,
              otp_start: booking.otp_start || cart.otp_start || booking.start_otp,
              otp_end: booking.otp_end || cart.otp_end || booking.end_otp,
              start_otp: booking.start_otp || cart.otp_start || booking.otp_start,
              end_otp: booking.end_otp || cart.otp_end || booking.end_otp,
              duration_hours: booking.duration_hours || cart.duration_hours || 1.0,
              hourly_rate: booking.hourly_rate || cart.hourly_rate || 199,
              total_amount: booking.total_amount || booking.service_price || cart.total_amount || Math.round((booking.duration_hours || cart.duration_hours || 1.0) * (booking.hourly_rate || cart.hourly_rate || 199)),
              payment_method: booking.payment_method || cart.payment_method || "cash",
              payment_status: booking.payment_status || cart.payment_status || "cash_pending",
              escrow_status: booking.escrow_status || cart.escrow_status || (booking.payment_method === "online" ? "held" : "cash"),
              apartment_name: booking.apartment_name || cart.apartment_name,
              before_photo_url: booking.before_photo_url || cart.before_photo_url,
              after_photo_url: booking.after_photo_url || cart.after_photo_url,
              qc_status: booking.qc_status || cart.qc_status,
            };
          }
        }
      } catch (err) {
        console.warn("DB booking lookup warning:", err);
      }
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure math tally fields are always resolved numbers
    const resolvedDuration = Number(booking.duration_hours) || 1.0;
    const resolvedRate = Number(booking.hourly_rate) || 199;
    const resolvedTotal = Number(booking.total_amount) || Number(booking.service_price) || Math.round(resolvedDuration * resolvedRate);
    booking.duration_hours = resolvedDuration;
    booking.hourly_rate = resolvedRate;
    booking.total_amount = resolvedTotal;
    booking.payment_method = booking.payment_method || "cash";

    // Attach worker details if assigned or simulated
    const worker = booking.worker_id || booking.status !== "pending" ? {
      name: booking.worker_name || SAMPLE_WORKER.name,
      phone: booking.worker_phone || SAMPLE_WORKER.phone,
      photo: SAMPLE_WORKER.photo,
      rating: SAMPLE_WORKER.rating,
      completed_jobs: SAMPLE_WORKER.completed_jobs,
      verified_aadhaar: SAMPLE_WORKER.verified_aadhaar,
    } : null;

    return NextResponse.json({
      success: true,
      booking,
      worker,
    });
  } catch (error) {
    console.error("Booking detail GET error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const { referenceId } = await params;
    const body = await req.json();
    const {
      action, // 'release_payment', 'submit_rating', 'lodge_complaint', 'assign_worker'
      otpEnd,
      rating,
      review,
      complaintText,
      complaintPhotos,
      workerId,
      workerName,
      workerPhone,
    } = body;

    let booking = prontoBookingsStore.get(referenceId);
    const supabase = getSupabaseClient();

    if (!booking && supabase) {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("reference_id", referenceId)
          .maybeSingle();
        if (data) booking = data;
      } catch {}
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // 1. ACTION: Customer confirms completion / releases payment
    if (action === "release_payment") {
      const cleanOtp = String(otpEnd || "").trim();
      const expectedOtp = String(booking.otp_end || "").trim();

      // Verify OTP-end if provided
      if (cleanOtp && cleanOtp !== expectedOtp) {
        return NextResponse.json(
          { error: `Invalid End OTP '${cleanOtp}'. Please check the 4-digit code provided on your screen.` },
          { status: 400 }
        );
      }

      updates.status = "completed";
      updates.escrow_status = "released";
      updates.payment_status = "pending_payout";

      booking.status = "completed";
      booking.escrow_status = "released";
      booking.payment_status = "pending_payout";

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
          // Release worker payout in ledger
          await supabase
            .from("worker_payouts")
            .update({ status: "pending" })
            .eq("reference_id", referenceId);
        } catch (dbErr) {
          console.warn("DB release update error:", dbErr);
        }
      }

      // Execute Razorpay Route transfer to worker's linked account (Split Payment Escrow)
      if (booking.razorpay_payment_id) {
        try {
          const { transferWorkerPayoutViaRoute } = await import("@/lib/payments/razorpay");
          const payoutAmount = Math.round((booking.duration_hours || 1) * 140);
          const workerAccountId = booking.worker_account_id || "acc_default_worker_nel";
          await transferWorkerPayoutViaRoute({
            paymentId: booking.razorpay_payment_id,
            workerAccountId,
            payoutAmountInRupees: payoutAmount,
            referenceId,
          });
        } catch (routeErr) {
          console.warn("Razorpay Route transfer note:", routeErr);
        }
      }

      // Dispatch Customer Receipt Email via Resend if email is present
      try {
        const email = booking.customer_email || booking.email;
        if (email) {
          const { sendCustomerReceiptEmail } = await import("@/lib/email/resend");
          sendCustomerReceiptEmail({
            customerEmail: email,
            customerName: booking.customer_name || "Customer",
            referenceId,
            serviceName: booking.selected_service || "Home Cleaning",
            partnerName: booking.worker_name || "Assigned Partner",
            amountPaid: booking.total_amount || 199,
            paymentMethod: booking.payment_method || "online",
          }).catch(() => {});
        }
      } catch {}

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "release_payment",
        message: "Payment successfully released! Funds added to worker's pending payout queue.",
        booking: { ...booking, ...updates },
      });
    }

    // 2. ACTION: Submit Rating & Review
    if (action === "submit_rating") {
      const cleanRating = Number(rating) || 5;
      updates.rating = cleanRating;
      updates.review = review || null;

      booking.rating = cleanRating;
      booking.review = review || null;

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
        } catch {}
      }

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "submit_rating",
        message: "Thank you! Your rating and feedback have been recorded.",
        booking: { ...booking, ...updates },
      });
    }

    // 3. ACTION: Lodge a Complaint
    if (action === "lodge_complaint") {
      if (!complaintText) {
        return NextResponse.json({ error: "Complaint description is required" }, { status: 400 });
      }

      updates.complaint_text = complaintText;
      updates.complaint_photos = complaintPhotos || [];
      updates.complaint_status = "open";
      updates.status = "disputed";

      booking.complaint_text = complaintText;
      booking.complaint_photos = complaintPhotos || [];
      booking.complaint_status = "open";
      booking.status = "disputed";

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
        } catch {}
      }

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "lodge_complaint",
        message: "Complaint registered. Our Nellore operations team will resolve within 2 hours.",
        booking: { ...booking, ...updates },
      });
    }

    // 4. ACTION: Assign Worker (by Admin)
    if (action === "assign_worker") {
      updates.worker_id = workerId || "default-worker";
      updates.worker_name = workerName || "Sujatha Reddy";
      updates.worker_phone = workerPhone || "+91 94901 22849";
      updates.status = "assigned";

      booking.worker_id = updates.worker_id;
      booking.worker_name = updates.worker_name;
      booking.worker_phone = updates.worker_phone;
      booking.status = "assigned";

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
        } catch {}
      }

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "assign_worker",
        message: `Worker ${updates.worker_name} assigned to booking ${referenceId}.`,
        booking: { ...booking, ...updates },
      });
    }

    // 5. ACTION: Cancel Booking (by Customer)
    if (action === "cancel_booking") {
      const reason = body.cancellationReason || "Customer requested cancellation";
      updates.status = "cancelled";
      updates.cancellation_reason = reason;
      updates.cancelled_at = new Date().toISOString();

      booking.status = "cancelled";
      booking.cancellation_reason = reason;
      booking.cancelled_at = updates.cancelled_at;

      // Free up partner job assignment if active
      try {
        const { globalActiveJobs } = await import("../../partner/jobs/route");
        for (const [id, job] of globalActiveJobs.entries()) {
          if (job.reference_id === referenceId) {
            job.status = "declined";
            globalActiveJobs.delete(id);
          }
        }
      } catch {}

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
          await supabase
            .from("partner_job_assignments")
            .update({ status: "declined" })
            .eq("reference_id", referenceId);
        } catch (dbErr) {
          console.warn("DB cancel booking error:", dbErr);
        }
      }

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "cancel_booking",
        message: "Booking cancelled successfully. Zero cancellation fee applied.",
        booking: { ...booking, ...updates },
      });
    }

    // 6. ACTION: Add Extra Time (+30 Mins / +1 Hour)
    if (action === "add_extra_time" || action === "add_time") {
      const extraMinutes = Number(body.extraMinutes) || 30;
      const extraHours = extraMinutes / 60;
      const extraCost = extraMinutes === 30 ? 99 : Math.round(extraHours * 199);
      const extraPayout = Math.round(extraCost * 0.7);

      const newTotal = (Number(booking.total_amount) || 199) + extraCost;
      const newDuration = (Number(booking.duration_hours) || 1.0) + extraHours;

      updates.total_amount = newTotal;
      updates.duration_hours = newDuration;
      updates.service_price = newTotal;

      booking.total_amount = newTotal;
      booking.duration_hours = newDuration;
      booking.service_price = newTotal;

      // Sync active job feed for partner
      try {
        const { globalActiveJobs } = await import("../../partner/jobs/route");
        for (const [id, job] of globalActiveJobs.entries()) {
          if (job.reference_id === referenceId) {
            job.total_amount = newTotal;
            job.payout_amount = (Number(job.payout_amount) || 140) + extraPayout;
            (job as any).duration_hours = newDuration;
            globalActiveJobs.set(id, { ...job });
          }
        }
      } catch {}

      if (supabase) {
        try {
          await supabase.from("bookings").update(updates).eq("reference_id", referenceId);
          await supabase
            .from("partner_job_assignments")
            .update({ payout_amount: Math.round(newTotal * 0.7) })
            .eq("reference_id", referenceId);
        } catch (dbErr) {
          console.warn("DB add_extra_time error:", dbErr);
        }
      }

      prontoBookingsStore.set(referenceId, { ...booking, ...updates });

      return NextResponse.json({
        success: true,
        action: "add_extra_time",
        message: `Added +${extraMinutes} mins extra work (+₹${extraCost}). New total: ₹${newTotal}.`,
        booking: { ...booking, ...updates },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Booking detail PATCH error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
