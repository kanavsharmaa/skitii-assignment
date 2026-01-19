import React, { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { HRVReading } from '../../types';

interface HRVChartProps {
  data: HRVReading[];
}

// Memoized chart component to prevent unnecessary re-renders
const HRVChart = memo(function HRVChart({ data }: HRVChartProps) {
  // Memoize chart data transformation
  const chartData = useMemo(
    () =>
      data.map((reading, index) => ({
        time: index * 3, // Seconds elapsed (3s intervals)
        hrv: reading.value,
        status: reading.status,
      })),
    [data]
  );

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) => {
    if (active && payload && payload.length && label !== undefined) {
      const mins = Math.floor(label / 60);
      const secs = label % 60;
      return (
        <div className="bg-white px-3 py-2 rounded shadow-lg border border-gray-200">
          <p className="text-sm text-gray-500">
            {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`}
          </p>
          <p className="text-lg font-semibold text-primary-600">
            {payload[0].value} ms
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        HRV Over Time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* Color zones as background areas */}
          <ReferenceArea y1={0} y2={30} fill="#fef2f2" fillOpacity={0.5} />
          <ReferenceArea y1={30} y2={60} fill="#f0fdf4" fillOpacity={0.5} />
          <ReferenceArea y1={60} y2={100} fill="#eff6ff" fillOpacity={0.5} />

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatTime}
            axisLine={{ stroke: '#d1d5db' }}
          />

          <YAxis
            domain={[20, 80]}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}`}
            axisLine={{ stroke: '#d1d5db' }}
            width={40}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Reference lines for zones */}
          <ReferenceLine
            y={30}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
          <ReferenceLine
            y={60}
            stroke="#3b82f6"
            strokeDasharray="5 5"
            strokeWidth={1}
          />

          {/* Main HRV line - NO animation for performance */}
          <Line
            type="monotone"
            dataKey="hrv"
            stroke="#2d5a87"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-200"></span>
          <span className="text-gray-600">&lt;30ms Stress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-200"></span>
          <span className="text-gray-600">30-60ms Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-blue-200"></span>
          <span className="text-gray-600">&gt;60ms Relaxed</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if data length changed or last value changed
  if (prevProps.data.length !== nextProps.data.length) return false;
  if (prevProps.data.length === 0) return true;

  const prevLast = prevProps.data[prevProps.data.length - 1];
  const nextLast = nextProps.data[nextProps.data.length - 1];
  return prevLast.timestamp === nextLast.timestamp;
});

export { HRVChart };
export default HRVChart;
