import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartPulse,
  Search,
  Calendar,
  Bot,
  User as UserIcon,
  Moon,
  Sun,
  Bell,
  AlertTriangle,
  Stethoscope,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Languages,
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const {
    role,
    switchRole,
    currentUser,
    logoutUser,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    language,
    setLanguage,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: language === 'hi' ? 'होम' : 'Home', icon: HeartPulse },
    { id: 'doctors', label: language === 'hi' ? 'डॉक्टर खोजें' : 'Find Doctors', icon: Search },
    { id: 'ai-assistant', label: language === 'hi' ? 'मेडीगाइड AI' : 'MediGuide AI', icon: Bot, badge: 'AI' },
    { id: 'appointments', label: language === 'hi' ? 'अपॉइंटमेंट्स' : 'My Appointments', icon: Calendar },
    { id: 'emergency', label: language === 'hi' ? 'इमरजेंसी' : 'Emergency SOS', icon: AlertTriangle, danger: true },
  ];

  if (role === 'doctor') {
    navLinks.splice(3, 1, {
      id: 'doctor-dashboard',
      label: language === 'hi' ? 'डॉक्टर डैशबोर्ड' : 'Doctor Dashboard',
      icon: Stethoscope,
    });
  } else if (role === 'admin') {
    navLinks.splice(3, 1, {
      id: 'admin-dashboard',
      label: language === 'hi' ? 'एडमिन पैनल' : 'Admin Panel',
      icon: ShieldAlert,
    });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 ring-2 ring-teal-400/30">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  Mediguide<span className="text-teal-600 dark:text-teal-400">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
                {language === 'hi' ? 'आपका स्वास्थ्य, AI द्वारा निर्देशित' : 'Your Health, Guided by AI'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 shadow-xs'
                      : link.danger
                      ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.danger ? 'animate-bounce' : ''}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Change Language"
              aria-label="Toggle language between English and Hindi"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            setShowNotifMenu(false);
                            if (notif.type === 'rx_issued') setActiveTab('appointments');
                          }}
                          className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            !notif.isRead ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Pill for rapid testing/evaluation */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 hover:bg-teal-200 dark:hover:bg-teal-900 transition-colors"
                title="Switch Role Demo"
              >
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleRoleChange('patient')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                      role === 'patient'
                        ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Patient (John Doe)</span>
                    {role === 'patient' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('doctor')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                      role === 'doctor'
                        ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Doctor (Dr. Sarah Mitchell)</span>
                    {role === 'doctor' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                      role === 'admin'
                        ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Admin (Chief Eleanor)</span>
                    {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-teal-400 transition"
                aria-label="User profile menu"
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  {role === 'patient' && (
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                      <span>Health Profile</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sign In with another Account</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                    : link.danger
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-teal-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
