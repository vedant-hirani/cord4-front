import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ExpenseTable } from '@/components/dashboard/ExpenseTable';
import { AIExtractor } from '@/components/dashboard/AIExtractor';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { expensesService } from '@/services/expensesService';
import { budgetsService } from '@/services/budgetsService';
import type { Expense, ExpenseCreate } from '@/types/expense';
import { DollarSign, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_OPTIONS = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Education', 'Other'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseCreate>({
    amount: 0,
    category: CATEGORY_OPTIONS[0],
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [expensesData, statsData, alertsData] = await Promise.all([
        expensesService.getExpenses(),
        expensesService.getStats(),
        budgetsService.getAlerts(),
      ]);
      setExpenses(expensesData);
      setStats(statsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('[v0] Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newExpense = await expensesService.createExpense(formData);
      setExpenses([newExpense, ...expenses]);
      setIsModalOpen(false);
      setFormData({
        amount: 0,
        category: CATEGORY_OPTIONS[0],
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      await loadData();
    } catch (error) {
      console.error('[v0] Failed to add expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await expensesService.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (error) {
      console.error('[v0] Failed to delete expense:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await expensesService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('[v0] Failed to export:', error);
    }
  };

  if (isLoading && !stats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Track and manage your expenses</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus size={20} />
              Add Expense
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <StatsCard
            icon={<DollarSign size={24} />}
            label="Total Spent"
            value={`$${(stats?.totalSpent || 0).toFixed(2)}`}
            color="blue"
          />
          <StatsCard
            icon={<TrendingUp size={24} />}
            label="This Month"
            value={`$${(stats?.monthlySpent || 0).toFixed(2)}`}
            color="green"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            icon={<AlertCircle size={24} />}
            label="Budget Alerts"
            value={alerts.length}
            color="orange"
          />
        </motion.div>

        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-yellow-100 bg-yellow-50/50">
              <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                <h3 className="text-lg font-semibold text-gray-900">Budget Alerts</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                {alerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{alert.category}</p>
                      <p className="text-sm text-gray-600">
                        ${alert.spent.toFixed(2)} of ${alert.limit.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${alert.status === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {alert.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AIExtractor
            onExtract={(data) => {
              setFormData(prev => ({
                ...prev,
                ...data,
                amount: data.amount || prev.amount,
                category: data.category || prev.category,
                description: data.description || prev.description,
                date: data.date || prev.date,
              }));
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExpenseTable
            expenses={expenses}
            isLoading={isLoading}
            onDelete={handleDeleteExpense}
          />
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
        size="md"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Description"
            placeholder="e.g., Lunch at cafe"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Expense
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
