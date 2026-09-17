export type Language = "en" | "te";

export interface SubServiceOption {
  id: string;
  labelEn: string;
  labelTe: string;
  icon: string;
  startingPriceEn: string;
  startingPriceTe: string;
  popular?: boolean;
  descEn?: string;
  descTe?: string;
}

export interface ServiceDefinition {
  id: "pest-control" | "ac-services" | "home-cleaning";
  icon: string;
  colorHex: string;
  badgeBg: string;
  accentBorder: string;
  titleEn: string;
  titleTe: string;
  subEn: string;
  subTe: string;
  priceEn: string;
  priceTe: string;
  badgeEn: string;
  badgeTe: string;
  includedEn: string[];
  includedTe: string[];
  excludedEn: string[];
  excludedTe: string[];
  subtypes: SubServiceOption[];
}

export const SERVICES_DATA: ServiceDefinition[] = [
  {
    id: "pest-control",
    icon: "🪳",
    colorHex: "#FF5A3C",
    accentBorder: "border-t-4 border-[#FF5A3C]",
    badgeBg: "bg-[#FF5A3C]/10 text-[#FF5A3C] border-[#FF5A3C]/20",
    titleEn: "Pest Control",
    titleTe: "పురుగుల నివారణ",
    subEn: "Cockroaches, Bedbugs (Nallulu), Termites (Chedalu)",
    subTe: "బొద్దింకలు, మంచం నల్లులు, చెదపురుగులు",
    priceEn: "From ₹1,499",
    priceTe: "₹1,499 నుండి",
    badgeEn: "🛡️ 30-Day Warranty (Terms Apply)",
    badgeTe: "🛡️ 30 రోజుల వారంటీ (నిబంధనలు వర్తిస్తాయి)",
    includedEn: [
      "Low-odor, government-approved certified chemicals",
      "Deep spray behind fridge, kitchen cabinets, drain corners & switchboards",
      "Safe for children, elderly parents & household pets when applied as per protocol",
      "30-day rework warranty: covers same pest type in treated rooms (terms apply)"
    ],
    includedTe: [
      "ప్రభుత్వ ఆమోదం పొందిన సురక్షితమైన, స్వల్ప వాసన గల రసాయనాలు",
      "కిచెన్ కేబినెట్స్, డ్రెయిన్స్, ఫ్రిజ్ వెనుక, స్విచ్‌బోర్డుల వద్ద లోతైన ట్రీట్మెంట్",
      "పిల్లలు, వృద్ధులు మరియు పెంపుడు జంతువులకు సురక్షితమైన వినియోగ పద్ధతులు",
      "30 రోజుల రీవిజిట్ వారంటీ: ట్రీట్ చేసిన గదుల్లో పురుగులు కనిపిస్తే రీ-సర్వీస్ (నిబంధనలు వర్తిస్తాయి)"
    ],
    excludedEn: [
      "Plumbing pipe replacement or major wall hole sealing",
      "Outdoor garden or open street area spraying without approval"
    ],
    excludedTe: [
      "ప్లంబింగ్ పైపుల రిపేర్లు లేదా పెద్ద గోడ రంధ్రాలు పూడ్చడం",
      "ముందస్తు అనుమతి లేకుండా ఇంటి వెలుపలి బహిరంగ స్థలాల్లో స్ప్రే చేయడం"
    ],
    subtypes: [
      {
        id: "cockroach",
        labelEn: "General Pest (1 BHK)",
        labelTe: "సాధారణ పురుగుల నివారణ (1 BHK)",
        icon: "🪳",
        startingPriceEn: "From ₹1,499",
        startingPriceTe: "₹1,499 నుండి",
        popular: true,
        descEn: "Kitchen & drain gel + spray with 30-day warranty (terms apply)",
        descTe: "కిచెన్ & డ్రెయిన్లలో జెల్ మరియు స్ప్రే (30 రోజుల వారంటీ)"
      },
      {
        id: "bedbug",
        labelEn: "Bedbugs (Per Room)",
        labelTe: "మంచం నల్లులు (ప్రతి గదికి)",
        icon: "🛏️",
        startingPriceEn: "From ₹999/room",
        startingPriceTe: "గదికి ₹999 నుండి",
        popular: true,
        descEn: "Targeted seam misting & egg eradication protocol",
        descTe: "నల్లులు మరియు గుడ్లను నాశనం చేసే ప్రత్యేక ట్రీట్మెంట్"
      },
      {
        id: "termite",
        labelEn: "Termite Barrier Treatment",
        labelTe: "చెదపురుగుల నివారణ (చ.అ.కు)",
        icon: "🪵",
        startingPriceEn: "From ₹8/sqft",
        startingPriceTe: "చ.అ.కు ₹8 నుండి",
        descEn: "Wood injection & floor drilling chemical barrier",
        descTe: "చెక్క సామాగ్రికి ఇంజెక్షన్ మరియు నేల డ్రిల్లింగ్ రక్షణ"
      },
      {
        id: "general",
        labelEn: "Kitchen Gel Treatment (Add-on)",
        labelTe: "కిచెన్ డీప్ ట్రీట్మెంట్",
        icon: "🍳",
        startingPriceEn: "From ₹699",
        startingPriceTe: "₹699 నుండి",
        descEn: "Focused kitchen cabinet gel baiting and drain spray",
        descTe: "కిచెన్ ప్రాంతాల్లో ఫోకస్డ్ జెల్ బెయిటింగ్ మరియు స్ప్రే"
      }
    ]
  },
  {
    id: "ac-services",
    icon: "❄️",
    colorHex: "#3BA3FF",
    accentBorder: "border-t-4 border-[#3BA3FF]",
    badgeBg: "bg-[#3BA3FF]/10 text-[#0066CC] border-[#3BA3FF]/20",
    titleEn: "AC Services",
    titleTe: "ఏసీ సర్వీస్ & రిపేర్",
    subEn: "Water Jacket Foam Jet, Leak Fix, Installation, Gas Refill",
    subTe: "వాటర్ జాకెట్ ఫోమ్ జెట్, లీక్ ఫిక్స్, ఇన్‌స్టాలేషన్, గ్యాస్",
    priceEn: "From ₹599",
    priceTe: "₹599 నుండి",
    badgeEn: "⚡ 15-Day Cooling Warranty",
    badgeTe: "⚡ 15 రోజుల కూలింగ్ వారంటీ",
    includedEn: [
      "High-pressure foam jet wash with water jacket (zero wall mess)",
      "Gas pressure & cooling temperature drop check with gauges",
      "Indoor unit drain tray flush to stop indoor water dripping",
      "15-day cooling & leak warranty on foam jet service"
    ],
    includedTe: [
      "వాటర్ జాకెట్‌తో గోడలపై మరకలు లేకుండా హై-ప్రెజర్ ఫోమ్ జెట్ వాష్",
      "డిజిటల్ గేజ్‌లతో గ్యాస్ ప్రెజర్ మరియు కూలింగ్ టెస్టింగ్",
      "రూమ్‌లో నీళ్లు కారకుండా డ్రెయిన్ ట్రే శుభ్రం చేయడం",
      "ఫోమ్ జెట్ సర్వీస్‌పై 15 రోజుల కూలింగ్ మరియు లీక్ వారంటీ"
    ],
    excludedEn: [
      "New copper pipes or scaffolding exceeding standard reach (quoted on site)",
      "Electrician electrical meter/MCB line replacement"
    ],
    excludedTe: [
      "అదనపు కాపర్ పైపులు లేదా చాలా ఎత్తైన గోడలకు ప్రత్యేక పరంజా చార్జీలు",
      "ఇంటి మెయిన్ మీటర్ లేదా బోర్డు ఎలక్ట్రికల్ లైన్ రిపేర్లు"
    ],
    subtypes: [
      {
        id: "ac-service",
        labelEn: "Split AC Foam Jet Wash",
        labelTe: "స్ప్లిట్ ఏసీ ఫోమ్ జెట్ వాష్",
        icon: "🚿",
        startingPriceEn: "From ₹599",
        startingPriceTe: "₹599 నుండి",
        popular: true,
        descEn: "Deep coil clean with water jacket (15-day cooling warranty)",
        descTe: "గోడలపై మరకలు లేకుండా డీప్ వాష్ (15 రోజుల వారంటీ)"
      },
      {
        id: "ac-cooling",
        labelEn: "Inspection & Diagnosis",
        labelTe: "కూలింగ్ సమస్య / తనిఖీ",
        icon: "❄️",
        startingPriceEn: "From ₹299",
        startingPriceTe: "₹299 నుండి",
        descEn: "Complete diagnosis (fee adjusted against repair bill)",
        descTe: "సమస్య సమగ్ర పరిశీలన (రిపేర్ చేయిస్తే ఫీజు మినహాయింపు)"
      },
      {
        id: "ac-install",
        labelEn: "Split AC Installation",
        labelTe: "స్ప్లిట్ ఏసీ ఇన్‌స్టాలేషన్",
        icon: "🔧",
        startingPriceEn: "From ₹899",
        startingPriceTe: "₹899 నుండి",
        descEn: "Level bracket mounting & pipe leak check",
        descTe: "పర్ఫెక్ట్ లెవల్ ఫిట్టింగ్ & లీక్ చెక్"
      },
      {
        id: "ac-repair",
        labelEn: "Gas Leak Fix & Refill",
        labelTe: "గ్యాస్ లీక్ చెక్ & రీఫిల్",
        icon: "⚙️",
        startingPriceEn: "From ₹1,999",
        startingPriceTe: "₹1,999 నుండి",
        descEn: "Nitrogen pressure testing & exact refrigerant charging",
        descTe: "ప్రెజర్ టెస్టింగ్ మరియు నాణ్యమైన గ్యాస్ రీఫిల్"
      }
    ]
  },
  {
    id: "home-cleaning",
    icon: "🧹",
    colorHex: "#2FBF9B",
    accentBorder: "border-t-4 border-[#2FBF9B]",
    badgeBg: "bg-[#2FBF9B]/10 text-[#0E8A6B] border-[#2FBF9B]/20",
    titleEn: "Home Deep Cleaning",
    titleTe: "ఇంటి డీప్ క్లీనింగ్",
    subEn: "1 BHK, 2 BHK, 3 BHK Full Home & Kitchen Degrease",
    subTe: "1 BHK, 2 BHK, 3 BHK పూర్తి ఇల్లు & కిచెన్ డీగ్రీస్",
    priceEn: "1 BHK From ₹2,499",
    priceTe: "1 BHK ₹2,499 నుండి",
    badgeEn: "✨ Supervised Quality (24-Hr Check)",
    badgeTe: "✨ నాణ్యతా పర్యవేక్షణ (24 గంటల చెక్)",
    includedEn: [
      "Single-disc machine floor scrubbing & dry vacuuming",
      "Heavy oil, carbon & grease removal from kitchen tiles & slabs",
      "Bathroom acid-free descaling of taps, showerheads & wall tiles",
      "Ceiling fans, switchboards, doors, and reachable balcony washing"
    ],
    includedTe: [
      "సింగిల్-డిస్క్ మెషిన్ ఫ్లోర్ స్క్రబ్బింగ్ మరియు వాక్యూమింగ్",
      "కిచెన్ టైల్స్, గ్యాస్ బండలపై మొండి నూనె జిడ్డు తొలగింపు",
      "బాత్‌రూమ్ టైల్స్, పంపులపై ఉప్పు మరకల డీస్కేలింగ్ & టాయిలెట్ శానిటైజ్",
      "సీలింగ్ ఫ్యాన్లు, స్విచ్‌బోర్డులు, తలుపులు మరియు బాల్కనీ వాష్"
    ],
    excludedEn: [
      "Painting, wall seepage repair, or broken tile fixes",
      "Moving heavy solid wood almirahs with fragile valuables inside"
    ],
    excludedTe: [
      "గోడల పెయింటింగ్ లేదా పగిలిన టైల్స్ రిపేర్లు",
      "విలువైన వస్తువులు ఉన్న భారీ చెక్క బీరువాలను తరలించడం"
    ],
    subtypes: [
      {
        id: "full-home-1bhk",
        labelEn: "1 BHK Full Home Clean",
        labelTe: "1 BHK ఇల్లు డీప్ క్లీన్",
        icon: "🏡",
        startingPriceEn: "From ₹2,499",
        startingPriceTe: "₹2,499 నుండి",
        popular: true,
        descEn: "Living room, 1 bedroom, kitchen & washroom scrub",
        descTe: "హాల్, 1 బెడ్రూమ్, కిచెన్ & బాత్‌రూమ్ డీప్ క్లీన్"
      },
      {
        id: "full-home-2bhk",
        labelEn: "2 BHK Full Home Clean",
        labelTe: "2 BHK ఇల్లు డీప్ క్లీన్",
        icon: "🏡",
        startingPriceEn: "From ₹3,499",
        startingPriceTe: "₹3,499 నుండి",
        popular: true,
        descEn: "Complete home scrub with 2 washrooms & balconies",
        descTe: "పూర్తి ఇల్లు, 2 బాత్‌రూమ్‌లు మరియు బాల్కనీలు"
      },
      {
        id: "kitchen-deep",
        labelEn: "Kitchen Degreasing (Add-on)",
        labelTe: "కిచెన్ డీగ్రీసింగ్ (ప్రత్యేక విభాగం)",
        icon: "🍳",
        startingPriceEn: "From ₹699",
        startingPriceTe: "₹699 నుండి",
        descEn: "Counters, tiles, hood exterior & burners degreased",
        descTe: "టైల్స్, కౌంటర్లు, గ్యాస్ బండల నూనె జిడ్డు తొలగింపు"
      },
      {
        id: "bathroom-deep",
        labelEn: "Bathroom Scrub (Add-on)",
        labelTe: "బాత్‌రూమ్ డీస్కేలింగ్ (ప్రత్యేక విభాగం)",
        icon: "🚽",
        startingPriceEn: "From ₹499",
        startingPriceTe: "₹499 నుండి",
        descEn: "Acid-free hard-water tile descaling & mirror polishing",
        descTe: "ఉప్పు మరకలు, టైల్స్ క్లీనింగ్ & శానిటైజేషన్"
      }
    ]
  }
];

