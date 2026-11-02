import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  HeartPulse,
  User,
  Stethoscope,
  ShieldAlert,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Building2,
  Award,
} from 'lucide-react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { loginUser, registerPatient, registerDoctor, specializations } = useApp();

  const [mode, setMode] = useState<'login' | 'register-patient' | 'register-doctor' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  // Login form
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('password123');

  // Patient Registration form
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pAge, setPAge] = useState(30);
  const [pGender, setPGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [pBlood, setPBlood] = useState('O+');

  // Doctor Registration form
  const [dName, setDName] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dSpec, setDSpec] = useState('General Medicine');
  const [dQual, setDQual] = useState('MD - Internal Medicine');
  const [dExp, setDExp] = useState(8);
  const [dRegNum, setDRegNum] = useState('');
  const [dHospital, setDHospital] = useState('');
  const [dFee, setDFee] = useState(80);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [doctorRegisteredNotice, setDoctorRegisteredNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoFill = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'patient') {
      setEmail('john.doe@example.com');
      setPassword('password123');
    } else if (role === 'doctor') {
      setEmail('sarah.mitchell@mediguide.ai');
      setPassword('password123');
    } else {
      setEmail('admin@mediguide.ai');
      setPassword('admin123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }
    const ok = loginUser(email, selectedRole);
    if (ok) {
      onClose();
    }
  };

  const handlePatientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pEmail) {
      setErrorMsg('Name and email are required.');
      return;
    }
    registerPatient({
      fullName: pName,
      email: pEmail,
      phone: pPhone,
      age: pAge,
      gender: pGender,
      bloodGroup: pBlood,
    });
    onClose();
  };

  const handleDoctorRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dName || !dEmail || !dRegNum || !dHospital) {
      setErrorMsg('Please fill in all medical registration fields.');
      return;
    }
    registerDoctor({
      name: dName.startsWith('Dr.') ? dName : `Dr. ${dName}`,
      email: dEmail,
      phone: dPhone,
      specialization: dSpec,
      qualifications: dQual,
      experienceYears: dExp,
      medicalRegNumber: dRegNum,
      hospital: dHospital,
      consultationFee: dFee,
    });
    setDoctorRegisteredNotice(true);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">MediguideAI Portal Access</h2>
              <p className="text-xs text-teal-100">Patients • Doctors • Administration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-700 text-center text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-3.5 transition border-b-2 ${
              mode === 'login'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register-patient');
              setErrorMsg('');
            }}
            className={`py-3.5 transition border-b-2 ${
              mode === 'register-patient'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Patient Sign Up
          </button>
          <button
            onClick={() => {
              setMode('register-doctor');
              setErrorMsg('');
            }}
            className={`py-3.5 transition border-b-2 ${
              mode === 'register-doctor'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-teal-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Doctor Apply
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Role to Login
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'patient', label: 'Patient', icon: User },
                    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
                    { id: 'admin', label: 'Admin', icon: ShieldAlert },
                  ].map(r => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleQuickDemoFill(r.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-teal-600/20"
              >
                Sign In as {selectedRole}
              </button>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">Quick 1-Click Demo Accounts:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span onClick={() => handleQuickDemoFill('patient')} className="cursor-pointer text-teal-600 underline font-semibold">Patient Demo</span> •
                  <span onClick={() => handleQuickDemoFill('doctor')} className="cursor-pointer text-teal-600 underline font-semibold">Doctor Demo</span> •
                  <span onClick={() => handleQuickDemoFill('admin')} className="cursor-pointer text-teal-600 underline font-semibold">Admin Demo</span>
                </div>
              </div>
            </form>
          )}

          {/* PATIENT REGISTRATION FORM */}
          {mode === 'register-patient' && (
            <form onSubmit={handlePatientRegisterSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={pEmail}
                    onChange={e => setPEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0192"
                    value={pPhone}
                    onChange={e => setPPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Age</label>
                  <input
                    type="number"
                    value={pAge}
                    onChange={e => setPAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
                  <select
                    value={pGender}
                    onChange={e => setPGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={pBlood}
                    onChange={e => setPBlood(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Create Patient Account
              </button>
            </form>
          )}

          {/* DOCTOR REGISTRATION FORM */}
          {mode === 'register-doctor' && (
            <div>
              {doctorRegisteredNotice ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Doctor Registration Submitted!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Per regulatory healthcare guidelines, your profile and medical registration number are in <strong>Pending</strong> status awaiting verification by Platform Administrators.
                  </p>
                  <button
                    onClick={() => {
                      setDoctorRegisteredNotice(false);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                  >
                    Got It
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDoctorRegisterSubmit} className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[11px] text-amber-800 dark:text-amber-300">
                    ⚕️ Doctor accounts require administrative board verification before public activation.
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Alexander Wright"
                      value={dName}
                      onChange={e => setDName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={dEmail}
                        onChange={e => setDEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Specialization</label>
                      <select
                        value={dSpec}
                        onChange={e => setDSpec(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                      >
                        {specializations.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Medical Reg Number</label>
                      <input
                        type="text"
                        required
                        placeholder="MC-2026-XXXX"
                        value={dRegNum}
                        onChange={e => setDRegNum(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Consultation Fee ($)</label>
                      <input
                        type="number"
                        min="20"
                        max="500"
                        value={dFee}
                        onChange={e => setDFee(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Hospital / Clinic Affiliation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Northwestern Memorial Hospital"
                      value={dHospital}
                      onChange={e => setDHospital(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Submit for Admin Credential Verification
                  </button>
                </form>
              )}
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Account Password</h3>
              <p className="text-xs text-slate-500">Enter your registered email address and we'll send you an encrypted password reset link.</p>

              {forgotSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  ✅ Password reset instructions sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="px-3 py-2 text-xs font-bold text-slate-500"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
