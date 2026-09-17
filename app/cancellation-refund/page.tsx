import Link from "next/link";

export default function CancellationRefundPage() {
  return (
    <main className="min-h-screen bg-[#05070A] px-6 py-16 text-sm leading-relaxed text-slate-300">
      <article className="mx-auto max-w-4xl space-y-6">
        <Link href="/" className="inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">Home</Link>
        <h1 className="text-3xl font-bold text-white">Cancellation and Refund Policy</h1>
        <p className="text-xs text-slate-500">Last Updated: September 1, 2026</p>
        <h2 className="pt-4 text-lg font-bold text-white">Free Inspection</h2>
        <p>Free inspection requests may be cancelled or rescheduled without charge before the inspection slot is confirmed. No payment is collected for requesting an inspection.</p>
        <p>Payments, cancellations, rescheduling requests, service concerns, refunds, and disputes relating to Osmida Facility Services are handled by Finkfold, operating the Osmida Facility Services brand. Any refund or adjustment is assessed against the approved written quotation, confirmed scope, work completed, material costs, partner costs, and applicable cancellation terms.</p>
        <h2 className="pt-4 text-lg font-bold text-white">Confirmed Services</h2>
        <p>Please contact us as soon as possible to reschedule or cancel a confirmed service. Cancellation after worker or material booking may result in an agreed deduction for actual costs already incurred. Any additional work requires written approval.</p>
        <h2 className="pt-4 text-lg font-bold text-white">Customer Responsibilities</h2>
        <p>The customer must provide access, water, electricity, safe working conditions, and removal or protection of valuables. Customers should report rework requests within 48 hours of completion with reasonable exclusions for permanent stains, old damage, plumbing defects, or pest recurrence caused by unresolved structural or hygiene problems.</p>
        <h2 className="pt-4 text-lg font-bold text-white">Contact</h2>
        <p>For cancellations, rescheduling, or refund questions, contact us at osmidaindia@gmail.com or +91 7676358162.</p>
        <div className="border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-400">
          <p>Legal Operating Entity: Finkfold</p>
          <p>Operating Brand: Osmida Facility Services</p>
          <p>Registered Address: Fathekhanpet, Pendemvari Street, Nellore, Andhra Pradesh 524003, India</p>
          <p>Legal Business Contact: +91 6281533239</p>
          <p>Customer Support: +91 7676358162</p>
          <p>Email: osmidaindia@gmail.com</p>
        </div>
      </article>
    </main>
  );
}