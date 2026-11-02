import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment, Medication } from '../types';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Trash2,
  X,
  Building2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const DoctorDashboardView: React.FC = () => {
  const {
    currentUser,
    doctors,
    appointments,
    acceptAppointment,
    rejectAppointment,
    completeAppointment,
    updateDoctorWorkingHours,
    updateDoctorFee,
    setActiveVideoAppointment,
    setActiveTab,
    language,
  } = useApp();

  // Find active doctor record
  const currentDoctor =
    doctors.find(d => d.id === currentUser.doctorId || d.profileId === currentUser.id) ||
    doctors[0];

  const [activeTabSub, setActiveTabSub] = useState<'appointments' | 'availability' | 'analytics'>('appointments');
  const [aptFilter, setAptFilter] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');

  // Reject Modal State
  const [rejectingApt, setRejectingApt] = useState<Appointment | null>(null);
  const [rejectReason, setRejectReason] = useState('Doctor has an emergency surgery');
  const [suggestedSlot, setSuggestedSlot] = useState('Tomorrow 2:00 PM');

  // Complete / Issue Rx Modal State
  const [completingApt, setCompletingApt] = useState<Appointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', days: 5, instructions: '' },
  ]);

  // Working Hours Local State
  const [workingDays, setWorkingDays] = useState<number[]>(currentDoctor.workingHours.days);
  const [startTime, setStartTime] = useState(currentDoctor.workingHours.start);
  const [endTime, setEndTime] = useState(currentDoctor.workingHours.end);
  const [breakStart, setBreakStart] = useState(currentDoctor.workingHours.breakStart);
  const [breakEnd, setBreakEnd] = useState(currentDoctor.workingHours.breakEnd);
  const [fee, setFee] = useState(currentDoctor.consultationFee);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState('');

  // Doctor's appointments
  const doctorAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);

  // Statistics
  const pendingCount = doctorAppointments.filter(a => a.status === 'pending').length;
  const confirmedCount = doctorAppointments.filter(a => a.status === 'confirmed').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'completed').length;
  const totalRevenue = doctorAppointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

  // Unique patient count
  const patientCount = new Set(doctorAppointments.map(a => a.patientId)).size;

  // Filtered list
  const displayedApts = doctorAppointments.filter(a => {
    if (aptFilter === 'all') return true;
    return a.status === aptFilter;
  });

  // Recharts Chart Data
  const monthlyChartData = [
    { month: 'Jun', visits: 18, revenue: 2160 },
    { month: 'Jul', visits: 24, revenue: 2880 },
    { month: 'Aug', visits: 32, revenue: 3840 },
    { month: 'Sep', visits: 29, revenue: 3480 },
    { month: 'Oct', visits: 41, revenue: 4920 },
    { month: 'Nov', visits: 48, revenue: 5760 },
  ];

  // Prescription handler
  const handleAddMedication = () => {
    setMedications(prev => [
      ...prev,
      { name: '', dosage: '', frequency: '', days: 5, instructions: '' },
    ]);
  };

  const handleRemoveMedication = (idx: number) => {
    setMedications(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx: number, field: keyof Medication, val: any) => {
    setMedications(prev =>
      prev.map((med, i) => (i === idx ? { ...med, [field]: val } : med))
    );
  };

  const handleSavePrescriptionAndComplete = () => {
    if (!completingApt) return;
    const validMeds = medications.filter(m => m.name.trim() !== '');
    completeAppointment(completingApt.id, clinicalNotes, {
      diagnosis: diagnosis || 'General Clinical Review',
      medications: validMeds,
      advice,
      followUpDate,
    });
    setCompletingApt(null);
  };

  const handleSaveSchedule = () => {
    updateDoctorWorkingHours(currentDoctor.id, {
      days: workingDays,
      start: startTime,
      end: endTime,
      slotDuration: 30,
      breakStart,
      breakEnd,
      blockedDates: currentDoctor.workingHours.blockedDates,
    });
    updateDoctorFee(currentDoctor.id, fee);
    setSavedSettingsMsg('Availability and fees updated successfully!');
    setTimeout(() => setSavedSettingsMsg(''), 3000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Profile Info */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentDoctor.avatarUrl}
            alt={currentDoctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-teal-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentDoctor.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Active Practitioner
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-bold mt-0.5">
              {currentDoctor.specialization} • {currentDoctor.hospital}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              License ID: <span className="font-mono">{currentDoctor.medicalRegNumber}</span> • Standard Fee: ${currentDoctor.consultationFee}
            </p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTabSub('appointments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTabSub === 'appointments'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Appointments & Requests
          </button>
          <button
            onClick={() => setActiveTabSub('availability')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTabSub === 'availability'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Schedule & Availability
          </button>
          <button
            onClick={() => setActiveTabSub('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTabSub === 'analytics'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Revenue Analytics
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
          <p className="text-[11px] text-slate-400 mt-1">Requires doctor review</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Upcoming Confirmed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{confirmedCount}</span>
          <p className="text-[11px] text-slate-400 mt-1">Ready for consultation</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Completed Visits</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{completedCount}</span>
          <p className="text-[11px] text-slate-400 mt-1">With digital Rx issued</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-teal-600 dark:text-teal-400">${totalRevenue}</span>
          <p className="text-[11px] text-slate-400 mt-1">{patientCount} unique patients</p>
        </div>
      </div>

      {/* SUBVIEW 1: APPOINTMENTS & REQUESTS */}
      {activeTabSub === 'appointments' && (
        <div className="space-y-6">
          {/* Sub filter tabs */}
          <div className="flex gap-2">
            {[
              { id: 'pending', label: 'Action Needed (Pending)', count: pendingCount },
              { id: 'confirmed', label: 'Upcoming Consultations', count: confirmedCount },
              { id: 'completed', label: 'Completed Visits', count: completedCount },
              { id: 'all', label: 'All History', count: doctorAppointments.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAptFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  aptFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-black/10 dark:bg-white/10">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Appointment list */}
          {displayedApts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700">
              <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1">No appointment requests in this category right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedApts.map(apt => (
                <div
                  key={apt.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
                        {apt.appointmentCode}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        Status: {apt.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {apt.date} at {apt.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Patient: {apt.patientName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Contact: {apt.patientPhone} • {apt.patientEmail} • Mode: <span className="font-semibold capitalize text-teal-600">{apt.type}</span>
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 text-xs">
                      <p><strong className="text-slate-800 dark:text-slate-200">Patient Symptoms:</strong> {apt.symptoms}</p>
                      {apt.reason && <p className="mt-1 text-slate-500"><strong>Visit Reason:</strong> {apt.reason}</p>}
                    </div>

                    {/* Attached reports */}
                    {apt.reports && apt.reports.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-slate-400 font-semibold">Attached Lab Files:</span>
                        {apt.reports.map(r => (
                          <span key={r.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{r.fileName}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Doctor Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-end gap-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-700">
                    {/* If pending: Doctor Accept or Reject */}
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => acceptAppointment(apt.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          onClick={() => setRejectingApt(apt)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject / Propose New Time</span>
                        </button>
                      </>
                    )}

                    {/* If confirmed: Launch Telehealth or Mark Complete */}
                    {apt.status === 'confirmed' && (
                      <>
                        {apt.type === 'online' && (
                          <button
                            onClick={() => {
                              setActiveVideoAppointment(apt);
                              setActiveTab('telehealth');
                            }}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition"
                          >
                            <Video className="w-4 h-4" />
                            <span>Start Video Consultation</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCompletingApt(apt);
                            setDiagnosis('');
                            setClinicalNotes('');
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Mark Complete & Issue Rx</span>
                        </button>
                      </>
                    )}

                    {/* If completed: View prescription issued */}
                    {apt.status === 'completed' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> Completed & Billed (${apt.consultationFee})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 2: AVAILABILITY & FEES MANAGEMENT */}
      {activeTabSub === 'availability' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Doctor Working Hours & Fees</h2>
              <p className="text-xs text-slate-400">Configure your daily slots, lunch break, and consultation rate.</p>
            </div>
            {savedSettingsMsg && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 animate-in fade-in">
                {savedSettingsMsg}
              </span>
            )}
          </div>

          {/* Working Days */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Active Working Days</label>
            <div className="grid grid-cols-7 gap-2">
              {[
                { day: 0, label: 'Sun' },
                { day: 1, label: 'Mon' },
                { day: 2, label: 'Tue' },
                { day: 3, label: 'Wed' },
                { day: 4, label: 'Thu' },
                { day: 5, label: 'Fri' },
                { day: 6, label: 'Sat' },
              ].map(d => {
                const isSelected = workingDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => {
                      if (isSelected) setWorkingDays(workingDays.filter(x => x !== d.day));
                      else setWorkingDays([...workingDays, d.day]);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours and Breaks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinic Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinic End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lunch Break Start</label>
              <input
                type="time"
                value={breakStart}
                onChange={e => setBreakStart(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Lunch Break End</label>
              <input
                type="time"
                value={breakEnd}
                onChange={e => setBreakEnd(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Fee Setting */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Consultation Fee ($ USD)
            </label>
            <input
              type="number"
              min="20"
              max="500"
              value={fee}
              onChange={e => setFee(Number(e.target.value))}
              className="w-full sm:w-48 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleSaveSchedule}
            className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition"
          >
            Save Schedule & Rates
          </button>
        </div>
      )}

      {/* SUBVIEW 3: REVENUE & CONSULTATION CHARTS */}
      {activeTabSub === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Visits Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Monthly Consultations</h3>
              <p className="text-xs text-slate-400 mb-6">Patient volume trend over the last 6 months</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="visits" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Trend Area Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Gross Revenue Trend ($)</h3>
              <p className="text-xs text-slate-400 mb-6">Gross consultation billings</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Decline Appointment ({rejectingApt.appointmentCode})
            </h3>
            <p className="text-xs text-slate-500 mt-1">Provide a reason and suggest an alternate slot for the patient.</p>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Rejection</label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Propose Alternate Time Slot</label>
                <input
                  type="text"
                  value={suggestedSlot}
                  onChange={e => setSuggestedSlot(e.target.value)}
                  placeholder="e.g. Nov 06 at 11:30 AM"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={() => {
                  rejectAppointment(rejectingApt.id, rejectReason, suggestedSlot);
                  setRejectingApt(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE & ISSUE DIGITAL PRESCRIPTION MODAL */}
      {completingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl my-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Complete Consultation & Issue Digital Rx
              </h2>
              <button onClick={() => setCompletingApt(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Bronchitis, Contact Dermatitis, Hypertension Stage 1"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Doctor's Consultation Notes
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Clinical observation, vitals check, patient response..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              {/* Prescribed Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Prescribe Medications (Rx)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Amoxicillin)"
                          value={med.name}
                          onChange={e => handleMedChange(idx, 'name', e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={med.dosage}
                          onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                          className="w-24 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (Twice daily)"
                          value={med.frequency}
                          onChange={e => handleMedChange(idx, 'frequency', e.target.value)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Days (5)"
                          value={med.days}
                          onChange={e => handleMedChange(idx, 'days', Number(e.target.value))}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Special instructions"
                          value={med.instructions}
                          onChange={e => handleMedChange(idx, 'instructions', e.target.value)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Lifestyle / Dietary Advice
                </label>
                <input
                  type="text"
                  value={advice}
                  onChange={e => setAdvice(e.target.value)}
                  placeholder="Drink plenty of fluids, rest, avoid strenuous cardio for 3 days..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recommended Follow-Up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full sm:w-56 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCompletingApt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrescriptionAndComplete}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
              >
                Issue Digital Prescription & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
