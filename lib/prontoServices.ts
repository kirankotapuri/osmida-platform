// ==============================================================================
// OSMIDA PRONTO/SNABBIT RESIDENTIAL SERVICES DEFINITIONS (NELLORE, INDIA)
// Exactly these 4 services, fixed included/not included blocks, flat hourly rate
// ==============================================================================

export interface ProntoService {
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

export const PRONTO_SERVICES: ProntoService[] = [
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
      "Countertops & slab wipe down",
      "Stove top & gas burner surface degreasing",
      "Kitchen sink & tap stain removal",
      "Outer cabinet, fridge & microwave surfaces",
      "Kitchen floor sweeping & mopping",
    ],
    includedTe: [
      "కౌంటర్‌టాప్స్ & స్లాబ్ శుభ్రంగా తుడవటం",
      "గ్యాస్ స్టవ్ & బర్నర్ ఉపరితల జిడ్డు తొలగింపు",
      "సింక్ & ట్యాప్ మరకల తొలగింపు",
      "క్యాబినెట్లు, ఫ్రిజ్ & మైక్రోవేవ్ బయటి ఉపరితలాలు",
      "కిచెన్ ఫ్లోర్ ఊడ్చటం మరియు తడిగుడ్డతో తుడవటం",
    ],
    notIncluded: [
      "Inside cabinet organization / utensil emptying",
      "Chimney / exhaust duct internal motor dismantling",
      "Heavy industrial grease baked-on crust removal",
    ],
    notIncludedTe: [
      "క్యాబినెట్ల లోపలి సర్దుబాటు / పాత్రలు ఖాళీ చేయడం",
      "చిమ్నీ / ఎగ్జాస్ట్ లోపలి మోటారు విప్పడం",
      "సంవత్సరాల తరబడి పేరుకుపోయిన భారీ ఇండస్ట్రియల్ జిడ్డు",
    ],
  },
  {
    id: "dishwashing",
    name: "Dishwashing",
    nameTe: "గిన్నెల శుభ్రత (డిష్‌వాషింగ్)",
    tagline: "Quick, hygienic dish and utensil washing with sink cleanup",
    taglineTe: "పాత్రలు, గిన్నెల వేగవంతమైన పరిశుభ్రమైన కడుగుట",
    iconName: "UtensilsCrossed",
    included: [
      "Regular daily utensils, plates, glasses & spoons",
      "Cookware & pressure cooker washing",
      "Sink basin scrub & drain strainer clearing",
      "Stove burner outer wipe down",
    ],
    includedTe: [
      "రోజువారీ వాడే పాత్రలు, ప్లేట్లు, గ్లాసులు & స్పూన్లు",
      "వంట పాత్రలు & ప్రెషర్ కుక్కర్ శుభ్రత",
      "సింక్ బేసిన్ & డ్రెయిన్ జల్లెడ క్లీనింగ్",
      "స్టవ్ బర్నర్ చుట్టూ తుడవటం",
    ],
    notIncluded: [
      "Burnt / old baked-in food deposits requiring heavy scraping",
      "Broken glass handling or hazardous item sorting",
    ],
    notIncludedTe: [
      "మాడిపోయిన / పాతగా అంటుకుపోయిన మొండి ఆహార నిక్షేపాలు",
      "పగిలిన గాజు ముక్కలను తాకడం",
    ],
  },
  {
    id: "general_house_help",
    name: "General House Help",
    nameTe: "సాధారణ ఇంటి సహాయం",
    tagline: "Floors sweeping & mopping, dusting reachable surfaces & trash",
    taglineTe: "ఫ్లోర్ ఊడ్చటం, తడిగుడ్డ తుడవటం, దుమ్ము దులిపి చెత్త వేయడం",
    iconName: "Sparkles",
    included: [
      "Complete home sweeping & wet mopping floors",
      "Dusting reachable furniture, tables & TV consoles",
      "Ceiling fan & reachable wall dust cobweb removal",
      "Dustbin bag replacement & household waste disposal",
    ],
    includedTe: [
      "ఇల్లంతా ఊడ్చటం మరియు తడిగుడ్డతో ఫ్లోర్ మాపింగ్",
      "చేతికి అందే ఫర్నిచర్, టేబుల్స్ మరియు టీవీ యూనిట్ డస్టింగ్",
      "ఫ్యాన్లు మరియు అందే గోడలపై దుమ్ము, బూజు తొలగింపు",
      "డస్ట్‌బిన్ బ్యాగ్ మార్చడం & చెత్తను బయట వేయడం",
    ],
    notIncluded: [
      "High ladder work or hazardous exterior balcony climbs",
      "Moving heavy furniture (sofas, wardrobes, heavy double beds)",
    ],
    notIncludedTe: [
      "ఎత్తైన నిచ్చెనలు ఎక్కడం లేదా బాల్కనీ ప్రమాదకర ఎత్తులు",
      "భారీ ఫర్నిచర్ (వార్డ్‌రోబ్‌లు, భారీ డబుల్ కాట్లు) కదపడం",
    ],
  },
];

export interface DurationOption {
  hours: number;
  label: string;
  labelTe: string;
  recommendedFor: string;
  recommendedForTe: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  {
    hours: 1.0,
    label: "1.0 Hour",
    labelTe: "1 గంట",
    recommendedFor: "Quick 1-2 tasks (e.g. Bathroom + Dishwashing or General Help)",
    recommendedForTe: "1-2 పనులకు సరిపోతుంది (ఉదా: బాత్రూమ్ + డిష్‌వాషింగ్)",
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
