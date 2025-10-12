import { ExamAttempt } from '../types.js';

export const MOCK_ATTEMPTS: ExamAttempt[] = [
    { id: 'att1', student_id: '1', student_name: 'John Doe', exam_id: 'ex1', exam_title: 'External Financial Statements', submitted_at: '2023-05-20', score: 85, total_marks: 100, percentage: 85, status: 'evaluated' },
    { id: 'att2', student_id: '2', student_name: 'Jane Smith', exam_id: 'ex1', exam_title: 'External Financial Statements', submitted_at: '2023-05-20', score: 92, total_marks: 100, percentage: 92, status: 'evaluated' },
    { id: 'att3', student_id: '1', student_name: 'John Doe', exam_id: 'ex2', exam_title: 'Planning, Budgeting, and Forecasting', submitted_at: '2023-04-15', score: 40, total_marks: 100, percentage: 40, status: 'evaluated' },
    { id: 'att4', student_id: '3', student_name: 'Mike Johnson', exam_id: 'ex1', exam_title: 'External Financial Statements', submitted_at: '2023-05-21', score: 65, total_marks: 100, percentage: 65, status: 'evaluated' },
    { id: 'att5', student_id: '4', student_name: 'Emily Davis', exam_id: 'ex2', exam_title: 'Planning, Budgeting, and Forecasting', submitted_at: '2023-04-15', score: 96, total_marks: 100, percentage: 96, status: 'evaluated' },
    { id: 'att6', student_id: '2', student_name: 'Jane Smith', exam_id: 'ex2', exam_title: 'Planning, Budgeting, and Forecasting', submitted_at: '2023-04-16', score: 70, total_marks: 100, percentage: 70, status: 'evaluated' },
    { id: 'att7', student_id: '5', student_name: 'Robert Brown', exam_id: 'ex3', exam_title: 'Performance Management', submitted_at: '2023-06-10', score: 65, total_marks: 75, percentage: 87, status: 'evaluated' },
    { id: 'att8', student_id: '6', student_name: 'Sarah Wilson', exam_id: 'ex4', exam_title: 'Cost Management', submitted_at: '2023-06-12', score: 62, total_marks: 75, percentage: 83, status: 'evaluated' },
    { id: 'att9', student_id: '7', student_name: 'David Lee', exam_id: 'ex5', exam_title: 'Internal Controls', submitted_at: '2023-06-15', score: 42, total_marks: 50, percentage: 84, status: 'evaluated' },
    { id: 'att10', student_id: '8', student_name: 'Lisa Chen', exam_id: 'ex6', exam_title: 'Technology and Analytics', submitted_at: '2023-06-18', score: 44, total_marks: 50, percentage: 88, status: 'evaluated' },
    { id: 'att11', student_id: '9', student_name: 'Michael Taylor', exam_id: 'ex7', exam_title: 'CMA Part 1 Practice Exam', submitted_at: '2023-06-20', score: 135, total_marks: 150, percentage: 90, status: 'evaluated' },
];