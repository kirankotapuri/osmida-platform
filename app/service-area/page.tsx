import Link from "next/link";
import { SERVICE_AREA_DESCRIPTION } from "@/lib/constants";

export default function ServiceAreaPage() {
  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-16 text-sm leading-relaxed text-slate-300">
      <article className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">Home</Link>
        <h1 className="text-3xl font-bold text-white">Osmida Service Area</h1>
        <p className="text-xs text-slate-500">Current service coverage is subject to appointment availability and site access.</p>
        <p>{SERVICE_AREA_DESCRIPTION}</p>
        <p>Locations outside this initial service zone may be considered after inspection. Travel charges or a different appointment window may apply and will be confirmed in writing before work.</p>
        <Link href="/#booking-wizard" className="inline-block rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-emerald-400">Book Free Site Inspection (₹0)</Link>
      </article>
    </main>
  );
}