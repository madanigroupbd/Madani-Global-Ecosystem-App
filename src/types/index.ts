export type UserRole = 'GENERAL_USER' | 'COOP_ADMIN' | 'LAW_ENFORCEMENT_OFFICER';

export type AuthorityDivision = 'CID' | 'POLICE' | 'RAB' | 'ARMY' | 'CYBER_CRIME';

export interface UserProfile {
  id: string;
  name: string;
  nid: string;
  phone: string;
  district: string;
  role: UserRole;
  authorityBadge?: string;
  authorityDivision?: AuthorityDivision;
  isBiometricAuthenticated: boolean;
}

// Module 1: Fintech & Telecom
export type MFSProvider = 'bKash' | 'Nagad' | 'Rocket' | 'GlobalEasyLoad';

export interface MFSTransaction {
  id: string;
  trxId: string;
  provider: MFSProvider;
  senderPhone: string;
  receiverPhone: string;
  amount: number;
  charge: number;
  type: 'Send Money' | 'Cash Out' | 'Merchant Pay' | 'Mobile Recharge';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
}

export interface MemberAccount {
  id: string;
  accountNo: string;
  memberName: string;
  district: string;
  totalSavings: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lastTransactionDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface SavingsGoal {
  id: string;
  title: string;
  category: 'Hajj & Umrah' | 'Emergency Repair' | 'Education' | 'Business Investment' | 'Family Marriage' | 'Agri Machinery';
  targetAmount: number;
  currentAllocated: number;
  targetDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  accountNo?: string;
}

export interface AutoPayRule {
  id: string;
  loanId: string;
  applicantName: string;
  accountNo?: string;
  mfsProvider: 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  triggerType: 'UPON_MFS_INFLOW' | 'FIXED_MONTHLY' | 'WEEKLY_CYCLE';
  minInflowThreshold: number;
  deductionAmount: number;
  deductionDayOfMonth: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  nextDeductionDate: string;
  autoPayHistory?: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    mfsTrxId?: string;
    provider: string;
  }>;
}

export interface LedgerEntry {
  id: string;
  accountNo: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'DIVIDEND_PAYOUT';
  amount: number;
  date: string;
  note: string;
  approvedBy: string;
}

export interface CommissionPayout {
  id: string;
  entrepreneurName: string;
  applicantPhone: string;
  referredService: string;
  commissionAmount: number;
  payoutStatus: 'PAID' | 'PENDING_APPROVAL' | 'PROCESSING';
  payoutDate: string;
}

// Module 2: Zero-Profit Welfare & Construction
export interface EmergencyLoan {
  id: string;
  applicantName: string;
  nid: string;
  phone: string;
  district: string;
  amountRequested: number;
  purpose: 'Medical Emergency' | 'Small Business Survival' | 'Disaster Relief' | 'Education Support';
  tenureMonths: number;
  status: 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED' | 'DISBURSED';
  repaidAmount: number;
  appliedDate: string;
}

export interface ConstructionProject {
  id: string;
  title: string;
  beneficiaryName: string;
  district: string;
  rodAllocatedKg: number;
  cementAllocatedBags: number;
  laborSupportCount: number;
  completionPercentage: number;
  status: 'Planning' | 'Foundation' | 'Structure Building' | 'Completed';
  lastUpdated: string;
}

export interface DistrictService {
  id: string;
  districtName: string;
  divisionName: string;
  freeAmbulancePhone: string;
  emergencyHelpline: string;
  reliefCenterAddress: string;
  transportHubs: string[];
  socialServiceOfficers: string[];
}

// Module 3: Commerce & Factories
export interface VehicleItem {
  id: string;
  name: string;
  type: 'CAR' | 'BIKE' | 'COMMERCIAL';
  brand: string;
  priceBDT: number;
  engineCc: number;
  fuelType: string;
  image: string;
  installmentAvailable: boolean;
  stockCount: number;
  showroomLocation: string;
}

export interface FactoryProduct {
  id: string;
  productName: string;
  category: 'Unani Laboratories' | 'Candles' | 'Pens & Stationeries' | 'Energy Lights' | 'Halal Food Products';
  unitPriceBDT: number;
  batchNumber: string;
  productionCapacityPerDay: number;
  stockAvailable: number;
  certification: string;
  image: string;
}

export interface PackagingTemplate {
  productTitle: string;
  brandName: string;
  mfgDate: string;
  expDate: string;
  netWeight: string;
  batchNo: string;
  barcode: string;
  primaryColor: string;
  accentColor: string;
  ingredientsText: string;
  qrPayload: string;
  slogan: string;
}

