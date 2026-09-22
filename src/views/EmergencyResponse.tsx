import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { LeafletTrafficMap } from '../components/map/LeafletTrafficMap';
import {
  Siren,
  Flame,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  Phone,
  Sparkles,
  Zap,
} from 'lucide-react';

export const EmergencyResponse: React.FC = () => {
  const {
    emergencyCorridor,
    activateEmergencyCorridor,
    markControlPointClear,
    vehicles,
    setCurrentView,
  } = useSimulation();

  const emergencyVehicles = vehicles.filter((v) => v.category === 'EMERGENCY');

  // Clearance timeline progression steps
  const timelineSteps = [
    { key: 'REQUEST_RECEIVED', label: 'Emergency Request', desc: 'Distress call registered via 108 dispatch' },
    { key: 'ROUTE_CREATED', label: 'Route Created', desc: '16.4 km corridor mapped to District Hospital' },
    { key: 'UNITS_ALERTED', label: 'Traffic Units Alerted', desc: 'Marshals notified at Bhimtal & Tallital' },
    { key: 'CLEARANCE_IN_PROGRESS', label: 'Clearance In Progress', desc: 'Checkpoints clearing choke-points' },
    { key: 'ROUTE_CLEAR', label: 'Route Clear', desc: 'All checkpoints reporting unimpeded flow' },
    { key: 'VEHICLE_PASSING', label: 'Vehicle Passing', desc: 'Ambulance in final approach to hospital' },
  ];

  const currentStepIndex = timelineSteps.findIndex(
    (s) => s.key === emergencyCorridor.stepStatus
  );

  const clearedPointsCount = emergencyCorridor.controlPoints.filter(
    (cp) => cp.status === 'CLEAR'
  ).length;

  const clearancePercentage = Math.round(
    (clearedPointsCount / emergencyCorridor.controlPoints.length) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
                  INTELLIGENT EMERGENCY CORRIDOR DISPATCH
                </h1>
                <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                  CRITICAL RESCUE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated Green Corridors for Ambulances, Fire Brigade & Disaster Response Units
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={activateEmergencyCorridor}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 px-5 py-3 text-xs font-black text-white shadow-xl shadow-cyan-950 transition-all hover:scale-105 border border-cyan-400/40"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            {emergencyCorridor.isActive ? 'RE-ENGAGE CORRIDOR' : 'ACTIVATE EMERGENCY CORRIDOR'}
          </button>
        </div>
      </div>

      {/* Corridor Live Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
            Active Ambulance
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-white">
            {emergencyCorridor.vehicleReg}
          </div>
          <div className="text-[11px] text-cyan-300 mt-0.5">Ambulance 108 Cardiac Unit</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Corridor Destination
          </span>
          <div className="mt-1 font-semibold text-sm sm:text-base text-white truncate">
            {emergencyCorridor.destination}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{emergencyCorridor.totalDistanceKm} km total length</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Countdown ETA
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-amber-400">
            0{emergencyCorridor.currentEtaMinutes}:00 MIN
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-mono">Normal: 22 MIN (-58%)</div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
            Route Clearance
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-emerald-400">
            {clearancePercentage}%
          </div>
          <div className="text-[11px] text-emerald-300 mt-0.5">
            {clearedPointsCount} of {emergencyCorridor.controlPoints.length} Points Clear
          </div>
        </div>
      </div>

      {/* Route Clearance Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
          Sequential Route Clearance Timeline
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= (currentStepIndex >= 0 ? currentStepIndex : 0);
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-700/80 text-slate-300'
                    : 'bg-slate-950/20 border-slate-800/40 opacity-40'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={isCurrent ? 'text-cyan-300' : 'text-slate-400'}>
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-white leading-tight">{step.label}</h4>
                <p className="mt-1 text-[10px] text-slate-400 leading-tight">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Checkpoints & GIS Corridor Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Control Points with "MARK CLEAR" toggles */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Traffic Control Points
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Coordination</span>
          </div>

          <div className="space-y-3">
            {emergencyCorridor.controlPoints.map((cp) => {
              const isClear = cp.status === 'CLEAR';
              const isClearing = cp.status === 'CLEARING';

              return (
                <div
                  key={cp.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    isClear
                      ? 'bg-emerald-950/20 border-emerald-700/50'
                      : isClearing
                      ? 'bg-amber-950/20 border-amber-700/50'
                      : 'bg-red-950/30 border-red-700/60 shadow-md shadow-red-950/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">{cp.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{cp.road}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isClear
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : isClearing
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-red-950 text-red-400 border border-red-800/50 animate-pulse'
                      }`}
                    >
                      {cp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-center justify-between border-t border-slate-800/60 pt-2">
                    <span>Officer: <strong className="text-white">{cp.officerAssigned}</strong></span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {cp.contactNumber}
                    </span>
                  </div>

                  {/* Interactive Button */}
                  {!isClear ? (
                    <button
                      onClick={() => markControlPointClear(cp.id)}
                      className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      MARK CLEAR (VERIFIED)
                    </button>
                  ) : (
                    <div className="w-full mt-2 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-300 font-mono text-center font-bold">
                      ✓ CHECKPOINT CLEARED & LOGGED
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Leaflet GIS Corridor Map View */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Live Emergency Corridor GIS Tracking (Bhimtal → Nainital)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              POLYLINES ACTIVE
            </span>
          </div>

          <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-800">
            <LeafletTrafficMap
              height="100%"
              showCorridorRoute={true}
              filterCategory="ALL"
              centerCoords={[29.365, 79.5]}
              zoomLevel={13}
            />
          </div>
        </div>
      </div>

      {/* Other Active Emergency Fleet Units */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-3">
          Connected Emergency Fleet In Sector (Simulated Telemetry)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyVehicles.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {ev.registrationNumber}
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {ev.type}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Speed: <strong className="text-white">{ev.currentSpeed} km/h</strong> • {ev.road}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Sector: {ev.locationName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
