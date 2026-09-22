import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import { PARIVAHAN_RC_DATABASE } from '../data/mockData';
import {
  FileText,
  Search,
  Car,
  User,
  Building,
  CheckCircle2,
  Eye,
  Send,
  BadgeCheck,
} from 'lucide-react';

export const VehicleRCLookup: React.FC = () => {
  const {
    vehicles,
    eChallans,
    getVehicleRC,
    setSelectedVehicleForChallan,
    setSurveillanceTarget,
    setCurrentView,
  } = useSimulation();
  const { t, language } = useLanguage();

  const [searchPlate, setSearchPlate] = useState<string>('UK07AB1234');
  const [activePlate, setActivePlate] = useState<string>('UK07AB1234');
  const [showChassisFull, setShowChassisFull] = useState<boolean>(false);

  const currentRC = getVehicleRC(activePlate);

  const vehicleChallans = eChallans.filter(
    (ch) => ch.vehicleRegistration.toUpperCase() === activePlate.toUpperCase()
  );

  const totalChallansCount = vehicleChallans.length;
  const totalPaid = vehicleChallans
    .filter((c) => c.paymentStatus === 'PAID')
    .reduce((acc, c) => acc + c.penaltyAmount, 0);
  const totalPending = vehicleChallans
    .filter((c) => c.paymentStatus === 'UNPAID' || c.paymentStatus === 'UNDER_DISPUTE')
    .reduce((acc, c) => acc + c.penaltyAmount, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPlate.trim()) {
      setActivePlate(searchPlate.toUpperCase().trim());
    }
  };

  const handleQuickSelect = (plate: string) => {
    setSearchPlate(plate);
    setActivePlate(plate);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Official Parivahan Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-sky-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-sky-400 bg-blue-100 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-blue-300 dark:border-sky-800/40">
                  PARIVAHAN VAHAN 4.0
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  National Vehicle Registry & Smart Card Database
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {t('rc.title')}
              </h1>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('rc.subtitle')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSurveillanceTarget(activePlate);
              setCurrentView('surveillance');
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow transition-all hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            <span>{t('btn.radar_lock')}</span>
          </button>
          <button
            onClick={() => {
              const matchedVeh = vehicles.find((v) => v.registrationNumber === activePlate);
              if (matchedVeh) setSelectedVehicleForChallan(matchedVeh);
              setCurrentView('challans');
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>{t('btn.issue_challan')}</span>
          </button>
        </div>
      </div>

      {/* Plate Search Bar & Quick Pick Chips */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Registration Plate (e.g. UK07AB1234, DL03XY4412)..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 pl-10 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold uppercase tracking-wider text-white shadow transition-colors"
          >
            {t('btn.search')}
          </button>
        </form>

        {/* Quick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Fast Registry Query:</span>
          {Object.keys(PARIVAHAN_RC_DATABASE).map((plate) => (
            <button
              key={plate}
              type="button"
              onClick={() => handleQuickSelect(plate)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                activePlate === plate
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {plate}
            </button>
          ))}
        </div>
      </div>

      {/* Main RC Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Digital Parivahan Smart Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 sm:p-6 shadow-sm space-y-6">
          {/* Smart Card Header with Indian HSRP Number Plate Style */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              {/* Indian HSRP Number Plate */}
              <div className="inline-flex items-center rounded-lg border-2 border-slate-400 bg-white text-black px-3 py-1 shadow-md">
                <div className="flex flex-col items-center justify-center border-r border-slate-300 pr-2 mr-2 text-[8px] font-black leading-none text-blue-900">
                  <span>IND</span>
                  <div className="w-2.5 h-2.5 rounded-full border border-blue-900 mt-0.5" />
                </div>
                <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-black">
                  {currentRC.registrationNumber}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Registered RTO</span>
                <div className="text-xs font-bold text-blue-600 dark:text-sky-400">{currentRC.rtoName}</div>
              </div>
            </div>

            {/* Vehicle Model & Class Banner */}
            <div>
              <div className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                {currentRC.makeModel}
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentRC.fuelType}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Maker: <span className="text-slate-800 dark:text-slate-200">{currentRC.makerDescription}</span> | Class: <span className="text-slate-800 dark:text-slate-200">{currentRC.vehicleClass}</span>
              </div>
            </div>
          </div>

          {/* Registered Owner & Address Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {t('rc.owner_info')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 space-y-1">
                <div className="text-slate-500 dark:text-slate-400">{t('rc.owner_name')}:</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{currentRC.ownerName}</div>
                <div className="text-slate-500 dark:text-slate-400 pt-1">{t('rc.father_name')}:</div>
                <div className="font-medium text-slate-700 dark:text-slate-300">{currentRC.fatherHusbandName}</div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 space-y-1">
                <div className="text-slate-500 dark:text-slate-400">{t('rc.mobile')}:</div>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentRC.mobileNumber}</div>
                <div className="text-slate-500 dark:text-slate-400 pt-1">{t('rc.address')}:</div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{currentRC.registeredAddress}</div>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              {t('rc.tech_specs')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('rc.chassis')}</span>
                <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {showChassisFull ? currentRC.chassisNumber : currentRC.chassisNumber.slice(0, 5) + '*****' + currentRC.chassisNumber.slice(-4)}
                </div>
                <button
                  type="button"
                  onClick={() => setShowChassisFull(!showChassisFull)}
                  className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline mt-0.5"
                >
                  {showChassisFull ? 'Mask' : 'Reveal'}
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('rc.engine')}</span>
                <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {currentRC.engineNumber}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('rc.norms')}</span>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{currentRC.emissionNorms}</div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Color</span>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{currentRC.color}</div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Seating</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{currentRC.seatingCapacity} Persons</div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-2.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Hypothecation</span>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate">{currentRC.hypothecatedTo || 'None (Direct Owner)'}</div>
              </div>
            </div>
          </div>

          {/* Validities */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t('rc.validity')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 space-y-1">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>{t('rc.fitness')}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">{currentRC.fitnessValidUpto}</div>
              </div>

              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 space-y-1">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>{t('rc.insurance')}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">{currentRC.insuranceValidUpto}</div>
              </div>

              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 space-y-1">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>{t('rc.pucc')}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">{currentRC.puccValidUpto}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Lifetime Challans Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-slate-900 dark:text-slate-200">
                <FileText className="w-4 h-4 text-amber-500" />
                {t('rc.challans_summary')} ({activePlate})
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Notices</span>
                <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  {totalChallansCount}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-mono">Paid</span>
                <div className="text-xs sm:text-sm font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-3">
                <span className="text-[10px] text-red-700 dark:text-red-400 uppercase font-mono">Pending</span>
                <div className="text-xs sm:text-sm font-black font-mono text-red-700 dark:text-red-400 mt-1">
                  ₹{totalPending.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* List of Historical Challans */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Violation Records on this Plate
              </h4>

              {vehicleChallans.length === 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  Clean compliance record. No active or pending challans registered for {activePlate}.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {vehicleChallans.map((ch) => (
                    <div
                      key={ch.challanNumber}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 p-3 text-xs space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                          {ch.challanNumber}
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          ₹{ch.penaltyAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{ch.offenseSection}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{ch.offenseTitle}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 font-mono">
                        <span>{ch.timestamp}</span>
                        <span
                          className={`font-bold ${
                            ch.paymentStatus === 'PAID'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : ch.paymentStatus === 'UNDER_DISPUTE'
                              ? 'text-amber-600 dark:text-amber-400'
                              : ch.paymentStatus === 'WAIVED_MEDICAL_EMERGENCY'
                              ? 'text-purple-600 dark:text-purple-300'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {ch.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
