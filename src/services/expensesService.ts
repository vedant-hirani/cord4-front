import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseFilters } from '@/types/expense';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Normalise MongoDB _id → id
function normalise(e: Expense): Expense {
  return { ...e, id: e.id ?? e._id ?? '' };
}

export const expensesService = {
  // POST /expenses
  async createExpense(data: ExpenseCreate): Promise<Expense> {
    const response = await api.post<ApiResponse<Expense>>('/expenses', data);
    return normalise(response.data);
  },

  // GET /expenses?month=YYYY-MM&category=...
  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params: Record<string, string | number | boolean> = {};
    if (filters?.month) params.month = filters.month;
    if (filters?.category) params.category = filters.category;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.minAmount) params.minAmount = filters.minAmount;
    if (filters?.maxAmount) params.maxAmount = filters.maxAmount;
    if (filters?.searchQuery) params.search = filters.searchQuery;

    const response = await api.get<ApiResponse<Expense[]>>('/expenses', { params });
    return (response.data ?? []).map(normalise);
  },

  // GET /expenses/stats
  async getStats(): Promise<Record<string, unknown>> {
    const response = await api.get<ApiResponse<Record<string, unknown>>>('/expenses/stats');
    return response.data;
  },

  // PUT /expenses/:id
  async updateExpense(id: string, data: ExpenseUpdate): Promise<Expense> {
    const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
    return normalise(response.data);
  },

  // DELETE /expenses/:id
  async deleteExpense(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/expenses/${id}`);
  },

  // GET /expenses/export?month=YYYY-MM  → CSV blob
  async exportCSV(month?: string): Promise<Blob> {
    const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';
    let url = `${baseURL}/expenses/export`;
    if (month) url += `?month=${month}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },
};
