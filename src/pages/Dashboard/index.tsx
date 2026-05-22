import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ExpenseTable } from '@/components/dashboard/ExpenseTable';
import { BudgetAlerts } from '@/components/dashboard/BudgetAlerts';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { expensesService } from '@/services/expensesService';
import { budgetsService } from '@/services/budgetsService';
import { analyticsService } from '@/services/analyticsService';
import type { RangeType, AnalyticsData } from '@/services/analyticsService';
import type { Expense } from '@/types/expense';
import type { BudgetAlert } from '@/types/budget';
import { DollarSign, TrendingUp, AlertTriangle, Receipt, Plus, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const currentMonth = new Date().toISOString().slice(0, 7);

const RANGE_OPTIONS: { label: string; value: RangeType }[] = [
  { label: 'Daily',   value: 'daily'   },
  { label: 'Weekly',  value: 'weekly'  },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly',  value: 'yearly'  },
];

// Human-readable label for each range type
function rangePeriodLabel(rangeType: RangeType, period?: { startDate: string; endDate: string }): string {
  if (period) return `${period.startDate} → ${period.endDate}`;
  const now = new Date();
  switch (rangeType) {
    case 'daily':   return 'Today';
    case 'weekly':  return 'This week';
    case 'monthly': return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'yearly':  return String(now.getFullYear());
    default:        return '';
  }
}

export default function Dashboard() {
  const [expenses, setExpenses]     = useState<Expense[]>([]);
  const [alerts, setAlerts]         = useState<BudgetAlert[]>([]);
  const [analytics, setAnalytics]   = useState<AnalyticsData | null>(null);
  const [rangeType, setRangeType]   = useState<RangeType>('monthly');
  const [sortBy, setSortBy]         = useState<'amount' | 'count'>('amount');
  const [isLoading, setIsLoading]   = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Expenses + budget alerts — always current month (for table + alerts)
  const loadExpenses = useCallback(async () => {
    try {
      const [expensesData, alertsData] = await Promise.all([
        expensesService.getExpenses({ month: currentMonth }),
        budgetsService.getAlerts(currentMonth),
      ]);
      setExpenses(expensesData);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Expenses load error:', err);
    }
  }, []);

  // Analytics — re-fetched on range / sort change
  const loadAnalytics = useCallback(async (range: RangeType, sort: 'amount' | 'count' = 'amount') => {
    setIsChartLoading(true);
    try {
      const data = await analyticsService.getAnalytics({ rangeType: range, sortBy: sort, limit: 3 });
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setIsChartLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadExpenses(), loadAnalytics('monthly', 'amount')]);
      setIsLoading(false);
    };
    init();
  }, [loadExpenses, loadAnalytics]);

  const handleRangeChange = (range: RangeType) => {
    setRangeType(range);
    loadAnalytics(range, sortBy);
  };

  const handleSortChange = (sort: 'amount' | 'count') => {
    setSortBy(sort);
    loadAnalytics(rangeType, sort);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expensesService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await expensesService.exportCSV(currentMonth);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-${currentMonth}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleExpenseAdded = () => {
    setIsModalOpen(false);
    loadExpenses();
    loadAnalytics(rangeType, sortBy);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  // ── Derived values ────────────────────────────────────────

  const isYearly = rangeType === 'yearly';
  const periodLabel = rangePeriodLabel(rangeType, analytics?.period);

  // Total spending — from analytics (reflects selected range)
  const totalSpent = analytics?.totalSpending ?? 0;

  // Transaction count — sum of count across all categories in analytics
  // This reflects the selected range, not just current month
  const totalTxnCount = (analytics?.categoryBreakdown ?? []).reduce(
    (sum, cat) => sum + (cat.count ?? 0),
    0,
  );

  // Budget stats — only meaningful for non-yearly ranges
  const budgetUsage      = analytics?.budgetUsage ?? [];
  const totalLimit       = budgetUsage.reduce((s, b) => s + b.limit, 0);
  const totalBudgetSpent = budgetUsage.reduce((s, b) => s + b.spent, 0);
  const budgetPct        = totalLimit > 0 ? (totalBudgetSpent / totalLimit) * 100 : 0;
  const dangerCount      = alerts.filter((a) => a.status === 'danger').length;

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">{periodLabel}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download size={15} />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={15} />
              Add Expense
            </Button>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────── */}
        <motion.div
          key={rangeType}                   // re-animate cards on range switch
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid grid-cols-2 gap-3 ${isYearly ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}
        >
          {/* 1 — Total Spending (always shown, reflects selected range) */}
          <StatsCard
            icon={<DollarSign size={20} />}
            label="Total Spending"
            value={`$${totalSpent.toFixed(2)}`}
            color="blue"
            subtext={periodLabel}
          />

          {/* 2 — Transactions (count from analytics categoryBreakdown, reflects range) */}
          <StatsCard
            icon={<Receipt size={20} />}
            label="Transactions"
            value={totalTxnCount}
            color="blue"
            subtext={`${periodLabel} · across all categories`}
          />

          {/* 3 & 4 — Budget cards: hidden for yearly (budget is month-scoped) */}
          {!isYearly && (
            <>
              <StatsCard
                icon={<TrendingUp size={20} />}
                label="Budget Used"
                value={`${budgetPct.toFixed(1)}%`}
                color={budgetPct >= 100 ? 'red' : budgetPct >= 80 ? 'orange' : 'green'}
                subtext={`$${totalBudgetSpent.toFixed(2)} of $${totalLimit.toFixed(2)}`}
              />
              <StatsCard
                icon={<AlertTriangle size={20} />}
                label="Budget Alerts"
                value={alerts.length}
                color={dangerCount > 0 ? 'red' : 'orange'}
                subtext={dangerCount > 0 ? `${dangerCount} over limit` : 'All within limits'}
              />
            </>
          )}
        </motion.div>

        {/* ── Budget Alerts — hidden for yearly ──────────────── */}
        <AnimatePresence>
          {!isYearly && alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <BudgetAlerts alerts={alerts} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Range pill + Charts ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-3"
        >
          {/* Range selector */}
          <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 w-fit">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleRangeChange(opt.value)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  rangeType === opt.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SpendingChart
                data={analytics?.spendingTrends?.rechartsData ?? []}
                rangeType={rangeType}
                isLoading={isChartLoading}
              />
            </div>
            <div>
              <CategoryBreakdown
                categories={analytics?.topCategories ?? []}
                isLoading={isChartLoading}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Expense Table ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <ExpenseTable
            expenses={expenses}
            isLoading={isLoading}
            onDelete={handleDeleteExpense}
          />
        </motion.div>

      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleExpenseAdded}
      />
    </MainLayout>
  );
}
