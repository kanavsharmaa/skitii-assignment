import React from 'react';

interface SessionTimerProps {
  duration: number; // seconds
  isActive: boolean;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SessionTimer({ duration, isActive }: SessionTimerProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Session Duration</p>
          <p className="text-3xl font-semibold text-gray-800 font-mono">
            {formatDuration(duration)}
          </p>
        </div>

        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
