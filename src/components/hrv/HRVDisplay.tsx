import { HRVStatus, HRVTrend } from '../../types';
import { HRVTrendIndicator } from './HRVTrendIndicator';

interface HRVDisplayProps {
  value: number | null;
  status: HRVStatus;
  trend?: HRVTrend;
}

const statusConfig = {
  low: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-600',
    label: 'Elevated Stress',
    description: 'Taking deep breaths may help',
  },
  normal: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-600',
    label: 'Normal',
    description: 'Your body is responding well',
  },
  high: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-600',
    label: 'Relaxed',
    description: 'Your relaxation is deepening',
  },
};

export function HRVDisplay({ value, status, trend }: HRVDisplayProps) {
  const config = statusConfig[status];

  return (
    <div className={`p-6 rounded-xl border-2 ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Heart Rate Variability
        </div>
        {trend && <HRVTrendIndicator trend={trend} />}
      </div>
      <div className={`text-5xl font-bold ${config.text}`}>
        {value !== null ? value : '--'}
        <span className="text-2xl ml-1">ms</span>
      </div>
      <div className={`text-lg font-medium ${config.text} mt-2`}>
        {config.label}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {config.description}
      </p>
    </div>
  );
}
