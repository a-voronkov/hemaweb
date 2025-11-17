// Shared types for HemaWeb

// User roles
export enum UserRole {
  DONOR_UNVERIFIED = 'donor_unverified',
  DONOR_VERIFIED = 'donor_verified',
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  SYSTEM_ADMIN = 'system_admin',
}

// Blood types
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

// Donor availability status
export enum AvailabilityStatus {
  AVAILABLE = 'available',
  EMERGENCIES_ONLY = 'emergencies_only',
  UNAVAILABLE = 'unavailable',
}

// Blood drive types
export enum BloodDriveType {
  SCHEDULED = 'scheduled',
  EMERGENCY = 'emergency',
}

// Blood drive status
export enum BloodDriveStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Location type (for PostGIS)
export interface Location {
  latitude: number;
  longitude: number;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Date range filter
export interface DateRangeFilter {
  from?: Date | string;
  to?: Date | string;
}

