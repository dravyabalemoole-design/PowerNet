export enum ServiceType {
  ELECTRICITY = 'ELECTRICITY',
  WIFI = 'WIFI'
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  SOLVING = 'SOLVING',
  RESOLVED = 'RESOLVED'
}

export type Language = 'en' | 'kn' | 'hi';

export interface Complaint {
  id: string;
  userId: string;
  userName?: string;
  type: ServiceType;
  category: string;
  description: string;
  location: string;
  branch: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  staffNotes?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  technicianName?: string;
  technicianPhone?: string;
  feedback?: string;
  rating?: number;
  coords?: {
    x: number;
    y: number;
  };
}

export interface Bill {
  id: string;
  userId: string;
  userName?: string;
  type: ServiceType;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
  period: string;
  branch: string;
  unitsConsumed?: number;
  paymentMethod?: string;
  paidAt?: string;
}

export interface WiFiPlan {
  id: string;
  name: string;
  speed: string;
  dataLimit: string;
  price: number;
}

export type LoginRole = 'user' | 'admin';

export interface LoggedInUser {
  name: string;
  email?: string;
  phone?: string;
  role: LoginRole;
  adminId?: string;
  branch?: string;
  language?: Language;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'MAINTENANCE';
  targetBranch?: string;
  userId?: string;
  timestamp: string;
  read: boolean;
  serviceType?: ServiceType;
}