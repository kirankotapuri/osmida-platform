import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_APP_SETTINGS } from "@/lib/prontoServices";
import { globalActiveJobs } from "../partner/jobs/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory store for instant zero-latency demo / local fallback
export const prontoBookingsStore: Map<string, any> = new Map();

// Helper to generate 4-digit numeric OTP
function generate4DigitOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      selectedServices, // string[]: ['bathroom_cleaning', 'kitchen_cleaning', ...]
      durationHours, // number: 1.0, 1.5, 2.0
      customerName,
      customerPhone,
      locality,
      apartmentName,
      flatNumber,
      towerBlock,
      address,
      bookingType, // 'instant', 'scheduled', 'recurring'
      scheduledDate,
      timeSlot,
      notes,
      paymentMethod, // 'cash' or 'online'
      googleMapsUrl,
      bookingFor,
    } = body;

    const isOnlinePayment = String(paymentMethod || "").toLowerCase() === "online";
    const paymentMode = isOnlinePayment ? "online" : "cash";
    const cleanGoogleMapsUrl = googleMapsUrl || body.google_maps_url || null;
    const cleanBookingFor = bookingFor || body.booking_for || "self";

    const cleanPhone = String(customerPhone || body.phone || "").replace(/\D/g, "").slice(-10);
    const cleanName = String(customerName || body.name || "Resident").trim();
    const cleanLocality = String(locality || "Pogathota, Nellore").trim();
    const cleanServices = Array.isArray(selectedServices) && selectedServices.length > 0
      ? selectedServices
      : Array.isArray(body.services) && body.services.length > 0
      ? body.services
      : ["bathroom_cleaning"];
    const duration = Number(durationHours || body.duration) || 1.0;

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit WhatsApp phone number is required" },
        { status: 400 }
      );
    }

    // Reference ID & Dual OTP generation
    const referenceId = `OSM-PRN-${Date.now().toString().slice(-5)}`;
    const otpStart = generate4DigitOtp();
    const otpEnd = generate4DigitOtp();

    // Fetch dynamic hourly rate from request or settings
    const hourlyRate = Number(body.hourlyRate) || DEFAULT_APP_SETTINGS.hourly_rate;
    const workerPayoutRate = DEFAULT_APP_SETTINGS.worker_payout_rate;
    const totalAmount = Number(body.totalAmount) || Math.round(duration * hourlyRate);
    const workerPayoutAmount = Math.round(duration * workerPayoutRate);

    const fullAddress = [
      flatNumber ? `Flat #${flatNumber}` : null,
      towerBlock ? `Tower/Block ${towerBlock}` : null,
      apartmentName || null,
      address || null,
      cleanLocality,
    ]
      .filter(Boolean)
      .join(", ");

    // Build booking object
    const newBooking = {
      id: `bk-${referenceId}`,
      reference_id: referenceId,
      customer_name: cleanName,
      contact_person: cleanName,
      phone: cleanPhone,
      whatsapp_number: cleanPhone,
      business_name: cleanName,
      facility_type: "residential",
      selected_service: cleanServices.join(", "),
      selected_services: cleanServices,
      duration_hours: duration,
      hourly_rate: hourlyRate,
      total_amount: totalAmount,
      service_price: totalAmount,
      otp_start: otpStart,
      otp_end: otpEnd,
      status: "pending", // pending -> assigned -> in-progress -> completed
      payment_method: paymentMode,
      escrow_status: isOnlinePayment ? "pending_deposit" : "cash",
      payment_status: isOnlinePayment ? "online_pending" : "cash_pending",
      locality: cleanLocality,
      site_address: fullAddress,
      address: fullAddress,
      apartment_name: apartmentName || null,
      flat_number: flatNumber || null,
      tower_block: towerBlock || null,
      preferred_date: scheduledDate || new Date().toISOString().split("T")[0],
      inspection_date: scheduledDate || new Date().toISOString().split("T")[0],
      time_slot: timeSlot || (bookingType === "instant" ? "Within 60 mins" : "Morning (9 AM - 12 PM)"),
      booking_type: bookingType || "instant",
      booking_for: cleanBookingFor,
      google_maps_url: cleanGoogleMapsUrl,
      notes: notes || null,
      before_photo_url: null,
      after_photo_url: null,
      worker_id: null,
      worker_name: null,
      worker_phone: null,
      rating: null,
      review: null,
      complaint_text: null,
      complaint_photos: [],
      complaint_status: "none",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in-memory
    prontoBookingsStore.set(referenceId, newBooking);

    // Persist to Supabase if available
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fullPayload: Record<string, any> = {
          reference_id: referenceId,
          customer_name: cleanName,
          contact_person: cleanName,
          phone: cleanPhone,
          whatsapp_number: cleanPhone,
          business_name: cleanName,
          selected_service: cleanServices.join(", "),
          selected_services: cleanServices,
          duration_hours: duration,
          hourly_rate: hourlyRate,
          total_amount: totalAmount,
          service_price: totalAmount,
          otp_start: otpStart,
          otp_end: otpEnd,
          status: "pending",
          payment_method: paymentMode,
          escrow_status: isOnlinePayment ? "pending_deposit" : "cash",
          payment_status: isOnlinePayment ? "online_pending" : "cash_pending",
          locality: cleanLocality,
          site_address: fullAddress,
          address: fullAddress,
          apartment_name: apartmentName || null,
          flat_number: flatNumber || null,
          tower_block: towerBlock || null,
          google_maps_url: cleanGoogleMapsUrl,
          booking_for: cleanBookingFor,
          inspection_date: newBooking.inspection_date,
          time_slot: newBooking.time_slot,
          booking_type: newBooking.booking_type,
          notes: notes || null,
          cart_items: {
            otp_start: otpStart,
            otp_end: otpEnd,
            duration_hours: duration,
            hourly_rate: hourlyRate,
            total_amount: totalAmount,
            payment_method: paymentMode,
            payment_status: isOnlinePayment ? "online_pending" : "cash_pending",
            escrow_status: isOnlinePayment ? "pending_deposit" : "cash",
            apartment_name: apartmentName || null,
            flat_number: flatNumber || null,
            tower_block: towerBlock || null,
            google_maps_url: cleanGoogleMapsUrl,
            booking_for: cleanBookingFor,
          },
        };

        const { error: insertErr } = await supabase.from("bookings").insert(fullPayload);
        if (insertErr) {
          // Fallback to inserting with baseline schema (stores extended fields in cart_items)
          console.warn("Retrying booking insert with baseline schema fallback:", insertErr.message);
          await supabase.from("bookings").insert({
            reference_id: referenceId,
            customer_name: cleanName,
            contact_person: cleanName,
            phone: cleanPhone,
            whatsapp_number: cleanPhone,
            business_name: cleanName,
            selected_service: cleanServices.join(", "),
            service_price: totalAmount,
            total_amount: totalAmount,
            status: "pending",
            payment_method: paymentMode,
            payment_status: isOnlinePayment ? "online_pending" : "cash_pending",
            locality: cleanLocality,
            site_address: fullAddress,
            address: fullAddress,
            inspection_date: newBooking.inspection_date,
            time_slot: newBooking.time_slot,
            booking_type: newBooking.booking_type,
            notes: notes || null,
            cart_items: {
              otp_start: otpStart,
              otp_end: otpEnd,
              duration_hours: duration,
              hourly_rate: hourlyRate,
              total_amount: totalAmount,
              payment_method: paymentMode,
              payment_status: isOnlinePayment ? "online_pending" : "cash_pending",
              escrow_status: isOnlinePayment ? "pending_deposit" : "cash",
              apartment_name: apartmentName || null,
              flat_number: flatNumber || null,
              tower_block: towerBlock || null,
              google_maps_url: cleanGoogleMapsUrl,
              booking_for: cleanBookingFor,
            },
          });
        }

        // Insert into worker_payouts ledger if table exists
        await supabase.from("worker_payouts").insert({
          reference_id: referenceId,
          partner_name: "Unassigned Worker Pool",
          amount: workerPayoutAmount,
          status: "escrow_held",
        });
      } catch (dbErr) {
        console.warn("DB insert note for booking:", dbErr);
      }
    }

    // Automatically create a job offer in the Worker Job Feed (`partner_job_assignments`)
    // so any online worker in Nellore sees it immediately in their Job Feed
    const offeredJob = {
      id: `job-${referenceId}`,
      reference_id: referenceId,
      booking_id: newBooking.id,
      partner_id: "default-partner-pogathota", // Available to all nearby
      status: "offered",
      service_name: cleanServices.map((s: string) => s.replace(/_/g, " ")).join(" + "),
      category: "cleaning",
      customer_name: cleanName,
      customer_phone: cleanPhone,
      customer_address: fullAddress,
      locality: cleanLocality,
      date: newBooking.inspection_date,
      time_slot: newBooking.time_slot,
      duration_hours: duration,
      total_amount: totalAmount,
      payout_amount: workerPayoutAmount,
      start_otp: otpStart,
      end_otp: otpEnd,
      offered_at: new Date().toISOString(),
    };
    globalActiveJobs.set(offeredJob.id, offeredJob as any);

    if (supabase) {
      try {
        let validPartnerId: string | null = null;
        const { data: partnerRows } = await supabase
          .from("service_partners")
          .select("id")
          .limit(1);
        if (partnerRows && partnerRows.length > 0) {
          validPartnerId = partnerRows[0].id;
        }

        if (validPartnerId) {
          await supabase.from("partner_job_assignments").insert({
            reference_id: referenceId,
            partner_id: validPartnerId,
            status: "offered",
            service_name: offeredJob.service_name,
            customer_name: cleanName,
            customer_phone: cleanPhone,
            customer_address: fullAddress,
            locality: cleanLocality,
            payout_amount: workerPayoutAmount,
            start_otp: otpStart,
          });
        }
      } catch (assignErr) {
        console.warn("Non-fatal job assignment creation:", assignErr);
      }
    }

    // Trigger Multi-Channel Notifications (SMS + Email + Worker Web Push Dispatch)
    try {
      // 1. Worker Push Notification (FCM / Web Push)
      const { broadcastJobAlertPush } = await import("@/lib/notifications/webPush");
      broadcastJobAlertPush({
        jobId: offeredJob.id,
        referenceId,
        serviceName: offeredJob.service_name,
        locality: cleanLocality,
        payoutAmount: workerPayoutAmount,
      }).catch((err) => console.warn("Push broadcast note:", err.message));

      // 2. Customer SMS Confirmation (MSG91)
      const { sendBookingConfirmationSms } = await import("@/lib/sms/msg91");
      sendBookingConfirmationSms(cleanPhone, referenceId, offeredJob.service_name, newBooking.time_slot)
        .catch((err) => console.warn("Booking SMS note:", err.message));

      // 3. Admin Notification Email (Resend)
      const { sendAdminNewBookingAlert } = await import("@/lib/email/resend");
      sendAdminNewBookingAlert({
        referenceId,
        customerName: cleanName,
        customerPhone: cleanPhone,
        serviceName: offeredJob.service_name,
        locality: cleanLocality,
        amount: totalAmount,
        paymentMethod: paymentMode,
      }).catch((err) => console.warn("Admin Email alert note:", err.message));
    } catch (notifErr) {
      console.warn("Notification dispatch exception:", notifErr);
    }

    return NextResponse.json({
      success: true,
      referenceId,
      booking: newBooking,
      totalAmount,
      durationHours: duration,
      paymentMethod: paymentMode,
      paymentStatus: newBooking.payment_status,
      escrowStatus: newBooking.escrow_status,
      otpStart,
      otpEnd,
      trackingUrl: `/booking/${referenceId}`,
      message: "Booking confirmed! Worker is being assigned.",
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const phone = searchParams.get("phone");

    const supabase = getSupabaseClient();
    let bookings: any[] = [];

    if (supabase) {
      try {
        let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
        if (status && status !== "all") {
          query = query.eq("status", status);
        }
        if (phone) {
          query = query.eq("phone", phone);
        }
        const { data, error } = await query;
        if (data && !error && data.length > 0) {
          bookings = data.map((b: any) => {
            if (b.cart_items && typeof b.cart_items === "object") {
              const cart = b.cart_items;
              return {
                ...b,
                otp_start: b.otp_start || cart.otp_start || b.start_otp,
                otp_end: b.otp_end || cart.otp_end || b.end_otp,
                start_otp: b.start_otp || cart.otp_start || b.otp_start,
                end_otp: b.end_otp || cart.otp_end || b.end_otp,
                duration_hours: b.duration_hours || cart.duration_hours || 1.0,
                hourly_rate: b.hourly_rate || cart.hourly_rate || 199,
                total_amount: b.total_amount || b.service_price || cart.total_amount || Math.round((b.duration_hours || cart.duration_hours || 1.0) * (b.hourly_rate || cart.hourly_rate || 199)),
                payment_method: b.payment_method || cart.payment_method || "cash",
                payment_status: b.payment_status || cart.payment_status || "cash_pending",
                escrow_status: b.escrow_status || cart.escrow_status || (b.payment_method === "online" ? "held" : "cash"),
                apartment_name: b.apartment_name || cart.apartment_name,
                before_photo_url: b.before_photo_url || cart.before_photo_url,
                after_photo_url: b.after_photo_url || cart.after_photo_url,
                qc_status: b.qc_status || cart.qc_status,
              };
            }
            return b;
          });
        }
      } catch (err) {
        console.warn("DB bookings fetch note:", err);
      }
    }

    // Merge with in-memory store
    for (const [_, b] of prontoBookingsStore.entries()) {
      if (!bookings.some((existing) => existing.reference_id === b.reference_id)) {
        if (!status || status === "all" || b.status === status) {
          if (!phone || b.phone === phone) {
            bookings.unshift(b);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
