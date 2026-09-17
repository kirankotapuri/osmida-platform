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
  "Serving residential neighborhoods across Nellore, including Haranathapuram, Magunta Layout, Pogathota, Fathekhanpet, Ramalingapuram, VRC Centre, Santhi Nagar, Dargamitta, Vedayapalem, Stonehousepet, Podalakur Road, Nawabpet, and nearby localities.";

export const MASTER_SERVICES: ServiceItem[] = [
  {
    id: "pest-control",
    title: "Pest Control Services",
    status: "active",
    badge: "30-Day Warranty",
    tagline: "Certified low-odor treatments for cockroaches, bedbugs, termites, and mosquitoes in Nellore homes. Safe for children, elders, and pets (terms apply).",
    startingPrice: "From ₹1,499",
    subcategories: [
      {
        id: "PEST_GENERAL_1BHK",
        title: "General Pest Control – 1 BHK",
        price: "₹1,499",
        unit: "per apartment",
        turnaround: "45 Mins",
        scope: "Low-odor gel baiting in kitchen & bathrooms, perimeter spray along skirting boards, drain disinfectant, 30-day warranty.",
        popular: true
      },
      {
        id: "PEST_GENERAL_2BHK",
        title: "General Pest Control – 2 BHK",
        price: "₹1,999",
        unit: "per apartment",
        turnaround: "60 Mins",
        scope: "Complete coverage for 2 BHK: kitchen cabinets, washroom drains, behind appliances, balcony perimeter, 30-day warranty.",
        popular: true
      },
      {
        id: "PEST_BEDBUG",
        title: "Bedbug Treatment (Per Room)",
        price: "From ₹999",
        unit: "per bedroom",
        turnaround: "2 Visits",
        scope: "Intensive seam misting, crack steaming, and mandatory follow-up visit to break insect lifecycle.",
        popular: true
      },
      {
        id: "PEST_TERMITE",
        title: "Termite Control & Wood Injection",
        price: "From ₹8/sqft",
        unit: "per sq ft",
        turnaround: "Free Inspection First",
        scope: "Floor drilling barrier, doorframe wood pressure injection, certified non-repellent termiticide barrier."
      }
    ]
  },
  {
    id: "ac-services",
    title: "AC Services & Repair",
    status: "active",
    badge: "15-Day Warranty",
    tagline: "Professional split & window AC jet pump cleaning, cooling diagnosis, gas refills, and precision installation by established Nellore technicians.",
    startingPrice: "From ₹599",
    subcategories: [
      {
        id: "AC_FOAM_JET",
        title: "Split AC Foam Jet Deep Service",
        price: "₹599",
        unit: "per split AC",
        turnaround: "45 Mins",
        scope: "Waterproof jacket setup, high-pressure foam jet wash for cooling coils, blower wheel scrub, and drain tray flush. 15-day cooling warranty.",
        popular: true
      },
      {
        id: "AC_REPAIR_DIAGNOSIS",
        title: "AC Repair & Low Cooling Diagnosis",
        price: "₹299 (Inspection)",
        unit: "per unit",
        turnaround: "30-60 Mins",
        scope: "Digital manifold pressure test, PCB & capacitor diagnosis, water leakage check. Fee adjusted if repair is approved.",
        popular: true
      },
      {
        id: "AC_INSTALLATION",
        title: "Split AC Safe Installation",
        price: "From ₹899",
        unit: "per unit",
        turnaround: "90 Mins",
        scope: "Spirit level bracket mounting, copper flare vacuuming, leak check, electrical testing, and airflow calibration."
      },
      {
        id: "AC_GAS_REFILL",
        title: "Gas Leak Check & Top-Up",
        price: "From ₹1,999",
        unit: "per unit",
        turnaround: "60 Mins",
        scope: "Nitrogen leak detection, system vacuuming, exact gram-weight refrigerant recharge."
      }
    ]
  },
  {
    id: "home-deep-cleaning",
    title: "Home Deep Cleaning",
    status: "active",
    badge: "Supervised Quality",
    tagline: "Intensive residential cleaning using mechanized single-disc floor scrubbers, tile descaling chemicals, and degreasing compounds.",
    startingPrice: "1 BHK From ₹2,499",
    subcategories: [
      {
        id: "CLEAN_1BHK",
        title: "1 BHK Full Home Deep Clean",
        price: "From ₹2,499",
        unit: "per apartment",
        turnaround: "3-4 Hours",
        scope: "Living room, 1 bedroom, kitchen degreasing, bathroom acid-free descaling, floor single-disc buffing.",
        popular: true
      },
      {
        id: "CLEAN_2BHK",
        title: "2 BHK Full Home Deep Clean",
        price: "From ₹3,499",
        unit: "per home",
        turnaround: "4-5 Hours",
        scope: "Complete floor buffing, window panes, balcony wash, ceiling fan dust removal, kitchen degreasing & 2 washrooms descaling.",
        popular: true
      },
      {
        id: "CLEAN_KITCHEN",
        title: "Kitchen Deep Degreasing (Add-on)",
        price: "From ₹699",
        unit: "per kitchen",
        turnaround: "90 Mins",
        scope: "Heavy grease removal from tiles, chimney exterior, gas stove, sink, and kitchen countertop descaling.",
        popular: true
      },
      {
        id: "CLEAN_BATHROOM",
        title: "Bathroom Acid-Free Scrub (Add-on)",
        price: "From ₹499",
        unit: "per washroom",
        turnaround: "60 Mins",
        scope: "Acid-free descaling of taps, showerheads, floor & wall tiles, commode sanitization, and mirror spot removal.",
        popular: true
      }
    ]
  }
];