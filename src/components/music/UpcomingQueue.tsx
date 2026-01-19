import React from 'react';
import { Track } from '../../types';
import { getRecommendationReason } from '../../services/musicAdapter';

interface UpcomingQueueProps {
  queue: Track[];
  currentHRV: number;
  onSelectTrack: (track: Track) => void;
}

export function UpcomingQueue({ queue, currentHRV, onSelectTrack }: UpcomingQueueProps) {
  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Up Next</h3>
        <p className="text-gray-500 text-sm">No tracks in queue</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Up Next</h3>

      <div className="space-y-2">
        {queue.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onSelectTrack(track)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {/* Track Number */}
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-500">
              {index + 1}
            </span>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{track.title}</p>
              <p className="text-sm text-gray-500 truncate">
                {getRecommendationReason(track, currentHRV)}
              </p>
            </div>

            {/* Duration */}
            <span className="flex-shrink-0 text-sm text-gray-500">
              {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
