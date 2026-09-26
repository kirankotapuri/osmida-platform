import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/my-bookings";

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      try {
        const { data } = await supabase.auth.exchangeCodeForSession(code);
        const user = data?.session?.user;
        const userEmail = user?.email || "";
        const userName =
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          (userEmail ? userEmail.split("@")[0] : "Resident");
        const userAvatar =
          user?.user_metadata?.avatar_url ||
          user?.user_metadata?.picture ||
          "";
        const userPhone =
          user?.phone ||
          user?.user_metadata?.phone ||
          "";

        const targetUrl = next.startsWith("http") ? next : `${origin}${next}`;
        
        // Escape parameters safely for client-side injection
        const safeProfile = JSON.stringify({
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          phone: userPhone,
          provider: "google",
        });

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Authenticating with Osmida...</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F4F8F8;">
              <div style="text-align:center;padding:24px;border-radius:16px;background:#ffffff;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:320px;width:90%;">
                <div style="width:48px;height:48px;margin:0 auto 16px;border-radius:12px;background:#0C6266;display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:24px;font-weight:900;">
                  O
                </div>
                <h2 style="color:#0F171A;font-size:16px;margin:0 0 6px 0;font-weight:800;">Welcome, ${userName.replace(/</g, "&lt;")}</h2>
                <p style="color:#475559;font-size:13px;margin:0 0 16px 0;">Syncing your Osmida account...</p>
                <div style="height:3px;background:#E1EBEB;border-radius:2px;overflow:hidden;position:relative;">
                  <div style="width:100%;height:100%;background:#0C6266;animation:shimmer 1s infinite;"></div>
                </div>
              </div>
              <script>
                (function() {
                  try {
                    var prof = ${safeProfile};
                    if (prof.email) localStorage.setItem("osmida_customer_email", prof.email);
                    if (prof.name) localStorage.setItem("osmida_customer_name", prof.name);
                    if (prof.avatar) localStorage.setItem("osmida_customer_avatar", prof.avatar);
                    if (prof.phone) localStorage.setItem("osmida_customer_phone", prof.phone);

                    // Merge into osmida_customer_profile
                    var existing = {};
                    try {
                      existing = JSON.parse(localStorage.getItem("osmida_customer_profile") || "{}");
                    } catch(e) {}
                    var merged = Object.assign({}, existing, prof);
                    localStorage.setItem("osmida_customer_profile", JSON.stringify(merged));

                    // Dispatch custom event for immediate UI sync across tabs/components
                    window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: merged }));
                  } catch(err) {
                    console.error("Storage error:", err);
                  }
                  setTimeout(function() {
                    window.location.replace("${targetUrl}");
                  }, 150);
                })();
              </script>
            </body>
          </html>
        `;
        return new NextResponse(html, {
          headers: { "Content-Type": "text/html" },
        });
      } catch (err) {
        console.error("OAuth code exchange error:", err);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
