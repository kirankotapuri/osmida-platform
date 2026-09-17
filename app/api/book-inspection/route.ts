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
    const { error: dbError } = await supabase
      .from("inspections")
      .insert({
        reference_id: referenceId,
        facility_type: facilityType,
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
        contact_consent: contactConsent,
        business_name: businessName.trim(),
        whatsapp_number: whatsappNumber,
      });

    if (dbError) {
      return NextResponse.json({ error: `SUPABASE ERROR: ${dbError.message || dbError.code}` }, { status: 500 });
    }

    const n8nWebhookUrl = process.env.N8N_INSPECTION_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
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