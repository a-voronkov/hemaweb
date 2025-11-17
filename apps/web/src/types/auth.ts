/**
 * Authentication Types
 */

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  bloodType: string | null;
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

export interface User {
  id: string;
  email: string;
  roleId: string;
  emailVerified: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    code: string;
    name: string;
  };
  profile: UserProfile | null;
  // Convenience fields from profile
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  bloodType?: string | null;
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

