/**
 * React Query Configuration
 * Centralized configuration for data fetching and caching
 */

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query Provider Component
interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children,
    React.createElement(ReactQueryDevtools, {
      initialIsOpen: false,
    })
  );
}

// Query Keys Factory
export const queryKeys = {
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.students.lists(), filters] as const,
    details: () => [...queryKeys.students.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.students.details(), id] as const,
  },
  exams: {
    all: ['exams'] as const,
    lists: () => [...queryKeys.exams.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.exams.lists(), filters] as const,
    details: () => [...queryKeys.exams.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.exams.details(), id] as const,
    results: (examId: string) => [...queryKeys.exams.detail(examId), 'results'] as const,
  },
  questions: {
    all: ['questions'] as const,
    lists: () => [...queryKeys.questions.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.questions.lists(), filters] as const,
    details: () => [...queryKeys.questions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.questions.details(), id] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    studentProgress: (studentId: string) =>
      [...queryKeys.analytics.all, 'student-progress', studentId] as const,
    examStats: (examId: string) =>
      [...queryKeys.analytics.all, 'exam-stats', examId] as const,
  },
  settings: {
    all: ['settings'] as const,
    general: () => [...queryKeys.settings.all, 'general'] as const,
    user: (userId: string) => [...queryKeys.settings.all, 'user', userId] as const,
  },
} as const;

// Query error handler
export function handleQueryError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// Prefetch helper
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
) {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}

// Invalidate queries helper
export function invalidateQueries(queryKey: readonly unknown[]) {
  return queryClient.invalidateQueries({ queryKey });
}

// Reset all queries
export function resetQueries() {
  return queryClient.clear();
}

export default queryClient;
