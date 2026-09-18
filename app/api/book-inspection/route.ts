import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      referenceId,
      facilityType,
      selectedService,
      locality,
      timeSlot,
      inspectionDate,
      preferredDate,
      siteAddress,
      contactPerson,
      contactConsent,
      serviceUrgency,
      floorArea,
      notes,
      mainPestIssue,
      pestPremisesType,
      approximateSize,
      pestDetails,
      kitchenDetails,
      washroomDetails,
      acDetails,
      cleaningDetails,
      cartItems,
      totalAmount,
      advanceAmount,
      bookingType,
      category,
      paymentStatus,
      businessName,
      whatsappNumber,
      servicePrice,
    } = body;

    const refId = (referenceId || `OSM-${Date.now().toString().slice(-6)}`).trim();
    const cleanPhone = String(whatsappNumber || body.phone || "").replace(/\D/g, "").slice(-10);
    const bName = String(businessName || body.customerName || contactPerson || "").trim();
    const cPerson = String(contactPerson || bName).trim();
    const sAddress = String(siteAddress || body.address || "").trim();
    const loc = String(locality || "").trim();
    const fType = String(facilityType || "residential").trim();
    const sService = String(selectedService || "General Inspection").trim();

    if (
      !bName ||
      !cPerson ||
      !sAddress ||
      !loc ||
      cleanPhone.length !== 10 ||
      contactConsent !== true
    ) {
      return NextResponse.json(
        { error: "Missing required fields (businessName, contactPerson, siteAddress, locality, 10-digit whatsappNumber, contactConsent)" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    const n8nPayload = {
      referenceId: refId,
      businessName: bName,
      contactPerson: cPerson,
      customerName: cPerson,
      whatsappNumber: cleanPhone,
      phone: cleanPhone,
      facilityType: fType,
      selectedService: sService,
      servicePrice: servicePrice || totalAmount || null,
      locality: loc,
      siteAddress: sAddress,
      address: sAddress,
      inspectionDate: inspectionDate || null,
      preferredDate: preferredDate || inspectionDate || null,
      timeSlot: timeSlot || null,
      serviceUrgency: serviceUrgency || null,
      floorArea: floorArea || null,
      notes: notes || null,
      mainPestIssue: mainPestIssue || null,
      pestPremisesType: pestPremisesType || null,
      approximateSize: approximateSize || null,
      pestDetails: pestDetails || null,
      kitchenDetails: kitchenDetails || null,
      washroomDetails: washroomDetails || null,
      acDetails: acDetails || null,
      cleaningDetails: cleaningDetails || null,
      cartItems: cartItems || null,
      totalAmount: typeof totalAmount === "number" ? totalAmount : null,
      advanceAmount: typeof advanceAmount === "number" ? advanceAmount : 0,
      contactConsent: true,
      bookingType: bookingType || (cartItems && cartItems.length > 0 ? "cart_order" : "inspection"),
      category: category || null,
    };

    let n8nSuccess = false;
    const n8nWebhookUrl = process.env.N8N_INSPECTION_WEBHOOK_URL;

    // 1. Primary Ingestion: Dispatch to n8n Webhook
    // In n8n Workflow 1: Deduplication -> Insert into public.leads -> WhatsApp Customer & Admin Notifications
    if (n8nWebhookUrl) {
      try {
        const n8nRes = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(n8nPayload),
        });

        if (n8nRes.ok) {
          n8nSuccess = true;
        } else {
          console.error("n8n Webhook returned status:", n8nRes.status, n8nRes.statusText);
        }
      } catch (n8nErr) {
        console.error("n8n Dispatch Fetch Error:", n8nErr);
      }
    }

    // 2. Database Synchronization & Resilient Fallback
    if (supabase) {
      if (n8nSuccess) {
        // n8n already created the lead row; enrich it with webapp-specific cart & service details
        try {
          await supabase
            .from("leads")
            .update({
              ac_details: acDetails || null,
              cleaning_details: cleaningDetails || null,
              cart_items: cartItems || null,
              total_amount: typeof totalAmount === "number" ? totalAmount : null,
              advance_amount: typeof advanceAmount === "number" ? advanceAmount : 0,
              booking_type: n8nPayload.bookingType,
              category: category || null,
              payment_status: paymentStatus || "pending",
            })
            .eq("reference_id", refId);
        } catch (enrichErr) {
          console.warn("Non-fatal: Lead enrichment note:", enrichErr);
        }
      } else {
        // Fallback: If n8n was offline or failed, insert directly into public.leads so no lead is ever lost
        console.warn("Falling back to direct Supabase leads insertion for ref:", refId);
        try {
          try {
            await supabase.from("osmida_processed_refs").insert({ reference_id: refId });
          } catch {}
          const { error: dbErr } = await supabase.from("leads").insert({
            reference_id: refId,
            customer_name: cPerson,
            contact_person: cPerson,
            business_name: bName,
            phone: cleanPhone,
            whatsapp_number: cleanPhone,
            facility_type: fType,
            selected_service: sService,
            service_price: servicePrice || totalAmount || null,
            preferred_date: preferredDate || inspectionDate || null,
            inspection_date: inspectionDate || null,
            time_slot: timeSlot || null,
            service_urgency: serviceUrgency || null,
            address: sAddress,
            site_address: sAddress,
            locality: loc,
            floor_area: floorArea || null,
            notes: notes || null,
            main_pest_issue: mainPestIssue || null,
            pest_premises_type: pestPremisesType || null,
            approximate_size: approximateSize || null,
            pest_details: pestDetails || null,
            kitchen_details: kitchenDetails || null,
            washroom_details: washroomDetails || null,
            ac_details: acDetails || null,
            cleaning_details: cleaningDetails || null,
            cart_items: cartItems || null,
            total_amount: typeof totalAmount === "number" ? totalAmount : null,
            advance_amount: typeof advanceAmount === "number" ? advanceAmount : 0,
            booking_type: n8nPayload.bookingType,
            category: category || null,
            payment_status: paymentStatus || "pending",
            contact_consent: true,
            status: "new",
          });

          if (dbErr) {
            console.error("Direct Supabase Insert Error:", dbErr);
          }
        } catch (directErr) {
          console.error("Direct Supabase Exception:", directErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      referenceId: refId,
      message: "Inspection / service booking received successfully",
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}