import React from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { useHRV } from '../../contexts/HRVContext';
import { TrackInfo } from './TrackInfo';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { VolumeControl } from './VolumeControl';
import { AdaptationAlert } from './AdaptationAlert';
import { UpcomingQueue } from './UpcomingQueue';

export function MusicPlayer() {
  const {
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
    skipNext,
    skipPrevious,
    setVolume,
    selectTrack,
    dismissAdaptationAlert,
  } = useMusic();

  const { currentHRV } = useHRV();

  if (!currentTrack) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Loading music player...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Track Information */}
      <TrackInfo track={currentTrack} />

      {/* Player Controls Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar
            progress={progress}
            elapsedTime={elapsedTime}
            totalDuration={currentTrack.duration}
          />
        </div>

        {/* Main Controls */}
        <div className="mb-4">
          <PlayerControls
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onSkipPrevious={skipPrevious}
            onSkipNext={skipNext}
            hasNextTrack={queue.length > 0}
          />
        </div>

        {/* Volume Control */}
        <div className="flex justify-center">
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>

      {/* Upcoming Queue */}
      <UpcomingQueue
        queue={queue}
        currentHRV={currentHRV?.value ?? 45}
        onSelectTrack={selectTrack}
      />

      {/* Adaptation Alert */}
      {lastAdaptation && (
        <AdaptationAlert
          adaptation={lastAdaptation}
          isVisible={showAdaptationAlert}
          onDismiss={dismissAdaptationAlert}
        />
      )}
    </div>
  );
}
