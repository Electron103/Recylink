import {
  MaterialCategory,
  MaterialInfo,
  PriceRecord,
  RecyclerProfile,
  CollectorProfile,
  SaathiProfile,
  LotItem,
  SafetyGuideItem,
  FieldInterview,
  NotificationItem,
  AnomalyReport
} from '../types';

export const MATERIALS_CATALOG: MaterialInfo[] = [
  {
    id: 'pcb',
    name: {
      en: 'PCB / Circuit Boards',
      hi: 'सर्किट बोर्ड / मदरबोर्ड (PCB)',
      mr: 'सर्किट बोर्ड / मदरबोर्ड (PCB)'
    },
    iconName: 'Cpu',
    description: {
      en: 'Motherboards, green board, RAM, RAM gold fingers, server/PC boards',
      hi: 'कंप्यूटर मदरबोर्ड, रैम, टीवी किट, इलेक्ट्रॉनिक प्लेट्स',
      mr: 'संगणक मदरबोर्ड, रॅम, टीव्ही किट, इलेक्ट्रॉनिक प्लेट्स'
    },
    basePricePerKg: 380,
    minPricePerKg: 340,
    maxPricePerKg: 440,
    unit: 'kg',
    safetyHazard: 'Toxic heavy metals (Lead, Cadmium). Never burn or acid-wash.',
    safetyGuide: {
      en: 'Do not burn or use chemical acid baths. Hand over intact for mechanical shredding and hydrometallurgical recovery.',
      hi: 'सर्किट बोर्ड को कभी न जलाएं और न ही तेजाब डालें। इन्हें सीधे अधिकृत रीसाइक्लर को दें।',
      mr: 'सर्किट बोर्ड कधीही जाळू नका किंवा ॲसिड वापरू नका. अधिकृत रिसायकलिंग सेंटरला द्या.'
    }
  },
  {
    id: 'cables',
    name: {
      en: 'Copper & Insulated Cables',
      hi: 'तांबे व धातु के तार (Cables)',
      mr: 'तांब्याच्या व धातूच्या तारा (Cables)'
    },
    iconName: 'Cable',
    description: {
      en: 'Wiring harnesses, power cords, data telecom cables, flexible copper',
      hi: 'बिजली के तार, केबल्स, कॉपर वायरिंग, डेटा कॉर्ड',
      mr: 'विद्युत तारा, केबल्स, कॉपर वायरिंग, डेटा कॉर्ड'
    },
    basePricePerKg: 520,
    minPricePerKg: 460,
    maxPricePerKg: 610,
    unit: 'kg',
    safetyHazard: 'Burning PVC releases toxic carcinogenic dioxins. Stripping burns cause lung damage.',
    safetyGuide: {
      en: 'Strictly NEVER burn cables to extract copper. Authorized recyclers use mechanical stripping machines and pay higher rates.',
      hi: 'तांबा निकालने के लिए तारों को कभी न जलाएं! अधिकृत रीसाइक्लर मशीन से छीलते हैं और पूरा पैसा देते हैं।',
      mr: 'तांबे काढण्यासाठी तारा कधीही जाळू नका! मशीनने स्ट्रिपिंग केल्याने अधिक भाव मिळतो.'
    }
  },
  {
    id: 'batteries',
    name: {
      en: 'Batteries (Li-ion & Lead-Acid)',
      hi: 'बैटरी (Li-ion / लेड एसिड)',
      mr: 'बॅटरी (Li-ion / लेड ॲसिड)'
    },
    iconName: 'BatteryCharging',
    description: {
      en: 'Mobile phone batteries, laptop packs, UPS lead batteries, EV cells',
      hi: 'मोबाइल बैटरी, लैपटॉप बैटरी, यूपीएस और इनवर्टर बैटरी',
      mr: 'मोबाईल बॅटरी, लॅपटॉप बॅटरी, युपीएस व इन्व्हर्टर बॅटऱ्या'
    },
    basePricePerKg: 140,
    minPricePerKg: 110,
    maxPricePerKg: 190,
    unit: 'kg',
    safetyHazard: 'Fire hazard, thermal runaway explosion, acid burns.',
    safetyGuide: {
      en: 'Do not crush, puncture, or open battery casings. Keep away from water and direct heat.',
      hi: 'बैटरी को कभी न तोड़ें, न छेदें। पानी और आग से दूर रखें।',
      mr: 'बॅटरी कधीही कापू किंवा फोडू नका. आग आणि पाण्यापासून दूर ठेवा.'
    }
  },
  {
    id: 'crt',
    name: {
      en: 'CRT TV & Monitors',
      hi: 'पुराने टीवी व सीआरटी मॉनिटर',
      mr: 'जुने टीव्ही आणि सीआरटी मॉनिटर्स'
    },
    iconName: 'Tv',
    description: {
      en: 'Heavy glass CRT picture tubes, old television sets, computer monitors',
      hi: 'पुराने बड़े कांच वाले टीवी और भारी कंप्यूटर स्क्रीन',
      mr: 'जुने काचेचे मोठे टीव्ही आणि मॉनिटर्स'
    },
    basePricePerKg: 35,
    minPricePerKg: 25,
    maxPricePerKg: 50,
    unit: 'kg',
    safetyHazard: 'High vacuum implosion risk and toxic leaded glass.',
    safetyGuide: {
      en: 'Handle with extreme care. Do not break the glass tube as it contains toxic lead and phosphor dust.',
      hi: 'सीआरटी कांच को न तोड़ें। इसमें जहरीला सीसा (Lead) होता है जो सांस और आंखों के लिए खतरनाक है।',
      mr: 'सीआरटी काच फोडू नका. यात विषारी शिसे (Lead) असते.'
    }
  },
  {
    id: 'lcd',
    name: {
      en: 'LCD / LED Display Panels',
      hi: 'एलसीडी / एलईडी डिस्प्ले स्क्रीन',
      mr: 'एलसीडी / एलईडी स्क्रीन पॅनेल्स'
    },
    iconName: 'Monitor',
    description: {
      en: 'Flat screen monitors, TV displays, tablet and laptop screens',
      hi: 'फ्लैट टीवी स्क्रीन, कंप्यूटर डिस्प्ले, लैपटॉप स्क्रीन',
      mr: 'फ्लॅट टीव्ही स्क्रीन, संगणक डिस्प्ले, लॅपटॉप स्क्रीन'
    },
    basePricePerKg: 95,
    minPricePerKg: 75,
    maxPricePerKg: 130,
    unit: 'kg',
    safetyHazard: 'Mercury backlights in older CCFL LCDs, sharp glass shards.',
    safetyGuide: {
      en: 'Keep flat and avoid smashing backlight tubes that may contain mercury vapor.',
      hi: 'स्क्रीन को सुरक्षित रखें। टूटने पर पारा (Mercury) गैस निकल सकती है।',
      mr: 'स्क्रीन सुरक्षित ठेवा. फुटल्यास मर्क्युरी वायू निघू शकतो.'
    }
  },
  {
    id: 'motors',
    name: {
      en: 'Motors & Copper Coils',
      hi: 'इलेक्ट्रिक मोटर और कॉइल',
      mr: 'इलेक्ट्रिक मोटर्स व कॉपर कॉइल'
    },
    iconName: 'Cog',
    description: {
      en: 'Fan motors, pump stators, transformer windings, compressor cores',
      hi: 'पंखे की मोटर, पानी की मोटर, ट्रांसफार्मर, कंप्रेसर',
      mr: 'पंख्यांची मोटर, पाण्याची मोटर, ट्रान्सफॉर्मर, कॉम्प्रेसर'
    },
    basePricePerKg: 290,
    minPricePerKg: 250,
    maxPricePerKg: 350,
    unit: 'kg',
    safetyHazard: 'Pinch points, heavy weight strain, sharp copper wire ends.',
    safetyGuide: {
      en: 'Use gloves when handling heavy winding cores. Do not use open flames to strip varnish.',
      hi: 'मोटर संभालते समय दस्ताने पहनें। वार्निश हटाने के लिए आग न लगाएं।',
      mr: 'मोटर हाताळताना हातमोजे वापरा. वार्निश काढण्यासाठी आग लावू नका.'
    }
  },
  {
    id: 'magnets',
    name: {
      en: 'Hard Drives & Neodymium Assemblies',
      hi: 'हार्ड डिस्क व चुंबक पुर्जे',
      mr: 'हार्ड डिस्क व मॅग्नेट पार्ट्स'
    },
    iconName: 'Disc',
    description: {
      en: 'HDD drives, rare-earth neodymium magnets, speaker voice coils',
      hi: 'कंप्यूटर हार्ड डिस्क, कीमती चुंबक, ड्राइव असेंबली',
      mr: 'संगणक हार्ड डिस्क, मौल्यवान चुंबक, ड्राइव्ह असेंब्ली'
    },
    basePricePerKg: 180,
    minPricePerKg: 150,
    maxPricePerKg: 230,
    unit: 'kg',
    safetyHazard: 'Powerful pinch danger from rare-earth neodymium magnets.',
    safetyGuide: {
      en: 'Hard disk controller boards contain gold plating and should remain intact.',
      hi: 'हार्ड डिस्क की प्लेट को अलग न करें, पूरा उपकरण रीसाइक्लिंग में दें।',
      mr: 'हार्ड डिस्कची प्लेट वेगळी करू नका, संपूर्ण पार्ट द्या.'
    }
  },
  {
    id: 'mixed_plastics',
    name: {
      en: 'E-Waste Grade Mixed Plastics',
      hi: 'इलेक्ट्रॉनिक प्लास्टिक बॉडी (ABS/HIPS)',
      mr: 'इलेक्ट्रॉनिक प्लॅस्टिक बॉडी (ABS/HIPS)'
    },
    iconName: 'Boxes',
    description: {
      en: 'Printer casings, monitor shells, appliance outer bodies (flame-retarded)',
      hi: 'प्रिंटर, टीवी और इलेक्ट्रॉनिक सामान की प्लास्टिक बॉडी',
      mr: 'प्रिंटर, टीव्ही आणि उपकरणांची प्लॅस्टिक बॉडी'
    },
    basePricePerKg: 28,
    minPricePerKg: 20,
    maxPricePerKg: 38,
    unit: 'kg',
    safetyHazard: 'Brominated flame retardants (BFRs) emit toxic smoke if burned.',
    safetyGuide: {
      en: 'Sort by color and clean. Never incinerate polymer casings.',
      hi: 'प्लास्टिक को आग में न जलाएं। रीसाइक्लिंग के लिए सूखा और साफ रखें।',
      mr: 'प्लॅस्टिक जाळू नका. रिसायकलिंगसाठी कोरडे व स्वच्छ ठेवा.'
    }
  },
  {
    id: 'other',
    name: {
      en: 'Mixed Electronic Scrap',
      hi: 'अन्य मिश्रित ई-कचरा',
      mr: 'इतर मिश्र ई-कचरा'
    },
    iconName: 'Package',
    description: {
      en: 'Mixed small household appliances, chargers, adapters, routers, keyboards',
      hi: 'चार्जर, रिमोट, कीबोर्ड, मिक्सर और अन्य छोटे उपकरण',
      mr: 'चार्जर, रिमोट, कीबोर्ड, मिक्सर व इतर लहान उपकरणे'
    },
    basePricePerKg: 65,
    minPricePerKg: 45,
    maxPricePerKg: 90,
    unit: 'kg',
    safetyHazard: 'Mixed electrical items with capacitors that may retain static charge.',
    safetyGuide: {
      en: 'Keep sorted in dry sacks. Prevent moisture contact.',
      hi: 'सामान को सूखे बोरे में रखें और पानी से बचाएं।',
      mr: 'साहित्य कोरड्या पोत्यात ठेवा आणि पाण्यापासून वाचवा.'
    }
  }
];

