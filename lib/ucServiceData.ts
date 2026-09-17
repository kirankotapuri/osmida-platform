import { UCServiceItemData } from "@/components/UCServiceCard";

// 1. AC SERVICES SUB-CATEGORIES & PACKAGES
export const AC_SUBCATEGORIES = [
  { id: "service-wash", labelEn: "Service & Jet Wash", labelTe: "సర్వీస్ & జెట్ వాష్" },
  { id: "repair-gas", labelEn: "Repair & Gas Refill", labelTe: "రిపేర్ & గ్యాస్ రీఫిల్" },
  { id: "install-shift", labelEn: "Install & Relocation", labelTe: "ఇన్‌స్టాల్ & షిఫ్టింగ్" },
] as const;

export const AC_SERVICE_ITEMS: UCServiceItemData[] = [
  {
    id: "ac-foam-jet-split",
    titleEn: "Split AC Deep Foam Jet Wash",
    titleTe: "స్ప్లిట్ ఏసీ డీప్ ఫోమ్ జెట్ వాష్",
    price: 599,
    originalPrice: 699,
    durationEn: "45 mins",
    durationTe: "45 నిమిషాలు",
    rating: "4.86",
    reviews: "1.4k",
    inclusionsEn: [
      "High-pressure water jet cleaning for cooling coils & blower",
      "Specialized waterproof jacket to prevent mess on indoor walls & floor",
      "Outdoor condenser unit washed & cleaned",
      "Gas pressure & cooling temperature check before & after service",
      "15-day cooling & leak warranty included"
    ],
    inclusionsTe: [
      "కూలింగ్ కాయిల్స్ & బ్లోయర్ కోసం హై-ప్రెజర్ వాటర్ జెట్ క్లీనింగ్",
      "ఇంటి గోడలు & ఫ్లోర్ పాడవకుండా స్పెషల్ వాటర్‌ప్రూఫ్ జాకెట్",
      "అవుట్‌డోర్ కండెన్సర్ యూనిట్ శుభ్రం చేయడం",
      "సర్వీస్ ముందు & తర్వాత గ్యాస్ ప్రెజర్ మరియు కూలింగ్ చెక్",
      "15 రోజుల ఉచిత కూలింగ్ & లీక్ వారంటీ"
    ],
    exclusionsEn: ["Gas refilling or major spare parts replacement", "Masonry or wiring repairs"],
    exclusionsTe: ["గ్యాస్ రీఫిల్ లేదా పెద్ద స్పేర్ పార్ట్స్ మార్చడం", "వైరింగ్ మరమ్మతులు"],
    imageSrc: "/images/service-ac-foamjet.jpg",
    category: "ac",
    subcategory: "service-wash",
  },
  {
    id: "ac-jet-wash-window",
    titleEn: "Window AC Jet Wash",
    titleTe: "విండో ఏసీ జెట్ వాష్",
    price: 499,
    originalPrice: 599,
    durationEn: "45 mins",
    durationTe: "45 నిమిషాలు",
    rating: "4.81",
    reviews: "820",
    inclusionsEn: [
      "Complete front panel and filter wash",
      "Coil and fan blade pressure cleaning",
      "Electrical box check & performance test",
      "15-day cooling guarantee"
    ],
    inclusionsTe: [
      "ఫ్రంట్ ప్యానెల్ & ఫిల్టర్ల పూర్తి వాష్",
      "కాయిల్ మరియు ఫ్యాన్ బ్లేడ్ ప్రెజర్ క్లీనింగ్",
      "ఎలక్ట్రికల్ బాక్స్ చెక్ & కూలింగ్ పనితీరు పరిశీలన",
      "15 రోజుల కూలింగ్ గ్యారెంటీ"
    ],
    imageSrc: "/images/service-ac-foamjet.jpg",
    category: "ac",
    subcategory: "service-wash",
  },
  {
    id: "ac-anti-rust-coating",
    titleEn: "Anti-Rust Coil Protective Coating",
    titleTe: "కాయిల్ రక్షణ యాంటీ-రస్ట్ కోటింగ్",
    price: 399,
    originalPrice: 499,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.79",
    reviews: "450",
    inclusionsEn: [
      "Specialized protective acrylic spray on condenser & cooling coils",
      "Prevents gas leaks and corrosion from coastal salty air",
      "Increases AC coil lifespan significantly"
    ],
    inclusionsTe: [
      "కండెన్సర్ & కూలింగ్ కాయిల్స్‌పై ప్రత్యేక యాక్రిలిక్ స్ప్రే",
      "సముద్రపు ఉప్పు గాలి వల్ల వచ్చే తుప్పు & గ్యాస్ లీకేజ్ నివారణ",
      "ఏసీ కాయిల్స్ మన్నికను పెంచుతుంది"
    ],
    imageSrc: "/images/service-ac-repair.jpg",
    category: "ac",
    subcategory: "service-wash",
  },
  {
    id: "ac-repair-inspection",
    titleEn: "AC Not Cooling / Diagnosis Checkup",
    titleTe: "ఏసీ కూలింగ్ సమస్య / పూర్తి చెకప్",
    price: 299,
    originalPrice: 399,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.78",
    reviews: "865",
    inclusionsEn: [
      "Complete 20-point digital diagnostic inspection",
      "Compressor, capacitor, motor, and PCB electrical load check",
      "Inspection fee adjusted against final repair if completed",
      "30-day warranty on replaced partner spare parts"
    ],
    inclusionsTe: [
      "20-పాయింట్ల పూర్తి డిజిటల్ డయాగ్నస్టిక్ చెకప్",
      "కంప్రెసర్, కెపాసిటర్, మోటార్ మరియు పీసీబీ ఎలక్ట్రికల్ లోడ్ చెక్",
      "రిపేర్ చేయించుకుంటే ఇన్‌స్పెక్షన్ ఫీజు మినహాయించబడుతుంది",
      "మార్చిన స్పేర్ పార్టులపై 30 రోజుల వారంటీ"
    ],
    imageSrc: "/images/service-ac-repair.jpg",
    category: "ac",
    subcategory: "repair-gas",
  },
  {
    id: "ac-water-leak-fix",
    titleEn: "Water Leakage & Drain Unclogging",
    titleTe: "వాటర్ లీకేజ్ రిపేర్ & డ్రెయిన్ క్లీనింగ్",
    price: 349,
    originalPrice: 449,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.83",
    reviews: "610",
    inclusionsEn: [
      "Indoor unit drain tray flushing & unclogging",
      "Slope realignment to ensure smooth external drainage",
      "Drain pipe replacement or clamping if cracked"
    ],
    inclusionsTe: [
      "ఇండోర్ యూనిట్ డ్రెయిన్ ట్రే శుభ్రం చేసి అడ్డంకులు తొలగించడం",
      "నీరు సాఫీగా బయటకు వెళ్లేలా స్లోప్ సరిదిద్దడం",
      "డ్రెయిన్ పైప్ లీకేజ్ సరిచేయడం"
    ],
    imageSrc: "/images/service-ac-repair.jpg",
    category: "ac",
    subcategory: "repair-gas",
  },
  {
    id: "ac-gas-refill-check",
    titleEn: "Pure Refrigerant Gas Refill & Leak Check",
    titleTe: "ప్యూర్ గ్యాస్ రీఫిల్ & లీక్ టెస్ట్",
    price: 1999,
    originalPrice: 2499,
    durationEn: "60 mins",
    durationTe: "60 నిమిషాలు",
    rating: "4.80",
    reviews: "510",
    inclusionsEn: [
      "Nitrogen pressure leak check on copper joints & flared nuts",
      "100% pure virgin refrigerant (R-32 / R-410A / R-22) filled with manifold gauge",
      "Vacuum pump evacuation to remove air moisture before refill",
      "15-day gas leak guarantee"
    ],
    inclusionsTe: [
      "నైట్రోజన్ ప్రెజర్‌తో రాగి జాయింట్లు & ఫ్లేర్ నట్స్ లీక్ టెస్ట్",
      "డిజిటల్ మీటర్‌తో 100% అసలైన స్వచ్ఛమైన గ్యాస్ రీఫిల్ (R-32 / R-410A)",
      "సిస్టమ్ నుంచి తేమను తొలగించడానికి వాక్యూమ్ చేయడం",
      "15 రోజుల గ్యాస్ లీక్ గ్యారెంటీ"
    ],
    imageSrc: "/images/service-ac-repair.jpg",
    category: "ac",
    subcategory: "repair-gas",
  },
  {
    id: "ac-uninstall-safe",
    titleEn: "Safe AC Uninstallation (Zero Gas Loss)",
    titleTe: "సురక్షిత ఏసీ అన్‌ఇన్‌స్టాల్ (గ్యాస్ వేస్ట్ కాదు)",
    price: 499,
    originalPrice: 599,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.85",
    reviews: "340",
    inclusionsEn: [
      "Refrigerant pump-down locked safely inside compressor",
      "Careful unmounting of indoor unit, bracket & outdoor stand",
      "Copper pipe flare protection caps applied"
    ],
    inclusionsTe: [
      "గ్యాస్ బయటకు పోకుండా కంప్రెసర్‌లోనే సురక్షితంగా లాక్ చేయడం",
      "ఇండోర్ & అవుట్‌డోర్ యూనిట్లను జాగ్రత్తగా విడదీయడం",
      "రాగి పైపులకు ప్రొటెక్షన్ క్యాప్స్ అమర్చడం"
    ],
    imageSrc: "/images/service-ac-install.jpg",
    category: "ac",
    subcategory: "install-shift",
  },
  {
    id: "ac-install-standard",
    titleEn: "Standard AC Installation",
    titleTe: "ప్రామాణిక ఏసీ ఇన్‌స్టాలేషన్",
    price: 899,
    originalPrice: 1099,
    durationEn: "60 mins",
    durationTe: "60 నిమిషాలు",
    rating: "4.87",
    reviews: "920",
    inclusionsEn: [
      "Wall core drilling & indoor bracket mounting with spirit level",
      "Outdoor stand placement & vibration pad mounting",
      "Copper pipe flaring, flare nut tightening, and vacuum leak testing",
      "Cooling check & electrical load verification"
    ],
    inclusionsTe: [
      "స్పిరిట్ లెవల్‌తో ఇండోర్ బ్రాకెట్ ఫిట్టింగ్ & డ్రిల్లింగ్",
      "అవుట్‌డోర్ స్టాండ్ & వైబ్రేషన్ ప్యాడ్స్ అమర్చడం",
      "రాగి పైపుల కనెక్షన్ & వాక్యూమ్ లీక్ టెస్టింగ్",
      "కూలింగ్ మరియు ఎలక్ట్రికల్ లోడ్ పరిశీలన"
    ],
    exclusionsEn: ["Outdoor wall metal stand, extra copper pipes, or electrical power plug"],
    exclusionsTe: ["అవుట్‌డోర్ స్టాండ్ లేదా అదనపు రాగి పైపులు"],
    imageSrc: "/images/service-ac-install.jpg",
    category: "ac",
    subcategory: "install-shift",
  },
  {
    id: "ac-complete-shifting",
    titleEn: "Complete AC Shifting (Within Nellore)",
    titleTe: "ఏసీ పూర్తి షిఫ్టింగ్ (నెల్లూరు పరిధిలో)",
    price: 1299,
    originalPrice: 1599,
    durationEn: "90 mins",
    durationTe: "90 నిమిషాలు",
    rating: "4.84",
    reviews: "290",
    inclusionsEn: [
      "Full gas lock and uninstallation from existing home",
      "Safe packaging & transport assistance within Nellore city",
      "Re-installation at new location with level testing"
    ],
    inclusionsTe: [
      "పాత ఇంటి వద్ద గ్యాస్ లాక్ & అన్‌ఇన్‌స్టాలేషన్",
      "నెల్లూరు సిటీ పరిధిలో సురక్షిత రవాణా సహకారం",
      "కొత్త ఇంట్లో పర్ఫెక్ట్ రీ-ఇన్‌స్టాలేషన్"
    ],
    imageSrc: "/images/service-ac-install.jpg",
    category: "ac",
    subcategory: "install-shift",
  },
];

