# Osmida End-to-End n8n Automation Workflows

This directory contains the production-ready n8n workflows aligned with Meta's WhatsApp approved templates and Supabase 4-stage database schema.

---

## 1. Approved Meta WhatsApp Templates & Parameter Mapping

All 8 templates have been validated against your active WhatsApp Business Account:

| Template Name | Language | Parameter Count | Exact Replacements |
|---|---|---|---|
| `admin_lead_alert` | `en` | 5 | `{{1}}`: Ref ID, `{{2}}`: Business Name, `{{3}}`: Locality, `{{4}}`: Service, `{{5}}`: 10-digit Phone |
| `osmida` | `en_US` | 4 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Date + Time Slot, `{{4}}`: Ref ID |
| `osmida_quote` | `en` | 4 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Ref ID, `{{4}}`: Amount |
| `osmida_advance` | `en` | 5 | `{{1}}`: Name, `{{2}}`: Ref ID, `{{3}}`: Service, `{{4}}`: Advance Amount, `{{5}}`: Payment/UPI Link |
| `osmida_dispatched` | `en` | 3 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Ref ID |
| `omsida_in_progress` | `en` | 3 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Ref ID *(Note spelling)* |
| `osmida_completed` | `en` | 3 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Ref ID |
| `osmida_cancelled` | `en` | 3 | `{{1}}`: Name, `{{2}}`: Service, `{{3}}`: Ref ID |

---

## 2. Workflows Overview

### [1. Lead Ingestion Webhook](1_lead_ingestion_webhook.json)
- **Webhook Endpoint**: `POST /webhook/osmida-lead-ingest`
- **Actions**:
  1. Deduplicates against `osmida_processed_refs`.
  2. Inserts new record into `public.leads` with status `'new'`.
  3. Sends `osmida` WhatsApp template to Customer.
  4. Sends `admin_lead_alert` WhatsApp template to Admin (`+917981067780`).
  5. Returns `{ "success": true, "referenceId": "..." }`.

### [2. Schedule Inspection Form](2_schedule_inspection_form.json)
- **Trigger**: n8n Form Trigger (`Lead Reference ID`, `Inspection Date`, `Time Slot`).
- **Actions**:
  1. Copies lead from `public.leads` into `public.inspections` with status `'new'`.
  2. Updates `public.leads.status = 'inspection_scheduled'`.
  3. Sends `osmida` WhatsApp template to Customer with scheduled date and time slot.
  4. Confirms to Admin.

### [3. Quotation and Decision](3_quotation_and_decision.json)
- **Part A (Create Quote)**:
  - Form Trigger: `Inspection Reference ID`, `Line Items`, `Quote Amount`, `Advance %`, `Validity days`, `Terms`.
  - Inserts into `public.quotes`.
  - Sends `osmida_quote` template (4 params) to Customer.
  - Sends Admin WhatsApp text alert.
- **Part B (Quote Decision)**:
  - Form Trigger: `Inspection Reference ID`, `Decision (Won/Lost)`, `Final Amount`, `UPI ID/Payment Link`.
  - Updates `public.quotes.status`.
  - If **Won**: Inserts into `public.bookings` (status: `'confirmed'`), sends `osmida_advance` template (5 params) to Customer, alerts Admin.
  - If **Lost**: Alerts Admin.

### [4. Job Status Update](4_job_status_update.json)
- **Trigger**: n8n Form Trigger (`Reference ID`, `New Status`: `dispatched` / `in_progress` / `completed` / `cancelled`).
- **Actions**:
  1. Updates `public.bookings.status`.
  2. Triggers matching customer status template (`osmida_dispatched`, `omsida_in_progress`, `osmida_completed`, `osmida_cancelled`).
  3. Confirms to Admin.

---

## 3. How to Import or Update in n8n

1. In your **n8n Cloud Dashboard**, open each workflow (or click **Add workflow**).
2. Click the top-right **three dots (...)** menu -> **Import from File...** or copy/paste the JSON directly.
3. Verify your Postgres credential is set to your Supabase connection and WhatsApp HTTP credential is set to your Meta Cloud API Bearer Token.
4. Save and activate each workflow.
