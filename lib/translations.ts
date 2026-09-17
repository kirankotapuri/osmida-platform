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
    priceEn: "Starting from ₹799",
    priceTe: "₹799 నుండి ప్రారంభం",
    badgeEn: "🛡️ 30-Day Free Revisit Guarantee",
    badgeTe: "🛡️ 30 రోజుల ఉచిత రీవిజిట్ గ్యారెంటీ",
    includedEn: [
      "100% Odorless, govt-approved certified chemicals",
      "Deep spray behind fridge, kitchen cabinets, drain corners & switchboards",
      "Safe for children, elderly parents, pregnancy & household pets",
      "30-day warranty: If pests return, we re-treat your home completely FREE"
    ],
    includedTe: [
      "100% వాసన లేని, ప్రభుత్వ ఆమోదం పొందిన సురక్షితమైన మందులు",
      "కిచెన్ కేబినెట్స్, డ్రెయిన్స్, ఫ్రిజ్ వెనుక, స్విచ్‌బోర్డుల వద్ద లోతైన ట్రీట్మెంట్",
      "పిల్లలు, వృద్ధులు మరియు పెంపుడు జంతువులకు పూర్తి రక్షణ",
      "30 రోజుల గ్యారెంటీ: పురుగులు మళ్లీ కనిపిస్తే ఉచితంగా మళ్లీ చేస్తాము"
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
        labelEn: "Cockroaches & Ants",
        labelTe: "బొద్దింకలు & చీమలు",
        icon: "🪳",
        startingPriceEn: "₹799",
        startingPriceTe: "₹799",
        popular: true,
        descEn: "Kitchen & drain gel + spray with 30-day warranty",
        descTe: "కిచెన్ & డ్రెయిన్లలో వాసన లేని జెల్ మరియు స్ప్రే"
      },
      {
        id: "bedbug",
        labelEn: "Bedbugs (Nallulu)",
        labelTe: "మంచం నల్లులు (2 విడతలు)",
        icon: "🛏️",
        startingPriceEn: "₹1,199",
        startingPriceTe: "₹1,199",
        popular: true,
        descEn: "2-visit deep steaming & spray to kill eggs",
        descTe: "గుడ్లను కూడా నాశనం చేసే 2 విడతల ట్రీట్మెంట్"
      },
      {
        id: "termite",
        labelEn: "Termites (Chedalu)",
        labelTe: "చెదపురుగులు (చెదలు)",
        icon: "🪵",
        startingPriceEn: "Free Inspection",
        startingPriceTe: "ఉచిత తనిఖీ",
        descEn: "Wood injection & floor drilling protection",
        descTe: "చెక్క సామాగ్రికి ఇంజెక్షన్ మరియు నేల డ్రిల్లింగ్"
      },
      {
        id: "general",
        labelEn: "Other / Rodents / Mosquitoes",
        labelTe: "ఇతర / ఎలుకలు / దోమలు",
        icon: "🦟",
        startingPriceEn: "₹699",
        startingPriceTe: "₹699",
        descEn: "Custom inspection and site-specific treatment",
        descTe: "పరిశీలన అనంతరం కచ్చితమైన పరిష్కారం"
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
    subEn: "Jet Pump Wash, Water Leakage, Gas Refill, Installation",
    subTe: "జెట్ వాష్, వాటర్ లీక్, గ్యాస్ లీక్, ఇన్‌స్టాలేషన్",
    priceEn: "Starting from ₹499",
    priceTe: "₹499 నుండి ప్రారంభం",
    badgeEn: "⚡ Same-Day Service in Nellore",
    badgeTe: "⚡ నెల్లూరులో అదే రోజు సర్వీస్",
    includedEn: [
      "High-pressure jet pump wash for indoor filters and outdoor condenser",
      "Gas pressure & cooling temperature check with digital gauges",
      "Drain pipe unclogging to stop water dripping inside room",
      "Written diagnosis and exact estimate before any replacement"
    ],
    includedTe: [
      "హై-ప్రెజర్ జెట్ పంప్‌తో ఇండోర్ ఫిల్టర్లు & ఔట్‌డోర్ కాయిల్స్ క్లీనింగ్",
      "డిజిటల్ మీటర్లతో గ్యాస్ ప్రెజర్ మరియు కూలింగ్ తనిఖీ",
      "రూమ్‌లో నీళ్లు కారకుండా డ్రెయిన్ పైపు క్లీన్ చేయడం",
      "ఏదైనా స్పేర్ పార్ట్ మార్చే ముందే స్పష్టమైన రేటు చెప్పడం"
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
        labelEn: "Jet Pump Master Service",
        labelTe: "జెట్ పంప్ వాష్ సర్వీస్",
        icon: "🚿",
        startingPriceEn: "₹499",
        startingPriceTe: "₹499",
        popular: true,
        descEn: "2x cooling speed boost & filter deep clean",
        descTe: "కూలింగ్ వేగం పెంచే లోతైన జెట్ వాష్"
      },
      {
        id: "ac-cooling",
        labelEn: "Low Cooling / Gas Leak Check",
        labelTe: "కూలింగ్ సమస్య / గ్యాస్ లీక్",
        icon: "❄️",
        startingPriceEn: "₹399 (Diagnosis)",
        startingPriceTe: "₹399 (తనిఖీ)",
        descEn: "Pressure test + gas refill estimate",
        descTe: "ప్రెజర్ టెస్ట్ మరియు గ్యాస్ రీఫిల్ అంచనా"
      },
      {
        id: "ac-install",
        labelEn: "Installation / Shifting",
        labelTe: "ఇన్‌స్టాలేషన్ / విప్పడం",
        icon: "🔧",
        startingPriceEn: "From ₹799",
        startingPriceTe: "₹799 నుండి",
        descEn: "Split & window AC safe mounting & vacuuming",
        descTe: "గోడకు భద్రంగా బిగించడం మరియు వ్యాక్యూమింగ్"
      },
      {
        id: "ac-repair",
        labelEn: "Water Leak / PCB / Sound",
        labelTe: "వాటర్ లీక్ / సౌండ్ / బోర్డు రిపేర్",
        icon: "⚙️",
        startingPriceEn: "Inspection first",
        startingPriceTe: "ముందుగా తనిఖీ",
        descEn: "Drain unclogging or electrical diagnosis",
        descTe: "నీరు కారే సమస్య లేదా బోర్డు ఫాల్ట్ పరిష్కారం"
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
    subEn: "Kitchen Degrease, Washroom Descaling, Full Home",
    subTe: "కిచెన్ జిడ్డు, బాత్‌రూమ్ ఉప్పు మరకలు, పూర్తి ఇల్లు",
    priceEn: "Starting from ₹999",
    priceTe: "₹999 నుండి ప్రారంభం",
    badgeEn: "✨ 100% Supervised Quality",
    badgeTe: "✨ పూర్తి పర్యవేక్షణ & నమ్మకం",
    includedEn: [
      "Heavy oil, carbon & grease removal from kitchen tiles, chimney & counters",
      "Hard-water white/yellow scaling removal from bathroom tiles & toilet seats",
      "Trained staff with industrial scrubbers & premium safe cleaning agents",
      "Digital completion report with before & after photos"
    ],
    includedTe: [
      "కిచెన్ టైల్స్, చిమ్నీ, గ్యాస్ బండలపై మొండి జిడ్డు పూర్తిగా తొలగింపు",
      "బాత్‌రూమ్ టైల్స్, కమోడ్లపై మొండి ఉప్పునీటి పసుపు మరకలు క్లీన్ చేయడం",
      "ప్రొఫెషనల్ మెషీన్లు మరియు నాణ్యమైన క్లీనింగ్ లిక్విడ్లతో సిబ్బంది",
      "పని ముగిశాక ఫోటోలు తీసి నాణ్యత చూపించే డిజిటల్ రిపోర్ట్"
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
        id: "kitchen-deep",
        labelEn: "Kitchen Degrease Reset",
        labelTe: "కిచెన్ డీప్ క్లీన్ (జిడ్డు తొలగింపు)",
        icon: "🍳",
        startingPriceEn: "₹1,499",
        startingPriceTe: "₹1,499",
        popular: true,
        descEn: "Counters, tiles, hood exterior & burners scrub",
        descTe: "టైల్స్, కౌంటర్లు, గ్యాస్ బండల డీప్ స్క్రబ్బింగ్"
      },
      {
        id: "bathroom-deep",
        labelEn: "Washroom Descaling (2 Units)",
        labelTe: "బాత్‌రూమ్ ఉప్పు మరకల క్లీనింగ్ (2)",
        icon: "🚽",
        startingPriceEn: "₹999",
        startingPriceTe: "₹999",
        popular: true,
        descEn: "Tough hard-water scaling & mirror stain removal",
        descTe: "మొండి ఉప్పు మరకలు & అద్దాల మురికి తొలగింపు"
      },
      {
        id: "full-home",
        labelEn: "Complete House Reset",
        labelTe: "పూర్తి ఇల్లు డీప్ క్లీనింగ్",
        icon: "🏡",
        startingPriceEn: "From ₹3,499",
        startingPriceTe: "₹3,499 నుండి",
        descEn: "Rooms, balconies, fans, doors, kitchen & washrooms",
        descTe: "గదులు, బాల్కనీలు, ఫ్యాన్లు, తలుపులు, కిచెన్ & బాత్‌రూమ్‌లు"
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
  { en: "Other Area in Nellore", te: "నెల్లూరులోని ఇతర ప్రాంతం" }
];

export const PROPERTY_SIZES = [
  { id: "1bhk", labelEn: "1 BHK / 1 Room", labelTe: "1 BHK / 1 గది" },
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
    icon: "🛡️",
    titleEn: "Verified Local Professionals",
    titleTe: "ధృవీకరించబడిన స్థానిక నిపుణులు",
    descEn: "Background-checked Nellore technicians with official Osmida ID cards.",
    descTe: "పూర్తి విచారణ జరిపిన స్థానిక నెల్లూరు టెక్నీషియన్లు."
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
    titleEn: "30-Day Free Revisit Guarantee",
    titleTe: "30 రోజుల ఉచిత రీవిజిట్ గ్యారెంటీ",
    descEn: "If pests return or AC leaks within 30 days, we re-serve completely free.",
    descTe: "30 రోజుల్లో సమస్య మళ్లీ వస్తే ఉచితంగా రీ-ట్రీట్మెంట్ చేస్తాము."
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
    aEn: "Yes. We use certified, odorless chemicals approved by the government. You do not need to leave the house, except during bedbug heavy misting.",
    aTe: "ఖచ్చితంగా సురక్షితం. మేము ప్రభుత్వ ఆమోదం పొందిన వాసన లేని మందులను మాత్రమే ఉపయోగిస్తాము. ఇల్లు ఖాళీ చేయాల్సిన అవసరం లేదు."
  },
  {
    qEn: "What if pests come back after treatment?",
    qTe: "ట్రీట్మెంట్ తర్వాత మళ్లీ పురుగులు వస్తే ఏమిటి?",
    aEn: "We provide a 30-day warranty. Just call us or send a WhatsApp message, and our technician will come back for a free re-treatment.",
    aTe: "మా ప్రతి సాధారణ పెస్ట్ కంట్రోల్‌కు 30 రోజుల వారంటీ ఉంటుంది. సమస్య కనిపిస్తే వాట్సాప్ లేదా కాల్ చేయండి, ఉచితంగా మళ్లీ చేస్తాము."
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
    heroSub: "Verified experts in Nellore • Transparent upfront prices • 30-minute confirmation",
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
    trustLine1: "Verified Nellore Technicians",
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
    heroSub: "నెల్లూరులో ధృవీకరించబడిన నిపుణులు • సరసమైన ధరలు • 30 నిమిషాల్లో కాల్ నిర్ధారణ",
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
    trustLine1: "స్థానిక నెల్లూరు నిపుణులు",
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
