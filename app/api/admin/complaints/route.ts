import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prontoBookingsStore } from "../../bookings/route";

export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory mock complaints store for immediate testing
export const prontoComplaintsStore: Map<string, any> = new Map([
  [
    "cmp-sample-01",
    {
      id: "cmp-sample-01",
      reference_id: "OSM-PRN-9124",
      customer_name: "Sneha Latha",
      customer_phone: "9848011223",
      locality: "Haranathapuram, Nellore",
      apartment_name: "Sri Sai Residency, Flat 302",
      service_name: "Kitchen Cleaning + Bathroom Cleaning",
      complaint_text: "The worker missed the bathroom exhaust and sink backsplash. Requesting touchup redo.",
      complaint_photos: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80",
      ],
      complaint_status: "open", // open, refunded, partial, redo, dismissed
      resolution_action: null,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
]);

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    let complaints: any[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .neq("complaint_status", "none")
          .order("updated_at", { ascending: false });

        if (data && !error && data.length > 0) {
          complaints = data.map((b) => ({
            id: `cmp-${b.reference_id}`,
            reference_id: b.reference_id,
            customer_name: b.customer_name,
            customer_phone: b.phone,
            locality: b.locality,
            apartment_name: b.apartment_name ? `${b.apartment_name}, Flat ${b.flat_number || ""}` : b.site_address,
            service_name: b.selected_service,
            complaint_text: b.complaint_text,
            complaint_photos: b.complaint_photos || [],
            complaint_status: b.complaint_status,
            resolution_action: b.complaint_status,
            created_at: b.updated_at || b.created_at,
          }));
        }
      } catch (err) {
        console.warn("DB complaints fetch note:", err);
      }
    }

    // Merge in-memory complaints
    for (const [_, c] of prontoComplaintsStore.entries()) {
      if (!complaints.some((existing) => existing.reference_id === c.reference_id)) {
        complaints.unshift(c);
      }
    }

    // Also collect any complaints lodged in prontoBookingsStore
    for (const [_, b] of prontoBookingsStore.entries()) {
      if (b.complaint_status && b.complaint_status !== "none") {
        if (!complaints.some((c) => c.reference_id === b.reference_id)) {
          complaints.unshift({
            id: `cmp-${b.reference_id}`,
            reference_id: b.reference_id,
            customer_name: b.customer_name,
            customer_phone: b.phone,
            locality: b.locality,
            apartment_name: b.apartment_name || b.site_address,
            service_name: b.selected_service,
            complaint_text: b.complaint_text,
            complaint_photos: b.complaint_photos || [],
            complaint_status: b.complaint_status,
            resolution_action: null,
            created_at: b.updated_at || b.created_at,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Complaints GET error:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referenceId, resolutionAction, adminNotes } = body;
    // resolutionAction: 'refund' | 'partial' | 'redo' | 'dismiss'

    if (!referenceId || !resolutionAction) {
      return NextResponse.json(
        { error: "referenceId and resolutionAction are required" },
        { status: 400 }
      );
    }

    const validActions = ["refund", "partial", "redo", "dismiss"];
    if (!validActions.includes(resolutionAction)) {
      return NextResponse.json(
        { error: `Invalid resolution action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from("bookings")
          .update({
            complaint_status: resolutionAction,
            escrow_status: resolutionAction === "refund" ? "refunded" : "released",
            status: resolutionAction === "redo" ? "assigned" : "completed",
            notes: adminNotes || `Complaint resolved with action: ${resolutionAction}`,
            updated_at: new Date().toISOString(),
          })
          .eq("reference_id", referenceId);
      } catch (err) {
        console.warn("DB complaint resolution note:", err);
      }
    }

    // Update in-memory stores
    for (const [id, c] of prontoComplaintsStore.entries()) {
      if (c.reference_id === referenceId) {
        c.complaint_status = resolutionAction;
        c.resolution_action = resolutionAction;
        prontoComplaintsStore.set(id, c);
      }
    }

    const booking = prontoBookingsStore.get(referenceId);
    if (booking) {
      booking.complaint_status = resolutionAction;
      booking.escrow_status = resolutionAction === "refund" ? "refunded" : "released";
      booking.status = resolutionAction === "redo" ? "assigned" : "completed";
      prontoBookingsStore.set(referenceId, booking);
    }

    return NextResponse.json({
      success: true,
      message: `Complaint for ${referenceId} successfully resolved with action: ${resolutionAction.toUpperCase()}`,
      resolutionAction,
    });
  } catch (error) {
    console.error("Complaint resolution error:", error);
    return NextResponse.json({ error: "Failed to resolve complaint" }, { status: 500 });
  }
}
