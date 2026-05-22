import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';
import { api } from '@/lib/api';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } finally {
      api.clearAuthTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/me');
    return response.data;
  },
};
