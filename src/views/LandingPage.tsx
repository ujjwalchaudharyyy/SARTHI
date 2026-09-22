import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Zap,
  Radio,
  Siren,
  Gauge,
  MapPin,
  TrendingDown,
  Building2,
  ChevronRight,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  RotateCcw,
  BrainCircuit,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsDemoTourActive, setDemoStepIndex } = useSimulation();
  const { isAuthenticated } = useAuth();

  const handleEnterCommand = () => {
    if (isAuthenticated) {
      setCurrentView('overview');
    } else {
      setCurrentView('login');
    }
  };

  const handleStartDemo = () => {
    setCurrentView('overview');
    setDemoStepIndex(0);
    setIsDemoTourActive(true);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 border border-blue-500/40 shadow-lg shadow-blue-950">
              <Shield className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <span className="font-mono text-xl font-black tracking-wider text-white">SARTHI <span className="text-amber-400 font-sans font-bold">सारथी</span></span>
              <span className="ml-2 rounded bg-sky-950 border border-sky-800/60 px-2 py-0.5 text-[10px] font-mono text-sky-300 font-bold uppercase">
                Gov Tech System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDemo}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-950/50 hover:bg-sky-900/50 px-4 py-2 text-xs font-bold text-sky-300 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              WATCH LIVE DEMO
            </button>

            <button
              onClick={handleEnterCommand}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-sky-950 transition-all hover:scale-105"
            >
              OFFICER LOGIN / PORTAL
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-sky-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/60 px-4 py-1.5 text-xs font-mono text-sky-300 mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            State Automated Response & Traffic Highway Infrastructure
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-mono leading-tight">
            SARTHI <span className="text-amber-400 font-sans">सारथी</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200">
            “Detect Faster. Respond Smarter. Save Lives.”
          </p>

          <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Transforming real-time traffic intelligence into faster decisions, safer highway corridors, and rapid green corridor emergency response across national transit routes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleEnterCommand}
              className="flex items-center gap-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-sky-950/80 transition-all hover:scale-105"
            >
              ENTER COMMAND CENTER
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 shadow-xl transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              WATCH LIVE DEMO (12 STEPS)
            </button>
          </div>

          {/* Academic Badge */}
          <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Developed by</span>
            <strong className="text-slate-200 font-bold">Team Tech4ALL (Lead: Ujjwal Chaudhary)</strong>
            <span>•</span>
            <span className="text-sky-400">Graphic Era Hill University, Bhimtal</span>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/80 p-2 sm:p-4 shadow-2xl shadow-blue-950/60 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 px-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-400">SITCC Command View • Bhimtal-Nainital Corridor</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">52 Telemetry Feeds Active</span>
            </div>

            {/* Simulated Live Grid Preview */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 p-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Monitored Vehicles</span>
                  <Gauge className="w-4 h-4 text-sky-400" />
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-white">12,486</div>
                <div className="text-[11px] text-emerald-400 mt-1">Live Telemetry Ingestion</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Overspeed Violations</span>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-red-400">328</div>
                <div className="text-[11px] text-red-300 mt-1">NH-87 Mountain Sector</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Emergency Corridors</span>
                  <Siren className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-cyan-400">7 Active</div>
                <div className="text-[11px] text-cyan-300 mt-1">Avg Clearance: 9.2 min</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>High-Risk Road Sectors</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-amber-400">23</div>
                <div className="text-[11px] text-amber-300 mt-1">Predictive AI Monitored</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & The Solution */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem */}
          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-mono font-bold">
              THE REAL-WORLD PROBLEM
            </div>
            <h3 className="mt-4 text-xl sm:text-2xl font-bold text-white">
              Fragmented Traffic Enforcement & Delayed Emergency Transit
            </h3>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Dangerous Hill Overspeeding:</strong> Steep mountainous curves along NH-87 & Bhowali experience fatal overspeed events without unified real-time speed monitoring.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Emergency Ambulance Delays:</strong> Critical patients travelling from Bhimtal to Nainital District Hospital face traffic gridlocks without automated signal coordination.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Siloed Departmental Data:</strong> Police, Traffic Marshals, and Emergency 108 lack a shared real-time situational dashboard.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="rounded-2xl border border-sky-900/30 bg-sky-950/10 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/50 text-sky-400 text-xs font-mono font-bold">
              THE SARTHI ARCHITECTURE
            </div>
            <h3 className="mt-4 text-xl sm:text-2xl font-bold text-white">
              Intelligent Unified Command & Coordinated Corridors
            </h3>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Automated Overspeed Detection:</strong> Instant velocity evaluation against digital limit maps with forensic speed-vs-time evidence compilation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>One-Click Emergency Green Corridor:</strong> Real-time GPS tracking of ambulances, automatic checkpoint alerts, and sequential road clearance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>AI Risk & Hotspot Analytics:</strong> Predictive 6-hour danger forecasts to proactively deploy traffic marshals before accidents occur.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            Engineered for Modern Government Command Centers
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: Gauge,
                title: 'Speed Intelligence Engine',
                desc: 'Continuous telemetry ingestion calculates excess speeds, durations, and produces evidentiary records.',
              },
              {
                icon: Siren,
                title: 'Smart Emergency Corridors',
                desc: 'One-click route locking from Bhimtal to Nainital District Hospital with live checkpoint clearance toggles.',
              },
              {
                icon: RotateCcw,
                title: 'Habitual Offender Analytics',
                desc: 'Cross-corridor tracking flags repeated violators across days, vehicle classes, and high-risk hours.',
              },
              {
                icon: Radio,
                title: 'Stolen Vehicle Inquiry Desk',
                desc: 'Dedicated police investigation portal with automated telemetry correlation and incident case files.',
              },
              {
                icon: Shield,
                title: 'Incident Command Center',
                desc: 'Real-time workflow for Accidents, Road Hazards, and Jams with status advancement from New to Resolved.',
              },
              {
                icon: BrainCircuit,
                title: 'Predictive AI Risk Modeling',
                desc: '6-hour road risk forecasts, high-risk sector heat indices, and automated patrol deployment recommendations.',
              },
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-sky-500/50 transition-all hover:bg-slate-900/90 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950 border border-sky-800/40 text-sky-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 text-base font-bold text-white">{cap.title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Four Major Impact Cards */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              MEASURABLE GOVERNANCE VALUE
            </span>
            <h2 className="mt-2 text-3xl font-black text-white">Four Pillars of Societal Impact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <span className="text-xs font-mono font-bold text-emerald-400">PILLAR 01</span>
              <h3 className="mt-2 text-lg font-bold text-white">SAFER ROADS</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Continuous digital speed surveillance discourages fatal high-speed runs on treacherous curves and reduces head-on collisions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <span className="text-xs font-mono font-bold text-cyan-400">PILLAR 02</span>
              <h3 className="mt-2 text-lg font-bold text-white">FASTER EMERGENCY RESPONSE</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Green corridor coordination cuts ambulance travel times by up to 58%, securing the critical golden hour for cardiac and trauma patients.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <span className="text-xs font-mono font-bold text-sky-400">PILLAR 03</span>
              <h3 className="mt-2 text-lg font-bold text-white">SMARTER ENFORCEMENT</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Shifts police resources from arbitrary manual checkpoints to data-backed, automated telemetry evidence with forensic traces.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <span className="text-xs font-mono font-bold text-purple-400">PILLAR 04</span>
              <h3 className="mt-2 text-lg font-bold text-white">DATA-DRIVEN GOVERNANCE</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Empowers transport secretaries and district magistrates with empirical risk indices, downloadable reports, and predictive safety models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Tech4ALL Showcase */}
      <section className="py-20 px-4 sm:px-8 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 mb-4">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            STUDENT INNOVATION INITIATIVE
          </div>
          <h2 className="text-3xl font-black text-white">TEAM TECH4ALL</h2>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto">
            “We are a five-member student development team working to transform a real-world road-safety problem into a scalable technology solution.”
          </p>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white font-mono shadow-lg">
                UC
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Ujjwal Chaudhary</h4>
                <p className="text-xs font-mono text-sky-400">Team Lead • B.Tech CSE (AI-ML)</p>
                <p className="text-xs text-slate-400 mt-1">Graphic Era Hill University, Bhimtal</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
              <div>Phone: <span className="text-white">+91 88680 59861</span></div>
              <div>Email: <span className="text-white">ujjwalchaudhary2007@gmail.com</span></div>
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <p className="text-[11px] text-slate-500 font-mono">
                Team Composition: 5 Student Developers (Lead, Frontend/GIS, AI/Simulation, Data Systems, Quality & Systems Architecture).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-8 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 to-blue-950/40 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white">Ready for Official Demonstration?</h2>
          <p className="mt-3 text-sm text-slate-300">
            Launch the live interactive command center now or run the 12-step guided government presentation mode.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleEnterCommand}
              className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-sky-950 transition-all hover:scale-105"
            >
              LAUNCH COMMAND CENTER
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              RUN GUIDED WALKTHROUGH
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
