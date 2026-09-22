import React, { useState, useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Search,
  X,
  Car,
  AlertTriangle,
  Radio,
  MapPin,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    vehicles,
    incidents,
    violations,
    auditLogs,
    setSelectedVehicle,
    setSelectedViolation,
    setSelectedCaseId,
    setCurrentView,
  } = useSimulation();

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return { vehicles: [], incidents: [], violations: [], roads: [], officers: [] };

    const matchingVehicles = vehicles.filter(
      (v) =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.stolenCaseId && v.stolenCaseId.toLowerCase().includes(q))
    );

    const matchingIncidents = incidents.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    );

    const matchingViolations = violations.filter(
      (v) =>
        v.id.toLowerCase().includes(q) ||
        v.vehicleRegistration.toLowerCase().includes(q)
    );

    const matchingRoads = vehicles
      .map((v) => v.road)
      .filter((road, idx, self) => self.indexOf(road) === idx && road.toLowerCase().includes(q));

    const matchingOfficers = auditLogs.filter(
      (log) =>
        log.officerId.toLowerCase().includes(q) ||
        log.officerName.toLowerCase().includes(q)
    );

    return {
      vehicles: matchingVehicles.slice(0, 5),
      incidents: matchingIncidents.slice(0, 4),
      violations: matchingViolations.slice(0, 4),
      roads: matchingRoads.slice(0, 4),
      officers: matchingOfficers.slice(0, 3),
    };
  }, [searchTerm, vehicles, incidents, violations, auditLogs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1400] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-blue-950/60 overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5 bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Vehicle (UK07AB1234), Incident (INC-104), Stolen Case, Road (NH-87)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchTerm ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              <p>Type registration number, case ID, incident code, road name, or officer badge.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {['UK07AB1234', 'SV-2026-00481', 'INC-2026-104', 'NH-87', 'DEMO001'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchTerm(suggestion)}
                    className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sky-400 text-xs"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Vehicles */}
              {results.vehicles.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                    <Car className="w-3.5 h-3.5 text-sky-400" />
                    Vehicles ({results.vehicles.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.vehicles.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVehicle(v);
                          setCurrentView('map');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sky-400 text-sm">
                            {v.registrationNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            {v.type} • {v.road}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-300 font-bold">
                            {v.currentSpeed} km/h
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents */}
              {results.incidents.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Incidents ({results.incidents.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.incidents.map((i) => (
                      <div
                        key={i.id}
                        onClick={() => {
                          setCurrentView('incidents');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer group transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              {i.id}
                            </span>
                            <span className="text-xs font-medium text-slate-200">{i.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{i.location}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Violations */}
              {results.violations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    Violations & Evidence ({results.violations.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.violations.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedViolation(v);
                          setCurrentView('speed');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-red-400 text-xs">{v.id}</span>
                          <span className="font-mono font-semibold text-slate-200 text-xs">
                            {v.vehicleRegistration}
                          </span>
                          <span className="text-xs text-red-400">+{v.excessSpeed} km/h</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roads */}
              {results.roads.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Road Sectors
                  </div>
                  <div className="space-y-1.5">
                    {results.roads.map((road) => (
                      <div
                        key={road}
                        onClick={() => {
                          setCurrentView('map');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer group transition-colors"
                      >
                        <span className="text-xs font-medium text-slate-200">{road}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zero match */}
              {results.vehicles.length === 0 &&
                results.incidents.length === 0 &&
                results.violations.length === 0 &&
                results.roads.length === 0 && (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No simulated records matching "{searchTerm}". Try UK07AB1234, NH-87, or SV-2026-00481.
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
