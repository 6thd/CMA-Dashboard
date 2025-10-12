export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Exam {
  id: string;
  unitId: string; // Link to a unit in the curriculum
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  status: 'draft' | 'published' | 'archived';
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question {
  id: string;
  exam_id?: string;
  sectionId?: string;
  question_text: string;
  question_type: QuestionType;
  options?: Record<string, string>;
  correct_answer: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamAttempt {
  id: string;
  student_id: string;
  student_name: string;
  exam_id: string;
  exam_title: string;
  submitted_at: string;
  score: number;
  total_marks: number;
  percentage: number;
  status: 'in_progress' | 'submitted' | 'evaluated';
}

export interface DashboardStats {
  totalStudents: number;
  activeExams: number;
  totalAttempts: number;
  averageScore: number;
}

export interface Notification {
  id: number;
  read: boolean;
  type: 'submission' | 'registration' | 'high_score' | 'exam_published';
  message: string;
  timestamp: string;
}

export type UserRole = 'Admin' | 'Moderator' | 'Content Creator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SyllabusSection {
  id: string;
  title: string;
  content: string;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  description: string;
  weight: string;
  sections: SyllabusSection[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  xp: number;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}