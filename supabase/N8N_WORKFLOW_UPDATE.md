# Osmida n8n workflow update

## Ownership model

The webapp is the source of truth for the initial enquiry:

```text
Webapp -> POST /api/book-inspection -> Supabase inspections
                                      -> n8n webhook -> notifications/automation
```

Do not insert the same enquiry into `inspections` from n8n. The webapp already does that.

Create a `bookings` row only after the customer accepts a quotation and the service is scheduled. A free inspection is not a paid booking.

## Replace `Normalize Payload` code

```javascript
const b = $json.body ?? $json;

const referenceId = String(b.referenceId || '').trim();
const rawPhone = String(b.whatsappNumber || b.phone || '');
const whatsappNumber = rawPhone.replace(/\D/g, '').slice(-10);
const businessName = String(b.businessName || b.customerName || '').trim();
const contactPerson = String(b.contactPerson || '').trim();
const locality = String(b.locality || '').trim();
const siteAddress = String(b.siteAddress || '').trim();

let errorMsg = '';
if (!referenceId) errorMsg = 'referenceId is required';
else if (!businessName) errorMsg = 'businessName is required';
else if (!contactPerson) errorMsg = 'contactPerson is required';
else if (whatsappNumber.length !== 10) errorMsg = 'whatsappNumber must be exactly 10 digits';
else if (!locality) errorMsg = 'locality is required';
else if (!siteAddress) errorMsg = 'siteAddress is required';
else if (b.contactConsent !== true) errorMsg = 'contactConsent is required';

return {
  json: {
    isValid: !errorMsg,
    errorMsg,
    referenceId,
    isFreeAudit: b.selectedService === 'free-audit',
    facilityType: b.facilityType || '',
    selectedService: b.selectedService || '',
    locality,
    siteAddress,
    inspectionDate: b.inspectionDate || null,
    timeSlot: b.timeSlot || null,
    serviceUrgency: b.serviceUrgency || null,
    businessName,
    contactPerson,
    whatsappNumber,
    floorArea: b.floorArea || null,
    notes: b.notes || null,
    mainPestIssue: b.mainPestIssue || null,
    pestPremisesType: b.pestPremisesType || null,
    approximateSize: b.approximateSize || null,
    pestDetails: b.pestDetails || null,
    kitchenDetails: b.kitchenDetails || null,
    washroomDetails: b.washroomDetails || null,
    acDetails: b.acDetails || null,
    contactConsent: b.contactConsent === true
  }
};
```

## Dedupe node

Keep the `Dedupe Check` node, but use this query:

```sql
insert into osmida_processed_refs (reference_id)
values ($1)
on conflict (reference_id) do nothing
returning reference_id;
```

Query replacements:

```text
={{ [$json.referenceId] }}
```

## Remove duplicate database writes

Disable or remove these nodes from the webhook path:

```text
Insert into Inspections
Insert into Bookings
Free Audit or Paid Booking?
Did DB Insert Succeed?
Respond (DB Error)
```

The webapp already inserts the complete record into `public.inspections` before calling n8n.

## Replace the success path

After `Is New Submission?` true:

```text
Is New Submission? -> Customer Confirmation (WhatsApp)
                   -> Alert Admin (WhatsApp)
                   -> Respond (Success OK)
```

A duplicate should continue to:

```text
Is New Submission? false -> Respond (Duplicate, Ignored)
```

## Updated customer confirmation fields

Use these values in the WhatsApp template:

```text
businessName
selectedService
inspectionDate
timeSlot
locality
referenceId
```

Do not send a confirmation claiming a paid booking. The first request is a free inspection enquiry.

## Downstream booking creation

When a quotation is accepted and a service is scheduled, create a `bookings` row with:

```sql
insert into bookings (
  reference_id,
  customer_name,
  contact_person,
  phone,
  whatsapp_number,
  business_name,
  facility_type,
  service_type,
  selected_service,
  service_price,
  preferred_date,
  inspection_date,
  time_slot,
  address,
  site_address,
  locality,
  floor_area,
  notes,
  service_urgency,
  main_pest_issue,
  pest_premises_type,
  approximate_size,
  pest_details,
  kitchen_details,
  washroom_details,
  ac_details,
  contact_consent,
  status
) values (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
  $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
  $21, $22, $23, $24, $25, $26, $27, 'confirmed'
);
```

Only run this after written scope approval and advance-payment confirmation.

## Important

Never include Supabase service keys, Postgres passwords, WhatsApp tokens, or n8n credentials in workflow exports shared in chat.
