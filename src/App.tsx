
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;