export const MOCK_COLLECTORS: CollectorProfile[] = [
  {
    id: 'COL-001',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    preferredLanguage: 'hi',
    operatingArea: 'Dharavi Sector 3 & Sion',
    city: 'Mumbai',
    hasSmartphone: true,
    trustScore: 94,
    greenPoints: 480,
    totalLots: 14,
    totalWeightKg: 520,
    totalEarnings: 88400,
    joinedDate: '2025-11-10'
  },
  {
    id: 'COL-002',
    name: 'Sanjay Shinde',
    phone: '+91 98220 11223',
    preferredLanguage: 'mr',
    operatingArea: 'Bhosari & Pimpri Industrial Zone',
    city: 'Pune',
    hasSmartphone: true,
    trustScore: 89,
    greenPoints: 310,
    totalLots: 9,
    totalWeightKg: 340,
    totalEarnings: 61200,
    joinedDate: '2025-12-04'
  },
  {
    id: 'COL-003',
    name: 'Raju Ansari',
    phone: '+91 91234 56789',
    preferredLanguage: 'hi',
    operatingArea: 'Seelampur Scrap Cluster',
    city: 'Delhi NCR',
    hasSmartphone: false,
    assignedSaathiId: 'SAT-001',
    trustScore: 92,
    greenPoints: 260,
    totalLots: 7,
    totalWeightKg: 280,
    totalEarnings: 47600,
    joinedDate: '2026-01-15'
  },
  {
    id: 'COL-004',
    name: 'Lakshmi Devi',
    phone: '+91 99887 76655',
    preferredLanguage: 'hi',
    operatingArea: 'Govandi & Shivaji Nagar',
    city: 'Mumbai',
    hasSmartphone: false,
    assignedSaathiId: 'SAT-002',
    trustScore: 96,
    greenPoints: 520,
    totalLots: 16,
    totalWeightKg: 610,
    totalEarnings: 104200,
    joinedDate: '2025-10-20'
  },
  {
    id: 'COL-005',
    name: 'Babloo Chauhan',
    phone: '+91 97654 32109',
    preferredLanguage: 'hi',
    operatingArea: 'Mayapuri Industrial Area',
    city: 'Delhi NCR',
    hasSmartphone: true,
    trustScore: 86,
    greenPoints: 190,
    totalLots: 5,
    totalWeightKg: 195,
    totalEarnings: 33150,
    joinedDate: '2026-02-01'
  },
  {
    id: 'COL-006',
    name: 'Ganesh Patil',
    phone: '+91 98451 23456',
    preferredLanguage: 'mr',
    operatingArea: 'Hadapsar & Magarpatta',
    city: 'Pune',
    hasSmartphone: true,
    trustScore: 91,
    greenPoints: 370,
    totalLots: 11,
    totalWeightKg: 430,
    totalEarnings: 74500,
    joinedDate: '2025-11-28'
  },
  {
    id: 'COL-007',
    name: 'Mohammad Shahid',
    phone: '+91 90123 45678',
    preferredLanguage: 'hi',
    operatingArea: 'Old City & Charminar Ward',
    city: 'Hyderabad',
    hasSmartphone: false,
    assignedSaathiId: 'SAT-003',
    trustScore: 88,
    greenPoints: 220,
    totalLots: 6,
    totalWeightKg: 210,
    totalEarnings: 38900,
    joinedDate: '2026-01-20'
  },
  {
    id: 'COL-008',
    name: 'Sunil Paswan',
    phone: '+91 93456 78901',
    preferredLanguage: 'hi',
    operatingArea: 'Kurla West & LBS Marg',
    city: 'Mumbai',
    hasSmartphone: true,
    trustScore: 85,
    greenPoints: 150,
    totalLots: 4,
    totalWeightKg: 160,
    totalEarnings: 27200,
    joinedDate: '2026-02-10'
  },
  {
    id: 'COL-009',
    name: 'Anita Jadhav',
    phone: '+91 94230 98765',
    preferredLanguage: 'mr',
    operatingArea: 'Thane & Kalwa Scrap Yards',
    city: 'Thane',
    hasSmartphone: false,
    assignedSaathiId: 'SAT-002',
    trustScore: 93,
    greenPoints: 340,
    totalLots: 8,
    totalWeightKg: 310,
    totalEarnings: 55800,
    joinedDate: '2025-12-18'
  },
  {
    id: 'COL-010',
    name: 'Vinod Verma',
    phone: '+91 98111 22334',
    preferredLanguage: 'hi',
    operatingArea: 'Okhla Phase II & Badarpur',
    city: 'Delhi NCR',
    hasSmartphone: true,
    trustScore: 90,
    greenPoints: 290,
    totalLots: 8,
    totalWeightKg: 290,
    totalEarnings: 51000,
    joinedDate: '2026-01-05'
  }
];

