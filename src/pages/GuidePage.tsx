
// src/pages/GuidePage.tsx
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckSquare, AlertTriangle, User, Clock } from 'react-feather';

const GuidePage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Guide du Orange CyberQuiz 2025</h1>
                    <p className="text-gray-600 mt-2">Quelques règles importantes avant de commencer.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <User className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-gray-800">Renseignez votre CUID</h2>
                            <p className="text-gray-600">Vous devez utiliser votre CUID pour vous identifier et participer au quiz.</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-gray-800">Utilisez uniquement votre CUID</h2>
                            <p className="text-gray-600">Utiliser un autre CUID que le vôtre ou de fausses informations vous pénalisera.</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <CheckSquare className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-gray-800">Lisez avant de cliquer</h2>
                            <p className="text-gray-600">Une fois que vous avez sélectionné une réponse, vous ne pouvez plus la modifier. Soyez donc attentif!</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-gray-800">Trois essais maximum</h2>
                            <p className="text-gray-600">Si votre score ne vous satisfait pas, vous pouvez recommencer le quiz. Mais attention, vous n'avez que trois tentatives au total.</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Clock className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-gray-800">Soyez rapide</h2>
                            <p className="text-gray-600">Le temps est limité pour compléter le quiz. Ne perdez pas de temps !</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleStart}
                        className="w-full flex justify-center items-center rounded-full bg-orange-500 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-600"
                    >
                        <BookOpen className="mr-2" />
                        J'ai compris, commencer le quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuidePage;
