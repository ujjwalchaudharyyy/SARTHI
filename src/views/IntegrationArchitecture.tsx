import React from 'react';
import {
  Network,
  Database,
  Lock,
  Cpu,
  Zap,
  Building2,
  Users,
  ShieldCheck,
  Server,
  ArrowDown,
  Layers,
  Key,
} from 'lucide-react';

export const IntegrationArchitecture: React.FC = () => {
  const proposedIntegrations = [
    {
      title: 'VAHAN Registry Service',
      agency: 'Ministry of Road Transport and Highways (MoRTH)',
      purpose: 'Vehicle ownership, chassis verification, fitness compliance and vehicle class retrieval.',
      protocol: 'NIC REST API with mTLS & Gov Signatures',
      status: 'PROPOSED INTEGRATION — SUBJECT TO AUTHORIZATION',
    },
    {
      title: 'eChallan Portal',
      agency: 'NIC / State Transport Department',
      purpose: 'Verification-approved notice transmission and digital compounding status tracking.',
      protocol: 'Secure Gov Gateway API',
      status: 'PROPOSED INTEGRATION — SUBJECT TO AUTHORIZATION',
    },
    {
      title: 'AIS-140 VLT Fleet Tracking',
      agency: 'State Transport Fleet Management',
      purpose: 'Commercial bus and taxi GPS telemetry ingestion over certified server protocols.',
      protocol: 'AIS-140 Standard Telemetry Feed',
      status: 'PROPOSED INTEGRATION — SUBJECT TO AUTHORIZATION',
    },
    {
      title: 'City ITMS & Smart Traffic Signals',
      agency: 'Smart City & Municipal Traffic Cell',
      purpose: 'Dynamic traffic signal preemption and green wave corridor triggering.',
      protocol: 'NTCIP / SCATS Controller Gateway',
      status: 'PROPOSED INTEGRATION — SUBJECT TO AUTHORIZATION',
    },
    {
      title: 'ERSS 112 Emergency CAD System',
      agency: 'State Emergency Response Support System',
      purpose: 'Direct dispatch sync for 108 Ambulances, Fire Tenders and Police Interceptors.',
      protocol: 'CAP (Common Alerting Protocol) XML/JSON',
      status: 'PROPOSED INTEGRATION — SUBJECT TO AUTHORIZATION',
    },
  ];

  const pipelineStages = [
    {
      step: '01',
      title: 'Approved Data Sources',
      desc: 'Simulated VLT Telemetry, ANPR Sensors, Signal Controllers & ERSS 112 CAD',
      icon: Database,
    },
    {
      step: '02',
      title: 'Secure API Gateway',
      desc: 'Role-Based Authentication, mTLS Encryption, Rate Limiting & Token Authorization',
      icon: Lock,
    },
    {
      step: '03',
      title: 'SARTHI Data Ingestion Layer',
      desc: 'High-throughput Kafka/MQTT stream processing & geographic map-matching',
      icon: Server,
    },
    {
      step: '04',
      title: 'AI Analytics & Prediction Engine',
      desc: 'LSTM Neural Risk Forecasting, Corridor Congestion Modeling & Anomaly Scoring',
      icon: Cpu,
    },
    {
      step: '05',
      title: 'Event Detection & Speed Engine',
      desc: 'Real-time velocity vs speed limit calculation & evidence packet generation',
      icon: Zap,
    },
    {
      step: '06',
      title: 'Government Unified Command Center',
      desc: 'GIS Visual Dashboard, Corridor Control Room & Multi-Agency Dispatch',
      icon: Building2,
    },
    {
      step: '07',
      title: 'Field Operational Units',
      desc: 'Traffic Marshals, Highway Patrol Cruisers & 108 Emergency Medical Services',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              GOVERNMENT INTEGRATION ARCHITECTURE & DATA FLOW
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architectural blueprint for seamless integration with national and state government infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl font-bold">
            STATUTORY COMPLIANCE ARCHITECTURE
          </span>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-2">
          Centralized Data Flow & Decision Processing Pipeline
        </h3>

        <div className="flex flex-col space-y-3">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === pipelineStages.length - 1;

            return (
              <div key={stage.step} className="flex flex-col items-center">
                <div className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-sky-500/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-950 border border-sky-800/50 text-sky-400 font-mono text-sm font-bold">
                    {stage.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>

                {!isLast && (
                  <div className="my-1 text-slate-600 flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-sky-500 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Proposed Government Integration Cards */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Proposed Government Interoperability Gateways
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Designed for secure statutory deployment under Indian Digital Personal Data Protection (DPDP) and cybersecurity guidelines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposedIntegrations.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <Key className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-1" />
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.agency}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.purpose}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-mono">Protocol: {item.protocol}</div>
                <div className="p-1.5 rounded bg-amber-950/50 border border-amber-800/40 text-[9px] font-mono font-bold text-amber-300 text-center uppercase">
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
