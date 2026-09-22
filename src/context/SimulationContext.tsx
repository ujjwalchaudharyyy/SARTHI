import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Vehicle,
  ViolationRecord,
  EmergencyCorridor,
  Incident,
  AlertNotification,
  AuditLog,
  ChallanDispute,
  VehicleRegistrationData,
  EChallanRecord,
  ChallanIssuanceInput,
  VehicleRCDetails,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_VIOLATIONS,
  INITIAL_EMERGENCY_CORRIDOR,
  INITIAL_INCIDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DISPUTES,
  INITIAL_ECHALLANS,
  CORRIDOR_WAYPOINTS,
  getParivahanRCDetails,
} from '../data/mockData';

interface SimulationContextType {
  isSimulating: boolean;
  simulationSpeed: number;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  vehicles: Vehicle[];
  violations: ViolationRecord[];
  disputes: ChallanDispute[];
  eChallans: EChallanRecord[];
  emergencyCorridor: EmergencyCorridor;
  incidents: Incident[];
  notifications: AlertNotification[];
  auditLogs: AuditLog[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedViolation: ViolationRecord | null;
  setSelectedViolation: (violation: ViolationRecord | null) => void;
  selectedVehicleForChallan: Vehicle | null;
  setSelectedVehicleForChallan: (vehicle: Vehicle | null) => void;
  surveillanceTarget: string | null;
  setSurveillanceTarget: (reg: string | null) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (caseId: string | null) => void;
  currentDistrict: string;
  setCurrentDistrict: (district: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  // Interactive Actions
  activateEmergencyCorridor: () => void;
  markControlPointClear: (cpId: string) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (action: string, resource: string, result?: 'SUCCESS' | 'FLAGGED' | 'DENIED') => void;
  flagVehicleForOverspeedDemo: (reg?: string) => void;
  registerNewVehicle: (data: VehicleRegistrationData) => Vehicle;
  submitChallanDispute: (
    disputeData: Omit<ChallanDispute, 'id' | 'submissionTimestamp' | 'status'>
  ) => ChallanDispute;
  reviewChallanDispute: (
    disputeId: string,
    action: 'APPROVE' | 'REJECT',
    remarks: string,
    officerName: string
  ) => void;
  issueEChallan: (input: ChallanIssuanceInput) => EChallanRecord;
  payEChallan: (challanNumber: string) => void;
  getVehicleRC: (reg: string) => VehicleRCDetails;
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  demoStepIndex: number;
  setDemoStepIndex: (step: number) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Initialize vehicles with corridor assignments and RC links
const enrichedInitialVehicles: Vehicle[] = INITIAL_VEHICLES.map((v, index) => {
  const corridorKeys = Object.keys(CORRIDOR_WAYPOINTS);
  let corridorId = corridorKeys[index % corridorKeys.length];

  if (v.road.includes('NH-87') || v.road.includes('Kathgodam')) {
    corridorId = 'NH87_KATHGODAM_BHIMTAL';
  } else if (v.road.includes('Bhowali') && v.road.includes('Nainital')) {
    corridorId = 'BHOWALI_TALLITAL';
  } else if (v.road.includes('Bhowali')) {
    corridorId = 'BHIMTAL_BHOWALI';
  } else if (v.road.includes('Tallital') || v.road.includes('Mall')) {
    corridorId = 'TALLITAL_MALLITAL';
  } else if (v.road.includes('Bhimtal')) {
    corridorId = 'BHIMTAL_LAKE_PERIMETER';
  }

  const corridor = CORRIDOR_WAYPOINTS[corridorId] || CORRIDOR_WAYPOINTS.NH87_KATHGODAM_BHIMTAL;
  const numSegments = Math.max(1, corridor.points.length - 1);
  const segmentIndex = index % numSegments;
  const progressFraction = (index * 0.23) % 1.0;

  const pA = corridor.points[segmentIndex];
  const pB = corridor.points[segmentIndex + 1] || corridor.points[segmentIndex];
  const lat = pA[0] + (pB[0] - pA[0]) * progressFraction;
  const lng = pA[1] + (pB[1] - pA[1]) * progressFraction;

  const rc = getParivahanRCDetails(v.registrationNumber);

  return {
    ...v,
    corridorId,
    segmentIndex,
    progressFraction,
    direction: index % 2 === 0 ? 1 : -1,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    ownerName: rc.ownerName,
    chassisNumber: rc.chassisNumber,
    mobileNumber: rc.mobileNumber,
    makeModel: rc.makeModel,
    color: rc.color,
    totalChallansCount: v.registrationNumber === 'UK07AB1234' ? 3 : index % 7 === 0 ? 2 : index % 4 === 0 ? 1 : 0,
    pendingChallanAmount: v.registrationNumber === 'UK07AB1234' ? 7000 : index % 7 === 0 ? 3000 : index % 4 === 0 ? 1000 : 0,
    rcDetails: rc,
  };
});

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>(enrichedInitialVehicles);
  const [violations, setViolations] = useState<ViolationRecord[]>(INITIAL_VIOLATIONS);
  const [disputes, setDisputes] = useState<ChallanDispute[]>(INITIAL_DISPUTES);
  const [eChallans, setEChallans] = useState<EChallanRecord[]>(INITIAL_ECHALLANS);
  const [emergencyCorridor, setEmergencyCorridor] = useState<EmergencyCorridor>(INITIAL_EMERGENCY_CORRIDOR);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<ViolationRecord | null>(null);
  const [selectedVehicleForChallan, setSelectedVehicleForChallan] = useState<Vehicle | null>(null);
  const [surveillanceTarget, setSurveillanceTarget] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<string>('Bhimtal / Nainital');
  const [currentView, setCurrentView] = useState<string>('login');

  // Guided demo tour state
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);

  const tickCountRef = useRef<number>(0);

  const addAuditLog = useCallback(
    (action: string, resource: string, result: 'SUCCESS' | 'FLAGGED' | 'DENIED' = 'SUCCESS') => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').slice(0, 19);
      const newLog: AuditLog = {
        id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        officerId: 'DEMO001',
        officerName: 'Insp. R. S. Negi',
        action,
        resource,
        ipAddress: '10.14.22.84 (SARTHI Command)',
        result,
      };
      setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    },
    []
  );

