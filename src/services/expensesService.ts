import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseStats, ExpenseFilters } from '@/types/expense';
import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const expensesService = {
  async createExpense(data: ExpenseCreate): Promise<Expense> {
    const response = await api.post<ApiResponse<Expense>>('/expenses', data);
    return response.data;
  },

  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params: Record<string, string | number | boolean> = {};
    // Support month filter like Postman collection
    if (filters?.month) params.month = filters.month;
    if (filters?.category) params.category = filters.category;
    // Keep other filters for compatibility
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.minAmount) params.minAmount = filters.minAmount;
    if (filters?.maxAmount) params.maxAmount = filters.maxAmount;
    if (filters?.searchQuery) params.search = filters.searchQuery;

    const response = await api.get<ApiResponse<Expense[]>>('/expenses', { params });
    return response.data;
  },

  async getExpenseById(id: string): Promise<Expense> {
    const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
    return response.data;
  },

  async updateExpense(id: string, data: ExpenseUpdate): Promise<Expense> {
    const response = await api.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/expenses/${id}`);
  },

  async getStats(): Promise<ExpenseStats> {
    const response = await api.get<ApiResponse<ExpenseStats>>('/expenses/stats');
    return response.data;
  },

  async exportCSV(month?: string): Promise<Blob> {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    let url = `${baseURL}/expenses/export`;
    if (month) {
      url += `?month=${month}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export expenses');
    }

    return response.blob();
  },
};
