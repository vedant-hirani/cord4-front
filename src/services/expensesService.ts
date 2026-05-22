import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseFilters } from '@/types/expense';
import { api } from '@/lib/api';
import { config } from '@/lib/config';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ExpenseListFilters {
  page?: number;
  limit?: number;
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
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

  // GET /expenses — paginated with full filter support
  async listExpenses(filters: ExpenseListFilters = {}): Promise<{ expenses: Expense[]; pagination: Pagination }> {
    const params: Record<string, string | number> = {};
    if (filters.page)      params.page      = filters.page;
    if (filters.limit)     params.limit     = filters.limit;
    if (filters.month)     params.month     = filters.month;
    if (filters.year)      params.year      = filters.year;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate)   params.endDate   = filters.endDate;
    if (filters.category)  params.category  = filters.category;

    const response = await api.get<ApiResponse<{ expenses: Expense[]; pagination: Pagination }>>('/expenses', { params });
    const raw = response.data;
    return {
      expenses:   (raw.expenses ?? []).map(normalise),
      pagination: raw.pagination,
    };
  },

  // GET /expenses — simple (for dashboard, no pagination)
  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params: Record<string, string | number | boolean> = {};
    if (filters?.month)       params.month     = filters.month;
    if (filters?.category)    params.category  = filters.category;
    if (filters?.startDate)   params.startDate = filters.startDate;
    if (filters?.endDate)     params.endDate   = filters.endDate;
    if (filters?.searchQuery) params.search    = filters.searchQuery;

    const response = await api.get<ApiResponse<{ expenses: Expense[] } | Expense[]>>('/expenses', { params });
    // Handle both response shapes
    const raw = response.data;
    const list = Array.isArray(raw) ? raw : (raw as { expenses: Expense[] }).expenses ?? [];
    return list.map(normalise);
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
    let url = `${config.apiBaseUrl}/expenses/export`;
    if (month) url += `?month=${month}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },

  // GET /expenses/export/pdf
  async exportPDF(filters: Record<string, string> = {}): Promise<void> {
    const qs = new URLSearchParams(filters).toString();
    const url = `${config.apiBaseUrl}/expenses/export/pdf${qs ? '?' + qs : ''}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    });
    if (!res.ok) throw new Error('PDF export failed: ' + res.status);
    const blob = await res.blob();
    const disposition = res.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? 'SpendAI_Report.pdf';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  },
};
