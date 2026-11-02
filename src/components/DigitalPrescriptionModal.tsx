import React from 'react';
import { Prescription } from '../types';
import { X, Printer, HeartPulse, ShieldCheck, CheckCheck } from 'lucide-react';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
}

export const DigitalPrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  onClose,
}) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                MediguideAI Digital Prescription
              </h2>
              <p className="text-[11px] text-slate-400">Electronic Health Record (EHR) • Valid Prescription</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prescription Paper Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Doctor Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b-2 border-teal-600/30 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{prescription.doctorName}</h3>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">Medical Council Reg: {prescription.doctorRegNumber}</p>
              <p className="text-xs text-slate-500">Board Certified Specialist • MediguideAI Telehealth</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-3xl font-black text-teal-600/40 dark:text-teal-400/40 font-serif">
                ℞
              </span>
              <p className="text-xs text-slate-400">Date: {prescription.date}</p>
            </div>
          </div>

          {/* Patient Details strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Patient Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age / Gender</span>
              <span className="font-bold text-slate-900 dark:text-white">{prescription.patientAge} Yrs / {prescription.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Prescription ID</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{prescription.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Follow-Up</span>
              <span className="font-bold text-slate-900 dark:text-white">{prescription.followUpDate || 'As needed'}</span>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Assessment & Diagnosis</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 bg-teal-50/60 dark:bg-teal-950/40 p-2.5 rounded-xl border border-teal-200 dark:border-teal-900">
              {prescription.diagnosis}
            </p>
          </div>

          {/* Medications Table */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Prescribed Medications (Rx)
            </span>
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold">
                  <tr>
                    <th className="p-3">Medicine Name</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {prescription.medications.map((med, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{med.name}</td>
                      <td className="p-3 font-semibold text-teal-600 dark:text-teal-400">{med.dosage}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{med.frequency}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{med.days} days</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 italic">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* General Advice */}
          {prescription.advice && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                Doctor's Dietary & Lifestyle Advice:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{prescription.advice}</p>
            </div>
          )}

          {/* Digital Signature */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Digitally Signed & Verified via MediguideAI EHR</span>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 dark:text-slate-200 font-bold">
                {prescription.doctorName}
              </div>
              <span className="text-[10px] text-slate-400">Electronic Signature Key: #98A2-VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Take this digital Rx to any registered pharmacy.</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
