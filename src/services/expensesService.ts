import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseStats, ExpenseFilters } from '@/types/expense';
import { api } from '@/lib/api';

export const expensesService = {
  async createExpense(data: ExpenseCreate): Promise<Expense> {
    const response = await api.post<{ data: Expense }>('/expenses', data);
    return response.data;
  },

  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params: Record<string, string | number | boolean> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.category) params.category = filters.category;
    if (filters?.minAmount) params.minAmount = filters.minAmount;
    if (filters?.maxAmount) params.maxAmount = filters.maxAmount;
    if (filters?.searchQuery) params.search = filters.searchQuery;

    const response = await api.get<{ data: Expense[] }>('/expenses', { params });
    return response.data;
  },

  async getExpenseById(id: string): Promise<Expense> {
    const response = await api.get<{ data: Expense }>(`/expenses/${id}`);
    return response.data;
  },

  async updateExpense(id: string, data: ExpenseUpdate): Promise<Expense> {
    const response = await api.put<{ data: Expense }>(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async getStats(): Promise<ExpenseStats> {
    const response = await api.get<{ data: ExpenseStats }>('/expenses/stats');
    return response.data;
  },

  async exportCSV(): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/expenses/export`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export expenses');
    }

    return response.blob();
  },
};
