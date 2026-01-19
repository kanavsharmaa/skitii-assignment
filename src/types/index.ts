// Patient types - Note: condition is NEVER displayed on UI
export interface Patient {
  patientId: string;
  pin: string;
  name: string;
  age: number;
  condition: string; // NEVER show this on UI - healthcare privacy
}

// Safe user type (excludes sensitive data)
export interface SafeUser {
  patientId: string;
  name: string;
  age: number;
  // NO condition, NO pin
}

// HRV types
export type HRVStatus = 'low' | 'normal' | 'high';
export type HRVTrend = 'up' | 'down' | 'stable';

export interface HRVReading {
  value: number;
  timestamp: string;
  status: HRVStatus;
  deviceConnected: boolean;
}

// Music types
export interface Track {
  id: string;
  title: string;
  therapyGoal: string;
  tempo: number;
  key: string;
  mood: string;
  duration: number; // in seconds
  forHRVRange: [number, number];
}

export interface AdaptationEvent {
  reason: string;
  newTrack: Track;
  previousTrack: Track | null;
  timestamp: string;
}

// Session types
export interface PainScoreEntry {
  timestamp: string;
  score: number;
}

export interface MusicPlayedEntry {
  track: string;
  startTime: string;
  duration: number;
}

export interface SessionMetrics {
  avgHRV: number;
  minHRV: number;
  maxHRV: number;
  hrvVariability: number;
  painScoreStart: number;
  painScoreEnd: number;
  improvement: number;
}

export interface Session {
  sessionId: string;
  patientId: string;
  date: string;
  durationSeconds: number;
  avgHRV: number;
  minHRV: number;
  maxHRV: number;
  hrvVariability: number;
  painScoreStart: number;
  painScoreEnd: number;
  improvement: number;
  status: 'active' | 'completed' | 'cancelled';
  musicPlayed: string[];
}

export interface SessionExportData {
  sessionId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  metrics: SessionMetrics;
  hrvReadings: HRVReading[];
  painScoreUpdates: PainScoreEntry[];
  musicPlayed: MusicPlayedEntry[];
}

// Auth types
export interface AuthState {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}
