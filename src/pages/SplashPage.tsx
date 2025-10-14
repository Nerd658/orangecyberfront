
// src/pages/SplashPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers la page d'inscription après 4 secondes
    const timer = setTimeout(() => {
      navigate('/guide');
    }, 3000);

    // Nettoie le timer si l'utilisateur quitte la page avant la fin
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center z-10">
        {/* Le loader recréé en pur CSS avec Tailwind */}
        <div
          className="w-20 h-20 border-8 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-8 mx-auto"
          role="status"
        >
          <span className="sr-only">Chargement...</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in">
            Mois de la Cyber 2025
        </h1>
        <p className="text-xl md:text-2xl opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Orange CyberQuiz Challenge 2025
        </p>
      </div>
    </div>
  );
};

export default SplashPage;