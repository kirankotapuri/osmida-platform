export type PartnerLanguage = "te" | "en";

export interface PartnerTranslationStrings {
  portalTitle: string;
  subtitle: string;
  quickLogin: string;
  incomingAlert: string;
  guaranteedPay: string;
  acceptJob: string;
  decline: string;
  onTheWay: string;
  onTheWayBtn: string;
  dispatchedBadge: string;
  dispatchedStatus: string;
  atGateBtn: string;
  gateReported: string;
  atGateAlerted: string;
  headingToDoorstep: string;
  headingToCustomer: string;
  startGps: string;
  executionSteps: string;
  step1: string;
  step1Title: string;
  step2: string;
  step2Title: string;
  step3: string;
  step3Title: string;
  enterStartOtp: string;
  askOtpPrompt: string;
  verifyAndStart: string;
  verifyStartBtn: string;
  inProgressBadge: string;
  inProgressStatus: string;
  stopwatchTitle: string;
  liveStopwatch: string;
  hourlyJobTime: string;
  overtimeAlert: string;
  bookingAmount: string;
  yourShare: string;
  elapsed: string;
  remaining: string;
  add30Mins: string;
  extend30Mins: string;
  photosLabel: string;
  beforePhoto: string;
  afterPhoto: string;
  captureBefore: string;
  captureAfter: string;
  photoAttached: string;
  cameraBypass: string;
  skipPhotosLabel: string;
  endOtpLabel: string;
  enterEndOtp: string;
  completeJobBtn: string;
  paymentPending: string;
  paymentSummaryTitle: string;
  paymentSummaryDesc: string;
  liveJobs: string;
  earnings: string;
  profile: string;
  online: string;
  offline: string;
  onlineStatus: string;
  offlineStatus: string;
  testBuzzer: string;
  enablePush: string;
  opsHotline: string;
  activeWork: string;
  guaranteedPayout: string;
  dailySummary: string;
  dailySettlement: string;
  totalEarnedToday: string;
  todayJobsCompleted: string;
  todayGross: string;
  cashCollected: string;
  cashInHand: string;
  netUpiPayout: string;
  netUpiTransfer: string;
  settledTonight: string;
  registeredUpi: string;
  verifiedUpiBadge: string;
  instantTransferBtn: string;
  completedJobsHistory: string;
  noCompletedJobs: string;
  payoutTime: string;
  upiVerified: string;
  hubAssigned: string;
  navJobs: string;
  navEarnings: string;
  navProfile: string;
  emergencySos: string;
  sosAlertSent: string;
  rateCustomer: string;
  customerPolite: string;
  easyEntry: string;
  timelyPayment: string;
  offlineBanner: string;
  shareEodSlip: string;
}

