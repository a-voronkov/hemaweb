/**
 * Authentication API Service
 */

import { api } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UserProfile,
  UpdateProfileRequest,
} from '@/types/auth';

export const authApi = {
  /**
   * Register a new user
   */
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),

  /**
   * Login user
   */
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  /**
   * Logout user
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Get current user
   */
  getCurrentUser: (token?: string) =>
    api.get<{ user: User }>('/auth/me', token),

  /**
   * Validate session
   */
  validateSession: (token?: string) =>
    api.get<{ valid: boolean; session: any; user: User }>('/auth/session', token),

  /**
   * Send verification email
   */
  sendVerificationEmail: (token: string) =>
    api.post<{ message: string }>('/auth/send-verification', {}, token),

  /**
   * Verify email with token
   */
  verifyEmail: (verificationToken: string) =>
    api.get<{ message: string }>(`/auth/verify-email?token=${verificationToken}`),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) =>
    api.post<{ message: string }>('/auth/request-reset', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    }),
};

export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: (token: string) =>
    api.get<UserProfile>('/users/me/profile', token),

  /**
   * Update current user profile
   */
  updateProfile: (data: UpdateProfileRequest, token: string) =>
    api.put<UserProfile>('/users/me/profile', data, token),

  /**
   * Get user by ID
   */
  getUserById: (userId: string, token: string) =>
    api.get<{ user: User }>(`/users/${userId}`, token),

  /**
   * Get user profile by ID
   */
  getUserProfileById: (userId: string, token: string) =>
    api.get<UserProfile>(`/users/${userId}/profile`, token),
};

