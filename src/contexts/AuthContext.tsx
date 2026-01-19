import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SafeUser, LoginResult } from '../types';
import { mockPatients } from '../data/mockPatients';

interface AuthContextValue {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (patientId: string, pin: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Session storage key - NEVER store PIN or condition
const USER_STORAGE_KEY = 'skitii_user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount (page refresh support)
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as SafeUser;
        // Validate stored user has required fields
        if (parsed.patientId && parsed.name) {
          setUser(parsed);
        } else {
          sessionStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch {
      // Invalid stored data, clear it
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (patientId: string, pin: string): Promise<LoginResult> => {
    // Note: Don't set global isLoading here - it causes LoginForm to unmount
    // The LoginForm has its own isSubmitting state for button loading

    // Simulate network delay (would be real API call in production)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find patient and verify credentials
    // SECURITY: Use generic error message to prevent user enumeration attacks
    const patient = mockPatients.find(p => p.patientId === patientId.toUpperCase());

    if (!patient || patient.pin !== pin) {
      return {
        success: false,
        error: 'Invalid credentials. Please check your Patient ID and PIN.'
      };
    }

    // Create safe user object - NEVER include condition or PIN
    const safeUser: SafeUser = {
      patientId: patient.patientId,
      name: patient.name,
      age: patient.age,
      // NO condition - healthcare privacy
      // NO pin - security
    };

    // Store in state and sessionStorage (NOT localStorage)
    // sessionStorage clears when tab closes - important for shared devices
    setUser(safeUser);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    // Clear user state
    setUser(null);

    // Clear ALL session data - critical for shared hospital devices
    sessionStorage.clear();

    // In production, would also invalidate token on backend
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
