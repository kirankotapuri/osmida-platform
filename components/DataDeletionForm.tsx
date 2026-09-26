"use client";

import { FormEvent, useState } from "react";

export function DataDeletionForm() {
  const [form, setForm] = useState({ businessName: "", contactPerson: "", whatsappNumber: "", email: "", referenceId: "", reason: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed");
      setStatus("success");
      setMessage("Your request was received. We will verify the request and contact you about the next steps.");
      setForm({ businessName: "", contactPerson: "", whatsappNumber: "", email: "", referenceId: "", reason: "" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not submit your request.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-[#0C6266]/20 bg-[#F0FDF4]/50 p-5 sm:p-6 text-left">
      <div>
        <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <span>Request Data Deletion</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Submit your registered details so Finkfold can verify your identity and delete eligible Osmida records in compliance with DPDP regulations.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          required
          type="text"
          placeholder="Full Name / Resident Name *"
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]"
        />
        <input
          required
          type="tel"
          placeholder="WhatsApp Number *"
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="email"
          placeholder="Email Address (Optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]"
        />
        <input
          type="text"
          placeholder="Booking Reference (e.g. OSM-XXXX, optional)"
          value={form.referenceId}
          onChange={(e) => setForm({ ...form, referenceId: e.target.value })}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]"
        />
      </div>
      <textarea
        placeholder="Reason or specific records you want removed (optional)"
        value={form.reason}
        onChange={(e) => setForm({ ...form, reason: e.target.value })}
        rows={2}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0C6266] focus:ring-1 focus:ring-[#0C6266]"
      />
      {message && (
        <p className={`text-xs font-semibold ${status === "error" ? "text-rose-600" : "text-emerald-700"}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto rounded-xl bg-[#0C6266] hover:bg-[#095054] px-5 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
      >
        {status === "submitting" ? "Submitting..." : "Submit Deletion Request"}
      </button>
    </form>
  );
}