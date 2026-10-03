# 🚀 Osmida Engineering Portfolio & Job Application Guide

A comprehensive technical dossier detailing the architecture, engineering decisions, challenges solved, resume bullet points, and interview talking points for **Osmida** — an on-demand residential house help platform.

---

## 📌 1. Project Overview & Elevator Pitch

> **Project Name:** Osmida (osmida.com)  
> **Role:** Full-Stack Software Engineer / Lead Platform Engineer  
> **Domain:** Hyper-local On-Demand Services, Marketplace Operations, Logistics & Dispatch  
> **Elevator Pitch:**  
> *"Osmida is an end-to-end on-demand residential house-help platform engineered for apartment communities in Tier-2 Indian cities (starting with Nellore, Andhra Pradesh). It replaces unorganized domestic labor with verified helpers, standardized micro-tasks, flat transparent hourly pricing (₹199/hr), ₹0-advance escrow payments with Razorpay, automated WhatsApp dispatch notifications, and an operations admin control tower."*

---

## 🛠️ 2. Core Technology Stack

| Layer | Technologies Used | Key Purpose |
|---|---|---|
| **Frontend & SSR** | **Next.js (App Router)**, **React**, **TypeScript (Strict)** | Server-side rendering, dynamic API route handlers, type safety across all components |
| **Styling & UI** | **Tailwind CSS**, **Lucide Icons** | Custom design system, mobile-first responsive design, dark-mode admin radar |
| **Backend & Database** | **Supabase (PostgreSQL 15)**, Node.js Runtime | Relational data model, Row-Level Security (RLS), JSONB settings, automated timestamps |
| **State & Communication** | **React Hooks**, **Custom Event Bus**, **Web Storage API** | Real-time multi-tab state sync (`useServiceLocations`), optimistic UI updates |
| **Payments & Escrow** | **Razorpay PG**, **RazorpayX Payouts** | Signature-verified webhooks, auto-splitting platform commission and partner payouts |
| **Notifications** | **WhatsApp Cloud API**, **MSG91 (DLT SMS)**, **Resend** | Automated booking confirmations, OTP verification, dispatch reminders |
| **Automation & AI** | **N8N Cloud Webhooks**, **AI Complaint Triage** | Automated lead ingestion, operational issue resolution |
| **PWA & Offline** | **Service Workers (`sw.js`)**, **Web App Manifest** | App-like installation, offline fallback, caching strategies |

---

## 🏗️ 3. Key Architectural Feats & Problems Solved

### A. Dynamic Service Locations & Cache Invalidation System
- **The Challenge:** Next.js App Router aggressively caches static routes and `fetch` requests. When administrators added, edited, or removed service localities in the Admin Control Tower, changes were either not propagating to public pages (Homepage, Header, Booking flow) or were overwritten by stale in-memory settings upon auto-refresh.
- **The Solution:** 
  1. Engineered a dedicated CRUD API endpoint (`/api/locations`) and unified it with `/api/settings`.
  2. Enforced Next.js dynamic flags (`export const dynamic = "force-dynamic"`, `export const revalidate = 0`, `export const fetchCache = "force-no-store"`).
  3. Added HTTP headers (`Cache-Control: no-store, no-cache, must-revalidate`).
  4. Implemented a universal React hook (`useServiceLocations`) featuring dual-channel sync: an event-driven `CustomEvent` bus for immediate in-page updates and `window.addEventListener("storage")` for cross-tab synchronization.

### B. High-Reliability Operations Control Tower (Admin Dashboard)
- **Features:** 
  - Live Radar auto-refreshing operational state (bookings, partner statuses, complaints, financials).
  - Secure session-based authentication gate preventing unauthorized access.
  - Manual & automatic worker dispatching with proximity/availability matching.
  - One-click CSV export of worker payout sheets formatted for bank batch UPI transfers.
  - Interactive photo-audit modal inspecting before-and-after service proofs.

