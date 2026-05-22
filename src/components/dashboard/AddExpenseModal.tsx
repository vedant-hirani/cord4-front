import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { expensesService } from '@/services/expensesService';
import type { ExpenseCreate } from '@/types/expense';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

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
  const [form, setForm] = useState<ExpenseCreate>(defaultForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Apply AI prefill when it changes
  useEffect(() => {
    if (prefill && Object.keys(prefill).length > 0) {
      setForm((prev) => ({ ...prev, ...prefill }));
    }
  }, [prefill]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setForm(defaultForm());
      setError('');
    }
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Amount ($)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={form.amount || ''}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <Input
          label="Note (optional)"
          type="text"
          placeholder="e.g. Lunch at cafe"
          value={form.note ?? ''}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
