import type { Expense } from '@/types/expense';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const categoryVariant: Record<string, BadgeVariant> = {
  food: 'info',
  transport: 'success',
  entertainment: 'warning',
  utilities: 'danger',
  shopping: 'default',
  other: 'default',
};

export function ExpenseTable({ expenses, isLoading = false, onDelete }: ExpenseTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Recent Expenses</h3>
          <span className="text-xs text-gray-400">{expenses.length} records</span>
        </div>
      </CardHeader>

      {expenses.length === 0 ? (
        <CardBody className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400 text-sm">No expenses this month</p>
          <p className="text-gray-300 text-xs mt-1">Add your first expense above</p>
        </CardBody>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Note</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                {onDelete && (
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, i) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-3 text-gray-900 max-w-xs truncate">
                    {expense.note ?? expense.description ?? '—'}
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      variant={categoryVariant[expense.category.toLowerCase()] ?? 'default'}
                      size="sm"
                    >
                      {expense.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                    ${expense.amount.toFixed(2)}
                  </td>
                  {onDelete && (
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
