export interface ServiceItem {
  id: string;
  numberCode: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  techDetails: {
    protocols: string[];
    turnaround: string;
    accuracyRate: string;
    equipmentUsed: string;
  };
  category: string;
}

export interface Mechanic {
  id: string;
  name: string;
  role: string;
  rating: number;
  experienceYears: number;
  certifications: string[];
  avatar: string | null;
  bio: string;
  specialties: string[];
  isAvailable: boolean;
  completedJobs: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  carModel: string;
  rating: number;
  text: string;
  serviceType: string;
  date: string;
  isPinned: boolean;
  mechanicName?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  badge?: string;
  priceEtb: number;
  depositEtb: number;
  duration: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  targetIssue: string;
}

export type BookingStatus = 'pending_verification' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  plateNumber: string;
  serviceId: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  depositAmount: number;
  paymentMethod: 'CBE' | 'Telebirr' | 'Awash' | 'DirectTransfer';
  paymentRefNumber: string;
  paymentProofUrl?: string;
  status: BookingStatus;
  createdAt: string;
  assignedMechanicId?: string;
}

export interface DiagnosticDTC {
  code: string;
  system: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: string;
  remedy: string;
}

export interface DiagnosticSensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: 'nominal' | 'alert' | 'optimal';
}