export const NELLORE_AREAS = [
  { en: "Trunk Road", te: "ట్రంక్ రోడ్" },
  { en: "Magunta Layout", te: "మాగుంట లేఅవుట్" },
  { en: "Pogathota", te: "పొగతోట" },
  { en: "Haranathapuram", te: "హరనాథపురం" },
  { en: "Dargamitta", te: "దర్గామిట్ట" },
  { en: "VRC Centre", te: "వి.ఆర్.సి సెంటర్" },
  { en: "Stonehousepet", te: "స్టోన్‌హౌస్‌పేట" },
  { en: "Vedayapalem", te: "వేదాయపాలెం" },
  { en: "Podalakur Road", te: "పొదలకూరు రోడ్" },
  { en: "Ramalingapuram", te: "రామలింగపురం" },
  { en: "Kovur Road / Kovuru", te: "కోవూరు" },
  { en: "Muthukur Road", te: "ముత్తుకూరు రోడ్" },
  { en: "Santhi Nagar", te: "శాంతి నగర్" },
  { en: "Fathekhanpet", te: "ఫతేఖాన్ పేట" },
  { en: "Nawabpet", te: "నవాబ్‌పేట" },
  { en: "Other Area in Nellore", te: "నెల్లూరులోని ఇతర ప్రాంతం" }
];

