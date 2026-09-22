import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import { LeafletTrafficMap } from '../components/map/LeafletTrafficMap';
import {
  Radio,
  Navigation,
  Compass,
  Gauge,
  MapPin,
  ShieldCheck,
  Send,
  Zap,
  Target,
  FileText,
  Search,
} from 'lucide-react';

export const VehicleSurveillanceRadar: React.FC = () => {
  const {
    vehicles,
    surveillanceTarget,
    setSurveillanceTarget,
    setSelectedVehicle,
    setSelectedVehicleForChallan,
    setCurrentView,
    addAuditLog,
  } = useSimulation();
  const { t, language } = useLanguage();

  const [searchPlate, setSearchPlate] = useState<string>(surveillanceTarget || 'UK07AB1234');
  const [lockedPlate, setLockedPlate] = useState<string>(surveillanceTarget || 'UK07AB1234');
  const [isInterceptDispatched, setIsInterceptDispatched] = useState<boolean>(false);

  useEffect(() => {
    if (surveillanceTarget) {
      setSearchPlate(surveillanceTarget);
      setLockedPlate(surveillanceTarget);
    }
  }, [surveillanceTarget]);

  const targetVehicle = vehicles.find(
    (v) => v.registrationNumber.toUpperCase() === lockedPlate.toUpperCase()
  ) || vehicles[0];

  const handleLockTarget = (plate: string) => {
    setSearchPlate(plate);
    setLockedPlate(plate);
    setSurveillanceTarget(plate);
    setIsInterceptDispatched(false);
    setSelectedVehicle(targetVehicle);
    addAuditLog('SURVEILLANCE_TARGET_LOCKED', `Target Plate ${plate}`);
  };

  const handleDispatchIntercept = () => {
    setIsInterceptDispatched(true);
    addAuditLog(
      'POLICE_INTERCEPT_DISPATCHED',
      `Target ${targetVehicle.registrationNumber} at ${targetVehicle.locationName} -> Unit UK07PC012`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700 text-red-600 dark:text-red-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-300 dark:border-red-800/40">
                  {language === 'hi' ? 'वास्तविक समय रडार निगरानी' : 'REAL-TIME SURVEILLANCE RADAR'}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Telemetry Intercept & Checkpoint Forecasting
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {t('surveillance.title')}
              </h1>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('surveillance.subtitle')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedVehicleForChallan(targetVehicle);
              setCurrentView('challans');
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>{t('btn.issue_challan')}</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('rc_lookup');
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <FileText className="w-4 h-4" />
            <span>{t('btn.inspect_rc')}</span>
          </button>
        </div>
      </div>

      {/* Target Selector & Search */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchPlate.trim()) handleLockTarget(searchPlate.toUpperCase().trim());
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search or enter registration plate to trace (e.g. UK07AB1234, UK07EM102)..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold uppercase tracking-wider text-white shadow transition-colors"
          >
            <Target className="w-4 h-4" />
            {t('btn.radar_lock')}
          </button>
        </form>

        {/* Quick Pick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Live Targets in Range:</span>
          {vehicles.slice(0, 8).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleLockTarget(v.registrationNumber)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                lockedPlate === v.registrationNumber
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {v.registrationNumber} ({v.currentSpeed} km/h)
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Target HUD Telemetry | Right = Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Target Telemetry HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  {t('surveillance.radar_locked')}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                GPS LOCK 100%
              </span>
            </div>

            {/* Target Plate Header */}
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider">
                {targetVehicle.registrationNumber}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                {targetVehicle.makeModel || targetVehicle.type}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Owner: <span className="text-slate-800 dark:text-white font-medium">{targetVehicle.ownerName || 'State Registered Citizen'}</span>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  {t('surveillance.live_speed')}
                </div>
                <div
                  className={`mt-1 font-mono text-2xl font-black ${
                    targetVehicle.currentSpeed > targetVehicle.speedLimit
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {targetVehicle.currentSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Limit: {targetVehicle.speedLimit} km/h
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  {t('surveillance.heading')}
                </div>
                <div className="mt-1 font-mono text-2xl font-black text-amber-600 dark:text-amber-400">
                  {targetVehicle.heading}°
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {targetVehicle.direction === 1 ? 'Ascending North' : 'Descending South'}
                </div>
              </div>
            </div>

            {/* Location & Sector Coordinates */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Current Highway Sector
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">{targetVehicle.road}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Location: {targetVehicle.locationName}</div>
              <div className="font-mono text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                GPS: <span className="text-slate-800 dark:text-slate-200">{targetVehicle.lat}° N, {targetVehicle.lng}° E</span>
              </div>
            </div>
          </div>

          {/* Predictive Intercept Dispatcher */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
                <Zap className="w-4 h-4 text-amber-500" />
                {t('surveillance.checkpoint_prediction')}
              </div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">ETA ~2m 45s</span>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs space-y-1">
              <div className="font-semibold text-amber-800 dark:text-amber-300">{t('surveillance.next_checkpoint')}:</div>
              <div className="text-slate-800 dark:text-slate-200 font-mono">Bhowali Chowk Traffic Post #02</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {t('surveillance.recommended_unit')}: <strong className="text-slate-900 dark:text-white">UK07PC012 (Patrol SUV)</strong>
              </div>
            </div>

            {isInterceptDispatched ? (
              <div className="rounded-xl border border-emerald-300 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Intercept Broadcast Dispatched to Patrol Unit UK07PC012 & Roadblock #02
              </div>
            ) : (
              <button
                onClick={handleDispatchIntercept}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:scale-[1.01]"
              >
                <Radio className="w-4 h-4" />
                {t('btn.dispatch_intercept')}
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Highway Map (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 shadow-sm space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-200">
              <Navigation className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              Live Highway Telemetry Map View
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              100% Highway Clamped
            </span>
          </div>

          <div className="flex-1 min-h-[450px] sm:min-h-[520px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <LeafletTrafficMap />
          </div>
        </div>
      </div>
    </div>
  );
};
