import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { AppointmentReceiptModal } from './AppointmentReceiptModal';
import { DigitalPrescriptionModal } from './DigitalPrescriptionModal';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Star,
  RefreshCw,
  X,
  CreditCard,
  Send,
} from 'lucide-react';

export const PatientAppointmentsView: React.FC = () => {
  const {
    appointments,
    patientProfile,
    cancelAppointment,
    rescheduleAppointment,
    submitReview,
    setActiveVideoAppointment,
    setActiveTab,
    language,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [selectedReceiptApt, setSelectedReceiptApt] = useState<Appointment | null>(null);
  const [selectedRxApt, setSelectedRxApt] = useState<Appointment | null>(null);

  // Review Modal State
  const [reviewModalApt, setReviewModalApt] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00');
  const [rescheduleError, setRescheduleError] = useState('');

  // Cancel Modal State
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Schedule conflict');

  // In-app chat modal state
  const [chatApt, setChatApt] = useState<Appointment | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'patient' | 'doctor'; text: string; time: string }>>([
    { sender: 'doctor', text: 'Hello! I received your consultation request and symptoms. Feel free to send any questions here before our call.', time: '10:15 AM' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // Filter appointments for this patient
  const patientAppointments = appointments.filter(
    a => a.patientId === patientProfile.id || a.patientEmail === patientProfile.email
  );

  const filtered = patientAppointments.filter(apt => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'confirmed') return apt.status === 'confirmed';
    if (activeFilter === 'pending') return apt.status === 'pending';
    if (activeFilter === 'completed') return apt.status === 'completed';
    if (activeFilter === 'cancelled') return apt.status === 'cancelled' || apt.status === 'rejected';
    return true;
  });

  const handleReviewSubmit = () => {
    if (reviewModalApt) {
      submitReview(reviewModalApt.id, reviewRating, reviewComment || 'Great consultation!');
      setReviewModalApt(null);
      setReviewComment('');
    }
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleApt || !newDate || !newTime) {
      setRescheduleError('Please select both a date and time.');
      return;
    }
    const success = rescheduleAppointment(rescheduleApt.id, newDate, newTime);
    if (success) {
      setRescheduleApt(null);
      setRescheduleError('');
    } else {
      setRescheduleError('That slot is already booked. Please choose a different time.');
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'patient', text: newChatMessage.trim(), time: 'Just now' },
    ]);
    setNewChatMessage('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'doctor', text: 'Thank you for updating me. I will review this during our scheduled consultation.', time: 'Just now' },
      ]);
    }, 1200);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'hi' ? 'मेरी अपॉइंटमेंट्स' : 'My Healthcare Appointments'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage upcoming visits, join telehealth video rooms, download prescriptions, and view medical receipts.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('doctors')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 shrink-0 transition"
        >
          + Book New Consultation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'all', label: 'All Appointments', count: patientAppointments.length },
          { id: 'confirmed', label: 'Upcoming & Confirmed', count: patientAppointments.filter(a => a.status === 'confirmed').length },
          { id: 'pending', label: 'Pending Approval', count: patientAppointments.filter(a => a.status === 'pending').length },
          { id: 'completed', label: 'Completed & Prescriptions', count: patientAppointments.filter(a => a.status === 'completed').length },
          { id: 'cancelled', label: 'Cancelled / Rejected', count: patientAppointments.filter(a => a.status === 'cancelled' || a.status === 'rejected').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeFilter === tab.id ? 'bg-white/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No appointments found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You don't have any appointments matching this category.
          </p>
          <button
            onClick={() => setActiveTab('doctors')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Find a Doctor Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(apt => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Doctor & Appointment Details */}
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorAvatar}
                  alt={apt.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
                      {apt.appointmentCode}
                    </span>

                    {/* Status Badges */}
                    {apt.status === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    )}
                    {apt.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        <Clock className="w-3 h-3" /> Pending Doctor Acceptance
                      </span>
                    )}
                    {apt.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                    {apt.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        <XCircle className="w-3 h-3" /> Cancelled
                      </span>
                    )}
                    {apt.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-3 h-3" /> Doctor Unavailable
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    {apt.doctorSpecialization} • {apt.doctorHospital}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {apt.time} ({apt.durationMinutes}m)
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      {apt.type === 'online' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Online Telehealth Video</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                          <span>In-Person Clinic Visit</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Symptoms & Rejection Reason */}
                  <div className="pt-2 text-xs text-slate-600 dark:text-slate-300">
                    <p><span className="font-semibold text-slate-400">Symptoms:</span> {apt.symptoms}</p>
                    {apt.rejectionReason && (
                      <p className="mt-1 text-rose-600 dark:text-rose-400 font-semibold">
                        Doctor Note: {apt.rejectionReason}
                        {apt.alternateSlot && ` • Suggested alternate: ${apt.alternateSlot}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-700">
                {/* Join Telehealth Video Call (if confirmed & online) */}
                {apt.status === 'confirmed' && apt.type === 'online' && (
                  <button
                    onClick={() => {
                      setActiveVideoAppointment(apt);
                      setActiveTab('telehealth');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition animate-pulse"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Consultation</span>
                  </button>
                )}

                {/* View Digital Prescription (if completed) */}
                {apt.status === 'completed' && apt.prescription && (
                  <button
                    onClick={() => setSelectedRxApt(apt)}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Digital Rx</span>
                  </button>
                )}

                {/* Submit Review (if completed) */}
                {apt.status === 'completed' && (
                  <button
                    onClick={() => setReviewModalApt(apt)}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 transition"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{apt.review ? `Rated ${apt.review.rating}★` : 'Rate Doctor'}</span>
                  </button>
                )}

                {/* Message Doctor Chat */}
                <button
                  onClick={() => setChatApt(apt)}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Message</span>
                </button>

                {/* View Receipt */}
                <button
                  onClick={() => setSelectedReceiptApt(apt)}
                  className="px-3 py-2 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 transition"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>

                {/* Reschedule Button */}
                {(apt.status === 'confirmed' || apt.status === 'pending' || apt.status === 'rejected') && (
                  <button
                    onClick={() => {
                      setRescheduleApt(apt);
                      setNewDate(apt.date);
                      setNewTime(apt.time);
                    }}
                    className="px-3 py-2 rounded-xl font-bold text-xs text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reschedule</span>
                  </button>
                )}

                {/* Cancel Button */}
                {(apt.status === 'confirmed' || apt.status === 'pending') && (
                  <button
                    onClick={() => setCancelModalApt(apt)}
                    className="px-3 py-2 rounded-xl font-bold text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-1 transition"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {/* Receipt Modal */}
      <AppointmentReceiptModal
        appointment={selectedReceiptApt}
        onClose={() => setSelectedReceiptApt(null)}
      />

      {/* Prescription Modal */}
      <DigitalPrescriptionModal
        prescription={selectedRxApt?.prescription || null}
        onClose={() => setSelectedRxApt(null)}
      />

      {/* Review Modal */}
      {reviewModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Rate your visit with {reviewModalApt.doctorName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Your verified feedback helps other patients make informed healthcare decisions.</p>

            <div className="flex items-center justify-center gap-2 my-5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="How was the consultation, wait time, and doctor's explanation?"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setReviewModalApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Reschedule Appointment ({rescheduleApt.appointmentCode})
            </h3>
            <p className="text-xs text-slate-500 mt-1">Select a new date and time for your consultation with {rescheduleApt.doctorName}.</p>

            {rescheduleError && (
              <p className="text-xs text-rose-500 font-bold mt-2">{rescheduleError}</p>
            )}

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Slot</label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                >
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Cancel Appointment?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to cancel your consultation ({cancelModalApt.appointmentCode}) with {cancelModalApt.doctorName}?
            </p>

            <div className="my-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Symptoms resolved">Symptoms resolved</option>
                <option value="Visited another clinic">Visited another clinic</option>
                <option value="Other personal reason">Other personal reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => {
                  cancelAppointment(cancelModalApt.id, cancelReason);
                  setCancelModalApt(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient-Doctor Secure Chat Drawer */}
      {chatApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={chatApt.doctorAvatar}
                  alt={chatApt.doctorName}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{chatApt.doctorName}</h4>
                  <p className="text-[10px] text-teal-100">{chatApt.appointmentCode} • Consultation Chat</p>
                </div>
              </div>
              <button onClick={() => setChatApt(null)} className="p-1.5 rounded-full hover:bg-white/20">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl ${
                      msg.sender === 'patient'
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={e => setNewChatMessage(e.target.value)}
                placeholder="Type a secure message to your doctor..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
