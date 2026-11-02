import React from 'react';
import { Doctor } from '../types';
import {
  X,
  Star,
  MapPin,
  Building2,
  Calendar,
  Video,
  UserCheck,
  Languages,
  Award,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBook,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold">{doctor.name}</h2>
                {doctor.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white text-teal-800 px-2 py-0.5 rounded-full">
                    <UserCheck className="w-3 h-3 text-teal-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-teal-100 font-semibold text-sm mt-0.5">
                {doctor.specialization}
              </p>
              <p className="text-xs text-teal-200 mt-1">{doctor.qualifications}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-teal-100">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {doctor.hospital}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {doctor.location}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {doctor.rating} ({doctor.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Experience</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                {doctor.experienceYears}+ Years
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
              <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                ${doctor.consultationFee}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">License / Reg</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate block">
                {doctor.medicalRegNumber}
              </span>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">About Doctor</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Languages & Consultation Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                <Languages className="w-4 h-4 text-teal-600" />
                Spoken Languages
              </span>
              <div className="flex flex-wrap gap-1.5">
                {doctor.languages.map((l, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                <Video className="w-4 h-4 text-teal-600" />
                Consultation Types
              </span>
              <div className="flex flex-wrap gap-1.5">
                {doctor.consultationTypes.map((type, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold capitalize flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {type === 'online' ? 'Online Video Call' : 'In-Person Clinic Visit'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Credentials */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              Verified Board Credentials & Certifications
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">State Medical Council Board Registration</p>
                  <p className="text-[11px] text-slate-400">License ID: {doctor.medicalRegNumber}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Verified Active
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Hospital Medical Privileges & Clean Record</p>
                  <p className="text-[11px] text-slate-400">{doctor.hospital}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Verified Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Standard Consultation Fee</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              ${doctor.consultationFee}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(doctor);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Slot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
