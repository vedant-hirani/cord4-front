import { api } from '@/lib/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type RangeType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

// Matches real API: { name: "2026-05-22", amount: 84.50 }
export interface RechartsDataPoint {
  name: string;
  amount: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  count: number;   // number of transactions in this category
  color: string;   // hex from API e.g. "#ef4444"
}

export interface BudgetUsageItem {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface SpendingTrends {
  rechartsData: RechartsDataPoint[];
  chartjsData: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number; fill: boolean }[];
  };
  apexChartsData: {
    categories: string[];
    series: { name: string; data: number[] }[];
  };
}

export interface LastSixMonthsItem {
  label: string;
  amount: number;
}

export interface AnalyticsPeriod {
  rangeType: RangeType;
  startDate: string;
  endDate: string;
}

export interface AnalyticsData {
  period: AnalyticsPeriod;
  totalSpending: number;
  categoryBreakdown: CategoryBreakdownItem[];
  spendingTrends: SpendingTrends;
  budgetUsage: BudgetUsageItem[];
  topCategories: CategoryBreakdownItem[];
  lastSixMonthsTrends: LastSixMonthsItem[];
}

export interface AnalyticsParams {
  rangeType: RangeType;
  startDate?: string;
  endDate?: string;
  sortBy?: 'amount' | 'count';
  limit?: number;
}

export const analyticsService = {
  async getAnalytics(params: AnalyticsParams): Promise<AnalyticsData> {
    const queryParams: Record<string, string> = {
      rangeType: params.rangeType,
    };
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate)   queryParams.endDate   = params.endDate;
    if (params.sortBy)    queryParams.sortBy    = params.sortBy;
    if (params.limit)     queryParams.limit     = String(params.limit);

    const response = await api.get<ApiResponse<AnalyticsData>>('/dashboard/analytics', {
      params: queryParams,
    });
    return response.data;
  },
};
