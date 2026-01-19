import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { HRVReading, HRVStatus, HRVTrend } from '../types';
import { generateHRVReading, generateManualReading, calculateTrend, calculateMetrics } from '../services/hrvSimulator';

interface HRVContextValue {
  currentHRV: HRVReading | null;
  hrvHistory: HRVReading[];
  trend: HRVTrend;
  status: HRVStatus;
  deviceConnected: boolean;
  isStressAlertVisible: boolean;
  dismissStressAlert: () => void;
  // Metrics
  avgHRV: number;
  minHRV: number;
  maxHRV: number;
  hrvVariability: number;
  // Manual override controls (for testing)
  isManualMode: boolean;
  manualZone: HRVStatus | null;
  setManualMode: (enabled: boolean) => void;
  setManualZone: (zone: HRVStatus) => void;
}

const HRVContext = createContext<HRVContextValue | null>(null);

// Rolling window size: 100 readings = 5 minutes at 3-second intervals
const MAX_READINGS = 100;

// Stress alert triggers after 2 consecutive low readings
const STRESS_THRESHOLD_COUNT = 2;

interface HRVProviderProps {
  children: ReactNode;
}

export function HRVProvider({ children }: HRVProviderProps) {
  const [hrvHistory, setHrvHistory] = useState<HRVReading[]>([]);
  const [isStressAlertVisible, setIsStressAlertVisible] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualZone, setManualZone] = useState<HRVStatus | null>(null);

  // Track consecutive low readings for stress alert
  const lowReadingCountRef = useRef(0);

  // Generate HRV readings every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHrvHistory(prev => {
        // Generate new reading based on mode
        const newReading = isManualMode && manualZone
          ? generateManualReading(manualZone)
          : generateHRVReading(prev[prev.length - 1]);

        // Check for stress condition (consecutive low readings)
        if (newReading.status === 'low') {
          lowReadingCountRef.current++;
          if (lowReadingCountRef.current >= STRESS_THRESHOLD_COUNT) {
            setIsStressAlertVisible(true);
          }
        } else {
          lowReadingCountRef.current = 0;
        }

        // Keep rolling window of MAX_READINGS
        const updated = [...prev, newReading];
        if (updated.length > MAX_READINGS) {
          return updated.slice(-MAX_READINGS);
        }
        return updated;
      });
    }, 3000);

    // CRITICAL: Cleanup to prevent memory leaks
    return () => clearInterval(interval);
  }, [isManualMode, manualZone]);

  const setManualModeCallback = useCallback((enabled: boolean) => {
    setIsManualMode(enabled);
    if (!enabled) {
      setManualZone(null);
    }
  }, []);

  const setManualZoneCallback = useCallback((zone: HRVStatus) => {
    setManualZone(zone);
  }, []);

  // Derived values
  const currentHRV = hrvHistory[hrvHistory.length - 1] ?? null;
  const trend = calculateTrend(hrvHistory);
  const status = currentHRV?.status ?? 'normal';
  const deviceConnected = currentHRV?.deviceConnected ?? false;

  // Calculate metrics
  const { avgHRV, minHRV, maxHRV, hrvVariability } = calculateMetrics(hrvHistory);

  const dismissStressAlert = useCallback(() => {
    setIsStressAlertVisible(false);
    // If in manual mode, switch to normal zone when user says "I'm Feeling Better"
    if (isManualMode) {
      setManualZone('normal');
    }
  }, [isManualMode]);

  const value: HRVContextValue = {
    currentHRV,
    hrvHistory,
    trend,
    status,
    deviceConnected,
    isStressAlertVisible,
    dismissStressAlert,
    avgHRV,
    minHRV,
    maxHRV,
    hrvVariability,
    isManualMode,
    manualZone,
    setManualMode: setManualModeCallback,
    setManualZone: setManualZoneCallback,
  };

  return (
    <HRVContext.Provider value={value}>
      {children}
    </HRVContext.Provider>
  );
}

export function useHRV(): HRVContextValue {
  const context = useContext(HRVContext);
  if (!context) {
    throw new Error('useHRV must be used within an HRVProvider');
  }
  return context;
}
