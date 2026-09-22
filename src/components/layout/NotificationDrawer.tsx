import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Siren,
  Info,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
    setSelectedViolation,
    violations,
  } = useSimulation();

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.priority === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.actionTarget) {
      setCurrentView(item.actionTarget.view);
      if (item.actionTarget.id && item.actionTarget.view === 'speed') {
        const found = violations.find((v) => v.id === item.actionTarget?.id);
        if (found) setSelectedViolation(found);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1350] flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Bell className="w-5 h-5 text-sky-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Command Alerts Center
              </h3>
              <p className="text-[11px] text-slate-400">Real-time incident & speed event stream</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Read All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/40 text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-colors ${
                filter === tab
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No alerts in this category.
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isCrit = notif.priority === 'CRITICAL';
              const isWarn = notif.priority === 'WARNING';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    !notif.read
                      ? isCrit
                        ? 'bg-red-950/30 border-red-700/60 hover:border-red-500'
                        : isWarn
                        ? 'bg-amber-950/30 border-amber-700/60 hover:border-amber-500'
                        : 'bg-slate-800/60 border-sky-600/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isCrit ? (
                        <Siren className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs font-bold font-mono ${
                          isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-sky-400'
                        }`}
                      >
                        {notif.priority}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                  </div>

                  <h4 className="mt-1.5 text-xs font-bold text-white">{notif.title}</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{notif.message}</p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {notif.location}
                    </span>

                    {notif.actionTarget && (
                      <span className="text-sky-400 font-semibold flex items-center gap-1 hover:underline text-[10px]">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-500 font-mono text-center">
          Simulated Alert Bus • Connected to Command Gateway S1
        </div>
      </div>
    </div>
  );
};
