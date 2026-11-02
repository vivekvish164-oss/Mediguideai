import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Doctor, MedicalReport } from '../types';
import { generateTimeSlots, isSlotAvailable } from '../utils/appointmentUtils';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  Upload,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CalendarPlus,
  Printer,
} from 'lucide-react';

interface BookingModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onSuccess: (appointmentId: string) => void;
}

export const AppointmentBookingModal: React.FC<BookingModalProps> = ({
  doctor,
  onClose,
  onSuccess,
}) => {
  const { appointments, bookAppointment, patientProfile, language } = useApp();

  // Step state: 1=Slot & Mode, 2=Symptoms & Reports, 3=Payment & Review, 4=Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  // Default to tomorrow's date formatted as YYYY-MM-DD
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'online' | 'in-person'>('online');
  const [symptoms, setSymptoms] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'urgent'>('normal');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointmentCode, setCreatedAppointmentCode] = useState('');
  const [createdAppointmentId, setCreatedAppointmentId] = useState('');

  // Generate available slots for selected date unconditionally before any early returns
  const availableSlots = useMemo(() => {
    if (!doctor) return [];
    const { start, end, slotDuration, breakStart, breakEnd } = doctor.workingHours;
    const allSlots = generateTimeSlots(start, end, slotDuration, breakStart, breakEnd);

    return allSlots.map(time => {
      const isAvailable = isSlotAvailable(doctor.id, selectedDate, time, appointments);
      return { time, isAvailable };
    });
  }, [doctor, selectedDate, appointments]);

  if (!doctor) return null;

  // Handle mock report upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newReport: MedicalReport = {
        id: 'rep-' + Date.now(),
        patientId: patientProfile.id,
        fileName: file.name,
        fileUrl: '#',
        fileType: file.name.endsWith('.pdf') ? 'pdf' : 'image',
        sizeKb: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString(),
        description: 'Uploaded by patient during booking',
      };
      setUploadedReports(prev => [...prev, newReport]);
    }
  };

  const removeReport = (id: string) => {
    setUploadedReports(prev => prev.filter(r => r.id !== id));
  };

  const handleNextToStep2 = () => {
    if (!selectedDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Please select a consultation time slot.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!symptoms.trim()) {
      setErrorMessage('Please describe your symptoms or primary concern.');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleFinalBooking = () => {
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = bookAppointment({
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        type: consultationType,
        symptoms,
        reason: reason || symptoms,
        urgency,
        paymentMethod,
        reports: uploadedReports,
      });

      setIsSubmitting(false);

      if (res.success && res.appointment) {
        setCreatedAppointmentCode(res.appointment.appointmentCode);
        setCreatedAppointmentId(res.appointment.id);
        setStep(4);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        setErrorMessage(res.error || 'Failed to complete booking. Please try again.');
      }
    }, 600);
  };

  const consultationFee = doctor.consultationFee;
  const platformFee = 5;
  const totalAmount = consultationFee + platformFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div>
              <h2 className="font-bold text-base sm:text-lg">Book with {doctor.name}</h2>
              <p className="text-xs text-teal-100">{doctor.specialization} • {doctor.hospital}</p>
            </div>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator (Steps 1-3) */}
        {step !== 4 && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Date & Slot</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Symptoms</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 max-h-[62vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: DATE, MODE & TIME SLOTS */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Consultation Type Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setConsultationType('online')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      consultationType === 'online'
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Online Video Call</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Join from anywhere</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setConsultationType('in-person')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      consultationType === 'in-person'
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">In-Person Visit</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{doctor.hospital}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={e => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Real-time Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Available Time Slots (30 mins)
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live collision check active
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map(({ time, isAvailable }) => (
                    <button
                      key={time}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedTime(time);
                        setErrorMessage('');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        !isAvailable
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                          : selectedTime === time
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400'
                          : 'bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SYMPTOMS & MEDICAL RECORDS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Primary Symptoms & Concerns <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="e.g. Mild chest tightness after workout, occasional dizziness, dry cough for 3 days..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Reason for Consultation / Doctor Notes (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Routine follow-up, second opinion, lab result review"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Symptom Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'normal', 'urgent'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgency(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition border ${
                        urgency === lvl
                          ? lvl === 'urgent'
                            ? 'bg-rose-50 dark:bg-rose-950 border-rose-400 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400/20'
                            : 'bg-teal-50 dark:bg-teal-950 border-teal-400 text-teal-700 dark:text-teal-300 ring-2 ring-teal-400/20'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Medical Reports / Prescriptions */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Attach Medical Reports or Previous Prescriptions (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Click to browse and upload PDF or Image
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Max 10MB • Blood tests, ECGs, scans</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,image/*"
                    className="hidden"
                    id="booking-file-upload"
                  />
                  <label
                    htmlFor="booking-file-upload"
                    className="inline-block mt-2.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold cursor-pointer hover:bg-teal-100"
                  >
                    Select File
                  </label>
                </div>

                {uploadedReports.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedReports.map(rep => (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{rep.fileName}</span>
                          <span className="text-slate-400 text-[10px]">({rep.sizeKb} KB)</span>
                        </div>
                        <button
                          onClick={() => removeReport(rep.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Appointment Summary Card */}
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Doctor:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Date & Slot:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Consultation Mode:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 capitalize">{consultationType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Patient:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{patientProfile.fullName} ({patientProfile.phone})</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    'Credit Card (Stripe)',
                    'Apple Pay / Google Pay',
                    'Health Insurance Co-Pay',
                    'Pay at Clinic (For In-Person)',
                  ].map(method => (
                    <div
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-bold transition ${
                        paymentMethod === method
                          ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-teal-600" />
                        <span>{method}</span>
                      </div>
                      {paymentMethod === method && (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Specialist Consultation Fee</span>
                  <span>${consultationFee}.00</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Platform & Telehealth HD Service</span>
                  <span>${platformFee}.00</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Amount Due</span>
                  <span className="text-teal-600 dark:text-teal-400">${totalAmount}.00</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Status: Pending Doctor Confirmation
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  Appointment Request Submitted!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Your appointment request has been securely recorded. The doctor will review your symptoms and confirm the slot shortly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Appointment Code:</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400">{createdAppointmentCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doctor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDate} @ {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{consultationType}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const title = `MediguideAI Appointment with ${doctor.name}`;
                    const details = `Consultation Code: ${createdAppointmentCode}\nSymptoms: ${symptoms}`;
                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}`;
                    window.open(url, '_blank');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-teal-600" />
                  <span>Add to Google Calendar</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSuccess(createdAppointmentId);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
                >
                  View in My Appointments →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1-3) */}
        {step !== 4 && (
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextToStep2}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 flex items-center gap-1.5 transition"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 flex items-center gap-1.5 transition"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalBooking}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Booking...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book (${totalAmount})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
