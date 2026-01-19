import React from 'react';

interface SessionMetricsProps {
  avgHRV: number;
  minHRV: number;
  maxHRV: number;
  hrvVariability: number;
}

export function SessionMetrics({ avgHRV, minHRV, maxHRV, hrvVariability }: SessionMetricsProps) {
  // Determine color based on average HRV
  const getStatusColor = (hrv: number) => {
    if (hrv < 30) return 'text-red-600';
    if (hrv > 60) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-4">HRV Metrics</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Average HRV */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500">Average</p>
          <p className={`text-2xl font-semibold ${getStatusColor(avgHRV)}`}>
            {avgHRV.toFixed(1)} <span className="text-sm font-normal text-gray-500">ms</span>
          </p>
        </div>

        {/* Variability */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500">Variability</p>
          <p className="text-2xl font-semibold text-gray-800">
            ±{hrvVariability.toFixed(1)} <span className="text-sm font-normal text-gray-500">ms</span>
          </p>
        </div>

        {/* Min HRV */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500">Min</p>
          <p className={`text-xl font-semibold ${getStatusColor(minHRV)}`}>
            {minHRV.toFixed(1)} <span className="text-sm font-normal text-gray-500">ms</span>
          </p>
        </div>

        {/* Max HRV */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500">Max</p>
          <p className={`text-xl font-semibold ${getStatusColor(maxHRV)}`}>
            {maxHRV.toFixed(1)} <span className="text-sm font-normal text-gray-500">ms</span>
          </p>
        </div>
      </div>
    </div>
  );
}
