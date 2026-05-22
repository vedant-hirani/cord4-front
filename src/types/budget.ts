export type BudgetStatus = 'normal' | 'warning' | 'danger';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  month: string;
  spent: number;
  status: BudgetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCreate {
  category: string;
  limit: number;
  month: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  status: BudgetStatus;
  message: string;
}
