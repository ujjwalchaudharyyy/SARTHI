import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { LeafletTrafficMap } from '../components/map/LeafletTrafficMap';
import {
  Car,
  TrendingDown,
  Siren,
  AlertTriangle,
  Radio,
  Flame,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  FileText,
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const {
    vehicles,
    violations,
    emergencyCorridor,
    incidents,
    setCurrentView,
    setSelectedViolation,
    flagVehicleForOverspeedDemo,
    activateEmergencyCorridor,
    setIsDemoTourActive,
    setDemoStepIndex,
  } = useSimulation();

  // Animated KPI numbers on load
  const [counts, setCounts] = useState({
    vehicles: 0,
    overspeed: 0,
    emergency: 0,
    incidents: 0,
    stolen: 0,
    riskZones: 0,
  });

  useEffect(() => {
    const target = {
      vehicles: 12486,
      overspeed: 328,
      emergency: 7,
      incidents: 18,
      stolen: 14,
      riskZones: 23,
    };

    let start = 0;
    const duration = 1200;
    const stepTime = 30;
    const steps = duration / stepTime;

    const timer = setInterval(() => {
      start++;
      const progress = Math.min(1, start / steps);
      setCounts({
        vehicles: Math.floor(target.vehicles * progress),
        overspeed: Math.floor(target.overspeed * progress),
        emergency: Math.floor(target.emergency * progress),
        incidents: Math.floor(target.incidents * progress),
        stolen: Math.floor(target.stolen * progress),
        riskZones: Math.floor(target.riskZones * progress),
      });

      if (progress >= 1) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const kpis = [
    {
      title: 'ACTIVE VEHICLES',
      value: counts.vehicles.toLocaleString(),
      subtext: '52 Live Telemetry Feeds',
      icon: Car,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40 border-sky-800/40 hover:border-sky-500/60',
      targetView: 'map',
    },
    {
      title: 'OVERSPEED EVENTS',
      value: counts.overspeed.toLocaleString(),
      subtext: '+32 max excess on NH-87',
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-950/40 border-red-800/40 hover:border-red-500/60',
      targetView: 'speed',
    },
    {
      title: 'ACTIVE EMERGENCY UNITS',
      value: counts.emergency.toLocaleString(),
      subtext: 'Ambulance 108 Corridor Active',
      icon: Siren,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-800/40 hover:border-cyan-500/60',
      targetView: 'emergency',
    },
    {
      title: 'ACTIVE INCIDENTS',
      value: counts.incidents.toLocaleString(),
      subtext: '4 in High-Priority Response',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40 border-amber-800/40 hover:border-amber-500/60',
      targetView: 'incidents',
    },
    {
      title: 'REPORTED STOLEN VEHICLES',
      value: counts.stolen.toLocaleString(),
      subtext: '3 Tracked in Bhimtal Area',
      icon: Radio,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/40 hover:border-purple-500/60',
      targetView: 'stolen',
    },
    {
      title: 'HIGH-RISK ZONES',
      value: counts.riskZones.toLocaleString(),
      subtext: 'NH-87 Sector Flagged Critical',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-950/40 border-orange-800/40 hover:border-orange-500/60',
      targetView: 'risk',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Triggers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              STATE TRAFFIC COMMAND & CONTROL CENTER (SITCC)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            District Nainital / Bhimtal Sector • Real-time Automated Intelligence & Corridor Management
          </p>
        </div>

        {/* Live Presentation Quick Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => flagVehicleForOverspeedDemo('UK07AB1234')}
            className="flex items-center gap-1.5 rounded-xl border border-red-600/50 bg-red-950/60 hover:bg-red-900/70 px-3 py-2 text-xs font-bold text-red-300 transition-colors shadow-md"
            title="Simulate immediate overspeed on vehicle UK07AB1234"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            Trigger Overspeed (UK07AB1234)
          </button>

          <button
            onClick={() => {
              activateEmergencyCorridor();
              setCurrentView('emergency');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/70 px-3 py-2 text-xs font-bold text-cyan-300 transition-colors shadow-md"
          >
            <Siren className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Engage Green Corridor
          </button>

          <button
            onClick={() => {
              setDemoStepIndex(0);
              setIsDemoTourActive(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-sky-950 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Guided Demo Tour
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards with Count Animation & Click navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => setCurrentView(kpi.targetView)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-xl group ${kpi.bgColor}`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  {kpi.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-300" />
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className={`font-mono text-2xl sm:text-3xl font-black ${kpi.color}`}>
                  {kpi.value}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                <Icon className={`w-3 h-3 ${kpi.color}`} />
                <span className="truncate">{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Active Banner */}
      {emergencyCorridor.isActive && (
        <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-cyan-950/60 p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  PRIORITY GREEN CORRIDOR ENGAGED
                </span>
                <span className="text-xs font-mono text-slate-300 font-bold">
                  {emergencyCorridor.vehicleReg} (Ambulance 108)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Route: <strong className="text-white">{emergencyCorridor.origin}</strong> →{' '}
                <strong className="text-white">{emergencyCorridor.destination}</strong> ({emergencyCorridor.totalDistanceKm} km)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400">Current ETA</span>
              <div className="font-mono text-2xl font-black text-cyan-400">
                0{emergencyCorridor.currentEtaMinutes}:00 MIN
              </div>
            </div>

            <button
              onClick={() => setCurrentView('emergency')}
              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-950 transition-colors flex items-center gap-1.5"
            >
              MANAGE CORRIDOR
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: GIS Live Map + Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
                Live Geographic Corridor (Bhimtal / Nainital)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {vehicles.length} Active Targets
              </span>
            </div>

            <button
              onClick={() => setCurrentView('map')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              Full Screen GIS <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <LeafletTrafficMap height="100%" />
          </div>
        </div>

        {/* Right 1 Col: Recent Violations & Incident Feed */}
        <div className="space-y-6">
          {/* Recent Violations Feed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Critical Speed Events
                </h4>
              </div>
              <button
                onClick={() => setCurrentView('speed')}
                className="text-[11px] text-sky-400 hover:underline font-mono"
              >
                View All
              </button>
            </div>

            <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {violations.slice(0, 4).map((vio) => (
                <div
                  key={vio.id}
                  onClick={() => setSelectedViolation(vio)}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-red-500/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {vio.vehicleRegistration}
                    </span>
                    <span className="font-mono text-xs font-bold text-red-400">
                      {vio.recordedSpeed} km/h{' '}
                      <span className="text-[10px] text-red-500 font-normal">
                        (+{vio.excessSpeed})
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[160px]">{vio.road}</span>
                    <span className="font-mono text-slate-500">{vio.timestamp.slice(-8)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents Stream */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Live Incident Dispatch
                </h4>
              </div>
              <button
                onClick={() => setCurrentView('incidents')}
                className="text-[11px] text-sky-400 hover:underline font-mono"
              >
                Manage
              </button>
            </div>

            <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {incidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setCurrentView('incidents')}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/50">
                      {inc.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        inc.status === 'RESOLVED'
                          ? 'text-emerald-400'
                          : inc.status === 'IN_PROGRESS'
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                  <h5 className="mt-1 text-xs font-semibold text-slate-200 truncate">{inc.title}</h5>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{inc.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
