import {
  MemberAccount,
  LedgerEntry,
  MFSTransaction,
  CommissionPayout,
  EmergencyLoan,
  ConstructionProject,
  DistrictService,
  VehicleItem,
  FactoryProduct,
  HealthTourismDestination,
  EducationalResource,
  LegalAidCase,
  CyberReport,
  DeviceIMEIRecord,
  CallDetailRecord,
  MissingPersonMobile,
  MoujaPlotRecord,
  VoterRecord,
  GovPortalLink,
  BiometricAuthLog
} from '../types';

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail',
  'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira',
  'Bogra', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj', 'Pabna', 'Rajshahi', 'Sirajganj',
  'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon',
  'Barguna', 'Barisal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur',
  'Bandarban', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Comilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati',
  'Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet',
  'Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'
];

export const INITIAL_MFS_TRANSACTIONS: MFSTransaction[] = [
  { id: 'trx-101', trxId: 'BK2026072201', provider: 'bKash', senderPhone: '+8801711002233', receiverPhone: '+8801822334455', amount: 25000, charge: 0, type: 'Send Money', status: 'SUCCESS', timestamp: '2026-07-22 10:30' },
  { id: 'trx-102', trxId: 'NG2026072202', provider: 'Nagad', senderPhone: '+8801933445566', receiverPhone: '+8801644556677', amount: 50000, charge: 0, type: 'Merchant Pay', status: 'SUCCESS', timestamp: '2026-07-22 09:15' },
  { id: 'trx-103', trxId: 'RK2026072203', provider: 'Rocket', senderPhone: '+8801555667788', receiverPhone: '+8801366778899', amount: 12000, charge: 0, type: 'Cash Out', status: 'SUCCESS', timestamp: '2026-07-22 08:45' },
  { id: 'trx-104', trxId: 'EL2026072204', provider: 'GlobalEasyLoad', senderPhone: '+8801700112233', receiverPhone: '+8801700112233', amount: 500, charge: 0, type: 'Mobile Recharge', status: 'SUCCESS', timestamp: '2026-07-22 10:10' }
];

export const INITIAL_COOP_ACCOUNTS: MemberAccount[] = [
  { id: 'acc-01', accountNo: 'MDN-COOP-8801', memberName: 'Md. Al-Amin Chowdhury', district: 'Dhaka', totalSavings: 450000, totalDeposits: 600000, totalWithdrawals: 150000, lastTransactionDate: '2026-07-20', status: 'ACTIVE' },
  { id: 'acc-02', accountNo: 'MDN-COOP-8802', memberName: 'Begum Rokeya Sultana', district: 'Chittagong', totalSavings: 320000, totalDeposits: 350000, totalWithdrawals: 30000, lastTransactionDate: '2026-07-21', status: 'ACTIVE' },
  { id: 'acc-03', accountNo: 'MDN-COOP-8803', memberName: 'Hafiz Tanvir Ahmed', district: 'Sylhet', totalSavings: 890000, totalDeposits: 950000, totalWithdrawals: 60000, lastTransactionDate: '2026-07-19', status: 'ACTIVE' },
  { id: 'acc-04', accountNo: 'MDN-COOP-8804', memberName: 'Kazi Mahbub Hassan', district: 'Rajshahi', totalSavings: 210000, totalDeposits: 220000, totalWithdrawals: 10000, lastTransactionDate: '2026-07-22', status: 'ACTIVE' }
];

export const INITIAL_COOP_LEDGER: LedgerEntry[] = [
  { id: 'led-01', accountNo: 'MDN-COOP-8801', type: 'DEPOSIT', amount: 50000, date: '2026-07-20', note: 'Monthly Cooperative Savings Deposit', approvedBy: 'Admin - Dhaka Wing' },
  { id: 'led-02', accountNo: 'MDN-COOP-8802', type: 'DEPOSIT', amount: 30000, date: '2026-07-21', note: 'Welfare Fund Contribution', approvedBy: 'Admin - CTG Wing' },
  { id: 'led-03', accountNo: 'MDN-COOP-8803', type: 'DIVIDEND_PAYOUT', amount: 45000, date: '2026-07-19', note: 'Zero-Profit Annual Dividend Share', approvedBy: 'Global Ledger Auditor' }
];

