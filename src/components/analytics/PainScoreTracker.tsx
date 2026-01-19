import React from 'react';

interface PainScoreTrackerProps {
  currentScore: number;
  initialScore: number | null;
  onScoreChange: (score: number) => void;
}

// Emoji feedback for pain levels
const painEmojis: Record<number, string> = {
  0: '😊',
  1: '🙂',
  2: '😐',
  3: '😕',
  4: '😟',
  5: '😣',
  6: '😖',
  7: '😫',
  8: '😩',
  9: '😭',
  10: '🤯',
};

const painDescriptions: Record<number, string> = {
  0: 'No Pain',
  1: 'Minimal',
  2: 'Mild',
  3: 'Uncomfortable',
  4: 'Moderate',
  5: 'Distracting',
  6: 'Distressing',
  7: 'Unmanageable',
  8: 'Intense',
  9: 'Severe',
  10: 'Unbearable',
};

export function PainScoreTracker({ currentScore, initialScore, onScoreChange }: PainScoreTrackerProps) {
  const improvement = initialScore !== null ? initialScore - currentScore : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Pain Level</h3>

      {/* Current Score Display */}
      <div className="text-center mb-6">
        <span className="text-6xl" role="img" aria-label={painDescriptions[currentScore]}>
          {painEmojis[currentScore]}
        </span>
        <p className="text-2xl font-semibold text-gray-800 mt-2">
          {currentScore}/10
        </p>
        <p className="text-gray-500">
          {painDescriptions[currentScore]}
        </p>
      </div>

      {/* Pain Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="10"
          value={currentScore}
          onChange={(e) => onScoreChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #ef4444 100%)`,
          }}
          aria-label="Pain score slider"
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {[0, 2, 4, 6, 8, 10].map(score => (
          <button
            key={score}
            onClick={() => onScoreChange(score)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              currentScore === score
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Set pain score to ${score}`}
          >
            {score}
          </button>
        ))}
      </div>

      {/* Improvement Indicator */}
      {initialScore !== null && (
        <div className={`p-3 rounded-lg ${
          improvement > 0 ? 'bg-green-50 border border-green-200' :
          improvement < 0 ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Session Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Started: {initialScore}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-sm text-gray-500">
                Now: {currentScore}
              </span>
              {improvement !== 0 && (
                <span className={`text-sm font-medium ${
                  improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({improvement > 0 ? '-' : '+'}{Math.abs(improvement)})
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
