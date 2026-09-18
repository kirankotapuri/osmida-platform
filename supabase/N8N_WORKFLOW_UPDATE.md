# Osmida Unified Architecture: Web App + 4 n8n Automations

## 1. Multi-Stage Pipeline Architecture

```text
[ Web App / Inbound Submissions ]
              │
              ▼
   POST /api/book-inspection
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 1: Lead Ingestion (n8n Workflow 1)              │
│ 1. Dedupe check against 'osmida_processed_refs'       │
│ 2. Inserts new submission into 'public.leads'         │
│ 3. Dispatches WhatsApp to Customer & Admin            │
│ 4. Next.js enriches 'leads' with cart/spec details    │
└────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 2: Schedule Inspection (n8n Workflow 2)         │
│ Admin form trigger: converts 'leads' -> 'inspections'  │
│ Updates leads.status = 'inspection_scheduled'         │
│ Sends WhatsApp inspection confirmation to customer    │
└────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 3: Quotations & Bookings (n8n Workflow 3)       │
│ Admin drafts quotation -> inserts into 'quotes'        │
│ When Quote is marked 'Won' -> creates 'bookings'      │
│ Sends WhatsApp quote / advance request to customer    │
└────────────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 4: Job Execution & Status (n8n Workflow 4)      │
│ Status update form: dispatched / in_progress /        │
│ completed / cancelled -> updates 'bookings'           │
│ Sends Meta approved WhatsApp status templates         │
└────────────────────────────────────────────────────────┘
```

## 2. Supabase Tables

| Table | Purpose | Managed By |
|---|---|---|
| `public.osmida_processed_refs` | Deduplication & idempotency | n8n Workflow 1 / Web App |
| `public.leads` | All inbound web enquries, cart bookings & audit requests | n8n Workflow 1 + Web App API |
| `public.inspections` | Formally scheduled site audits with dates & technician slots | n8n Workflow 2 |
| `public.quotes` | Quotations with line items, advance %, validity days | n8n Workflow 3 |
| `public.bookings` | Confirmed won jobs, field execution, and live statuses | n8n Workflow 3 & 4 |
| `public.data_deletion_requests`| Privacy & Meta compliance requests | `/api/data-deletion` |
| `public.osmida_message_status` | WhatsApp delivery audits | Optional webhook listener |

## 3. Migration File

The complete, zero-error SQL rebuild script is saved at:
`supabase/migrations/20260918_clean_rebuild_complete_schema.sql`
