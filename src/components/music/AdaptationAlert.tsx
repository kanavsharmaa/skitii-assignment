import React, { useEffect } from 'react';
import { AdaptationEvent } from '../../types';

interface AdaptationAlertProps {
  adaptation: AdaptationEvent;
  isVisible: boolean;
  onDismiss: () => void;
}

export function AdaptationAlert({ adaptation, isVisible, onDismiss }: AdaptationAlertProps) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-lg border border-primary-200 p-4 max-w-md">
        <div className="flex items-start gap-3">
          {/* Music Note Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-primary-600"
            >
              <path
                fillRule="evenodd"
                d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className="text-gray-800 font-medium">Music Adapted</p>
            <p className="text-gray-600 text-sm mt-1">{adaptation.reason}</p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
