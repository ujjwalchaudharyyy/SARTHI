import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { GovernmentEmblem } from './GovernmentEmblem';
import { UserRole } from '../../types';
import {
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  Zap,
  Sun,
  Moon,
  Globe,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onToggleMobileSidebar,
}) => {
  const { user, logout, switchRole } = useAuth();
  const {
    isSimulating,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    simulationSpeed,
    setSimulationSpeed,
    notifications,
    setIsDemoTourActive,
    setDemoStepIndex,
  } = useSimulation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin / DG Traffic', color: 'text-purple-600 dark:text-purple-400' },
    { role: 'TRAFFIC_OFFICER', label: 'Traffic Enforcement Officer', color: 'text-blue-600 dark:text-sky-400' },
    { role: 'POLICE_OFFICER', label: 'Police Investigation Officer', color: 'text-indigo-600 dark:text-indigo-400' },
    { role: 'EMERGENCY_OPERATOR', label: 'Emergency Response Controller', color: 'text-cyan-600 dark:text-cyan-400' },
    { role: 'ANALYST', label: 'Road Safety Data Analyst', color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  const handleStartDemo = () => {
    setDemoStepIndex(0);
    setIsDemoTourActive(true);
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md shadow-xs transition-colors duration-200">
      {/* Top National Tricolor Thin Ribbon */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2">
        {/* Left: Mobile Menu Toggle + Emblem & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <GovernmentEmblem size="sm" showTagline={true} />

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden xl:block mx-1" />

          {/* Location Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>{t('app.sector')}</span>
          </div>
        </div>

        {/* Center: Live Simulation Controls (Hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1">
          <div className="flex items-center gap-1.5 px-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <span
              className={`h-2 w-2 rounded-full ${
                isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {isSimulating ? 'LIVE SIMULATION' : 'PAUSED'}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center gap-1">
            {isSimulating ? (
              <button
                onClick={pauseSimulation}
                className="p-1 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Pause Simulation"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Start Simulation"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="p-1 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Reset Simulation Engine"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[10px] font-mono">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  simulationSpeed === speed
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: Language, Theme, Search, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Switcher Button (English / हिन्दी) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
            title="Change Language (English / हिन्दी)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span className="font-hindi">{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Light / Dark Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-2xs"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Guided Demo Button */}
          <button
            onClick={handleStartDemo}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-sky-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'hi' ? 'लाइव डेमो' : 'LIVE DEMO'}</span>
          </button>

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 px-2.5 sm:px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
            title="Global Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block font-mono text-[11px]">{t('btn.search')}</span>
            <kbd className="hidden lg:inline-block rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-600 dark:text-slate-400">
              /
            </kbd>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
            title="Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-mono font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile & Role Switcher */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1.5 sm:px-3 sm:py-1.5 text-xs hover:border-slate-400 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white font-mono text-[11px] font-bold">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Badge: {user.badgeId}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in duration-150 text-slate-800 dark:text-slate-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.department}</div>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Switch Officer Role
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                          user.role === r.role
                            ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-sky-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className={r.color}>{r.label}</span>
                        {user.role === r.role && <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    <button
                      onClick={() => {
                        logout();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('btn.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
