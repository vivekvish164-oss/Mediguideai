# MediguideAI Database Architecture & Migration Guide

MediguideAI uses a relational PostgreSQL database schema with complete Row-Level Security (RLS) and foreign key constraints designed for Supabase or direct Cloud SQL PostgreSQL instances.

## Database Tables Overview

| Table | Purpose |
|---|---|
| `profiles` | Shared identity record linked with authentication (`patient`, `doctor`, `admin`) |
| `doctors` | Practitioner credentials, clinic/hospital details, fees, rating, registration number |
| `patients` | Medical profile, emergency contact, blood group, allergies, chronic history |
| `appointments` | Bookings with date/time, status (`pending`, `confirmed`, `completed`, `cancelled`), symptoms, fees |
| `doctor_availability` | Weekly day/hour schedule, slot durations (30m), lunch breaks, date blocks |
| `specializations` | Medical specialties (Cardiology, Dermatology, Neurology, Pediatrics, etc.) |
| `medical_records` | Patient lab reports, scan PDFs, prescriptions, file metadata |
| `prescriptions` | Digital Rx records with medications array (name, dosage, frequency, days, instructions) |
| `reviews` | Star ratings and patient feedback for completed appointments |
| `notifications` | In-app alerts for status updates, appointments, and reminders |
| `chat_messages` | In-consultation doctor-patient encrypted chat messages |

## Setup Instructions

### Supabase Setup
1. Create a new Supabase Project at [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in the Supabase dashboard.
3. Paste the contents of `database/schema.sql` and run the script.
4. Copy your project URL and public Anon Key from **Project Settings > API**.
5. Add the environment variables:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Row Level Security (RLS)
The migration file automatically enables Row Level Security on all critical tables. Patients can strictly view and edit only their own health records and bookings. Doctors are restricted to their assigned patients. Admins have oversight across registrations.
