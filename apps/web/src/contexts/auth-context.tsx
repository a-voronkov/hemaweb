'use client';

/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authApi.getCurrentUser();
      // Add convenience fields from profile
      const userData = {
        ...response.user,
        firstName: response.user.profile?.firstName,
        lastName: response.user.profile?.lastName,
        phoneNumber: response.user.profile?.phoneNumber,
        dateOfBirth: response.user.profile?.dateOfBirth,
        gender: response.user.profile?.gender,
        address: response.user.profile?.address,
        bloodType: response.user.profile?.bloodType,
      };
      setUser(userData);
    } catch (err) {
      // User not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authApi.login(data);
      const userData = {
        ...response.user,
        firstName: response.user.profile?.firstName,
        lastName: response.user.profile?.lastName,
        phoneNumber: response.user.profile?.phoneNumber,
        dateOfBirth: response.user.profile?.dateOfBirth,
        gender: response.user.profile?.gender,
        address: response.user.profile?.address,
        bloodType: response.user.profile?.bloodType,
      };
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authApi.register(data);
      const userData = {
        ...response.user,
        firstName: response.user.profile?.firstName,
        lastName: response.user.profile?.lastName,
        phoneNumber: response.user.profile?.phoneNumber,
        dateOfBirth: response.user.profile?.dateOfBirth,
        gender: response.user.profile?.gender,
        address: response.user.profile?.address,
        bloodType: response.user.profile?.bloodType,
      };
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

