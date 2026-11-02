-- ==============================================================================
-- MediguideAI - Production Database Migration & Schema (PostgreSQL / Supabase)
-- "Your Health, Guided by AI"
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE doctor_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE appointment_type AS ENUM ('online', 'in-person');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- 2. SPECIALIZATIONS TABLE
CREATE TABLE specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    doctor_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCTORS TABLE
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES specializations(id) ON DELETE SET NULL,
    medical_registration_number VARCHAR(100) NOT NULL UNIQUE,
    qualifications VARCHAR(255) NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    hospital_name VARCHAR(255) NOT NULL,
    clinic_address TEXT,
    city VARCHAR(100) NOT NULL,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    languages TEXT[] DEFAULT ARRAY['English'],
    status doctor_status NOT NULL DEFAULT 'pending',
    bio TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    consultation_types appointment_type[] DEFAULT ARRAY['online', 'in-person']::appointment_type[],
    verification_documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PATIENTS TABLE
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    allergies TEXT[] DEFAULT ARRAY[]::text[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::text[],
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_history_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DOCTOR AVAILABILITY TABLE
CREATE TABLE doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT DEFAULT 30,
    break_start TIME,
    break_end TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_code VARCHAR(20) NOT NULL UNIQUE, -- e.g. APT-89421
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    type appointment_type NOT NULL DEFAULT 'online',
    status appointment_status NOT NULL DEFAULT 'pending',
    symptoms TEXT NOT NULL,
    reason_for_visit TEXT,
    urgency VARCHAR(20) DEFAULT 'normal',
    consultation_fee NUMERIC(10, 2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    rejection_reason TEXT,
    suggested_alternative_slot TIMESTAMP WITH TIME ZONE,
    consultation_notes TEXT,
    video_room_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MEDICAL RECORDS & UPLOADS
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size_kb INT,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PRESCRIPTIONS TABLE
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{name, dosage, frequency, duration, instructions}]
    general_advice TEXT,
    follow_up_date DATE,
    signed_by_doctor BOOLEAN DEFAULT true,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. REVIEWS & RATINGS TABLE
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'appointment_booked', 'appointment_confirmed', 'rx_issued', etc.
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_doctors_specialization ON doctors(specialization_id);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_chat_messages_appointment ON chat_messages(appointment_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, public can view doctor basic profiles
CREATE POLICY "Users can read and update their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Doctors: Public can view active doctors; Admins can view/manage all; Doctor can update own
CREATE POLICY "Public can view active doctors" ON doctors
    FOR SELECT USING (status = 'active');

CREATE POLICY "Doctors can manage their own profile" ON doctors
    FOR ALL USING (profile_id = auth.uid());

-- Appointments: Patients can see their appointments, doctors can see assigned appointments
CREATE POLICY "Patients can view and create their own appointments" ON appointments
    FOR ALL USING (
        patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    );

CREATE POLICY "Doctors can view and manage their assigned appointments" ON appointments
    FOR ALL USING (
        doctor_id IN (SELECT id FROM doctors WHERE profile_id = auth.uid())
    );

-- Notifications: Only target user can view their notifications
CREATE POLICY "Users view own notifications" ON notifications
    FOR ALL USING (profile_id = auth.uid());
