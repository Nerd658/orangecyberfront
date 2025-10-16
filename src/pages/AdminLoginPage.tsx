
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizActions } from '../store/quizStore';

const AdminLoginPage = () => {
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setAdminKey } = useQuizActions();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secretKey) {
            setError('La clé secrète est requise.');
            return;
        }

        // For simplicity, we are just storing the key in the state.
        // In a real app, you would want to verify this key with the backend.
        setAdminKey(secretKey);
        navigate('/admin');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
                    <p className="text-gray-600 mt-2">Connectez-vous pour gérer le quiz.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-2">
                            Clé Secrète
                        </label>
                        <input
                            id="secretKey"
                            type="password"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 transition"
                            placeholder="Entrez votre clé secrète"
                        />
                    </div>
                    {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center rounded-full bg-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-600"
                    >
                        Se Connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
