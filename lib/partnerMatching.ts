import { NELLORE_LOCALITIES } from "./constants";

export type NelloreHub = "Central" | "East" | "South" | "North";

export interface ServicePartner {
  id: string;
  name: string;
  phone: string;
  whatsapp_number: string;
  auth_pin: string;
  categories: string[]; // 'cleaning', 'house_help', 'bathroom_cleaning', 'kitchen_cleaning', 'dishwashing', 'general_help'
  skills: string[];
  coverage_localities: string[];
  assigned_hub: NelloreHub;
  status: "online" | "offline" | "on_job" | "suspended";
  rating: number;
  completed_jobs_count: number;
  payout_balance: number;
  upi_id?: string;
}

export interface PartnerJob {
  id: string;
  reference_id: string;
  partner_id: string;
  status: "offered" | "accepted" | "dispatched" | "in_progress" | "completed" | "declined" | "expired";
  service_name: string;
  category: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  locality: string;
  date: string;
  time_slot: string;
  total_amount: number;
  payout_amount: number;
  start_otp: string;
  end_otp?: string;
  offered_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  before_photo_url?: string;
  after_photo_url?: string;
  collected_amount?: number;
  payment_method?: "cash" | "upi" | "prepaid";
  matched_partner_id?: string;
  matched_partner_name?: string;
}

// Hub locality mapping
export const HUB_LOCALITIES: Record<NelloreHub, string[]> = {
  Central: [
    "Pogathota",
    "Trunk Road",
    "VRC Centre",
    "Santhapet",
    "Mulapet",
    "Gandhi Nagar",
    "Nawabpet",
    "Fathekhanpet",
    "Kailasapuram",
  ],
  East: [
    "Magunta Layout",
    "Haranathapuram",
    "Dargamitta",
    "Children's Park Road",
    "Podalakur Road",
    "Balaji Nagar",
    "Saraswathi Nagar",
  ],
  South: [
    "Vedayapalem",
    "AC Nagar",
    "Muthukur Road",
    "Chinthareddypalem",
    "A.K. Nagar",
    "Padmavathi Nagar",
    "Current Office Area",
  ],
  North: [
    "Stonehousepet",
    "Mini Bypass Road",
    "BV Nagar",
    "Ramalingapuram",
    "Kothur",
  ],
};

// Proximity order for cascading dispatch
export const HUB_PROXIMITY: Record<NelloreHub, NelloreHub[]> = {
  Central: ["Central", "East", "North", "South"],
  East: ["East", "Central", "South", "North"],
  South: ["South", "Central", "East", "North"],
  North: ["North", "Central", "East", "South"],
};

export function getHubForLocality(locality: string): NelloreHub {
  for (const [hub, localities] of Object.entries(HUB_LOCALITIES)) {
    if (localities.some((loc) => locality.toLowerCase().includes(loc.toLowerCase()))) {
      return hub as NelloreHub;
    }
  }
  return "Central"; // Default hub
}

