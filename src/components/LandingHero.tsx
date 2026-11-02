import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Bot,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Video,
  CheckCircle2,
} from 'lucide-react';

export const LandingHero: React.FC<{
  onSearchDoctors: (query: string, specialty: string, location: string) => void;
}> = ({ onSearchDoctors }) => {
  const { setActiveTab, specializations, language } = useApp();

  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchDoctors(query, selectedSpecialty, location);
    setActiveTab('doctors');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-400/10 via-cyan-400/10 to-emerald-400/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Next-Gen Healthcare SaaS • AI-Powered Triaging</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {language === 'hi' ? (
                <>
                  आपका स्वास्थ्य, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500">AI द्वारा निर्देशित</span>
                </>
              ) : (
                <>
                  Your Health, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500">Guided by AI</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              {language === 'hi'
                ? 'शीर्ष सत्यापित डॉक्टरों से तुरंत अपॉइंटमेंट बुक करें, मेडीगाइड AI से प्राथमिक लक्षण मार्गदर्शन प्राप्त करें और सुरक्षित वीडियो परामर्श का लाभ उठाएं।'
                : 'Connect with verified top specialists, receive instant AI symptom guidance, book online or in-person consultations, and access digital prescriptions in seconds.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/25 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>{language === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{language === 'hi' ? 'AI लक्षण सहायक से पूछें' : 'Consult MediGuide AI'}</span>
              </button>
            </div>

            {/* Search Bar Container */}
            <div className="pt-4">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row gap-2.5 items-stretch"
              >
                {/* Doctor Name / Keyword */}
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={language === 'hi' ? 'डॉक्टर का नाम या बीमारी खोजें...' : 'Doctor name, symptoms, hospital...'}
                    className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Specialty Dropdown */}
                <div className="w-full md:w-52 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <select
                    value={selectedSpecialty}
                    onChange={e => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="text-slate-900 dark:text-slate-100">
                      {language === 'hi' ? 'सभी विशेषज्ञताएं' : 'All Specialties'}
                    </option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.name} className="text-slate-900 dark:text-slate-100">
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="w-full md:w-44 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder={language === 'hi' ? 'शहर या स्थान' : 'City or location'}
                    className="w-full bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Submit Search */}
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                </button>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  100% Verified Doctors
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Zero Double Booking
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  HD Telehealth Video
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Visual Card & AI Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Doctor Spotlight Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-700 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                      alt="Dr. Sarah Mitchell"
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-bold text-slate-900 dark:text-white text-base">
                          Dr. Sarah Mitchell, MD
                        </h2>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online now" />
                      </div>
                      <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                        Cardiologist • Harvard Alum
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal">(148 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    $120 / visit
                  </span>
                </div>

                {/* Live Slot Preview */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> Next Available Slots Today
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live Synced</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
                    >
                      10:00 AM
                    </button>
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
                    >
                      11:30 AM
                    </button>
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
                    >
                      03:00 PM
                    </button>
                  </div>
                </div>

                {/* MediGuide AI Mini Widget */}
                <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-extrabold text-teal-900 dark:text-teal-200">
                      MediGuide AI Triage Agent
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "Patient reported palpitations after exercise. Recommended: Cardiology ECG follow-up & BP review."
                  </p>
                  <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className="w-full py-2 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700/60 hover:bg-teal-50 transition text-center"
                  >
                    Ask AI Assistant Now →
                  </button>
                </div>
              </div>

              {/* Floating Stat Pill 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">50,000+</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Safe Consultations</div>
                </div>
              </div>

              {/* Floating Stat Pill 2 */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">99.4%</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
