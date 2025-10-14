
// src/pages/ReviewPage.tsx
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'react-feather';
import useQuizStore, { useQuizActions } from '../store/quizStore';
import { API_BASE_URL } from '../config';
import type { Question } from '../data/quizQuestions';

interface CorrectAnswer {
  questionId: number;
  correct_answer: string;
}

const ReviewPage = () => {
    const { questions, answers: userAnswers } = useQuizStore();
    const { setHasReviewedAnswers } = useQuizActions();
    const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasReviewedAnswers();
    }, [setHasReviewedAnswers]);

    useEffect(() => {
        const fetchCorrectAnswers = async () => {
            if (questions.length === 0) return;

            setIsLoading(true);
            try {
                const questionIds = questions.map(q => q.id);
                const response = await fetch(`${API_BASE_URL}/api/answers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ questionIds }),
                });
                const data = await response.json();
                if (data.success) {
                    setCorrectAnswers(data.answers);
                }
            } catch (error) {
                console.error("Failed to fetch correct answers:", error);
            }
            setIsLoading(false);
        };

        fetchCorrectAnswers();
    }, [questions]);

    const getAnswerForQuestion = (questionId: number) => {
        return userAnswers.find(a => a.questionId === questionId);
    };

    const getCorrectAnswerForQuestion = (questionId: number) => {
        return correctAnswers.find(a => a.questionId === questionId);
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Chargement de la correction...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Correction du Quiz</h1>
                <div className="space-y-6">
                    {questions.map((question: Question, index: number) => {
                        const userAnswer = getAnswerForQuestion(question.id);
                        const correctAnswer = getCorrectAnswerForQuestion(question.id);

                        return (
                            <div key={question.id} className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">{index + 1}. {question.question_text}</h2>
                                <div className="space-y-3">
                                    {question.options.map((option: string) => {
                                        const isUserAnswer = userAnswer?.answer === option;
                                        const isCorrectAnswer = correctAnswer?.correct_answer === option;

                                        let optionClass = 'border-gray-300';
                                        let Icon = HelpCircle;

                                        if (isCorrectAnswer) {
                                            optionClass = 'border-green-500 bg-green-50';
                                            Icon = CheckCircle;
                                        } else if (isUserAnswer && !isCorrectAnswer) {
                                            optionClass = 'border-red-500 bg-red-50';
                                            Icon = XCircle;
                                        }

                                        return (
                                            <div key={option} className={`flex items-center rounded-lg border p-3 ${optionClass}`}>
                                                <Icon className={`mr-3 h-5 w-5 ${isCorrectAnswer ? 'text-green-600' : isUserAnswer ? 'text-red-600' : 'text-gray-400'}`} />
                                                <span className="flex-1 text-gray-800">{option}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
