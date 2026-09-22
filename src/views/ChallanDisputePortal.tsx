import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useAuth } from '../context/AuthContext';
import { ChallanDispute } from '../types';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Shield,
  Hospital,
  Clock,
  User,
  Phone,
  Eye,
  Download,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const ChallanDisputePortal: React.FC = () => {
  const {
    disputes,
    violations,
    submitChallanDispute,
    reviewChallanDispute,
    setSelectedViolation,
  } = useSimulation();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'OFFICER_DESK' | 'CITIZEN_SUBMIT'>('OFFICER_DESK');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(
    disputes.length > 0 ? disputes[0].id : ''
  );

  // Citizen Form State
  const [selectedViolationId, setSelectedViolationId] = useState<string>(
    violations.length > 0 ? violations[0].id : ''
  );
  const [applicantName, setApplicantName] = useState('Suresh Chandra Joshi');
  const [applicantPhone, setApplicantPhone] = useState('+91 94120 48812');
  const [disputeType, setDisputeType] = useState<ChallanDispute['disputeType']>('MEDICAL_EMERGENCY');
  const [narrativeReason, setNarrativeReason] = useState(
    'My 68-year-old father suffered acute cardiac distress at our Bhimtal residence. Rushed him to BD Pandey Memorial Hospital, Nainital for emergency ICU admission.'
  );
  const [hospitalName, setHospitalName] = useState('BD Pandey Memorial District Hospital, Nainital');
  const [doctorName, setDoctorName] = useState('Dr. K. N. Pant (Chief Medical Officer)');
  const [documentName, setDocumentName] = useState('Emergency_ICU_Admission_Slip_BDP.pdf');
  const [submissionSuccess, setSubmissionSuccess] = useState<ChallanDispute | null>(null);

  // Officer Review Box State
  const [officerRemarks, setOfficerRemarks] = useState(
    'Verified medical emergency admission with Casualty Department. Emergency life-saving transit confirmed. Exemption granted under MV Act 2019 Sec 134/200.'
  );

  const activeDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0];
  const matchingViolation = violations.find(
    (v) =>
      activeDispute &&
      (v.id === activeDispute.violationId || v.vehicleRegistration === activeDispute.vehicleRegistration)
  );

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVio = violations.find((v) => v.id === selectedViolationId) || violations[0];

    const newDisp = submitChallanDispute({
      violationId: targetVio.id,
      vehicleRegistration: targetVio.vehicleRegistration,
      applicantName,
      applicantPhone,
      disputeType,
      narrativeReason,
      hospitalName: disputeType === 'MEDICAL_EMERGENCY' ? hospitalName : undefined,
      doctorName: disputeType === 'MEDICAL_EMERGENCY' ? doctorName : undefined,
      documentName,
    });

    setSubmissionSuccess(newDisp);
    setSelectedDisputeId(newDisp.id);
  };

  const handleOfficerApprove = () => {
    if (!activeDispute) return;
    const reviewer = user ? `${user.name} (${user.badgeId})` : 'Insp. R. S. Negi (DEMO001)';
    reviewChallanDispute(activeDispute.id, 'APPROVE', officerRemarks, reviewer);
  };

  const handleOfficerReject = () => {
    if (!activeDispute) return;
    const reviewer = user ? `${user.name} (${user.badgeId})` : 'Insp. R. S. Negi (DEMO001)';
    const rejectRemarks = officerRemarks || 'Document verification failed: Telemetry timestamp does not match hospitalization window.';
    reviewChallanDispute(activeDispute.id, 'REJECT', rejectRemarks, reviewer);
  };

  const handleDownloadWaiver = () => {
    if (!activeDispute) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'SARTHI STATUTORY EXEMPTION & CHALLAN WAIVER CERTIFICATE',
        'STATE INTEGRATED TRAFFIC COMMAND - UTTARAKHAND',
        `Dispute Token ID,${activeDispute.id}`,
        `Vehicle Registration,${activeDispute.vehicleRegistration}`,
        `Violation Reference,${activeDispute.violationId}`,
        `Applicant Name,${activeDispute.applicantName}`,
        `Exemption Grounds,${activeDispute.disputeType.replace('_', ' ')}`,
        `Hospital / Medical Facility,${activeDispute.hospitalName || 'N/A'}`,
        `Attending Physician / CMO,${activeDispute.doctorName || 'N/A'}`,
        `Submitted Document,${activeDispute.documentName}`,
        `Adjudication Status,${activeDispute.status}`,
        `Adjudicating Officer,${activeDispute.reviewedBy || 'Authorized Officer'}`,
        `Adjudication Timestamp,${activeDispute.reviewTimestamp || new Date().toISOString()}`,
        `Statutory Order,Penalty Revoked to Rs. 0 under Section 134/200 Motor Vehicles Act`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARTHI_WAIVER_${activeDispute.vehicleRegistration}_${activeDispute.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Dual-Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              CHALLAN DISPUTE & MEDICAL EMERGENCY EXEMPTION DESK
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Humanitarian medical emergency verification & statutory penalty adjudication portal
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('OFFICER_DESK')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'OFFICER_DESK'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Officer Verification Desk ({disputes.filter((d) => d.status === 'PENDING_REVIEW').length} Pending)
          </button>

          <button
            onClick={() => setActiveTab('CITIZEN_SUBMIT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'CITIZEN_SUBMIT'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + File Medical Exemption
          </button>
        </div>
      </div>

      {/* MODE 1: OFFICER VERIFICATION DESK */}
      {activeTab === 'OFFICER_DESK' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Queue of Disputes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                Grievance Adjudication Queue
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 font-bold">
                {disputes.length} CASES
              </span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {disputes.map((disp) => {
                const isSelected = activeDispute && activeDispute.id === disp.id;
                const isPending = disp.status === 'PENDING_REVIEW';
                const isApproved = disp.status === 'APPROVED_WAIVED';

                return (
                  <div
                    key={disp.id}
                    onClick={() => setSelectedDisputeId(disp.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-950 border-sky-500 shadow-md shadow-sky-950/60'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {disp.vehicleRegistration}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : isPending
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/50 animate-pulse'
                            : 'bg-red-950 text-red-400 border border-red-800/50'
                        }`}
                      >
                        {disp.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {disp.disputeType.replace('_', ' ')}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      Applicant: {disp.applicantName}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5">
                      <span>{disp.id}</span>
                      <span>{disp.submissionTimestamp.slice(11, 16)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Dispute Deep Dive & Telemetry Correlation */}
          {activeDispute && (
            <div className="lg:col-span-2 space-y-6">
              {/* Evidence & Case Dossier Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded border border-sky-800/50">
                        {activeDispute.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                          activeDispute.status === 'APPROVED_WAIVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : activeDispute.status === 'PENDING_REVIEW'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                            : 'bg-red-950 text-red-400 border border-red-800/50'
                        }`}
                      >
                        {activeDispute.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h2 className="mt-2 font-mono text-2xl font-black text-white">
                      {activeDispute.vehicleRegistration}
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Applicant: <strong className="text-white">{activeDispute.applicantName}</strong> ({activeDispute.applicantPhone})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Statutory Penalty</span>
                    <div className="font-mono text-xl font-bold">
                      {matchingViolation?.status === 'WAIVED_MEDICAL_EMERGENCY' ? (
                        <span className="text-emerald-400 line-through">₹2,000 <span className="no-underline text-emerald-300 font-bold ml-1">(WAIVED ₹0)</span></span>
                      ) : (
                        <span className="text-red-400">₹{matchingViolation?.penaltyAmount || 2000}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Narrative Description */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                    Applicant's Sworn Emergency Circumstance:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    “{activeDispute.narrativeReason}”
                  </p>
                </div>

                {/* Hospital & Medical Particulars (if Medical Emergency) */}
                {activeDispute.hospitalName && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <Hospital className="w-4 h-4 text-cyan-400" />
                        Medical Facility & Ward
                      </div>
                      <p className="text-slate-300 font-medium">{activeDispute.hospitalName}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <User className="w-4 h-4 text-purple-400" />
                        Treating Physician / CMO
                      </div>
                      <p className="text-slate-300 font-medium">{activeDispute.doctorName}</p>
                    </div>
                  </div>
                )}

                {/* Document Slip Visual Preview */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-dashed border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      Uploaded Verification Document: <span className="text-sky-400 font-mono">{activeDispute.documentName}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      DIGITAL COPY ATTACHED
                    </span>
                  </div>

                  {/* Simulated Document Certificate Box */}
                  <div className="rounded-lg bg-slate-900 border border-slate-800 p-3.5 text-xs text-slate-300 font-mono space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-[11px] text-slate-400">
                      <span>FACILITY: BD PANDEY MEMORIAL DISTRICT HOSPITAL</span>
                      <span>CASUALTY WARD ICU</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Patient: <strong className="text-white">Govind Ballabh Joshi (Age: 68 M)</strong> | Admitted: 21:55 PM
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Diagnosis: Acute Inferior Wall Myocardial Infarction. Emergency ICU triage protocol mobilized.
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-emerald-400">
                      <span>✓ Official Casualty Hospital Stamp Applied</span>
                      <span>Verified Telemetry Match (+32 km/h on NH-87)</span>
                    </div>
                  </div>
                </div>

                {/* Speed Telemetry Trace */}
                {matchingViolation && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">
                        Speed Trace Profile at Offense Time ({matchingViolation.road})
                      </span>
                      <span className="font-mono text-slate-400">
                        Recorded: <strong className="text-red-400">{matchingViolation.recordedSpeed} km/h</strong> (Limit: {matchingViolation.speedLimit} km/h)
                      </span>
                    </div>

                    <div className="h-44 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={matchingViolation.telemetryHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                          <YAxis stroke="#64748b" domain={[50, 130]} tick={{ fontSize: 10 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              border: '1px solid #334155',
                              borderRadius: '8px',
                              fontSize: '11px',
                            }}
                          />
                          <ReferenceLine
                            y={matchingViolation.speedLimit}
                            stroke="#ef4444"
                            strokeDasharray="3 3"
                            label={{ value: 'Limit', fill: '#ef4444', fontSize: 10 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="speed"
                            stroke="#38bdf8"
                            strokeWidth={2.5}
                            dot={{ fill: '#38bdf8', r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Adjudication Decision Panel */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-200 uppercase">
                    Adjudicating Officer's Findings & Statutory Remarks:
                  </label>
                  <textarea
                    rows={2}
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    placeholder="Enter verification findings and statutory section applied..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {activeDispute.status === 'APPROVED_WAIVED' && (
                        <button
                          onClick={handleDownloadWaiver}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-900/50 text-xs font-bold text-emerald-300 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Waiver Certificate (CSV)
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOfficerReject}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-700/60 bg-red-950/40 hover:bg-red-900/60 text-xs font-bold text-red-300 transition-colors shadow-md"
                      >
                        <XCircle className="w-4 h-4" />
                        REJECT DISPUTE (ENFORCE)
                      </button>

                      <button
                        onClick={handleOfficerApprove}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        APPROVE EXEMPTION & WAIVE CHALLAN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: CITIZEN DISPUTE SUBMISSION PORTAL */}
      {activeTab === 'CITIZEN_SUBMIT' && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-sky-400" />
              Contest an Automated Speed Challan / Claim Medical Exemption
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              If your vehicle exceeded the speed limit due to a bona fide life-threatening medical emergency or emergency rescue transit, upload supporting medical casualty documents for executive review.
            </p>
          </div>

          {submissionSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                Grievance Case Token #{submissionSuccess.id} Successfully Queued!
              </div>
              <p className="text-slate-300">
                Your medical exemption claim for vehicle <strong className="text-white">{submissionSuccess.vehicleRegistration}</strong> has been transmitted to the SARTHI Command Center Officer Adjudication Desk.
              </p>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setActiveTab('OFFICER_DESK');
                }}
                className="mt-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
              >
                View in Officer Desk →
              </button>
            </div>
          )}

          <form onSubmit={handleCitizenSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Select Violation / Target Vehicle *
              </label>
              <select
                value={selectedViolationId}
                onChange={(e) => setSelectedViolationId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                {violations.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} — {v.vehicleRegistration} ({v.recordedSpeed} km/h on {v.road}) [₹{v.penaltyAmount}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Applicant Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Suresh Chandra Joshi"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Contact Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+91 94120 •••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Grounds for Contest / Exemption *
              </label>
              <select
                value={disputeType}
                onChange={(e) => setDisputeType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                <option value="MEDICAL_EMERGENCY">Medical Emergency (Patient Hospitalization / Acute Transit)</option>
                <option value="DUTY_EXEMPTION">Emergency First Responder / Authorized Public Duty</option>
                <option value="CALIBRATION_DISPUTE">Disputed Speed / Obscured Regulatory Road Sign</option>
                <option value="VEHICLE_MISIDENTIFIED">Cloned Number Plate / Vehicle Misidentification</option>
              </select>
            </div>

            {disputeType === 'MEDICAL_EMERGENCY' && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Hospital className="w-4 h-4" /> Hospital Particulars
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Hospital / Trauma Center Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. BD Pandey Memorial Hospital"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Attending Doctor / CMO Name
                    </label>
                    <input
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. K. N. Pant"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Detailed Narrative Statement of Emergency *
              </label>
              <textarea
                rows={3}
                required
                value={narrativeReason}
                onChange={(e) => setNarrativeReason(e.target.value)}
                placeholder="Explain the circumstances that necessitated exceeding statutory speed limit..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-sans"
              />
            </div>

            {/* Document Upload Simulation */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Upload Medical Certificate / Hospital Admission Proof *
              </label>
              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950 text-center space-y-2">
                <Upload className="w-6 h-6 text-sky-400 mx-auto" />
                <div className="text-xs text-slate-300">
                  Attached: <strong className="text-sky-400 font-mono">{documentName}</strong>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDocumentName('Emergency_ICU_Admission_Slip_BDP_0922.pdf')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-sky-300 border border-slate-700"
                  >
                    Sample: BD Pandey Cardiology Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentName('Pediatric_Casualty_Admission_Card.pdf')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-purple-300 border border-slate-700"
                  >
                    Sample: Pediatric Emergency Slip
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-950 transition-all flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              SUBMIT EXEMPTION CLAIM FOR ADJUDICATION
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
