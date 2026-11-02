import React from 'react';
import { Doctor } from '../types';
import {
  Star,
  MapPin,
  Building2,
  Calendar,
  Video,
  UserCheck,
  Languages,
  Award,
} from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onViewProfile }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-teal-400/80 dark:hover:border-teal-500/80 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Doctor Header */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-teal-500/30"
            />
            {doctor.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-800"
                title="Verified Medical Practitioner"
              >
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewsCount})</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
              {doctor.specialization}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{doctor.qualifications}</span>
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate max-w-[150px]">{doctor.hospital}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>{doctor.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 line-clamp-2 leading-relaxed">
          {doctor.bio}
        </p>

        {/* Badges & Languages */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {doctor.experienceYears}+ Yrs Exp.
          </span>
          {doctor.consultationTypes.includes('online') && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <Video className="w-3 h-3" />
              <span>Video Call</span>
            </span>
          )}
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Languages className="w-3 h-3" />
            <span>{doctor.languages.join(', ')}</span>
          </span>
        </div>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            ${doctor.consultationFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(doctor)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            Profile
          </button>
          <button
            onClick={() => onBook(doctor)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
