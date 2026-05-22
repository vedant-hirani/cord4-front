import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { expensesService } from '@/services/expensesService';
import type { ExpenseListFilters, Pagination } from '@/services/expensesService';
import type { Expense } from '@/types/expense';
import {
  ChevronLeft, ChevronRight, Trash2, Download,
  FileDown, SlidersHorizontal, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ────────────────────────────────────────────────
const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];
const PAGE_SIZE  = 20;

const CATEGORY_BADGE: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default'> = {
  Food: 'info', Transport: 'success', Utilities: 'danger',
  Entertainment: 'warning', Shopping: 'default', Other: 'default',
};

// Generate last 24 months for the month picker
function getMonthOptions() {
  const opts: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    opts.push({ label, value });
  }
  return opts;
}

// Generate last 5 years
function getYearOptions() {
  const year = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(year - i));
}

const MONTH_OPTIONS = getMonthOptions();
const YEAR_OPTIONS  = getYearOptions();

type DateFilter = 'month' | 'year' | 'all';

// ── Page ─────────────────────────────────────────────────────
export default function ExpensesPage() {
  const [expenses, setExpenses]     = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [month, setMonth]           = useState(() => new Date().toISOString().slice(0, 7));
  const [year, setYear]             = useState(() => String(new Date().getFullYear()));
  const [category, setCategory]     = useState('');
  const [page, setPage]             = useState(1);

  // ── Build query filters ──────────────────────────────────
  const buildFilters = useCallback((): ExpenseListFilters => {
    const f: ExpenseListFilters = { page, limit: PAGE_SIZE };
    if (dateFilter === 'month') f.month = month;
    if (dateFilter === 'year')  f.year  = year;
    if (category) f.category = category;
    return f;
  }, [page, dateFilter, month, year, category]);

  // ── Fetch ────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await expensesService.listExpenses(buildFilters());
      setExpenses(result.expenses);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Expenses fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [buildFilters]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // Reset to page 1 when filters change
  const applyFilter = (fn: () => void) => { fn(); setPage(1); };

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await expensesService.deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Export ───────────────────────────────────────────────
  const exportFilters = (): Record<string, string> => {
    const f: Record<string, string> = {};
    if (dateFilter === 'month') f.month = month;
    if (dateFilter === 'year')  f.year  = year;
    if (category) f.category = category;
    return f;
  };

  const handleExportCSV = async () => {
    try {
      const blob = await expensesService.exportCSV(dateFilter === 'month' ? month : undefined);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `expenses-${dateFilter === 'month' ? month : year || 'all'}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const handleExportPDF = async () => {
    try { await expensesService.exportPDF(exportFilters()); }
    catch (err) { console.error(err); }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {pagination ? `${pagination.totalItems} total records` : 'All transactions'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download size={14} /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown size={14} /> PDF
            </Button>
          </div>
        </div>

        {/* ── Filter bar ──────────────────────────────────── */}
        <Card>
          <CardBody className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />

              {/* Date type toggle */}
              <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                {(['all', 'month', 'year'] as DateFilter[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => applyFilter(() => setDateFilter(t))}
                    className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${
                      dateFilter === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t === 'all' ? 'All time' : t}
                  </button>
                ))}
              </div>

              {/* Month picker */}
              {dateFilter === 'month' && (
                <select
                  value={month}
                  onChange={(e) => applyFilter(() => setMonth(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {MONTH_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}

              {/* Year picker */}
              {dateFilter === 'year' && (
                <select
                  value={year}
                  onChange={(e) => applyFilter(() => setYear(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              )}

              {/* Category filter */}
              <select
                value={category}
                onChange={(e) => applyFilter(() => setCategory(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Clear filters */}
              {(category || dateFilter !== 'month') && (
                <button
                  onClick={() => { setCategory(''); setDateFilter('month'); setMonth(new Date().toISOString().slice(0, 7)); setPage(1); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* ── Table ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Transactions</h3>
              {pagination && (
                <span className="text-xs text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages || 1}
                </span>
              )}
            </div>
          </CardHeader>

          {isLoading ? (
            <CardBody className="flex items-center justify-center py-20">
              <Spinner size="md" />
            </CardBody>
          ) : expenses.length === 0 ? (
            <CardBody className="flex flex-col items-center justify-center py-16 gap-2 text-center">
              <p className="text-sm font-medium text-gray-400">No expenses found</p>
              <p className="text-xs text-gray-300">Try adjusting your filters</p>
            </CardBody>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 w-10">#</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Note</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Category</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {expenses.map((exp, i) => {
                        const rowNum = ((page - 1) * PAGE_SIZE) + i + 1;
                        const isDeleting = deletingId === exp.id;
                        return (
                          <motion.tr
                            key={exp.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-5 py-3 text-xs text-gray-400">{rowNum}</td>
                            <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                              {new Date(exp.date).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </td>
                            <td className="px-5 py-3 text-gray-800 max-w-xs truncate">
                              {exp.note ?? exp.description ?? '—'}
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={CATEGORY_BADGE[exp.category] ?? 'default'} size="sm">
                                {exp.category}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                              ${exp.amount.toFixed(2)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => handleDelete(exp.id)}
                                disabled={isDeleting}
                                className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                              >
                                {isDeleting ? <Spinner size="sm" /> : <Trash2 size={14} />}
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, pagination.totalItems)} of {pagination.totalItems}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === '...' ? (
                          <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className={`min-w-[28px] h-7 rounded-lg text-xs font-medium transition-all ${
                              page === p
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}

                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNextPage}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

      </div>
    </MainLayout>
  );
}
