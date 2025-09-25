
// src/pages/ResultsPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuizStore, { useQuizActions } from '../store/quizStore';
import { RefreshCw } from 'react-feather';

const ResultsPage = () => {
    const navigate = useNavigate();
    const { score, time_taken, can_retry, questions } = useQuizStore();
    const { resetQuiz, submitFinalScore } = useQuizActions();
    const totalQuestions = questions.length;
    const [loading, setLoading] = useState(false);

    const getResultMessage = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage <= 40) return { message: "C'est un début, continuez à apprendre !", color: "text-red-500" };
        if (percentage <= 60) return { message: "Pas mal, mais vous pouvez faire mieux !", color: "text-yellow-500" };
        if (percentage <= 80) return { message: "Bien joué, vous avez de bonnes connaissances !", color: "text-blue-500" };
        return { message: "Excellent ! Vous êtes un expert en cybersécurité !", color: "text-green-500" };
    };

    const { message, color } = getResultMessage();

    const handleRetry = () => {
        if (can_retry) {
            resetQuiz();
            navigate('/quiz');
        } else {
            alert("Vous avez utilisé tous vos essais.");
            navigate('/leaderboard');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await submitFinalScore();
            navigate('/leaderboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8 rounded-2xl bg-white shadow-xl">
                    <div className="rounded-t-2xl bg-orange-500 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white">Vos Résultats</h1>
                    </div>
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h2 className={`mb-2 text-2xl font-semibold ${color}`}>{message}</h2>
                            <p className="my-4 text-5xl font-bold text-gray-800">
                                {score} <span className="text-3xl font-medium">/ {totalQuestions}</span>
                            </p>
                            <p className="text-lg text-gray-600">Temps: {time_taken} secondes</p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                className="w-full flex justify-center items-center rounded-full bg-blue-500 px-8 py-3 font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-600 disabled:bg-blue-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Soumission en cours...
                                    </>
                                ) : (
                                    'Soumettre mon score final'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {can_retry && (
                    <div className="text-center">
                        <button
                            onClick={handleRetry}
                            className="mx-auto flex items-center justify-center font-medium text-orange-500 hover:underline"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Refaire le quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
