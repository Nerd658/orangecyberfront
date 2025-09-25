
// src/pages/QuizPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'react-feather';

import useQuizStore, { useQuizActions } from '../store/quizStore';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

const QuizPage = () => {
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, quizState, username } = useQuizStore();
  const { startQuiz, goToNextQuestion, selectAnswer } = useQuizActions();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    startQuiz();
  }, [startQuiz, navigate, username]);

  useEffect(() => {
    if (quizState === 'finished') {
      navigate('/results');
    }
  }, [quizState, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      const currentQuestion = questions[currentQuestionIndex];
      selectAnswer(currentQuestion.id, option);
    }
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    try {
      await goToNextQuestion();
    } finally {
      setLoading(false);
      setSelectedOption(null); // Reset selection for next question
    }
  };

  if (quizState !== 'active' || !questions.length) {
    return <div className="flex h-screen items-center justify-center">Chargement du quiz...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-4 py-6 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-3 text-3xl text-orange-500" />
            <h1 className="text-2xl font-bold">Quiz Cyber 2025</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <ProgressBar progress={progress} />
          <QuestionCard
            question={currentQuestion}
            selectedOption={selectedOption}
            onOptionSelect={handleOptionSelect}
            isAnswered={selectedOption !== null}
          />
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="w-full flex justify-center items-center rounded-full bg-orange-500 px-8 py-3 font-medium text-white transition-colors hover:bg-orange-600 disabled:bg-orange-300"
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
                currentQuestionIndex === questions.length - 1 ? 'Soumettre' : 'Suivant'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
