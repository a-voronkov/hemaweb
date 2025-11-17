/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  roleId: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    code: string;
    name: string;
  };
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: string | null;
  bloodTypeId: string | null;
  availabilityStatusId: string | null;
  isDonorVerified: boolean;
  lastDonationDate: string | null;
  nextEligibleDate: string | null;
  locationLat: number | null;
  locationLng: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
}

export interface AuthResponse {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  bloodTypeId?: string;
  availabilityStatusId?: string;
  locationLat?: number;
  locationLng?: number;
}

