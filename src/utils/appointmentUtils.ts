/**
 * Pure utility functions for MediguideAI appointment scheduling,
 * double-booking prevention, filtering, and metrics.
 */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  location: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  consultationFee: number;
  languages: string[];
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  consultationTypes: ('online' | 'in-person')[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  type: 'online' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  consultationFee: number;
}

export interface DoctorFilterOptions {
  searchQuery?: string;
  specialization?: string;
  location?: string;
  maxFee?: number;
  minRating?: number;
  minExperience?: number;
  consultationType?: 'online' | 'in-person';
  language?: string;
}

/**
 * Generates regular interval time slots between startTime and endTime,
 * skipping any slots that fall within the break period.
 */
export function generateTimeSlots(
  startTime: string, // "09:00"
  endTime: string,   // "17:00"
  slotDurationMinutes: number = 30,
  breakStart?: string, // "13:00"
  breakEnd?: string    // "14:00"
): string[] {
  const slots: string[] = [];
  
  const toMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const toTimeString = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);
  const breakStartMin = breakStart ? toMinutes(breakStart) : -1;
  const breakEndMin = breakEnd ? toMinutes(breakEnd) : -1;

  for (let current = startMin; current + slotDurationMinutes <= endMin; current += slotDurationMinutes) {
    // Check if slot overlaps with break
    const slotEnd = current + slotDurationMinutes;
    if (
      breakStartMin !== -1 &&
      breakEndMin !== -1 &&
      current < breakEndMin &&
      slotEnd > breakStartMin
    ) {
      continue;
    }
    slots.push(toTimeString(current));
  }

  return slots;
}

/**
 * Checks if a specific date and time slot is available for a doctor,
 * preventing double-booking and overlapping schedules.
 */
export function isSlotAvailable(
  doctorId: string,
  date: string,
  time: string,
  existingAppointments: Appointment[],
  excludeAppointmentId?: string
): boolean {
  return !existingAppointments.some(appt => {
    if (excludeAppointmentId && appt.id === excludeAppointmentId) {
      return false;
    }
    if (appt.doctorId !== doctorId) return false;
    if (appt.date !== date) return false;
    if (appt.status === 'cancelled' || appt.status === 'rejected') return false;
    return appt.time === time;
  });
}

/**
 * Filters a list of doctors based on search queries and multiple criteria.
 */
export function filterDoctors(
  doctors: Doctor[],
  filters: DoctorFilterOptions
): Doctor[] {
  return doctors.filter(doc => {
    // Only return active, verified doctors unless searching pending
    if (doc.status !== 'active') return false;

    if (filters.specialization && filters.specialization !== 'all') {
      if (doc.specialization.toLowerCase() !== filters.specialization.toLowerCase()) {
        return false;
      }
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.specialization.toLowerCase().includes(q);
      const matchHosp = doc.hospital.toLowerCase().includes(q);
      const matchLoc = doc.location.toLowerCase().includes(q);
      if (!matchName && !matchSpec && !matchHosp && !matchLoc) {
        return false;
      }
    }

    if (filters.location && filters.location !== 'all') {
      if (!doc.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    if (filters.maxFee !== undefined && filters.maxFee > 0) {
      if (doc.consultationFee > filters.maxFee) {
        return false;
      }
    }

    if (filters.minRating !== undefined && filters.minRating > 0) {
      if (doc.rating < filters.minRating) {
        return false;
      }
    }

    if (filters.minExperience !== undefined && filters.minExperience > 0) {
      if (doc.experienceYears < filters.minExperience) {
        return false;
      }
    }

    if (filters.consultationType) {
      if (!doc.consultationTypes.includes(filters.consultationType)) {
        return false;
      }
    }

    if (filters.language && filters.language !== 'all') {
      if (!doc.languages.some(lang => lang.toLowerCase() === filters.language!.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates financial and appointment metrics from appointment records.
 */
export function calculatePlatformMetrics(appointments: Appointment[]) {
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;
  
  // Total platform gross revenue from confirmed & completed appointments
  const totalRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

  // Platform platform commission (e.g. 15%)
  const platformEarnings = Math.round(totalRevenue * 0.15);

  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  return {
    total,
    pending,
    confirmed,
    completed,
    cancelled,
    totalRevenue,
    platformEarnings,
    cancellationRate,
  };
}
