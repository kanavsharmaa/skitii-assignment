import { HRVTrend } from '../../types';

interface HRVTrendIndicatorProps {
  trend: HRVTrend;
}

const trendConfig = {
  up: {
    symbol: '↑',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Improving',
  },
  down: {
    symbol: '↓',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Decreasing',
  },
  stable: {
    symbol: '→',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'Stable',
  },
};

export function HRVTrendIndicator({ trend }: HRVTrendIndicatorProps) {
  const config = trendConfig[trend];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor}`}>
      <span className={`text-2xl font-bold ${config.color}`}>
        {config.symbol}
      </span>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}
