import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RISK_ZONES } from '../data/mockData';
import { LeafletTrafficMap } from '../components/map/LeafletTrafficMap';
import { RiskZone } from '../types';
import {
  Flame,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  Clock,
  MapPin,
  Compass,
  ArrowUpRight,
} from 'lucide-react';

export const RiskIntelligence: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<RiskZone>(RISK_ZONES[0]);

  const getStatusColor = (status: RiskZone['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-800/60';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/80 border-orange-800/60';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/80 border-amber-800/60';
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              ROAD RISK INTELLIGENCE & CORRIDOR SAFETY PROFILING
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical danger scoring based on gradient descent, overspeed density and accident telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl font-bold">
            SIMULATED ANALYTICS
          </span>
        </div>
      </div>

      {/* 4 Risk Zones Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {RISK_ZONES.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-105 shadow-xl ${
                isSelected
                  ? 'bg-slate-900/90 border-orange-500 shadow-orange-950/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {zone.district}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getStatusColor(
                    zone.status
                  )}`}
                >
                  {zone.status} RISK
                </span>
              </div>

              <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{zone.roadName}</h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-black text-orange-400">
                  {zone.riskScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100 Risk Index</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-center font-mono text-[11px]">
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Incidents</div>
                  <div className="font-bold text-white mt-0.5">{zone.incidentsCount}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Overspeed</div>
                  <div className="font-bold text-red-400 mt-0.5">{zone.overspeedEventsCount}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px] uppercase">Accidents</div>
                  <div className="font-bold text-amber-400 mt-0.5">{zone.accidentsCount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Corridor Deep Dive & Interactive GIS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Detailed Profile */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">
              Zone Forensic Profile ({selectedZone.id})
            </span>
            <h3 className="text-base font-bold text-white mt-1">{selectedZone.roadName}</h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px] font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Peak Danger Temporal Window:
              </span>
              <p className="mt-1 font-bold text-white font-mono">{selectedZone.highRiskPeriod}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5 text-[11px] font-mono">
                <TrendingDown className="w-3.5 h-3.5 text-sky-400" />
                Average Speed In Corridors:
              </span>
              <p className="mt-1 font-bold text-white font-mono">{selectedZone.averageSpeedKmH} km/h</p>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-2">
                Primary Topographic & Traffic Hazards:
              </span>
              <div className="space-y-1.5">
                {selectedZone.keyHazards.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-xs text-red-300"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: GIS Risk Overlays Map */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              GIS Heat Zones & Hazardous Mountain Arcs
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Colored Risk Polylines</span>
          </div>

          <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-800">
            <LeafletTrafficMap
              height="100%"
              showRiskZones={true}
              showCorridorRoute={false}
              centerCoords={[29.355, 79.53]}
              zoomLevel={13}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
