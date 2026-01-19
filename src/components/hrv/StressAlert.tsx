interface StressAlertProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export function StressAlert({ isVisible, onDismiss }: StressAlertProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
        role="alertdialog"
        aria-labelledby="stress-alert-title"
        aria-describedby="stress-alert-description"
      >
        {/* Calming Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        {/* Message - Calming, not alarming */}
        <h2
          id="stress-alert-title"
          className="text-xl font-semibold text-gray-800 text-center mb-2"
        >
          Let's Take a Moment
        </h2>
        <p
          id="stress-alert-description"
          className="text-gray-600 text-center mb-6"
        >
          We've noticed some stress signals. This is completely normal.
          Take a few deep breaths - we're switching to calmer music to help you relax.
        </p>

        {/* Breathing Guide */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium text-center mb-2">
            Try this breathing exercise:
          </p>
          <p className="text-blue-700 text-center text-lg">
            Breathe in... 4 seconds<br />
            Hold... 4 seconds<br />
            Breathe out... 6 seconds
          </p>
        </div>

        {/* Dismiss Button - Large touch target */}
        <button
          onClick={onDismiss}
          className="btn-primary w-full"
          autoFocus
        >
          I'm Feeling Better
        </button>
      </div>
    </div>
  );
}
