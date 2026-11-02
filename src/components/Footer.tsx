import React from 'react';
import { useApp } from '../context/AppContext';
import { HeartPulse, ShieldAlert, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Alert Banner in Footer */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Experiencing a Medical Emergency?</p>
              <p className="text-xs text-rose-300">
                Do not wait for an online appointment. For chest pain, stroke signs, or severe breathlessness, call emergency services immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('emergency')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition"
          >
            Emergency SOS Hub →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Mediguide<span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your Health, Guided by AI. MediguideAI bridges patients with certified medical specialists, empowering healthier lives through intelligent triage, telemedicine, and digital prescriptions.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>24/7 Helpline: +1 (800) 555-MEDI</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@mediguide.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Medical Innovation Hub, Boston, MA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">
                  Find Doctors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-teal-400 transition">
                  MediGuide AI Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appointments')} className="hover:text-teal-400 transition">
                  Bookings & Prescriptions
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('emergency')} className="hover:text-teal-400 transition">
                  Emergency Hospital Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Specialties</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">Cardiology</button></li>
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">Dermatology</button></li>
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">Neurology</button></li>
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">Pediatrics</button></li>
              <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 transition">Orthopedics</button></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Compliance</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>• HIPAA Aligned Standards</li>
              <li>• 256-bit TLS Encryption</li>
              <li>• Verified Doctor Registry</li>
              <li>• Patient Privacy Shield</li>
              <li>• ISO 27001 Certified Architecture</li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediguideAI Healthcare Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Practices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
