import { Track } from '../types';

// Music tracks for adaptive music therapy
// Each track has an optimal HRV range where it's most effective
export const musicTracks: Track[] = [
  {
    id: 'track_001',
    title: 'Gentle Waves',
    therapyGoal: 'Pain Relief',
    tempo: 58,
    key: 'C Major',
    mood: 'Calming',
    duration: 300, // 5 minutes
    forHRVRange: [20, 45] // Best for stressed state
  },
  {
    id: 'track_002',
    title: 'Breathing Space',
    therapyGoal: 'Anxiety Reduction',
    tempo: 62,
    key: 'G Major',
    mood: 'Grounding',
    duration: 240, // 4 minutes
    forHRVRange: [25, 50]
  },
  {
    id: 'track_003',
    title: 'Uplift',
    therapyGoal: 'Mood Enhancement',
    tempo: 75,
    key: 'D Major',
    mood: 'Uplifting',
    duration: 300, // 5 minutes
    forHRVRange: [45, 80] // Best for relaxed state
  },
  {
    id: 'track_004',
    title: 'Deep Rest',
    therapyGoal: 'Sleep Support',
    tempo: 52,
    key: 'A Minor',
    mood: 'Meditative',
    duration: 600, // 10 minutes
    forHRVRange: [30, 60]
  },
  {
    id: 'track_005',
    title: 'Heartbeat Echo',
    therapyGoal: 'Grounding',
    tempo: 65,
    key: 'E Minor',
    mood: 'Stabilizing',
    duration: 360, // 6 minutes
    forHRVRange: [35, 65]
  }
];

// Get track by ID
export const getTrackById = (id: string): Track | undefined => {
  return musicTracks.find(track => track.id === id);
};

// Get tracks suitable for a given HRV value
export const getTracksForHRV = (hrv: number): Track[] => {
  return musicTracks.filter(track => {
    const [min, max] = track.forHRVRange;
    return hrv >= min && hrv <= max;
  });
};

// Get calming tracks (for stress, HRV < 30)
export const getCalmingTracks = (): Track[] => {
  return musicTracks.filter(track => track.tempo < 60);
};

// Get uplifting tracks (for relaxed state, HRV > 60)
export const getUpliftingTracks = (): Track[] => {
  return musicTracks.filter(track => track.tempo >= 60 && track.tempo <= 80);
};
