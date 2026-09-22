import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  MapPin,
  Car,
  Gauge,
  FileCheck,
  RotateCcw,
  Radio,
  Siren,
  AlertTriangle,
  Flame,
  BrainCircuit,
  FileSpreadsheet,
  Building2,
  Network,
  ShieldCheck,
  Compass,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { hasAccessToView } = useAuth();
  const { currentView, setCurrentView, disputes } = useSimulation();
  const { t, language } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  const pendingDisputesCount = disputes.filter((d) => d.status === 'PENDING_REVIEW').length;

  const menuItems = [
    { id: 'overview', label: t('nav.overview'), icon: LayoutDashboard, badge: 'Live' },
    { id: 'map', label: t('nav.map'), icon: MapPin },
    { id: 'surveillance', label: t('nav.surveillance'), icon: Radio, badge: 'Radar' },
    { id: 'challans', label: t('nav.challans'), icon: FileText, badge: language === 'hi' ? 'अधिकार' : 'Power', highlightAmber: true },
    { id: 'rc_lookup', label: t('nav.rc_lookup'), icon: Car, badge: 'Vahan 4.0' },
    { id: 'register_vehicle', label: t('nav.register_vehicle'), icon: Car },
    { id: 'speed', label: t('nav.speed'), icon: Gauge, badge: 'Alerts' },
    {
      id: 'disputes',
      label: t('nav.disputes'),
      icon: FileCheck,
      badge: pendingDisputesCount > 0 ? `${pendingDisputesCount}` : undefined,
      highlightAmber: pendingDisputesCount > 0,
    },
    { id: 'repeat', label: t('nav.repeat'), icon: RotateCcw },
    { id: 'stolen', label: t('nav.stolen'), icon: Radio },
    { id: 'emergency', label: t('nav.emergency'), icon: Siren, highlight: true },
    { id: 'incidents', label: t('nav.incidents'), icon: AlertTriangle },
    { id: 'risk', label: t('nav.risk'), icon: Flame },
    { id: 'ai', label: t('nav.ai'), icon: BrainCircuit, badge: 'AI' },
    { id: 'reports', label: t('nav.reports'), icon: FileSpreadsheet },
    { id: 'executive', label: t('nav.executive'), icon: Building2 },
    { id: 'architecture', label: t('nav.architecture'), icon: Network },
    { id: 'security', label: t('nav.security'), icon: ShieldCheck },
    { id: 'future', label: t('nav.future'), icon: Compass },
    { id: 'team', label: t('nav.team'), icon: Users },
  ];

  const handleNav = (viewId: string) => {
    setCurrentView(viewId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-[1150] bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed md:sticky top-17 z-[1160] md:z-30 h-[calc(100vh-4.25rem)] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col shadow-sm ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Navigation Menu
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Collapse Button for desktop */}
        <div className="hidden md:flex items-center justify-end px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items List */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {menuItems.map((item) => {
            const hasAccess = hasAccessToView(item.id);
            if (!hasAccess) return null;

            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-sky-600/20 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-sky-500/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-blue-600 dark:text-sky-400'
                      : item.highlight
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : item.highlightAmber
                      ? 'text-amber-500'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                />

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between text-left truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                          item.badge === 'Live' || item.badge === 'AI' || item.badge === 'Radar'
                            ? 'bg-blue-100 dark:bg-sky-950 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-sky-800/60'
                            : item.highlightAmber
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer State Seal Info */}
        {!collapsed && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span>SARTHI v2.4</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">● NIC SECURE</span>
            </div>
            <div className="text-[9px] text-slate-400">
              State Integrated Traffic Command Center
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
