import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky with always-visible logout (healthcare requirement for shared devices) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Patient Greeting - Name only, NEVER condition */}
          <div>
            <h1 className="text-lg font-semibold text-primary-600">
              Welcome, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-gray-500">
              Skitii Music Therapy
            </p>
          </div>

          {/* Logout Button - Always visible, large touch target (48px min) */}
          <button
            onClick={handleLogout}
            className="h-12 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          <NavLink
            to="/session"
            className={({ isActive }) =>
              `px-6 py-4 font-medium text-base transition-colors border-b-2 ${
                isActive
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            Session
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-6 py-4 font-medium text-base transition-colors border-b-2 ${
                isActive
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            History
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