export const MOCK_SAATHIS: SaathiProfile[] = [
  {
    id: 'SAT-001',
    name: 'Sunita Sharma (Digital Saathi)',
    phone: '+91 98760 11223',
    operatingArea: 'Seelampur & Shahdara Hub',
    city: 'Delhi NCR',
    assignedCollectorIds: ['COL-003', 'COL-005', 'COL-010'],
    totalAssistedLots: 42,
    incentivesEarned: 8400
  },
  {
    id: 'SAT-002',
    name: 'Vikas Patil (Digital Saathi)',
    phone: '+91 98231 44556',
    operatingArea: 'Dharavi & Kurla Central Hub',
    city: 'Mumbai',
    assignedCollectorIds: ['COL-001', 'COL-004', 'COL-008', 'COL-009'],
    totalAssistedLots: 68,
    incentivesEarned: 13600
  },
  {
    id: 'SAT-003',
    name: 'Imran Sheikh (Digital Saathi)',
    phone: '+91 99123 77889',
    operatingArea: 'Sanathnagar & Balanagar Belt',
    city: 'Hyderabad',
    assignedCollectorIds: ['COL-007'],
    totalAssistedLots: 29,
    incentivesEarned: 5800
  },
  {
    id: 'SAT-004',
    name: 'Anjali Gupta (Digital Saathi)',
    phone: '+91 97112 33445',
    operatingArea: 'Pimpri-Chinchwad Ward 14',
    city: 'Pune',
    assignedCollectorIds: ['COL-002', 'COL-006'],
    totalAssistedLots: 35,
    incentivesEarned: 7000
  }
];

