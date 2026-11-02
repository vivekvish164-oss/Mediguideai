import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Brain,
  Baby,
  Bone,
  Activity,
  Smile,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Brain,
  Baby,
  Bone,
  Activity,
  Smile,
};

export const SpecialtiesGrid: React.FC<{
  onSelectSpecialty: (specialtyName: string) => void;
}> = ({ onSelectSpecialty }) => {
  const { specializations, setActiveTab, language } = useApp();

  const handleCardClick = (specName: string) => {
    onSelectSpecialty(specName);
    setActiveTab('doctors');
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
              <span>Verified Specialties</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {language === 'hi' ? 'विशेषज्ञताओं का अन्वेषण करें' : 'Explore Top Medical Specialties'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {language === 'hi'
                ? 'अपनी आवश्यकतानुसार अनुभवी डॉक्टरों से परामर्श लें। प्रत्येक चिकित्सक बोर्ड द्वारा सत्यापित है।'
                : 'Browse board-certified doctors across key clinical fields. Transparent fees and real-time scheduling.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('doctors')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition shrink-0"
          >
            <span>{language === 'hi' ? 'सभी डॉक्टर देखें' : 'View All Specialists'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Specializations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {specializations.map(spec => {
            const Icon = ICON_MAP[spec.iconName] || Stethoscope;
            return (
              <div
                key={spec.id}
                onClick={() => handleCardClick(spec.name)}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-teal-400/80 dark:hover:border-teal-500 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {spec.doctorCount}+ Specialists
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Book →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
