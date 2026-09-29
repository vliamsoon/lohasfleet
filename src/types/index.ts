export type UserRole = 'owner' | 'management' | 'logistic';
export type Department = 'sales' | 'finance' | 'ops' | 'general';
export type UserStatus = 'pending' | 'active' | 'inactive';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department: Department;
  status: UserStatus;
  avatarUrl?: string;
  approvedBy?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSlot {
  isClaimed: boolean;
  adminUid?: string;
  adminEmail?: string;
  adminName?: string;
  claimedAt?: string;
}

export type DeliveryStatus =
  | 'draft'
  | 'scheduled'
  | 'out_for_delivery'
  | 'arrived'
  | 'delivered'
  | 'partial'
  | 'failed'
  | 'returned';

export interface LineItem {
  product: string;
  qty: number;
  unit: string;
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  doDate: string;
  customerName: string;
  addressText: string;
  postcode: string;
  state: string;
  phone: string;
  items: LineItem[];
  itemsSummary: string;
  weightKg: number;
  promisedDate: string;
  windowStart: string;
  windowEnd: string;
  status: DeliveryStatus;
  tripId?: string;
  stopSeq?: number;
  ocrConfidence: number;
  notes?: string;
  lat?: number;
  lng?: number;
  priority?: 'normal' | 'vip' | 'fragile';
  deliveredAt?: string;
  driverName?: string;
  assignedLorry?: string;
  podPhotoUrl?: string;
  podVerified?: boolean;
}

export type TripStatus = 'planned' | 'in_progress' | 'completed' | 'flagged' | 'cleared';
export type AuditStatus = 'open_flag' | 'cleared' | 'normal';

export interface TripWaypoint {
  seq: number;
  name: string;
  doNumber?: string;
  address: string;
  postcode: string;
  lat: number;
  lng: number;
  eta: string;
  promisedWindow: string;
  distFromPrevKm: number;
  status: 'on_time' | 'delay_risk' | 'completed' | 'pending';
  weightKg?: number;
}

export interface Trip {
  id: string;
  tripId: string;
  tripDate: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverTitle: string;
  plannedKm: number;
  startOdoKm: number;
  endOdoKm: number;
  odoDeltaKm: number;
  gpsSnappedKm: number;
  variancePct: number;
  status: TripStatus;
  auditStatus: AuditStatus;
  fuelPaidRm: number;
  fuelLitres?: number;
  fuelStation?: string;
  fuelReceiptNo?: string;
  odoAtPump?: number;
  tripFuelEconomy?: number;
  chillerHours?: number;
  chillerTemp?: string;
  detourNote?: string;
  auditorNote?: string;
  auditActor?: string;
  clearedBy?: string;
  clearedAt?: string;
  gpsPingsCount?: number;
  telematicsStatus?: string;
  waypoints?: TripWaypoint[];
  startOdoPhotoUrl?: string;
  endOdoPhotoUrl?: string;
  fuelReceiptPhotoUrl?: string;
}

export interface Vehicle {
  id: string;
  plateNo: string;
  name: string;
  type: string;
  fuelType: string;
  tankLitres: number;
  benchmarkKmPerL: number;
  currentOdometerKm: number;
  chillerTemp: string;
  status: 'active' | 'maintenance' | 'refueling';
  currentDriver?: string;
  currentLocation?: string;
}

export interface AuditFlag {
  id: string;
  tripId: string;
  type: 'mileage_variance' | 'odo_gap' | 'geofence' | 'fuel_efficiency' | 'gps_gap';
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  status: 'open' | 'cleared' | 'escalated';
  createdAt: string;
  clearedBy?: string;
  clearNote?: string;
}
