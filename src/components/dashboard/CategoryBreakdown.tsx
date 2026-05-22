import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import type { CategoryBreakdownItem } from '@/services/analyticsService';
import { Crown, BarChart2 } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: CategoryBreakdownItem[];
  isLoading?: boolean;
  onSortChange?: (sortBy: 'amount' | 'count') => void;
}

type SortMode = 'amount' | 'count';

export function CategoryBreakdown({
  categories,
  isLoading = false,
  onSortChange,
}: CategoryBreakdownProps) {
  const [sortBy, setSortBy] = useState<SortMode>('amount');

  const handleSort = (mode: SortMode) => {
    setSortBy(mode);
    onSortChange?.(mode);
  };

  // Client-side sort as fallback (API also sorts server-side when sortBy is passed)
  const sorted = [...(categories ?? [])].sort((a, b) =>
    sortBy === 'amount' ? b.amount - a.amount : b.count - a.count,
  );

  const isEmpty = sorted.length === 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <div className="flex items-center gap-1.5">
              <Crown size={15} className="text-amber-400" />
              <h3 className="text-base font-bold text-gray-900">Top Categories</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Highest spending areas</p>
          </div>

          {/* Amount / Count toggle */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 border border-gray-200">
            {(['amount', 'count'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleSort(mode)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                  sortBy === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {mode === 'amount' ? 'Amount' : 'Count'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-52 gap-2 text-center">
            <BarChart2 size={32} className="text-gray-200" />
            <p className="text-sm font-medium text-gray-400">No category data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((item) => (
              <div
                key={item.category}
                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-3
                           hover:border-gray-200 hover:bg-white transition-all duration-200"
              >
                {/* Row: dot + name + count  |  amount + % */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Glowing dot using API hex color */}
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{
                        backgroundColor: item.color ?? '#6366f1',
                        boxShadow: `0 0 6px ${item.color ?? '#6366f1'}`,
                      }}
                    />
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                      ({item.count} {item.count === 1 ? 'txn' : 'txns'})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 flex-shrink-0 ml-2">
                    <span className="text-sm font-bold text-gray-900">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Animated progress bar */}
                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      backgroundColor: item.color ?? '#6366f1',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
