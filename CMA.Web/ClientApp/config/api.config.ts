/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Language
  LANGUAGE: '/api/language',
  
  // Students
  STUDENTS: '/api/students',
  
  // Exams
  EXAMS: '/api/exams',
  
  // Questions
  QUESTIONS: '/api/questions',
  
  // Results
  RESULTS: '/api/results',
  
  // Analytics
  ANALYTICS: '/api/analytics',
  ANALYTICS_DASHBOARD: '/api/analytics/dashboard',
  
  // Settings
  SETTINGS: '/api/settings',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  
  // File Upload
  UPLOAD: '/api/upload',
  
  // AI Services
  AI: {
    GENERATE_QUESTIONS: '/api/ai/generate-questions',
    GRADE_ESSAY: '/api/ai/grade-essay',
    SUGGESTIONS: '/api/ai/suggestions',
  },
} as const;

export default API_CONFIG;
