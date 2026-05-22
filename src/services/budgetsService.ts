import type { Budget, BudgetCreate, BudgetAlert } from '@/types/budget';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normalise(b: Budget): Budget {
  return { ...b, id: b.id ?? b._id };
}

export const budgetsService = {
  // POST /budgets — upsert a monthly category limit
  async configureBudget(data: BudgetCreate): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>('/budgets', data);
    return normalise(response.data);
  },

  // GET /budgets?month=YYYY-MM — list configured budgets
  async getBudgets(month?: string): Promise<Budget[]> {
    const params: Record<string, string> = {};
    if (month) params.month = month;
    const response = await api.get<ApiResponse<Budget[]>>('/budgets', { params });
    return (response.data ?? []).map(normalise);
  },

  // DELETE /budgets/:id
  async deleteBudget(id: string): Promise<void> {
    await api.delete<ApiResponse<unknown>>(`/budgets/${id}`);
  },

  // GET /budgets/alerts?month=YYYY-MM
  async getAlerts(month?: string): Promise<BudgetAlert[]> {
    const params: Record<string, string> = {};
    if (month) params.month = month;
    const response = await api.get<ApiResponse<BudgetAlert[]>>('/budgets/alerts', { params });
    return response.data ?? [];
  },
};