export const INITIAL_COMMISSIONS: CommissionPayout[] = [
  { id: 'com-01', entrepreneurName: 'Rafiqul Islam (Jeshore Hub)', applicantPhone: '+8801712345678', referredService: 'Unani Factory Distributorship', commissionAmount: 18500, payoutStatus: 'PAID', payoutDate: '2026-07-21' },
  { id: 'com-02', entrepreneurName: 'Syeda Fatima Tuz Zahra', applicantPhone: '+8801898765432', referredService: 'Global EasyLoad Agent Point', commissionAmount: 7200, payoutStatus: 'PENDING_APPROVAL', payoutDate: '2026-07-22' },
  { id: 'com-03', entrepreneurName: 'Anwar Hossain (Comilla)', applicantPhone: '+8801911223344', referredService: 'Car Showroom Referral', commissionAmount: 35000, payoutStatus: 'PROCESSING', payoutDate: '2026-07-22' }
];

export const INITIAL_EMERGENCY_LOANS: EmergencyLoan[] = [
  { id: 'loan-01', applicantName: 'Tariqul Islam', nid: '19922691234567891', phone: '+8801710102030', district: 'Rangpur', amountRequested: 100000, purpose: 'Medical Emergency', tenureMonths: 12, status: 'APPROVED', repaidAmount: 25000, appliedDate: '2026-06-15' },
  { id: 'loan-02', applicantName: 'Nasrin Akhter', nid: '19882698765432109', phone: '+8801820203040', district: 'Bogura', amountRequested: 150000, purpose: 'Small Business Survival', tenureMonths: 18, status: 'DISBURSED', repaidAmount: 40000, appliedDate: '2026-05-10' },
  { id: 'loan-03', applicantName: 'Jashim Uddin', nid: '19952691122334455', phone: '+8801930304050', district: 'Sunamganj', amountRequested: 80000, purpose: 'Disaster Relief', tenureMonths: 10, status: 'UNDER_REVIEW', repaidAmount: 0, appliedDate: '2026-07-20' }
];

export const INITIAL_CONSTRUCTION_PROJECTS: ConstructionProject[] = [
  { id: 'const-01', title: 'Madani Welfare House #104', beneficiaryName: 'Khorshed Alam (Flood Victim)', district: 'Sylhet', rodAllocatedKg: 4500, cementAllocatedBags: 600, laborSupportCount: 12, completionPercentage: 75, status: 'Structure Building', lastUpdated: '2026-07-21' },
  { id: 'const-02', title: 'Free Community Shelter #42', beneficiaryName: 'Barishal Rural Rehabilitation Center', district: 'Barisal', rodAllocatedKg: 12000, cementAllocatedBags: 1800, laborSupportCount: 30, completionPercentage: 40, status: 'Foundation', lastUpdated: '2026-07-18' },
  { id: 'const-03', title: 'Widow Family Housing Complex', beneficiaryName: 'Khadija Begum & Children', district: 'Cox\'s Bazar', rodAllocatedKg: 3800, cementAllocatedBags: 480, laborSupportCount: 8, completionPercentage: 100, status: 'Completed', lastUpdated: '2026-07-10' }
];