// 2. PEST CONTROL SUB-CATEGORIES & PACKAGES
export const PEST_SUBCATEGORIES = [
  { id: "cockroach-ants", labelEn: "Cockroach & Ants", labelTe: "బొద్దింకలు & చీమలు" },
  { id: "bedbug-control", labelEn: "Bedbug Control", labelTe: "నల్లుల నివారణ" },
  { id: "termite-control", labelEn: "Termite Control", labelTe: "చెదపురుగుల నివారణ" },
  { id: "mosquito-rodents", labelEn: "Mosquito & Rodents", labelTe: "దోమలు & ఎలుకలు" },
] as const;

export const PEST_SERVICE_ITEMS: UCServiceItemData[] = [
  {
    id: "pest-general-1bhk",
    titleEn: "General Pest Control – 1 BHK",
    titleTe: "సాధారణ పురుగుల నివారణ – 1 BHK",
    price: 1499,
    originalPrice: 1699,
    durationEn: "45 mins",
    durationTe: "45 నిమిషాలు",
    rating: "4.89",
    reviews: "890",
    inclusionsEn: [
      "Targeted low-odor gel baiting in kitchen cabinets, fridge motor & switchboards",
      "Perimeter spray along baseboards, washrooms, balcony & drain lines",
      "Drain disinfectant granules applied to prevent cockroach crawling",
      "Safe for children, senior citizens & pets (terms apply)",
      "30-Day rework warranty: covers same pest type in treated rooms"
    ],
    inclusionsTe: [
      "కిచెన్ కేబినెట్స్, ఫ్రిజ్ వెనుక & స్విచ్‌బోర్డుల్లో స్వల్ప వాసన గల జెల్ అప్లికేషన్",
      "గోడల మూలలు, బాత్రూమ్‌లు & బాల్కనీలో పెరిమీటర్ స్ప్రే",
      "డ్రెయిన్స్ నుంచి బొద్దింకలు రాకుండా క్రిమిసంహారక గ్రాన్యూల్స్",
      "పిల్లలు, వృద్ధులు & పెంపుడు జంతువులకు సురక్షితం",
      "30 రోజుల రీవిజిట్ వారంటీ: ట్రీట్ చేసిన గదుల్లో పురుగులు కనిపిస్తే ఉచిత సర్వీస్"
    ],
    exclusionsEn: ["Wall hole plastering or plumbing line fixes"],
    exclusionsTe: ["గోడ రంధ్రాలు పూడ్చడం లేదా ప్లంబింగ్ పనులు"],
    imageSrc: "/images/service-pest-general.jpg",
    category: "pest",
    subcategory: "cockroach-ants",
  },
  {
    id: "pest-general-2bhk",
    titleEn: "General Pest Control – 2 BHK",
    titleTe: "సాధారణ పురుగుల నివారణ – 2 BHK",
    price: 1999,
    originalPrice: 2299,
    durationEn: "60 mins",
    durationTe: "60 నిమిషాలు",
    rating: "4.91",
    reviews: "1.2k",
    inclusionsEn: [
      "Complete coverage: Living hall + 2 bedrooms + kitchen + 2 washrooms",
      "Gel dots behind electronic appliances and under sink pipes",
      "Low-odor residual spray for long-lasting pest eradication",
      "30-Day revisit warranty (terms apply)"
    ],
    inclusionsTe: [
      "హాల్ + 2 బెడ్రూమ్‌లు + కిచెన్ + 2 బాత్‌రూమ్‌లలో సమగ్ర ట్రీట్మెంట్",
      "సింక్ కింద & ఎలక్ట్రానిక్ ఉపకరణాల వెనుక జెల్ చుక్కలు",
      "దీర్ఘకాలిక రక్షణ కోసం తక్కువ వాసన గల రెసిడ్యువల్ స్ప్రే",
      "30 రోజుల రీవిజిట్ వారంటీ (నిబంధనలు వర్తిస్తాయి)"
    ],
    imageSrc: "/images/service-pest-general.jpg",
    category: "pest",
    subcategory: "cockroach-ants",
  },
  {
    id: "pest-general-3bhk",
    titleEn: "General Pest Control – 3 BHK",
    titleTe: "సాధారణ పురుగుల నివారణ – 3 BHK",
    price: 2499,
    originalPrice: 2899,
    durationEn: "75 mins",
    durationTe: "75 నిమిషాలు",
    rating: "4.88",
    reviews: "640",
    inclusionsEn: [
      "Intensive treatment for 3 BHK: 3 bedrooms, hall, kitchen & all washrooms",
      "High-density gel application in food preparation areas",
      "30-Day revisit warranty included"
    ],
    inclusionsTe: [
      "3 బెడ్రూమ్‌లు, హాల్, కిచెన్ & అన్ని వాష్‌రూమ్‌లలో డీప్ ట్రీట్మెంట్",
      "కిచెన్ ప్రదేశాలలో హై-డెన్సిటీ జెల్ బెయిటింగ్",
      "30 రోజుల రీవిజిట్ వారంటీ"
    ],
    imageSrc: "/images/service-pest-general.jpg",
    category: "pest",
    subcategory: "cockroach-ants",
  },
  {
    id: "pest-kitchen-gel",
    titleEn: "Kitchen Deep Gel Treatment (Add-on)",
    titleTe: "కిచెన్ డీప్ జెల్ ట్రీట్మెంట్ (యాడ్-ఆన్)",
    price: 699,
    originalPrice: 799,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.85",
    reviews: "410",
    inclusionsEn: [
      "Intensive gel baiting targeting german cockroaches behind kitchen shelves",
      "Sink drain disinfectant application"
    ],
    inclusionsTe: [
      "కిచెన్ అల్మారాలు & ర్యాక్లలో జర్మన్ బొద్దింకలపై ప్రత్యేక జెల్ బెయిటింగ్",
      "సింక్ డ్రెయిన్ శానిటైజేషన్"
    ],
    imageSrc: "/images/service-pest-general.jpg",
    category: "pest",
    subcategory: "cockroach-ants",
  },
  {
    id: "pest-bedbug-1room",
    titleEn: "Bedbug Eradication – Per Room",
    titleTe: "నల్లుల నివారణ – ప్రతి గదికి",
    price: 999,
    originalPrice: 1199,
    durationEn: "45 mins",
    durationTe: "45 నిమిషాలు",
    rating: "4.87",
    reviews: "430",
    inclusionsEn: [
      "Targeted mist spray on mattress piping, bed cot joints & headboards",
      "Baseboard and curtain seam crack & crevice treatment",
      "Destroys live bugs and neutralizes hatching eggs",
      "30-day warranty coverage for treated room"
    ],
    inclusionsTe: [
      "మ్యాట్రెస్ అంచులు, మంచం జాయింట్లు & హెడ్‌బోర్డులపై ప్రత్యేక మిస్టింగ్ స్ప్రే",
      "గోడల పగుళ్లు, కర్టెన్ల వద్ద దాక్కున్న నల్లుల నిర్మూలన",
      "గుడ్లను సైతం నాశనం చేసే సమర్థవంతమైన రసాయనాలు",
      "ట్రీట్ చేసిన గదికి 30 రోజుల వారంటీ"
    ],
    imageSrc: "/images/service-pest-bedbug.jpg",
    category: "pest",
    subcategory: "bedbug-control",
  },
  {
    id: "pest-bedbug-complete",
    titleEn: "Complete Home Bedbug Protocol (2 Visits)",
    titleTe: "పూర్తి ఇల్లు నల్లుల నివారణ (2 విజిట్స్)",
    price: 2199,
    originalPrice: 2599,
    durationEn: "90 mins",
    durationTe: "90 నిమిషాలు",
    rating: "4.92",
    reviews: "380",
    inclusionsEn: [
      "Day 1: Comprehensive misting across all beds, sofas & living spaces",
      "Day 15: Mandatory follow-up visit to eliminate newly hatched nymphs",
      "60-Day extended peace-of-mind guarantee"
    ],
    inclusionsTe: [
      "రోజు 1: అన్ని బెడ్లు, సోఫాలు & గదులలో పూర్తి మిస్టింగ్ చికిత్స",
      "రోజు 15: కొత్తగా గుడ్ల నుంచి వచ్చే పిల్ల పురుగుల నివారణకు 2వ విజిట్",
      "60 రోజుల పొడిగించిన రక్షణ గ్యారెంటీ"
    ],
    imageSrc: "/images/service-pest-bedbug.jpg",
    category: "pest",
    subcategory: "bedbug-control",
  },
  {
    id: "pest-termite-sqft",
    titleEn: "Anti-Termite Drill-Fill-Seal (Per Sq. Ft.)",
    titleTe: "యాంటీ-టెర్మటైట్ డ్రిల్ & సీల్ (చ.అ.కు)",
    price: 8,
    originalPrice: 10,
    durationEn: "Custom",
    durationTe: "విస్తీర్ణాన్ని బట్టి",
    rating: "4.89",
    reviews: "260",
    inclusionsEn: [
      "Precision drilling along wall skirting joints at 1-foot intervals",
      "Certified termiticide chemical pressure injection into soil base",
      "Holes sealed neatly with matching white/grey cement",
      "1-Year to 5-Year warranty options available"
    ],
    inclusionsTe: [
      "గోడల మూలల్లో అడుగు దూరంలో ప్రత్యేక డ్రిల్లింగ్",
      "భూమిలోకి సర్టిఫైడ్ కెమికల్ ప్రెజర్ ఇంజెక్షన్",
      "సిమెంటుతో రంధ్రాలను అందంగా పూడ్చివేయడం",
      "1 నుండి 5 సంవత్సరాల వారంటీ ఎంపికలు"
    ],
    imageSrc: "/images/service-pest-termite.jpg",
    category: "pest",
    subcategory: "termite-control",
  },
  {
    id: "pest-rodent-mosquito",
    titleEn: "Rodent Baiting & Drain Sanitization",
    titleTe: "ఎలుకలు & డ్రెయిన్ శానిటైజేషన్",
    price: 699,
    originalPrice: 799,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.81",
    reviews: "190",
    inclusionsEn: [
      "Heavy-duty professional glue boards placed in entry runways",
      "Non-toxic drain disinfectant granules to repel drain flies & mosquitoes"
    ],
    inclusionsTe: [
      "ఎలుకలు తిరిగే దారుల్లో ప్రొఫెషనల్ గ్లూ బోర్డులు ఉంచడం",
      "దోమలు & డ్రెయిన్ ఫ్లైస్ రాకుండా సురక్షిత శానిటైజేషన్"
    ],
    imageSrc: "/images/service-pest-general.jpg",
    category: "pest",
    subcategory: "mosquito-rodents",
  },
];

