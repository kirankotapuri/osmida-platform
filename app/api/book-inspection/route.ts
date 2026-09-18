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
    } = body;

    if (
      typeof businessName !== "string" ||
      !businessName.trim() ||
      typeof contactPerson !== "string" ||
      !contactPerson.trim() ||
      typeof siteAddress !== "string" ||
      !siteAddress.trim() ||
      contactConsent !== true ||
      typeof whatsappNumber !== "string" ||
      !/^\d{10}$/.test(whatsappNumber) ||
      typeof locality !== "string" ||
      !locality.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase server configuration is missing");
      return NextResponse.json({ error: "Lead storage is not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fullPayload: Record<string, any> = {
      reference_id: referenceId,
      facility_type: facilityType || "residential",
      selected_service: selectedService,
      locality: locality.trim(),
      time_slot: timeSlot || null,
      inspection_date: inspectionDate || null,
      site_address: siteAddress.trim(),
      contact_person: contactPerson.trim(),
      service_urgency: serviceUrgency || null,
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
      total_amount: typeof totalAmount === "number" ? totalAmount : totalAmount ? parseInt(String(totalAmount), 10) : null,
      advance_amount: typeof advanceAmount === "number" ? advanceAmount : 0,
      booking_type: bookingType || (cartItems && cartItems.length > 0 ? "cart_order" : "inspection"),
      category: category || null,
      payment_status: paymentStatus || "pending",
      contact_consent: contactConsent,
      business_name: businessName.trim(),
      whatsapp_number: whatsappNumber,
    };

    let { error: dbError } = await supabase.from("inspections").insert(fullPayload);

    // Fallback: If schema migration hasn't been applied yet and extended columns don't exist in Supabase
    if (dbError && dbError.message && dbError.message.includes("does not exist")) {
      console.warn("Supabase schema column missing, falling back to baseline schema:", dbError.message);
      const baselinePayload: Record<string, any> = {
        reference_id: referenceId,
        facility_type: facilityType || "residential",
        selected_service: selectedService,
        locality: locality.trim(),
        time_slot: timeSlot || null,
        inspection_date: inspectionDate || null,
        site_address: siteAddress.trim(),
        contact_person: contactPerson.trim(),
        service_urgency: serviceUrgency || null,
        floor_area: floorArea || null,
        notes: [
          notes || "",
          acDetails ? `[AC: ${JSON.stringify(acDetails)}]` : "",
          cartItems ? `[Cart: ${JSON.stringify(cartItems)}]` : "",
        ].filter(Boolean).join(" | "),
        main_pest_issue: mainPestIssue || null,
        pest_premises_type: pestPremisesType || null,
        approximate_size: approximateSize || null,
        pest_details: pestDetails || null,
        kitchen_details: kitchenDetails || null,
        washroom_details: washroomDetails || null,
        contact_consent: contactConsent,
        business_name: businessName.trim(),
        whatsapp_number: whatsappNumber,
      };
      const retryResult = await supabase.from("inspections").insert(baselinePayload);
      dbError = retryResult.error;
    }

    if (dbError) {
      return NextResponse.json({ error: `SUPABASE ERROR: ${dbError.message || dbError.code}` }, { status: 500 });
    }

    // 2. Mirror into 'leads' table so submissions immediately show up in Supabase Table Editor -> leads
    try {
      await supabase.from("leads").insert({
        reference_id: referenceId,
        customer_name: contactPerson.trim(),
        contact_person: contactPerson.trim(),
        business_name: businessName.trim(),
        phone: whatsappNumber,
        whatsapp_number: whatsappNumber,
        facility_type: facilityType || "residential",
        selected_service: selectedService,
        locality: locality.trim(),
        site_address: siteAddress.trim(),
        address: siteAddress.trim(),
        time_slot: timeSlot || null,
        inspection_date: inspectionDate || null,
        service_urgency: serviceUrgency || null,
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
        total_amount: typeof totalAmount === "number" ? totalAmount : totalAmount ? parseInt(String(totalAmount), 10) : null,
        advance_amount: typeof advanceAmount === "number" ? advanceAmount : 0,
        booking_type: bookingType || (cartItems && cartItems.length > 0 ? "cart_order" : "inspection"),
        category: category || null,
        payment_status: paymentStatus || "pending",
        contact_consent: contactConsent,
        status: "new",
      });
    } catch (leadsErr) {
      console.warn("Non-fatal: leads mirror insert note:", leadsErr);
    }

    const n8nWebhookUrl = process.env.N8N_INSPECTION_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            facilityType: facilityType || "residential",
          }),
        });
        if (!response.ok) {
          console.error("n8n Dispatch Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("n8n Dispatch Error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      referenceId,
      message: "Inspection booked successfully",
    });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}