export const INITIAL_DISTRICT_SERVICES: DistrictService[] = [
  { id: 'ds-dhaka', districtName: 'Dhaka', divisionName: 'Dhaka', freeAmbulancePhone: '+8801700000001', emergencyHelpline: '16100 / 999', reliefCenterAddress: 'Madani Global Tower, Motijheel C/A, Dhaka', transportHubs: ['Gabtoli Central', 'Mohakhali Bus Terminal', 'Kamalapur Station'], socialServiceOfficers: ['Dr. Shahadat Hossain (+8801711122334)', 'Engr. Nizam Uddin (+8801811223344)'] },
  { id: 'ds-ctg', districtName: 'Chittagong', divisionName: 'Chittagong', freeAmbulancePhone: '+8801700000002', emergencyHelpline: '16100 / 999', reliefCenterAddress: 'Agrabad Commercial Area, Chittagong', transportHubs: ['Kadamtali Bus Terminal', 'Chittagong Railway Junction'], socialServiceOfficers: ['Mst. Rehana Parvin (+8801911223344)'] },
  { id: 'ds-sylhet', districtName: 'Sylhet', divisionName: 'Sylhet', freeAmbulancePhone: '+8801700000003', emergencyHelpline: '16100 / 999', reliefCenterAddress: 'Madani Relief Complex, Zindabazar, Sylhet', transportHubs: ['Kadamtoli Sylhet Central', 'Sylhet Railway Station'], socialServiceOfficers: ['Moulana Harunur Rashid (+8801611223344)'] },
  { id: 'ds-rajshahi', districtName: 'Rajshahi', divisionName: 'Rajshahi', freeAmbulancePhone: '+8801700000004', emergencyHelpline: '16100 / 999', reliefCenterAddress: 'Shiromoni Welfare Plaza, Rajshahi', transportHubs: ['Shiromoni Terminal', 'Rajshahi Station'], socialServiceOfficers: ['Md. Zafar Iqbal (+8801511223344)'] }
];

