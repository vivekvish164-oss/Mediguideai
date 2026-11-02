import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DoctorCard } from './DoctorCard';
import { Doctor } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { filterDoctors } from '../utils/appointmentUtils';

interface DoctorSearchProps {
  initialSpecialty?: string;
  initialQuery?: string;
  initialLocation?: string;
  onBookDoctor: (doctor: Doctor) => void;
  onViewProfile: (doctor: Doctor) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  initialSpecialty = '',
  initialQuery = '',
  initialLocation = '',
  onBookDoctor,
  onViewProfile,
}) => {
  const { doctors, specializations, language } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || 'all');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || 'all');
  const [maxFee, setMaxFee] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [consultationType, setConsultationType] = useState<'all' | 'online' | 'in-person'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'fee-asc' | 'fee-desc' | 'experience'>('rating');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter doctors using pure utility
  const filteredDoctors = useMemo(() => {
    let result = filterDoctors(doctors, {
      searchQuery,
      specialization: selectedSpecialty,
      location: selectedLocation,
      maxFee,
      minRating,
      minExperience,
      consultationType: consultationType === 'all' ? undefined : consultationType,
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fee-asc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'fee-desc') return b.consultationFee - a.consultationFee;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return 0;
    });

    return result;
  }, [
    doctors,
    searchQuery,
    selectedSpecialty,
    selectedLocation,
    maxFee,
    minRating,
    minExperience,
    consultationType,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedLocation('all');
    setMaxFee(200);
    setMinRating(0);
    setMinExperience(0);
    setConsultationType('all');
    setSortBy('rating');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedSpecialty !== 'all' ||
    selectedLocation !== 'all' ||
    maxFee < 200 ||
    minRating > 0 ||
    minExperience > 0 ||
    consultationType !== 'all';

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Real-time Doctor Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {language === 'hi' ? 'डॉक्टर खोजें और अपॉइंटमेंट बुक करें' : 'Find Specialists & Schedule Appointment'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'hi'
            ? 'सत्यापित विशेषज्ञ, पारदर्शी शुल्क और तत्काल पुष्टि।'
            : 'Explore certified doctors across specialties. Choose online video or in-person visits with zero double booking.'}
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-md mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, hospital, symptom or city..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Dropdown */}
          <div className="w-full md:w-60">
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Specialties</option>
              {specializations.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-52">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="fee-asc">Fee: Low to High</option>
              <option value="fee-desc">Fee: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

          {/* Toggle More Filters */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`px-4 py-2.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition ${
              showFilterDrawer || hasActiveFilters
                ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            )}
          </button>
        </div>

        {/* Collapsible Advanced Filter Drawer */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-150">
            {/* Consultation Mode */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Consultation Mode
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
                {(['all', 'online', 'in-person'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setConsultationType(mode)}
                    className={`py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                      consultationType === mode
                        ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode === 'all' ? 'Any' : mode === 'online' ? 'Video' : 'Clinic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Consultation Fee */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Max Fee</span>
                <span className="text-teal-600 dark:text-teal-400 font-extrabold">${maxFee}</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={maxFee}
                onChange={e => setMaxFee(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$50</span>
                <span>$200+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      minRating === r
                        ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}+★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Experience */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Experience
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
                {[0, 5, 10, 15].map(exp => (
                  <button
                    key={exp}
                    onClick={() => setMinExperience(exp)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      minExperience === exp
                        ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {exp === 0 ? 'Any' : `${exp}+ Yrs`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-semibold">Active:</span>
            {selectedSpecialty !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1 font-bold">
                {selectedSpecialty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSpecialty('all')} />
              </span>
            )}
            {consultationType !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1 font-bold capitalize">
                {consultationType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setConsultationType('all')} />
              </span>
            )}
            {minRating > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-bold">
                {minRating}+ Stars
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
              </span>
            )}
            {maxFee < 200 && (
              <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1 font-bold">
                ≤ ${maxFee}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxFee(200)} />
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Showing <span className="text-teal-600 dark:text-teal-400">{filteredDoctors.length}</span> Verified Specialists
        </p>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No doctors match your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto">
            Try adjusting your search query, increasing your fee range, or clearing filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={onBookDoctor}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};
