import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { RechartsDataPoint, RangeType } from '@/services/analyticsService';

interface SpendingChartProps {
  data: RechartsDataPoint[];
  rangeType?: RangeType;
  isLoading?: boolean;
}

const rangeLabel: Record<string, string> = {
  daily:   'Today by hour',
  weekly:  'This week by day',
  monthly: 'This month by day',
  yearly:  'This year by month',
  custom:  'Custom range',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 mb-0.5">{label}</p>
      <p className="font-bold text-indigo-600">${Number(payload[0].value).toFixed(2)}</p>
    </div>
  );
}

export function SpendingChart({ data, rangeType = 'monthly', isLoading = false }: SpendingChartProps) {
  const isEmpty = !data || data.length === 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Spending Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">{rangeLabel[rangeType]}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : isEmpty ? (
          <div className="flex h-52 items-center justify-center text-sm text-gray-400">
            No spending data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#spendGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
