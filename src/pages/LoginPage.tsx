import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/session" replace />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-4">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary-600 text-center">
            Skitii
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Music Therapy for Your Wellbeing
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Welcome Back
            </h2>
            <LoginForm />
          </div>

          {/* Calming message */}
          <p className="text-center text-gray-500 text-sm mt-3">
            Take a deep breath. We're here to help you relax.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-sm text-gray-400">
        © 2024 Skitii Health
      </footer>
    </div>
  );
}
