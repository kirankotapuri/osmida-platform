"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProntoHeader } from "@/components/ProntoHeader";
import { Language } from "@/lib/translations";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Star,
  Camera,
  AlertCircle,
  Check,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lock,
  ThumbsUp,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { OsmidaSupportChat } from "@/components/OsmidaSupportChat";

export default function ActiveBookingPage({
  params,
}: {
  params: Promise<{ referenceId: string }>;
}) {
  const resolvedParams = use(params);
  const referenceId = resolvedParams.referenceId;
  const [lang, setLang] = useState<Language>("en");

  // Booking & Worker state
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Post-service action states
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  // Complaint states
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(referenceId)}`);
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking(data.booking);
        setWorker(data.worker || null);
      } else {
        setErrorMsg(data.error || "Booking details could not be found");
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to Osmida server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    const interval = setInterval(fetchBooking, 5000); // Poll status every 5 seconds
    return () => clearInterval(interval);
  }, [referenceId]);

  // Release payment handler
  const handleReleasePayment = async () => {
    setIsReleasing(true);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(referenceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "release_payment",
          otpEnd: booking.otp_end,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
        setReleaseSuccess(true);
      }
    } catch (err) {
      console.error("Failed to release payment:", err);
    } finally {
      setIsReleasing(false);
    }
  };

  // Razorpay Online Escrow Deposit Handler
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const handlePayOnlineEscrow = async () => {
    setIsPayingOnline(true);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId,
          amount: booking.total_amount,
          customerName: booking.customer_name,
          customerPhone: booking.phone,
        }),
      });
      const orderData = await res.json();
      if (!orderData.success) {
        alert(orderData.error || "Failed to initialize payment gateway");
        return;
      }

      // Check if Razorpay SDK script is loaded
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Osmida Nellore",
          description: `Escrow Hold #${referenceId}`,
          order_id: orderData.orderId,
          prefill: {
            name: booking.customer_name,
            contact: booking.phone,
          },
          theme: { color: "#0C6266" },
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                referenceId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              fetchBooking();
            }
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback or simulated verify
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referenceId,
            orderId: orderData.orderId,
            paymentId: "pay_sim_" + Date.now(),
            signature: "simulated_valid_signature",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          fetchBooking();
        }
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
    } finally {
      setIsPayingOnline(false);
    }
  };

  // Rating submit handler
  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(referenceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_rating",
          rating,
          review,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRatingSubmitted(true);
      }
    } catch (err) {
      console.error("Rating error:", err);
    }
  };

  // Complaint submit handler
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    setIsSubmittingComplaint(true);

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(referenceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lodge_complaint",
          complaintText: complaintText.trim(),
          complaintPhotos: booking.after_photo_url ? [booking.after_photo_url] : [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaintSubmitted(true);
        setBooking(data.booking);
        setIsComplaintModalOpen(false);
      }
    } catch (err) {
      console.error("Complaint submit error:", err);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading booking status...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 px-4">
        <ProntoHeader />
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">Booking Not Found</h2>
          <p className="text-xs text-slate-500">{errorMsg || "Reference code may be invalid."}</p>
          <Link
            href="/"
            className="inline-block bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-xs font-black"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = booking.status === "completed";
  const isInProgress = booking.status === "in_progress";
  const isAssigned = booking.status === "assigned" || worker !== null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <ProntoHeader />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Reference & Live Status Pill */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Booking Reference
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {booking.reference_id}
            </h1>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
              isCompleted
                ? "bg-[#0C6266]/10 text-[#0C6266] border-[#0C6266]/30"
                : isInProgress
                ? "bg-[#E68A00]/15 text-[#995C00] border-[#E68A00]/40 animate-pulse"
                : "bg-slate-100 text-slate-800 border-slate-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            <span className="uppercase">
              {isCompleted ? "Completed" : isInProgress ? "Work In Progress" : "Confirmed"}
            </span>
          </div>
        </div>

        {/* 1. PROGRESS STEPPER */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-[#0C6266]" />
              <span className="text-[10px] font-bold text-slate-800">1. Booked</span>
            </div>
            <div className="space-y-1">
              <div
                className={`h-1.5 rounded-full ${
                  isAssigned || isInProgress || isCompleted ? "bg-[#0C6266]" : "bg-slate-200"
                }`}
              />
              <span className="text-[10px] font-bold text-slate-800">2. Assigned</span>
            </div>
            <div className="space-y-1">
              <div
                className={`h-1.5 rounded-full ${
                  isInProgress || isCompleted ? "bg-[#0C6266]" : "bg-slate-200"
                }`}
              />
              <span className="text-[10px] font-bold text-slate-800">3. Working</span>
            </div>
            <div className="space-y-1">
              <div
                className={`h-1.5 rounded-full ${isCompleted ? "bg-[#0C6266]" : "bg-slate-200"}`}
              />
              <span className="text-[10px] font-bold text-slate-800">4. Done</span>
            </div>
          </div>
        </div>

        {/* 2. DUAL OTP DISPLAY BLOCKS (CORE PRD REQUIREMENT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* START OTP CARD */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border shadow-2xs space-y-2 ${
              isInProgress || isCompleted
                ? "bg-slate-50 border-slate-200 opacity-80"
                : "bg-[#0C6266]/5 border-[#0C6266]/30 ring-2 ring-[#0C6266]/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#0C6266]">
                Doorstep Start OTP
              </span>
              {isInProgress || isCompleted ? (
                <span className="text-[10px] font-black text-[#0C6266] bg-[#0C6266]/10 px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#0C6266] bg-[#0C6266]/10 px-2 py-0.5 rounded-full">
                  Share on arrival
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-widest text-center py-2 font-mono">
              {booking.otp_start || "4821"}
            </div>

            <p className="text-[11px] text-slate-600 text-center font-medium">
              {isInProgress || isCompleted
                ? "Start OTP was verified when the pro arrived."
                : "Share this code with your worker when they arrive at your door to start timer."}
            </p>
          </div>

          {/* END OTP CARD */}
          <div
            className={`rounded-2xl p-4 sm:p-5 border shadow-2xs space-y-2 ${
              isCompleted
                ? "bg-[#0C6266]/5 border-[#0C6266]/30"
                : isInProgress
                ? "bg-slate-50 border-slate-300 ring-2 ring-slate-400/20"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Completion End OTP
              </span>
              {isCompleted ? (
                <span className="text-[10px] font-black text-[#0C6266] bg-[#0C6266]/10 px-2 py-0.5 rounded-full">
                  ✓ Verified & Closed
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                  Give after photos
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-widest text-center py-2 font-mono">
              {booking.otp_end || "8392"}
            </div>

            <p className="text-[11px] text-slate-600 text-center font-medium">
              {isCompleted
                ? "Job marked complete and escrow payment released."
                : "Only share this after reviewing the before/after photos upon job completion."}
            </p>
          </div>
        </div>

        {/* 3. ASSIGNED WORKER PROFILE CARD */}
        {worker ? (
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Assigned Osmida Pro
              </span>
              <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ShieldCheck className="h-3.5 w-3.5" />
                Aadhaar Verified
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-200 shrink-0">
                  <Image
                    src={worker.photo}
                    alt={worker.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {worker.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                    <span className="flex items-center gap-1 text-[#F5A623]">
                      <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                      {worker.rating}
                    </span>
                    <span>•</span>
                    <span>{worker.completed_jobs} jobs in Nellore</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${worker.phone}`}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black text-white px-3.5 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Pro</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs text-center space-y-2">
            <Clock className="h-6 w-6 text-slate-400 mx-auto animate-spin" />
            <p className="text-xs font-bold text-slate-700">
              Assigning closest verified pro in {booking.locality}...
            </p>
            <p className="text-[11px] text-slate-500">
              You will receive pro details within 5-10 minutes.
            </p>
          </div>
        )}

        {/* 4. POST-SERVICE SCREEN: BEFORE / AFTER PHOTOS INSPECTOR */}
        {(isInProgress || isCompleted || booking.before_photo_url || booking.after_photo_url) && (
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Mandatory Photo Proof (Before vs After)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Osmida quality check: job cannot be closed without both photos.
                </p>
              </div>
              <Camera className="h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="rounded-xl border border-slate-200 p-2 text-center space-y-1.5 bg-slate-50">
                <span className="text-[10px] font-black uppercase text-slate-600">
                  1. Before Photo
                </span>
                {booking.before_photo_url ? (
                  <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-slate-200">
                    <Image
                      src={booking.before_photo_url}
                      alt="Before service"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 sm:h-40 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    Waiting for pro to upload...
                  </div>
                )}
              </div>

              {/* After Photo */}
              <div className="rounded-xl border border-slate-200 p-2 text-center space-y-1.5 bg-slate-50">
                <span className="text-[10px] font-black uppercase text-slate-600">
                  2. After Photo
                </span>
                {booking.after_photo_url ? (
                  <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-slate-200">
                    <Image
                      src={booking.after_photo_url}
                      alt="After service"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 sm:h-40 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    Pro will upload after cleanup...
                  </div>
                )}
              </div>
            </div>

            {/* AI Photo QC Badge */}
            {booking.qc_status && (
              <div
                className={`rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border ${
                  booking.qc_status === "passed"
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                    : "bg-amber-50/80 border-amber-200 text-amber-950"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {booking.qc_status === "passed" ? (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700">
                      <Sparkles className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                    </span>
                  )}
                  <span>
                    {booking.qc_status === "passed"
                      ? "AI Photo QC: Verified ✓ (Standard Met)"
                      : "AI Photo QC: Flagged for Review"}
                  </span>
                </div>
                {booking.qc_reason && (
                  <span className="text-[11px] opacity-80 italic font-medium">
                    {booking.qc_reason}
                  </span>
                )}
              </div>
            )}

            {/* Payment & Completion Action: Distinct Online Escrow vs Cash on Delivery */}
            {booking.payment_method === "online" ? (
              <div className="space-y-3">
                {/* Step 1: Deposit into Escrow via Razorpay if not yet paid */}
                {booking.payment_status !== "escrow_held" && !isCompleted && (
                  <div className="rounded-xl bg-[#F4F8F8] border border-[#0C6266]/30 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C6266] flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        Online Escrow Deposit Pending
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{booking.total_amount}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Pay via UPI / Card. Funds are held safely in escrow via Razorpay Route and will only be released to the worker after you verify the finished service.
                    </p>
                    <button
                      type="button"
                      onClick={handlePayOnlineEscrow}
                      disabled={isPayingOnline}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white p-3 text-xs font-bold transition shadow-sm"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isPayingOnline ? "Opening Payment..." : `Deposit ₹${booking.total_amount} into Escrow (UPI/Card)`}</span>
                    </button>
                  </div>
                )}

                {/* Step 2: Escrow Held Badge */}
                {booking.payment_status === "escrow_held" && !isCompleted && (
                  <div className="rounded-xl bg-[#0C6266]/10 border border-[#0C6266]/30 p-3 flex items-center gap-2.5 text-xs text-[#0C6266] font-semibold">
                    <ShieldCheck className="h-4 w-4 text-[#0C6266] shrink-0" />
                    <span>
                      ₹{booking.total_amount} Held in Escrow (Razorpay Route). Release button unlocks once pro uploads finished work photos.
                    </span>
                  </div>
                )}

                {/* Step 3: Release Payment Button (Once after photo uploaded) */}
                {!isCompleted && booking.after_photo_url && (
                  <button
                    type="button"
                    onClick={handleReleasePayment}
                    disabled={isReleasing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E68A00] hover:bg-[#CC7A00] text-slate-950 p-3.5 text-xs font-black transition-all shadow-sm active:scale-95"
                  >
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>
                      {isReleasing ? "Releasing Escrow..." : "Photos Look Great! Release Payment to Worker"}
                    </span>
                  </button>
                )}

                {isCompleted && (
                  <div className="rounded-xl bg-[#0C6266]/10 border border-[#0C6266]/30 p-3 flex items-center gap-2.5 text-xs text-[#0C6266] font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6266] shrink-0" />
                    <span>
                      Escrow payment released to worker&apos;s payout queue. Thank you for using Osmida!
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Cash on Delivery Flow */
              <>
                {!isCompleted ? (
                  <div className="rounded-xl bg-[#FFF9E6] border border-[#E68A00]/30 p-3.5 text-xs text-slate-900 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>💵 Cash on Delivery (Pay After Service)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Please hand over <strong className="text-slate-950 font-bold">₹{booking.total_amount}</strong> in cash directly to {worker?.name || "your pro"} once you have inspected their work and shared the End OTP. The worker will confirm cash receipt on their app.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#0C6266]/10 border border-[#0C6266]/30 p-3 flex items-center gap-2.5 text-xs text-[#0C6266] font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#0C6266] shrink-0" />
                    <span>
                      Cash payment of ₹{booking.total_amount} confirmed received by {worker?.name || "your pro"}. Visit completed!
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 5. POST-SERVICE RATING & COMPLAINT ACTIONS */}
        {isCompleted && (
          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Rate Your Experience with {worker?.name || "Your Pro"}
            </h3>

            {ratingSubmitted ? (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center space-y-1">
                <ThumbsUp className="h-6 w-6 text-[#0C6266] mx-auto" />
                <p className="text-xs font-black text-slate-900">Rating Submitted!</p>
                <p className="text-[11px] text-slate-500">
                  Your feedback helps keep Osmida standards high in Nellore.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? "fill-[#F5A623] text-[#F5A623]"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  placeholder="Share a few words about the cleaning quality, punctuality..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-medium focus:outline-none focus:border-[#0C6266]"
                />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsComplaintModalOpen(true)}
                    className="text-xs font-bold text-slate-500 hover:text-rose-600 underline"
                  >
                    Report an Issue / Complaint
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#0C6266] hover:bg-[#094e51] text-white px-5 py-2.5 text-xs font-black transition-all shadow-sm"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 6. BOOKING SUMMARY & TRANSPARENT TALLY CARD */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Receipt &amp; Transparent Breakdown
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Flat ₹{booking.hourly_rate || 199}/hr Rate
            </span>
          </div>

          <div className="flex justify-between font-bold text-slate-800">
            <span>Tasks Covered:</span>
            <span className="text-right max-w-[220px] truncate">{booking.selected_service}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-600">
            <span>Visit Duration:</span>
            <span>{booking.duration_hours || 1.0} {Number(booking.duration_hours) === 1 ? "Hour" : "Hours"}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-600">
            <span>Schedule / Slot:</span>
            <span>{booking.time_slot}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-600">
            <span>Apartment &amp; Address:</span>
            <span className="text-right max-w-[200px] truncate">{booking.site_address}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-600">
            <span>Payment Mode:</span>
            <span className="font-bold text-slate-900">
              {booking.payment_method === "online" ? "🛡️ Online Escrow" : "💵 Cash on Delivery (Pay After Service)"}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
            <span>Price Calculation:</span>
            <span className="font-mono font-bold text-slate-900">
              {booking.duration_hours || 1.0} hrs × ₹{booking.hourly_rate || 199} = ₹{booking.total_amount}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-900">
            <span>{booking.payment_method === "online" ? "Total Escrow Amount:" : "Total Payable (Cash):"}</span>
            <span className="text-base text-[#0C6266] font-black">₹{booking.total_amount}</span>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Return to Osmida Home
          </Link>
        </div>
      </div>

      {/* COMPLAINT MODAL */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Report an Issue / Complaint
              </h3>
              <button
                type="button"
                onClick={() => setIsComplaintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-black"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Our Nellore team guarantees full resolution (redo visit or refund) within 2 hours.
            </p>

            <form onSubmit={handleSubmitComplaint} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Describe what was missed (e.g. bathroom stains remaining, sink not scrubbed)..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none focus:border-rose-600"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingComplaint}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 text-xs font-black transition-all"
                >
                  {isSubmittingComplaint ? "Filing Complaint..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Concierge Chat with live booking context */}
      <OsmidaSupportChat referenceId={referenceId} />
    </div>
  );
}
