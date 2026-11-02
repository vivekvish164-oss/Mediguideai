export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  doctorId?: string;
  patientId?: string;
}

export interface DoctorWorkingHours {
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  start: string; // "09:00"
  end: string;   // "17:00"
  slotDuration: number; // 30
  breakStart: string; // "13:00"
  breakEnd: string;   // "14:00"
  blockedDates: string[]; // ['2026-11-25']
}

export interface Doctor {
  id: string;
  profileId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  medicalRegNumber: string;
  hospital: string;
  location: string;
  consultationFee: number;
  languages: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  consultationTypes: ('online' | 'in-person')[];
  avatarUrl: string;
  workingHours: DoctorWorkingHours;
  verificationDocs?: { name: string; url: string; verified: boolean }[];
}

export interface Patient {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  pastMedicalHistory: string;
}

export interface Medication {
  name: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice daily after meals"
  days: number; // e.g. 5
  instructions: string; // e.g. "Take with full glass of water"
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  doctorRegNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  advice: string;
  followUpDate?: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  appointmentId?: string;
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'lab';
  sizeKb: number;
  uploadedAt: string;
  description: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Appointment {
  id: string;
  appointmentCode: string; // e.g. "APT-73921"
  patientId: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorHospital: string;
  doctorAvatar: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "10:00"
  durationMinutes: number;
  type: 'online' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  symptoms: string;
  reason: string;
  urgency: 'low' | 'normal' | 'urgent';
  consultationFee: number;
  paymentStatus: 'paid' | 'pending';
  paymentMethod: string;
  rejectionReason?: string;
  alternateSlot?: string;
  consultationNotes?: string;
  prescription?: Prescription;
  reports?: MedicalReport[];
  review?: Review;
  videoRoomId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment_booked' | 'appointment_confirmed' | 'appointment_rejected' | 'rx_issued' | 'system' | 'reminder';
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  text: string;
  timestamp: string;
}

export interface Specialization {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  doctorCount: number;
}