export const INITIAL_VEHICLES: VehicleItem[] = [
  { id: 'veh-01', name: 'Madani EV Eco Cruiser 2026', type: 'CAR', brand: 'Madani Electric', priceBDT: 2850000, engineCc: 0, fuelType: '100% Electric (450km range)', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', installmentAvailable: true, stockCount: 14, showroomLocation: 'Dhaka Central Showroom' },
  { id: 'veh-02', name: 'Madani Executive Sedan V6', type: 'CAR', brand: 'Madani Motors', priceBDT: 4200000, engineCc: 2500, fuelType: 'Octane / Hybrid', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', installmentAvailable: true, stockCount: 8, showroomLocation: 'Chittagong Port Showroom' },
  { id: 'veh-03', name: 'Madani Freedom 150 ABS', type: 'BIKE', brand: 'Madani Rider', priceBDT: 185000, engineCc: 150, fuelType: 'Octane', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80', installmentAvailable: true, stockCount: 45, showroomLocation: 'Sylhet Regional Hub' },
  { id: 'veh-04', name: 'Madani Heavy Hauler Truck 10-Ton', type: 'COMMERCIAL', brand: 'Madani Commercial', priceBDT: 3800000, engineCc: 4200, fuelType: 'Diesel', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', installmentAvailable: true, stockCount: 6, showroomLocation: 'Gazipur Industrial Zone' }
];

export const INITIAL_FACTORY_PRODUCTS: FactoryProduct[] = [
  { id: 'fact-01', productName: 'Madani Pure Unani Chyawanprash & Herbal Tonic', category: 'Unani Laboratories', unitPriceBDT: 380, batchNumber: 'UNANI-2026-B88', productionCapacityPerDay: 5000, stockAvailable: 12500, certification: 'BSTI & Herbal Board Approved', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
  { id: 'fact-02', productName: 'Madani Long-Burn Soy Candles (Pack of 12)', category: 'Candles', unitPriceBDT: 150, batchNumber: 'CNDL-2026-04', productionCapacityPerDay: 20000, stockAvailable: 85000, certification: 'ISO 9001 Eco Safety', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80' },
  { id: 'fact-03', productName: 'Madani Smooth Gel Pen Box (24 Pcs)', category: 'Pens & Stationeries', unitPriceBDT: 240, batchNumber: 'PEN-2026-99', productionCapacityPerDay: 50000, stockAvailable: 210000, certification: 'Non-Toxic Ink Grade A', image: 'https://images.unsplash.com/photo-1585336261026-8f5786372966?w=800&q=80' },
  { id: 'fact-04', productName: 'Madani Ultra-Bright 18W LED Light Bulb', category: 'Energy Lights', unitPriceBDT: 210, batchNumber: 'LED-2026-18W', productionCapacityPerDay: 15000, stockAvailable: 64000, certification: 'Energy Star 5-Star Rated', image: 'https://images.unsplash.com/photo-1550524514-e26d2adb9e0b?w=800&q=80' },
  { id: 'fact-05', productName: 'Madani Organic Black Seed Oil & Honey Food Jar', category: 'Halal Food Products', unitPriceBDT: 520, batchNumber: 'FOOD-2026-77', productionCapacityPerDay: 8000, stockAvailable: 32000, certification: 'BSTI & 100% Halal Board', image: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=800&q=80' }
];

export const INITIAL_HEALTH_TOURISM: HealthTourismDestination[] = [
  { id: 'ht-01', country: 'India', hospitalName: 'Apollo Hospitals & Fortis Healthcare Alliance', specialty: 'Advanced Cardiology, Organ Transplant, Oncology', locationCity: 'Chennai / New Delhi / Kolkata', estimatedCostUSD: 2500, visaRequirements: ['Medical Visa Recommendation Letter from Madani Global', 'Passport with 6 Months Validity', 'Recent Medical Diagnostic Reports', 'Bank Statement / Sponsorship Certificate'], mouPartnerStatus: 'Official Super-App Fast-Track Partner', helplinePhone: '+8801700998877' },
  { id: 'ht-02', country: 'China', hospitalName: 'Peking Union Medical College Hospital & West China Hospital', specialty: 'Robotic Surgery, Stem Cell Therapy, Complex Neurology', locationCity: 'Beijing / Chengdu / Guangzhou', estimatedCostUSD: 4200, visaRequirements: ['China Medical Visa Category S1/S2', 'Madani Global Certified Translation of Reports', 'Hospital Invitation Notice', 'Biometric Fingerprint Booking'], mouPartnerStatus: 'Official Super-App Fast-Track Partner', helplinePhone: '+8801700998888' }
];

export const INITIAL_EDUCATIONAL_RESOURCES: EducationalResource[] = [
  { id: 'edu-01', title: 'Complete Tafsir Ibn Kathir (Full 10 Volumes in Bengali & Arabic)', category: 'Islamic & Quran/Tafsir', format: 'PDF_BOOK', authorOrInstructor: 'Imam Ibn Kathir (Bengali Translation Team)', downloadCount: 428000, fileSizeOrDuration: '240 MB PDF', url: 'https://example.com/tafsir-ibn-kathir.pdf', description: 'Comprehensive verse-by-verse Tafsir with authentic Hadith references.' },
  { id: 'edu-02', title: 'Full Stack Web Development & AI Engineering Masterclass', category: 'Software Engineering & Coding', format: 'VIDEO_COURSE', authorOrInstructor: 'Madani Tech Academy', downloadCount: 192000, fileSizeOrDuration: '120 Video Modules (45 Hours)', url: 'https://example.com/course-fullstack', description: 'Master React, TypeScript, Express, AI API integrations, and Cloud Architecture.' },
  { id: 'edu-03', title: 'Quranic Arabic Grammar & Linguistics Companion', category: 'Islamic & Quran/Tafsir', format: 'PDF_BOOK', authorOrInstructor: 'Dr. Abdul Rahim', downloadCount: 310000, fileSizeOrDuration: '45 MB PDF', url: 'https://example.com/quranic-arabic.pdf', description: 'Structured guide to understanding Quranic vocabulary and sentence structures.' },
  { id: 'edu-04', title: 'Higher Secondary & University Physics, Chemistry, Higher Math Complete Kit', category: 'Science & Math', format: 'PDF_BOOK', authorOrInstructor: 'National Curriculum Board Experts', downloadCount: 520000, fileSizeOrDuration: '310 MB PDF Archive', url: 'https://example.com/science-kit.pdf', description: 'Full textbook series with solved mathematical problems and board question papers.' }
];

export const INITIAL_LEGAL_AID_CASES: LegalAidCase[] = [
  { id: 'leg-01', victimName: 'Sufia Begum (Land Grab Victim)', district: 'Narayanganj', incidentType: 'Human Rights Violation', incidentDetails: 'Local land grabbers forcibly occupied ancestral agricultural land and threatened the family.', assignedLawyer: 'Advocate Barrister M. Rahman (High Court)', status: 'CASE_FILED', filedDate: '2026-07-15' },
  { id: 'leg-02', victimName: 'Kamrul Islam', district: 'Gazipur', incidentType: 'Unlawful Detention', incidentDetails: 'False extortion accusations filed by local syndicate; victim held without proper legal counsel.', assignedLawyer: 'Advocate Shahana Parveen', status: 'URGENT', filedDate: '2026-07-21' }
];

export const INITIAL_CYBER_REPORTS: CyberReport[] = [
  { id: 'cyb-01', victimAlias: 'Victim_Alpha_2026', crimeType: 'Blackmail & Extortion', evidenceSummary: 'Extortionist demanded BDT 200,000 using manipulated social media screenshots.', riskLevel: 'CRITICAL', recoveryStatus: 'PERPETRATOR_IDENTIFIED', reportCode: 'CYBER-2026-9912', timestamp: '2026-07-22 09:40' },
  { id: 'cyb-02', victimAlias: 'Student_Shield_88', crimeType: 'Cyber Bullying', evidenceSummary: 'Defamatory commentary and unauthorized picture distribution across instant messenger groups.', riskLevel: 'HIGH', recoveryStatus: 'EVIDENCE_LOCKED', reportCode: 'CYBER-2026-8804', timestamp: '2026-07-21 14:15' }
];

export const INITIAL_IMEI_DATABASE: DeviceIMEIRecord[] = [
  { imei: '864201049981234', deviceModel: 'Samsung Galaxy S24 Ultra', registeredOwner: 'Md. Shahidul Alam', simNumber: '+8801711223344', lastSimOperator: 'Grameenphone', currentTowerLocation: 'Dhaka - Motijheel Commercial Area Tower #14', coordinates: { lat: 23.7289, lng: 90.4194 }, status: 'UNDER_SURVEILLANCE', lastSeenTimestamp: '2026-07-22 10:50:12' },
  { imei: '358912084455667', deviceModel: 'iPhone 15 Pro Max', registeredOwner: 'Tanjima Rahman', simNumber: '+8801822334455', lastSimOperator: 'Robi', currentTowerLocation: 'Chittagong - Agrabad Access Road Tower #08', coordinates: { lat: 22.3350, lng: 91.8325 }, status: 'REPORTED_STOLEN', lastSeenTimestamp: '2026-07-22 10:48:00' },
  { imei: '861102035544332', deviceModel: 'Xiaomi Redmi Note 13', registeredOwner: 'Anisur Rahman', simNumber: '+8801933445566', lastSimOperator: 'Banglalink', currentTowerLocation: 'Sylhet - Zindabazar Shopping Complex Tower #03', coordinates: { lat: 24.8949, lng: 91.8687 }, status: 'ACTIVE', lastSeenTimestamp: '2026-07-22 10:52:30' }
];

export const INITIAL_CDR_LOGS: CallDetailRecord[] = [
  { id: 'cdr-001', callerPhone: '+8801711223344', receiverPhone: '+8801899887766', durationSeconds: 340, callType: 'INCOMING', cellTowerId: 'TOWER-DHK-442', locationArea: 'Dhaka - Gulshan 1', timestamp: '2026-07-22 10:22:10', suspicionScore: 12 },
  { id: 'cdr-002', callerPhone: '+8801899887766', receiverPhone: '+8801900112233', durationSeconds: 12, callType: 'OUTGOING', cellTowerId: 'TOWER-DHK-442', locationArea: 'Dhaka - Gulshan 1', timestamp: '2026-07-22 10:25:00', suspicionScore: 88 },
  { id: 'cdr-003', callerPhone: '+8801899887766', receiverPhone: '+8801544332211', durationSeconds: 890, callType: 'ENCRYPTED', cellTowerId: 'TOWER-CTG-109', locationArea: 'Chittagong Port Zone', timestamp: '2026-07-22 10:30:15', suspicionScore: 94 },
  { id: 'cdr-004', callerPhone: '+8801711223344', receiverPhone: '+8801300998877', durationSeconds: 180, callType: 'SMS', cellTowerId: 'TOWER-DHK-110', locationArea: 'Dhaka - Motijheel', timestamp: '2026-07-22 10:40:00', suspicionScore: 5 }
];

export const INITIAL_MISSING_PERSONS: MissingPersonMobile[] = [
  { id: 'mp-01', type: 'PERSON', nameOrItem: 'Master Rayhan Chowdhury (Age 11)', lastSeenLocation: 'Mymensingh Railway Station', district: 'Mymensingh', contactNumber: '+8801711000111', description: 'Wearing blue shirt and black pants. Speaks Bengali with Mymensingh dialect.', firNumber: 'Mymensingh Model Thana FIR #402/2026', rewardBDT: 100000, status: 'CRITICAL_ALERT' },
  { id: 'mp-02', type: 'STOLEN_MOBILE', nameOrItem: 'iPhone 15 Pro Max (Natural Titanium)', lastSeenLocation: 'Bashundhara City Shopping Mall, Dhaka', district: 'Dhaka', contactNumber: '+8801822334455', description: 'Stolen from 4th floor food court. Device IMEI: 358912084455667.', firNumber: 'Tejgaon Thana GD #1204/2026', rewardBDT: 25000, status: 'SEARCHING' }
];

export const INITIAL_MOUJA_PLOTS: MoujaPlotRecord[] = [
  { id: 'mj-01', district: 'Dhaka', upazila: 'Savara', moujaName: 'Badda Mouja', jlNumber: '88', plotNumber: '1402', khatianNo: '512/B', ownerName: 'Md. Al-Amin Chowdhury', landAreaDecimal: 18.5, landCategory: 'Commercial' },
  { id: 'mj-02', district: 'Chittagong', upazila: 'Patiya', moujaName: 'Haidgaon Mouja', jlNumber: '42', plotNumber: '890', khatianNo: '104', ownerName: 'Madani Welfare Trust', landAreaDecimal: 120.0, landCategory: 'Agriculture' },
  { id: 'mj-03', district: 'Sylhet', upazila: 'Golapganj', moujaName: 'Dhaka Dakhin Mouja', jlNumber: '15', plotNumber: '304', khatianNo: '78', ownerName: 'Hafiz Tanvir Ahmed', landAreaDecimal: 45.2, landCategory: 'Residential' }
];

export const INITIAL_VOTERS: VoterRecord[] = [
  { voterId: 'VOT-2026-9901', nid: '19902691234567890', name: 'Md. Al-Amin Chowdhury', dob: '1990-04-12', fatherName: 'Md. Abdus Salam', motherName: 'Fatema Begum', votingCenter: 'Motijheel Government High School', district: 'Dhaka' },
  { voterId: 'VOT-2026-9902', nid: '19852698765432101', name: 'Begum Rokeya Sultana', dob: '1985-09-25', fatherName: 'Syed Shamsul Haque', motherName: 'Anwara Begum', votingCenter: 'Agrabad Government Girls School', district: 'Chittagong' },
  { voterId: 'VOT-2026-9903', nid: '19922691122334455', name: 'Hafiz Tanvir Ahmed', dob: '1992-01-18', fatherName: 'Moulana Abdul Jalil', motherName: 'Safia Khatun', votingCenter: 'Zindabazar Primary School', district: 'Sylhet' }
];

export const GOV_PORTAL_LINKS: GovPortalLink[] = [
  { id: 'gov-01', title: 'National ID (NID) Service Portal', category: 'NID & Passport', url: 'https://services.nidw.gov.bd', description: 'Re-issue NID card, correction, digital NID download, voter registration.' },
  { id: 'gov-02', title: 'Bangladesh e-Passport Application', category: 'NID & Passport', url: 'https://www.epassport.gov.bd', description: 'Online e-passport application, payment, appointment booking, and status tracking.' },
  { id: 'gov-03', title: 'e-Porcha & Land Record Portal (Khatian)', category: 'Land & e-Porcha', url: 'https://eporcha.gov.bd', description: 'Search and download Khatian, Mouja map request, land mutation status.' },
  { id: 'gov-04', title: 'Online Police Clearance Certificate', category: 'Law & Police Clearance', url: 'https://pcc.police.gov.bd', description: 'Apply for official police clearance certificate for foreign travel and employment.' },
  { id: 'gov-05', title: 'Bangladesh e-TIN & National Board of Revenue', category: 'Education & Tax', url: 'https://secure.incometax.gov.bd', description: 'e-TIN registration, income tax return filing, tax certificate download.' }
];

export const INITIAL_BIOMETRIC_AUTH_LOGS: BiometricAuthLog[] = [
  {
    id: 'auth-log-101',
    officerBadge: 'CID-BD-8801',
    officerName: 'Inspector Jahangir Alam',
    division: 'CID',
    method: 'FINGERPRINT',
    status: 'SUCCESS',
    ipAddress: '103.24.182.45 (CID HQ Secure Line)',
    location: 'Dhaka - Headquarters Cell',
    deviceInfo: 'Biometric Optical Scanner (Model: BioMax-900)',
    timestamp: '2026-07-22 10:52:14',
    notes: 'Access granted to Encrypted IMEI & CDR Database.'
  },
  {
    id: 'auth-log-102',
    officerBadge: 'RAB-ELITE-402',
    officerName: 'Major Tanvir Chowdhury',
    division: 'RAB',
    method: 'FACE_ID',
    status: 'SUCCESS',
    ipAddress: '103.24.182.90 (RAB Cyber Terminal)',
    location: 'Uttara RAB Headquarters, Dhaka',
    deviceInfo: 'IR Depth Mesh Camera Terminal',
    timestamp: '2026-07-22 10:15:30',
    notes: 'Access granted for Emergency Missing Person Tracking.'
  },
  {
    id: 'auth-log-103',
    officerBadge: 'UNKNOWN-REQ-99',
    officerName: 'Unrecognized Entity',
    division: 'CYBER_CRIME',
    method: 'FINGERPRINT',
    status: 'SUSPICIOUS_DENIED',
    ipAddress: '185.220.101.4 (Proxy Gateway)',
    location: 'Unverified External IP',
    deviceInfo: 'Virtual Biometric Emulator',
    timestamp: '2026-07-22 09:42:01',
    notes: 'Fingerprint minutiae hash mismatch. Access automatically blocked & logged.'
  },
  {
    id: 'auth-log-104',
    officerBadge: 'POLICE-BD-3302',
    officerName: 'ASP Naimul Hasan',
    division: 'POLICE',
    method: 'SECURITY_PIN',
    status: 'FAILED',
    ipAddress: '103.230.10.12 (Police HQ Subnet)',
    location: 'Gulshan Thana, Dhaka',
    deviceInfo: 'Command Line Terminal',
    timestamp: '2026-07-22 08:30:22',
    notes: 'Incorrect authority PIN entered (Attempt 2/3).'
  },
  {
    id: 'auth-log-105',
    officerBadge: 'ARMY-SIG-1044',
    officerName: 'Capt. Shakil Ahmed',
    division: 'ARMY',
    method: 'FACE_ID',
    status: 'SUCCESS',
    ipAddress: '103.24.180.11 (Defense Signal Grid)',
    location: 'Dhaka Cantonment - Signal Core',
    deviceInfo: 'Encrypted Military Tablet',
    timestamp: '2026-07-22 07:11:05',
    notes: 'Routine security clearance verification.'
  },
  {
    id: 'auth-log-106',
    officerBadge: 'CID-BD-9920',
    officerName: 'Sub-Inspector Farhana Yasmin',
    division: 'CID',
    method: 'FINGERPRINT',
    status: 'SUCCESS',
    ipAddress: '103.24.182.48 (CID Subnet)',
    location: 'Chittagong Regional Command',
    deviceInfo: 'Mobile Fingerprint Terminal (Android Secured)',
    timestamp: '2026-07-21 22:18:40',
    notes: 'Biometric authorization verified for CDR frequency matrix query.'
  }
];