  const getVehicleRC = useCallback((reg: string): VehicleRCDetails => {
    return getParivahanRCDetails(reg);
  }, []);

  const issueEChallan = (input: ChallanIssuanceInput): EChallanRecord => {
    const cleanReg = input.vehicleRegistration.toUpperCase().trim();
    const rc = getParivahanRCDetails(cleanReg);
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').slice(0, 19);
    const dueDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const challanNumber = `CH-UK-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newChallan: EChallanRecord = {
      challanNumber,
      vehicleRegistration: cleanReg,
      vehicleType: rc.makeModel,
      ownerName: rc.ownerName,
      mobileNumber: rc.mobileNumber,
      offenseSection: input.offenseSection,
      offenseTitle: input.offenseTitle,
      offenseDescription: input.offenseDescription,
      recordedSpeed: input.recordedSpeed,
      speedLimit: input.speedLimit,
      penaltyAmount: input.penaltyAmount,
      location: input.location,
      roadCorridor: input.roadCorridor,
      issuingOfficerName: 'Insp. R. S. Negi',
      issuingOfficerBadge: 'DEMO001',
      cameraSource: input.cameraSource || 'Mobile Patrol Interceptor / Manual Officer Dispatch',
      timestamp: timestampStr,
      paymentStatus: 'UNPAID',
      smsSent: true,
      smsDispatchTimestamp: timestampStr,
      paymentDueDate: dueDate,
      qrCodeData: `https://echallan.parivahan.gov.in/pay?ch=${challanNumber}&amt=${input.penaltyAmount}`,
    };

    setEChallans((prev) => [newChallan, ...prev]);