// Seed partner profiles (active for Nellore quick dispatch)
export const DEFAULT_PARTNERS: ServicePartner[] = [
  {
    id: "51e5539d-d787-4476-b9fb-5f7bfd67635a",
    name: "Ramesh Babu",
    phone: "9848011111",
    whatsapp_number: "9848011111",
    auth_pin: "1234",
    categories: ["cleaning", "house_help"],
    skills: ["bathroom_cleaning", "kitchen_cleaning", "dishwashing", "general_help"],
    coverage_localities: ["Magunta Layout", "Haranathapuram", "Dargamitta", "Children's Park Road", "Podalakur Road"],
    assigned_hub: "East",
    status: "online",
    rating: 4.95,
    completed_jobs_count: 215,
    payout_balance: 3800,
    upi_id: "ramesh.babu@upi",
  },
  {
    id: "f37f98c2-e048-48d9-bcdd-e9ab59d33229",
    name: "Sujatha Reddy",
    phone: "9490122849",
    whatsapp_number: "9490122849",
    auth_pin: "1234",
    categories: ["cleaning", "house_help"],
    skills: ["bathroom_cleaning", "kitchen_cleaning", "dishwashing", "general_help"],
    coverage_localities: ["Pogathota", "Trunk Road", "VRC Centre", "Santhapet", "Haranathapuram"],
    assigned_hub: "Central",
    status: "online",
    rating: 4.90,
    completed_jobs_count: 185,
    payout_balance: 3400,
    upi_id: "sujatha@okaxis",
  },
  {
    id: "363c8063-3a7e-4f97-8bf6-3278e7af2022",
    name: "Ravi Teja",
    phone: "9848099887",
    whatsapp_number: "9848099887",
    auth_pin: "1234",
    categories: ["cleaning", "house_help"],
    skills: ["bathroom_cleaning", "kitchen_cleaning", "dishwashing", "general_help"],
    coverage_localities: ["Pogathota", "Magunta Layout", "Mulapet", "Gandhi Nagar"],
    assigned_hub: "Central",
    status: "online",
    rating: 4.88,
    completed_jobs_count: 160,
    payout_balance: 3100,
    upi_id: "raviteja@oksbi",
  },
  {
    id: "164ca749-8812-40f5-9104-404f2bf57db3",
    name: "Kavitha Devi",
    phone: "9848022338",
    whatsapp_number: "9848022338",
    auth_pin: "1234",
    categories: ["cleaning", "house_help"],
    skills: ["bathroom_cleaning", "kitchen_cleaning", "dishwashing", "general_help"],
    coverage_localities: ["Vedayapalem", "AC Nagar", "Muthukur Road", "Chinthareddypalem"],
    assigned_hub: "South",
    status: "online",
    rating: 4.92,
    completed_jobs_count: 184,
    payout_balance: 4100,
    upi_id: "kavitha@okaxis",
  },
];

/**
 * Intelligent Tree-Matching Algorithm:
 * 1. Matches by Nellore residential house help & cleaning skills
 * 2. Filters by Online availability (status == 'online')
 * 3. Matches locality proximity through Nellore Hub tree
 * 4. Ranks by rating & completed job count
 */
export function matchPartnersForBooking(
  bookingCategory: string,
  customerLocality: string,
  allPartners: ServicePartner[] = DEFAULT_PARTNERS
): { primaryMatch: ServicePartner | null; fallbackQueue: ServicePartner[] } {
  // Step 1: Filter by online status
  const eligible = allPartners.filter((p) => p.status === "online");

  if (eligible.length === 0) {
    return {
      primaryMatch: allPartners[0] || null,
      fallbackQueue: allPartners.slice(1),
    };
  }

  // Step 2: Proximity Tree
  const targetHub = getHubForLocality(customerLocality);
  const preferredHubs = HUB_PROXIMITY[targetHub] || ["Central", "East", "South", "North"];

  // Sort partners by:
  // 1. Direct locality match
  // 2. Hub proximity order
  // 3. Partner rating (highest first)
  // 4. Completed jobs (highest first)
  const ranked = [...eligible].sort((a, b) => {
    const aDirectLoc = a.coverage_localities.some((l) =>
      customerLocality.toLowerCase().includes(l.toLowerCase())
    );
    const bDirectLoc = b.coverage_localities.some((l) =>
      customerLocality.toLowerCase().includes(l.toLowerCase())
    );

    if (aDirectLoc && !bDirectLoc) return -1;
    if (!aDirectLoc && bDirectLoc) return 1;

    const aHubRank = preferredHubs.indexOf(a.assigned_hub);
    const bHubRank = preferredHubs.indexOf(b.assigned_hub);
    if (aHubRank !== bHubRank) return aHubRank - bHubRank;

    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.completed_jobs_count - a.completed_jobs_count;
  });

  return {
    primaryMatch: ranked[0] || null,
    fallbackQueue: ranked.slice(1),
  };
}
