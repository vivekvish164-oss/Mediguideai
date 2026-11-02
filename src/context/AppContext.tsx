import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Doctor,
  Patient,
  Appointment,
  Specialization,
  Notification,
  Prescription,
  Review,
  MedicalReport,
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENT,
  INITIAL_APPOINTMENTS,
  INITIAL_SPECIALIZATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '../data/mockData';
import { isSlotAvailable } from '../utils/appointmentUtils';

interface AppContextType {
  // Auth & Roles
  currentUser: User;
  allUsers: User[];
  role: UserRole;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, role: UserRole) => boolean;
  logoutUser: () => void;
  registerPatient: (data: Partial<Patient> & { password?: string }) => void;
  registerDoctor: (data: Partial<Doctor> & { password?: string }) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doctor: Doctor | null) => void;
  activeVideoAppointment: Appointment | null;
  setActiveVideoAppointment: (appointment: Appointment | null) => void;

  // Language & Theme
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Data Collections
  doctors: Doctor[];
  patientProfile: Patient;
  updatePatientProfile: (profile: Partial<Patient>) => void;
  appointments: Appointment[];
  specializations: Specialization[];
  notifications: Notification[];

  // Appointment Actions
  bookAppointment: (bookingData: {
    doctorId: string;
    date: string;
    time: string;
    type: 'online' | 'in-person';
    symptoms: string;
    reason: string;
    urgency: 'low' | 'normal' | 'urgent';
    paymentMethod: string;
    reports?: MedicalReport[];
  }) => { success: boolean; appointment?: Appointment; error?: string };
  
  acceptAppointment: (appointmentId: string) => void;
  rejectAppointment: (appointmentId: string, reason: string, alternateSlot?: string) => void;
  cancelAppointment: (appointmentId: string, reason?: string) => void;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => boolean;
  completeAppointment: (appointmentId: string, notes: string, rxData?: Partial<Prescription>) => void;
  submitReview: (appointmentId: string, rating: number, comment: string) => void;

  // Doctor Management
  updateDoctorStatus: (doctorId: string, status: 'active' | 'suspended' | 'rejected') => void;
  updateDoctorWorkingHours: (doctorId: string, workingHours: Doctor['workingHours']) => void;
  updateDoctorFee: (doctorId: string, fee: number) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'mediguide_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or initial seed
  const [users] = useState<User[]>(INITIAL_USERS);
  const [role, setRole] = useState<UserRole>('patient');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [activeVideoAppointment, setActiveVideoAppointment] = useState<Appointment | null>(null);

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_doctors');
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [patientProfile, setPatientProfile] = useState<Patient>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_patient');
      return saved ? JSON.parse(saved) : INITIAL_PATIENT;
    } catch {
      return INITIAL_PATIENT;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [specializations] = useState<Specialization[]>(INITIAL_SPECIALIZATIONS);

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_doctors', JSON.stringify(doctors));
      localStorage.setItem(STORAGE_KEY + '_patient', JSON.stringify(patientProfile));
      localStorage.setItem(STORAGE_KEY + '_appointments', JSON.stringify(appointments));
      localStorage.setItem(STORAGE_KEY + '_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [doctors, patientProfile, appointments, notifications]);

  // Dark mode effect on <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const targetUser = users.find(u => u.role === newRole) || users[0];
    setCurrentUser(targetUser);
    if (newRole === 'doctor') {
      setActiveTab('doctor-dashboard');
    } else if (newRole === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('home');
    }
  };

  const loginUser = (email: string, targetRole: UserRole): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === targetRole);
    if (matched) {
      setCurrentUser(matched);
      setRole(targetRole);
      if (targetRole === 'doctor') setActiveTab('doctor-dashboard');
      else if (targetRole === 'admin') setActiveTab('admin-dashboard');
      else setActiveTab('appointments');
      return true;
    }
    // Fallback: create mock session for any valid email
    const fallbackUser: User = {
      id: 'usr-' + Date.now(),
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      role: targetRole,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    };
    setCurrentUser(fallbackUser);
    setRole(targetRole);
    if (targetRole === 'doctor') setActiveTab('doctor-dashboard');
    else if (targetRole === 'admin') setActiveTab('admin-dashboard');
    else setActiveTab('appointments');
    return true;
  };

  const logoutUser = () => {
    switchRole('patient');
    setActiveTab('home');
  };

  const registerPatient = (data: Partial<Patient> & { password?: string }) => {
    const newPatient: Patient = {
      ...INITIAL_PATIENT,
      ...data,
      id: 'pat-' + Date.now(),
      profileId: 'usr-' + Date.now(),
      fullName: data.fullName || 'New Patient',
      email: data.email || 'patient@example.com',
      phone: data.phone || '+1 555-0000',
    };
    setPatientProfile(newPatient);
    setCurrentUser({
      id: newPatient.profileId,
      email: newPatient.email,
      fullName: newPatient.fullName,
      role: 'patient',
      patientId: newPatient.id,
      phone: newPatient.phone,
    });
    setRole('patient');
    setActiveTab('appointments');
  };

  const registerDoctor = (data: Partial<Doctor> & { password?: string }) => {
    const newDoc: Doctor = {
      id: 'doc-' + Date.now(),
      profileId: 'usr-doc-' + Date.now(),
      name: data.name || 'Dr. Practitioner',
      email: data.email || 'doctor@mediguide.ai',
      phone: data.phone || '+1 555-1234',
      specialization: data.specialization || 'General Medicine',
      qualifications: data.qualifications || 'MD - General Practitioner',
      experienceYears: data.experienceYears || 5,
      medicalRegNumber: data.medicalRegNumber || 'REG-' + Math.floor(10000 + Math.random() * 90000),
      hospital: data.hospital || 'Community Health Clinic',
      location: data.location || 'New York, NY',
      consultationFee: data.consultationFee || 70,
      languages: data.languages || ['English'],
      bio: data.bio || 'Dedicated medical professional committed to providing holistic, patient-centered care.',
      rating: 5.0,
      reviewsCount: 0,
      isVerified: false,
      status: 'pending', // Pending approval by Admin per specification!
      consultationTypes: data.consultationTypes || ['online', 'in-person'],
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      workingHours: {
        days: [1, 2, 3, 4, 5],
        start: '09:00',
        end: '17:00',
        slotDuration: 30,
        breakStart: '13:00',
        breakEnd: '14:00',
        blockedDates: [],
      },
      verificationDocs: [
        { name: 'Board_Registration_License.pdf', url: '#', verified: false }
      ]
    };

    setDoctors(prev => [newDoc, ...prev]);

    // Add admin notification
    const adminNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: 'usr-admin-1',
      title: 'New Doctor Registration Pending',
      message: `${newDoc.name} (${newDoc.specialization}) registered and awaits administrative credential review.`,
      type: 'system',
      date: 'Just now',
      isRead: false,
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const updatePatientProfile = (profileUpdate: Partial<Patient>) => {
    setPatientProfile(prev => ({
      ...prev,
      ...profileUpdate,
    }));
  };

  // Booking logic with double-booking prevention
  const bookAppointment = (data: {
    doctorId: string;
    date: string;
    time: string;
    type: 'online' | 'in-person';
    symptoms: string;
    reason: string;
    urgency: 'low' | 'normal' | 'urgent';
    paymentMethod: string;
    reports?: MedicalReport[];
  }) => {
    const doctor = doctors.find(d => d.id === data.doctorId);
    if (!doctor) {
      return { success: false, error: 'Doctor not found.' };
    }

    // Check collision / double-booking
    const available = isSlotAvailable(data.doctorId, data.date, data.time, appointments);
    if (!available) {
      return { success: false, error: 'This time slot was just booked by another patient. Please choose another available slot.' };
    }

    const code = 'APT-' + Math.floor(10000 + Math.random() * 90000);
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      appointmentCode: code,
      patientId: patientProfile.id,
      doctorId: doctor.id,
      patientName: patientProfile.fullName,
      patientEmail: patientProfile.email,
      patientPhone: patientProfile.phone,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorHospital: doctor.hospital,
      doctorAvatar: doctor.avatarUrl,
      date: data.date,
      time: data.time,
      durationMinutes: 30,
      type: data.type,
      status: 'pending', // Starts in pending status for doctor approval
      symptoms: data.symptoms,
      reason: data.reason,
      urgency: data.urgency,
      consultationFee: doctor.consultationFee,
      paymentStatus: 'paid',
      paymentMethod: data.paymentMethod,
      reports: data.reports || [],
      videoRoomId: data.type === 'online' ? `mediguide-room-${code}` : undefined,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Notify doctor
    const docNotif: Notification = {
      id: 'notif-' + Date.now(),
      userId: doctor.profileId,
      title: 'New Appointment Request',
      message: `${patientProfile.fullName} requested an appointment for ${data.date} at ${data.time}.`,
      type: 'appointment_booked',
      date: 'Just now',
      isRead: false,
    };

    // Notify patient
    const patientNotif: Notification = {
      id: 'notif-' + (Date.now() + 1),
      userId: currentUser.id,
      title: 'Appointment Request Submitted',
      message: `Your appointment request (${code}) with ${doctor.name} has been sent and is awaiting doctor confirmation.`,
      type: 'appointment_booked',
      date: 'Just now',
      isRead: false,
    };

    setNotifications(prev => [patientNotif, docNotif, ...prev]);

    return { success: true, appointment: newAppointment };
  };

  const acceptAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          const updated = {
            ...apt,
            status: 'confirmed' as const,
            videoRoomId: apt.type === 'online' ? (apt.videoRoomId || `mediguide-room-${apt.appointmentCode}`) : undefined,
          };
          return updated;
        }
        return apt;
      })
    );

    const targetApt = appointments.find(a => a.id === appointmentId);
    if (targetApt) {
      const patientNotif: Notification = {
        id: 'notif-' + Date.now(),
        userId: 'usr-pat-1',
        title: 'Appointment Confirmed! 🎉',
        message: `${targetApt.doctorName} confirmed your appointment on ${targetApt.date} at ${targetApt.time}.`,
        type: 'appointment_confirmed',
        date: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [patientNotif, ...prev]);
    }
  };

  const rejectAppointment = (appointmentId: string, reason: string, alternateSlot?: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: 'rejected' as const,
            rejectionReason: reason,
            alternateSlot,
          };
        }
        return apt;
      })
    );

    const targetApt = appointments.find(a => a.id === appointmentId);
    if (targetApt) {
      const patientNotif: Notification = {
        id: 'notif-' + Date.now(),
        userId: 'usr-pat-1',
        title: 'Appointment Reschedule Required',
        message: `${targetApt.doctorName} could not accept this slot: "${reason}". Suggested slot: ${alternateSlot || 'Please pick another time'}.`,
        type: 'appointment_rejected',
        date: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [patientNotif, ...prev]);
    }
  };

  const cancelAppointment = (appointmentId: string, reason?: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: 'cancelled' as const,
            rejectionReason: reason || 'Cancelled by patient',
          };
        }
        return apt;
      })
    );
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string): boolean => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return false;

    // Check collision excluding self
    const available = isSlotAvailable(apt.doctorId, newDate, newTime, appointments, appointmentId);
    if (!available) return false;

    setAppointments(prev =>
      prev.map(a => {
        if (a.id === appointmentId) {
          return {
            ...a,
            date: newDate,
            time: newTime,
            status: 'confirmed' as const,
            rejectionReason: undefined,
            alternateSlot: undefined,
          };
        }
        return a;
      })
    );
    return true;
  };

  const completeAppointment = (appointmentId: string, notes: string, rxData?: Partial<Prescription>) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          const rx: Prescription | undefined = rxData?.medications && rxData.medications.length > 0 ? {
            id: 'rx-' + Date.now(),
            appointmentId: apt.id,
            doctorName: apt.doctorName,
            doctorRegNumber: 'MC-USA-90214',
            patientName: apt.patientName,
            patientAge: patientProfile.age,
            patientGender: patientProfile.gender,
            date: new Date().toISOString().split('T')[0],
            diagnosis: rxData.diagnosis || 'Clinical Diagnosis',
            medications: rxData.medications || [],
            advice: rxData.advice || 'Follow medication schedule carefully and maintain adequate hydration.',
            followUpDate: rxData.followUpDate,
          } : undefined;

          return {
            ...apt,
            status: 'completed' as const,
            consultationNotes: notes,
            prescription: rx,
          };
        }
        return apt;
      })
    );

    const targetApt = appointments.find(a => a.id === appointmentId);
    if (targetApt) {
      const patientNotif: Notification = {
        id: 'notif-' + Date.now(),
        userId: 'usr-pat-1',
        title: 'Consultation Completed & Prescription Ready',
        message: `${targetApt.doctorName} marked your consultation as completed. Your digital prescription is ready for download.`,
        type: 'rx_issued',
        date: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [patientNotif, ...prev]);
    }
  };

  const submitReview = (appointmentId: string, rating: number, comment: string) => {
    const rev: Review = {
      id: 'rev-' + Date.now(),
      appointmentId,
      doctorId: '',
      patientId: patientProfile.id,
      patientName: patientProfile.fullName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          rev.doctorId = apt.doctorId;
          return {
            ...apt,
            review: rev,
          };
        }
        return apt;
      })
    );

    // Update doctor's overall rating
    const targetApt = appointments.find(a => a.id === appointmentId);
    if (targetApt) {
      setDoctors(prev =>
        prev.map(doc => {
          if (doc.id === targetApt.doctorId) {
            const newCount = doc.reviewsCount + 1;
            const newRating = Number(((doc.rating * doc.reviewsCount + rating) / newCount).toFixed(1));
            return {
              ...doc,
              rating: newRating,
              reviewsCount: newCount,
            };
          }
          return doc;
        })
      );
    }
  };

  const updateDoctorStatus = (doctorId: string, status: 'active' | 'suspended' | 'rejected') => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId) {
          return {
            ...doc,
            status,
            isVerified: status === 'active',
          };
        }
        return doc;
      })
    );
  };

  const updateDoctorWorkingHours = (doctorId: string, workingHours: Doctor['workingHours']) => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId) {
          return { ...doc, workingHours };
        }
        return doc;
      })
    );
  };

  const updateDoctorFee = (doctorId: string, fee: number) => {
    setDoctors(prev =>
      prev.map(doc => {
        if (doc.id === doctorId) {
          return { ...doc, consultationFee: fee };
        }
        return doc;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: users,
        role,
        switchRole,
        loginUser,
        logoutUser,
        registerPatient,
        registerDoctor,
        activeTab,
        setActiveTab,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        activeVideoAppointment,
        setActiveVideoAppointment,
        language,
        setLanguage,
        theme,
        toggleTheme,
        doctors,
        patientProfile,
        updatePatientProfile,
        appointments,
        specializations,
        notifications,
        bookAppointment,
        acceptAppointment,
        rejectAppointment,
        cancelAppointment,
        rescheduleAppointment,
        completeAppointment,
        submitReview,
        updateDoctorStatus,
        updateDoctorWorkingHours,
        updateDoctorFee,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
