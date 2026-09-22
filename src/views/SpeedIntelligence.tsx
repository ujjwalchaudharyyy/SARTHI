import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ViolationRecord } from '../types';
import {
  Gauge,
  TrendingDown,
  AlertTriangle,
  RotateCcw,
  Zap,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const SpeedIntelligence: React.FC = () => {
  const {
    vehicles,
    violations,
    setSelectedViolation,
    flagVehicleForOverspeedDemo,
    setCurrentView,
  } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  const monitoredCount = vehicles.length;
  const criticalCount = violations.filter((v) => v.status === 'CRITICAL').length;
  const warningCount = violations.filter((v) => v.status === 'WARNING').length;
  const repeatCount = vehicles.filter((v) => (v.repeatCount ?? 0) >= 2).length;

  const filteredViolations = violations.filter((v) => {
    const matchSearch =
      v.vehicleRegistration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.road.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              SPEED INTELLIGENCE & VIOLATION DETECTION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated velocity monitoring against digital road speed limits • Human Verification Required
          </p>
        </div>

        <button
          onClick={() => flagVehicleForOverspeedDemo('UK07AB1234')}
          className="flex items-center gap-1.5 rounded-xl border border-red-600/50 bg-red-950/70 hover:bg-red-900/80 px-4 py-2 text-xs font-bold text-red-300 transition-colors shadow-md"
        >
          <Zap className="w-4 h-4 text-red-400" />
          Simulate Overspeed (UK07AB1234)
        </button>
      </div>

      {/* 5 KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Monitored Vehicles
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-white">{monitoredCount}</div>
          <div className="text-[11px] text-sky-400 mt-0.5">Simulated Telemetry</div>
        </div>

        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
            Overspeed Events
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-red-400">{violations.length}</div>
          <div className="text-[11px] text-red-300 mt-0.5">Requires Review</div>
        </div>

        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
            Warnings (5-15 km/h)
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-amber-400">{warningCount}</div>
          <div className="text-[11px] text-amber-300 mt-0.5">Advisory Triggered</div>
        </div>

        <div className="rounded-2xl border border-red-900/50 bg-red-950/40 p-4">
          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
            Critical (&gt;15 km/h)
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-red-500">{criticalCount}</div>
          <div className="text-[11px] text-red-300 mt-0.5">High Severity</div>
        </div>

        <div
          onClick={() => setCurrentView('repeat')}
          className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-4 cursor-pointer hover:border-purple-500/60 transition-colors"
        >
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
            Repeat Violators
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-purple-400">{repeatCount}</div>
          <div className="text-[11px] text-purple-300 mt-0.5 flex items-center gap-1">
            Habitual Offense <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Enforcement Protocol Disclaimer Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-200">Statutory Human Verification Safeguard:</strong>
          <span className="text-amber-300/90 ml-1">
            Automated sensor calculations do NOT generate immediate legal challans. Every record is classified as a pending candidate requiring designated officer verification and review before formal dispatch.
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
        {/* Table Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Registration or Road..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'CRITICAL', 'WARNING'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  statusFilter === tab
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Violations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Event ID / Vehicle</th>
                <th className="py-3 px-4">Road Corridor</th>
                <th className="py-3 px-4 text-center">Permitted</th>
                <th className="py-3 px-4 text-center">Recorded</th>
                <th className="py-3 px-4 text-center">Excess</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredViolations.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedViolation(v)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sky-400 text-sm">{v.vehicleRegistration}</div>
                    <div className="text-[10px] text-slate-500">{v.id} • {v.vehicleType}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    <div>{v.road}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{v.location}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400">{v.speedLimit} km/h</td>
                  <td className="py-3.5 px-4 text-center font-bold text-white text-sm">
                    {v.recordedSpeed} km/h
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-red-400">
                    +{v.excessSpeed} km/h
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-300">{v.durationSeconds}s</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{v.timestamp}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'CRITICAL'
                          ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedViolation(v);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700/50 text-sky-300 text-xs font-sans font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Inspect Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
