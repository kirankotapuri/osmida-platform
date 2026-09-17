import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const businessName = typeof body.businessName === "string" ? body.businessName.trim() : "";
    const contactPerson = typeof body.contactPerson === "string" ? body.contactPerson.trim() : "";
    const whatsappNumber = typeof body.whatsappNumber === "string" ? body.whatsappNumber.replace(/\D/g, "") : "";
    const referenceId = typeof body.referenceId === "string" ? body.referenceId.trim() : null;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const reason = typeof body.reason === "string" ? body.reason.trim() : null;

    if (!businessName || !contactPerson || !/^\d{10}$/.test(whatsappNumber)) {
      return NextResponse.json({ error: "Business name, contact person, and a valid 10-digit WhatsApp number are required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Deletion requests are not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await supabase.from("data_deletion_requests").insert({
      reference_id: referenceId || null,
      business_name: businessName,
      contact_person: contactPerson,
      whatsapp_number: whatsappNumber,
      email,
      reason,
    });

    if (error) {
      console.error("Deletion request error:", error);
      return NextResponse.json({ error: "We could not save your deletion request" }, { status: 500 });
    }

    const deletionWebhookUrl = process.env.N8N_DATA_DELETION_WEBHOOK_URL;
    if (deletionWebhookUrl) {
      await fetch(deletionWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceId, businessName, contactPerson, whatsappNumber, email, reason }),
      }).catch((error) => console.error("Deletion webhook error:", error));
    }

    return NextResponse.json({ success: true, message: "Your deletion request has been received" });
  } catch (error) {
    console.error("Deletion API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}