export const PROPERTY_SIZES = [
  { id: "1bhk", labelEn: "1 BHK", labelTe: "1 BHK" },
  { id: "2bhk", labelEn: "2 BHK", labelTe: "2 BHK" },
  { id: "3bhk", labelEn: "3 BHK / House", labelTe: "3 BHK / సొంత ఇల్లు" },
  { id: "villa", labelEn: "Villa / Independent House", labelTe: "విల్లా / స్వతంత్ర ఇల్లు" }
];

export const TIME_SLOTS = [
  { id: "morning", labelEn: "Morning (9 AM - 1 PM)", labelTe: "ఉదయం (9 AM - 1 PM)", icon: "🌅" },
  { id: "afternoon", labelEn: "Afternoon (1 PM - 4 PM)", labelTe: "మధ్యాహ్నం (1 PM - 4 PM)", icon: "☀️" },
  { id: "evening", labelEn: "Evening (4 PM - 8 PM)", labelTe: "సాయంత్రం (4 PM - 8 PM)", icon: "🌆" }
];

export const TRUST_PROMISES = [
  {
    icon: "🤝",
    titleEn: "Partnered with Established Local Experts",
    titleTe: "స్థానిక ప్రముఖ నిపుణులతో భాగస్వామ్యం",
    descEn: "We collaborate with Nellore's already-established, top-rated technicians — onboarding them under Osmida's supervised standards, official black uniform, and official photo ID card.",
    descTe: "నెల్లూరులో ఇప్పటికే గుర్తింపు పొందిన అనుభవజ్ఞులైన స్థానిక నిపుణులతో భాగస్వామ్యం. వారి నైపుణ్యానికి ఓస్మిడా పర్యవేక్షణ, అధికారిక యూనిఫాం మరియు నాణ్యతా రక్షణ తోడవుతాయి."
  },
  {
    icon: "💰",
    titleEn: "₹0 Advance • Pay After Service",
    titleTe: "₹0 అడ్వాన్స్ • పని అయ్యాకే చెల్లింపు",
    descEn: "Never pay upfront. Inspect the completed work first, then pay via UPI or Cash.",
    descTe: "ముందుగా రూపాయి కూడా ఇవ్వక్కర్లేదు. పని చూసి సంతృప్తి చెందాకే చెల్లించండి."
  },
  {
    icon: "⚡",
    titleEn: "30-Minute Call Confirmation",
    titleTe: "30 నిమిషాల్లో కాల్ నిర్ధారణ",
    descEn: "Our local Nellore coordinator calls you to confirm exact arrival time.",
    descTe: "మా నెల్లూరు కోఆర్డినేటర్ మీకు కాల్ చేసి ఖచ్చితమైన సమయాన్ని ఖాయం చేస్తారు."
  },
  {
    icon: "🔄",
    titleEn: "Up to 30-Day Service Warranty",
    titleTe: "30 రోజుల వరకు సర్వీస్ వారంటీ",
    descEn: "30-day rework warranty on pest control; 15-day warranty on AC cooling (terms apply).",
    descTe: "పురుగుల నివారణపై 30 రోజుల వారంటీ; ఏసీపై 15 రోజుల వారంటీ (నిబంధనలు వర్తిస్తాయి)."
  }
];

