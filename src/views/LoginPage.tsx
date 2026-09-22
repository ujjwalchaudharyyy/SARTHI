import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { GovernmentEmblem } from '../components/layout/GovernmentEmblem';
import { Background3D } from '../components/layout/Background3D';
import { UserRole } from '../types';
import {
  User,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { setCurrentView } = useSimulation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [officerId, setOfficerId] = useState('DEMO001');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(officerId, password, selectedRole);
    if (success) {
      setCurrentView('overview');
    } else {
      setError(
        language === 'hi'
          ? 'प्रमाणीकरण विफल। डेमो हेतु अधिकारी आईडी: DEMO001, पासवर्ड: demo123 उपयोग करें।'
          : 'Authentication failed. For government demonstration, use Officer ID: DEMO001, Password: demo123'
      );
    }
  };

  const fastLogin = (role: UserRole = 'SUPER_ADMIN') => {
    setOfficerId('DEMO001');
    setPassword('demo123');
    setSelectedRole(role);
    const ok = login('DEMO001', 'demo123', role);
    if (ok) {
      setCurrentView('overview');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] flex flex-col justify-between text-slate-800 dark:text-slate-100 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* 3D Geometric Depth Background */}
      <Background3D />

      {/* Top National Tricolor Accent Ribbon */}
      <div className="w-full h-1.5 flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* Top Controls Bar: State Badge, Language Switcher, Theme Toggle */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pt-4 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <strong className="text-slate-900 dark:text-white">GOVERNMENT OF INDIA</strong> • NATIONAL TRAFFIC COMMAND PORTAL
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span className="font-hindi">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Center Login Container */}
      <div className="max-w-md mx-auto w-full relative z-10 my-auto py-6 px-4">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Emblem & SARTHI Title */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <GovernmentEmblem size="lg" showTagline={false} />
            </div>

            <div>
              <h1 className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-slate-900 dark:text-white">
                SARTHI
              </h1>
              <span className="text-sm font-hindi font-bold text-amber-600 dark:text-amber-400">
                (सारथी)
              </span>
            </div>

            <p className="text-xs font-mono text-blue-600 dark:text-sky-400 uppercase tracking-wider font-bold">
              {t('app.subtitle')}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              State Integrated Traffic Directorate • Command & Control Room
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-700/50 text-xs text-red-700 dark:text-red-300 font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-semibold">
                Officer Service ID / Badge
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. DEMO001"
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-semibold">
                Authorization Key / Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-semibold">
                Designated Officer Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="SUPER_ADMIN">Super Admin / DG Traffic (All Modules)</option>
                <option value="TRAFFIC_OFFICER">Traffic Enforcement Officer</option>
                <option value="POLICE_OFFICER">Police Investigation Officer</option>
                <option value="EMERGENCY_OPERATOR">Emergency 108 Dispatcher</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.01]"
            >
              <span>{t('btn.login')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fast Demo Login Buttons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Quick Demo Access:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">1-Click Sign In</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fastLogin('SUPER_ADMIN')}
                className="flex items-center justify-center gap-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                Command DG
              </button>
              <button
                type="button"
                onClick={() => fastLogin('TRAFFIC_OFFICER')}
                className="flex items-center justify-center gap-1 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Traffic Officer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="max-w-4xl mx-auto w-full text-center pb-4 px-4 text-[11px] text-slate-500 font-mono relative z-10">
        NIC Certified Security Architecture • 256-Bit TLS Encryption • Motor Vehicles Act 1988 Compliance
      </div>
    </div>
  );
};
