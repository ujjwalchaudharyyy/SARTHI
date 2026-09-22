import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  X,
  Gauge,
  Navigation,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
  Siren,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export const VehicleDetailModal: React.FC = () => {
  const {
    selectedVehicle,
    setSelectedVehicle,
    violations,
    setSelectedViolation,
    setCurrentView,
    addAuditLog,
    setSurveillanceTarget,
    setSelectedVehicleForChallan,
  } = useSimulation();

  if (!selectedVehicle) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOpenEvidence = () => {
    const matchingViolation = violations.find(
      (v) => v.vehicleRegistration === selectedVehicle.registrationNumber
    ) || {
      id: `VIO-GEN-${Date.now().toString().slice(-4)}`,
      vehicleRegistration: selectedVehicle.registrationNumber,
      vehicleType: selectedVehicle.type,
      road: selectedVehicle.road,
      location: selectedVehicle.locationName,
      speedLimit: selectedVehicle.speedLimit,
      recordedSpeed: selectedVehicle.currentSpeed,
      excessSpeed: selectedVehicle.excessSpeed,
      durationSeconds: selectedVehicle.durationSeconds,
      timestamp: new Date().toLocaleTimeString(),
      status: selectedVehicle.category === 'OVERSPEED' ? 'CRITICAL' : 'WARNING',
      requiresVerification: true,
      lat: selectedVehicle.lat,
      lng: selectedVehicle.lng,
      penaltyAmount: selectedVehicle.category === 'OVERSPEED' ? 2000 : 1000,
      disputeStatus: 'NO_DISPUTE' as const,
      telemetryHistory: [
        { time: 'T-30s', speed: selectedVehicle.speedLimit - 2, limit: selectedVehicle.speedLimit },
        { time: 'T-20s', speed: selectedVehicle.speedLimit + 10, limit: selectedVehicle.speedLimit },
        { time: 'T-10s', speed: selectedVehicle.currentSpeed - 4, limit: selectedVehicle.speedLimit },
        { time: 'Current', speed: selectedVehicle.currentSpeed, limit: selectedVehicle.speedLimit },
      ],
    };

    setSelectedViolation(matchingViolation);
    addAuditLog('VIOLATION_EVIDENCE_INSPECTED', `Vehicle ${selectedVehicle.registrationNumber}`);
  };

  const getStatusBadge = () => {
    switch (selectedVehicle.category) {
      case 'OVERSPEED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            OVERSPEEDING
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARNING THRESHOLD
          </span>
        );
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Siren className="w-3.5 h-3.5 animate-spin" />
            PRIORITY EMERGENCY
          </span>
        );
      case 'STOLEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Radio className="w-3.5 h-3.5" />
            STOLEN VEHICLE / INVESTIGATION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            NORMAL COMPLIANCE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl shadow-blue-950/50">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-mono text-2xl font-black tracking-wider text-sky-400">
                {selectedVehicle.registrationNumber}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1.5">
              <span>Class: <strong className="text-slate-200">{selectedVehicle.type}</strong></span>
              <span>•</span>
              <span className="text-amber-400 font-mono text-[11px] bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
                {selectedVehicle.dataSource}
              </span>
            </p>
          </div>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>Current Speed</span>
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-white">
              {selectedVehicle.currentSpeed}{' '}
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>Speed Limit</span>
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-slate-300">
              {selectedVehicle.speedLimit}{' '}
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <AlertTriangle className={`w-3.5 h-3.5 ${selectedVehicle.excessSpeed > 0 ? 'text-red-400' : 'text-slate-400'}`} />
              <span>Excess Speed</span>
            </div>
            <div
              className={`mt-1 font-mono text-xl font-bold ${
                selectedVehicle.excessSpeed > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {selectedVehicle.excessSpeed > 0 ? `+${selectedVehicle.excessSpeed}` : '0'}{' '}
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Duration</span>
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-slate-200">
              {formatDuration(selectedVehicle.durationSeconds)}
            </div>
          </div>
        </div>

        {/* Location & Sector Details */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 text-xs text-slate-300 space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              Road Corridor:
            </span>
            <span className="font-semibold text-white text-right">{selectedVehicle.road}</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-400">Exact Simulated Location:</span>
            <span className="text-slate-200 font-mono text-right">{selectedVehicle.locationName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Telemetry Coordinates:</span>
            <span className="font-mono text-slate-300">
              {selectedVehicle.lat.toFixed(5)}° N, {selectedVehicle.lng.toFixed(5)}° E
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Last Telemetry Ping:</span>
            <span className="font-mono text-slate-400">{selectedVehicle.lastUpdated}</span>
          </div>

          {selectedVehicle.repeatCount && (
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-amber-400">
              <span className="font-semibold">Repeat Offense History:</span>
              <span className="font-mono font-bold bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
                {selectedVehicle.repeatCount} Events Logged
              </span>
            </div>
          )}

          {selectedVehicle.emergencyDestination && (
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-cyan-400">
              <span className="font-semibold">Emergency Destination:</span>
              <span className="font-mono font-bold">
                {selectedVehicle.emergencyDestination} (ETA {selectedVehicle.emergencyEtaMinutes}m)
              </span>
            </div>
          )}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-4 rounded-lg bg-blue-950/20 border border-blue-800/30 p-2.5 text-[11px] text-blue-300">
          <strong>Notice:</strong> This telemetry packet is simulated for demonstration within the Bhimtal sector. Requires verification by authorised personnel before any statutory enforcement action.
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-800 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const reg = selectedVehicle.registrationNumber;
                setSelectedVehicle(null);
                setSurveillanceTarget(reg);
                setCurrentView('surveillance');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-sky-300 transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              RADAR TRACE
            </button>
            <button
              onClick={() => {
                setSelectedVehicle(null);
                setCurrentView('rc_lookup');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-amber-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              DIGITAL RC
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedVehicleForChallan(selectedVehicle);
                setSelectedVehicle(null);
                setCurrentView('challans');
              }}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              ISSUE E-CHALLAN
            </button>

            {selectedVehicle.category === 'OVERSPEED' && (
              <button
                onClick={handleOpenEvidence}
                className="flex items-center gap-1.5 rounded-lg border border-red-700/60 bg-red-950/60 hover:bg-red-900/60 px-3.5 py-2 text-xs font-bold text-red-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                EVIDENCE
              </button>
            )}

            <button
              onClick={() => setSelectedVehicle(null)}
              className="rounded-lg bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
