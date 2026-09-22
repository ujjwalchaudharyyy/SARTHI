import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { INITIAL_STOLEN_CASES } from '../data/mockData';
import { StolenVehicleCase } from '../types';
import {
  Radio,
  Search,
  FileText,
  AlertTriangle,
  Download,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  BellRing,
} from 'lucide-react';

export const StolenVehicles: React.FC = () => {
  const { addAuditLog, markNotificationRead, vehicles, setSelectedVehicle, setCurrentView } =
    useSimulation();

  const [searchPlate, setSearchPlate] = useState('UK07ST9981');
  const [selectedCase, setSelectedCase] = useState<StolenVehicleCase>(INITIAL_STOLEN_CASES[0]);
  const [alertCreated, setAlertCreated] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchPlate.trim().toUpperCase();
    const found = INITIAL_STOLEN_CASES.find(
      (c) =>
        c.registrationNumber.toUpperCase().includes(query) ||
        c.caseId.toUpperCase().includes(query)
    );

    if (found) {
      setSelectedCase(found);
      addAuditLog('STOLEN_CASE_LOOKUP', `Case ${found.caseId} (${found.registrationNumber})`);
    }
  };

  const handleSelectCase = (c: StolenVehicleCase) => {
    setSelectedCase(c);
    setSearchPlate(c.registrationNumber);
    setAlertCreated(false);
  };

  const handleCreateBroadcastAlert = () => {
    setAlertCreated(true);
    addAuditLog('STOLEN_ALERT_BROADCAST', `Intercept alert queued for ${selectedCase.registrationNumber}`);
  };

  const handleExportCase = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'STOLEN VEHICLE INVESTIGATION DOSSIER - POLICE WING',
        'SIMULATED TELEMETRY INTELLIGENCE',
        `Case ID,${selectedCase.caseId}`,
        `Registration Number,${selectedCase.registrationNumber}`,
        `Make / Model,${selectedCase.makeModel}`,
        `Color,${selectedCase.color}`,
        `Reported Date,${selectedCase.reportedDate}`,
        `Reporting Police Station,${selectedCase.reportingStation}`,
        `Simulated Last Seen Location,${selectedCase.lastSeenLocation}`,
        `Last Telemetry Ping,${selectedCase.lastSeenTimestamp}`,
        `Investigation Status,${selectedCase.status}`,
        `Officer In Charge,${selectedCase.officerInCharge}`,
        `Case Notes,${selectedCase.notes}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CASE_${selectedCase.caseId}_${selectedCase.registrationNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('STOLEN_CASE_EXPORTED', `File: CASE_${selectedCase.caseId}.csv`);
  };

  const handleTrackOnMap = () => {
    const v = vehicles.find((x) => x.registrationNumber === selectedCase.registrationNumber);
    if (v) {
      setSelectedVehicle(v);
    }
    setCurrentView('map');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              STOLEN VEHICLE & CRIME INTELLIGENCE DESK
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Police Investigation Portal • Automated Simulated Telemetry Correlation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl font-bold">
            SIMULATED LOCATION DATA
          </span>
        </div>
      </div>

      {/* Search Bar & Case Selector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              placeholder="Search by Vehicle Registration (e.g. UK07ST9981) or Case ID..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-950 transition-colors"
          >
            SEARCH CASE DOSSIER
          </button>
        </form>

        {/* Quick Case Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Active Cases:</span>
          {INITIAL_STOLEN_CASES.map((c) => (
            <button
              key={c.caseId}
              onClick={() => handleSelectCase(c)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors ${
                selectedCase.caseId === c.caseId
                  ? 'bg-purple-950 text-purple-300 border border-purple-600'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {c.registrationNumber} ({c.caseId})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Case Dossier Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800/50">
                  {selectedCase.caseId}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedCase.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="mt-2 font-mono text-3xl font-black text-white">
                {selectedCase.registrationNumber}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Vehicle: <strong className="text-white">{selectedCase.makeModel}</strong> • Color: {selectedCase.color}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Case Status</span>
              <div className="font-mono text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                SIMULATED MATCH
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Calendar className="w-4 h-4 text-sky-400" />
                Police FIR Particulars
              </div>
              <div className="text-slate-400">Reported Date: <span className="text-white font-mono">{selectedCase.reportedDate}</span></div>
              <div className="text-slate-400">Police Station: <span className="text-white font-medium">{selectedCase.reportingStation}</span></div>
              <div className="text-slate-400">Officer In-Charge: <span className="text-white font-medium">{selectedCase.officerInCharge}</span></div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-purple-400" />
                Simulated GIS Correlation
              </div>
              <div className="text-slate-400">Last Known Sector: <span className="text-white font-medium">{selectedCase.lastSeenLocation}</span></div>
              <div className="text-slate-400 font-mono">Coordinates: <span className="text-purple-300">{selectedCase.lat}° N, {selectedCase.lng}° E</span></div>
              <div className="text-slate-400">Telemetry Timestamp: <span className="text-amber-400 font-mono">{selectedCase.lastSeenTimestamp}</span></div>
            </div>
          </div>

          {/* Case Narrative Notes */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
              Case Diary / Sensor Correlation Notes
            </span>
            <p className="text-slate-300 leading-relaxed font-sans">{selectedCase.notes}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleTrackOnMap}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-950 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              TRACK ON GIS MAP
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCreateBroadcastAlert}
                className="flex items-center gap-1.5 rounded-xl border border-amber-600/50 bg-amber-950/40 hover:bg-amber-900/50 px-3.5 py-2.5 text-xs font-bold text-amber-300 transition-colors"
              >
                <BellRing className="w-4 h-4" />
                {alertCreated ? 'BROADCAST QUEUED' : 'BROADCAST POLICE ALERT'}
              </button>

              <button
                onClick={handleExportCase}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                EXPORT CASE DOSSIER (CSV)
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Intercept Coordination Protocol */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Intercept Standard Protocol
            </h4>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-0.5">Stage 1: Telemetry Hit</strong>
              <p className="text-slate-400 text-[11px]">
                Simulated sensor correlates license plate against police stolen registry.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-0.5">Stage 2: Checkpoint Warning</strong>
              <p className="text-slate-400 text-[11px]">
                Nearest highway patrol units at Bhowali and Bhimtal received push alerts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-0.5">Stage 3: Verification & Intercept</strong>
              <p className="text-slate-400 text-[11px]">
                Authorized police cruiser mobilizes for physical verification and vehicle seizure.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300">
            <strong>Demonstration Note:</strong> All case files and registration plate numbers are synthetic demo records for evaluating command center workflows.
          </div>
        </div>
      </div>
    </div>
  );
};
