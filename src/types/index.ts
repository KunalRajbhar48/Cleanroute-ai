export type WasteCategory =
  | 'Plastic'
  | 'Organic'
  | 'Mixed Municipal'
  | 'Construction'
  | 'Hazardous'
  | 'Electronic'
  | 'Metal';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export type UserRole = 'citizen' | 'officer' | 'worker' | 'admin';

export interface AIClassificationResult {
  category: WasteCategory;
  confidence: number; // e.g. 94%
  severity: SeverityLevel;
  duplicateProbability: number; // e.g. 8%
  matchedDuplicateId?: string;
  recommendedAction: string;
  estimatedVolumeKg?: number;
  recyclabilityScore?: number;
}

export interface Complaint {
  id: string; // e.g. CR-1024
  title: string;
  description: string;
  category: WasteCategory;
  severity: SeverityLevel;
  status: ComplaintStatus;
  locationName: string;
  ward: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  reportedAt: string; // ISO string
  citizenName: string;
  citizenPhone: string;
  aiClassification: AIClassificationResult;
  assignedVehicleId?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface CollectionVehicle {
  id: string; // e.g. V-102
  registrationNo: string;
  driverName: string;
  driverPhone: string;
  currentWard: string;
  latitude: number;
  longitude: number;
  capacityTons: number;
  currentLoadTons: number;
  fuelLevelPercent: number;
  status: 'Available' | 'Collecting' | 'Maintenance' | 'Offline';
  assignedRouteComplaintIds: string[];
}

export interface PredictiveHotspot {
  id: string; // e.g. HS-101
  ward: string;
  locationName: string;
  latitude: number;
  longitude: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  predictionConfidence: number; // e.g. 89%
  predictedAccumulationHours: number; // e.g. 24h
  historicalComplaintsCount: number;
  primaryWasteType: WasteCategory;
  recommendedAction: string;
  riskTrend: 'Increasing' | 'Stable' | 'Decreasing';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
  linkPage?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionLink?: {
    label: string;
    page: string;
  };
}