### C. Trust-First Booking & Escrow Flow
- Designed a 60-second booking funnel requiring **₹0 advance payment**.
- Integrated Razorpay post-completion billing where customers only pay once the domestic worker uploads before/after photo proof.
- Webhook endpoints verify HMAC-SHA256 signatures before transitioning booking states, preventing transaction spoofing.

---

## 📝 4. Ready-to-Use Resume / CV Bullet Points

### For Full-Stack Software Engineer
- *Architected and deployed **Osmida**, a full-stack hyper-local home services platform using **Next.js 15**, **TypeScript**, and **Supabase (PostgreSQL)**, serving on-demand residential bookings.*
- *Engineered a centralized real-time location management engine featuring dual-write Supabase persistence, HTTP cache invalidation, and custom event listeners to ensure instant zero-latency updates across all customer touchpoints.*
- *Integrated **Razorpay** payment gateway and webhook pipelines with HMAC-SHA256 signature verification, automating payment reconciliation and worker payouts.*
- *Built an automated multi-channel messaging infrastructure leveraging **WhatsApp Cloud API** and **MSG91 DLT-compliant SMS** for automated OTP auth and booking dispatch alerts.*
- *Maintained strict TypeScript type checking (`tsc --noEmit` with 0 errors) and achieved sub-second API response times across all core operational workflows.*

### For Frontend / React Specialist
- *Developed a high-performance, mobile-first PWA in **Next.js** and **Tailwind CSS**, featuring custom modals, dynamic address selectors, and offline service worker support.*
- *Constructed a comprehensive operations dashboard with auto-polling telemetry, real-time dispatch filters, inline data editing, and instant CSV export capabilities.*
- *Implemented custom React hooks (`useServiceLocations`) with optimistic UI rendering, localStorage persistence, and cross-tab synchronizations.*

---

## 💡 5. Technical Interview Questions & Model Answers

### Q1: "How did you handle cache invalidation in Next.js App Router for dynamic administrative data?"
> **Answer:** *"In Next.js App Router, GET route handlers can be aggressively cached by both the Next.js Data Cache and browser heuristics. To solve this for admin-controlled service locations, I enforced `export const dynamic = 'force-dynamic'`, set `revalidate = 0`, and attached explicit `Cache-Control: no-store, no-cache` headers. On the client side, the hook appends high-resolution timestamps (`?t=${Date.now()}`) to bypass HTTP caching and dispatches custom DOM events so sibling components and background tabs update instantaneously without page reloads."*

### Q2: "How did you design the database schema and secure it?"
> **Answer:** *"I used Supabase PostgreSQL with strict Row-Level Security (RLS) policies. Sensitive tables like `admin_settings`, `service_partners`, and `payout_records` are protected against public client access and only mutated via authenticated server-side API routes using the `SUPABASE_SERVICE_ROLE_KEY`. For settings like active localities, I utilized a flexible `JSONB` structure with fallback migrations, allowing zero-downtime additions of new operational zones."*

### Q3: "How do you ensure data integrity during online payments?"
> **Answer:** *"We use an event-driven webhook architecture with Razorpay. When a customer pays, we do not rely purely on client-side success callbacks. Instead, the server receives a `payment.captured` webhook, validates the HMAC-SHA256 signature against the raw payload and secret, and executes a database transaction to mark the booking paid and generate the partner payout record."*

---

## 📊 6. Summary of Key Achievements
- **0 TypeScript Compile Errors** (`npx tsc --noEmit` passing cleanly).
- **100% Live Dynamic Locality Engine** (Admin changes propagate immediately to Header, Footer, Homepage, and Booking modals).
- **Production-Ready Integrations** (Supabase, Razorpay, WhatsApp Cloud API, MSG91, Resend).
- **Full Operational Lifecycle** (Customer booking -> Worker dispatch -> Photo proof audit -> Razorpay payment -> Partner payout export).
