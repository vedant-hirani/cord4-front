import type { BudgetAlert } from '@/types/budget';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
}

const statusConfig = {
  normal: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    pulse: '',
  },
  warning: {
    bar: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    pulse: 'animate-pulse',
  },
  danger: {
    bar: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-400',
    pulse: 'animate-pulse',
  },
};

export function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-base font-semibold text-gray-900">Budget Alerts</h3>
          <span className="ml-auto text-xs text-gray-400">{alerts.length} active</span>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => {
          const cfg = statusConfig[alert.status] ?? statusConfig.normal;
          const pct = Math.min(alert.percentage, 100);

          return (
            <div
              key={alert.category}
              className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">{alert.category}</span>
                <span className={`text-sm font-bold ${cfg.text} ${cfg.pulse}`}>
                  {alert.percentage.toFixed(0)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-white/70 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cfg.bar} ${alert.status === 'danger' ? cfg.pulse : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>${alert.spent.toFixed(2)} spent</span>
                <span>
                  {alert.remaining >= 0
                    ? `$${alert.remaining.toFixed(2)} left`
                    : `$${Math.abs(alert.remaining).toFixed(2)} over`}
                </span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
