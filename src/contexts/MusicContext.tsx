import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Track, AdaptationEvent } from '../types';
import { musicTracks } from '../data/mockTracks';
import { selectTrackForHRV, getRecommendedQueue } from '../services/musicAdapter';
import { useHRV } from './HRVContext';

interface MusicContextValue {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100 percentage
  elapsedTime: number; // seconds
  volume: number; // 0-100
  queue: Track[];
  lastAdaptation: AdaptationEvent | null;
  showAdaptationAlert: boolean;
  // Controls
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  setVolume: (volume: number) => void;
  selectTrack: (track: Track) => void;
  dismissAdaptationAlert: () => void;
  // Track history for session
  tracksPlayed: Array<{ track: Track; startTime: string; duration: number }>;
}

const MusicContext = createContext<MusicContextValue | null>(null);

interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const { currentHRV } = useHRV();

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [queue, setQueue] = useState<Track[]>([]);
  const [lastAdaptation, setLastAdaptation] = useState<AdaptationEvent | null>(null);
  const [showAdaptationAlert, setShowAdaptationAlert] = useState(false);
  const [tracksPlayed, setTracksPlayed] = useState<Array<{ track: Track; startTime: string; duration: number }>>([]);

  // Track start time for duration calculation
  const trackStartTimeRef = useRef<Date | null>(null);
  const currentTrackRef = useRef<Track | null>(null);

  // Initialize with first track
  useEffect(() => {
    if (!currentTrack && musicTracks.length > 0) {
      setCurrentTrack(musicTracks[0]);
      setQueue(musicTracks.slice(1, 4));
    }
  }, [currentTrack]);

  // Update queue when HRV changes
  useEffect(() => {
    if (currentHRV) {
      const recommendedQueue = getRecommendedQueue(currentHRV.value, currentTrack);
      setQueue(recommendedQueue);
    }
  }, [currentHRV, currentTrack]);

  // Adaptive music selection based on HRV
  useEffect(() => {
    if (!currentHRV || !isPlaying) return;

    const { track: recommendedTrack, adaptation } = selectTrackForHRV(
      currentHRV.value,
      currentTrack
    );

    if (adaptation) {
      // Record the track that was playing
      if (currentTrackRef.current && trackStartTimeRef.current) {
        const duration = Math.floor((new Date().getTime() - trackStartTimeRef.current.getTime()) / 1000);
        setTracksPlayed(prev => [...prev, {
          track: currentTrackRef.current!,
          startTime: trackStartTimeRef.current!.toISOString(),
          duration,
        }]);
      }

      // Switch to new track
      setCurrentTrack(recommendedTrack);
      setProgress(0);
      setElapsedTime(0);
      setLastAdaptation(adaptation);
      setShowAdaptationAlert(true);

      // Update refs for new track
      trackStartTimeRef.current = new Date();
      currentTrackRef.current = recommendedTrack;
    }
  }, [currentHRV, isPlaying, currentTrack]);

  // Progress timer (simulates playback)
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = prev + 1;

        // Calculate progress percentage
        const progressPercent = (newElapsed / currentTrack.duration) * 100;
        setProgress(Math.min(progressPercent, 100));

        // Auto-advance to next track when current ends
        if (newElapsed >= currentTrack.duration) {
          skipToNext();
          return 0;
        }

        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Update ref when track changes
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const skipToNext = useCallback(() => {
    if (queue.length === 0) return;

    // Record current track duration
    if (currentTrackRef.current && trackStartTimeRef.current) {
      const duration = Math.floor((new Date().getTime() - trackStartTimeRef.current.getTime()) / 1000);
      setTracksPlayed(prev => [...prev, {
        track: currentTrackRef.current!,
        startTime: trackStartTimeRef.current!.toISOString(),
        duration,
      }]);
    }

    const nextTrack = queue[0];
    setCurrentTrack(nextTrack);
    setQueue(prev => prev.slice(1));
    setProgress(0);
    setElapsedTime(0);
    trackStartTimeRef.current = new Date();
  }, [queue]);

  const play = useCallback(() => {
    if (!trackStartTimeRef.current) {
      trackStartTimeRef.current = new Date();
    }
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const skipNext = useCallback(() => {
    skipToNext();
  }, [skipToNext]);

  const skipPrevious = useCallback(() => {
    // Reset current track to beginning
    setProgress(0);
    setElapsedTime(0);
    trackStartTimeRef.current = new Date();
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(100, newVolume)));
  }, []);

  const selectTrack = useCallback((track: Track) => {
    // Record previous track
    if (currentTrackRef.current && trackStartTimeRef.current && isPlaying) {
      const duration = Math.floor((new Date().getTime() - trackStartTimeRef.current.getTime()) / 1000);
      setTracksPlayed(prev => [...prev, {
        track: currentTrackRef.current!,
        startTime: trackStartTimeRef.current!.toISOString(),
        duration,
      }]);
    }

    setCurrentTrack(track);
    setProgress(0);
    setElapsedTime(0);
    trackStartTimeRef.current = new Date();

    // Remove from queue if present
    setQueue(prev => prev.filter(t => t.id !== track.id));
  }, [isPlaying]);

  const dismissAdaptationAlert = useCallback(() => {
    setShowAdaptationAlert(false);
  }, []);

  const value: MusicContextValue = {
    currentTrack,
    isPlaying,
    progress,
    elapsedTime,
    volume,
    queue,
    lastAdaptation,
    showAdaptationAlert,
    play,
    pause,
    togglePlay,
    skipNext,
    skipPrevious,
    setVolume,
    selectTrack,
    dismissAdaptationAlert,
    tracksPlayed,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
