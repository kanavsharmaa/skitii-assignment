import React, { useState } from 'react';
import { Session } from '../../types';

interface SessionCardProps {
  session: Session;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function SessionCard({ session }: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine HRV status color
  const getHRVColor = (hrv: number) => {
    if (hrv < 30) return 'text-red-600 bg-red-50';
    if (hrv > 60) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  // Determine improvement indicator
  const getImprovementIndicator = () => {
    if (session.improvement > 0) {
      return (
        <span className="text-green-600 font-medium">
          ↓ {session.improvement} points
        </span>
      );
    } else if (session.improvement < 0) {
      return (
        <span className="text-red-600 font-medium">
          ↑ {Math.abs(session.improvement)} points
        </span>
      );
    }
    return <span className="text-gray-500">No change</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Main Card Content */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
      >
        <div className="flex items-center justify-between">
          {/* Date and Duration */}
          <div>
            <p className="font-medium text-gray-800">{formatDate(session.date)}</p>
            <p className="text-sm text-gray-500">{formatDuration(session.durationSeconds)}</p>
          </div>

          {/* Average HRV */}
          <div className={`px-3 py-1 rounded-full ${getHRVColor(session.avgHRV)}`}>
            <span className="font-medium">{session.avgHRV.toFixed(0)} ms</span>
          </div>

          {/* Expand Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {/* HRV Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Min HRV</p>
              <p className={`font-semibold ${getHRVColor(session.minHRV).split(' ')[0]}`}>
                {session.minHRV.toFixed(0)} ms
              </p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Avg HRV</p>
              <p className={`font-semibold ${getHRVColor(session.avgHRV).split(' ')[0]}`}>
                {session.avgHRV.toFixed(0)} ms
              </p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Max HRV</p>
              <p className={`font-semibold ${getHRVColor(session.maxHRV).split(' ')[0]}`}>
                {session.maxHRV.toFixed(0)} ms
              </p>
            </div>
          </div>

          {/* Pain Score Progress */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pain Score Change</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {session.painScoreStart} → {session.painScoreEnd}
                </span>
                {getImprovementIndicator()}
              </div>
            </div>
          </div>

          {/* Music Played */}
          {session.musicPlayed.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Music Played</p>
              <div className="flex flex-wrap gap-2">
                {session.musicPlayed.map((track, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg"
                  >
                    {track}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
