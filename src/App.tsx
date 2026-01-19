import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HRVProvider } from './contexts/HRVContext';
import { MusicProvider } from './contexts/MusicContext';
import { SessionProvider } from './contexts/SessionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { SessionPage } from './pages/SessionPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes - Wrapped with providers that depend on auth */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <HRVProvider>
                  <MusicProvider>
                    <SessionProvider>
                      <Layout>
                        <Routes>
                          <Route path="/session" element={<SessionPage />} />
                          <Route path="/history" element={<HistoryPage />} />
                          <Route path="*" element={<Navigate to="/session" replace />} />
                        </Routes>
                      </Layout>
                    </SessionProvider>
                  </MusicProvider>
                </HRVProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
