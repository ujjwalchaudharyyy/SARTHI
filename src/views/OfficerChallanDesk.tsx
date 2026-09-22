import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import { STATUTORY_OFFENSES } from '../data/mockData';
import { EChallanRecord } from '../types';
import {
  FileText,
  ShieldCheck,
  Send,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  QrCode,
  Download,
  X,
  Clock,
  Car,
  Eye,
  BadgeCheck,
} from 'lucide-react';

export const OfficerChallanDesk: React.FC = () => {
  const {
    vehicles,
    eChallans,
    issueEChallan,
    payEChallan,
    getVehicleRC,
    selectedVehicleForChallan,
    setCurrentView,
    setSurveillanceTarget,
  } = useSimulation();
  const { t, language } = useLanguage();

  // Form State
  const [vehicleReg, setVehicleReg] = useState<string>('UK07AB1234');
  const [selectedOffenseCode, setSelectedOffenseCode] = useState<string>('SEC_112_183_LMV');
  const [penaltyAmount, setPenaltyAmount] = useState<number>(2000);
  const [location, setLocation] = useState<string>('NH-87 Kathgodam-Bhimtal Mile 14');
  const [roadCorridor, setRoadCorridor] = useState<string>('NH-87 Kathgodam-Bhimtal Road');
  const [cameraSource, setCameraSource] = useState<string>('Automated High-Speed Radar Cam #04');
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [receiptChallan, setReceiptChallan] = useState<EChallanRecord | null>(null);

  // Table filter state
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (selectedVehicleForChallan) {
      setVehicleReg(selectedVehicleForChallan.registrationNumber);
      if (selectedVehicleForChallan.road) {
        setRoadCorridor(selectedVehicleForChallan.road);
        setLocation(selectedVehicleForChallan.locationName || selectedVehicleForChallan.road);
      }
      if (selectedVehicleForChallan.currentSpeed > selectedVehicleForChallan.speedLimit) {
        setSelectedOffenseCode('SEC_112_183_LMV');
        setPenaltyAmount(2000);
      }
    }
  }, [selectedVehicleForChallan]);

  const handleOffenseChange = (code: string) => {
    setSelectedOffenseCode(code);
    const offense = STATUTORY_OFFENSES.find((o) => o.code === code);
    if (offense) {
      setPenaltyAmount(offense.defaultPenalty);
    }
  };

  const currentRC = getVehicleRC(vehicleReg);

  const handleSubmitChallan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleReg.trim()) return;

    const offense = STATUTORY_OFFENSES.find((o) => o.code === selectedOffenseCode) || STATUTORY_OFFENSES[0];

    const newChallan = issueEChallan({
      vehicleRegistration: vehicleReg.toUpperCase().trim(),
      offenseSection: offense.section,
      offenseTitle: offense.title,
      offenseDescription: offense.description,
      penaltyAmount,
      location,
      roadCorridor,
      cameraSource,
      officerRemarks,
      recordedSpeed: selectedOffenseCode.includes('112') ? 112 : undefined,
      speedLimit: selectedOffenseCode.includes('112') ? 80 : undefined,
    });

    setReceiptChallan(newChallan);
    setIsSuccessModalOpen(true);
    setOfficerRemarks('');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadCSV = (ch: EChallanRecord) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'OFFICIAL E-CHALLAN STATUTORY RECORD - STATE TRAFFIC INFRASTRUCTURE (SARTHI)',
        'GOVERNMENT OF UTTARAKHAND - MOTOR VEHICLES ENFORCEMENT',
        `Challan Number,${ch.challanNumber}`,
        `Vehicle Registration,${ch.vehicleRegistration}`,
        `Vehicle Type,${ch.vehicleType}`,
        `Owner Name,${ch.ownerName}`,
        `Mobile Number,${ch.mobileNumber}`,
        `Statutory Section,${ch.offenseSection}`,
        `Offense Title,${ch.offenseTitle}`,
        `Penalty Amount (INR),${ch.penaltyAmount}`,
        `Violation Location,${ch.location}`,
        `Issuing Officer,${ch.issuingOfficerName} (${ch.issuingOfficerBadge})`,
        `Timestamp,${ch.timestamp}`,
        `Payment Status,${ch.paymentStatus}`,
        `Payment Due Date,${ch.paymentDueDate}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ECHALLAN_${ch.challanNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredChallans = eChallans.filter((ch) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'UNPAID' && ch.paymentStatus === 'UNPAID') ||
      (filterStatus === 'PAID' && ch.paymentStatus === 'PAID') ||
      (filterStatus === 'DISPUTE' && ch.paymentStatus === 'UNDER_DISPUTE') ||
      (filterStatus === 'WAIVED' && ch.paymentStatus === 'WAIVED_MEDICAL_EMERGENCY');

    const matchesSearch =
      ch.challanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.vehicleRegistration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.offenseSection.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalCollected = eChallans
    .filter((c) => c.paymentStatus === 'PAID')
    .reduce((acc, c) => acc + c.penaltyAmount, 0);

  const totalPending = eChallans
    .filter((c) => c.paymentStatus === 'UNPAID' || c.paymentStatus === 'UNDER_DISPUTE')
    .reduce((acc, c) => acc + c.penaltyAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Official Government Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-600 dark:text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800/40">
                  {language === 'hi' ? 'एमवी अधिनियम प्रवर्तन' : 'MV ACT ENFORCEMENT'}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Sec 133 / 200 MV Act 1988
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {t('challan.title')}
              </h1>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('challan.subtitle')}
          </p>
        </div>

        {/* Aggregate Counters */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 px-3.5 py-2 text-right shadow-xs">
            <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Total Enforced</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              {eChallans.length} <span className="text-xs font-normal text-slate-500">Notices</span>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-2 text-right shadow-xs">
            <span className="text-[10px] uppercase font-mono text-emerald-700 dark:text-emerald-400">Collected Fine</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-700 dark:text-emerald-400">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-3.5 py-2 text-right shadow-xs">
            <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400">Outstanding Due</span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-700 dark:text-amber-400">
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Issuance Form | Right = Info & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
                {t('challan.form_title')}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Officer: <strong className="text-slate-800 dark:text-white">Insp. R. S. Negi (DEMO001)</strong>
            </span>
          </div>

          <form onSubmit={handleSubmitChallan} className="space-y-4">
            {/* Target Vehicle Input & Quick Selector */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('challan.plate_label')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Quick Pick:</span>
                  {vehicles.slice(0, 4).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setVehicleReg(v.registrationNumber);
                        setRoadCorridor(v.road);
                        setLocation(v.locationName || v.road);
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
                    >
                      {v.registrationNumber}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <Car className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                    placeholder="e.g. UK07AB1234"
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 pl-9 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentView('rc_lookup')}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  {t('btn.inspect_rc')}
                </button>
              </div>

              {/* Live RC Card Mini-Preview */}
              {currentRC && (
                <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{currentRC.makeModel}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Owner: <span className="text-slate-900 dark:text-white font-medium">{currentRC.ownerName}</span> | RTO: <span className="text-slate-600 dark:text-slate-300">{currentRC.rtoName.split(' ')[0]}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-sky-950 border border-blue-200 dark:border-sky-800/50 text-blue-700 dark:text-sky-300 font-bold">
                    {currentRC.fuelType}
                  </span>
                </div>
              )}
            </div>

            {/* Statutory Offense Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('challan.offense_label')} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedOffenseCode}
                onChange={(e) => handleOffenseChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              >
                {STATUTORY_OFFENSES.map((off) => (
                  <option key={off.code} value={off.code}>
                    {off.section}: {off.title} (Fine: ₹{off.defaultPenalty.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Penalty Amount & Enforcement Camera Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('challan.penalty_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={100}
                  step={500}
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-sm font-mono font-bold text-amber-600 dark:text-amber-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('challan.camera_label')}
                </label>
                <select
                  value={cameraSource}
                  onChange={(e) => setCameraSource(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Automated High-Speed Radar Cam #04">Automated Radar Cam #04 (Mile 14)</option>
                  <option value="AI Smart Surveillance PTZ #12 (Niglat)">AI Smart PTZ #12 (Niglat Bend)</option>
                  <option value="Mobile Patrol Interceptor Radar UK07PC012">Mobile Patrol Interceptor UK07PC012</option>
                  <option value="ANPR Entry Camera Tallital #01">ANPR Entry Camera Tallital #01</option>
                  <option value="On-Duty Officer Manual Sighting">On-Duty Officer Direct Sighting</option>
                </select>
              </div>
            </div>

            {/* Location & Corridor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('challan.corridor_label')}</label>
                <input
                  type="text"
                  value={roadCorridor}
                  onChange={(e) => setRoadCorridor(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('challan.location_label')}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('challan.remarks_label')}
              </label>
              <textarea
                rows={2}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="e.g. Excessive speeding observed on descending slope, automated calibration verified."
                className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              {t('challan.submit_btn')}
            </button>
          </form>
        </div>

        {/* Right Info Box & Shortcuts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
              <Building className="w-4 h-4" />
              STATUTORY E-ENFORCEMENT PROTOCOL
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Electronic challans generated through SARTHI integrate with the <strong>MoRTH Parivahan National Gateway</strong>. An automated SMS with payment link and digital evidence is dispatched to the registered vehicle owner.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div>• 15-Day Payment Window</div>
              <div>• Section 134 Exemption Desk</div>
              <div>• Virtual Court Digital Sync</div>
              <div>• Forensic Audit Trail</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-300">
              Vehicle Intelligence Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSurveillanceTarget(vehicleReg);
                  setCurrentView('surveillance');
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-blue-700 dark:text-sky-300 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {t('btn.radar_lock')}
              </button>
              <button
                onClick={() => setCurrentView('rc_lookup')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                {t('btn.inspect_rc')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* State e-Challan Ledger Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-mono">
              {t('challan.ledger_title')} ({filteredChallans.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search plate, challan #, section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 pl-8 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {[
                { key: 'ALL', label: t('btn.filter_all') },
                { key: 'UNPAID', label: t('btn.filter_unpaid') },
                { key: 'PAID', label: t('btn.filter_paid') },
                { key: 'DISPUTE', label: t('btn.filter_dispute') },
                { key: 'WAIVED', label: t('btn.filter_waived') },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-colors ${
                    filterStatus === key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Challan Number</th>
                <th className="px-4 py-3">Vehicle Plate & Model</th>
                <th className="px-4 py-3">Offense Section</th>
                <th className="px-4 py-3">Penalty (₹)</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {filteredChallans.map((ch) => (
                <tr key={ch.challanNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {ch.challanNumber}
                    <div className="text-[10px] font-normal text-slate-500">
                      Officer: {ch.issuingOfficerBadge}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{ch.vehicleRegistration}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{ch.vehicleType}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-amber-700 dark:text-amber-300">{ch.offenseSection}</span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {ch.offenseTitle}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ₹{ch.penaltyAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <div>{ch.location}</div>
                    <div className="font-mono text-slate-400">{ch.timestamp}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    {ch.paymentStatus === 'PAID' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-3 h-3" /> {t('status.paid')}
                      </span>
                    ) : ch.paymentStatus === 'UNDER_DISPUTE' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/40">
                        <Clock className="w-3 h-3" /> {t('status.in_dispute')}
                      </span>
                    ) : ch.paymentStatus === 'WAIVED_MEDICAL_EMERGENCY' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800/40">
                        <BadgeCheck className="w-3 h-3" /> {t('status.waived')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-red-100 dark:bg-red-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800/40">
                        <AlertTriangle className="w-3 h-3" /> {t('status.unpaid')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setReceiptChallan(ch);
                        setIsSuccessModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {t('btn.print')}
                    </button>
                    {ch.paymentStatus === 'UNPAID' && (
                      <button
                        onClick={() => payEChallan(ch.challanNumber)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white shadow-xs"
                      >
                        {t('btn.settle_fine')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable e-Challan Receipt Modal */}
      {isSuccessModalOpen && receiptChallan && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Container */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 sm:p-6 text-slate-800 dark:text-slate-200 space-y-4">
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  GOVERNMENT OF UTTARAKHAND — STATE TRANSPORT DIRECTORATE
                </div>
                <h3 className="text-lg font-black tracking-wide text-slate-900 dark:text-white font-mono mt-1">
                  OFFICIAL MOTOR VEHICLES ELECTRONIC CHALLAN NOTICE
                </h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Issued under Section 133 / 200 of the Motor Vehicles Act, 1988 (Amended 2019)
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3 bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Challan Number:</div>
                  <div className="font-mono text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                    {receiptChallan.challanNumber}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">Date & Time:</div>
                  <div className="font-mono text-slate-700 dark:text-slate-300">{receiptChallan.timestamp}</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Vehicle Registration:</div>
                  <div className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {receiptChallan.vehicleRegistration}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">Vehicle Model:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{receiptChallan.vehicleType}</div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs space-y-1 bg-white dark:bg-slate-900/40">
                <div>Registered Owner: <strong className="text-slate-900 dark:text-white">{receiptChallan.ownerName}</strong></div>
                <div>Mobile Number: <span className="font-mono">{receiptChallan.mobileNumber}</span> (SMS Dispatched)</div>
                <div>Location: <span className="text-slate-700 dark:text-slate-300">{receiptChallan.location}</span></div>
                <div>Radar Sensor: <span className="text-slate-700 dark:text-slate-300">{receiptChallan.cameraSource}</span></div>
              </div>

              {/* Offense & Fine */}
              <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-red-700 dark:text-red-400 text-sm">
                    {receiptChallan.offenseSection}
                  </span>
                  <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                    ₹{receiptChallan.penaltyAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">{receiptChallan.offenseTitle}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {receiptChallan.offenseDescription}
                </p>
              </div>

              {/* QR Code & Gateway Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-white text-black border border-slate-300">
                    <QrCode className="w-9 h-9" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-200">Parivahan Bharat ePay</div>
                    <div className="text-[10px] text-slate-500 font-mono">https://echallan.parivahan.gov.in</div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">Due Date: {receiptChallan.paymentDueDate}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div className="text-slate-500">Issuing Authority</div>
                  <div className="font-bold text-slate-900 dark:text-white">{receiptChallan.issuingOfficerName}</div>
                  <div className="text-slate-500">Badge: {receiptChallan.issuingOfficerBadge}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadCSV(receiptChallan)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                {t('btn.export_csv')}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {t('btn.print')}
                </button>
                <button
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:text-white"
                >
                  {t('btn.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