export const MOCK_RECYCLERS: RecyclerProfile[] = [
  {
    id: 'REC-001',
    name: 'EcoShred Circular Solutions Ltd.',
    facilityLocation: 'Plot 48, TTC Industrial Area, Mahape, Navi Mumbai',
    city: 'Mumbai',
    distanceKm: 6.8,
    materialsAccepted: ['pcb', 'cables', 'batteries', 'lcd', 'motors', 'magnets', 'mixed_plastics'],
    authorizationNumber: 'CPCB/EW-REG/MH-2024/0418',
    authorizationStatus: 'VERIFIED',
    contactNumber: '+91 22 2778 9900',
    pickupAvailable: true,
    minPickupWeightKg: 20,
    serviceArea: 'Mumbai, Navi Mumbai, Thane & Raigad (Within 45 km radius)',
    trustScore: 98,
    offeredRates: {
      pcb: 385,
      cables: 530,
      batteries: 145,
      lcd: 98,
      motors: 295,
      magnets: 185,
      mixed_plastics: 30
    },
    rating: 4.9,
    totalHandovers: 342,
    verificationDate: '2024-04-12'
  },
  {
    id: 'REC-002',
    name: 'GreenMatrix E-Stewards Pvt. Ltd.',
    facilityLocation: 'Sector 8, IMT Manesar, Gurugram',
    city: 'Delhi NCR',
    distanceKm: 12.4,
    materialsAccepted: ['pcb', 'cables', 'batteries', 'crt', 'lcd', 'motors', 'other'],
    authorizationNumber: 'CPCB/EW-REG/HR-2023/1182',
    authorizationStatus: 'VERIFIED',
    contactNumber: '+91 124 456 7890',
    pickupAvailable: true,
    minPickupWeightKg: 25,
    serviceArea: 'Delhi NCR, Gurugram, Noida, Faridabad',
    trustScore: 95,
    offeredRates: {
      pcb: 390,
      cables: 525,
      batteries: 142,
      crt: 38,
      lcd: 95,
      motors: 290
    },
    rating: 4.8,
    totalHandovers: 289,
    verificationDate: '2023-11-05'
  },
  {
    id: 'REC-003',
    name: 'MahaRecycle Industrial Recovery Hub',
    facilityLocation: 'Gate 224, Chakan MIDC Phase 2, Pune',
    city: 'Pune',
    distanceKm: 9.1,
    materialsAccepted: ['pcb', 'cables', 'motors', 'magnets', 'mixed_plastics', 'batteries'],
    authorizationNumber: 'MPCB/RO-PUNE/EW/2024/093',
    authorizationStatus: 'VERIFIED',
    contactNumber: '+91 20 6688 1200',
    pickupAvailable: true,
    minPickupWeightKg: 15,
    serviceArea: 'Pune, Chakan, Talegaon, Pimpri-Chinchwad',
    trustScore: 96,
    offeredRates: {
      pcb: 380,
      cables: 535,
      batteries: 150,
      motors: 300,
      magnets: 190,
      mixed_plastics: 29
    },
    rating: 4.9,
    totalHandovers: 215,
    verificationDate: '2024-02-18'
  },
  {
    id: 'REC-004',
    name: 'Bharat ZeroWaste Metal Refiners',
    facilityLocation: 'Plot 12, IDA Mallapur, Nacharam, Hyderabad',
    city: 'Hyderabad',
    distanceKm: 14.5,
    materialsAccepted: ['pcb', 'cables', 'batteries', 'lcd', 'motors'],
    authorizationNumber: 'TSPCB/HW-EW/HYD/2024/772',
    authorizationStatus: 'VERIFIED',
    contactNumber: '+91 40 2715 3344',
    pickupAvailable: true,
    minPickupWeightKg: 30,
    serviceArea: 'Hyderabad, Secunderabad, Medchal, Rangareddy',
    trustScore: 93,
    offeredRates: {
      pcb: 375,
      cables: 515,
      batteries: 138,
      lcd: 92,
      motors: 285
    },
    rating: 4.7,
    totalHandovers: 178,
    verificationDate: '2024-05-30'
  },
  {
    id: 'REC-005',
    name: 'CleanTech Smelting & E-Recovery Ltd.',
    facilityLocation: 'GIDC Estate, Vatva Phase 4, Ahmedabad',
    city: 'Ahmedabad',
    distanceKm: 18.2,
    materialsAccepted: ['pcb', 'cables', 'batteries', 'crt', 'lcd', 'mixed_plastics'],
    authorizationNumber: 'GPCB/HAZ-EW/2024/5521',
    authorizationStatus: 'VERIFIED',
    contactNumber: '+91 79 2583 4000',
    pickupAvailable: true,
    minPickupWeightKg: 40,
    serviceArea: 'Ahmedabad, Gandhinagar, Sanand Industrial Zone',
    trustScore: 91,
    offeredRates: {
      pcb: 370,
      cables: 510,
      batteries: 135,
      crt: 32,
      lcd: 90,
      mixed_plastics: 27
    },
    rating: 4.6,
    totalHandovers: 142,
    verificationDate: '2024-06-14'
  },
  {
    id: 'REC-006',
    name: 'Apeksha Metals & Informal Aggregators (Pending Verification)',
    facilityLocation: 'Shop 14, Dharavi 90ft Road, Mumbai',
    city: 'Mumbai',
    distanceKm: 2.1,
    materialsAccepted: ['cables', 'motors'],
    authorizationNumber: 'APPLY-TEMP-2026/8891',
    authorizationStatus: 'PENDING',
    contactNumber: '+91 98200 77665',
    pickupAvailable: false,
    minPickupWeightKg: 10,
    serviceArea: 'Dharavi Local Ward Only',
    trustScore: 68,
    offeredRates: {
      cables: 450,
      motors: 240
    },
    rating: 3.8,
    totalHandovers: 18,
    verificationDate: 'Pending CPCB Inspection'
  }
];

