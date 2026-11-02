import React from 'react';
import { Appointment } from '../types';
import { X, Printer, Download, CheckCircle2, HeartPulse, Building2, Calendar, Clock, DollarSign } from 'lucide-react';

interface ReceiptModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentReceiptModal: React.FC<ReceiptModalProps> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Receipt Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Mediguide<span className="text-teal-600">AI</span> Invoice
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Printable Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receipt ID</span>
              <p className="font-mono text-base font-extrabold text-teal-600 dark:text-teal-400">
                REC-{appointment.appointmentCode}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Date: {new Date(appointment.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Payment Confirmed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div>
              <p className="text-slate-400 font-semibold">Billed To (Patient):</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{appointment.patientName}</p>
              <p className="text-slate-500">{appointment.patientEmail}</p>
              <p className="text-slate-500">{appointment.patientPhone}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Consulting Specialist:</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{appointment.doctorName}</p>
              <p className="text-slate-500">{appointment.doctorSpecialization}</p>
              <p className="text-slate-500">{appointment.doctorHospital}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3 font-medium">Medical Consultation ({appointment.doctorSpecialization})</td>
                  <td className="p-3 capitalize">{appointment.type}</td>
                  <td className="p-3 text-right font-bold">${appointment.consultationFee}.00</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Platform Telehealth & Electronic Processing</td>
                  <td className="p-3">Standard</td>
                  <td className="p-3 text-right font-bold">$5.00</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800/50 font-extrabold text-sm border-t border-slate-200 dark:border-slate-800">
                <tr>
                  <td colSpan={2} className="p-3 text-slate-900 dark:text-white">Total Paid</td>
                  <td className="p-3 text-right text-teal-600 dark:text-teal-400 font-black">
                    ${appointment.consultationFee + 5}.00
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>Payment Method: <span className="font-semibold text-slate-600 dark:text-slate-300">{appointment.paymentMethod}</span></p>
            <p>Schedule: <span className="font-semibold text-slate-600 dark:text-slate-300">{appointment.date} at {appointment.time}</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Electronic Receipt • Authorized by MediguideAI</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
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
