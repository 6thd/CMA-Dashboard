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
  // Language
  LANGUAGE: '/api/language',
  
  // Add other endpoints here as needed
  // STUDENTS: '/api/students',
  // EXAMS: '/api/exams',
  // etc.
} as const;

export default API_CONFIG;
