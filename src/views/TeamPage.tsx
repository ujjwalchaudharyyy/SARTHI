import React from 'react';
import {
  Users,
  Award,
  University,
  Mail,
  Phone,
  Code2,
  Cpu,
  Database,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const members = [
    {
      role: 'Team Lead & Full-Stack / AI Architect',
      name: 'Ujjwal Chaudhary',
      department: 'B.Tech CSE (AI-ML)',
      institution: 'Graphic Era Hill University, Bhimtal',
      contact: 'ujjwalchaudhary2007@gmail.com',
      phone: '+91 88680 59861',
      responsibilities:
        'System architecture, simulation engine logic, GIS mapping integration, government command center design, and full-stack implementation.',
      isLead: true,
      initials: 'UC',
    },
    {
      role: 'Frontend & GIS Map Engineer',
      name: 'Member 2',
      department: 'B.Tech Computer Science & Engineering',
      institution: 'Graphic Era Hill University, Bhimtal',
      responsibilities:
        'Leaflet GIS mapping, dynamic polylines, vehicle telemetry icons, and responsive command center UX.',
      initials: 'M2',
    },
    {
      role: 'AI / ML & Simulation Systems Engineer',
      name: 'Member 3',
      department: 'B.Tech Computer Science & Engineering',
      institution: 'Graphic Era Hill University, Bhimtal',
      responsibilities:
        'Speed violation algorithmic engine, probabilistic risk forecasting formulas, and corridor clearance math.',
      initials: 'M3',
    },
    {
      role: 'Database & API Gateway Engineer',
      name: 'Member 4',
      department: 'B.Tech Computer Science & Engineering',
      institution: 'Graphic Era Hill University, Bhimtal',
      responsibilities:
        'Audit trail logging, mock data pipelines, statutory CSV generator schemas, and state architecture.',
      initials: 'M4',
    },
    {
      role: 'QA, Cybersecurity & Policy Analyst',
      name: 'Member 5',
      department: 'B.Tech Computer Science & Engineering',
      institution: 'Graphic Era Hill University, Bhimtal',
      responsibilities:
        'Role-based access verification, statutory disclaimer compliance, interface stress testing, and government presentation documentation.',
      initials: 'M5',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              TEAM TECH4ALL — INNOVATION INITIATIVE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            5 Student Developers • Graphic Era Hill University, Bhimtal Campus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-sky-400 bg-sky-950/60 border border-sky-800/40 px-3 py-1.5 rounded-xl font-bold">
            ACADEMIC INNOVATION
          </span>
        </div>
      </div>

      {/* Team Statement Banner */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 p-6 shadow-xl text-center space-y-2">
        <Sparkles className="w-6 h-6 text-sky-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-black text-white">
          “We are a five-member student development team working to transform a real-world road-safety problem into a scalable technology solution.”
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Inspired by the hazardous curves and critical emergency transit delays in the Nainital and Bhimtal mountain sectors of Uttarakhand.
        </p>
      </div>

      {/* Team Lead Profile Highlight */}
      <div className="rounded-2xl border border-sky-500/50 bg-slate-900/80 p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-700 to-indigo-700 font-mono text-2xl font-black text-white shadow-xl shadow-sky-950">
              UC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Ujjwal Chaudhary</h3>
                <span className="rounded bg-sky-950 border border-sky-800/60 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300 uppercase">
                  TEAM LEAD
                </span>
              </div>
              <p className="text-xs font-mono text-sky-400 mt-0.5">B.Tech CSE (AI-ML)</p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <University className="w-3.5 h-3.5 text-slate-500" />
                Graphic Era Hill University, Bhimtal Campus
              </p>
            </div>
          </div>

          {/* Lead Contacts */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <a
              href="mailto:ujjwalchaudhary2007@gmail.com"
              className="flex items-center gap-1.5 text-sky-400 hover:underline"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              ujjwalchaudhary2007@gmail.com
            </a>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-4 h-4 text-slate-400" />
              +91 88680 59861
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          <strong>Lead Architecture & Systems Rationale:</strong> Architected the SARTHI centralized command engine, implementing simulated multi-vehicle telemetry, real-time overspeed mathematical thresholds, vehicle telemetry enrollment, medical emergency dispute adjudication, emergency corridor route clearance logic, forensic evidence charting, and government-grade command UI.
        </p>
      </div>

      {/* Team Members Grid (Members 2 to 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.slice(1).map((member, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 font-mono text-sm font-bold text-slate-300">
                  {member.initials}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Tech4ALL</span>
              </div>

              <h4 className="mt-3 text-base font-bold text-white">{member.name}</h4>
              <p className="text-[11px] font-mono text-sky-400 mt-0.5">{member.role}</p>
              <p className="text-[10px] text-slate-400 mt-1">{member.institution}</p>

              <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-800/80 pt-2.5">
                {member.responsibilities}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              Graphic Era Hill University
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
