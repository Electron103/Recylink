export type UserRole = 'COLLECTOR' | 'SAATHI' | 'RECYCLER' | 'ADMIN';

export type LanguageCode = 'en' | 'hi' | 'mr';

export type MaterialCategory = 
  | 'pcb'
  | 'cables'
  | 'batteries'
  | 'crt'
  | 'lcd'
  | 'motors'
  | 'magnets'
  | 'mixed_plastics'
  | 'other';

export type MaterialCondition = 'working' | 'non_working' | 'damaged' | 'mixed' | 'unknown';

export type SourceType = 'household' | 'shop' | 'office' | 'institution' | 'scrap_collection' | 'other';

export type LotStatus = 
  | 'CREATED'
  | 'MATCHING'
  | 'PICKUP_REQUESTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'HANDOVER_VERIFIED'
  | 'PAID'
  | 'RECYCLED';

export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'DISPUTED';

export type RecyclerVerificationStatus = 'VERIFIED' | 'PENDING' | 'SUSPENDED' | 'EXPIRED';

export interface MaterialInfo {
  id: MaterialCategory;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  iconName: string;
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  basePricePerKg: number;
  minPricePerKg: number;
  maxPricePerKg: number;
  unit: string;
  safetyHazard: string;
  safetyGuide: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface PriceRecord {
  id: string;
  materialCategory: MaterialCategory;
  location: string;
  dateTime: string;
  buyingPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface RecyclerProfile {
  id: string;
  name: string;
  facilityLocation: string;
  city: string;
  distanceKm: number;
  materialsAccepted: MaterialCategory[];
  authorizationNumber: string;
  authorizationStatus: RecyclerVerificationStatus;
  contactNumber: string;
  pickupAvailable: boolean;
  minPickupWeightKg: number;
  serviceArea: string;
  trustScore: number;
  offeredRates: Partial<Record<MaterialCategory, number>>;
  rating: number;
  totalHandovers: number;
  verificationDate: string;
}

export interface CollectorProfile {
  id: string;
  name: string;
  phone: string;
  preferredLanguage: LanguageCode;
  operatingArea: string;
  city: string;
  hasSmartphone: boolean;
  assignedSaathiId?: string;
  trustScore: number;
  greenPoints: number;
  totalLots: number;
  totalWeightKg: number;
  totalEarnings: number;
  joinedDate: string;
}

export interface SaathiProfile {
  id: string;
  name: string;
  phone: string;
  operatingArea: string;
  city: string;
  assignedCollectorIds: string[];
  totalAssistedLots: number;
  incentivesEarned: number;
}

export interface TraceabilityEvent {
  id: string;
  lotId: string;
  stage: LotStatus;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  location: string;
  notes: string;
  verificationMethod?: 'QR' | 'OTP' | 'MANUAL' | 'SYSTEM';
  weightKg?: number;
  photoUrl?: string;
}

export interface LotItem {
  id: string; // e.g. LOT-IND-2026-000124
  collectorId: string;
  collectorName: string;
  collectorPhone: string;
  saathiId?: string;
  saathiName?: string;
  materialCategory: MaterialCategory;
  subcategory?: string;
  description: string;
  photoUrl?: string;
  approximateWeightKg: number;
  actualWeightKg?: number;
  condition: MaterialCondition;
  sourceType: SourceType;
  location: string;
  createdAt: string;
  estimatedRatePerKg: number;
  estimatedTotalValue: number;
  finalRatePerKg?: number;
  finalTotalValue?: number;
  matchedRecyclerId?: string;
  matchedRecyclerName?: string;
  status: LotStatus;
  pickupScheduledTime?: string;
  pickupNotes?: string;
  otpCode: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  anomalyFlag?: {
    flagged: boolean;
    reason: string;
    severity: 'low' | 'medium' | 'high';
  };
  traceability: TraceabilityEvent[];
}

export interface SafetyGuideItem {
  id: string;
  title: { en: string; hi: string; mr: string };
  icon: string;
  danger: boolean;
  message: { en: string; hi: string; mr: string };
  audioScript: { en: string; hi: string; mr: string };
}

export interface FieldInterview {
  id: string;
  collectorName: string;
  area: string;
  materialCollected: string;
  currentBuyer: string;
  currentPriceDiscoveryMethod: string;
  transportationMethod: string;
  smartphoneAvailable: boolean;
  interestInVoice: boolean;
  mainBarriers: string;
  expectedIncentives: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  lotId?: string;
}

export interface AnomalyReport {
  id: string;
  lotId: string;
  reason: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'FLAGGED' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  aiConfidence: number;
}
