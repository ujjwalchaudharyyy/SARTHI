import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Incident } from '../types';
import {
  AlertTriangle,
  Flame,
  Radio,
  Car,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  PlusCircle,
  Filter,
  Search,
} from 'lucide-react';

export const IncidentCommand: React.FC = () => {
  const { incidents, updateIncidentStatus } = useSimulation();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const types = ['ALL', 'Accident', 'Traffic Jam', 'Road Hazard', 'Emergency Response', 'Stolen Vehicle'];

  const filtered = incidents.filter((inc) => {
    const matchType = typeFilter === 'ALL' || inc.type === typeFilter;
    const matchSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const getPriorityBadge = (priority: Incident['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border border-red-800/60 animate-pulse';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-400 border border-orange-800/60';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-950 text-emerald-400 border border-emerald-800/50';
      case 'IN_PROGRESS':
        return 'bg-cyan-950 text-cyan-400 border border-cyan-800/50';
      case 'ACKNOWLEDGED':
        return 'bg-amber-950 text-amber-400 border border-amber-800/50';
      default:
        return 'bg-red-950 text-red-400 border border-red-800/50 animate-pulse';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              ACCIDENT & TRAFFIC INCIDENT COMMAND
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inter-agency dispatch coordination for accidents, road blockages and hazards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl font-bold">
            {incidents.filter((i) => i.status !== 'RESOLVED').length} ACTIVE INCIDENTS
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incident ID, title, or road..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                typeFilter === t
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl hover:border-amber-500/40 transition-all space-y-3"
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                    {inc.id}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getPriorityBadge(
                      inc.priority
                    )}`}
                  >
                    {inc.priority} PRIORITY
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-white leading-tight">{inc.title}</h3>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getStatusBadge(
                    inc.status
                  )}`}
                >
                  {inc.status}
                </span>
              </div>
            </div>

            {/* Description & Road */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{inc.description}</p>

            {/* Metadata */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" /> Location:
                </span>
                <span className="text-slate-200">{inc.location}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Assigned Unit:
                </span>
                <span className="text-white font-bold">{inc.assignedUnit}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Logged Time:
                </span>
                <span className="text-slate-400">{inc.timestamp}</span>
              </div>
            </div>

            {/* Interactive Status Switcher for Officers */}
            <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">Update Incident Status:</span>
              <div className="flex items-center gap-1.5">
                {(['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateIncidentStatus(inc.id, st)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      inc.status === st
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
