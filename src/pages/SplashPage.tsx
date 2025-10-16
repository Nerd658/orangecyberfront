


import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io-client
import { API_BASE_URL } from '../config';

interface QuizSettings {
  is_open: boolean;
}

const SplashPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // WebSocket logic for real-time updates
  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server from SplashPage');
    });

    socket.on('quiz_settings_updated', (updatedSettings) => {
      console.log('Quiz settings updated via WebSocket:', updatedSettings);
      setSettings(updatedSettings);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="w-20 h-20 border-8 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-8 mx-auto"
          role="status"
        >
          <span className="sr-only">Chargement...</span>
        </div>
      );
    }

    if (settings?.is_open) {
      return (
        <button
          onClick={() => navigate('/guide')}
          className="bg-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold transition-transform hover:scale-105"
        >
          Participer au Quiz
        </button>
      );
    }

    return <h2 className="text-2xl font-bold">Le quiz est actuellement fermé.</h2>;
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
            Mois de la Cyber 2025
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Orange CyberQuiz Challenge 2025
        </p>
        {renderContent()}
      </div>
    </div>
  );
};

export default SplashPage;
