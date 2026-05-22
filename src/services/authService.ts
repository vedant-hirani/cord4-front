import type { LoginRequest, RegisterRequest, User } from '@/types/auth';
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

interface AuthData {
  tokens: TokenResponse;
  user: User;
}

export const authService = {
  async register(data: RegisterRequest & { role?: string }): Promise<User> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', {
      ...data,
      role: data.role ?? 'user',
    });
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data.user;
  },

  async login(data: LoginRequest): Promise<User> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
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

  async refreshTokens(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const response = await api.post<ApiResponse<{ tokens: TokenResponse }>>('/auth/refresh', {
      refreshToken,
    });
    if (response.data?.tokens) {
      api.setAuthToken(response.data.tokens.accessToken);
      api.setRefreshToken(response.data.tokens.refreshToken);
    }
  },

  // GET /users/me — matches Postman collection
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post<ApiResponse<null>>('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
