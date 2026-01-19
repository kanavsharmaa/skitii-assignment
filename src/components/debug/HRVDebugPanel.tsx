import { useState } from 'react';
import { useHRV } from '../../contexts/HRVContext';
import { HRVStatus } from '../../types';

const zones: { zone: HRVStatus; label: string; color: string; bgColor: string; activeBg: string }[] = [
  { zone: 'low', label: 'Low (Stress)', color: 'text-red-700', bgColor: 'bg-red-100 hover:bg-red-200', activeBg: 'bg-red-300' },
  { zone: 'normal', label: 'Normal', color: 'text-green-700', bgColor: 'bg-green-100 hover:bg-green-200', activeBg: 'bg-green-300' },
  { zone: 'high', label: 'High (Relaxed)', color: 'text-blue-700', bgColor: 'bg-blue-100 hover:bg-blue-200', activeBg: 'bg-blue-300' },
];

export function HRVDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isManualMode,
    manualZone,
    setManualMode,
    setManualZone,
    currentHRV,
  } = useHRV();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mx-auto block bg-gray-800 text-white px-4 py-1 rounded-t-lg text-sm hover:bg-gray-700 transition-colors"
      >
        {isExpanded ? 'Hide' : 'Show'} Debug Panel
      </button>

      {/* Panel Content */}
      {isExpanded && (
        <div className="bg-gray-800 text-white p-4 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">HRV Debug Controls</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">
                  Current: {currentHRV?.value ?? '--'}ms
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isManualMode ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                  }`}
                >
                  {isManualMode ? 'MANUAL' : 'AUTO'}
                </span>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isManualMode}
                  onChange={(e) => setManualMode(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Manual Override Mode</span>
              </label>
            </div>

            {/* Zone Buttons */}
            {isManualMode && (
              <div className="flex gap-3">
                {zones.map(({ zone, label, color, bgColor, activeBg }) => (
                  <button
                    key={zone}
                    onClick={() => setManualZone(zone)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${color} ${
                      manualZone === zone ? `${activeBg} ring-2 ring-white` : bgColor
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Help text */}
            {isManualMode && !manualZone && (
              <p className="text-sm text-gray-400 mt-3">
                Select a zone above to set the HRV value
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
