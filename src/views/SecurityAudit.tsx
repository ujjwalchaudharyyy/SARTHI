import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  ShieldCheck,
  Lock,
  Activity,
  AlertTriangle,
  Server,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';

export const SecurityAudit: React.FC = () => {
  const { auditLogs } = useSimulation();
  const [filterResult, setFilterResult] = useState<'ALL' | 'SUCCESS' | 'FLAGGED' | 'DENIED'>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterResult === 'ALL') return true;
    return log.result === filterResult;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              SECURITY AUDIT & DATA ACCESS GOVERNANCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable transaction logging & statutory access compliance for authorized personnel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            DPDP COMPLIANCE ENGINE
          </span>
        </div>
      </div>

      {/* 5 Security Gauges / KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Active Sessions
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-white">4</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">SITCC Terminals</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            API Ingestion Rate
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-sky-400">142 req/s</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Telemetry Ingestion</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Failed Logins
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-amber-400">1</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Past 24 Hours</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Data Access Events
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-purple-400">1,842</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Audited & Verified</div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
            System Integrity
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-emerald-400">99.98%</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">All Nodes Nominal</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Real-Time Security & Data Access Audit Trail
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every telemetry lookup, stolen vehicle inquiry and report export is permanently logged
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'SUCCESS', 'FLAGGED', 'DENIED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterResult(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  filterResult === tab
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Officer ID / Name</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">IP Address (Private Demo)</th>
                <th className="py-3 px-4 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-sky-400 font-bold">{log.id}</td>
                  <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4 text-white">
                    <span className="font-bold">{log.officerId}</span> • {log.officerName}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-400">{log.resource}</td>
                  <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : log.result === 'FLAGGED'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          : 'bg-red-950 text-red-400 border border-red-800/50'
                      }`}
                    >
                      {log.result}
                    </span>
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
