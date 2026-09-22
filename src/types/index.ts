export type UserRole =
  | 'SUPER_ADMIN'
  | 'TRAFFIC_OFFICER'
  | 'POLICE_OFFICER'
  | 'EMERGENCY_OPERATOR'
  | 'ANALYST';

export interface UserProfile {
  id: string;
  name: string;
  badgeId: string;
  role: UserRole;
  department: string;
  district: string;
}

export type VehicleCategory =
  | 'NORMAL'
  | 'WARNING'
  | 'OVERSPEED'
  | 'EMERGENCY'
  | 'STOLEN'
  | 'INCIDENT';

export interface VehicleRCDetails {
  registrationNumber: string;
  ownerName: string;
  fatherHusbandName: string;
  registeredAddress: string;
  rtoName: string;
  vehicleClass: string;
  makeModel: string;
  makerDescription: string;
  bodyType: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG' | 'HYBRID';
  emissionNorms: string;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: string;
  vehicleAge: string;
  fitnessValidUpto: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insuranceValidUpto: string;
  puccNumber: string;
  puccValidUpto: string;
  hypothecatedTo?: string;
  color: string;
  seatingCapacity: number;
  unladenWeightKg: number;
  mobileNumber: string;
}

export interface EChallanRecord {
  challanNumber: string;
  violationId?: string;
  vehicleRegistration: string;
  vehicleType: string;
  ownerName: string;
  mobileNumber: string;
  offenseSection: string;
  offenseTitle: string;
  offenseDescription: string;
  recordedSpeed?: number;
  speedLimit?: number;
  penaltyAmount: number;
  location: string;
  roadCorridor: string;
  issuingOfficerName: string;
  issuingOfficerBadge: string;
  cameraSource: string;
  timestamp: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'UNDER_DISPUTE' | 'WAIVED_MEDICAL_EMERGENCY';
  smsSent: boolean;
  smsDispatchTimestamp: string;
  paymentDueDate: string;
  transactionRef?: string;
  paidAtTimestamp?: string;
  qrCodeData?: string;
}

export interface ChallanIssuanceInput {
  vehicleRegistration: string;
  offenseSection: string;
  offenseTitle: string;
  offenseDescription: string;
  penaltyAmount: number;
  location: string;
  roadCorridor: string;
  cameraSource: string;
  officerRemarks?: string;
  recordedSpeed?: number;
  speedLimit?: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: 'Car' | 'Heavy Vehicle' | 'Two-Wheeler' | 'Bus' | 'Ambulance' | 'Fire Tender' | 'Police Cruiser';
  category: VehicleCategory;
  currentSpeed: number;
  speedLimit: number;
  excessSpeed: number;
  durationSeconds: number;
  road: string;
  locationName: string;
  lat: number;
  lng: number;
  heading: number;
  lastUpdated: string;
  dataSource: string; // 'SIMULATED TELEMETRY'
  repeatCount?: number;
  stolenCaseId?: string;
  emergencyPriority?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  emergencyDestination?: string;
  emergencyEtaMinutes?: number;
  ownerName?: string;
  chassisNumber?: string;
  mobileNumber?: string;
  makeModel?: string;
  color?: string;
  year?: number;
  // Highway road clamping properties
  corridorId?: string;
  segmentIndex?: number;
  progressFraction?: number;
  direction?: number; // 1 = forward, -1 = reverse
  // Challan ledger summary
  totalChallansCount?: number;
  pendingChallanAmount?: number;
  rcDetails?: VehicleRCDetails;
}

export interface ViolationRecord {
  id: string;
  vehicleRegistration: string;
  vehicleType: string;
  road: string;
  location: string;
  speedLimit: number;
  recordedSpeed: number;
  excessSpeed: number;
  durationSeconds: number;
  timestamp: string;
  status: 'WARNING' | 'CRITICAL' | 'UNDER_REVIEW' | 'VERIFIED' | 'WAIVED_MEDICAL_EMERGENCY';
  telemetryHistory: { time: string; speed: number; limit: number }[];
  lat: number;
  lng: number;
  requiresVerification: boolean;
  penaltyAmount: number;
  disputeStatus?: 'NO_DISPUTE' | 'PENDING_REVIEW' | 'APPROVED_WAIVED' | 'REJECTED';
  challanNumber?: string;
}

