
// src/pages/DeniedPage.tsx
import { useNavigate } from 'react-router-dom';
import { Frown } from 'react-feather';

const DeniedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
                <Frown className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Accès refusé</h1>
                <p className="text-gray-600 mb-6">
                    Vous avez déjà soumis votre score ou utilisé toutes vos tentatives. Vous ne pouvez plus jouer.
                </p>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="w-full flex justify-center items-center rounded-full bg-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-600"
                >
                    Voir le classement
                </button>
            </div>
        </div>
    );
};

export default DeniedPage;
