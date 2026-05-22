import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { budgetsService } from '@/services/budgetsService';
import type { BudgetAlert } from '@/types/budget';
import {
  SlidersHorizontal, Gauge, Trash2, AlertTriangle,
  CheckCircle, XCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ────────────────────────────────────────────────
const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

const STATUS_THEME = {
  normal: {
    bar:    'bg-emerald-500',
    badge:  'bg-emerald-500/15 text-emerald-400',
    border: 'border-emerald-500/20',
    text:   'text-emerald-400',
    icon:   CheckCircle,
    pulse:  '',
  },
  warning: {
    bar:    'bg-amber-500 animate-pulse',
    badge:  'bg-amber-500/15 text-amber-400',
    border: 'border-amber-500/25',
    text:   'text-amber-400',
    icon:   AlertTriangle,
    pulse:  'animate-pulse',
  },
  danger: {
    bar:    'bg-rose-500',
    badge:  'bg-rose-500/15 text-rose-400',
    border: 'border-rose-500/30',
    text:   'text-rose-400',
    icon:   XCircle,
    pulse:  'animate-pulse',
  },
} as const;

// ── Month helpers ────────────────────────────────────────────
function toMonthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
}

function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ── Page ─────────────────────────────────────────────────────
export default function BudgetsPage() {
  const [month, setMonth]         = useState(() => new Date().toISOString().slice(0, 7));
  const [alerts, setAlerts]       = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [form, setForm] = useState({
    category: CATEGORIES[0],
    limit: '',
  });

  // ── Fetch alerts (real-time gauges) ──────────────────────
  const fetchAlerts = useCallback(async (m: string) => {
    setIsLoading(true);
    try {
      const data = await budgetsService.getAlerts(m);
      setAlerts(data);
    } catch (err) {
      console.error('Budget alerts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(month); }, [month, fetchAlerts]);

  // ── Month navigation ─────────────────────────────────────
  const handleMonthShift = (delta: number) => {
    setMonth((prev) => shiftMonth(prev, delta));
  };

  // ── Upsert budget ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const limitNum = parseFloat(form.limit);
    if (!form.limit || isNaN(limitNum) || limitNum < 0) {
      setFormError('Enter a valid limit amount (≥ 0).');
      return;
    }

    setIsSubmitting(true);
    try {
      await budgetsService.configureBudget({
        category: form.category,
        limit: limitNum,
        month,
      });
      setFormSuccess(`${form.category} limit set to $${limitNum.toFixed(2)} for ${toMonthLabel(month)}`);
      setForm({ ...form, limit: '' });
      fetchAlerts(month);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to set budget.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete budget ────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await budgetsService.deleteBudget(id);
      fetchAlerts(month);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="space-y-6">

        {/* ── Header + month nav ─────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Manager</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Set monthly spending limits per category and track real-time alerts
            </p>
          </div>

          {/* Month picker */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm w-fit">
            <button
              onClick={() => handleMonthShift(-1)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[130px] text-center">
              {toMonthLabel(month)}
            </span>
            <button
              onClick={() => handleMonthShift(1)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Left: Configure form ──────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-500" />
                <h3 className="text-base font-semibold text-gray-900">Configure Budget</h3>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Set or update a limit for {toMonthLabel(month)}
              </p>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Category pills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                          form.category === cat
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limit input */}
                <Input
                  label="Monthly Limit ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 500.00"
                  value={form.limit}
                  onChange={(e) => {
                    setForm({ ...form, limit: e.target.value });
                    setFormError('');
                    setFormSuccess('');
                  }}
                  error={formError}
                />

                {formSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-600 font-medium"
                  >
                    ✓ {formSuccess}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Apply Limit
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* ── Right: Real-time gauges ───────────────────── */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge size={16} className="text-indigo-500" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Real-time Limits & Alerts
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">{toMonthLabel(month)}</span>
                </div>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Spinner size="md" />
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <AlertTriangle size={32} className="text-gray-200" />
                    <p className="text-sm font-medium text-gray-400">
                      No budget limits configured for {toMonthLabel(month)}
                    </p>
                    <p className="text-xs text-gray-300">
                      Use the form on the left to set your first limit
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {alerts.map((item) => {
                        const theme = STATUS_THEME[item.status] ?? STATUS_THEME.normal;
                        const Icon  = theme.icon;
                        const pct   = Math.min(item.percentage, 100);
                        const isDeleting = deletingId === item.id;

                        return (
                          <motion.div
                            key={item.id ?? item.category}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${theme.border} bg-white`}
                          >
                            {/* Row 1: status badge + category + delete */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${theme.badge}`}>
                                  <Icon size={10} className={theme.pulse} />
                                  {item.status}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {item.category}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={isDeleting}
                                className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                                aria-label={`Delete ${item.category} budget`}
                              >
                                {isDeleting
                                  ? <Spinner size="sm" />
                                  : <Trash2 size={14} />}
                              </button>
                            </div>

                            {/* Row 2: spent / limit + percentage */}
                            <div className="flex justify-between text-xs font-semibold mb-2">
                              <span className="text-gray-500">
                                Spent{' '}
                                <span className="text-gray-900">${item.spent.toFixed(2)}</span>
                                {' '}/ ${item.limit.toFixed(2)}
                              </span>
                              <span className={`${theme.text} ${theme.pulse}`}>
                                {item.percentage.toFixed(1)}% used
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${theme.bar}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                              />
                            </div>

                            {/* Row 3: remaining */}
                            <p className="mt-1.5 text-right text-[11px] text-gray-400">
                              {item.remaining >= 0
                                ? `$${item.remaining.toFixed(2)} remaining`
                                : `$${Math.abs(item.remaining).toFixed(2)} over budget`}
                            </p>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
