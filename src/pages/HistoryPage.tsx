import { useAuth } from '../contexts/AuthContext';
import { getSessionsForPatient } from '../data/mockSessionHistory';
import { SessionList } from '../components/history/SessionList';

export function HistoryPage() {
  const { user } = useAuth();

  // Get sessions for current patient (combines mock + in-memory sessions)
  // Re-fetches on every render, so navigating here shows latest sessions
  const sessions = user ? getSessionsForPatient(user.patientId) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Session History</h1>
      <SessionList sessions={sessions} />
    </div>
  );
}