export const MOCK_PRICE_HISTORY: PriceRecord[] = [
  { id: 'PR-01', materialCategory: 'pcb', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 385, minPrice: 340, maxPrice: 440, unit: 'kg', trend: 'up', changePercent: 3.2 },
  { id: 'PR-02', materialCategory: 'pcb', location: 'Delhi NCR', dateTime: '2026-08-29', buyingPrice: 390, minPrice: 350, maxPrice: 450, unit: 'kg', trend: 'up', changePercent: 2.8 },
  { id: 'PR-03', materialCategory: 'pcb', location: 'Pune', dateTime: '2026-08-29', buyingPrice: 380, minPrice: 340, maxPrice: 430, unit: 'kg', trend: 'stable', changePercent: 0.5 },
  { id: 'PR-04', materialCategory: 'cables', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 530, minPrice: 480, maxPrice: 620, unit: 'kg', trend: 'up', changePercent: 4.1 },
  { id: 'PR-05', materialCategory: 'cables', location: 'Delhi NCR', dateTime: '2026-08-29', buyingPrice: 525, minPrice: 470, maxPrice: 610, unit: 'kg', trend: 'up', changePercent: 3.5 },
  { id: 'PR-06', materialCategory: 'batteries', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 145, minPrice: 110, maxPrice: 190, unit: 'kg', trend: 'stable', changePercent: -0.8 },
  { id: 'PR-07', materialCategory: 'crt', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 35, minPrice: 25, maxPrice: 50, unit: 'kg', trend: 'down', changePercent: -2.5 },
  { id: 'PR-08', materialCategory: 'lcd', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 98, minPrice: 75, maxPrice: 130, unit: 'kg', trend: 'up', changePercent: 1.9 },
  { id: 'PR-09', materialCategory: 'motors', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 295, minPrice: 250, maxPrice: 350, unit: 'kg', trend: 'up', changePercent: 2.1 },
  { id: 'PR-10', materialCategory: 'magnets', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 185, minPrice: 150, maxPrice: 230, unit: 'kg', trend: 'stable', changePercent: 0.2 },
  { id: 'PR-11', materialCategory: 'mixed_plastics', location: 'Mumbai', dateTime: '2026-08-29', buyingPrice: 30, minPrice: 20, maxPrice: 38, unit: 'kg', trend: 'stable', changePercent: 0.0 }
];

