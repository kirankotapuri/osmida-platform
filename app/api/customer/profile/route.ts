import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoBookingsStore } from "@/app/api/bookings/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory profile store for zero-latency fallback
const customerProfilesStore: Map<string, any> = new Map();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // 1. Check in-memory store
    let profile = customerProfilesStore.get(cleanPhone) || null;

    // 2. Query Supabase for latest booking to extract profile if not found
    if (!profile) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .ilike("phone", `%${cleanPhone}%`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (data && !error) {
            const cart = data.cart_items && typeof data.cart_items === "object" ? data.cart_items : {};
            profile = {
              name: data.customer_name || data.contact_person || "",
              phone: cleanPhone,
              locality: data.locality || "Pogathota",
              apartmentName: data.apartment_name || cart.apartment_name || "",
              flatNumber: data.flat_number || cart.flat_number || "",
              towerBlock: data.tower_block || cart.tower_block || "",
              address: data.address || data.site_address || "",
              googleMapsUrl: cart.google_maps_url || null,
              lastBookingDate: data.created_at,
            };
            customerProfilesStore.set(cleanPhone, profile);
          }
        } catch (dbErr) {
          console.warn("DB profile lookup note:", dbErr);
        }
      }
    }

    // 3. Check in-memory prontoBookingsStore if still not found
    if (!profile) {
      for (const [_, b] of prontoBookingsStore.entries()) {
        const bPhone = String(b.phone || b.customer_phone || "").replace(/\D/g, "").slice(-10);
        if (bPhone === cleanPhone) {
          profile = {
            name: b.customer_name || b.contact_person || "",
            phone: cleanPhone,
            locality: b.locality || "Pogathota",
            apartmentName: b.apartment_name || "",
            flatNumber: b.flat_number || "",
            towerBlock: b.tower_block || "",
            address: b.address || b.site_address || "",
            googleMapsUrl: b.google_maps_url || null,
            lastBookingDate: b.created_at,
          };
          customerProfilesStore.set(cleanPhone, profile);
          break;
        }
      }
    }

    if (!profile) {
      return NextResponse.json({
        success: false,
        message: "No existing profile found. New customer.",
        profile: null,
      });
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("Customer profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      locality,
      apartmentName,
      flatNumber,
      towerBlock,
      address,
      googleMapsUrl,
    } = body;

    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "A valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    const updatedProfile = {
      name: String(name || "").trim(),
      phone: cleanPhone,
      locality: String(locality || "Pogathota").trim(),
      apartmentName: String(apartmentName || "").trim(),
      flatNumber: String(flatNumber || "").trim(),
      towerBlock: String(towerBlock || "").trim(),
      address: String(address || "").trim(),
      googleMapsUrl: googleMapsUrl || null,
      updatedAt: new Date().toISOString(),
    };

    customerProfilesStore.set(cleanPhone, updatedProfile);

    return NextResponse.json({
      success: true,
      message: "Customer profile and address saved successfully",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Customer profile POST error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