    // Update vehicle records with new challan stats
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.registrationNumber === cleanReg) {
          return {
            ...v,
            totalChallansCount: (v.totalChallansCount || 0) + 1,
            pendingChallanAmount: (v.pendingChallanAmount || 0) + input.penaltyAmount,
          };
        }
        return v;
      })
    );

    // Queue alert for command officer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        priority: 'WARNING',
        title: `e-Challan Issued: ${challanNumber}`,
        message: `Statutory notice dispatched for ${cleanReg} (${input.offenseSection} - ₹${input.penaltyAmount.toLocaleString('en-IN')}) via Parivahan SMS gateway.`,
        location: input.location,
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'challans', id: challanNumber },
      },
      ...prev,
    ]);

    addAuditLog(
      'ECHALLAN_STATUTORY_ISSUED',
      `Challan ${challanNumber} on ${cleanReg} (${input.offenseSection}, Penalty ₹${input.penaltyAmount})`
    );

    return newChallan;
  };

  const payEChallan = (challanNumber: string) => {
    const now = new Date();
    const txnRef = `TXN-SBI-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const timestampStr = now.toISOString().replace('T', ' ').slice(0, 19);

    setEChallans((prev) =>
      prev.map((ch) => {
        if (ch.challanNumber === challanNumber) {
          return {
            ...ch,
            paymentStatus: 'PAID',
            transactionRef: txnRef,
            paidAtTimestamp: timestampStr,
          };
        }
        return ch;
      })
    );

    const paidChallan = eChallans.find((ch) => ch.challanNumber === challanNumber);
    if (paidChallan) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.registrationNumber === paidChallan.vehicleRegistration) {
            return {
              ...v,
              pendingChallanAmount: Math.max(0, (v.pendingChallanAmount || 0) - paidChallan.penaltyAmount),
            };
          }
          return v;
        })
      );
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        priority: 'INFO',
        title: `e-Challan Settled: ${challanNumber}`,
        message: `Payment received via Bharat ePay / SBI Gateway. Receipt generated: ${txnRef}.`,
        location: 'Parivahan Treasury Integration',
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'challans' },
      },
      ...prev,
    ]);

    addAuditLog('ECHALLAN_PAID_GATEWAY', `Challan ${challanNumber} (Txn: ${txnRef})`);
  };

  const registerNewVehicle = (data: VehicleRegistrationData): Vehicle => {
    let corridorId = 'NH87_KATHGODAM_BHIMTAL';
    if (data.roadCorridor.includes('Bhowali') && data.roadCorridor.includes('Nainital')) {
      corridorId = 'BHOWALI_TALLITAL';
    } else if (data.roadCorridor.includes('Bhowali')) {
      corridorId = 'BHIMTAL_BHOWALI';
    } else if (data.roadCorridor.includes('Tallital') || data.roadCorridor.includes('Mall')) {
      corridorId = 'TALLITAL_MALLITAL';
    } else if (data.roadCorridor.includes('Bhimtal')) {
      corridorId = 'BHIMTAL_LAKE_PERIMETER';
    }

    const corridor = CORRIDOR_WAYPOINTS[corridorId] || CORRIDOR_WAYPOINTS.NH87_KATHGODAM_BHIMTAL;
    const pA = corridor.points[0];
    const pB = corridor.points[1] || pA;

    const rc = getParivahanRCDetails(data.registrationNumber);

    const newVehicle: Vehicle = {
      id: `veh-custom-${Date.now().toString().slice(-4)}`,
      registrationNumber: data.registrationNumber.toUpperCase().trim(),
      type: data.vehicleType,
      category: 'NORMAL',
      currentSpeed: Math.max(30, data.speedLimit - 10),
      speedLimit: data.speedLimit,
      excessSpeed: 0,
      durationSeconds: 0,
      road: data.roadCorridor,
      locationName: `${data.roadCorridor} (Newly Enrolled)`,
      lat: pA[0],
      lng: pA[1],
      heading: 45,
      lastUpdated: 'Just now',
      dataSource: 'SIMULATED TELEMETRY',
      ownerName: data.ownerName,
      chassisNumber: data.chassisNumber,
      mobileNumber: data.mobileNumber,
      corridorId,
      segmentIndex: 0,
      progressFraction: 0,
      direction: 1,
      totalChallansCount: 0,
      pendingChallanAmount: 0,
      rcDetails: rc,
    };

    setVehicles((prev) => [newVehicle, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        priority: 'INFO',
        title: 'Vehicle Telemetry Enrolled',
        message: `Vehicle ${newVehicle.registrationNumber} (${newVehicle.type}) successfully registered under SARTHI fleet registry.`,
        location: newVehicle.road,
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'map' },
      },
      ...prev,
    ]);

    addAuditLog('VEHICLE_REGISTRATION_ENROLLED', `Vehicle ${newVehicle.registrationNumber} (Owner: ${data.ownerName})`);
    return newVehicle;
  };

  const submitChallanDispute = (
    disputeData: Omit<ChallanDispute, 'id' | 'submissionTimestamp' | 'status'>
  ): ChallanDispute => {
    const newDispute: ChallanDispute = {
      ...disputeData,
      id: `DISP-2026-${Math.floor(100 + Math.random() * 900)}`,
      submissionTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'PENDING_REVIEW',
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Update violation & e-challan status
    setViolations((prev) =>
      prev.map((v) =>
        v.id === disputeData.violationId || v.vehicleRegistration === disputeData.vehicleRegistration
          ? { ...v, disputeStatus: 'PENDING_REVIEW' }
          : v
      )
    );

    setEChallans((prev) =>
      prev.map((ch) =>
        ch.vehicleRegistration === disputeData.vehicleRegistration
          ? { ...ch, paymentStatus: 'UNDER_DISPUTE' }
          : ch
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        priority: 'WARNING',
        title: `Challan Dispute Filed: ${newDispute.vehicleRegistration}`,
        message: `Dispute filed under ${newDispute.disputeType.replace('_', ' ')}: ${newDispute.narrativeReason.slice(0, 80)}...`,
        location: 'Citizen Grievance Desk',
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'disputes', id: newDispute.id },
      },
      ...prev,
    ]);

    addAuditLog(
      'CHALLAN_DISPUTE_SUBMITTED',
      `Dispute ${newDispute.id} for ${newDispute.vehicleRegistration} (${newDispute.disputeType})`
    );

    return newDispute;
  };

  const reviewChallanDispute = (
    disputeId: string,
    action: 'APPROVE' | 'REJECT',
    remarks: string,
    officerName: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: action === 'APPROVE' ? 'APPROVED_WAIVED' : 'REJECTED',
            reviewedBy: officerName,
            reviewTimestamp: timestamp,
            officerRemarks: remarks,
          };
        }
        return d;
      })
    );

    const targetDispute = disputes.find((d) => d.id === disputeId);

    if (targetDispute) {
      setViolations((prev) =>
        prev.map((v) => {
          if (
            v.id === targetDispute.violationId ||
            v.vehicleRegistration === targetDispute.vehicleRegistration
          ) {
            return {
              ...v,
              status: action === 'APPROVE' ? 'WAIVED_MEDICAL_EMERGENCY' : v.status,
              penaltyAmount: action === 'APPROVE' ? 0 : v.penaltyAmount,
              disputeStatus: action === 'APPROVE' ? 'APPROVED_WAIVED' : 'REJECTED',
            };
          }
          return v;
        })
      );

      setEChallans((prev) =>
        prev.map((ch) => {
          if (ch.vehicleRegistration === targetDispute.vehicleRegistration) {
            return {
              ...ch,
              paymentStatus: action === 'APPROVE' ? 'WAIVED_MEDICAL_EMERGENCY' : 'UNPAID',
              penaltyAmount: action === 'APPROVE' ? 0 : ch.penaltyAmount,
            };
          }
          return ch;
        })
      );

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          priority: action === 'APPROVE' ? 'INFO' : 'WARNING',
          title: `Dispute ${action === 'APPROVE' ? 'Approved (Waived)' : 'Rejected'}: ${targetDispute.vehicleRegistration}`,
          message:
            action === 'APPROVE'
              ? `Medical emergency verified by ${officerName}. Challan penalty waived to ₹0.`
              : `Dispute rejected by ${officerName}. Statutory penalty enforced. Remarks: ${remarks}`,
          location: 'SARTHI Verification Desk',
          timestamp: 'Just now',
          read: false,
          actionTarget: { view: 'disputes' },
        },
        ...prev,
      ]);

      addAuditLog(
        action === 'APPROVE' ? 'CHALLAN_WAIVER_APPROVED' : 'CHALLAN_DISPUTE_REJECTED',
        `Dispute ${disputeId} (${targetDispute.vehicleRegistration}) by ${officerName}`
      );
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
    addAuditLog('INCIDENT_STATUS_UPDATE', `Incident ${id} -> ${status}`);
  };

  const activateEmergencyCorridor = () => {
    setEmergencyCorridor((prev) => ({
      ...prev,
      isActive: true,
      currentEtaMinutes: 8,
      stepStatus: 'CLEARANCE_IN_PROGRESS',
      controlPoints: prev.controlPoints.map((cp, idx) => ({
        ...cp,
        status: idx === 0 ? 'CLEARANCE_REQUIRED' : idx === 1 ? 'CLEARING' : 'CLEAR',
      })),
    }));

    const alertId = `notif-${Date.now()}`;
    setNotifications((prev) => [
      {
        id: alertId,
        priority: 'CRITICAL',
        title: 'Emergency Green Corridor Engaged',
        message: 'Ambulance UK07EM102 green corridor engaged. Traffic marshals notified at Bhimtal & Tallital.',
        location: 'Bhimtal Chowk to District Hospital',
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'emergency' },
      },
      ...prev,
    ]);

    addAuditLog('EMERGENCY_CORRIDOR_DISPATCH', 'Active Corridor EC-NAI-2026-042');
  };

  const markControlPointClear = (cpId: string) => {
    setEmergencyCorridor((prev) => {
      const updatedCPs = prev.controlPoints.map((cp) =>
        cp.id === cpId ? { ...cp, status: 'CLEAR' as const } : cp
      );
      const allClear = updatedCPs.every((cp) => cp.status === 'CLEAR');
      const newEta = Math.max(1, prev.currentEtaMinutes - 2);

      return {
        ...prev,
        controlPoints: updatedCPs,
        currentEtaMinutes: newEta,
        stepStatus: allClear ? 'ROUTE_CLEAR' : 'CLEARANCE_IN_PROGRESS',
      };
    });

    addAuditLog('TRAFFIC_POINT_CLEARED', `Point ${cpId} marked CLEAR`);
  };

  const flagVehicleForOverspeedDemo = (targetReg: string = 'UK07AB1234') => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.registrationNumber === targetReg) {
          return {
            ...v,
            currentSpeed: 118,
            excessSpeed: 38,
            category: 'OVERSPEED',
            durationSeconds: v.durationSeconds + 30,
            lastUpdated: 'Just now',
          };
        }
        return v;
      })
    );

    const newViolation: ViolationRecord = {
      id: `VIO-${Date.now().toString().slice(-4)}`,
      vehicleRegistration: targetReg,
      vehicleType: 'Car (Tata Nexon)',
      road: 'NH-87 Kathgodam-Bhimtal Road',
      location: 'NH-87 Mile 14, Near Bhimtal Bypass',
      speedLimit: 80,
      recordedSpeed: 118,
      excessSpeed: 38,
      durationSeconds: 184,
      timestamp: new Date().toLocaleTimeString(),
      status: 'CRITICAL',
      requiresVerification: true,
      penaltyAmount: 2000,
      disputeStatus: 'NO_DISPUTE',
      lat: 29.3432,
      lng: 79.5562,
      telemetryHistory: [
        { time: 'T-40s', speed: 85, limit: 80 },
        { time: 'T-30s', speed: 92, limit: 80 },
        { time: 'T-20s', speed: 104, limit: 80 },
        { time: 'T-10s', speed: 112, limit: 80 },
        { time: 'Current', speed: 118, limit: 80 },
      ],
    };

    setViolations((prev) => [newViolation, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        priority: 'CRITICAL',
        title: `Overspeed Detected: ${targetReg}`,
        message: `Speed 118 km/h (+38 km/h over 80 km/h limit) on NH-87. Statutory evidence compiled.`,
        location: 'NH-87 Mile 14',
        timestamp: 'Just now',
        read: false,
        actionTarget: { view: 'speed', id: newViolation.id },
      },
      ...prev,
    ]);

    addAuditLog('OVERSPEED_VIOLATION_DETECTED', `Vehicle ${targetReg} excess +38 km/h`);
  };

  const startSimulation = () => setIsSimulating(true);
  const pauseSimulation = () => setIsSimulating(false);
  const resetSimulation = () => {
    setVehicles(enrichedInitialVehicles);
    setViolations(INITIAL_VIOLATIONS);
    setDisputes(INITIAL_DISPUTES);
    setEChallans(INITIAL_ECHALLANS);
    setEmergencyCorridor(INITIAL_EMERGENCY_CORRIDOR);
    setIncidents(INITIAL_INCIDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedVehicle(null);
    setSelectedViolation(null);
    setSelectedVehicleForChallan(null);
    setSurveillanceTarget(null);
    setIsSimulating(true);
    addAuditLog('SIMULATION_ENGINE_RESET', 'Default telemetry state restored');
  };

  // Main high-precision highway-clamped simulation tick loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = Math.max(1000, Math.floor(2500 / simulationSpeed));
    const interval = setInterval(() => {
      tickCountRef.current += 1;
      const tick = tickCountRef.current;

      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.category === 'INCIDENT') {
            return vehicle;
          }

          const corridorId = vehicle.corridorId || 'NH87_KATHGODAM_BHIMTAL';
          const corridor = CORRIDOR_WAYPOINTS[corridorId] || CORRIDOR_WAYPOINTS.NH87_KATHGODAM_BHIMTAL;
          const points = corridor.points;
          const totalPoints = points.length;

          let segIdx = vehicle.segmentIndex ?? 0;
          let prog = vehicle.progressFraction ?? 0;
          let dir = vehicle.direction ?? 1;

          // Speed step along polyline
          const stepSize = Math.max(0.04, (vehicle.currentSpeed / 100) * 0.12 * simulationSpeed);
          prog += stepSize * dir;

          if (prog >= 1.0) {
            prog = 0.0;
            segIdx += 1;
            if (segIdx >= totalPoints - 1) {
              // Reached highway terminus - reverse smoothly
              dir = -1;
              segIdx = Math.max(0, totalPoints - 2);
              prog = 1.0;
            }
          } else if (prog <= 0.0) {
            prog = 1.0;
            segIdx -= 1;
            if (segIdx < 0) {
              // Reached highway start - forward smoothly
              dir = 1;
              segIdx = 0;
              prog = 0.0;
            }
          }

          const validSegIdx = Math.max(0, Math.min(totalPoints - 2, segIdx));
          const pA = points[validSegIdx];
          const pB = points[validSegIdx + 1] || pA;

          // Clamped linear interpolation strictly along road segment
          const newLat = pA[0] + (pB[0] - pA[0]) * Math.max(0, Math.min(1, prog));
          const newLng = pA[1] + (pB[1] - pA[1]) * Math.max(0, Math.min(1, prog));

          // Tangent heading angle calculation
          const dy = (pB[0] - pA[0]) * dir;
          const dx = (pB[1] - pA[1]) * dir;
          const headingDeg = Math.round((Math.atan2(dx, dy) * (180 / Math.PI) + 360) % 360);

          // Speed fluctuation
          const fluctuation = (Math.random() - 0.48) * 3;
          let newSpeed = Math.round(Math.max(20, vehicle.currentSpeed + fluctuation));

          if (vehicle.registrationNumber === 'UK07AB1234') {
            newSpeed = Math.max(98, Math.min(124, newSpeed));
          }

          const excess = Math.max(0, newSpeed - vehicle.speedLimit);
          let newCategory = vehicle.category;

          if (
            vehicle.category === 'NORMAL' ||
            vehicle.category === 'WARNING' ||
            vehicle.category === 'OVERSPEED'
          ) {
            if (excess > 18) {
              newCategory = 'OVERSPEED';
            } else if (excess >= 5) {
              newCategory = 'WARNING';
            } else {
              newCategory = 'NORMAL';
            }
          }

          return {
            ...vehicle,
            lat: Number(newLat.toFixed(6)),
            lng: Number(newLng.toFixed(6)),
            heading: headingDeg,
            segmentIndex: validSegIdx,
            progressFraction: prog,
            direction: dir,
            currentSpeed: newSpeed,
            excessSpeed: excess,
            durationSeconds: excess > 0 ? vehicle.durationSeconds + 3 : 0,
            lastUpdated: '1s ago',
          };
        })
      );

      if (tick % 4 === 0) {
        setEmergencyCorridor((prev) => {
          if (!prev.isActive) return prev;
          if (prev.currentEtaMinutes <= 1) {
            return {
              ...prev,
              stepStatus: 'VEHICLE_PASSING',
              currentEtaMinutes: 1,
            };
          }
          return {
            ...prev,
            currentEtaMinutes: prev.currentEtaMinutes - 1,
          };
        });
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        simulationSpeed,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        setSimulationSpeed,
        vehicles,
        violations,
        disputes,
        eChallans,
        emergencyCorridor,
        incidents,
        notifications,
        auditLogs,
        selectedVehicle,
        setSelectedVehicle,
        selectedViolation,
        setSelectedViolation,
        selectedVehicleForChallan,
        setSelectedVehicleForChallan,
        surveillanceTarget,
        setSurveillanceTarget,
        selectedCaseId,
        setSelectedCaseId,
        currentDistrict,
        setCurrentDistrict,
        currentView,
        setCurrentView,
        activateEmergencyCorridor,
        markControlPointClear,
        updateIncidentStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
        flagVehicleForOverspeedDemo,
        registerNewVehicle,
        submitChallanDispute,
        reviewChallanDispute,
        issueEChallan,
        payEChallan,
        getVehicleRC,
        isDemoTourActive,
        setIsDemoTourActive,
        demoStepIndex,
        setDemoStepIndex,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
