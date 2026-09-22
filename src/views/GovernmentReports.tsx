import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  FileSpreadsheet,
  Download,
  Eye,
  Printer,
  Calendar,
  CheckCircle2,
  FileText,
  X,
  Shield,
} from 'lucide-react';

interface ReportDefinition {
  id: string;
  title: string;
  category: string;
  period: string;
  generatedDate: string;
  recordsCount: number;
  description: string;
  generateCSV: () => string;
}

export const GovernmentReports: React.FC = () => {
  const { vehicles, violations, emergencyCorridor, incidents, addAuditLog } = useSimulation();
  const [previewReport, setPreviewReport] = useState<ReportDefinition | null>(null);

  const reports: ReportDefinition[] = [
    {
      id: 'REP-TRF-01',
      title: 'Daily Traffic Density & Speed Compliance Report',
      category: 'TRAFFIC REGULATION',
      period: 'Today (Past 24 Hours)',
      generatedDate: '2026-09-22 22:30',
      recordsCount: 12486,
      description:
        'Corridor telemetry summary across Bhimtal, Bhowali and Nainital containing vehicle counts, median speed, and compliance ratios.',
      generateCSV: () => {
        return [
          'REPORT: DAILY TRAFFIC DENSITY AND COMPLIANCE',
          'GOVERNMENT OF UTTARAKHAND - SITCC COMMAND',
          'DEMONSTRATION SIMULATED DATA',
          'Corridor,Total Vehicles,Median Speed (km/h),Compliance Rate,Peak Hour',
          'NH-87 Kathgodam-Bhimtal,6820,68,88.4%,18:00 - 20:00',
          'Bhowali Ghat Road,3410,54,91.2%,14:00 - 16:00',
          'Tallital Mall Road,1420,38,94.8%,11:00 - 13:00',
          'Bhimtal Lake Perimeter,836,42,96.1%,16:00 - 18:00',
        ].join('\n');
      },
    },
    {
      id: 'REP-VIO-02',
      title: 'Overspeed Violation Forensic Dossier',
      category: 'ENFORCEMENT AUDIT',
      period: 'Active Week (Rolling 7 Days)',
      generatedDate: '2026-09-22 21:45',
      recordsCount: 328,
      description:
        'Comprehensive log of recorded speed events exceeding statutory road limits, excess velocity brackets, and review verification statuses.',
      generateCSV: () => {
        const rows = violations.map(
          (v) =>
            `${v.id},${v.vehicleRegistration},${v.vehicleType},${v.road},${v.recordedSpeed},${v.speedLimit},+${v.excessSpeed},${v.durationSeconds}s,${v.status},${v.timestamp}`
        );
        return [
          'REPORT: OVERSPEED VIOLATION FORENSIC DOSSIER',
          'UTTARAKHAND TRAFFIC COMMAND - SIMULATED TELEMETRY',
          'Event ID,Registration,Vehicle Type,Road Sector,Recorded Speed,Limit,Excess,Duration,Status,Timestamp',
          ...rows,
        ].join('\n');
      },
    },
    {
      id: 'REP-EMG-03',
      title: 'Emergency Corridor Performance & Clearance Audit',
      category: 'EMERGENCY TRANSIT',
      period: 'Monthly Summary (September 2026)',
      generatedDate: '2026-09-22 20:00',
      recordsCount: 42,
      description:
        'Response time telemetry for 108 Ambulances, Fire Tenders and Disaster Response convoys showing ETA improvements and checkpoint clearance intervals.',
      generateCSV: () => {
        return [
          'REPORT: EMERGENCY CORRIDOR TRANSIT AND CLEARANCE AUDIT',
          'DEPARTMENT OF HEALTH & TRAFFIC POLICE COORDINATION',
          'Corridor ID,Emergency Vehicle,Origin,Destination,Distance Km,Standard ETA,SARTHI Green ETA,Time Saved,Clearance Status',
          'EC-NAI-2026-042,UK07EM102,Bhimtal CHC,BD Pandey Nainital,16.4,22 min,9 min,13 min,CLEAR',
          'EC-NAI-2026-041,UK04EM088,Bhowali Health Post,District Hospital,11.2,18 min,7 min,11 min,CLEAR',
          'EC-NAI-2026-040,UK07FT501,Kathgodam Fire Station,Bhimtal Pine,14.8,24 min,12 min,12 min,CLEAR',
        ].join('\n');
      },
    },
    {
      id: 'REP-INC-04',
      title: 'Incident & Road Hazard Resolution Log',
      category: 'DISASTER & SAFETY',
      period: 'Past 14 Days',
      generatedDate: '2026-09-22 19:30',
      recordsCount: 18,
      description:
        'Incident management metrics covering vehicular collisions, rockfall debris, traffic jams, and departmental response turnaround intervals.',
      generateCSV: () => {
        const rows = incidents.map(
          (i) => `${i.id},"${i.title}",${i.type},${i.priority},"${i.location}",${i.assignedUnit},${i.status},${i.timestamp}`
        );
        return [
          'REPORT: INCIDENT AND ROAD HAZARD RESOLUTION LOG',
          'STATE DISASTER MANAGEMENT & TRAFFIC POLICE',
          'Incident ID,Title,Type,Priority,Location,Assigned Unit,Status,Logged Timestamp',
          ...rows,
        ].join('\n');
      },
    },
    {
      id: 'REP-RSK-05',
      title: 'High-Risk Road Blackspot Diagnostic Report',
      category: 'CIVIL & INFRASTRUCTURE',
      period: 'Quarterly Infrastructure Review',
      generatedDate: '2026-09-20 10:00',
      recordsCount: 23,
      description:
        'Identification of high-probability accident blackspots, gradient hazards, and geometric engineering recommendations for PWD and Transport Dept.',
      generateCSV: () => {
        return [
          'REPORT: HIGH-RISK ROAD BLACKSPOT DIAGNOSTIC REPORT',
          'PUBLIC WORKS DEPARTMENT & TRAFFIC SAFETY DIRECTORATE',
          'Zone ID,Road Corridor,Risk Score,Historical Accidents,Overspeed Density,Primary Topographic Hazard,Recommended Engineering Action',
          'RZ-NH87,NH-87 Kathgodam-Bhimtal Mile 14,87/100,9,142 Events,Descending Hairpin Curve,Install rumble strips & high-friction anti-skid surfacing',
          'RZ-BHOWALI,Bhowali Ghat Road Niglat,74/100,5,88 Events,Narrow Shoulder & Fog,Erect solar-powered high-visibility reflector poles',
          'RZ-TALLITAL,Tallital Lake Perimeter,61/100,2,38 Events,Pedestrian Tourist Spillover,Deploy automated pedestrian safety beacons',
        ].join('\n');
      },
    },
    {
      id: 'REP-STL-06',
      title: 'Stolen Vehicle Telemetry Investigation Register',
      category: 'POLICE INVESTIGATION',
      period: 'Year-to-Date (2026)',
      generatedDate: '2026-09-21 16:45',
      recordsCount: 14,
      description:
        'Audit trail of license plate hits, simulated sensor correlations, and inter-district intercept operations coordinated via police command.',
      generateCSV: () => {
        return [
          'REPORT: STOLEN VEHICLE TELEMETRY INVESTIGATION REGISTER',
          'POLICE HEADQUARTERS - INVESTIGATION WING',
          'Case ID,Registration Number,Make Model,Color,Police Station,Reported Date,Last Known Sector,Status',
          'SV-2026-00481,UK07ST9981,Hyundai Creta 1.5D,Metallic Silver,Tallital Police Station,2026-09-20,Bhowali Road Pine Crest,LOCATED_SIMULATED',
          'SV-2026-00392,DL03XY4412,Tata 407 Flatbed,Commercial Yellow,Kathgodam Kotwali,2026-09-18,Gaula Barrage Bypass,ACTIVE_SEARCH',
          'SV-2026-00511,UP14MK8876,Yamaha FZ-S 150,Midnight Black,Mallital Chowki,2026-09-21,Tallital Mall Road,INTERCEPT_COORDINATED',
        ].join('\n');
      },
    },
  ];

  const handleDownloadCSV = (rep: ReportDefinition) => {
    const csvData = rep.generateCSV();
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARTHI_${rep.id}_${rep.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('REPORT_CSV_DOWNLOADED', `Report ${rep.id} (${rep.title})`);
  };

  const handlePrint = (rep: ReportDefinition) => {
    addAuditLog('REPORT_PRINT_TRIGGERED', `Report ${rep.id}`);
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              GOVERNMENT STATUTORY REPORTS & DATA EXPORTS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Downloadable executive audits, speed dossiers and departmental accountability logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl font-bold">
            EXPORT READY (CSV / PRINT)
          </span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                  {rep.id}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {rep.category}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-white leading-snug">{rep.title}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{rep.description}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {rep.period}
                </span>
                <span className="text-slate-300 font-bold">{rep.recordsCount.toLocaleString()} Entries</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>

                <button
                  onClick={() => handleDownloadCSV(rep)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-sky-600 hover:bg-sky-500 py-2 text-xs font-bold text-white shadow-md shadow-sky-950 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>

                <button
                  onClick={() => handlePrint(rep)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-300 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/50">
                  {previewReport.id} • {previewReport.category}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">{previewReport.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Generated: {previewReport.generatedDate} • Coverage: {previewReport.period}
                </p>
              </div>

              <button
                onClick={() => setPreviewReport(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CSV Raw / Table Preview */}
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 overflow-x-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {previewReport.generateCSV()}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-[11px] font-mono text-amber-400">
                Official Report Document • Simulated Telemetry
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadCSV(previewReport)}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-950"
                >
                  <Download className="w-3.5 h-3.5" />
                  DOWNLOAD CSV
                </button>
                <button
                  onClick={() => handlePrint(previewReport)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  PRINT REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
