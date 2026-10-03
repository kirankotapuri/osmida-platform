import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_APP_SETTINGS } from "@/lib/osmidaServices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

// In-memory fallback
let cachedLocations: string[] = [...DEFAULT_APP_SETTINGS.service_zones];

async function syncWithDatabase(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "service_area")
        .maybeSingle();

      if (data && !error && data.value) {
        let parsed = data.value;
        while (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            break;
          }
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedLocations = parsed.filter((z): z is string => typeof z === "string" && z.trim().length > 0);
        }
      }
    } catch (err) {
      console.warn("Locations sync error:", err);
    }
  }
  return cachedLocations;
}

async function saveToDatabase(locations: string[]) {
  cachedLocations = locations;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("admin_settings").upsert({
        key: "service_area",
        value: JSON.stringify(locations),
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Failed to persist locations in DB:", err);
    }
  }
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// GET: Fetch all active service locations
export async function GET() {
  try {
    const locations = await syncWithDatabase();
    return NextResponse.json(
      {
        success: true,
        locations,
        count: locations.length,
        city: "Nellore",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, locations: cachedLocations },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST: Add a new location or update whole list
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = await syncWithDatabase();

    if (Array.isArray(body.locations)) {
      // Overwrite full list
      const cleanList: string[] = Array.from(
        new Set<string>(
          body.locations
            .filter((l: any): l is string => typeof l === "string" && l.trim().length > 0)
            .map((l: string) => l.trim())
        )
      );
      await saveToDatabase(cleanList);
      return NextResponse.json(
        { success: true, locations: cleanList, message: "Locations updated successfully" },
        { headers: NO_CACHE_HEADERS }
      );
    }

    const newLoc = String(body.location || "").trim();
    if (!newLoc) {
      return NextResponse.json({ success: false, error: "Location name is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    if (current.some((l) => l.toLowerCase() === newLoc.toLowerCase())) {
      return NextResponse.json({ success: false, error: `Location "${newLoc}" already exists` }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const updated = [...current, newLoc];
    await saveToDatabase(updated);

    return NextResponse.json(
      {
        success: true,
        locations: updated,
        added: newLoc,
        message: `Location "${newLoc}" added successfully`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

// PUT: Rename / edit an existing location
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const oldLoc = String(body.oldLocation || "").trim();
    const newLoc = String(body.newLocation || "").trim();

    if (!oldLoc || !newLoc) {
      return NextResponse.json({ success: false, error: "Both oldLocation and newLocation are required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const current = await syncWithDatabase();
    const index = current.findIndex((l) => l.toLowerCase() === oldLoc.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ success: false, error: `Location "${oldLoc}" not found` }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    current[index] = newLoc;
    const cleanList: string[] = Array.from(new Set<string>(current));
    await saveToDatabase(cleanList);

    return NextResponse.json(
      {
        success: true,
        locations: cleanList,
        updated: { from: oldLoc, to: newLoc },
        message: `Location "${oldLoc}" updated to "${newLoc}"`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

// DELETE: Remove a location
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let locationToRemove = searchParams.get("location");

    if (!locationToRemove) {
      const body = await req.json().catch(() => ({}));
      locationToRemove = body.location;
    }

    const loc = String(locationToRemove || "").trim();
    if (!loc) {
      return NextResponse.json({ success: false, error: "Location to delete is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const current = await syncWithDatabase();
    const updated = current.filter((l) => l.toLowerCase() !== loc.toLowerCase());

    if (updated.length === current.length) {
      return NextResponse.json({ success: false, error: `Location "${loc}" not found` }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Cannot delete all locations. At least 1 service location must remain." }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await saveToDatabase(updated);

    return NextResponse.json(
      {
        success: true,
        locations: updated,
        deleted: loc,
        message: `Location "${loc}" removed successfully`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
