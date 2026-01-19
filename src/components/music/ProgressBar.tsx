import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  elapsedTime: number; // seconds
  totalDuration: number; // seconds
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ProgressBar({ progress, elapsedTime, totalDuration }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Progress Track */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{formatTime(elapsedTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>
    </div>
  );
}
