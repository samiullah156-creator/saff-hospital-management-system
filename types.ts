
export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  age?: number;
  gender?: string;
  status?: string; // For patients: Admitted, Outpatient, Discharged
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  availability: string[]; // e.g., ["Mon", "Wed"]
  expertise?: string[]; // Specific areas of expertise
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface StatusLog {
  status: AppointmentStatus;
  timestamp: string;
  note?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  statusHistory?: StatusLog[];
  notes?: string; // Private user notes
  dueDate?: string; // Optional due date set by user
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string (Data URL)
  name?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  images?: string[]; // Deprecated: Array of Base64 strings for display (kept for backward compatibility)
  attachments?: Attachment[]; // New standard for files
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  readTime: string;
  content?: string; // Full content mock
}

export interface Comment {
  id: string;
  user: string;
  date: string;
  text: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  unit: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Invoice {
  id: string;
  patientName: string;
  service: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface Vitals {
  bpSystolic: string;
  bpDiastolic: string;
  heartRate: string;
  temp: string;
  weight?: string;
  height?: string;
  timestamp: string;
}
