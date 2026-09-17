export interface SubCategory {
  id: string;
  title: string;
  price?: string;
  unit?: string;
  turnaround?: string;
  scope?: string;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  status: "active" | "coming_soon";
  badge: string;
  tagline: string;
  startingPrice?: string;
  subcategories: SubCategory[];
}

export const NELLORE_LOCALITIES = [
  "Trunk Road",
  "Pogathota",
  "Magunta Layout",
  "Haranathapuram",
  "Dargamitta",
  "VRC Centre",
  "Stonehousepet",
  "Vedayapalem",
  "Podalakur Road",
  "Other Area in Nellore"
] as const;

export const SERVICE_AREA_DESCRIPTION =
  "Selected commercial locations within approximately 5 km of Fathekhanpet, Nellore, including Ramalingapuram, VRC Centre, Santhi Nagar, A.C. Nagar, Harinathapuram, Aditya Nagar, Dargamitta, Magunta Layout, Mulapeta, Stonehousepet and nearby areas.";

export const MASTER_SERVICES: ServiceItem[] = [
  {
    id: "kitchen-deep-clean",
    title: "Osmida Restaurant Hygiene Reset",
    status: "active",
    badge: "Most Popular",
    tagline: "A scheduled, documented kitchen and washroom reset for small Nellore restaurants and cafes, with clear scope, Digital Completion Report and a practical follow-up plan.",
    startingPrice: "From ₹3,499",
    subcategories: [
      {
        id: "KITCHEN_FULL",
        title: "Hygiene Reset for Small Commercial Kitchen",
        price: "From ₹3,499",
        unit: "per kitchen",
        turnaround: "4.0 Hours",
        scope: "Small commercial kitchen, subject to inspection. Includes agreed accessible areas, up to 2 workers, basic cleaning materials and completion photos. Heavy carbon, duct interiors, hazardous access, repairs, parts and additional areas require separate approval.",
        popular: true
      },
      {
        id: "KITCHEN_STANDARD",
        title: "Standard Kitchen Deep Clean",
        price: "From ₹4,999",
        unit: "per kitchen",
        turnaround: "After inspection",
        scope: "Medium kitchen or heavier agreed scope after inspection. Duct interiors, high-access work, repairs and additional areas require separate approval."
      },
      {
        id: "KITCHEN_LARGE",
        title: "Large / Heavy Kitchen",
        price: "Custom quote",
        unit: "per site",
        turnaround: "After inspection",
        scope: "Large area, severe carbon or grease, duct work, height, machinery or extended hours."
      },
      {
        id: "KITCHEN_HOOD",
        title: "Exhaust Hood & Chimney Filter Degrease",
        price: "From ₹1,499",
        unit: "per hood",
        turnaround: "2.0 Hours",
        scope: "Cleaning of accessible hood surfaces and filters, subject to inspection, safe access and product instructions."
      },
      {
        id: "KITCHEN_RANGE",
        title: "Cooking Range & Accessible Burner Cleaning",
        price: "From ₹1,199",
        unit: "per range",
        turnaround: "1.5 Hours",
        scope: "Cleaning of accessible cooking-range and burner surfaces, subject to condition and safe access."
      },
      {
        id: "KITCHEN_FLOOR",
        title: "Kitchen Floor & Drain Grease Scrub",
        price: "From ₹999",
        unit: "per area",
        turnaround: "1.5 Hours",
        scope: "Agreed cleaning of accessible kitchen floors, tiles and drain areas; blocked plumbing and repairs are excluded."
      },
      {
        id: "KITCHEN_AMC",
        title: "30-Day Hygiene Protection Plan",
        price: "From ₹5,999",
        unit: "per 30 days",
        turnaround: "Reset + 1 visit",
        scope: "One initial hygiene reset, one scheduled maintenance visit within 30 days, two digital completion reports, a basic customer maintenance checklist and a 7-day follow-up review. Pest treatment is quoted separately."
      }
    ]
  },
  {
    id: "washroom-sanitation",
    title: "Commercial Washroom Deep Cleaning & Descaling",
    status: "active",
    badge: "High Demand",
    tagline: "Removal of surface dirt, hard-water deposits, uric-scale buildup, odour sources and residue from agreed washroom areas using suitable products and safe procedures.",
    startingPrice: "From ₹1,499",
    subcategories: [
      {
        id: "WASHROOM_BLOCK",
        title: "Complete Washroom Block Cleaning",
        price: "From ₹1,499",
        unit: "per block",
        turnaround: "2.5 Hours",
        scope: "For up to two toilets/urinals in standard condition. Includes mirrors, floors and agreed fixtures; extra units, severe scaling, damaged fixtures and blocked plumbing require a separate quote.",
        popular: true
      },
      {
        id: "WASHROOM_TILES",
        title: "Hard-Water Tile & Partition Descaling",
        price: "From ₹899",
        unit: "per washroom",
        turnaround: "1.5 Hours",
        scope: "Inspection-based descaling of suitable ceramic and non-damaged surfaces."
      },
      {
        id: "WASHROOM_URINAL",
        title: "Urinal and Commode Deep Cleaning",
        price: "From ₹699",
        unit: "per bank",
        turnaround: "1.0 Hour",
        scope: "Cleaning of accessible surfaces and buildup, subject to material condition and safe access."
      },
      {
        id: "WASHROOM_DRAIN",
        title: "Anti-Odour Drain Treatment",
        price: "From ₹399",
        unit: "per line",
        turnaround: "30 Mins",
        scope: "Cleaning and suitable biological treatment of accessible drain areas; plumbing defects and sewer-gas problems are excluded."
      },
      {
        id: "WASHROOM_AMC",
        title: "Monthly Washroom Cleaning Plan (4 Visits/Month)",
        price: "From ₹2,499",
        unit: "per month",
        turnaround: "Weekly",
        scope: "Four scheduled visits for a clearly defined small block with a cleaning checklist and service-completion report."
      }
    ]
  },
  {
    id: "pest-shield",
    title: "Commercial Pest Management Programme",
    status: "active",
    badge: "Inspection Required",
    tagline: "Dependable commercial pest-management programmes for restaurants, clinics, gyms, offices, shops, apartments, warehouses and other business premises in Nellore. Treatment method, frequency, documentation, warranty and price are confirmed after site inspection.",
    startingPrice: "Quote after free site inspection",
    subcategories: [
      {
        id: "PEST_COCKROACH",
        title: "Commercial Cockroach Control Programme",
        unit: "per inspection and treatment",
        turnaround: "Scheduled after inspection",
        scope: "Osmida inspects kitchen, drain, storage and harbourage areas; recommends the treatment plan; schedules the assigned qualified pest-management technicians; and provides service documentation and follow-up recommendations.",
        popular: true
      },
      {
        id: "PEST_RODENT",
        title: "Commercial Rodent Control Programme",
        unit: "per site programme",
        turnaround: "Scheduled after inspection",
        scope: "Osmida assesses rodent activity, entry points, storage areas, waste zones, drains and external perimeters, then provides monitoring and practical prevention recommendations."
      },
      {
        id: "PEST_FLY_ANT",
        title: "Fly & Ant Management",
        unit: "per site programme",
        turnaround: "Scheduled after inspection",
        scope: "Osmida identifies breeding sources and entry points around drains, waste areas, food storage, doors, windows and ventilation points, then implements a site-specific plan with the assigned qualified pest-management provider."
      },
      {
        id: "PEST_GENERAL",
        title: "General Commercial Pest Inspection",
        unit: "per site inspection",
        turnaround: "10-Min Initial Audit",
        scope: "Review of pest activity, hygiene risk points, storage, waste areas, drains and practical prevention actions before a written quote."
      },
      {
        id: "PEST_AMC",
        title: "Scheduled Monthly, Quarterly or Annual Pest Programme",
        unit: "monthly or quarterly plan",
        turnaround: "Frequency agreed after inspection",
        scope: "Osmida provides inspection, planned visits, service reports, corrective-action recommendations and documented follow-up terms."
      }
    ]
  },
  {
    id: "ac-services",
    title: "AC Services",
    status: "active",
    badge: "Estimate After Diagnosis",
    tagline: "Professional AC installation, repair, servicing and AMC in Nellore, coordinated by Osmida through assigned qualified technicians. Estimates are shared after diagnosis and partner confirmation.",
    subcategories: [
      { id: "AC_INSTALLATION", title: "AC Installation", scope: "Split and window AC installation, standard mounting, piping, testing and handover. Extra piping, drilling and stabiliser work are quoted on site." },
      { id: "AC_REPAIR", title: "AC Repair & Troubleshooting", scope: "Diagnosis for poor cooling, leakage, noise, gas leaks, PCB, sensor, fan motor, starting and tripping issues." },
      { id: "AC_SERVICING", title: "AC Servicing (Maintenance)", scope: "Filter, indoor unit, accessible outdoor unit, drain check and performance testing. Deeper cleaning is subject to site assessment." },
      { id: "AC_AMC", title: "AC AMC", scope: "Scheduled maintenance and priority support with labour, parts and gas coverage confirmed in the written AMC scope." }
    ]
  },
  {
    id: "commercial-painting",
    title: "Commercial Painting Support",
    status: "coming_soon",
    badge: "Coming Soon",
    tagline: "Osmida is onboarding local painting partners for commercial touch-ups and repainting. Site scope, materials, schedule and pricing will be confirmed after partner onboarding.",
    subcategories: [
      { id: "PAINT_OIL", title: "Commercial Wall Touch-Ups" },
      { id: "PAINT_CLINIC", title: "Commercial Repainting Support" },
      { id: "PAINT_TURNKEY", title: "Site Quotation After Confirmation" }
    ]
  }
];