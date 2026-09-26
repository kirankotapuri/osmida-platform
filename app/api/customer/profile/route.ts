import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { osmidaBookingsStore } from "@/app/api/bookings/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory profile store for zero-latency fallback (keyed by phone or email)
const customerProfilesStore: Map<string, any> = new Map();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");

    const cleanPhone = phone ? String(phone).replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";

    if (!cleanPhone && !cleanEmail) {
      return NextResponse.json(
        { error: "A valid phone number or email address is required" },
        { status: 400 }
      );
    }

    // 1. Check in-memory store
    let profile = (cleanPhone && customerProfilesStore.get(cleanPhone)) ||
                  (cleanEmail && customerProfilesStore.get(cleanEmail)) || null;

    // 2. Query Supabase customer_profiles table directly
    const supabase = getSupabaseClient();
    if (!profile && supabase) {
      try {
        let profileQuery = supabase.from("customer_profiles").select("*");
        if (cleanEmail) {
          profileQuery = profileQuery.eq("email", cleanEmail);
        } else if (cleanPhone) {
          profileQuery = profileQuery.eq("phone", cleanPhone);
        }

        const { data: dbProfile, error: profileErr } = await profileQuery.maybeSingle();

        if (dbProfile && !profileErr) {
          profile = {
            id: dbProfile.id,
            name: dbProfile.name || (cleanEmail ? cleanEmail.split("@")[0] : "Resident"),
            phone: dbProfile.phone || cleanPhone || "",
            email: dbProfile.email || cleanEmail || "",
            avatar: dbProfile.avatar_url || "",
            locality: dbProfile.locality || "Haranathapuram",
            apartmentName: dbProfile.apartment_name || "",
            flatNumber: dbProfile.flat_number || "",
            towerBlock: dbProfile.tower_block || "",
            address: dbProfile.address || "",
            googleMapsUrl: dbProfile.google_maps_url || null,
            updatedAt: dbProfile.updated_at,
          };
          if (cleanPhone) customerProfilesStore.set(cleanPhone, profile);
          if (cleanEmail) customerProfilesStore.set(cleanEmail, profile);
        }
      } catch (err) {
        console.warn("customer_profiles query note:", err);
      }
    }

    // 3. Fallback: Query Supabase for latest booking to extract profile if not found
    if (!profile && supabase) {
      try {
        let query = supabase.from("bookings").select("*");
        if (cleanPhone) {
          query = query.ilike("phone", `%${cleanPhone}%`);
        } else if (cleanEmail) {
          query = query.ilike("notes", `%${cleanEmail}%`);
        }

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          const cart = data.cart_items && typeof data.cart_items === "object" ? data.cart_items : {};
          profile = {
            name: data.customer_name || data.contact_person || (cleanEmail ? cleanEmail.split("@")[0] : ""),
            phone: data.phone || cleanPhone || "",
            email: cleanEmail || cart.customer_email || "",
            locality: data.locality || "Haranathapuram",
            apartmentName: data.apartment_name || cart.apartment_name || "",
            flatNumber: data.flat_number || cart.flat_number || "",
            towerBlock: data.tower_block || cart.tower_block || "",
            address: data.address || data.site_address || "",
            googleMapsUrl: cart.google_maps_url || null,
            lastBookingDate: data.created_at,
          };

          if (cleanPhone) customerProfilesStore.set(cleanPhone, profile);
          if (cleanEmail) customerProfilesStore.set(cleanEmail, profile);
        }
      } catch (dbErr) {
        console.warn("DB profile lookup fallback note:", dbErr);
      }
    }

    // 4. Fallback: Check in-memory osmidaBookingsStore
    if (!profile) {
      for (const [_, b] of osmidaBookingsStore.entries()) {
        const bPhone = String(b.phone || b.customer_phone || "").replace(/\D/g, "").slice(-10);
        const bNotes = String(b.notes || "").toLowerCase();
        const matches = (cleanPhone && bPhone === cleanPhone) || (cleanEmail && bNotes.includes(cleanEmail));

        if (matches) {
          profile = {
            name: b.customer_name || b.contact_person || (cleanEmail ? cleanEmail.split("@")[0] : ""),
            phone: b.phone || cleanPhone || "",
            email: cleanEmail || "",
            locality: b.locality || "Haranathapuram",
            apartmentName: b.apartment_name || "",
            flatNumber: b.flat_number || "",
            towerBlock: b.tower_block || "",
            address: b.address || b.site_address || "",
            googleMapsUrl: b.google_maps_url || null,
            lastBookingDate: b.created_at,
          };
          if (cleanPhone) customerProfilesStore.set(cleanPhone, profile);
          if (cleanEmail) customerProfilesStore.set(cleanEmail, profile);
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
      id,
      name,
      phone,
      email,
      avatar,
      locality,
      apartmentName,
      flatNumber,
      towerBlock,
      address,
      googleMapsUrl,
    } = body;

    const cleanPhone = phone ? String(phone).replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";

    if (!cleanPhone && !cleanEmail && !id) {
      return NextResponse.json(
        { error: "A valid phone number or email address is required" },
        { status: 400 }
      );
    }

    const updatedProfile = {
      name: String(name || "").trim() || (cleanEmail ? cleanEmail.split("@")[0] : "Resident"),
      phone: cleanPhone || "",
      email: cleanEmail || "",
      avatar: avatar || null,
      locality: String(locality || "Haranathapuram").trim(),
      apartmentName: String(apartmentName || "").trim(),
      flatNumber: String(flatNumber || "").trim(),
      towerBlock: String(towerBlock || "").trim(),
      address: String(address || "").trim(),
      googleMapsUrl: googleMapsUrl || null,
      updatedAt: new Date().toISOString(),
    };

    if (cleanPhone) customerProfilesStore.set(cleanPhone, updatedProfile);
    if (cleanEmail) customerProfilesStore.set(cleanEmail, updatedProfile);

    // Save/Upsert directly to Supabase customer_profiles table
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload: Record<string, any> = {
          name: updatedProfile.name,
          phone: updatedProfile.phone || null,
          email: updatedProfile.email || null,
          avatar_url: updatedProfile.avatar,
          locality: updatedProfile.locality,
          apartment_name: updatedProfile.apartmentName || null,
          flat_number: updatedProfile.flatNumber || null,
          tower_block: updatedProfile.towerBlock || null,
          address: updatedProfile.address || null,
          google_maps_url: updatedProfile.googleMapsUrl,
          updated_at: new Date().toISOString(),
        };
        if (id) {
          payload.id = id;
        }

        // Upsert by id or by email
        const onConflictField = id ? "id" : cleanEmail ? "email" : "phone";
        await supabase.from("customer_profiles").upsert(payload, { onConflict: onConflictField });
      } catch (dbErr) {
        console.warn("Supabase customer_profiles upsert note:", dbErr);
      }
    }

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
