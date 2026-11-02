import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CalendarCheck,
  Video,
  FileText,
  ShieldCheck,
  Bot,
  Zap,
  Lock,
  ChevronDown,
  Star,
  Quote,
} from 'lucide-react';

export const HowItWorksAndFaq: React.FC = () => {
  const { setActiveTab, language } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: language === 'hi' ? 'लक्षण साझा करें या AI से पूछें' : 'Share Symptoms or Ask AI',
      desc: language === 'hi'
        ? 'मेडीगाइड AI से प्राथमिक सलाह लें जो आपको सही विशेषज्ञ सुझाएगा।'
        : 'Describe what you feel to our AI assistant or browse directly by medical specialty.',
      icon: Bot,
    },
    {
      step: '02',
      title: language === 'hi' ? 'सत्यापित डॉक्टर चुनें' : 'Choose a Verified Doctor',
      desc: language === 'hi'
        ? 'रेटिंग, अनुभव, फीस और समय के आधार पर उपयुक्त विशेषज्ञ चुनें।'
        : 'Filter by specialty, fee, ratings, and live real-time available time slots.',
      icon: Search,
    },
    {
      step: '03',
      title: language === 'hi' ? 'ऑनलाइन या क्लिनिक में परामर्श' : 'Consult Online or In-Person',
      desc: language === 'hi'
        ? 'सुरक्षित एचडी वीडियो कॉल या क्लिनिक में जाकर प्रत्यक्ष जांच कराएं।'
        : 'Connect via encrypted HD telehealth room or visit the clinic in person.',
      icon: Video,
    },
    {
      step: '04',
      title: language === 'hi' ? 'डिजिटल पर्चा और अनुवर्ती' : 'Digital Rx & Follow-Up',
      desc: language === 'hi'
        ? 'परामर्श पूरा होते ही डॉक्टर द्वारा जारी डिजिटल पर्चा डाउनलोड करें।'
        : 'Instantly download your doctor-signed digital prescription and lab advice.',
      icon: FileText,
    },
  ];

  const valueProps = [
    {
      title: 'Zero Double-Booking Guarantee',
      desc: 'Our real-time appointment engine prevents overlapping doctor slots and schedule conflicts.',
      icon: Zap,
    },
    {
      title: '100% Board-Verified Practitioners',
      desc: 'Admin team manually audits license numbers, credentials, and hospital privileges before approval.',
      icon: ShieldCheck,
    },
    {
      title: 'HIPAA-Compliant & End-to-End Encrypted',
      desc: 'Your medical reports, video consultations, and health history are strictly confidential.',
      icon: Lock,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Katherine Bell',
      role: 'Family Medicine Patient',
      rating: 5,
      comment:
        'MediguideAI made finding a pediatric cardiologist for my 6-year-old seamless. Within 15 minutes, we had an appointment and received the video consultation link right away.',
      location: 'New York, NY',
    },
    {
      name: 'Michael Vance',
      role: 'Chronic Care Patient',
      rating: 5,
      comment:
        'The MediGuide AI triage was surprisingly accurate when suggesting a dermatologist for my skin flare-up. The doctor sent the digital prescription immediately after the call.',
      location: 'Boston, MA',
    },
    {
      name: 'Sunita Mehra',
      role: 'Telehealth Patient',
      rating: 5,
      comment:
        'The Hindi language support and quick doctor booking is a game changer for my elderly parents. No waiting in clinic lines for routine prescription renewal.',
      location: 'San Jose, CA',
    },
  ];

  const faqs = [
    {
      q: 'Is MediGuide AI diagnosis considered official medical advice?',
      a: 'No. MediGuide AI provides informational symptom guidance, medical specialty recommendations, and educational context only. It is strictly not a clinical diagnosis or treatment prescription. For definitive diagnoses, you must consult a licensed medical physician on our platform.',
    },
    {
      q: 'How does doctor verification work on MediguideAI?',
      a: 'Every healthcare practitioner registering on MediguideAI must provide their state medical board registration number, medical degree certifications, and identity proofs. All accounts remain pending until human administrators verify their active medical credentials.',
    },
    {
      q: 'How do video consultations work?',
      a: 'Once your appointment is confirmed by the doctor, a secure Video Consultation Room is automatically generated. At your scheduled time, simply click "Join Video Consultation" in your Appointments dashboard to connect with camera and microphone controls.',
    },
    {
      q: 'Can I cancel or reschedule my appointment?',
      a: 'Yes. You can reschedule to another available time slot or cancel up to 2 hours before the appointment time directly from your dashboard with full fee protection.',
    },
    {
      q: 'Where do I find my digital prescription?',
      a: 'Immediately after the consultation is marked as completed by your doctor, your prescription is generated under the Completed Appointments tab, complete with dosage instructions and a downloadable receipt.',
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
            <span>Seamless Healthcare Journey</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === 'hi' ? 'यह कैसे काम करता है' : 'How MediguideAI Works'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Four simple steps from symptom curiosity to certified medical resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-teal-600/30 dark:text-teal-400/30 font-mono">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose MediguideAI */}
      <section className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white py-16 rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Why Patients & Doctors Trust Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Clinical Quality Meets Intelligent AI Automation
            </h2>
            <p className="text-slate-300 text-sm mt-3">
              Built with healthcare professionals to streamline appointments, eliminate paperwork, and deliver dependable medical care when you need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setActiveTab('doctors')}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-xl transition-all"
            >
              Book an Appointment in Seconds →
            </button>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Trusted by Thousands of Patients
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real feedback from patients who booked consultations on MediguideAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-teal-600/20 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-[11px] text-slate-400">{t.role} • {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about booking, telemedicine, and AI triage.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-teal-600 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
