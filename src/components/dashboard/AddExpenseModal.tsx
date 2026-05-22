import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { expensesService } from '@/services/expensesService';
import type { ExpenseCreate } from '@/types/expense';
import { AlertCircle, DollarSign, Tag, Calendar, FileText } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

const CATEGORY_EMOJI: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Utilities: '💡',
  Entertainment: '🎬', Shopping: '🛍️', Other: '📦',
};

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefill?: Partial<ExpenseCreate>;
}

const defaultForm = (): ExpenseCreate => ({
  amount: 0,
  category: CATEGORIES[0],
  date: new Date().toISOString().split('T')[0],
  note: '',
});

export function AddExpenseModal({ isOpen, onClose, onSuccess, prefill }: AddExpenseModalProps) {
  const [form, setForm]           = useState<ExpenseCreate>(defaultForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (prefill && Object.keys(prefill).length > 0) {
      setForm((prev) => ({ ...prev, ...prefill }));
    }
  }, [prefill]);

  useEffect(() => {
    if (!isOpen) { setForm(defaultForm()); setError(''); }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.amount || form.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setIsSubmitting(true);
    try {
      await expensesService.createExpense(form);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={15} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Amount
          </label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category pills */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            <Tag size={11} className="inline mr-1" />
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, category: cat })}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                  form.category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <span>{CATEGORY_EMOJI[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            <Calendar size={11} className="inline mr-1" />
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            <FileText size={11} className="inline mr-1" />
            Note <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Lunch at cafe"
            value={form.note ?? ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} className="flex-1">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
