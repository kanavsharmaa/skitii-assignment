import { Track, AdaptationEvent, HRVStatus } from '../types';
import { musicTracks } from '../data/mockTracks';

/**
 * Select the best track based on current HRV
 * Core adaptive music logic
 */
export function selectTrackForHRV(
  currentHRV: number,
  currentTrack: Track | null
): { track: Track; adaptation: AdaptationEvent | null } {
  // Get HRV status zone
  const zone = getHRVZone(currentHRV);

  // Find tracks matching current HRV range
  const matchingTracks = musicTracks.filter(track => {
    const [min, max] = track.forHRVRange;
    return currentHRV >= min && currentHRV <= max;
  });

  // If current track is still appropriate, no change needed
  if (currentTrack && matchingTracks.some(t => t.id === currentTrack.id)) {
    return { track: currentTrack, adaptation: null };
  }

  // If no matching tracks, fall back to best track for zone
  let selectedTrack: Track;
  if (matchingTracks.length > 0) {
    selectedTrack = matchingTracks[0];
  } else {
    // Fallback based on zone
    selectedTrack = getBestTrackForZone(zone);
  }

  // Generate patient-friendly adaptation message
  const adaptation: AdaptationEvent = {
    reason: generateAdaptationReason(zone, selectedTrack),
    newTrack: selectedTrack,
    previousTrack: currentTrack,
    timestamp: new Date().toISOString(),
  };

  return { track: selectedTrack, adaptation };
}

/**
 * Determine HRV zone from value
 */
function getHRVZone(hrv: number): HRVStatus {
  if (hrv < 30) return 'low';
  if (hrv > 60) return 'high';
  return 'normal';
}

/**
 * Get best track for a specific HRV zone
 */
function getBestTrackForZone(zone: HRVStatus): Track {
  switch (zone) {
    case 'low':
      // Stressed - need calming, slow music (<60 BPM)
      return musicTracks.find(t => t.tempo < 60) || musicTracks[0];
    case 'high':
      // Relaxed - can offer more engaging music (60-80 BPM)
      return musicTracks.find(t => t.tempo >= 60 && t.tempo <= 80) || musicTracks[0];
    case 'normal':
    default:
      // Normal - maintain balance
      return musicTracks.find(t => t.tempo >= 55 && t.tempo <= 65) || musicTracks[0];
  }
}

/**
 * Generate patient-friendly adaptation message
 * These messages should be calming and supportive, not alarming
 */
function generateAdaptationReason(zone: HRVStatus, track: Track): string {
  switch (zone) {
    case 'low':
      return `We've noticed some stress signals. Switching to "${track.title}" to help you relax.`;
    case 'high':
      return `Your relaxation is deepening. Playing "${track.title}" to continue your progress.`;
    case 'normal':
    default:
      return `Your body is responding well. Continuing with "${track.title}".`;
  }
}

/**
 * Get recommended queue based on current HRV
 */
export function getRecommendedQueue(
  currentHRV: number,
  currentTrack: Track | null
): Track[] {
  // Get tracks that match or are close to current HRV range
  const recommendations = musicTracks
    .filter(track => {
      // Exclude current track
      if (currentTrack && track.id === currentTrack.id) return false;

      // Include tracks within ±10ms of current HRV range
      const [min, max] = track.forHRVRange;
      return currentHRV >= min - 10 && currentHRV <= max + 10;
    })
    .slice(0, 3);

  // If not enough recommendations, add more tracks
  if (recommendations.length < 2) {
    const additionalTracks = musicTracks
      .filter(t => !recommendations.includes(t) && t.id !== currentTrack?.id)
      .slice(0, 3 - recommendations.length);
    recommendations.push(...additionalTracks);
  }

  return recommendations.slice(0, 3);
}

/**
 * Get reason why a track is recommended
 */
export function getRecommendationReason(track: Track, currentHRV: number): string {
  const [min, max] = track.forHRVRange;

  if (currentHRV >= min && currentHRV <= max) {
    return 'Matches your current state';
  } else if (currentHRV < min) {
    return 'Helps with relaxation';
  } else {
    return 'Next in therapy sequence';
  }
}
