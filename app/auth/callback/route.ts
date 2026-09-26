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
        const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split("@")[0];

        const targetUrl = next.startsWith("http") ? next : `${origin}${next}`;
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Authenticating...</title>
            </head>
            <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F4F8F8;">
              <div style="text-align:center;">
                <p style="color:#0C6266;font-weight:bold;">Logging in to Osmida...</p>
              </div>
              <script>
                try {
                  if ("${userEmail}") localStorage.setItem("osmida_customer_email", "${userEmail}");
                  if ("${userName}") localStorage.setItem("osmida_customer_name", "${userName}");
                } catch(e) {}
                window.location.replace("${targetUrl}");
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
