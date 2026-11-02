import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Send,
  Building2,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { calculatePlatformMetrics } from '../utils/appointmentUtils';

export const AdminDashboardView: React.FC = () => {
  const {
    doctors,
    appointments,
    patientProfile,
    updateDoctorStatus,
    specializations,
    language,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'doctors' | 'patients' | 'appointments' | 'settings'>('overview');
  const [broadcastText, setBroadcastText] = useState('');
  const [activeBroadcast, setActiveBroadcast] = useState('');

  // Calculate real platform metrics via pure utility
  const metrics = calculatePlatformMetrics(appointments);
  const pendingDoctors = doctors.filter(d => d.status === 'pending');
  const activeDoctors = doctors.filter(d => d.status === 'active');

  const specialtyDistribution = specializations.map(s => ({
    name: s.name,
    count: doctors.filter(d => d.specialization === s.name).length,
  }));

  const COLORS = ['#0d9488', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  const monthlyAnalytics = [
    { month: 'Jun', appointments: 120, revenue: 14400 },
    { month: 'Jul', appointments: 185, revenue: 22200 },
    { month: 'Aug', appointments: 240, revenue: 28800 },
    { month: 'Sep', appointments: 310, revenue: 37200 },
    { month: 'Oct', appointments: 395, revenue: 47400 },
    { month: 'Nov', appointments: 480, revenue: 57600 },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-teal-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>MediguideAI Administrative Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Master Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time compliance monitoring, doctor license verification, patient appointment oversight, and financial health analytics.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap bg-white/10 p-1 rounded-2xl shrink-0 backdrop-blur-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'doctors', label: `Doctors (${pendingDoctors.length} pending)` },
            { id: 'patients', label: 'Patients' },
            { id: 'appointments', label: 'Appointments' },
            { id: 'settings', label: 'Broadcast & AI' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAdminTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === t.id
                  ? 'bg-teal-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Broadcast Banner if set */}
      {activeBroadcast && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Platform Announcement:</strong> {activeBroadcast}</span>
          </div>
          <button
            onClick={() => setActiveBroadcast('')}
            className="text-amber-600 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Total Registered Doctors</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {doctors.length}
              </div>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                {activeDoctors.length} verified • {pendingDoctors.length} pending
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Doctor Verifications Pending</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {pendingDoctors.length}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                Awaiting admin review
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Total Appointments</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {metrics.total}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {metrics.completed} completed ({metrics.cancellationRate}% cancel rate)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400">Gross Platform Revenue</span>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                ${metrics.totalRevenue}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Est. commission: ${metrics.platformEarnings} (15%)
              </p>
            </div>
          </div>

          {/* Pending Verifications Action Strip */}
          {pendingDoctors.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Action Required: {pendingDoctors.length} Doctor Registration(s) Awaiting Review
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Verify medical licenses, degrees, and hospital privileges before activating public booking.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdminTab('doctors')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 transition"
              >
                Review Pending Doctors →
              </button>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Monthly Consultation Volume
              </h3>
              <p className="text-xs text-slate-400 mb-6">Completed consultations across all specialties</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="appointments" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                Gross Platform Billings ($)
              </h3>
              <p className="text-xs text-slate-400 mb-6">Consultation payments processed via gateway</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR VERIFICATION & MANAGEMENT */}
      {adminTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Practitioner Verification & Management
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Total {doctors.length} practitioners registered
            </span>
          </div>

          <div className="space-y-4">
            {doctors.map(doc => (
              <div
                key={doc.id}
                className={`bg-white dark:bg-slate-800 rounded-3xl p-6 border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition ${
                  doc.status === 'pending'
                    ? 'border-amber-400 dark:border-amber-700 bg-amber-50/20'
                    : 'border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        doc.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doc.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 font-extrabold animate-pulse'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                      {doc.specialization} • {doc.qualifications}
                    </p>
                    <p className="text-xs text-slate-500">
                      Hospital: <strong className="text-slate-700 dark:text-slate-300">{doc.hospital}</strong> ({doc.location}) • Fee: ${doc.consultationFee}
                    </p>
                    <p className="text-xs text-slate-400">
                      Medical Registration Number: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{doc.medicalRegNumber}</span>
                    </p>

                    {/* Verification Documents */}
                    {doc.verificationDocs && (
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-[11px] text-slate-400 font-semibold">Submitted Credentials:</span>
                        {doc.verificationDocs.map((docFile, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <FileText className="w-3 h-3 text-teal-600" />
                            <span>{docFile.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Verification Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-700">
                  {doc.status === 'pending' && (
                    <button
                      onClick={() => updateDoctorStatus(doc.id, 'active')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>
                  )}

                  {doc.status === 'active' && (
                    <button
                      onClick={() => updateDoctorStatus(doc.id, 'suspended')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 transition"
                    >
                      Suspend
                    </button>
                  )}

                  {doc.status === 'suspended' && (
                    <button
                      onClick={() => updateDoctorStatus(doc.id, 'active')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition"
                    >
                      Reactivate
                    </button>
                  )}

                  <button
                    onClick={() => updateDoctorStatus(doc.id, 'rejected')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT MANAGEMENT */}
      {adminTab === 'patients' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registered Patients Directory</h2>
          
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Allergies</th>
                  <th className="p-3">Appointments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold">{patientProfile.fullName}</td>
                  <td className="p-3">{patientProfile.age} Yrs / {patientProfile.gender}</td>
                  <td className="p-3">{patientProfile.phone}</td>
                  <td className="p-3 font-mono font-bold text-teal-600">{patientProfile.bloodGroup}</td>
                  <td className="p-3">{patientProfile.allergies.join(', ') || 'None'}</td>
                  <td className="p-3 font-bold text-teal-600">{appointments.length} Visits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS OVERSIGHT */}
      {adminTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Master Appointments Oversight</h2>
            <span className="text-xs font-semibold text-slate-400">Total {appointments.length} entries</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-teal-600">{a.appointmentCode}</td>
                    <td className="p-3 font-semibold">{a.patientName}</td>
                    <td className="p-3">{a.doctorName}</td>
                    <td className="p-3">{a.date} @ {a.time}</td>
                    <td className="p-3 capitalize">{a.type}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        a.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : a.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : a.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">${a.consultationFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST & AI SETTINGS */}
      {adminTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform Broadcast Announcements</h2>
            <p className="text-xs text-slate-400 mt-0.5">Send a high-visibility notification banner to all platform visitors.</p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
              placeholder="e.g. Weather Alert: Online Telehealth appointments recommended today due to heavy snow."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
            />
            <button
              onClick={() => {
                setActiveBroadcast(broadcastText);
                setBroadcastText('');
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Platform Broadcast</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">MediGuide AI Triage Safety Controls</h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Model Engine:</span>
                <span className="font-mono font-bold text-teal-600">gemini-3.8-flash (Server SDK)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Emergency Red Flag Detection:</span>
                <span className="font-bold text-emerald-600">Enabled (Automatic SOS Trigger)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Multi-language Translation:</span>
                <span className="font-bold text-teal-600">English & Hindi Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
