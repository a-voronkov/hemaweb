/**
 * API Client for HemaWeb
 * Handles all HTTP requests to the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: 'include', // Include cookies for session
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new APIError(
      data?.message || 'An error occurred',
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  // GET request
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  // POST request
  post: <T>(endpoint: string, body?: any, token?: string) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      token,
    }),

  // PUT request
  put: <T>(endpoint: string, body?: any, token?: string) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      token,
    }),

  // DELETE request
  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),

  // Get current user
  async getCurrentUser(): Promise<User> {
    return request<User>('/users/me');
  },

  // Update profile
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
  }): Promise<User> {
    return request<User>('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

