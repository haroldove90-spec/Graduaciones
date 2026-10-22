export type Role = 'admin' | 'student' | 'coordinator' | 'auditor';

export interface GraduationEvent {
  id: string;
  name: string; // e.g. Universidad Bancaria - Generación Feb-Mar 2027
  school: string; // Universidad Bancaria
  career: string; // Contabilidad
  generation: string; // Feb-Mar 2027
  eventDate: string; // e.g. 2027-03-20
  liquidationDeadlineDate: string; // Strictly 3 weeks before: 2027-02-27
  packageCost: number; // e.g. 12500
  totalGraduatesCapacity: number; // e.g. 30
  extraTicketPrice: number; // e.g. 850
  venueName: string; // Salón / Hacienda
  status: 'active' | 'audited' | 'released';
  isReleasedForLogistics?: boolean;
}

export interface GraduateStudent {
  id: string;
  eventId: string;
  fullName: string;
  studentId: string; // e.g. UB-2027-001
  email: string;
  phone: string;
  avatarUrl?: string;
  extraTicketsCount: number;
  basePackageCost: number;
  totalDebt: number; // basePackageCost + (extraTicketsCount * extraTicketPrice)
  totalPaid: number;
  balanceRemaining: number;
  percentPaid: number;
  status: 'liquidated' | 'on_track' | 'warning' | 'inactive';
  lastPaymentDate: string | null;
  monthsWithoutPayment: number;
}

export type PaymentMethod = 'oxxo' | 'mercadopago' | 'transfer' | 'card' | 'seven_eleven';

export interface PaymentRecord {
  id: string;
  graduateId: string;
  studentName: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  referenceCode: string;
  receiptNumber: string;
  status: 'confirmed' | 'pending';
  notes?: string;
}

export interface PaymentReminder {
  id: string;
  graduateId: string;
  studentName: string;
  channel: 'whatsapp' | 'email';
  message: string;
  sentDate: string;
  status: 'sent' | 'delivered';
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  gateway: 'mercadopago' | 'oxxopay' | 'stripe';
  eventType: string;
  amount: number;
  referenceCode: string;
  studentName: string;
  status: 'processed' | 'simulated';
}
