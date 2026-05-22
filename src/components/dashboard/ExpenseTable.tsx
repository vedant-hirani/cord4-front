import type { Expense } from '@/types/expense';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (expense: Expense) => void;
}

const categoryColors: Record<string, string> = {
  food: 'info',
  transport: 'success',
  entertainment: 'warning',
  utilities: 'danger',
  shopping: 'default',
  health: 'success',
  education: 'info',
};

export function ExpenseTable({
  expenses,
  isLoading = false,
  onDelete,
  onEdit,
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading expenses...</div>
        </CardBody>
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-2">No expenses yet</p>
          <p className="text-sm text-gray-400">Add your first expense to get started</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Description</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <motion.tr
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={categoryColors[expense.category.toLowerCase()] as any}
                      size="sm"
                    >
                      {expense.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
