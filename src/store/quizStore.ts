







// src/store/quizStore.ts


import { create } from 'zustand';


import { persist } from 'zustand/middleware';


import type { Question } from '../data/quizQuestions';


import { API_BASE_URL, QUIZ_DURATION_SECONDS } from '../config';


import { storageWithExpiry } from './storage';





type QuizState = 'idle' | 'loading' | 'active' | 'finished' | 'register' | 'denied';





interface Answer {


  questionId: number;


  answer: string;


}





interface QuizSettings {
  is_open: boolean;
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


  attempts: number;


  hasSubmitted: boolean;


  hasReviewedAnswers: boolean;


  timeLeft: number;


  timerId: number | null;


  isSubmitting: boolean;


  adminKey: string | null;


  quizSettings: QuizSettings | null;


  actions: {


    setUsername: (username: string) => void;


    startQuiz: () => Promise<void>;


    selectAnswer: (questionId: number, answer: string) => void;


    goToNextQuestion: () => void;


    submitAttempt: () => Promise<void>;


    submitFinalScore: () => Promise<void>;


    resetQuiz: () => void;


    setHasReviewedAnswers: () => void;


    incrementAttempts: () => void;


    decrementTime: () => void;


    stopTimer: () => void;


    setAdminKey: (key: string) => void;


        fetchAdminQuizSettings: () => Promise<void>;


        fetchPublicQuizSettings: () => Promise<void>;


        updateQuizSettings: (settings: Partial<QuizSettings>) => Promise<void>;


      };


    }


    


    const useQuizStore = create<StoreState>()(


      persist(


        (set, get) => ({


          questions: [],


          currentQuestionIndex: 0,


          score: 0,


          quizState: 'register',


          username: null,


          answers: [],


          time_taken: 0,


          can_retry: true,


          attempts: 0,


          hasSubmitted: false,


          hasReviewedAnswers: false,


          timeLeft: QUIZ_DURATION_SECONDS,


          timerId: null,


          isSubmitting: false,


          adminKey: null,


          quizSettings: null,


    


          actions: {


            setUsername: (username: string) => {


              set({ username, quizState: 'idle' });


            },


    


            startQuiz: async () => {


              const { quizState, attempts, hasSubmitted } = get();


    


              if (quizState === 'loading' || quizState === 'active') {


                return;


              }


    


              set({ quizState: 'loading' });


    


              if (hasSubmitted) {


                set({ quizState: 'denied' });


                return;


              }


              if (attempts >= 3) {


                set({ quizState: 'denied' });


                return;


              }


    


              try {


                const response = await fetch(`${API_BASE_URL}/api/questions`);


                const questions = await response.json();


                get().actions.incrementAttempts();


                set({


                  questions,


                  quizState: 'active',


                  currentQuestionIndex: 0,


                  score: 0,


                  answers: [],


                  time_taken: Date.now(), // Store start time


                  timeLeft: QUIZ_DURATION_SECONDS,


                });


    


                const timerId = setInterval(() => get().actions.decrementTime(), 1000);


                set({ timerId });


    


              } catch (error) {


                console.error("Failed to fetch questions:", error);


                set({ quizState: 'idle' }); // Reset state on error


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


              const { quizState, isSubmitting, timeLeft, username, answers, time_taken } = get();


    


              if (quizState === 'finished' || isSubmitting) {


                return;


              }


    


              set({ isSubmitting: true });


              get().actions.stopTimer();


    


              const endTime = Date.now();


              const timeInSeconds = timeLeft === 0 ? QUIZ_DURATION_SECONDS : Math.round((endTime - time_taken) / 1000);


    


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


                  console.error("Failed to submit attempt:", result.message);


                  if (result.message === 'Nombre maximal de tentatives atteint') {


                    set({ quizState: 'denied' });


                  }


                }


              } catch (error) {


                console.error("Error submitting attempt:", error);


              } finally {


                set({ isSubmitting: false });


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


                        set({ hasSubmitted: true });


                    } else {


                        console.error("Failed to submit final score:", result.message);


                    }


                } catch (error) {


                    console.error("Error submitting final score:", error);


                }


            },


    


            resetQuiz: () => {


              get().actions.stopTimer();


              set({


                quizState: 'idle',


                currentQuestionIndex: 0,


                score: 0,


                answers: [],


                hasReviewedAnswers: false,


              });


            },


    


            setHasReviewedAnswers: () => {


              set({ hasReviewedAnswers: true });


            },


    


            incrementAttempts: () => {


              set((state) => ({ attempts: state.attempts + 1 }));


            },


    


            decrementTime: () => {


              const { timeLeft, isSubmitting, quizState } = get();


              if (timeLeft > 0) {


                set({ timeLeft: timeLeft - 1 });


              } else if (!isSubmitting && quizState === 'active') {


                get().actions.submitAttempt();


              }


            },


    


            stopTimer: () => {


              const { timerId } = get();


              if (timerId) {


                clearInterval(timerId);


                set({ timerId: null });


              }


            },


    


            setAdminKey: (key: string) => {


              set({ adminKey: key });


            },


    


            fetchAdminQuizSettings: async () => {


              try {


                const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {


                  headers: {


                    'Authorization': `Bearer ${get().adminKey}`,


                  },


                });


                if (response.ok) {


                  const settings = await response.json();


                  set({ quizSettings: settings });


                }


              } catch (error) {


                console.error('Failed to fetch admin quiz settings:', error);


              }


            },


    


            fetchPublicQuizSettings: async () => {


              try {


                const response = await fetch(`${API_BASE_URL}/api/settings`);


                if (response.ok) {


                  const settings = await response.json();


                  set({ quizSettings: settings });


                }


              } catch (error) {


                console.error('Failed to fetch public quiz settings:', error);


              }


            },


    


            updateQuizSettings: async (settings: Partial<QuizSettings>) => {


              try {


                const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {


                  method: 'PUT',


                  headers: {


                    'Content-Type': 'application/json',


                    'Authorization': `Bearer ${get().adminKey}`,


                  },


                  body: JSON.stringify(settings),


                });


                if (response.ok) {


                  const updatedSettings = await response.json();


                  set({ quizSettings: updatedSettings });


                }


              } catch (error) {


                console.error('Failed to update quiz settings:', error);


              }


            },


          },


        }),


        {


          name: 'quiz-storage',


          storage: storageWithExpiry,


                partialize: (state) =>


                  Object.fromEntries(


                    Object.entries(state).filter(([key]) => !['actions', 'timerId'].includes(key))


                  ),


        }


      )


    );


    


    export const useQuizActions = () => useQuizStore((state) => state.actions);


    export default useQuizStore;