export const PARTNER_STRINGS: Record<PartnerLanguage, PartnerTranslationStrings> = {
  en: {
    portalTitle: "Partner Portal",
    subtitle: "Standardized Residential Services in Nellore Apartments",
    quickLogin: "Quick Test Login as Verified Nellore Partner:",
    incomingAlert: "Incoming Job Alert",
    guaranteedPay: "Guaranteed Pay (Immediate Escrow)",
    acceptJob: "ACCEPT JOB",
    decline: "Decline",
    onTheWay: "I am On The Way (Alert Customer)",
    onTheWayBtn: "I am On The Way (Alert Customer)",
    dispatchedBadge: "Dispatched",
    dispatchedStatus: "Dispatched",
    atGateBtn: "I Have Reached Apartment Gate",
    gateReported: "✓ Customer Notified at Gate",
    atGateAlerted: "Customer Notified at Gate",
    headingToDoorstep: "Heading to Customer Doorstep",
    headingToCustomer: "Heading to Customer Doorstep",
    startGps: "Start Turn-by-Turn Google Maps Navigation",
    executionSteps: "Execution Steps (WhatsApp Synced):",
    step1: "Step 1: On The Way",
    step1Title: "Step 1: On The Way",
    step2: "Step 2: Start Job (Customer OTP)",
    step2Title: "Step 2: Start Job (Customer OTP)",
    step3: "Step 3: Completion Proof & End OTP",
    step3Title: "Step 3: Completion Proof & End OTP",
    enterStartOtp: "Ask customer for their 4-digit doorstep code:",
    askOtpPrompt: "Ask customer for their 4-digit code shown on their WhatsApp / booking screen:",
    verifyAndStart: "Verify & Start",
    verifyStartBtn: "Verify & Start",
    inProgressBadge: "In Progress",
    inProgressStatus: "In Progress",
    stopwatchTitle: "Live Service Timer",
    liveStopwatch: "Live Service Timer",
    hourlyJobTime: "Target: 60 Mins Standard",
    overtimeAlert: "Overtime in Progress (+₹99/30m)",
    bookingAmount: "Booking Amount",
    yourShare: "Your Share",
    elapsed: "Elapsed",
    remaining: "Target: 60 Mins",
    add30Mins: "+30 Mins (+₹99)",
    extend30Mins: "+30 Mins (+₹99)",
    photosLabel: "Photos Before & After Work:",
    beforePhoto: "Before Photo",
    afterPhoto: "After Photo",
    captureBefore: "+ Take Before Photo",
    captureAfter: "+ Take After Photo",
    photoAttached: "✓ Photo Attached",
    cameraBypass: "Camera unavailable / Customer directly verified work",
    skipPhotosLabel: "Camera unavailable / Customer directly verified work",
    endOtpLabel: "Enter Customer's 4-Digit End OTP (Completion Code):",
    enterEndOtp: "Enter Customer's 4-Digit End OTP (Completion Code):",
    completeJobBtn: "Complete Job & Settle Payment",
    paymentPending: "Payment",
    paymentSummaryTitle: "Payment: ₹199 — QR generated on completion",
    paymentSummaryDesc: "After you complete the job, a Razorpay QR code will appear. Show it to customer to scan via PhonePe/GPay/Paytm.",
    liveJobs: "Live Jobs",
    earnings: "Earnings",
    profile: "Profile",
    online: "ONLINE",
    offline: "OFFLINE",
    onlineStatus: "Ready for Quick-Commerce Dispatch in Nellore",
    offlineStatus: "You are currently OFFLINE. Toggle to ONLINE above to receive job alerts.",
    testBuzzer: "Test Sound",
    enablePush: "Enable Alerts",
    opsHotline: "Call Nellore Hub",
    activeWork: "ACTIVE WORK IN PROGRESS",
    guaranteedPayout: "Your Guaranteed Payout",
    dailySummary: "Today's Payout Ledger",
    dailySettlement: "Today's Daily Settlement",
    totalEarnedToday: "Total Earned Today",
    todayJobsCompleted: "Jobs Completed Today",
    todayGross: "Total Service Earnings",
    cashCollected: "Cash Kept by You",
    cashInHand: "Cash in Hand Collected",
    netUpiPayout: "Net EOD UPI Transfer",
    netUpiTransfer: "Net Night UPI Transfer",
    settledTonight: "Auto-credited to your bank tonight by 9:00 PM IST",
    registeredUpi: "Registered UPI ID",
    verifiedUpiBadge: "Verified ✅",
    instantTransferBtn: "Request Instant Transfer",
    completedJobsHistory: "Recently Completed Jobs",
    noCompletedJobs: "Completed jobs will appear here with your payout breakdown.",
    payoutTime: "Auto-credited to your registered UPI ID tonight at 9:00 PM IST",
    upiVerified: "Verified UPI ID",
    hubAssigned: "Nellore Hub",
    navJobs: "Live Jobs",
    navEarnings: "Earnings",
    navProfile: "Profile",
    emergencySos: "SOS Emergency",
    sosAlertSent: "🚨 Emergency SOS sent to Nellore Hub! Live GPS coordinates dispatched.",
    rateCustomer: "Rate Customer Experience",
    customerPolite: "Polite & Respectful",
    easyEntry: "Smooth Gate Entry",
    timelyPayment: "Immediate Payment",
    offlineBanner: "Offline Mode: Connection lost. OTP and photos will sync once network is restored.",
    shareEodSlip: "Share EOD Slip on WhatsApp",
  },
  te: {
    portalTitle: "పార్టనర్ పోర్టల్",
    subtitle: "నెల్లూరు అపార్ట్‌మెంట్లలో ప్రామాణిక గృహ సేవలు",
    quickLogin: "ధృవీకరించబడిన నెల్లూరు పార్టనర్‌గా లాగిన్ అవ్వండి:",
    incomingAlert: "కొత్త పని ఆర్డర్ వచ్చింది!",
    guaranteedPay: "ఖచ్చితమైన సంపాదన (ఎస్క్యూ రక్షణ)",
    acceptJob: "పనిని అంగీకరించండి (ACCEPT)",
    decline: "వద్దు (Decline)",
    onTheWay: "నేను దారిలో బయలుదేరాను",
    onTheWayBtn: "నేను బయలుదేరాను (కస్టమర్‌కు తెలియజేయండి)",
    dispatchedBadge: "బయలుదేరారు",
    dispatchedStatus: "బయలుదేరారు",
    atGateBtn: "అపార్ట్‌మెంట్ గేటు వద్దకు వచ్చాను",
    gateReported: "✓ గేటు వద్ద ఉన్నారని కస్టమర్‌కు తెలిపాము",
    atGateAlerted: "గేటు వద్ద ఉన్నారని కస్టమర్‌కు మెసేజ్ వెళ్లింది",
    headingToDoorstep: "కస్టమర్ ఇంటికి వెళ్తున్నారు",
    headingToCustomer: "కస్టమర్ ఇంటికి వెళ్తున్నారు",
    startGps: "గూగుల్ మ్యాప్స్ నావిగేషన్ ప్రారంభించండి",
    executionSteps: "పని దశలు (WhatsApp సింక్):",
    step1: "దశ 1: ప్రయాణం (On The Way)",
    step1Title: "దశ 1: ప్రయాణం (On The Way)",
    step2: "దశ 2: పని ప్రారంభం (స్టార్ట్ OTP)",
    step2Title: "దశ 2: పని ప్రారంభం (స్టార్ట్ OTP)",
    step3: "దశ 3: పని పూర్తి & ముగింపు OTP",
    step3Title: "దశ 3: పని పూర్తి & ముగింపు OTP",
    enterStartOtp: "కస్టమర్‌ని వారి 4-అంకెల స్టార్ట్ కోడ్ అడగండి:",
    askOtpPrompt: "కస్టమర్ వాట్సాప్ లేదా స్క్రీన్‌పై ఉన్న 4-అంకెల కోడ్ అడగండి:",
    verifyAndStart: "కోడ్ సరిచూసి ప్రారంభించండి",
    verifyStartBtn: "కోడ్ సరిచూసి ప్రారంభించండి",
    inProgressBadge: "పని జరుగుతోంది",
    inProgressStatus: "పని జరుగుతోంది",
    stopwatchTitle: "లైవ్ పని సమయం (Stopwatch)",
    liveStopwatch: "లైవ్ పని సమయం (Stopwatch)",
    hourlyJobTime: "ప్రామాణిక సమయం: 60 నిమిషాలు",
    overtimeAlert: "ఓవర్‌టైమ్ నడుస్తోంది (+₹99/30 ని)",
    bookingAmount: "బుకింగ్ మొత్తం",
    yourShare: "మీ వాటా (70%)",
    elapsed: "గడిచిన సమయం",
    remaining: "లక్ష్యం: 60 నిమిషాలు",
    add30Mins: "+30 నిమిషాలు (+₹99)",
    extend30Mins: "+30 నిమిషాలు (+₹99)",
    photosLabel: "పని ముందు & తర్వాత ఫోటోలు:",
    beforePhoto: "పని ముందు ఫోటో",
    afterPhoto: "పని పూర్తి ఫోటో",
    captureBefore: "+ కెమెరా ఓపెన్ చేయండి (Before)",
    captureAfter: "+ కెమెరా ఓపెన్ చేయండి (After)",
    photoAttached: "✓ ఫోటో జతచేయబడింది",
    cameraBypass: "కెమెరా పని చేయలేదు / కస్టమర్ ప్రత్యక్షంగా చూశారు",
    skipPhotosLabel: "కెమెరా సమస్య / కస్టమర్ ప్రత్యక్షంగా పరిశీలించారు",
    endOtpLabel: "కస్టమర్ 4-అంకెల ముగింపు కోడ్ (End OTP) ఎంటర్ చేయండి:",
    enterEndOtp: "కస్టమర్ 4-అంకెల ముగింపు కోడ్ (End OTP) నమోదు చేయండి:",
    completeJobBtn: "పని పూర్తి & పేమెంట్ సెటిల్మెంట్",
    paymentPending: "చెల్లింపు",
    paymentSummaryTitle: "చెల్లింపు: ₹199 — పూర్తయ్యాక QR కనిపిస్తుంది",
    paymentSummaryDesc: "పని పూర్తయిన వెంటనే Razorpay QR వస్తుంది. కస్టమర్‌కి చూపించి PhonePe/GPay ద్వారా చెల్లించమనండి.",
    liveJobs: "లైవ్ పనులు",
    earnings: "సంపాదన",
    profile: "ప్రొఫైల్",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    onlineStatus: "నెల్లూరులో ఆర్డర్ల కోసం సిద్ధంగా ఉన్నారు",
    offlineStatus: "మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. ఆర్డర్ల కోసం ఆన్‌లైన్ చేయండి.",
    testBuzzer: "సౌండ్ టెస్ట్",
    enablePush: "నోటిఫికేషన్లు",
    opsHotline: "నెల్లూరు హబ్ కాల్",
    activeWork: "ప్రస్తుతం జరుగుతున్న పని",
    guaranteedPayout: "మీకు అందే నికర సంపాదన",
    dailySummary: "ఈ రోజు సంపాదన లెక్క",
    dailySettlement: "నేటి సంపాదన & క్లియరెన్స్",
    totalEarnedToday: "నేటి మొత్తం సంపాదన",
    todayJobsCompleted: "ఈ రోజు పూర్తి చేసిన పనులు",
    todayGross: "మొత్తం పని సంపాదన",
    cashCollected: "మీ చేతికి అందిన నగదు",
    cashInHand: "చేతికి అందిన నగదు",
    netUpiPayout: "రాత్రి 9:00 కు UPI ద్వారా వచ్చే మొత్తం",
    netUpiTransfer: "రాత్రి 9:00 UPI బదిలీ",
    settledTonight: "రాత్రి 9:00 కు మీ బ్యాంక్ ఖాతాకు ఆటోమేటిక్‌గా జమ అవుతుంది",
    registeredUpi: "రిజిస్టర్డ్ UPI ID",
    verifiedUpiBadge: "ధృవీకరించబడింది ✅",
    instantTransferBtn: "తక్షణ బదిలీ అభ్యర్థన",
    completedJobsHistory: "ఈ రోజు పూర్తి చేసిన పనులు",
    noCompletedJobs: "పూర్తయిన పనుల వివరాలు ఇక్కడ కనిపిస్తాయి.",
    payoutTime: "ప్రతిరోజూ రాత్రి 9:00 – 10:00 గంటల మధ్య మీ UPI ID కి ఆటోమేటిక్‌గా జమ అవుతుంది",
    upiVerified: "ధృవీకరించబడిన UPI ID",
    hubAssigned: "నెల్లూరు హబ్",
    navJobs: "లైవ్ పనులు",
    navEarnings: "సంపాదన",
    navProfile: "ప్రొఫైల్",
    emergencySos: "SOS అత్యవసరం",
    sosAlertSent: "🚨 అత్యవసర SOS నెల్లూరు హబ్‌కు పంపబడింది! లైవ్ GPS లొకేషన్ చేరింది.",
    rateCustomer: "కస్టమర్ అనుభవాన్ని రేట్ చేయండి",
    customerPolite: "మర్యాదపూర్వకంగా ఉన్నారు",
    easyEntry: "సులభమైన గేట్ ఎంట్రీ",
    timelyPayment: "వెంటనే చెల్లించారు",
    offlineBanner: "ఆఫ్‌లైన్ మోడ్: ఇంటర్నెట్ లేదు. సిగ్నల్ రాగానే ఆటోమేటిక్‌గా అప్‌డేట్ అవుతుంది.",
    shareEodSlip: "నేటి పేస్లిప్‌ను WhatsApp లో పంపండి",
  },
};