// 3. HOME DEEP CLEANING SUB-CATEGORIES & PACKAGES
export const CLEANING_SUBCATEGORIES = [
  { id: "full-home", labelEn: "Full Home Deep Clean", labelTe: "పూర్తి ఇల్లు డీప్ క్లీన్" },
  { id: "bathroom-scrub", labelEn: "Bathroom Deep Scrub", labelTe: "బాత్‌రూమ్ స్క్రబ్" },
  { id: "kitchen-degrease", labelEn: "Kitchen Degreasing", labelTe: "కిచెన్ డీగ్రీసింగ్" },
  { id: "balcony-sofa", labelEn: "Balcony & Sofa", labelTe: "బాల్కనీ & సోఫా" },
] as const;

export const CLEANING_SERVICE_ITEMS: UCServiceItemData[] = [
  {
    id: "clean-1bhk",
    titleEn: "1 BHK Full Apartment Deep Clean",
    titleTe: "1 BHK పూర్తి ఇల్లు డీప్ క్లీన్",
    price: 2499,
    originalPrice: 2899,
    durationEn: "3–4 hours",
    durationTe: "3–4 గంటలు",
    rating: "4.82",
    reviews: "620",
    inclusionsEn: [
      "Single-disc industrial machine floor scrubbing & wet-dry vacuuming",
      "Kitchen counters, tile degreasing, sink polishing & cabinet wipe-down",
      "Bathroom wall tile acid-free descaling, toilet bowl sanitization & tap shining",
      "Ceiling fans, switchboards, window glass & balcony floor washing",
      "24-Hour customer satisfaction inspection check"
    ],
    inclusionsTe: [
      "సింగిల్-డిస్క్ మెషీన్‌తో ఫ్లోర్ స్క్రబ్బింగ్ & వాక్యూమ్ క్లీనింగ్",
      "కిచెన్ కౌంటర్స్, ఆయిల్ మరకల తొలగింపు & సింక్ క్రోమ్ పాలిషింగ్",
      "యాసిడ్ లేని రసాయనాలతో బాత్రూమ్ టైల్స్ & టాయిలెట్ డీప్ శానిటైజేషన్",
      "సీలింగ్ ఫ్యాన్లు, స్విచ్‌బోర్డులు, కిటికీ అద్దాలు & బాల్కనీ క్లీనింగ్",
      "24-గంటల క్వాలిటీ చెక్ హామీ"
    ],
    exclusionsEn: ["Painting, terrace washing, or chandelier dismantling"],
    exclusionsTe: ["రంగులు వేయడం లేదా టెర్రస్ క్లీనింగ్"],
    imageSrc: "/images/service-cleaning-home.jpg",
    category: "cleaning",
    subcategory: "full-home",
  },
  {
    id: "clean-2bhk",
    titleEn: "2 BHK Full Apartment Deep Clean",
    titleTe: "2 BHK పూర్తి ఇల్లు డీప్ క్లీన్",
    price: 3499,
    originalPrice: 3999,
    durationEn: "4–5 hours",
    durationTe: "4–5 గంటలు",
    rating: "4.86",
    reviews: "910",
    inclusionsEn: [
      "Complete coverage: Living hall + 2 bedrooms + kitchen + 2 bathrooms",
      "Heavy grime floor buffing with rotary scrubbing machine",
      "Reachable doors, windows, wardrobe exteriors wiped clean",
      "24-Hour satisfaction check"
    ],
    inclusionsTe: [
      "హాల్ + 2 బెడ్రూమ్‌లు + కిచెన్ + 2 బాత్‌రూమ్‌ల పూర్తి డీప్ క్లీనింగ్",
      "రోటరీ మెషీన్‌తో ఫ్లోర్ మరకల తొలగింపు & పాలిష్",
      "వార్డ్‌రోబ్స్ వెలుపలి భాగాలు, తలుపులు & కిటికీల క్లీనింగ్",
      "24-గంటల క్వాలిటీ చెక్"
    ],
    imageSrc: "/images/service-cleaning-home.jpg",
    category: "cleaning",
    subcategory: "full-home",
  },
  {
    id: "clean-3bhk",
    titleEn: "3 BHK Full Apartment Deep Clean",
    titleTe: "3 BHK పూర్తి ఇల్లు డీప్ క్లీన్",
    price: 4499,
    originalPrice: 4999,
    durationEn: "5–6 hours",
    durationTe: "5–6 గంటలు",
    rating: "4.89",
    reviews: "540",
    inclusionsEn: [
      "Intensive 3 BHK deep clean with 3-member expert crew",
      "All 3 bathrooms descaled & chrome taps polished",
      "Balcony power wash & kitchen grease removal"
    ],
    inclusionsTe: [
      "3-సభ్యుల నిపుణుల బృందంతో 3 BHK పూర్తి డీప్ క్లీనింగ్",
      "3 బాత్‌రూమ్‌లలో టైల్స్ ఉప్పు మరకల తొలగింపు & పాలిషింగ్",
      "బాల్కనీ వాష్ & కిచెన్ నూనె మరకల నివారణ"
    ],
    imageSrc: "/images/service-cleaning-home.jpg",
    category: "cleaning",
    subcategory: "full-home",
  },
  {
    id: "clean-villa",
    titleEn: "Gruhapravesam / Independent Villa Deep Clean",
    titleTe: "గృహప్రవేశం / విల్లా పూర్తి డీప్ క్లీన్",
    price: 5999,
    originalPrice: 6999,
    durationEn: "Full Day",
    durationTe: "పూర్తి రోజు",
    rating: "4.94",
    reviews: "320",
    inclusionsEn: [
      "Post-construction paint drops, cement stains & plaster dust removal",
      "Machine floor polishing across all floors, staircases & railings",
      "Dedicated multi-technician squad in official uniform"
    ],
    inclusionsTe: [
      "గృహప్రవేశం లేదా పెయింటింగ్ తర్వాత సిమెంట్ & సున్నం మరకల తొలగింపు",
      "అన్ని ఫ్లోర్లు, మెట్లు & రెయిలింగ్స్ మెషీన్ బఫింగ్",
      "అధికారిక బ్లాక్ యూనిఫాం నిపుణుల బృందం"
    ],
    imageSrc: "/images/service-cleaning-home.jpg",
    category: "cleaning",
    subcategory: "full-home",
  },
  {
    id: "clean-bathroom-single",
    titleEn: "Single Bathroom Acid-Free Scrub",
    titleTe: "ఒక బాత్రూమ్ యాసిడ్-ఫ్రీ డీప్ స్క్రబ్",
    price: 499,
    originalPrice: 599,
    durationEn: "60 mins",
    durationTe: "60 నిమిషాలు",
    rating: "4.85",
    reviews: "1.1k",
    inclusionsEn: [
      "Tile descaling to remove hard-water salt stains without damaging grout",
      "Western / Indian toilet bowl de-yellowing and sanitization",
      "Chrome tap, showerhead & mirror water-spot polishing",
      "Floor scrubbing & exhaust fan wipe"
    ],
    inclusionsTe: [
      "టైల్స్ గ్రౌట్ పాడవకుండా ఉప్పు నీటి మరకల తొలగింపు",
      "టాయిలెట్ కమోడ్ డీప్ శానిటైజేషన్",
      "షవర్, కుళాయిలు & అద్దంపై మరకల పాలిషింగ్",
      "ఫ్లోర్ స్క్రబ్బింగ్ & ఎగ్జాస్ట్ ఫ్యాన్ క్లీనింగ్"
    ],
    imageSrc: "/images/service-cleaning-bathroom.jpg",
    category: "cleaning",
    subcategory: "bathroom-scrub",
  },
  {
    id: "clean-bathroom-double",
    titleEn: "2 Bathrooms Intensive Scrub Pack",
    titleTe: "2 బాత్‌రూమ్‌ల ఇంటెన్సివ్ స్క్రబ్ ప్యాక్",
    price: 899,
    originalPrice: 1099,
    durationEn: "90 mins",
    durationTe: "90 నిమిషాలు",
    rating: "4.88",
    reviews: "780",
    inclusionsEn: [
      "Complete deep scrub for 2 bathrooms",
      "Hard water scale removal & disinfectant wash",
      "Chrome fixtures buffed to mirror shine"
    ],
    inclusionsTe: [
      "2 బాత్‌రూమ్‌లలో టైల్స్, బేసిన్ & కమోడ్ల డీప్ స్క్రబ్",
      "ఉప్పు మరకలు లేకుండా క్రిమిసంహారక వాష్",
      "కుళాయిలు & షవర్ల క్రోమ్ పాలిషింగ్"
    ],
    imageSrc: "/images/service-cleaning-bathroom.jpg",
    category: "cleaning",
    subcategory: "bathroom-scrub",
  },
  {
    id: "clean-kitchen-degrease",
    titleEn: "Kitchen Deep Scrub & Degreasing",
    titleTe: "కిచెన్ డీగ్రీసింగ్ & డీప్ స్క్రబ్",
    price: 699,
    originalPrice: 799,
    durationEn: "90 mins",
    durationTe: "90 నిమిషాలు",
    rating: "4.86",
    reviews: "690",
    inclusionsEn: [
      "Heavy oil & grease removal from wall tiles, counter slabs & sink",
      "Kitchen cabinets wiped externally and internal grease spots treated",
      "Chimney exterior, gas stove burners & exhaust fan degreasing"
    ],
    inclusionsTe: [
      "వంటగది టైల్స్, గట్టు & సింక్ వద్ద పేరుకుపోయిన నూనె మరకల తొలగింపు",
      "కిచెన్ క్యాబినెట్ల బాహ్య క్లీనింగ్ & జిడ్డు నివారణ",
      "గ్యాస్ స్టవ్ బర్నర్స్, చిమ్నీ వెలుపలి భాగం & ఎగ్జాస్ట్ ఫ్యాన్ వాష్"
    ],
    imageSrc: "/images/service-cleaning-kitchen.jpg",
    category: "cleaning",
    subcategory: "kitchen-degrease",
  },
  {
    id: "clean-balcony-wash",
    titleEn: "Balcony Floor Pressure Wash (Add-on)",
    titleTe: "బాల్కనీ ఫ్లోర్ ప్రెజర్ వాష్ (యాడ్-ఆన్)",
    price: 399,
    originalPrice: 499,
    durationEn: "30 mins",
    durationTe: "30 నిమిషాలు",
    rating: "4.80",
    reviews: "210",
    inclusionsEn: [
      "Floor scrubbing to remove pigeon dirt, algae & dried mud",
      "Balcony railings and drain mouth cleaned"
    ],
    inclusionsTe: [
      "బాల్కనీ ఫ్లోర్ మురికి, నాచు & మరకల మెషీన్ వాష్",
      "రెయిలింగ్స్ & డ్రెయిన్ పైప్ క్లీనింగ్"
    ],
    imageSrc: "/images/service-cleaning-home.jpg",
    category: "cleaning",
    subcategory: "balcony-sofa",
  },
];
