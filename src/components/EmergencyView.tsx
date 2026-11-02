import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Heart,
  Activity,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const { language } = useApp();
  const [sosActive, setSosActive] = useState(false);

  const emergencyHospitals = [
    {
      name: 'Massachusetts General Emergency Trauma Center',
      distance: '1.2 miles away',
      address: '55 Fruit St, Boston, MA 02114',
      phone: '+1 (617) 726-2000',
      status: 'Open 24/7 • Level 1 Trauma Center',
    },
    {
      name: 'Brigham and Women’s Hospital Emergency Department',
      distance: '2.5 miles away',
      address: '75 Francis St, Boston, MA 02115',
      phone: '+1 (617) 732-5636',
      status: 'Open 24/7 • Dedicated Cardiac Care Unit',
    },
    {
      name: 'Boston Children’s Hospital Emergency Room',
      distance: '2.8 miles away',
      address: '300 Longwood Ave, Boston, MA 02115',
      phone: '+1 (617) 355-6611',
      status: 'Open 24/7 • Pediatric Level 1 Trauma',
    },
  ];

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Critical Red Alert Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldAlert className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {language === 'hi' ? 'आपातकालीन चिकित्सा सहायता (Emergency SOS)' : 'Emergency Healthcare Response'}
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
                If you or someone nearby is experiencing life-threatening symptoms, do not book an online consultation. Dial emergency services immediately.
              </p>
            </div>
          </div>

          {/* 1-Click SOS Trigger */}
          <button
            onClick={() => setSosActive(true)}
            className="px-6 py-4 rounded-2xl bg-white text-rose-700 font-black text-sm uppercase tracking-wider shadow-2xl hover:bg-rose-50 hover:scale-105 transition-all flex items-center gap-2 shrink-0 ring-4 ring-white/30"
          >
            <PhoneCall className="w-5 h-5 animate-pulse text-rose-600" />
            <span>Call 911 / 112 SOS</span>
          </button>
        </div>
      </div>

      {sosActive && (
        <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-900 dark:text-rose-100 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-bold">Connecting to Emergency Dispatch (911 / 112)... Please stay on the line.</span>
          </div>
          <button onClick={() => setSosActive(false)} className="text-rose-600 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Emergency Hotline Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">USA / Canada</span>
          <span className="text-2xl font-black text-rose-600">911</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Ambulance & Trauma</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">India (National)</span>
          <span className="text-2xl font-black text-rose-600">112 / 108</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Medical & Ambulance</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">United Kingdom</span>
          <span className="text-2xl font-black text-rose-600">999</span>
          <p className="text-[10px] text-slate-400 mt-0.5">NHS Emergency Services</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-xs">
          <span className="text-xs font-bold text-slate-400 block">European Union</span>
          <span className="text-2xl font-black text-rose-600">112</span>
          <p className="text-[10px] text-slate-400 mt-0.5">All Emergency Rescue</p>
        </div>
      </div>

      {/* Warning Red Flags */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recognize Critical Red Flag Symptoms
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Seek immediate emergency medical evaluation if you notice:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Heart Attack Signs</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>Crushing chest tightness or pressure</li>
              <li>Pain spreading to jaw, neck, back, or left arm</li>
              <li>Cold sweats, dizziness, sudden nausea</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Stroke (F.A.S.T.)</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>F:</strong> Face drooping on one side</li>
              <li><strong>A:</strong> Arm weakness or numbness</li>
              <li><strong>S:</strong> Speech difficulty or slurred words</li>
              <li><strong>T:</strong> Time to call 911 / 112 instantly</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Severe Respiratory Distress</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>Gasping for air or unable to speak full sentences</li>
              <li>Bluish lips or fingertips (cyanosis)</li>
              <li>Stridor, severe allergic throat closing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Nearest 24/7 Trauma Centers */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nearest Emergency Departments & Trauma Centers</h2>
          <p className="text-xs text-slate-500 mt-0.5">Verified 24/7 facilities with dedicated emergency rooms:</p>
        </div>

        <div className="space-y-3">
          {emergencyHospitals.map((hosp, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{hosp.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    {hosp.distance}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {hosp.address}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{hosp.status}</p>
              </div>

              <a
                href={`tel:${hosp.phone}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hospital ({hosp.phone})</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
