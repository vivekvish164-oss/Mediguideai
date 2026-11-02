import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  HeartPulse,
  Phone,
  Mail,
  Shield,
  Activity,
  AlertCircle,
  Edit3,
  CheckCircle2,
  Calendar,
  FileText,
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const { patientProfile, updatePatientProfile, appointments, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: patientProfile.fullName,
    phone: patientProfile.phone,
    age: patientProfile.age,
    gender: patientProfile.gender,
    bloodGroup: patientProfile.bloodGroup,
    allergies: patientProfile.allergies.join(', '),
    chronicConditions: patientProfile.chronicConditions.join(', '),
    emergencyName: patientProfile.emergencyContact.name,
    emergencyPhone: patientProfile.emergencyContact.phone,
    emergencyRelation: patientProfile.emergencyContact.relation,
    pastMedicalHistory: patientProfile.pastMedicalHistory,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile({
      fullName: formData.fullName,
      phone: formData.phone,
      age: Number(formData.age),
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation,
      },
      pastMedicalHistory: formData.pastMedicalHistory,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
            {patientProfile.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {patientProfile.fullName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                Verified Patient
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{patientProfile.email}</span> • <span>{patientProfile.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition self-start sm:self-auto shrink-0 shadow-md shadow-teal-600/20"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Health Profile'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Health profile updated successfully!</span>
        </div>
      )}

      {/* Edit Form or Display View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Patient Health Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group</label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Known Drug/Food Allergies (comma-separated)</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Chronic Conditions (comma-separated)</label>
            <input
              type="text"
              value={formData.chronicConditions}
              onChange={e => setFormData({ ...formData, chronicConditions: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
            />
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Emergency Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergencyName}
                onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.emergencyPhone}
                onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={formData.emergencyRelation}
                onChange={e => setFormData({ ...formData, emergencyRelation: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Past Medical History / Surgeries</label>
            <textarea
              rows={2}
              value={formData.pastMedicalHistory}
              onChange={e => setFormData({ ...formData, pastMedicalHistory: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white"
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Snapshot */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Biometric & Health Indicators</span>
            </h2>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Age</span>
                <span className="font-extrabold text-sm">{patientProfile.age} Yrs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Gender</span>
                <span className="font-extrabold text-sm">{patientProfile.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Blood Group</span>
                <span className="font-extrabold text-sm text-teal-600">{patientProfile.bloodGroup}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Known Allergies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {patientProfile.allergies.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold"
                  >
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Chronic Conditions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {patientProfile.chronicConditions.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900 font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency & Past History */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Emergency Contact & Notes</span>
            </h2>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Primary Emergency Contact:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {patientProfile.emergencyContact.name} ({patientProfile.emergencyContact.relation})
              </p>
              <p className="text-teal-600 dark:text-teal-400 font-semibold">{patientProfile.emergencyContact.phone}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Past Medical History & Notes
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                {patientProfile.pastMedicalHistory}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('appointments')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition text-center"
            >
              View My Consultation History ({appointments.length} Visits) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
