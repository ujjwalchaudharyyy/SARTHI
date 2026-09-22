import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  X,
  ShieldAlert,
  Download,
  Flag,
  History,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Gauge,
  FileCheck,
  HeartPulse,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const ViolationEvidenceModal: React.FC = () => {
  const {
    selectedViolation,
    setSelectedViolation,
    setCurrentView,
    addAuditLog,
  } = useSimulation();

  const [flagged, setFlagged] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  if (!selectedViolation) return null;

  const handleFlagForReview = () => {
    setFlagged(true);
    addAuditLog('VIOLATION_FLAGGED_REVIEW', `Violation ${selectedViolation.id} (${selectedViolation.vehicleRegistration})`);
  };

  const handleVerify = () => {
    setVerified(true);
    addAuditLog('VIOLATION_VERIFIED_OFFICER', `Violation ${selectedViolation.id} (${selectedViolation.vehicleRegistration})`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'VIOLATION EVIDENCE RECORD - SARTHI STATE TRAFFIC INFRASTRUCTURE',
        'OFFICIAL DISCIPLINARY TELEMETRY REPORT',
        `Violation ID,${selectedViolation.id}`,
        `Vehicle Registration,${selectedViolation.vehicleRegistration}`,
        `Vehicle Type,${selectedViolation.vehicleType}`,
        `Road,${selectedViolation.road}`,
        `Location,${selectedViolation.location}`,
        `Recorded Speed (km/h),${selectedViolation.recordedSpeed}`,
        `Speed Limit (km/h),${selectedViolation.speedLimit}`,
        `Excess Speed (km/h),${selectedViolation.excessSpeed}`,
        `Duration (seconds),${selectedViolation.durationSeconds}`,
        `Timestamp,${selectedViolation.timestamp}`,
        `Latitude,${selectedViolation.lat}`,
        `Longitude,${selectedViolation.lng}`,
        `Statutory Penalty,INR ${selectedViolation.penaltyAmount || 2000}`,
        `Dispute Status,${selectedViolation.disputeStatus || 'NONE'}`,
        `Legal Status,Requires digital adjudication or human magistrate confirmation under MV Act`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARTHI_EVIDENCE_${selectedViolation.vehicleRegistration}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('VIOLATION_EVIDENCE_EXPORTED_CSV', `File: SARTHI_EVIDENCE_${selectedViolation.vehicleRegistration}.csv`);
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/40">
                  {selectedViolation.id}
                </span>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                  SIMULATED EVENT
                </span>
              </div>
              <h2 className="mt-1 font-mono text-2xl font-black text-white">
                {selectedViolation.vehicleRegistration}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setSelectedViolation(null)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Notice */}
        <div className="mt-4 rounded-xl border border-amber-700/40 bg-amber-950/20 p-3 text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <span>⚠️ STATUTORY DISCLAIMER</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-200/90">
            This evidence packet is a demonstration simulation. Under motor vehicle enforcement rules, automated telemetry records require human verification by an authorized executive magistrate or traffic officer before issuance of any formal notice.
          </p>
        </div>

        {/* Telemetry Metrics */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-400">Recorded Speed</span>
            <div className="mt-1 font-mono text-2xl font-black text-red-400">
              {selectedViolation.recordedSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-400">Permitted Limit</span>
            <div className="mt-1 font-mono text-2xl font-black text-slate-300">
              {selectedViolation.speedLimit} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-400">Excess Speed</span>
            <div className="mt-1 font-mono text-2xl font-black text-red-500">
              +{selectedViolation.excessSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-[11px] text-slate-400">Event Duration</span>
            <div className="mt-1 font-mono text-2xl font-black text-sky-400">
              {selectedViolation.durationSeconds}s
            </div>
          </div>
        </div>

        {/* Speed vs Time Graph */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Speed Profile Over Time (Telemetry Trace)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Sampling: 1.0s interval</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedViolation.telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[40, 130]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={selectedViolation.speedLimit}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Limit: ${selectedViolation.speedLimit} km/h`,
                    fill: '#ef4444',
                    fontSize: 11,
                    position: 'top',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ fill: '#38bdf8', r: 4 }}
                  activeDot={{ r: 6, fill: '#ef4444' }}
                  name="Speed (km/h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location & Case Metadata */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Geographic Coordinates
            </div>
            <div className="text-slate-400">Road Corridor: <span className="text-white font-medium">{selectedViolation.road}</span></div>
            <div className="text-slate-400">Location: <span className="text-white font-medium">{selectedViolation.location}</span></div>
            <div className="font-mono text-slate-400">Lat/Lng: <span className="text-slate-200">{selectedViolation.lat}° N, {selectedViolation.lng}° E</span></div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Calendar className="w-4 h-4 text-purple-400" />
              Verification Metadata
            </div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Recorded Time: <span className="text-white font-mono">{selectedViolation.timestamp}</span>
            </div>
            <div className="text-slate-400">Vehicle Type: <span className="text-white font-medium">{selectedViolation.vehicleType}</span></div>
            <div className="text-slate-400">Audit Status:
              {verified ? (
                <span className="ml-1 text-emerald-400 font-bold">VERIFIED BY OFFICER</span>
              ) : flagged ? (
                <span className="ml-1 text-amber-400 font-bold">FLAGGED FOR REVIEW</span>
              ) : (
                <span className="ml-1 text-slate-300 font-medium">PENDING REVIEW</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedViolation(null);
                setCurrentView('repeat');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              VIEW VEHICLE HISTORY
            </button>
            <button
              onClick={() => {
                setSelectedViolation(null);
                setCurrentView('disputes');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-rose-600/50 bg-rose-950/40 hover:bg-rose-900/50 px-3.5 py-2 text-xs font-semibold text-rose-300 transition-colors"
            >
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              MEDICAL EXEMPTION / CONTEST
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!flagged && (
              <button
                onClick={handleFlagForReview}
                className="flex items-center gap-1.5 rounded-lg border border-amber-600/50 bg-amber-950/40 hover:bg-amber-900/50 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                FLAG FOR REVIEW
              </button>
            )}

            {!verified && (
              <button
                onClick={handleVerify}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-900/50 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                VERIFY EVIDENCE
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-950/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              EXPORT REPORT (CSV)
            </button>

            <button
              onClick={() => setSelectedViolation(null)}
              className="rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
