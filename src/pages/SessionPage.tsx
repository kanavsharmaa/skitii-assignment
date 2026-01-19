import React from 'react';
import { useHRV } from '../contexts/HRVContext';
import { useSession } from '../contexts/SessionContext';
import { HRVDisplay } from '../components/hrv/HRVDisplay';
import { HRVChart } from '../components/hrv/HRVChart';
import { DeviceStatus } from '../components/hrv/DeviceStatus';
import { StressAlert } from '../components/hrv/StressAlert';
import { MusicPlayer } from '../components/music/MusicPlayer';
import { SessionTimer } from '../components/analytics/SessionTimer';
import { SessionMetrics } from '../components/analytics/SessionMetrics';
import { PainScoreTracker } from '../components/analytics/PainScoreTracker';
import { ExportButton } from '../components/analytics/ExportButton';
import { HRVDebugPanel } from '../components/debug/HRVDebugPanel';

export function SessionPage() {
  const {
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
  } = useHRV();

  const {
    isSessionActive,
    sessionDuration,
    painScoreStart,
    painScoreCurrent,
    startSession,
    endSession,
    setPainScore,
    exportSession,
  } = useSession();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Session Control Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SessionTimer duration={sessionDuration} isActive={isSessionActive} />
        </div>
        <div className="flex items-center gap-3">
          {!isSessionActive ? (
            <button
              onClick={startSession}
              className="btn-primary"
            >
              Start Session
            </button>
          ) : (
            <>
              <ExportButton onExport={exportSession} disabled={!isSessionActive} />
              <button
                onClick={endSession}
                className="h-[60px] px-6 bg-red-500 hover:bg-red-600 text-white text-lg font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                End Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - HRV Monitoring */}
        <div className="space-y-4">
          {/* HRV Display with Device Status */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <HRVDisplay
                value={currentHRV?.value ?? null}
                status={status}
                trend={trend}
              />
            </div>
            <DeviceStatus connected={deviceConnected} />
          </div>

          {/* HRV Chart */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-3">HRV Trend</h3>
            <HRVChart data={hrvHistory} />
          </div>

          {/* Session Metrics */}
          <SessionMetrics
            avgHRV={avgHRV}
            minHRV={minHRV}
            maxHRV={maxHRV}
            hrvVariability={hrvVariability}
          />
        </div>

        {/* Right Column - Music Player & Pain Score */}
        <div className="space-y-4">
          {/* Music Player */}
          <MusicPlayer />

          {/* Pain Score Tracker */}
          <PainScoreTracker
            currentScore={painScoreCurrent}
            initialScore={painScoreStart}
            onScoreChange={setPainScore}
          />
        </div>
      </div>

      {/* Stress Alert Modal */}
      <StressAlert
        isVisible={isStressAlertVisible}
        onDismiss={dismissStressAlert}
      />

      {/* Debug Panel - only visible in development */}
      {import.meta.env.DEV && <HRVDebugPanel />}
    </div>
  );
}
