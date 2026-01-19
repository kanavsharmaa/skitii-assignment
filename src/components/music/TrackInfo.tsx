import React from 'react';
import { Track } from '../../types';

interface TrackInfoProps {
  track: Track;
}

export function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Track Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {track.title}
      </h2>

      {/* Therapy Goal - Important for patient */}
      <p className="text-lg text-primary-600 mb-4">
        {track.therapyGoal}
      </p>

      {/* Track Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-500 block">Tempo</span>
          <span className="text-lg font-medium text-gray-800">{track.tempo} BPM</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-500 block">Key</span>
          <span className="text-lg font-medium text-gray-800">{track.key}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-500 block">Mood</span>
          <span className="text-lg font-medium text-gray-800 capitalize">{track.mood}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-sm text-gray-500 block">Duration</span>
          <span className="text-lg font-medium text-gray-800">
            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* HRV Range Info - Subtle indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Optimized for HRV range: {track.forHRVRange[0]}-{track.forHRVRange[1]} ms
        </p>
      </div>
    </div>
  );
}
