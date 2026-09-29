export type UserRole = 'recycler' | 'agent' | 'admin';

export interface User {
  id: string;
  msisdn: string; // e.g. +256792422855
  fullName: string;
  zone: string; // Bwaise, Katanga, Kasese, Kawempe, etc.
  pin: string; // 4-digit PIN (e.g. 4829)
  role: UserRole;
  avatarUrl?: string;
  memberCode: string; // e.g. TP-BWS-4829
  joinedDate: string;
}

export interface Wallet {
  userId: string;
  balanceUGX: number;
  totalKgRecycled: number;
  co2SavedKg: number;
  milestoneTargetUGX: number; // default 200,000
  milestoneRewardClaimed: boolean;
  yinvestaBalanceUGX: number;
  autoInvestPercentage: number; // 0% to 50%
  lifetimeEarnedUGX: number;
}

export type TransactionType =
  | 'RECYCLE_PAYOUT'
  | 'AIRTIME_PURCHASE'
  | 'YAKA_ELECTRICITY'
  | 'NSSF_VOLUNTARY'
  | 'YINVESTA_DEPOSIT'
  | 'YINVESTA_WITHDRAW'
  | 'REPORT_REWARD';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  amountUGX: number;
  isDebit: boolean;
  reference: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  timestamp: string;
  metadata?: {
    meterNumber?: string;
    token?: string;
    unitsKwh?: number;
    phoneTarget?: string;
    nssfNumber?: string;
    materialType?: string;
    weightKg?: number;
    reportId?: string;
    interestEarned?: number;
  };
}

export type MaterialCategory = 'PET_BOTTLES' | 'HDPE_PLASTIC' | 'SCRAP_METALS' | 'CORRUGATED_PAPER';

export interface MaterialTariff {
  id: MaterialCategory;
  name: string;
  description: string;
  ratePerKgUGX: number;
  co2PerKg: number;
  badgeColor: string;
  iconName: string;
}

export type DumpStatus = 'REPORTED' | 'DISPATCHED' | 'IN_PROGRESS' | 'CLEANED';

export interface WasteReport {
  id: string;
  title: string;
  zone: string;
  description: string;
  photoUrl: string;
  locationName: string;
  lat: number;
  lng: number;
  reporterMsisdn: string;
  reporterName: string;
  status: DumpStatus;
  severity: 'MODERATE' | 'CRITICAL' | 'HAZARDOUS';
  bountyUGX: number;
  assignedAgent?: string;
  submittedAt: string;
  cleanedAt?: string;
}

export interface YinvestaGoal {
  id: string;
  title: string;
  targetUGX: number;
  currentUGX: number;
  targetDate: string;
  category: 'EQUIPMENT' | 'SCHOOL_FEES' | 'EMERGENCY_FUND' | 'HOUSING';
  icon: string;
}

export interface SMSMessage {
  id: string;
  recipientMsisdn: string;
  sender: string; // 'MTN-TrashPay' | 'MTN-MoMo' | 'Yaka-Umeme' | 'Sanlam-Yinvesta'
  text: string;
  timestamp: string;
  read: boolean;
}
