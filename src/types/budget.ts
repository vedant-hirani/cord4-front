export type BudgetStatus = 'normal' | 'warning' | 'danger';

// Matches GET /budgets list item
export interface Budget {
  _id: string;
  id?: string;
  userId?: string;
  user?: string;
  category: string;
  limit: number;
  month: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BudgetCreate {
  category: string;
  limit: number;
  month: string;
}

// Matches GET /budgets/alerts response item
export interface BudgetAlert {
  id: string;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
  month?: string;
}
