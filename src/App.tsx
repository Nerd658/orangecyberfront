
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';
import GuidePage from './pages/GuidePage';
import DeniedPage from './pages/DeniedPage';
import ReviewPage from './pages/ReviewPage';
import useQuizStore from './store/quizStore';

function App() {
  const { quizState, hasSubmitted } = useQuizStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/denied" element={<DeniedPage />} />

        <Route 
          path="/register" 
          element={hasSubmitted ? <Navigate to="/denied" /> : <RegisterPage />} 
        />
        <Route 
          path="/quiz" 
          element={quizState === 'denied' ? <Navigate to="/denied" /> : <QuizPage />} 
        />

        <Route path="/results" element={<ResultsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;