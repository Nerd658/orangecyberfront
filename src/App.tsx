
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import SplashPage from './pages/SplashPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';
import GuidePage from './pages/GuidePage';
import DeniedPage from './pages/DeniedPage';
import ReviewPage from './pages/ReviewPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import useQuizStore, { useQuizActions } from './store/quizStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAllowed: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAllowed, redirectPath = '/' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};

export function App() {
  const { quizState, hasSubmitted, adminKey, quizSettings } = useQuizStore();
  const { fetchPublicQuizSettings, fetchAdminQuizSettings } = useQuizActions();

  useEffect(() => {
    fetchPublicQuizSettings(); // Fetch public settings for all users
  }, [fetchPublicQuizSettings]);

  useEffect(() => {
    if (adminKey) {
      fetchAdminQuizSettings(); // Fetch admin settings only if adminKey is present
    }
  }, [adminKey, fetchAdminQuizSettings]);

  if (!quizSettings) {
    return <div>Loading application settings...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/denied" element={<DeniedPage />} />

        <Route
          path="/guide"
          element={
            <ProtectedRoute isAllowed={quizSettings.is_open}>
              <GuidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute
              isAllowed={quizSettings.is_open && !hasSubmitted}
              redirectPath={quizSettings.is_open && hasSubmitted ? '/denied' : '/'}
            >
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute isAllowed={quizSettings.is_open && quizState !== 'denied'}>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route path="/results" element={<ResultsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={adminKey ? <AdminPage /> : <Navigate to="/admin/login" />}
        />
      </Routes>
    </Router>
  );
}