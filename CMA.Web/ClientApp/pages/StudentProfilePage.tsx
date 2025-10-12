import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.js';
import { MOCK_ATTEMPTS as attempts } from '../data/attempts.js';
import { syllabusData as curriculum } from '../data/curriculum.js';

export const StudentProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  
  // Dummy data for student - replace with real data fetching
  const student = { id: studentId, name: `Student ${studentId}`, email: `student${studentId}@example.com` };
  const studentAttempts = attempts.filter(attempt => attempt.student_id === studentId);

  return (
    <Layout>
      <div className="fade-in">
        <h1 className="text-3xl font-bold mb-4 text-white text-shadow">Student Profile</h1>
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-white text-shadow">{student.name}</h2>
          <p className="text-gray-300">{student.email}</p>
        </div>

        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white text-shadow">Exam History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Exam</th>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Score</th>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Date</th>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentAttempts.map(attempt => {
                  return (
                    <tr key={attempt.id} className="hover:bg-white/10">
                      <td className="py-2 px-4 border-b border-white/10 text-gray-200">{attempt.exam_title}</td>
                      <td className="py-2 px-4 border-b border-white/10 text-gray-200">{attempt.percentage}%</td>
                      <td className="py-2 px-4 border-b border-white/10 text-gray-200">{new Date(attempt.submitted_at).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b border-white/10">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${attempt.percentage >= 50 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                          {attempt.percentage >= 50 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};