export const INITIAL_LOTS: LotItem[] = [
  {
    id: 'LOT-IND-2026-000124',
    collectorId: 'COL-001',
    collectorName: 'Ramesh Kumar',
    collectorPhone: '+91 98765 43210',
    materialCategory: 'pcb',
    subcategory: 'Desktop & Server Motherboards (Gold Plated Connectors)',
    description: '40 kg high-grade green computer motherboards and server circuit boards collected from Sion scrap aggregators.',
    photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    approximateWeightKg: 40,
    actualWeightKg: 39.5,
    condition: 'non_working',
    sourceType: 'scrap_collection',
    location: 'Dharavi Depot, Mumbai (Near Sion Station)',
    createdAt: '2026-08-29T10:15:00Z',
    estimatedRatePerKg: 385,
    estimatedTotalValue: 15400,
    finalRatePerKg: 385,
    finalTotalValue: 15207.5,
    matchedRecyclerId: 'REC-001',
    matchedRecyclerName: 'EcoShred Circular Solutions Ltd.',
    status: 'CREATED',
    otpCode: '582914',
    paymentMethod: 'UPI',
    paymentStatus: 'PENDING',
    traceability: [
      {
        id: 'TR-101',
        lotId: 'LOT-IND-2026-000124',
        stage: 'CREATED',
        timestamp: '2026-08-29T10:15:00Z',
        actorRole: 'COLLECTOR',
        actorName: 'Ramesh Kumar',
        location: 'Dharavi Sector 3, Mumbai (19.0433° N, 72.8571° E)',
        notes: 'Lot registered via RecyLink Smartphone interface with AI Vision confirmation (89% PCB confidence).',
        verificationMethod: 'SYSTEM',
        weightKg: 40
      }
    ]
  },
  {
    id: 'LOT-IND-2026-000120',
    collectorId: 'COL-002',
    collectorName: 'Sanjay Shinde',
    collectorPhone: '+91 98220 11223',
    materialCategory: 'cables',
    subcategory: 'Flexible Copper Wiring (Unburned)',
    description: '65 kg clean flexible copper wiring harvested from industrial switchboard maintenance.',
    photoUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    approximateWeightKg: 65,
    actualWeightKg: 64.2,
    condition: 'non_working',
    sourceType: 'institution',
    location: 'Bhosari Industrial Cluster, Pune',
    createdAt: '2026-08-28T14:30:00Z',
    estimatedRatePerKg: 535,
    estimatedTotalValue: 34775,
    finalRatePerKg: 535,
    finalTotalValue: 34347,
    matchedRecyclerId: 'REC-003',
    matchedRecyclerName: 'MahaRecycle Industrial Recovery Hub',
    status: 'PAID',
    pickupScheduledTime: '2026-08-29T11:00:00Z',
    otpCode: '741290',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentReference: 'UPI/20260829/MHREC/99281',
    traceability: [
      {
        id: 'TR-201',
        lotId: 'LOT-IND-2026-000120',
        stage: 'CREATED',
        timestamp: '2026-08-28T14:30:00Z',
        actorRole: 'COLLECTOR',
        actorName: 'Sanjay Shinde',
        location: 'Bhosari, Pune',
        notes: 'Lot created with unburned copper cables.',
        verificationMethod: 'SYSTEM',
        weightKg: 65
      },
      {
        id: 'TR-202',
        lotId: 'LOT-IND-2026-000120',
        stage: 'PICKUP_SCHEDULED',
        timestamp: '2026-08-28T16:00:00Z',
        actorRole: 'RECYCLER',
        actorName: 'MahaRecycle Industrial Recovery Hub',
        location: 'Chakan Facility, Pune',
        notes: 'Pickup vehicle MH-14-GH-4412 dispatched with digital scale.',
        verificationMethod: 'SYSTEM'
      },
      {
        id: 'TR-203',
        lotId: 'LOT-IND-2026-000120',
        stage: 'HANDOVER_VERIFIED',
        timestamp: '2026-08-29T11:20:00Z',
        actorRole: 'RECYCLER',
        actorName: 'MahaRecycle (Driver: Satish)',
        location: 'Bhosari Collection Point',
        notes: 'Handover verified via OTP 741290. Calibrated weight: 64.2 kg.',
        verificationMethod: 'OTP',
        weightKg: 64.2
      },
      {
        id: 'TR-204',
        lotId: 'LOT-IND-2026-000120',
        stage: 'PAID',
        timestamp: '2026-08-29T11:25:00Z',
        actorRole: 'RECYCLER',
        actorName: 'MahaRecycle Finance',
        location: 'Pune',
        notes: 'Instant UPI payout of ₹34,347 processed directly to Sanjay Shinde Bank account.',
        verificationMethod: 'SYSTEM'
      },
      {
        id: 'TR-205',
        lotId: 'LOT-IND-2026-000120',
        stage: 'RECYCLED',
        timestamp: '2026-08-29T16:45:00Z',
        actorRole: 'RECYCLER',
        actorName: 'MahaRecycle Mechanical Granulation Unit',
        location: 'Chakan MIDC Phase 2',
        notes: 'Mechanical stripping completed without air emissions. 99.4% high-purity copper granules extracted for smelting.',
        verificationMethod: 'SYSTEM'
      }
    ]
  },
  {
    id: 'LOT-IND-2026-000118',
    collectorId: 'COL-003',
    collectorName: 'Raju Ansari',
    collectorPhone: '+91 91234 56789',
    saathiId: 'SAT-001',
    saathiName: 'Sunita Sharma (Digital Saathi)',
    materialCategory: 'batteries',
    subcategory: 'Lithium-Ion Laptop & Telecom Battery Packs',
    description: '30 kg intact lithium-ion battery modules registered by Digital Saathi Sunita.',
    photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    approximateWeightKg: 30,
    actualWeightKg: 30.1,
    condition: 'non_working',
    sourceType: 'shop',
    location: 'Seelampur Market Gali 4, Delhi NCR',
    createdAt: '2026-08-27T09:00:00Z',
    estimatedRatePerKg: 142,
    estimatedTotalValue: 4260,
    finalRatePerKg: 142,
    finalTotalValue: 4274.2,
    matchedRecyclerId: 'REC-002',
    matchedRecyclerName: 'GreenMatrix E-Stewards Pvt. Ltd.',
    status: 'HANDOVER_VERIFIED',
    pickupScheduledTime: '2026-08-28T15:00:00Z',
    otpCode: '319082',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    traceability: [
      {
        id: 'TR-301',
        lotId: 'LOT-IND-2026-000118',
        stage: 'CREATED',
        timestamp: '2026-08-27T09:00:00Z',
        actorRole: 'SAATHI',
        actorName: 'Sunita Sharma (Digital Saathi)',
        location: 'Seelampur, Delhi NCR',
        notes: 'Assisted registration for Raju Ansari (Feature Phone User). Safe packaging guidelines explained.',
        verificationMethod: 'SYSTEM',
        weightKg: 30
      },
      {
        id: 'TR-302',
        lotId: 'LOT-IND-2026-000118',
        stage: 'HANDOVER_VERIFIED',
        timestamp: '2026-08-28T15:40:00Z',
        actorRole: 'RECYCLER',
        actorName: 'GreenMatrix Logistics Team',
        location: 'Seelampur Aggregation Hub',
        notes: 'Handover verified via QR scan and OTP. Cash payment of ₹4,274 handed over on spot with printed thermal receipt.',
        verificationMethod: 'QR',
        weightKg: 30.1
      }
    ]
  }
];

