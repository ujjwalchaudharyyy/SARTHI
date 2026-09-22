import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { VehicleRegistrationData } from '../types';
import {
  Car,
  PlusCircle,
  CheckCircle2,
  MapPin,
  Shield,
  Radio,
  FileCheck,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const VehicleRegistration: React.FC = () => {
  const { registerNewVehicle, vehicles, setSelectedVehicle, setCurrentView } = useSimulation();

  const [formData, setFormData] = useState<VehicleRegistrationData>({
    registrationNumber: 'UK07TE9999',
    vehicleType: 'Car',
    ownerName: 'Aarav Sharma',
    mobileNumber: '+91 98765 43210',
    chassisNumber: 'MA3EWB21S00984124',
    roadCorridor: 'NH-87 Kathgodam-Bhimtal Road',
    speedLimit: 80,
    deviceImei: '864291048821901',
  });

  const [successModal, setSuccessModal] = useState<any | null>(null);
  const [filterSearch, setFilterSearch] = useState('');

  const roadOptions = [
    'NH-87 Kathgodam-Bhimtal Road',
    'Bhowali Ghat Road',
    'Tallital Mall Road',
    'Bhimtal Lake Perimeter Road',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrationNumber.trim() || !formData.ownerName.trim()) return;

    const newVeh = registerNewVehicle(formData);
    setSuccessModal(newVeh);

    // Reset plate for next registration
    setFormData((prev) => ({
      ...prev,
      registrationNumber: `UK07${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )}${Math.floor(1000 + Math.random() * 9000)}`,
      ownerName: '',
      mobileNumber: '',
    }));
  };

  const filteredFleet = vehicles.filter(
    (v) =>
      v.registrationNumber.toLowerCase().includes(filterSearch.toLowerCase()) ||
      v.road.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (v.ownerName && v.ownerName.toLowerCase().includes(filterSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-400" />
            <h1 className="font-mono text-lg sm:text-xl font-black text-white tracking-wide">
              VAHAN TELEMETRY ENROLLMENT & FLEET REGISTRY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Register new private or commercial vehicles for automated GIS tracking & speed compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl font-bold">
            {vehicles.length} VEHICLES ENROLLED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Enrollment Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Enroll New Vehicle
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter vehicle and owner particulars to initialize simulated telemetry stream
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Indian Plate Preview */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Vehicle Registration Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="UK07AB1234"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-mono font-bold text-sky-400 tracking-wider focus:border-sky-500 focus:outline-none uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Vehicle Class *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleType: e.target.value as any })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
                >
                  <option value="Car">Car (LMV)</option>
                  <option value="Two-Wheeler">Two-Wheeler (MCWG)</option>
                  <option value="Heavy Vehicle">Heavy Commercial (HMV)</option>
                  <option value="Bus">Passenger Bus</option>
                  <option value="Ambulance">Emergency Ambulance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Speed Limit (km/h) *
                </label>
                <select
                  value={formData.speedLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, speedLimit: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
                >
                  <option value={40}>40 km/h (Perimeter/Town)</option>
                  <option value={50}>50 km/h (Hill Descent)</option>
                  <option value={60}>60 km/h (State Highway)</option>
                  <option value={80}>80 km/h (National Highway)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Owner Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Ramesh Chandra Pant"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="+91 94120 00000"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                  Chassis / VIN #
                </label>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                  placeholder="MA3EWB21..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:border-sky-500 focus:outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                Assigned Road Corridor *
              </label>
              <select
                value={formData.roadCorridor}
                onChange={(e) => setFormData({ ...formData, roadCorridor: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
              >
                {roadOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                AIS-140 Telemetry Device IMEI
              </label>
              <input
                type="text"
                value={formData.deviceImei}
                onChange={(e) => setFormData({ ...formData, deviceImei: e.target.value })}
                placeholder="864291048821901"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-950 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              REGISTER & ACTIVATE TELEMETRY
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Active Registered Fleet Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Active Enrolled Fleet ({filteredFleet.length} Vehicles)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time simulated telemetry feeds mapped to SARTHI speed engine
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Filter plate, owner, road..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] uppercase tracking-wider text-slate-400 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Plate / Class</th>
                  <th className="py-2.5 px-3">Owner Details</th>
                  <th className="py-2.5 px-3">Corridor</th>
                  <th className="py-2.5 px-3 text-center">Speed / Limit</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredFleet.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-sky-400 text-xs">{v.registrationNumber}</div>
                      <div className="text-[10px] text-slate-500">{v.type}</div>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="text-white font-medium">{v.ownerName || 'Verified Registry'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.mobileNumber || '+91 94120 •••••'}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                      {v.road}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-white font-bold">{v.currentSpeed}</span>{' '}
                      <span className="text-slate-500 text-[10px]">/ {v.speedLimit} km/h</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedVehicle(v);
                          setCurrentView('map');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-sans font-semibold transition-colors"
                      >
                        Locate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Success Registration Modal */}
      {successModal && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Vehicle Enrolled Successfully</h3>
                <p className="text-xs text-slate-400 font-mono">SARTHI Vahan Telemetry Stream Connected</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Registration Plate:</span>
                <span className="font-bold text-sky-400 text-sm">{successModal.registrationNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Vehicle Class:</span>
                <span className="text-white">{successModal.type}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Registered Owner:</span>
                <span className="text-white font-sans">{successModal.ownerName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Assigned Corridor:</span>
                <span className="text-white font-sans">{successModal.road}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Statutory Speed Limit:</span>
                <span className="text-emerald-400 font-bold">{successModal.speedLimit} km/h</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSuccessModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Register Another
              </button>

              <button
                onClick={() => {
                  setSelectedVehicle(successModal);
                  setSuccessModal(null);
                  setCurrentView('map');
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-950"
              >
                Track on GIS Map
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
