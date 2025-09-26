

// src/store/quizStore.ts
import { create } from 'zustand';
import type { Question } from '../data/quizQuestions';
import { API_BASE_URL } from '../config';

type QuizState = 'idle' | 'active' | 'finished' | 'register';

interface Answer {
  questionId: number;
  answer: string;
}

interface StoreState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  quizState: QuizState;
  username: string | null;
  answers: Answer[];
  time_taken: number;
  can_retry: boolean;
  actions: {
    setUsername: (username: string) => void;
    startQuiz: () => Promise<void>;
    selectAnswer: (questionId: number, answer: string) => void;
    goToNextQuestion: () => void;
    submitAttempt: () => Promise<void>;
    submitFinalScore: () => Promise<void>;
    resetQuiz: () => void;
  };
}

const useQuizStore = create<StoreState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  quizState: 'register',
  username: null,
  answers: [],
  time_taken: 0,
  can_retry: true,

  actions: {
    setUsername: (username: string) => {
      set({ username, quizState: 'idle' });
    },

    startQuiz: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/questions`);
        const questions = await response.json();
        set({
          questions,
          quizState: 'active',
          currentQuestionIndex: 0,
          score: 0,
          answers: [],
          time_taken: Date.now(), // Store start time
        });
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        // Handle error appropriately in the UI
      }
    },

    selectAnswer: (questionId: number, answer: string) => {
      set((state) => ({
        answers: [...state.answers.filter(a => a.questionId !== questionId), { questionId, answer }],
      }));
    },

    goToNextQuestion: async () => {
      const { currentQuestionIndex, questions } = get();
      if (currentQuestionIndex < questions.length - 1) {
        set({ currentQuestionIndex: currentQuestionIndex + 1 });
      } else {
        await get().actions.submitAttempt();
      }
    },

    submitAttempt: async () => {
      const { username, answers, time_taken } = get();
      const endTime = Date.now();
      const timeInSeconds = Math.round((endTime - time_taken) / 1000);

      try {
        const response = await fetch(`${API_BASE_URL}/api/submit-attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            answers,
            time_taken: timeInSeconds,
          }),
        });
        const result = await response.json();
        if (result.success) {
          set({
            score: result.score,
            time_taken: result.time_taken,
            can_retry: result.can_retry,
            quizState: 'finished',
          });
        } else {
          // Handle submission error
          console.error("Failed to submit attempt:", result.message);
        }
      } catch (error) {
        console.error("Error submitting attempt:", error);
      }
    },

    submitFinalScore: async () => {
        const { username } = get();
        try {
            const response = await fetch(`${API_BASE_URL}/api/submit-final`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const result = await response.json();
            if (result.success) {
                // Navigate to leaderboard or show final score
            } else {
                console.error("Failed to submit final score:", result.message);
            }
        } catch (error) {
            console.error("Error submitting final score:", error);
        }
    },

    resetQuiz: () => {
      set({
        quizState: 'idle',
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
      });
    },
  },
}));

export const useQuizActions = () => useQuizStore((state) => state.actions);
export default useQuizStore;