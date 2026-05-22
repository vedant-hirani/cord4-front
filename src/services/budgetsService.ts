import type { Budget, BudgetCreate, BudgetAlert } from '@/types/budget';
import { api } from '@/lib/api';

export const budgetsService = {
  async createBudget(data: BudgetCreate): Promise<Budget> {
    const response = await api.post<{ data: Budget }>('/budgets', data);
    return response.data;
  },

  async getBudgets(): Promise<Budget[]> {
    const response = await api.get<{ data: Budget[] }>('/budgets');
    return response.data;
  },

  async getBudgetById(id: string): Promise<Budget> {
    const response = await api.get<{ data: Budget }>(`/budgets/${id}`);
    return response.data;
  },

  async updateBudget(id: string, data: Partial<BudgetCreate>): Promise<Budget> {
    const response = await api.put<{ data: Budget }>(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },

  async getAlerts(): Promise<BudgetAlert[]> {
    const response = await api.get<{ data: BudgetAlert[] }>('/budgets/alerts');
    return response.data;
  },
};
