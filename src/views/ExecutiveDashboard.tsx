import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Building2,
  Shield,
  Clock,
  Car,
  TrendingDown,
  Siren,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const ExecutiveDashboard: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bhimtal / Nainital');

  const districts = ['Bhimtal / Nainital', 'Haldwani', 'Dehradun', 'Haridwar'];

  // Simulated metrics adjusted by district selection
  const districtFactors: Record<string, number> = {
    'Bhimtal / Nainital': 1.0,
    Haldwani: 1.45,
    Dehradun: 2.1,
    Haridwar: 1.75,
  };

  const factor = districtFactors[selectedDistrict] || 1.0;

  const totalVehicles = Math.round(12486 * factor);
  const violationsCount = Math.round(328 * factor);
  const incidentsCount = Math.round(18 * factor);
  const emergencyResponses = Math.round(42 * factor);
  const avgResponseTime = (9.2 / Math.min(1.2, factor)).toFixed(1);
  const highRiskRoads = Math.round(4 * factor);

  const weeklyViolations = [
    { day: 'Mon', count: Math.round(45 * factor) },
    { day: 'Tue', count: Math.round(52 * factor) },
    { day: 'Wed', count: Math.round(48 * factor) },
    { day: 'Thu', count: Math.round(58 * factor) },
    { day: 'Fri', count: Math.round(84 * factor) },
    { day: 'Sat', count: Math.round(112 * factor) },
    { day: 'Sun', count: Math.round(128 * factor) },
  ];

  const responseTimeTrends = [
    { month: 'Apr', standard: 23, sarthi: 12 },
    { month: 'May', standard: 24, sarthi: 11 },
    { month: 'Jun', standard: 26, sarthi: 10.5 },
    { month: 'Jul', standard: 25, sarthi: 9.8 },
    { month: 'Aug', standard: 22, sarthi: 9.4 },
    { month: 'Sep', standard: 22, sarthi: 9.2 },
  ];

  const riskDistribution = [
    { name: 'Critical (Score >80)', value: 18, color: '#ef4444' },
    { name: 'High (60-80)', value: 34, color: '#f97316' },
    { name: 'Moderate (40-60)', value: 28, color: '#eab308' },
    { name: 'Low (<40)', value: 20, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with District Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              STATE / DISTRICT ROAD SAFETY OVERVIEW
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Executive Summary for Transport Secretary, Director General of Police & District Magistrates
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Jurisdiction:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-mono font-bold text-sky-400 focus:border-sky-500 focus:outline-none"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6 Executive KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Total Vehicles
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-white">
            {totalVehicles.toLocaleString()}
          </div>
          <div className="text-[11px] text-sky-400 mt-0.5">Daily Ingress</div>
        </div>

        <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
            Violations
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-red-400">
            {violationsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-red-300 mt-0.5">Automated Flags</div>
        </div>

        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
            Active Incidents
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-amber-400">{incidentsCount}</div>
          <div className="text-[11px] text-amber-300 mt-0.5">Under Resolution</div>
        </div>

        <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
            Emergency Corridors
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-cyan-400">
            {emergencyResponses}
          </div>
          <div className="text-[11px] text-cyan-300 mt-0.5">Successful Dispatches</div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
            Avg Response Time
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-emerald-400">
            {avgResponseTime} <span className="text-xs font-normal">min</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-0.5 font-bold">58% Reduction</div>
        </div>

        <div className="rounded-2xl border border-orange-900/40 bg-orange-950/20 p-4">
          <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">
            High-Risk Roads
          </span>
          <div className="mt-1 font-mono text-2xl font-black text-orange-400">{highRiskRoads}</div>
          <div className="text-[11px] text-orange-300 mt-0.5">Active Surveillance</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Violations Trend */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Weekly Violation Volume ({selectedDistrict})
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyViolations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Response Time Savings Line Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Emergency Response Time Comparison (Minutes)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="standard"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  name="Traditional Manual Response (min)"
                />
                <Line
                  type="monotone"
                  dataKey="sarthi"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="SARTHI Green Corridor (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Road Risk Category Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Road Network Risk Distribution (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ? name.split(' ')[0] : ''} ${percent ? (percent * 100).toFixed(0) : ''}%`}
                  labelLine={false}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Executive Highlights Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            District Safety Impact Highlights
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Golden Hour Rescue Success
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Emergency corridor clearance along Bhimtal-Tallital saved an average of 13 minutes per cardiac transit, achieving a 98.4% timely hospital admission rate.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-1">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Deterrence In High-Risk Curves
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Deployment of virtual telemetry speed zones along NH-87 produced a 41% decline in sustained excessive speeding over rolling 30-day periods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