export const SAFETY_GUIDES_DATA: SafetyGuideItem[] = [
  {
    id: 'SG-01',
    title: {
      en: 'Wire & Cable Burning Prohibition',
      hi: 'तारों को कभी न जलाएं (No Cable Burning)',
      mr: 'तारा कधीही जाळू नका (No Wire Burning)'
    },
    icon: 'FlameOff',
    danger: true,
    message: {
      en: 'Burning PVC wires releases toxic dioxins that cause permanent lung damage. Formal recyclers use automated cable peelers and pay 25% higher rates for unburned copper.',
      hi: 'तार जलाने से जहरीला धुआं निकलता है जो फेफड़ों को नुकसान पहुंचाता है। रीसाइक्लर बिना जले तांबे का 25% ज्यादा रेट देते हैं।',
      mr: 'तारा जाळल्याने विषारी वायू तयार होतो. अधिकृत रिसायकलर्स न जाळलेल्या तांब्यासाठी २५% जास्त भाव देतात.'
    },
    audioScript: {
      en: 'Warning: Never burn cables to remove plastic insulation. Burning causes cancer and decreases the scrap copper value. Authorized recyclers use automated wire strippers and pay you full market price.',
      hi: 'सावधान: तांबा निकालने के लिए तारों को आग में कभी न जलाएं। इससे जहरीली गैस बनती है। बिना जलाए देने पर रीसाइक्लर ज्यादा दाम देते हैं।',
      mr: 'सावधान: तांबे काढण्यासाठी तारा जाळू नका. स्वच्छ तारा दिल्यास अधिकृत रिसायकलर्स जास्त पैसे देतात.'
    }
  },
  {
    id: 'SG-02',
    title: {
      en: 'Safe Battery Storage & Handling',
      hi: 'बैटरी को सुरक्षित रखें (Battery Safety)',
      mr: 'बॅटरी सुरक्षित हाताळणी (Battery Safety)'
    },
    icon: 'ShieldAlert',
    danger: true,
    message: {
      en: 'Never puncture, hammer, or crush Lithium-ion or Lead-Acid batteries. Acid leakage causes deep burns and can spark dangerous fires in scrap piles.',
      hi: 'बैटरी पर कभी हथौड़ा न मारें और न ही खोलें। इससे आग लग सकती है और तेजाब से हाथ जल सकते हैं।',
      mr: 'बॅटरीवर कधीही हातोडा मारू नका किंवा फोडू नका. यामुळे आग लागू शकते आणि ॲसिडने त्वचा जळू शकते.'
    },
    audioScript: {
      en: 'Safety Alert: Do not break or open batteries. Keep battery terminals dry and store them separately in non-metal containers.',
      hi: 'सुरक्षा सूचना: बैटरी को कभी न फोड़ें। इसे सूखी जगह पर अलग रखें ताकि आग का खतरा न रहे।',
      mr: 'सुरक्षा सूचना: बॅटरी फोडू नका. कोरड्या जागी वेगळी ठेवा.'
    }
  },
  {
    id: 'SG-03',
    title: {
      en: 'CRT & Screen Handling Safety',
      hi: 'कांच और सीआरटी स्क्रीन की सुरक्षा (CRT Safety)',
      mr: 'सीआरटी व काचेची सुरक्षितता (CRT Safety)'
    },
    icon: 'Tv',
    danger: false,
    message: {
      en: 'Old CRT monitors have high internal vacuum. Dropping or smashing them causes dangerous glass implosions containing lead and phosphor powder.',
      hi: 'पुराने टीवी की स्क्रीन को न फोड़ें। टूटने पर कांच के टुकड़े और जहरीला पाउडर फैलता है।',
      mr: 'जुन्या टीव्हीची काच फोडू नका. फुटल्यास विषारी शिसे आणि काचेचे तुकडे उडतात.'
    },
    audioScript: {
      en: 'Handle CRT monitors gently. Never break the heavy glass tube. Carry with two hands using protective gloves.',
      hi: 'टीवी और स्क्रीन को दोनों हाथों से सावधानी से उठाएं और दस्ताने जरूर पहनें।',
      mr: 'टीव्ही आणि स्क्रीन काळजीपूर्वक उचला आणि हातमोजे वापरा.'
    }
  },
  {
    id: 'SG-04',
    title: {
      en: 'Mandatory PPE & Glove Protection',
      hi: 'दस्ताने और सुरक्षा गियर पहनें (Wear PPE Gloves)',
      mr: 'हातमोजे व सुरक्षेची साधने वापरा (Wear Gloves)'
    },
    icon: 'ShieldCheck',
    danger: false,
    message: {
      en: 'Always wear puncture-resistant rubber/leather gloves and closed-toe footwear when collecting and sorting sharp electronic components.',
      hi: 'ई-कचरा उठाते समय हमेशा मोटे दस्ताने और जूते पहनें ताकि नुकीले तार और कांच से चोट न लगे।',
      mr: 'ई-कचरा हाताळताना नेहमी जाड हातमोजे आणि बूट वापरा जेणेकरून जखम होणार नाही.'
    },
    audioScript: {
      en: 'Always protect your hands with heavy work gloves before handling sharp metal casings and broken components.',
      hi: 'सामान उठाने से पहले हमेशा काम करने वाले दस्ताने जरूर पहनें। अपनी सुरक्षा सबसे पहले है।',
      mr: 'साहित्य उचलण्यापूर्वी नेहमी कामाचे हातमोजे वापरा. आपली सुरक्षा पहिली आहे.'
    }
  }
];

