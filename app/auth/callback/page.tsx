"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Authenticating with Google...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function processAuth() {
      try {
        const code = searchParams.get("code");
        const next = searchParams.get("next") || "/my-bookings";
        const errorDesc = searchParams.get("error_description") || searchParams.get("error");

        if (errorDesc) {
          if (isMounted) setErrorMsg(errorDesc);
          return;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          if (isMounted) setErrorMsg("Supabase credentials not configured in environment.");
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        let user: any = null;

        // 1. If code is present, exchange it in the browser (where PKCE verifier exists in localStorage)
        if (code) {
          if (isMounted) setStatusText("Verifying Google account authorization...");
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            console.warn("OAuth exchangeCodeForSession warning:", exchangeErr.message);
          }
          user = data?.session?.user || null;
        }

        // 2. If no user yet, check getSession (supports implicit hash flow and existing tokens)
        if (!user) {
          const { data: { session } } = await supabase.auth.getSession();
          user = session?.user || null;
        }

        if (user) {
          if (isMounted) setStatusText("Syncing your Osmida resident profile...");

          const userEmail = user.email || "";
          const userName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            (userEmail ? userEmail.split("@")[0] : "Resident");
          const userAvatar =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            "";
          const userPhone = user.phone || user.user_metadata?.phone || "";

          // Sync into localStorage
          if (typeof window !== "undefined") {
            if (userEmail) localStorage.setItem("osmida_customer_email", userEmail);
            if (userName) localStorage.setItem("osmida_customer_name", userName);
            if (userAvatar) localStorage.setItem("osmida_customer_avatar", userAvatar);
            if (userPhone) localStorage.setItem("osmida_customer_phone", userPhone);

            const profileObj = {
              id: user.id,
              name: userName,
              email: userEmail,
              avatar: userAvatar,
              phone: userPhone,
              provider: "google",
            };
            localStorage.setItem("osmida_customer_profile", JSON.stringify(profileObj));

            // Notify header and open components immediately
            window.dispatchEvent(new CustomEvent("osmida_auth_change", { detail: profileObj }));
          }

          // Persist to backend database in background
          try {
            await fetch("/api/customer/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
                email: userEmail,
                name: userName,
                avatar: userAvatar,
                phone: userPhone,
              }),
            });
          } catch (dbErr) {
            console.warn("Backend profile sync notice:", dbErr);
          }

          if (isMounted) setStatusText("Welcome! Redirecting...");

          setTimeout(() => {
            router.replace(next);
          }, 350);
        } else {
          // No user found; redirect back to home or next
          router.replace(next);
        }
      } catch (err: any) {
        console.error("Auth callback exception:", err);
        if (isMounted) {
          setErrorMsg(err.message || "Failed to complete Google authentication.");
        }
      }
    }

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#F4F8F8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Sign-in Notice</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{errorMsg}</p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block bg-[#0C6266] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md hover:bg-[#094e51] transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F8] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="h-12 w-12 rounded-2xl bg-[#0C6266] text-white flex items-center justify-center mx-auto text-xl font-black shadow-md shadow-[#0C6266]/20">
          O
        </div>
        <div className="space-y-1.5">
          <h2 className="text-base font-black text-slate-900">Connecting to Osmida</h2>
          <p className="text-xs text-slate-500 font-medium">{statusText}</p>
        </div>
        <div className="flex justify-center pt-2">
          <Loader2 className="h-6 w-6 text-[#0C6266] animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F8F8] flex items-center justify-center p-4">
          <div className="h-8 w-8 rounded-full border-2 border-[#0C6266] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
