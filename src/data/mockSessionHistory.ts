import { Session } from '../types';

// In-memory store for sessions completed during this browser session
const inMemorySessions: Session[] = [];

// Mock session history for demonstration
// In production, this would be fetched from backend API
const mockSessionHistory: Session[] = [
  {
    sessionId: 'session_100',
    patientId: 'PT001',
    date: '2025-01-15T10:00:00Z',
    durationSeconds: 1500, // 25 minutes
    avgHRV: 48,
    minHRV: 32,
    maxHRV: 61,
    hrvVariability: 8.2,
    painScoreStart: 7,
    painScoreEnd: 4,
    improvement: 43,
    status: 'completed',
    musicPlayed: ['Gentle Waves', 'Breathing Space', 'Deep Rest']
  },
  {
    sessionId: 'session_099',
    patientId: 'PT001',
    date: '2025-01-13T14:30:00Z',
    durationSeconds: 1800, // 30 minutes
    avgHRV: 52,
    minHRV: 38,
    maxHRV: 65,
    hrvVariability: 9.1,
    painScoreStart: 8,
    painScoreEnd: 5,
    improvement: 38,
    status: 'completed',
    musicPlayed: ['Uplift', 'Gentle Waves']
  },
  {
    sessionId: 'session_098',
    patientId: 'PT001',
    date: '2025-01-11T09:15:00Z',
    durationSeconds: 1200, // 20 minutes
    avgHRV: 44,
    minHRV: 28,
    maxHRV: 58,
    hrvVariability: 10.3,
    painScoreStart: 9,
    painScoreEnd: 6,
    improvement: 33,
    status: 'completed',
    musicPlayed: ['Deep Rest', 'Breathing Space']
  },
  {
    sessionId: 'session_097',
    patientId: 'PT001',
    date: '2025-01-09T16:45:00Z',
    durationSeconds: 1500,
    avgHRV: 50,
    minHRV: 35,
    maxHRV: 63,
    hrvVariability: 8.7,
    painScoreStart: 6,
    painScoreEnd: 3,
    improvement: 50,
    status: 'completed',
    musicPlayed: ['Gentle Waves']
  },
  {
    sessionId: 'session_096',
    patientId: 'PT001',
    date: '2025-01-07T11:00:00Z',
    durationSeconds: 2100, // 35 minutes
    avgHRV: 49,
    minHRV: 31,
    maxHRV: 66,
    hrvVariability: 9.5,
    painScoreStart: 8,
    painScoreEnd: 4,
    improvement: 50,
    status: 'completed',
    musicPlayed: ['Breathing Space', 'Gentle Waves', 'Uplift']
  },
  // Sessions for PT002
  {
    sessionId: 'session_050',
    patientId: 'PT002',
    date: '2025-01-14T09:00:00Z',
    durationSeconds: 1800,
    avgHRV: 45,
    minHRV: 30,
    maxHRV: 58,
    hrvVariability: 7.8,
    painScoreStart: 6,
    painScoreEnd: 3,
    improvement: 50,
    status: 'completed',
    musicPlayed: ['Deep Rest', 'Heartbeat Echo']
  },
  {
    sessionId: 'session_049',
    patientId: 'PT002',
    date: '2025-01-12T15:30:00Z',
    durationSeconds: 1500,
    avgHRV: 51,
    minHRV: 36,
    maxHRV: 64,
    hrvVariability: 8.9,
    painScoreStart: 7,
    painScoreEnd: 4,
    improvement: 43,
    status: 'completed',
    musicPlayed: ['Gentle Waves', 'Breathing Space']
  },
  // Sessions for PT003
  {
    sessionId: 'session_025',
    patientId: 'PT003',
    date: '2025-01-15T11:30:00Z',
    durationSeconds: 1200,
    avgHRV: 46,
    minHRV: 33,
    maxHRV: 59,
    hrvVariability: 8.1,
    painScoreStart: 5,
    painScoreEnd: 2,
    improvement: 60,
    status: 'completed',
    musicPlayed: ['Uplift', 'Heartbeat Echo']
  },
  {
    sessionId: 'session_024',
    patientId: 'PT003',
    date: '2025-01-13T10:00:00Z',
    durationSeconds: 1800,
    avgHRV: 53,
    minHRV: 40,
    maxHRV: 68,
    hrvVariability: 9.2,
    painScoreStart: 4,
    painScoreEnd: 2,
    improvement: 50,
    status: 'completed',
    musicPlayed: ['Breathing Space', 'Deep Rest']
  }
];

// Add a completed session to in-memory store
export const addSession = (session: Session): void => {
  inMemorySessions.unshift(session); // Add to beginning (most recent first)
};

// Get sessions for a specific patient (combines mock + in-memory)
export const getSessionsForPatient = (patientId: string): Session[] => {
  const allSessions = [...inMemorySessions, ...mockSessionHistory];
  return allSessions
    .filter(session => session.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get a single session by ID
export const getSessionById = (sessionId: string): Session | undefined => {
  const allSessions = [...inMemorySessions, ...mockSessionHistory];
  return allSessions.find(session => session.sessionId === sessionId);
};
