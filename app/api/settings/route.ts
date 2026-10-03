import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_APP_SETTINGS, OSMIDA_SERVICES } from "@/lib/osmidaServices";

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

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// In-memory fallback if Supabase table is pending migration
let cachedSettings = {
  hourly_rate: DEFAULT_APP_SETTINGS.hourly_rate,
  worker_payout_rate: DEFAULT_APP_SETTINGS.worker_payout_rate,
  service_city: DEFAULT_APP_SETTINGS.service_city,
  service_zones: [...DEFAULT_APP_SETTINGS.service_zones],
};

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("admin_settings").select("*");
        if (data && !error && data.length > 0) {
          const settingsMap: Record<string, any> = {};
          data.forEach((row) => {
            settingsMap[row.key] = row.value;
          });
          if (settingsMap.hourly_rate) {
            cachedSettings.hourly_rate = Number(settingsMap.hourly_rate);
          }
          if (settingsMap.worker_payout_rate) {
            cachedSettings.worker_payout_rate = Number(settingsMap.worker_payout_rate);
          }
          if (settingsMap.service_area) {
            let parsed = settingsMap.service_area;
            while (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch {
                break;
              }
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              cachedSettings.service_zones = parsed.filter((z): z is string => typeof z === "string" && z.trim().length > 0);
            }
          }
        }
      } catch (err) {
        console.warn("DB settings fetch fallback to cached:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        settings: cachedSettings,
        services: OSMIDA_SERVICES,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: true, settings: cachedSettings, services: OSMIDA_SERVICES },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { hourly_rate, worker_payout_rate, service_zones } = body;

    if (typeof hourly_rate === "number" && hourly_rate > 0) {
      cachedSettings.hourly_rate = hourly_rate;
    }
    if (typeof worker_payout_rate === "number" && worker_payout_rate > 0) {
      cachedSettings.worker_payout_rate = worker_payout_rate;
    }
    if (Array.isArray(service_zones)) {
      cachedSettings.service_zones = service_zones;
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        if (hourly_rate) {
          await supabase.from("admin_settings").upsert({
            key: "hourly_rate",
            value: JSON.stringify(hourly_rate),
            updated_at: new Date().toISOString(),
          });
        }
        if (worker_payout_rate) {
          await supabase.from("admin_settings").upsert({
            key: "worker_payout_rate",
            value: JSON.stringify(worker_payout_rate),
            updated_at: new Date().toISOString(),
          });
        }
        if (service_zones) {
          await supabase.from("admin_settings").upsert({
            key: "service_area",
            value: JSON.stringify(service_zones),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.warn("DB settings upsert warning:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        settings: cachedSettings,
        message: "Admin settings updated successfully",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
