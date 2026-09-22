import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { LeafletTrafficMap } from '../components/map/LeafletTrafficMap';
import { VehicleCategory } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Filter,
  Layers,
  Zap,
  Gauge,
  Siren,
  ShieldAlert,
  Radio,
  Car,
  CheckCircle2,
} from 'lucide-react';

export const LiveMap: React.FC = () => {
  const {
    vehicles,
    isSimulating,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    simulationSpeed,
    setSimulationSpeed,
    flagVehicleForOverspeedDemo,
    activateEmergencyCorridor,
    setSelectedVehicle,
  } = useSimulation();

  const [activeCategory, setActiveCategory] = useState<VehicleCategory | 'ALL'>('ALL');
  const [showCorridor, setShowCorridor] = useState<boolean>(true);
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);

  const categoryCounts = {
    ALL: vehicles.length,
    NORMAL: vehicles.filter((v) => v.category === 'NORMAL').length,
    WARNING: vehicles.filter((v) => v.category === 'WARNING').length,
    OVERSPEED: vehicles.filter((v) => v.category === 'OVERSPEED').length,
    EMERGENCY: vehicles.filter((v) => v.category === 'EMERGENCY').length,
    STOLEN: vehicles.filter((v) => v.category === 'STOLEN').length,
    INCIDENT: vehicles.filter((v) => v.category === 'INCIDENT').length,
  };

  const categories: { key: VehicleCategory | 'ALL'; label: string; color: string; count: number }[] = [
    { key: 'ALL', label: 'All Units', color: 'text-slate-300', count: categoryCounts.ALL },
    { key: 'NORMAL', label: 'Normal Compliance', color: 'text-emerald-400', count: categoryCounts.NORMAL },
    { key: 'WARNING', label: 'Warning Threshold', color: 'text-amber-400', count: categoryCounts.WARNING },
    { key: 'OVERSPEED', label: 'Overspeed Violators', color: 'text-red-400', count: categoryCounts.OVERSPEED },
    { key: 'EMERGENCY', label: 'Emergency Vehicles', color: 'text-cyan-400', count: categoryCounts.EMERGENCY },
    { key: 'STOLEN', label: 'Stolen / Police Watch', color: 'text-purple-400', count: categoryCounts.STOLEN },
    { key: 'INCIDENT', label: 'Incident Blockages', color: 'text-orange-400', count: categoryCounts.INCIDENT },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-lg font-black text-white">
              GIS LIVE TRAFFIC & VEHICLE SURVEILLANCE
            </h2>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
              SIMULATED TELEMETRY FEED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic positioning across Bhimtal, Bhowali Ghat, Nainital lake perimeter and NH-87 descent
          </p>
        </div>

        {/* Engine Controls & Interactive Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={isSimulating ? pauseSimulation : startSimulation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isSimulating
                ? 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/40'
                : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? 'PAUSE SIMULATION' : 'START SIMULATION'}
          </button>

          <button
            onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : 1)}
            className="px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-sky-400 hover:bg-slate-700 transition-colors"
            title="Toggle speed multiplier"
          >
            {simulationSpeed}x Speed
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET SIMULATION
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block mx-1" />

          {/* Quick Triggers for Demo */}
          <button
            onClick={() => flagVehicleForOverspeedDemo('UK07AB1234')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/50 text-xs font-bold text-red-300 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            Simulate Overspeed Event
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Layer Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                activeCategory === cat.key
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] bg-slate-950/60 font-bold ${cat.color}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Map Overlays Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCorridor(!showCorridor)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              showCorridor
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            Emergency Route
          </button>

          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              showRiskZones
                ? 'bg-red-950/60 border-red-500/50 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Risk Heat Zones
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="h-[calc(100vh-16rem)] min-h-[520px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <LeafletTrafficMap
          height="100%"
          filterCategory={activeCategory}
          showCorridorRoute={showCorridor}
          showRiskZones={showRiskZones}
        />
      </div>
    </div>
  );
};
