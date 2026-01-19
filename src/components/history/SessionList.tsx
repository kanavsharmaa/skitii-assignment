import React from 'react';
import { Session } from '../../types';
import { SessionCard } from './SessionCard';

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Sessions Yet</h3>
        <p className="text-gray-500">
          Start a music therapy session to see your history here.
        </p>
      </div>
    );
  }

  // Calculate summary stats
  const totalSessions = sessions.length;
  const totalMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );
  const avgImprovement = (
    sessions.reduce((sum, s) => sum + s.improvement, 0) / totalSessions
  ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Session Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary-600">{totalSessions}</p>
            <p className="text-sm text-gray-500">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-primary-600">{totalMinutes}</p>
            <p className="text-sm text-gray-500">Total Minutes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-green-600">-{avgImprovement}</p>
            <p className="text-sm text-gray-500">Avg Pain Reduction</p>
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-3">
        {sessions.map(session => (
          <SessionCard key={session.sessionId} session={session} />
        ))}
      </div>
    </div>
  );
}
