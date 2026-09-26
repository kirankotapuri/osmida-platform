// ==============================================================================
// OSMIDA RESIDENTIAL SERVICES DEFINITIONS (NELLORE, INDIA)
// Flat ₹199/hr hourly home help, photo-verified quality checks, apartment-first
// ==============================================================================

export interface OsmidaService {
  id: string;
  name: string;
  nameTe: string;
  tagline: string;
  taglineTe: string;
  description?: string;
  iconName: string;
  popular?: boolean;
  included: string[];
  includedTe: string[];
  notIncluded: string[];
  notIncludedTe: string[];
}

export type ProntoService = OsmidaService;

export const OSMIDA_SERVICES: OsmidaService[] = [
  {
    id: "bathroom_cleaning",
    name: "Bathroom Cleaning",
    nameTe: "బాత్రూమ్ క్లీనింగ్",
    tagline: "Spotless sanitization of floors, tiles, commode, and mirrors",
    taglineTe: "ఫ్లోర్, టైల్స్, కమోడ్ మరియు అద్దాల శుభ్రత",
    iconName: "Bath",
    popular: true,
    included: [
      "Floor scrubbing & disinfection",
      "Sink & washbasin deep scrub",
      "Toilet bowl / commode sanitization",
      "Reachable wall tiles stain wipe",
      "Mirror polishing & streak removal",
    ],
    includedTe: [
      "ఫ్లోర్ స్క్రబ్బింగ్ & క్రిమిసంహారక శుభ్రత",
      "సింక్ & వాష్ బేసిన్ క్లీనింగ్",
      "టాయిలెట్ బౌల్ / కమోడ్ శానిటైజేషన్",
      "చేతికి అందే గోడ టైల్స్ తుడవటం",
      "అద్దం మెరిసేలా తుడవటం",
    ],
    notIncluded: [
      "Grout restoration & re-cementing",
      "Severe hard water chemical acid treatments",
    ],
    notIncludedTe: [
      "టైల్స్ మధ్య గ్రౌట్ రీ-సిమెంటింగ్",
      "తీవ్రమైన హార్డ్ వాటర్ కెమికల్ యాసిడ్ ట్రీట్మెంట్స్",
    ],
  },
  {
    id: "kitchen_cleaning",
    name: "Kitchen Cleaning",
    nameTe: "కిచెన్ క్లీనింగ్",
    tagline: "Countertops, gas stove, sink & outer appliance degreasing",
    taglineTe: "కౌంటర్‌టాప్స్, గ్యాస్ స్టవ్, సింక్ మరియు ఉపకరణాల శుభ్రత",
    iconName: "ChefHat",
    popular: true,
    included: [
      "Countertop grease & oil wipe-down",
      "Gas stove & burner surface scrubbing",
      "Kitchen sink scrub & drain rinse",
      "Exterior appliance surface wiping",
      "Kitchen tile splashback degreasing",
    ],
    includedTe: [
      "కౌంటర్‌టాప్ ఆయిల్ మరియు జిడ్డు తుడవటం",
      "గ్యాస్ స్టవ్ & బర్నర్ ఉపరితల స్క్రబ్బింగ్",
      "సింక్ క్లీనింగ్ & డ్రెయిన్ రిన్స్",
      "ఉపకరణాల బయటి భాగం తుడవటం",
      "స్టవ్ వెనుక టైల్స్ జిడ్డు శుభ్రం చేయటం",
    ],
    notIncluded: [
      "Chimney motor dismantling / inside flue ducting",
      "Interior oven / microwave internal disassembly",
    ],
    notIncludedTe: [
      "చిమ్నీ మోటార్ విప్పడం / లోపలి డక్టింగ్",
      "ఓవెన్ అంతర్గత విడిభాగాలు విప్పడం",
    ],
  },
  {
    id: "dishwashing",
    name: "Dishwashing",
    nameTe: "గిన్నెల శుభ్రత",
    tagline: "Hygienic utensil scrubbing, sink sanitization & rack stacking",
    taglineTe: "గిన్నెల శుభ్రత, సింక్ వాష్ మరియు అమరిక",
    iconName: "Sparkles",
    included: [
      "Plates, bowls, glasses & cutlery hand scrub",
      "Pressure cookers, kadhais & cookware scrubbing",
      "Warm water clean rinse",
      "Organized drying rack arrangement",
      "Post-wash sink wipe & food trap clearing",
    ],
    includedTe: [
      "ప్లేట్లు, గిన్నెలు, గ్లాసుల చేతి శుభ్రత",
      "కుక్కర్లు, కడాయిలు స్క్రబ్బింగ్",
      "శుభ్రమైన నీటితో కడగడం",
      "ర్యాక్‌లో పద్ధతిగా అమర్చడం",
      "పని తర్వాత సింక్ మరియు ఫుడ్ ట్రాప్ క్లీనింగ్",
    ],
    notIncluded: [
      "Multi-day hardened burnt vessel scraping (requires special chemicals)",
      "Silverware / brass ornamental polishing",
    ],
    notIncludedTe: [
      "రోజుల తరబడి మాడిపోయిన గిన్నెలు (ప్రత్యేక కెమికల్స్ అవసరం)",
      "వెండి / ఇత్తడి అలంకార పాత్రల పాలిషింగ్",
    ],
  },
  {
    id: "house_help",
    name: "General House Help",
    nameTe: "ఇంటి సాధారణ సహాయం",
    tagline: "Floor sweeping & mopping, dusting, drying laundry & kitchen prep",
    taglineTe: "ఇల్లు ఊడ్చడం, తుడుపు, దుమ్ము దులపడం & కూరగాయల కట్టింగ్",
    iconName: "Home",
    popular: true,
    included: [
      "Floor broom sweeping & disinfectant mopping",
      "Living room & bedroom furniture dusting",
      "Washed clothes hanging / folding",
      "Vegetable peeling & kitchen chopping assistance",
      "Trash bin clearing & bag disposal to apartment chute",
    ],
    includedTe: [
      "ఇల్లు ఊడ్చడం & ఫినైల్ మాపింగ్",
      "లివింగ్ రూమ్, బెడ్‌రూమ్ ఫర్నిచర్ దుమ్ము దులపడం",
      "బట్టలు ఆరేయడం / మడతపెట్టడం",
      "కూరగాయలు తరగడం, వంటలో సహాయం",
      "చెత్త బుట్ట ఖాళీ చేయడం & డిస్పోజల్",
    ],
    notIncluded: [
      "Exterior high-rise window ledge washing",
      "Heavy furniture shifting or civil repair work",
    ],
    notIncludedTe: [
      "బయటి ఎత్తైన బాల్కనీ కిటికీలు శుభ్రం చేయటం",
      "భారీ ఫర్నిచర్ తరలించడం లేదా మరమ్మతులు",
    ],
  },
];