export interface ChallanDispute {
  id: string;
  violationId: string;
  challanNumber?: string;
  vehicleRegistration: string;
  applicantName: string;
  applicantPhone: string;
  disputeType:
    | 'MEDICAL_EMERGENCY'
    | 'DUTY_EXEMPTION'
    | 'CALIBRATION_DISPUTE'
    | 'VEHICLE_MISIDENTIFIED';
  narrativeReason: string;
  hospitalName?: string;
  doctorName?: string;
  documentName: string;
  documentData?: string;
  submissionTimestamp: string;
  status: 'PENDING_REVIEW' | 'APPROVED_WAIVED' | 'REJECTED';
  reviewedBy?: string;
  reviewTimestamp?: string;
  officerRemarks?: string;
}

export interface VehicleRegistrationData {
  registrationNumber: string;
  vehicleType: 'Car' | 'Heavy Vehicle' | 'Two-Wheeler' | 'Bus' | 'Ambulance';
  ownerName: string;
  mobileNumber: string;
  chassisNumber: string;
  roadCorridor: string;
  speedLimit: number;
  deviceImei: string;
}

export interface StolenVehicleCase {
  caseId: string;
  registrationNumber: string;
  makeModel: string;
  color: string;
  reportedDate: string;
  reportingStation: string;
  lastSeenLocation: string;
  lastSeenTimestamp: string;
  lat: number;
  lng: number;
  status: 'ACTIVE_SEARCH' | 'LOCATED_SIMULATED' | 'INTERCEPT_COORDINATED';
  officerInCharge: string;
  notes: string;
}

export interface ControlPoint {
  id: string;
  name: string;
  road: string;
  status: 'CLEARANCE_REQUIRED' | 'CLEARING' | 'CLEAR';
  officerAssigned: string;
  contactNumber: string;
  lat: number;
  lng: number;
  distanceFromAmbulanceKm: number;
}

export interface EmergencyCorridor {
  corridorId: string;
  vehicleId: string;
  vehicleReg: string;
  vehicleType: 'AMBULANCE' | 'FIRE_BRIGADE' | 'POLICE';
  origin: string;
  destination: string;
  priority: 'CRITICAL' | 'HIGH';
  isActive: boolean;
  currentEtaMinutes: number;
  totalDistanceKm: number;
  stepStatus:
    | 'REQUEST_RECEIVED'
    | 'ROUTE_CREATED'
    | 'UNITS_ALERTED'
    | 'CLEARANCE_IN_PROGRESS'
    | 'ROUTE_CLEAR'
    | 'VEHICLE_PASSING';
  controlPoints: ControlPoint[];
  routeCoordinates: [number, number][];
}

export interface Incident {
  id: string;
  title: string;
  type: 'Accident' | 'Traffic Jam' | 'Overspeeding' | 'Road Hazard' | 'Stolen Vehicle' | 'Emergency Response';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  road: string;
  lat: number;
  lng: number;
  timestamp: string;
  assignedUnit: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
  description: string;
}

export interface RiskZone {
  id: string;
  roadName: string;
  district: string;
  riskScore: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  incidentsCount: number;
  overspeedEventsCount: number;
  accidentsCount: number;
  averageSpeedKmH: number;
  highRiskPeriod: string;
  keyHazards: string[];
  coordinates: [number, number][];
}

export interface AlertNotification {
  id: string;
  priority: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  location: string;
  timestamp: string;
  read: boolean;
  assignedOfficer?: string;
  actionTarget?: { view: string; id?: string };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  action: string;
  resource: string;
  ipAddress: string;
  result: 'SUCCESS' | 'FLAGGED' | 'DENIED';
}

export interface AISafetyForecast {
  road: string;
  currentRiskScore: number;
  forecast6h: { hour: string; expectedRisk: number; predictedCongestion: number }[];
  aiRecommendation: string;
  riskFactors: string[];
}
