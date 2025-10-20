/**
 * Custom React Query Hooks for Data Fetching
 * Type-safe hooks for all API operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/utils/httpClient';
import { API_ENDPOINTS } from '@/config/api.config';
import { queryKeys, handleQueryError } from '@/config/queryClient';
import { useAppStore } from '@/store/useAppStore';

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'suspended';
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

// ==================== STUDENTS HOOKS ====================

export function useStudents(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.students.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters as Record<string, string>).toString();
      const url = params ? `${API_ENDPOINTS.STUDENTS}?${params}` : API_ENDPOINTS.STUDENTS;
      const response = await httpClient.get<Student[]>(url);
      return response;
    },
    enabled: true,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: async () => {
      const response = await httpClient.get<Student>(`${API_ENDPOINTS.STUDENTS}/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (student: Omit<Student, 'id'>) => {
      const response = await httpClient.post<Student>(API_ENDPOINTS.STUDENTS, student);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      addNotification({
        type: 'success',
        title: 'Student Created',
        message: 'Student has been created successfully',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: handleQueryError(error),
      });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const response = await httpClient.put<Student>(
        `${API_ENDPOINTS.STUDENTS}/${id}`,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.lists() });
      addNotification({
        type: 'success',
        title: 'Student Updated',
        message: 'Student information has been updated successfully',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: handleQueryError(error),
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      addNotification({
        type: 'success',
        title: 'Student Deleted',
        message: 'Student has been deleted successfully',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: handleQueryError(error),
      });
    },
  });
}

// ==================== EXAMS HOOKS ====================

export function useExams(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.exams.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters as Record<string, string>).toString();
      const url = params ? `${API_ENDPOINTS.EXAMS}?${params}` : API_ENDPOINTS.EXAMS;
      const response = await httpClient.get<Exam[]>(url);
      return response;
    },
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: queryKeys.exams.detail(id),
    queryFn: async () => {
      const response = await httpClient.get<Exam>(`${API_ENDPOINTS.EXAMS}/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  const addNotification = useAppStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (exam: Omit<Exam, 'id' | 'createdAt'>) => {
      const response = await httpClient.post<Exam>(API_ENDPOINTS.EXAMS, exam);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
      addNotification({
        type: 'success',
        title: 'Exam Created',
        message: 'Exam has been created successfully',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: handleQueryError(error),
      });
    },
  });
}

// ==================== QUESTIONS HOOKS ====================

export function useQuestions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.questions.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters as Record<string, string>).toString();
      const url = params ? `${API_ENDPOINTS.QUESTIONS}?${params}` : API_ENDPOINTS.QUESTIONS;
      const response = await httpClient.get<Question[]>(url);
      return response;
    },
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(id),
    queryFn: async () => {
      const response = await httpClient.get<Question>(`${API_ENDPOINTS.QUESTIONS}/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

// ==================== ANALYTICS HOOKS ====================

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async () => {
      const response = await httpClient.get<{
        totalStudents: number;
        totalExams: number;
        averageScore: number;
        completionRate: number;
      }>(API_ENDPOINTS.ANALYTICS_DASHBOARD);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: queryKeys.analytics.studentProgress(studentId),
    queryFn: async () => {
      const response = await httpClient.get<{
        completedExams: number;
        averageScore: number;
        progress: number;
      }>(`${API_ENDPOINTS.ANALYTICS}/students/${studentId}/progress`);
      return response;
    },
    enabled: !!studentId,
  });
}

// ==================== PREFETCH HELPERS ====================

export function usePrefetchStudent() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.students.detail(id),
      queryFn: async () => {
        const response = await httpClient.get<Student>(
          `${API_ENDPOINTS.STUDENTS}/${id}`
        );
        return response;
      },
    });
  };
}

export function usePrefetchExam() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.exams.detail(id),
      queryFn: async () => {
        const response = await httpClient.get<Exam>(`${API_ENDPOINTS.EXAMS}/${id}`);
        return response;
      },
    });
  };
}
