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
  "Serving residential neighborhoods across Nellore, including Haranathapuram, Magunta Layout, Pogathota, Fathekhanpet, Ramalingapuram, VRC Centre, Santhi Nagar, Dargamitta, Vedayapalem, Stonehousepet, Podalakur Road, and nearby localities.";

export const MASTER_SERVICES: ServiceItem[] = [
  {
    id: "pest-control",
    title: "Pest Control Services",
    status: "active",
    badge: "30-Day Guarantee",
    tagline: "Certified odorless treatments for cockroaches, bedbugs, termites, and mosquitoes in Nellore homes. Safe for children, elders, and pets.",
    startingPrice: "From ₹799",
    subcategories: [
      {
        id: "PEST_GENERAL_1BHK",
        title: "General Pest Control – 1 BHK",
        price: "₹799",
        unit: "per apartment",
        turnaround: "45 Mins",
        scope: "Odorless herbal gel baiting in kitchen & bathrooms, perimeter spray along skirting boards, drain disinfectant.",
        popular: true
      },
      {
        id: "PEST_GENERAL_2BHK",
        title: "General Pest Control – 2 BHK",
        price: "₹1,099",
        unit: "per apartment",
        turnaround: "60 Mins",
        scope: "Complete coverage for 2 BHK: kitchen cabinets, washroom drains, behind appliances, balcony perimeter, 30-day warranty.",
        popular: true
      },
      {
        id: "PEST_BEDBUG",
        title: "Bedbug Treatment (2-Visit Protocol)",
        price: "₹1,199",
        unit: "per bedroom",
        turnaround: "2 Visits",
        scope: "Intensive seam misting, crack steaming, and mandatory second visit after 15 days to break insect lifecycle.",
        popular: true
      },
      {
        id: "PEST_TERMITE",
        title: "Termite Control & Wood Injection",
        price: "Free Inspection",
        unit: "per sq ft",
        turnaround: "After inspection",
        scope: "Floor drilling barrier, doorframe wood pressure injection, certified non-repellent termiticide barrier."
      }
    ]
  },
  {
    id: "ac-services",
    title: "AC Services & Repair",
    status: "active",
    badge: "Same-Day Service",
    tagline: "Professional split & window AC jet pump cleaning, cooling diagnosis, gas refills, and precision installation by verified Nellore technicians.",
    startingPrice: "From ₹499",
    subcategories: [
      {
        id: "AC_FOAM_JET",
        title: "Foam Jet Deep Service",
        price: "₹499",
        unit: "per split AC",
        turnaround: "45 Mins",
        scope: "Waterproof jacket setup, high-pressure foam jet wash for cooling coils, blower wheel scrub, and drain tray flush.",
        popular: true
      },
      {
        id: "AC_REPAIR_DIAGNOSIS",
        title: "AC Repair & Low Cooling Diagnosis",
        price: "₹399 (Diagnosis)",
        unit: "per unit",
        turnaround: "60 Mins",
        scope: "Digital manifold pressure test, PCB & capacitor diagnosis, water leakage resolution, transparent quote before repair.",
        popular: true
      },
      {
        id: "AC_INSTALLATION",
        title: "Split AC Safe Installation / Shifting",
        price: "From ₹799",
        unit: "per unit",
        turnaround: "90 Mins",
        scope: "Spirit level bracket mounting, copper flare vacuuming, leak check, electrical testing, and airflow calibration."
      },
      {
        id: "AC_GAS_REFILL",
        title: "Gas Top-Up & Complete Refill",
        price: "Quote on site",
        unit: "per unit",
        turnaround: "60 Mins",
        scope: "Nitrogen leak detection, system vacuuming to 500 microns, exact gram-weight R32/R410A refrigerant recharge."
      }
    ]
  },
  {
    id: "home-deep-cleaning",
    title: "Home Deep Cleaning",
    status: "active",
    badge: "Supervised Quality",
    tagline: "Intensive residential cleaning using mechanized single-disc floor scrubbers, tile descaling chemicals, and degreasing compounds.",
    startingPrice: "From ₹999",
    subcategories: [
      {
        id: "CLEAN_FULL_HOME",
        title: "Full Home Deep Clean",
        price: "From ₹3,499",
        unit: "per home",
        turnaround: "4-6 Hours",
        scope: "Complete floor buffing, window panes, balcony wash, ceiling fan dust removal, kitchen degreasing & washroom descaling.",
        popular: true
      },
      {
        id: "CLEAN_KITCHEN",
        title: "Kitchen Degrease Reset",
        price: "₹1,499",
        unit: "per kitchen",
        turnaround: "2 Hours",
        scope: "Heavy grease removal from tiles, chimney exterior, gas stove, sink, and kitchen countertop descaling.",
        popular: true
      },
      {
        id: "CLEAN_BATHROOM",
        title: "Bathroom Hard-Water Descaling",
        price: "₹999 (2 Units)",
        unit: "2 washrooms",
        turnaround: "1.5 Hours",
        scope: "Acid-free descaling of taps, showerheads, floor & wall tiles, commode sanitization, and mirror spot removal.",
        popular: true
      }
    ]
  }
];