export const FIELD_INTERVIEWS_DATA: FieldInterview[] = [
  {
    id: 'INT-01',
    collectorName: 'Ramesh Kumar (38 yrs)',
    area: 'Dharavi 60ft Road, Mumbai',
    materialCollected: 'Motherboards, PC scrap, copper wiring',
    currentBuyer: 'Local tier-3 scrap trader in Kurla',
    currentPriceDiscoveryMethod: 'Trader quote on phone, no benchmark visibility',
    transportationMethod: 'Handcart (thela) / rented tempo for heavy loads',
    smartphoneAvailable: true,
    interestInVoice: true,
    mainBarriers: 'Unfair weight deductions at informal trader scales and fluctuating cash rates.',
    expectedIncentives: 'Direct digital transparent weight scales, prompt UPI payment, and safety gloves.',
    date: '2026-08-15'
  },
  {
    id: 'INT-02',
    collectorName: 'Raju Ansari (44 yrs)',
    area: 'Gali 4, Seelampur, Delhi NCR',
    materialCollected: 'Mixed circuit boards, mobile scrap',
    currentBuyer: 'Wholesale aggregator in Seelampur',
    currentPriceDiscoveryMethod: 'Daily verbal rumor / word-of-mouth',
    transportationMethod: 'Bicycle with side baskets',
    smartphoneAvailable: false,
    interestInVoice: true,
    mainBarriers: 'Cannot read English text; does not have an Android smartphone; reliant on middleman.',
    expectedIncentives: 'Voice IVR assistance or community Digital Saathi who can book doorstep pickup.',
    date: '2026-08-20'
  },
  {
    id: 'INT-03',
    collectorName: 'Lakshmi Devi (41 yrs)',
    area: 'Govandi Shivaji Nagar, Mumbai',
    materialCollected: 'Household appliances, fan motors, mixed plastics',
    currentBuyer: 'Local scrap shop',
    currentPriceDiscoveryMethod: 'Fixed shopkeeper price',
    transportationMethod: 'Walking with gunny sacks',
    smartphoneAvailable: false,
    interestInVoice: true,
    mainBarriers: 'Heavy transportation cost eating up 30% of profit.',
    expectedIncentives: 'Doorstep pickup by verified recycler van and instant cash or bank transfer.',
    date: '2026-08-22'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    targetRole: 'COLLECTOR',
    targetUserId: 'COL-001',
    title: 'Recycler Assigned',
    message: 'EcoShred Solutions has been matched for your PCB Lot LOT-IND-2026-000124.',
    timestamp: '10 mins ago',
    read: false,
    lotId: 'LOT-IND-2026-000124'
  },
  {
    id: 'NOTIF-02',
    targetRole: 'RECYCLER',
    title: 'New Pickup Request',
    message: 'New 40 kg PCB pickup requested in Dharavi Sector 3 by Ramesh Kumar.',
    timestamp: '15 mins ago',
    read: false,
    lotId: 'LOT-IND-2026-000124'
  },
  {
    id: 'NOTIF-03',
    targetRole: 'ADMIN',
    title: 'Formal Chain Traceability',
    message: 'Lot LOT-IND-2026-000120 successfully recycled at MahaRecycle Chakan facility.',
    timestamp: '1 hour ago',
    read: true,
    lotId: 'LOT-IND-2026-000120'
  }
];

export const MOCK_NOTIFICATIONS = INITIAL_NOTIFICATIONS;

export const MOCK_ANOMALIES: AnomalyReport[] = [
  {
    id: 'ANOM-01',
    lotId: 'LOT-IND-2026-000098',
    reason: 'Weight Discrepancy > 25%',
    description: 'Reported approximate weight was 80 kg, but certified recycler scale logged 58.2 kg.',
    severity: 'HIGH',
    status: 'FLAGGED',
    createdAt: '2026-08-28T11:00:00Z',
    aiConfidence: 94
  },
  {
    id: 'ANOM-02',
    lotId: 'LOT-IND-2026-000104',
    reason: 'Rapid Repeated Submissions from Single Address',
    description: '4 high-volume PCB lots registered from same warehouse within 2 hours.',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: '2026-08-27T16:30:00Z',
    aiConfidence: 82
  }
];