export const FAQ_LIST = [
  {
    qEn: "Do I have to pay any advance online?",
    qTe: "ఆన్‌లైన్‌లో ఏదైనా అడ్వాన్స్ చెల్లించాలా?",
    aEn: "No! Booking is 100% free (₹0). You only pay after our expert finishes the job and you inspect the results.",
    aTe: "అవసరం లేదు! బుకింగ్ పూర్తిగా ఉచితం (₹0). పని పూర్తయి, మీరు చూసి సంతృప్తి చెందిన తర్వాతే గూగుల్ పే, ఫోన్‌పే లేదా క్యాష్ ద్వారా చెల్లించవచ్చు."
  },
  {
    qEn: "Are pest control chemicals safe for my children and elderly parents?",
    qTe: "పురుగుల మందులు పిల్లలు, పెద్దలకు సురక్షితమేనా?",
    aEn: "Yes. We use certified, low-odor chemicals approved by the government. When applied according to standard safety guidelines, they are safe for homes with children and elders.",
    aTe: "ఖచ్చితంగా సురక్షితం. మేము ప్రభుత్వ ఆమోదం పొందిన, స్వల్ప వాసన గల నాణ్యమైన మందులను మాత్రమే ఉపయోగిస్తాము. నిబంధనల ప్రకారం వాడినప్పుడు పిల్లలు, పెద్దలకు సురక్షితం."
  },
  {
    qEn: "What if pests come back after treatment?",
    qTe: "ట్రీట్మెంట్ తర్వాత మళ్లీ పురుగులు వస్తే ఏమిటి?",
    aEn: "We provide a 30-day rework warranty on general pest control (terms apply: covers the same pest type in treated rooms). Simply message or call us, and our technician will re-treat the area.",
    aTe: "సాధారణ పెస్ట్ కంట్రోల్‌కు 30 రోజుల రీవిజిట్ వారంటీ ఉంటుంది (నిబంధనలు వర్తిస్తాయి: ట్రీట్ చేసిన గదుల్లో అదే సమస్య ఉంటే వర్తిస్తుంది). వాట్సాప్ లేదా కాల్ చేస్తే మళ్లీ సర్వీస్ చేస్తాము."
  },
  {
    qEn: "Can I book for my parents living in Nellore while I am in another city/overseas?",
    qTe: "నేను వేరే ఊరిలో ఉంటూ నెల్లూరులో ఉన్న మా తల్లిదండ్రులకు బుక్ చేయవచ్చా?",
    aEn: "Yes! Many customers book for their family in Nellore. We keep you updated via WhatsApp with inspection photos and billing.",
    aTe: "ఖచ్చితంగా చేయవచ్చు! చాలామంది తమ తల్లిదండ్రుల కోసం బుక్ చేస్తుంటారు. పని వివరాలు, ఫోటోలు మేము మీకు వాట్సాప్‌లో పంపిస్తాము."
  }
];

