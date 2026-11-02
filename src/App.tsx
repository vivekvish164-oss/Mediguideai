import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { SpecialtiesGrid } from './components/SpecialtiesGrid';
import { HowItWorksAndFaq } from './components/HowItWorksAndFaq';
import { DoctorCard } from './components/DoctorCard';
import { DoctorSearch } from './components/DoctorSearch';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { PatientAppointmentsView } from './components/PatientAppointmentsView';
import { PatientProfileView } from './components/PatientProfileView';
import { DoctorDashboardView } from './components/DoctorDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AiAssistantView } from './components/AiAssistantView';
import { VideoConsultationRoom } from './components/VideoConsultationRoom';
import { EmergencyView } from './components/EmergencyView';
import { AuthModal } from './components/AuthModal';
import { Doctor } from './types';
import { ArrowRight, Star } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    doctors,
    selectedDoctorForBooking,
    setSelectedDoctorForBooking,
    activeVideoAppointment,
    language,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);

  // Search filter states passed from landing to doctors view
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleLandingSearch = (q: string, spec: string, loc: string) => {
    setSearchQuery(q);
    setSearchSpecialty(spec);
    setSearchLocation(loc);
  };

  const handleSelectSpecialtyFromGrid = (specName: string) => {
    setSearchSpecialty(specName);
    setSearchQuery('');
  };

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctorForBooking(doc);
  };

  const handleViewDoctorProfile = (doc: Doctor) => {
    setProfileDoctor(doc);
  };

  const handleBookingSuccess = (appointmentId: string) => {
    setActiveTab('appointments');
  };

  // If in an active video telehealth call, render full-screen video room
  if (activeTab === 'telehealth' || activeVideoAppointment) {
    return <VideoConsultationRoom />;
  }

  const featuredDoctors = doctors.filter(d => d.status === 'active').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-teal-500 selection:text-white font-sans">
      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="flex-1">
        {/* VIEW 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <div>
            <LandingHero onSearchDoctors={handleLandingSearch} />

            <SpecialtiesGrid onSelectSpecialty={handleSelectSpecialtyFromGrid} />

            {/* Featured Verified Specialists Section */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
                    <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                    <span>Top Rated Specialists</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'विशेष रुप से प्रदर्शित चिकित्सक' : 'Featured Verified Physicians'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Book with confidence from our highest-rated medical practitioners.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearchSpecialty('');
                    setSearchQuery('');
                    setActiveTab('doctors');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
                >
                  <span>View All 15+ Doctors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDoctors.map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={handleBookDoctor}
                    onViewProfile={handleViewDoctorProfile}
                  />
                ))}
              </div>
            </section>

            <HowItWorksAndFaq />
          </div>
        )}

        {/* VIEW 2: DOCTORS DISCOVERY */}
        {activeTab === 'doctors' && (
          <DoctorSearch
            initialSpecialty={searchSpecialty}
            initialQuery={searchQuery}
            initialLocation={searchLocation}
            onBookDoctor={handleBookDoctor}
            onViewProfile={handleViewDoctorProfile}
          />
        )}

        {/* VIEW 3: APPOINTMENTS HUB */}
        {activeTab === 'appointments' && <PatientAppointmentsView />}

        {/* VIEW 4: AI HEALTHCARE ASSISTANT */}
        {activeTab === 'ai-assistant' && (
          <AiAssistantView onBookDoctor={handleBookDoctor} />
        )}

        {/* VIEW 5: PATIENT HEALTH PROFILE */}
        {activeTab === 'profile' && <PatientProfileView />}

        {/* VIEW 6: DOCTOR DASHBOARD */}
        {activeTab === 'doctor-dashboard' && <DoctorDashboardView />}

        {/* VIEW 7: ADMIN CONTROL PANEL */}
        {activeTab === 'admin-dashboard' && <AdminDashboardView />}

        {/* VIEW 8: EMERGENCY SOS HUB */}
        {activeTab === 'emergency' && <EmergencyView />}
      </main>

      <Footer />

      {/* Global Modals */}
      <DoctorDetailModal
        doctor={profileDoctor}
        onClose={() => setProfileDoctor(null)}
        onBook={handleBookDoctor}
      />

      <AppointmentBookingModal
        doctor={selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
        onSuccess={handleBookingSuccess}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
