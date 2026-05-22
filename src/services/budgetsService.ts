import type { Budget, BudgetCreate, BudgetAlert } from '@/types/budget';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const budgetsService = {
  async createBudget(data: BudgetCreate): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>('/budgets', data);
    return response.data;
  },

  async getBudgets(): Promise<Budget[]> {
    const response = await api.get<ApiResponse<Budget[]>>('/budgets');
    return response.data;
  },

  async getBudgetById(id: string): Promise<Budget> {
    const response = await api.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data;
  },

  async updateBudget(id: string, data: Partial<BudgetCreate>): Promise<Budget> {
    const response = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/budgets/${id}`);
  },

  async getAlerts(month?: string): Promise<BudgetAlert[]> {
    const params: Record<string, string> = {};
    if (month) params.month = month;
    const response = await api.get<ApiResponse<BudgetAlert[]>>('/budgets/alerts', { params });
    return response.data;
  },
};