export const PRONTO_SERVICES = OSMIDA_SERVICES;

export const DURATION_OPTIONS = [
  {
    hours: 1.0,
    label: "1.0 Hour",
    labelTe: "1.0 గంట",
    recommendedFor: "Perfect for single task (e.g. 1-2 Bathrooms or Kitchen)",
    recommendedForTe: "ఒకే పనికి సరిపోతుంది (ఉదా: 1-2 బాత్రూమ్‌లు లేదా కిచెన్)",
  },
  {
    hours: 1.5,
    label: "1.5 Hours",
    labelTe: "1.5 గంటలు",
    recommendedFor: "Ideal for 2-3 tasks (e.g. Bathroom + Kitchen + Dishes)",
    recommendedForTe: "2-3 పనులకు అనువైనది (ఉదా: బాత్రూమ్ + కిచెన్ + గిన్నెలు)",
  },
  {
    hours: 2.0,
    label: "2.0 Hours",
    labelTe: "2.0 గంటలు",
    recommendedFor: "Full home refresh (covers all 4 services in sequence)",
    recommendedForTe: "ఇంటి పూర్తి రిఫ్రెష్ (అన్ని 4 పనుల వరుస కవరేజ్)",
  },
];

// Default configurations (Editable dynamically via Admin Settings)
export const DEFAULT_APP_SETTINGS = {
  hourly_rate: 199, // Customer hourly rate in INR
  worker_payout_rate: 140, // Worker payout per hour in INR (~70% share)
  service_city: "Nellore",
  service_zones: [
    "Haranathapuram",
    "Pogathota",
    "Magunta Layout",
    "Vedayapalem",
    "Dargamitta",
    "Children's Park Road",
    "Saraswathi Nagar",
    "Ramamurthy Nagar",
    "Stonehouse Pet",
    "Podalakur Road",
    "BV Nagar",
    "Ramalingapuram",
    "Kailasapuram",
    "Trunk Road",
  ],
  instant_booking_available: true,
  escrow_enabled: true,
  mandatory_photo_count: 2, // 1 before + 1 after
};
