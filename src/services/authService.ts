import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  tokens: TokenResponse;
  user: User;
}

interface LoginResponse {
  tokens: TokenResponse;
  user: User;
}

export const authService = {
  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data.user;
  },

  async login(data: LoginRequest): Promise<User> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data.user;
  },

  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse<null>>('/auth/logout', {});
    } finally {
      api.clearAuthTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