export const UI_TEXT = {
  en: {
    brandTagline: "Nellore's Trusted Home Services",
    callNumber: "+917676358162",
    callDisplay: "+91 76763 58162",
    callNow: "Call Now",
    whatsappUs: "WhatsApp Us",
    heroTitle: "What do you need help with today?",
    heroSub: "Launching 1st in Nellore — collaborating with established local technicians • ₹0 advance • 30-day warranty",
    chooseService: "Choose Service",
    selectPestOrIssue: "Select specific requirement:",
    selectSize: "Select house / space size:",
    selectSlot: "Preferred service time:",
    whatsIncluded: "What is included in this service:",
    whatsExcluded: "What is excluded (transparent scope):",
    bookNow: "Book Online in 60 Secs",
    requestCall: "Request Free Inspection / Call",
    back: "Back",
    step1: "Service",
    step2: "Details",
    step3: "Book",
    step4: "Done",
    formHeading: "Enter details for your 30-min call confirmation",
    formSub: "No advance payment. Our local Nellore team will call you to confirm the exact slot.",
    nameLabel: "Your Name",
    namePlaceholder: "e.g. Kiran Kumar",
    phoneLabel: "Mobile / WhatsApp Number",
    phonePlaceholder: "10-digit mobile number",
    areaLabel: "Your Area in Nellore",
    notesLabel: "Problem details or landmark (Optional)",
    notesPlaceholder: "e.g. Near Ramalayam Temple / Cockroaches in kitchen",
    confirmBooking: "Confirm Booking (Free ₹0)",
    submitting: "Confirming...",
    trustLine1: "Nellore Established Partners",
    trustLine2: "30-Day Guarantee",
    trustLine3: "Pay After Service",
    successTitle: "Booking Request Received!",
    successSub: "Our Nellore coordinator will call you within 30 minutes to confirm your slot.",
    refId: "Reference ID",
    serviceBooked: "Service",
    areaBooked: "Area",
    slotBooked: "Preferred Slot",
    urgentCallText: "Need urgent service today? Call our coordinator directly:",
    saveOnWhatsApp: "Save on WhatsApp / Share with Family",
    bookAnother: "Book Another Service",
    localAddress: "Fathekhanpet / Trunk Road, Nellore, AP - 524003",
    testimonialsTitle: "What Nellore Families & Businesses Say",
    viewRateCard: "View Rate Card",
    voiceNoteTitle: "Too busy to type? Send a Voice Note or Photo on WhatsApp!",
    voiceNoteSub: "Our team speaks fluent Telugu and English. We'll book your slot directly.",
    faqTitle: "Frequently Asked Questions",
    safetyTitle: "The Osmida Safety & Quality Promise"
  },
  te: {
    brandTagline: "నెల్లూరులో నమ్మకమైన హోమ్ సర్వీసెస్",
    callNumber: "+917676358162",
    callDisplay: "+91 76763 58162",
    callNow: "కాల్ చేయండి",
    whatsappUs: "వాట్సాప్‌లో మాట్లాడండి",
    heroTitle: "ఈ రోజు మీ ఇంటికి ఏ సేవ కావాలి?",
    heroSub: "నెల్లూరులో తొలిసారిగా ప్రారంభం — స్థానిక ప్రముఖ నిపుణులతో భాగస్వామ్యం • ₹0 అడ్వాన్స్ • 30 రోజుల వారంటీ",
    chooseService: "సేవను ఎంచుకోండి",
    selectPestOrIssue: "మీ సమస్య లేదా అవసరాన్ని ఎంచుకోండి:",
    selectSize: "ఇంటి లేదా స్పేస్ సైజు ఎంచుకోండి:",
    selectSlot: "మీకు అనుకూలమైన సమయం:",
    whatsIncluded: "ఈ సర్వీస్‌లో ఏమి ఉంటుంది:",
    whatsExcluded: "ఇందులో ఏమి ఉండవు (పారదర్శక నిబంధనలు):",
    bookNow: "60 సెకన్లలో ఆన్‌లైన్ బుకింగ్",
    requestCall: "ఉచిత తనిఖీ / కాల్ అభ్యర్థించండి",
    back: "వెనుకకు",
    step1: "సర్వీస్",
    step2: "వివరాలు",
    step3: "బుకింగ్",
    step4: "పూర్తి",
    formHeading: "30 నిమిషాల్లో కాల్ నిర్ధారణ కోసం వివరాలు నమోదు చేయండి",
    formSub: "ముందస్తు చెల్లింపు అవసరం లేదు. మా స్థానిక నెల్లూరు బృందం కాల్ చేసి సమయం ఖాయం చేస్తుంది.",
    nameLabel: "మీ పేరు",
    namePlaceholder: "ఉదా: కిరణ్ కుమార్",
    phoneLabel: "మొబైల్ / వాట్సాప్ నంబర్",
    phonePlaceholder: "10 అంకెల మొబైల్ నంబర్",
    areaLabel: "నెల్లూరులోని మీ ప్రాంతం",
    notesLabel: "సమస్య వివరాలు లేదా గుర్తు (ఐచ్ఛికం)",
    notesPlaceholder: "ఉదా: రామాలయం దగ్గర / కిచెన్‌లో ఎక్కువ బొద్దింకలు",
    confirmBooking: "బుకింగ్ ఖాయం చేయండి (ఉచితం ₹0)",
    submitting: "నమోదు అవుతోంది...",
    trustLine1: "స్థానిక ప్రముఖ నిపుణులు",
    trustLine2: "30 రోజుల వారంటీ",
    trustLine3: "పని పూర్తయ్యాక చెల్లింపు",
    successTitle: "మీ బుకింగ్ నమోదైంది!",
    successSub: "సమయాన్ని నిర్ధారించడానికి మా నెల్లూరు బృందం 30 నిమిషాల్లో మీకు కాల్ చేస్తుంది.",
    refId: "రిఫరెన్స్ నంబర్",
    serviceBooked: "ఎంచుకున్న సేవ",
    areaBooked: "ప్రాంతం",
    slotBooked: "అనుకూల సమయం",
    urgentCallText: "ఈ రోజే అర్జెంట్‌గా సర్వీస్ కావాలా? నేరుగా కాల్ చేయండి:",
    saveOnWhatsApp: "వాట్సాప్‌లో సేవ్ చేయండి / కుటుంబానికి పంపండి",
    bookAnother: "మరొక సేవను బుక్ చేయండి",
    localAddress: "ఫతేఖాన్ పేట / ట్రంక్ రోడ్, నెల్లూరు, ఏపీ - 524003",
    testimonialsTitle: "నెల్లూరు ప్రజల అనుభవాలు",
    viewRateCard: "ధరల పట్టిక",
    voiceNoteTitle: "టైప్ చేయడం ఇబ్బందా? వాట్సాప్‌లో వాయిస్ మెసేజ్ లేదా ఫొటో పంపండి!",
    voiceNoteSub: "మా టీమ్ మీతో తెలుగులో మాట్లాడి నేరుగా మీ స్లాట్‌ను ఖాయం చేస్తుంది.",
    faqTitle: "తరచూ అడిగే ప్రశ్నలు (FAQ)",
    safetyTitle: "ఆస్మిడా నాణ్యత & భద్రతా వాగ్దానం"
  }
};
