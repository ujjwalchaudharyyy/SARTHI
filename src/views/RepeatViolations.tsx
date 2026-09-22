import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { REPEAT_VIOLATOR_STATS } from '../data/mockData';
import {
  RotateCcw,
  TrendingDown,
  ShieldAlert,
  Calendar,
  Filter,
  Car,
  Clock,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const RepeatViolations: React.FC = () => {
  const { setCurrentView, flagVehicleForOverspeedDemo } = useSimulation();
  const [timeFilter, setTimeFilter] = useState<'24H' | '7D' | '30D'>('7D');

  // Multiplier data for time filter simulation
  const multiplier = timeFilter === '24H' ? 0.35 : timeFilter === '7D' ? 1.0 : 3.4;

  const vehicleChartData = [
    { vehicle: 'UK07AB1234', count: Math.round(7 * multiplier), critical: Math.round(5 * multiplier) },
    { vehicle: 'UP15EF9087', count: Math.round(5 * multiplier), critical: Math.round(4 * multiplier) },
    { vehicle: 'DL01GH7721', count: Math.round(4 * multiplier), critical: Math.round(3 * multiplier) },
    { vehicle: 'UK08JK2210', count: Math.round(4 * multiplier), critical: Math.round(4 * multiplier) },
    { vehicle: 'UP16NP7732', count: Math.round(3 * multiplier), critical: Math.round(2 * multiplier) },
  ];

  const roadChartData = [
    { road: 'NH-87 Kathgodam-Bhimtal', violations: Math.round(142 * multiplier) },
    { road: 'Bhowali Ghat Road', violations: Math.round(88 * multiplier) },
    { road: 'Tallital Mall Road', violations: Math.round(45 * multiplier) },
    { road: 'Bhimtal Lake Road', violations: Math.round(34 * multiplier) },
    { road: 'Gaula Barrage Bypass', violations: Math.round(21 * multiplier) },
  ];

  const hourlyTrendData = [
    { hour: '06:00', count: Math.round(8 * multiplier) },
    { hour: '09:00', count: Math.round(24 * multiplier) },
    { hour: '12:00', count: Math.round(18 * multiplier) },
    { hour: '15:00', count: Math.round(32 * multiplier) },
    { hour: '18:00', count: Math.round(58 * multiplier) },
    { hour: '21:00', count: Math.round(74 * multiplier) },
    { hour: '00:00', count: Math.round(38 * multiplier) },
    { hour: '03:00', count: Math.round(14 * multiplier) },
  ];

  const dayOfWeekData = [
    { day: 'Mon', count: Math.round(28 * multiplier) },
    { day: 'Tue', count: Math.round(31 * multiplier) },
    { day: 'Wed', count: Math.round(29 * multiplier) },
    { day: 'Thu', count: Math.round(35 * multiplier) },
    { day: 'Fri', count: Math.round(62 * multiplier) },
    { day: 'Sat', count: Math.round(89 * multiplier) },
    { day: 'Sun', count: Math.round(94 * multiplier) },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              REPEAT VIOLATION & HABITUAL OFFENDER INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-temporal behavioral analytics • Escalated legal intervention planning
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 p-1">
          {(['24H', '7D', '30D'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                timeFilter === filter
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === '24H' ? 'Last 24 Hours' : filter === '7D' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Repeat Offenders List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Priority Habitual Offenders Registry ({timeFilter})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            SIMULATED OFFENSE REGISTRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPEAT_VIOLATOR_STATS.map((rec) => (
            <div
              key={rec.vehicleRegistration}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-purple-500/50 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sky-400 text-base">
                  {rec.vehicleRegistration}
                </span>
                <span className="font-mono text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50">
                  {Math.round(rec.totalViolations * multiplier)} Events
                </span>
              </div>

              <div className="text-xs text-slate-300">
                Category: <strong className="text-white">{rec.ownerCategory}</strong>
              </div>

              <div className="text-xs text-slate-400">
                Corridor: <span className="text-slate-200">{rec.primaryRoad}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                <span>Max Excess: <strong className="text-red-400">+{rec.maxExcessSpeed} km/h</strong></span>
                <span>{rec.lastViolationDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violations by Vehicle */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Violations Count by Habitual Offender
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="vehicle" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} name="Total Events" />
                <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} name="Critical Excess" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Road */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Overspeed Concentration by Road Corridor
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roadChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="road"
                  type="category"
                  stroke="#64748b"
                  width={140}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="violations" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Recorded Violations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Time of Day */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Violation Distribution by Hour of Day (Evening Surge)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#38bdf8"
                  fill="#0284c7"
                  fillOpacity={0.3}
                  name="Hourly Violations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Day of Week */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono mb-4">
            Violations by Day of Week (Weekend Tourist Spikes)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
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
                <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} name="Day Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
