import React from 'react';
import {
  Compass,
  Milestone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Cpu,
  Eye,
  Network,
  Car,
  Shield,
  Layers,
} from 'lucide-react';

export const FutureVision: React.FC = () => {
  const phases = [
    {
      phase: 'PHASE 1',
      title: 'Student Innovation Prototype',
      status: 'CURRENT MILESTONE',
      badge: 'bg-emerald-950 text-emerald-400 border border-emerald-800/60',
      desc: 'Architecture validation, synthetic telemetry simulation engine, and live command center user interface developed at Graphic Era Hill University, Bhimtal.',
      milestones: [
        'Multi-category 50+ vehicle simulation engine',
        'Interactive green corridor checkpoint clearance system',
        'Forensic speed evidence graphing and CSV generation',
        'Demonstration for government stakeholders & academic jury',
      ],
    },
    {
      phase: 'PHASE 2',
      title: 'Controlled Government Pilot',
      status: 'PROPOSED NEXT STEP',
      badge: 'bg-sky-950 text-sky-400 border border-sky-800/60',
      desc: 'Controlled pilot along the Bhimtal-Nainital corridor with statutory departmental sanction, deploying test ANPR cameras and emergency vehicle transponders.',
      milestones: [
        'Memorandum of Understanding (MoU) with District Administration',
        'Deployment on dedicated secure state government server',
        'Field trial with 5 official 108 Emergency Ambulances',
        'Testing checkpoint clearance latency with on-ground marshals',
      ],
    },
    {
      phase: 'PHASE 3',
      title: 'District-Level Command Integration',
      status: 'PLANNED',
      badge: 'bg-slate-800 text-slate-300 border border-slate-700',
      desc: 'Full deployment across Nainital District Traffic Police headquarters, connecting all police stations, hospital dispatch desks, and mobile traffic patrol tabs.',
      milestones: [
        'Integration with District ERSS 112 Command CAD',
        'Real-time automated traffic signal preemption at major chowks',
        'Mobile terminal app for assigned on-ground traffic constables',
        'Weekly automated executive risk audits for District Magistrate',
      ],
    },
    {
      phase: 'PHASE 4',
      title: 'State-Level Network Deployment',
      status: 'FUTURE OBJECTIVE',
      badge: 'bg-slate-800 text-slate-300 border border-slate-700',
      desc: 'Expansion across Uttarakhand state highways (Char Dham transit routes, Dehradun, Haridwar, Rishikesh, Haldwani), creating an interconnected statewide grid.',
      milestones: [
        'Secure statutory gateway into State Transport VAHAN & eChallan',
        'Inter-district stolen vehicle tracking and intercept network',
        'Disaster management and landslide road-hazard alerting',
        'Integration with State Emergency Operations Center (SEOC)',
      ],
    },
    {
      phase: 'PHASE 5',
      title: 'Multi-State & National Scalability',
      status: 'LONG-TERM VISION',
      badge: 'bg-slate-800 text-slate-300 border border-slate-700',
      desc: 'National highway corridors linking neighboring states (UP, Delhi-NCR, Himachal Pradesh) for uninterrupted interstate freight and tourist green transit.',
      milestones: [
        'MoRTH Central Data Repository interoperability',
        'V2X (Vehicle-to-Everything) connected vehicle communications',
        'Edge AI computer vision models deployed directly on highway gantries',
        'National road safety policy analytics & predictive funding models',
      ],
    },
  ];

  const futureCapabilities = [
    {
      title: 'ANPR Computer Vision Gantries',
      desc: 'High-speed automated number plate recognition with OCR algorithms running at edge cameras.',
      icon: Eye,
    },
    {
      title: 'Smart Traffic Signal Preemption',
      desc: 'Dynamic green waves triggered automatically as emergency vehicles approach within 800m.',
      icon: Network,
    },
    {
      title: 'V2X & Cellular Telemetry Ingestion',
      desc: 'Direct communication between smart vehicles, highway infrastructure, and emergency ambulances.',
      icon: Car,
    },
    {
      title: 'Deep Learning Blackspot Forecasting',
      desc: 'Neural networks predicting accident probabilities based on real-time weather, gradient and volume.',
      icon: Cpu,
    },
    {
      title: 'Statutory Government API Gateways',
      desc: 'Authenticated connectors to central VAHAN, SARATHI, and eChallan portals under DPDP act.',
      icon: Shield,
    },
    {
      title: 'Multi-Agency Unified Dispatch',
      desc: 'Joint interface coordinating Fire tenders, NDRF disaster units, and trauma ambulances.',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              FUTURE VISION & GOVERNMENT IMPLEMENTATION ROADMAP
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Stage Strategic Evolution from Academic Prototype to State-Level Infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-sky-400 bg-sky-950/60 border border-sky-800/40 px-3 py-1.5 rounded-xl font-bold">
            PROPOSED STRATEGIC BLUEPRINT
          </span>
        </div>
      </div>

      {/* 5 Phases Roadmap */}
      <div className="space-y-4">
        {phases.map((p, idx) => (
          <div
            key={p.phase}
            className={`p-6 rounded-2xl border transition-all ${
              idx === 0
                ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/50 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-sky-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {p.phase}
                </span>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
              </div>

              <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${p.badge}`}>
                {p.status}
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">{p.desc}</p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {p.milestones.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 text-slate-300 text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Future Capabilities Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Potential Future Technical Capabilities
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Notice: These capabilities represent planned architectural extensions subject to government pilot sanction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureCapabilities.map((fc, i) => {
            const Icon = fc.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2 hover:border-sky-500/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-950 border border-sky-800/40 text-sky-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-white">{fc.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{fc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
