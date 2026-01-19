import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const [patientId, setPatientId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e?: FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(patientId, pin);

      if (result.success) {
        // Clear PIN from local state immediately after successful login
        setPin('');
        navigate('/session', { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please check your Patient ID and PIN.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Login Card */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div
                className="alert alert-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            {/* Patient ID Field */}
            <div>
              <label
                htmlFor="patientId"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                Patient ID
              </label>
              <input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value.toUpperCase().trim())}
                placeholder="e.g., PT001"
                className="input"
                required
                autoComplete="username"
                autoFocus
                aria-describedby="patientId-help"
              />
              <p id="patientId-help" className="text-sm text-gray-500 mt-1">
                Enter the Patient ID provided by your care team
              </p>
            </div>

            {/* PIN Field */}
            <div>
              <label
                htmlFor="pin"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-6 digit PIN"
                className="input"
                required
                autoComplete="current-password"
                aria-describedby="pin-help"
              />
              <p id="pin-help" className="text-sm text-gray-500 mt-1">
                Enter your secure PIN
              </p>
            </div>

            {/* Submit Button - Large touch target (60px height) */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !patientId || !pin}
              className="btn-primary w-full text-xl"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Need help? Contact your care team for assistance.
        </p>
      </div>

      {/* Demo Credentials (for testing) */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-medium mb-1">Demo Credentials:</p>
        <p className="text-sm text-blue-700">Patient ID: PT001 | PIN: 1234</p>
      </div>
    </div>
  );
}
