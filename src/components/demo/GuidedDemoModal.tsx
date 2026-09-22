import React, { useEffect, useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Sparkles,
  ShieldAlert,
  Siren,
  Activity,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface DemoStep {
  title: string;
  subtitle: string;
  description: string;
  targetView: string;
  action?: () => void;
}

export const GuidedDemoModal: React.FC = () => {
  const {
    isDemoTourActive,
    setIsDemoTourActive,
    demoStepIndex,
    setDemoStepIndex,
    setCurrentView,
    flagVehicleForOverspeedDemo,
    activateEmergencyCorridor,
    markControlPointClear,
    setSelectedViolation,
    violations,
    setSelectedVehicle,
    vehicles,
  } = useSimulation();

  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const demoSteps: DemoStep[] = [
    {
      title: 'Step 1 of 12: Normal Traffic Baseline',
      subtitle: 'Continuous Telemetry Ingestion (Bhimtal-Nainital Corridor)',
      description:
        'The command center ingests continuous simulated GPS/telemetry streams from 50+ vehicles across NH-87, Bhowali Ghat, and Nainital lake circuits. Real-time compliance monitoring is active.',
      targetView: 'overview',
      action: () => {
        setSelectedVehicle(null);
        setSelectedViolation(null);
      },
    },
    {
      title: 'Step 2 of 12: High-Speed Vehicle Ingress',
      subtitle: 'Vehicle UK07AB1234 Enters NH-87 Sector',
      description:
        'Telemetry engine tracks private vehicle UK07AB1234 accelerating sharply towards 118 km/h on an 80 km/h mountainous descent curve.',
      targetView: 'map',
      action: () => {
        const v = vehicles.find((x) => x.registrationNumber === 'UK07AB1234');
        if (v) setSelectedVehicle(v);
      },
    },
    {
      title: 'Step 3 of 12: Algorithmic Violation Detection',
      subtitle: 'Excess Speed Calculation (+38 km/h over limit)',
      description:
        'The SARTHI speed engine processes vehicle velocity against digital speed limit geometry and triggers a critical speed event with sustained duration.',
      targetView: 'speed',
      action: () => {
        flagVehicleForOverspeedDemo('UK07AB1234');
      },
    },
    {
      title: 'Step 4 of 12: High-Priority Red Alert Dispatched',
      subtitle: 'Automated Broadcast to Sector Traffic Marshals',
      description:
        'An immediate critical notification is queued with time-stamped location, speed delta, and telemetry confidence score.',
      targetView: 'speed',
    },
    {
      title: 'Step 5 of 12: Violation Evidence Compilation',
      subtitle: 'Automated Speed-Trace Profile & Forensic Packet',
      description:
        'Inspect the comprehensive evidence packet showing the speed-vs-time acceleration curve, road sector, and human-verification requirement banner.',
      targetView: 'speed',
      action: () => {
        if (violations.length > 0) {
          setSelectedViolation(violations[0]);
        }
      },
    },
    {
      title: 'Step 6 of 12: Habitual Repeat Offender Analysis',
      subtitle: 'Cross-Corridor Behavioral Analytics',
      description:
        'SARTHI aggregates historical telemetry. UK07AB1234 is identified as a persistent repeat violator with 7 recorded incidents across the district.',
      targetView: 'repeat',
      action: () => {
        setSelectedViolation(null);
      },
    },
    {
      title: 'Step 7 of 12: Emergency Call Received (Ambulance 108)',
      subtitle: 'Critical Cardiac Transit: Bhimtal to Nainital BD Pandey Hospital',
      description:
        'Emergency Operator receives distress transit alert for Ambulance UK07EM102 carrying an emergency patient needing immediate hospital admission.',
      targetView: 'emergency',
    },
    {
      title: 'Step 8 of 12: One-Click Green Corridor Activation',
      subtitle: 'Smart Traffic Signal & Marshal Coordination',
      description:
        'The operator clicks "ACTIVATE EMERGENCY CORRIDOR". A dedicated 16.4 km route is locked on GIS with active checkpoints at Bhimtal Chowk and Tallital Junction.',
      targetView: 'emergency',
      action: () => {
        activateEmergencyCorridor();
      },
    },
    {
      title: 'Step 9 of 12: On-Ground Traffic Marshals Alerted',
      subtitle: 'Checkpoint Dispatch to Assigned Officers',
      description:
        'Sub-Inspector M. Joshi at Bhimtal Chowk and ASI Rajesh Pant at Tallital receive priority audio-visual alerts and ETA countdowns on mobile consoles.',
      targetView: 'emergency',
    },
    {
      title: 'Step 10 of 12: Sequential Route Clearance',
      subtitle: 'Checkpoints Verified Clear & ETA Compression',
      description:
        'Officers clear traffic bottlenecks along the choke points. Bhimtal Chowk is marked CLEAR, saving 2 crucial minutes of travel time.',
      targetView: 'emergency',
      action: () => {
        markControlPointClear('CP-01');
        setTimeout(() => markControlPointClear('CP-02'), 1200);
      },
    },
    {
      title: 'Step 11 of 12: AI Predictive Safety & Heat Forecast',
      subtitle: 'Machine Learning Accident Risk Modeling',
      description:
        'AI engine visualizes the next 6-hour risk forecast, highlighting high-probability accident hot-spots along NH-87 Mile 14 and recommending patrol deployments.',
      targetView: 'ai',
    },
    {
      title: 'Step 12 of 12: Executive Road Safety Summary',
      subtitle: 'District & State Level Governance Impact',
      description:
        'Senior Officers review overall safety metrics: average emergency response times reduced from 22 mins to 9.2 mins, with 94.6% corridor clearance efficiency.',
      targetView: 'executive',
    },
  ];

  const currentStep = demoSteps[demoStepIndex];

  // Apply step changes
  useEffect(() => {
    if (!isDemoTourActive) return;
    if (currentStep) {
      setCurrentView(currentStep.targetView);
      if (currentStep.action) {
        currentStep.action();
      }
    }
  }, [demoStepIndex, isDemoTourActive]);

  // Autoplay progression
  useEffect(() => {
    if (!isDemoTourActive || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (demoStepIndex < demoSteps.length - 1) {
        setDemoStepIndex(demoStepIndex + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [isDemoTourActive, isAutoPlaying, demoStepIndex]);

  if (!isDemoTourActive) return null;

  const handleNext = () => {
    if (demoStepIndex < demoSteps.length - 1) {
      setDemoStepIndex(demoStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (demoStepIndex > 0) {
      setDemoStepIndex(demoStepIndex - 1);
    }
  };

  const handleExit = () => {
    setIsDemoTourActive(false);
    setSelectedViolation(null);
  };

  const isFinalStep = demoStepIndex === demoSteps.length - 1;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1300] w-[95%] max-w-4xl animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl border-2 border-sky-500/70 bg-slate-950/95 p-4 sm:p-5 shadow-2xl shadow-sky-950/80 backdrop-blur-xl">
        {/* Top Control Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-sky-400 font-mono">
              OFFICIAL GOVERNMENT PRESENTATION WALKTHROUGH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoPlaying ? 'Auto-Advancing (7s)' : 'Paused'}
            </button>

            <button
              onClick={handleExit}
              className="flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              EXIT DEMO
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 font-mono">{currentStep.title}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-200">{currentStep.subtitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={demoStepIndex === 0}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-3.5 h-3.5" />
              Prev
            </button>

            {isFinalStep ? (
              <button
                onClick={handleExit}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/60"
              >
                <CheckCircle2 className="w-4 h-4" />
                COMPLETE DEMO
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-950/60"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 h-full transition-all duration-500 ease-out"
            style={{ width: `${((demoStepIndex + 1) / demoSteps.length) * 100}%` }}
          />
        </div>

        {/* Finale Banner if at end */}
        {isFinalStep && (
          <div className="mt-3 p-2 text-center rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-semibold animate-pulse">
            “FROM DETECTION TO RESPONSE — ONE INTELLIGENT ROAD SAFETY PLATFORM”
          </div>
        )}
      </div>
    </div>
  );
};