// Module 4: Global Medical, Health Tourism & Education
export type MedicalCareType = 'Unani Herbal Care' | 'Emergency Surgery' | 'Allopathic Consultation';

export interface MedicalAppointment {
  id: string;
  patientName: string;
  phone: string;
  district: string;
  careType: MedicalCareType;
  symptoms: string;
  doctorAssigned: string;
  appointmentDate: string;
  status: 'CONFIRMED' | 'IN_CONSULTATION' | 'COMPLETED';
}

export interface HealthTourismDestination {
  id: string;
  country: 'India' | 'China';
  hospitalName: string;
  specialty: string;
  locationCity: string;
  estimatedCostUSD: number;
  visaRequirements: string[];
  mouPartnerStatus: string;
  helplinePhone: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  category: 'Islamic & Quran/Tafsir' | 'Software Engineering & Coding' | 'Science & Math' | 'Skill Development';
  format: 'PDF_BOOK' | 'VIDEO_COURSE';
  authorOrInstructor: string;
  downloadCount: number;
  fileSizeOrDuration: string;
  url: string;
  description: string;
}

// Module 5: Human Rights, Cyber Security & Law Enforcement
export interface LegalAidCase {
  id: string;
  victimName: string;
  district: string;
  incidentType: 'Human Rights Violation' | 'Land Dispute' | 'Domestic Violence' | 'Unlawful Detention';
  incidentDetails: string;
  assignedLawyer: string;
  status: 'URGENT' | 'CASE_FILED' | 'RESOLVED';
  filedDate: string;
}

export interface CyberReport {
  id: string;
  victimAlias: string;
  crimeType: 'Cyber Bullying' | 'Blackmail & Extortion' | 'Account Hacking' | 'Deepfake Harassment';
  evidenceSummary: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  recoveryStatus: 'INVESTIGATING' | 'EVIDENCE_LOCKED' | 'PERPETRATOR_IDENTIFIED' | 'RESOLVED';
  reportCode: string;
  timestamp: string;
}

export interface DeviceIMEIRecord {
  imei: string;
  deviceModel: string;
  registeredOwner: string;
  simNumber: string;
  lastSimOperator: 'Grameenphone' | 'Robi' | 'Banglalink' | 'Teletalk';
  currentTowerLocation: string;
  coordinates: { lat: number; lng: number };
  status: 'ACTIVE' | 'REPORTED_STOLEN' | 'UNDER_SURVEILLANCE';
  lastSeenTimestamp: string;
}

export interface CallDetailRecord {
  id: string;
  callerPhone: string;
  receiverPhone: string;
  durationSeconds: number;
  callType: 'INCOMING' | 'OUTGOING' | 'SMS' | 'ENCRYPTED';
  cellTowerId: string;
  locationArea: string;
  timestamp: string;
  suspicionScore: number;
}

export interface MissingPersonMobile {
  id: string;
  type: 'PERSON' | 'STOLEN_MOBILE';
  nameOrItem: string;
  lastSeenLocation: string;
  district: string;
  contactNumber: string;
  description: string;
  firNumber: string;
  rewardBDT?: number;
  status: 'SEARCHING' | 'RECOVERED' | 'CRITICAL_ALERT';
}

export interface MoujaPlotRecord {
  id: string;
  district: string;
  upazila: string;
  moujaName: string;
  jlNumber: string;
  plotNumber: string;
  khatianNo: string;
  ownerName: string;
  landAreaDecimal: number;
  landCategory: 'Agriculture' | 'Commercial' | 'Residential' | 'Pond';
}

export interface VoterRecord {
  voterId: string;
  nid: string;
  name: string;
  dob: string;
  fatherName: string;
  motherName: string;
  votingCenter: string;
  district: string;
}

export interface GovPortalLink {
  id: string;
  title: string;
  category: 'NID & Passport' | 'Land & e-Porcha' | 'Law & Police Clearance' | 'Education & Tax';
  url: string;
  description: string;
}

export interface BiometricAuthLog {
  id: string;
  officerBadge: string;
  officerName: string;
  division: AuthorityDivision;
  method: 'FINGERPRINT' | 'FACE_ID' | 'SECURITY_PIN';
  status: 'SUCCESS' | 'FAILED' | 'SUSPICIOUS_DENIED';
  ipAddress: string;
  location: string;
  deviceInfo: string;
  timestamp: string;
  notes?: string;
}

