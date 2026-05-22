export interface Expense {
  _id?: string;   // MongoDB field from API
  id: string;     // normalised
  userId?: string;
  user?: string;
  amount: number;
  category: string;
  description?: string;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExpenseCreate {
  amount: number;
  category: string;
  date: string;
  note?: string;
  description?: string;
}

export interface ExpenseUpdate {
  amount?: number;
  category?: string;
  date?: string;
  note?: string;
  description?: string;
}

export interface ExpenseFilters {
  month?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}
