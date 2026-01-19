import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Session, SessionExportData, PainScoreEntry, MusicPlayedEntry, HRVReading } from '../types';
import { useAuth } from './AuthContext';
import { useHRV } from './HRVContext';
import { useMusic } from './MusicContext';
import { addSession } from '../data/mockSessionHistory';

interface SessionContextValue {
  isSessionActive: boolean;
  sessionDuration: number; // seconds
  painScoreStart: number | null;
  painScoreCurrent: number;
  painScoreHistory: PainScoreEntry[];
  // Actions
  startSession: () => void;
  endSession: () => Session | null;
  setPainScore: (score: number) => void;
  exportSession: () => SessionExportData | null;
  // Session state
  currentSessionId: string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

function generateSessionId(): string {
  return `SES-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { user } = useAuth();
  const { hrvHistory, avgHRV, minHRV, maxHRV, hrvVariability } = useHRV();
  const { tracksPlayed } = useMusic();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [painScoreStart, setPainScoreStart] = useState<number | null>(null);
  const [painScoreCurrent, setPainScoreCurrent] = useState(5);
  const [painScoreHistory, setPainScoreHistory] = useState<PainScoreEntry[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Store HRV readings during session
  const sessionHRVRef = useRef<HRVReading[]>([]);
  const sessionStartTimeRef = useRef<Date | null>(null);

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Capture HRV readings during session
  useEffect(() => {
    if (isSessionActive && hrvHistory.length > 0) {
      const latestReading = hrvHistory[hrvHistory.length - 1];
      sessionHRVRef.current.push(latestReading);
    }
  }, [isSessionActive, hrvHistory]);

  const startSession = useCallback(() => {
    const sessionId = generateSessionId();
    setCurrentSessionId(sessionId);
    setIsSessionActive(true);
    setSessionDuration(0);
    setPainScoreStart(null);
    setPainScoreCurrent(5);
    setPainScoreHistory([]);
    sessionHRVRef.current = [];
    sessionStartTimeRef.current = new Date();
  }, []);

  const endSession = useCallback((): Session | null => {
    if (!isSessionActive || !user || !currentSessionId) return null;

    const session: Session = {
      sessionId: currentSessionId,
      patientId: user.patientId,
      date: sessionStartTimeRef.current?.toISOString() ?? new Date().toISOString(),
      durationSeconds: sessionDuration,
      avgHRV,
      minHRV,
      maxHRV,
      hrvVariability,
      painScoreStart: painScoreStart ?? painScoreCurrent,
      painScoreEnd: painScoreCurrent,
      improvement: (painScoreStart ?? painScoreCurrent) - painScoreCurrent,
      status: 'completed',
      musicPlayed: tracksPlayed.map(t => t.track.title),
    };

    // Store session in memory for history
    addSession(session);

    // Reset session state
    setIsSessionActive(false);
    setCurrentSessionId(null);

    return session;
  }, [
    isSessionActive,
    user,
    currentSessionId,
    sessionDuration,
    avgHRV,
    minHRV,
    maxHRV,
    hrvVariability,
    painScoreStart,
    painScoreCurrent,
    tracksPlayed,
  ]);

  const setPainScore = useCallback((score: number) => {
    const clampedScore = Math.max(0, Math.min(10, score));

    // Set initial pain score
    if (painScoreStart === null) {
      setPainScoreStart(clampedScore);
    }

    setPainScoreCurrent(clampedScore);

    // Record in history
    setPainScoreHistory(prev => [
      ...prev,
      { timestamp: new Date().toISOString(), score: clampedScore },
    ]);
  }, [painScoreStart]);

  const exportSession = useCallback((): SessionExportData | null => {
    if (!user || !currentSessionId) return null;

    const exportData: SessionExportData = {
      sessionId: currentSessionId,
      patientId: user.patientId,
      startTime: sessionStartTimeRef.current?.toISOString() ?? '',
      endTime: new Date().toISOString(),
      durationSeconds: sessionDuration,
      metrics: {
        avgHRV,
        minHRV,
        maxHRV,
        hrvVariability,
        painScoreStart: painScoreStart ?? painScoreCurrent,
        painScoreEnd: painScoreCurrent,
        improvement: (painScoreStart ?? painScoreCurrent) - painScoreCurrent,
      },
      hrvReadings: sessionHRVRef.current,
      painScoreUpdates: painScoreHistory,
      musicPlayed: tracksPlayed.map(t => ({
        track: t.track.title,
        startTime: t.startTime,
        duration: t.duration,
      })),
    };

    return exportData;
  }, [
    user,
    currentSessionId,
    sessionDuration,
    avgHRV,
    minHRV,
    maxHRV,
    hrvVariability,
    painScoreStart,
    painScoreCurrent,
    painScoreHistory,
    tracksPlayed,
  ]);

  const value: SessionContextValue = {
    isSessionActive,
    sessionDuration,
    painScoreStart,
    painScoreCurrent,
    painScoreHistory,
    startSession,
    endSession,
    setPainScore,
    exportSession,
    currentSessionId,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
