export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCreate {
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
}

export interface ExpenseUpdate {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  receipt?: string;
}

export interface ExpenseStats {
  totalSpent: number;
  monthlySpent: number;
  averageExpense: number;
  categoryBreakdown: Record<string, number>;
  trends: { month: string; amount: number }[];
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}
