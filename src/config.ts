export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const QUIZ_DURATION_SECONDS = parseInt(import.meta.env.VITE_QUIZ_DURATION_SECONDS || '120', 10);

export const STORAGE_EXPIRATION_HOURS = parseInt(import.meta.env.VITE_STORAGE_EXPIRATION_HOURS || '8', 10);