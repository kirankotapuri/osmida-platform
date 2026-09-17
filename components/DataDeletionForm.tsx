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
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-lg font-bold text-white">Request Data Deletion</h2>
      <p className="text-xs text-slate-400">Submit your details so Finkfold can verify your identity and remove eligible Osmida records. Legal, payment, or transaction records may need to be retained where required.</p>
      {(["businessName", "contactPerson", "whatsappNumber", "email", "referenceId"] as const).map((field) => (
        <input key={field} required={field === "businessName" || field === "contactPerson" || field === "whatsappNumber"} type={field === "email" ? "email" : "text"} placeholder={{ businessName: "Business name", contactPerson: "Contact person", whatsappNumber: "WhatsApp number", email: "Email (optional)", referenceId: "Inspection reference (optional)" }[field]} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
      ))}
      <textarea placeholder="Reason or records you want deleted (optional)" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} rows={3} className="w-full resize-none rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400" />
      {message && <p className={`text-xs ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>{message}</p>}
      <button type="submit" disabled={status === "submitting"} className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50">{status === "submitting" ? "Submitting..." : "Submit Deletion Request"}</button>
    </form>
  );
}