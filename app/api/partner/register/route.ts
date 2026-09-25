import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory workers store for demo / local execution
export const prontoWorkersStore: Map<string, any> = new Map([
  [
    "9490122849",
    {
      id: "w-sujatha-01",
      name: "Sujatha Reddy",
      phone: "9490122849",
      whatsapp_number: "9490122849",
      auth_pin: "1234",
      categories: ["cleaning"],
      skills: ["Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"],
      coverage_localities: ["Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"],
      assigned_hub: "Central",
      status: "online",
      approval_status: "active",
      rating: 4.9,
      completed_jobs_count: 142,
      payout_balance: 4200,
      upi_id: "sujatha@okaxis",
      bank_account_no: "XXXXXX4812",
      bank_ifsc: "SBIN0001234",
      aadhaar_last4: "8891",
      selfie_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  ],
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      aadhaarNumber,
      aadhaarUrl,
      selfieUrl,
      upiId,
      bankAccountNo,
      bankIfsc,
      skills, // Array: ['Bathroom Cleaning', 'Kitchen Cleaning', 'Dishwashing', 'General House Help']
      pin,
    } = body;

    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    const cleanName = String(name || "").trim();

    if (!cleanName || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Full name and a valid 10-digit phone number are required" },
        { status: 400 }
      );
    }

    const workerId = `w-${Date.now().toString().slice(-6)}`;
    const newWorker = {
      id: workerId,
      name: cleanName,
      phone: cleanPhone,
      whatsapp_number: cleanPhone,
      auth_pin: pin || "1234",
      categories: ["cleaning"],
      skills: Array.isArray(skills) && skills.length > 0 ? skills : [
        "Bathroom Cleaning",
        "Kitchen Cleaning",
        "Dishwashing",
        "General House Help",
      ],
      coverage_localities: ["Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"],
      assigned_hub: "Central",
      status: "online",
      approval_status: "active", // Immediately active for seamless field testing
      rating: 5.0,
      completed_jobs_count: 0,
      payout_balance: 0,
      upi_id: upiId || `${cleanPhone}@upi`,
      bank_account_no: bankAccountNo || null,
      bank_ifsc: bankIfsc || null,
      aadhaar_last4: aadhaarNumber ? aadhaarNumber.slice(-4) : "1234",
      aadhaar_url: aadhaarUrl || null,
      selfie_url: selfieUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    prontoWorkersStore.set(cleanPhone, newWorker);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("service_partners").upsert({
          name: cleanName,
          phone: cleanPhone,
          whatsapp_number: cleanPhone,
          auth_pin: newWorker.auth_pin,
          skills: newWorker.skills,
          status: "online",
          approval_status: "active",
          upi_id: newWorker.upi_id,
          bank_account_no: newWorker.bank_account_no,
          bank_ifsc: newWorker.bank_ifsc,
          aadhaar_last4: newWorker.aadhaar_last4,
          aadhaar_url: newWorker.aadhaar_url,
          selfie_url: newWorker.selfie_url,
        });
      } catch (dbErr) {
        console.warn("DB partner registration note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      partner: newWorker,
      message: "Worker registered successfully! You can now accept residential jobs in Nellore.",
    });
  } catch (error) {
    console.error("Partner register error:", error);
    return NextResponse.json({ error: "Failed to register partner" }, { status: 500 });
  }
}
