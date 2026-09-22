import React, { useState } from 'react';
import { INITIAL_AI_FORECAST } from '../data/mockData';
import { AISafetyForecast } from '../types';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AISafetyIntelligence: React.FC = () => {
  const [selectedRoadIndex, setSelectedRoadIndex] = useState<number>(0);
  const activeForecast: AISafetyForecast = INITIAL_AI_FORECAST[selectedRoadIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              AI ROAD SAFETY & PREDICTIVE INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine Learning accident likelihood projection & proactive resource dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI DEMONSTRATION — SIMULATED DATA
          </span>
        </div>
      </div>

      {/* AI Simulated Insights Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-sky-900/40 bg-sky-950/20 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            SYNTHETIC PATTERN 01
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            “NH-87 shows elevated overspeed activity during evening hours (17:00 – 21:30) with freight descent bursts exceeding 110 km/h.”
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Confidence Metric: 94.2%</span>
        </div>

        <div className="p-4 rounded-2xl border border-amber-900/40 bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
            <AlertTriangle className="w-4 h-4" />
            SYNTHETIC PATTERN 02
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            “Bhimtal Chowk demonstrates recurring traffic congestion bottlenecks during emergency ambulance transit through the market stretch.”
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Confidence Metric: 89.6%</span>
        </div>

        <div className="p-4 rounded-2xl border border-red-900/40 bg-red-950/20 space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4" />
            SYNTHETIC PATTERN 03
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            “Road Segment R-104 (Bhowali Niglat Curve) shows repeated high-risk events driven by narrow shoulder overtaking under low visibility.”
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Confidence Metric: 91.8%</span>
        </div>
      </div>

      {/* 6-Hour Risk Forecast Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
              PROBABILISTIC ACCIDENT RISK PROJECTION
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Next 6-Hour Forecast: {activeForecast.road}
            </h3>
          </div>

          {/* Road selector pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {INITIAL_AI_FORECAST.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRoadIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  selectedRoadIndex === idx
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.road.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Forecast Graph */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeForecast.forecast6h}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="expectedRisk"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 4 }}
                name="Expected Accident Risk Score (0-100)"
              />
              <Line
                type="monotone"
                dataKey="predictedCongestion"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#38bdf8', r: 3 }}
                name="Predicted Traffic Volume Index"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-500 font-mono text-right">
          Simulated LSTM neural forecasting engine model v2.1 • Horizon: 6 hours
        </div>
      </div>

      {/* AI Recommendations Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Automated AI Deployment Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Recommendation Alpha
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {activeForecast.aiRecommendation}
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Action: Deploy stationary interceptor vehicle to Mile 14 bend.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
            <span className="text-[11px] font-mono text-sky-400 uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Recommendation Beta
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              “Review traffic-control signal deployment around emergency corridors. Pre-cycle green phases at Bhimtal Chowk during incoming ambulance pings to prevent queue backlogs.”
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Action: Synchronize ITMS signal preemption timing for Ambulance 108.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
