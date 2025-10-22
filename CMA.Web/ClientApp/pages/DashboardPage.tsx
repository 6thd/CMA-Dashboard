import React, { useState, useEffect, useMemo } from 'react';
import { DashboardStats, ExamAttempt } from '../types.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_ATTEMPTS } from '../data/attempts.js';
import { exportToCsv } from '../services/exportService.js';
import LanguageTest from '../components/LanguageTest.js';

// Mock Data
const MOCK_STATS: DashboardStats = {
  totalStudents: 1250,
  activeExams: 15,
  totalAttempts: 5678,
  averageScore: 78,
};

const MOCK_PERFORMANCE_DATA = [
  { name: 'SU 1: Fin. Statements', 'Avg Score': 72, attempts: 850 },
  { name: 'SU 2: Planning', 'Avg Score': 68, attempts: 720 },
  { name: 'SU 3: Performance', 'Avg Score': 75, attempts: 680 },
  { name: 'SU 4: Cost Mgmt', 'Avg Score': 81, attempts: 550 },
  { name: 'SU 5: Controls', 'Avg Score': 77, attempts: 490 },
  { name: 'SU 6: Tech & Analytics', 'Avg Score': 79, attempts: 420 },
];

const StatCard: React.FC<{ title: string; value: string | number; icon: 'students' | 'exams' | 'attempts' | 'score' }> = ({ title, value, icon }) => {
    const icons = {
        students: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        exams: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
        attempts: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        score: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    };
    const colors = {
        students: 'bg-blue-500',
        exams: 'bg-green-500',
        attempts: 'bg-yellow-500',
        score: 'bg-indigo-500',
    };

    return (
        <div className="widget bg-surface/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-glass p-6 flex items-center justify-between transition-all duration-300 hover:shadow-glass-lg">
            <div>
                <p className="text-sm font-medium text-gray-200 text-shadow">{title}</p>
                <p className="text-3xl font-bold text-white text-shadow">{value}</p>
            </div>
            <div className={`text-white rounded-full p-3 shadow-lg ${colors[icon]} transition-all duration-300 hover:scale-110`}>
                {icons[icon]}
            </div>
        </div>
    );
};

const WeakAreas: React.FC<{ attempts: ExamAttempt[] }> = ({ attempts }) => {
    const weakAreas = useMemo(() => {
        const examScores: { [key: string]: { totalScore: number; count: number; title: string } } = {};
        attempts.forEach(attempt => {
            if (!examScores[attempt.exam_id]) {
                examScores[attempt.exam_id] = { totalScore: 0, count: 0, title: attempt.exam_title };
            }
            examScores[attempt.exam_id].totalScore += attempt.percentage;
            examScores[attempt.exam_id].count++;
        });
        
        return Object.values(examScores)
            .map(exam => ({ ...exam, avg: exam.totalScore / exam.count }))
            .sort((a, b) => a.avg - b.avg)
            .slice(0, 3);
    }, [attempts]);

    return (
        <div className="mt-8 bg-surface/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-glass p-6 transition-all duration-300 hover:shadow-glass-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white text-shadow">Areas for Improvement</h2>
                <a href="#/analytics" className="text-sm text-blue-400 hover:underline focus:outline-none focus:underline">View All</a>
            </div>
            <div className="space-y-4">
                {weakAreas.map(area => (
                    <div key={area.title} className="flex justify-between items-center p-4 bg-red-900/20 rounded-xl transition-all duration-200 hover:bg-red-900/30">
                         <div>
                            <p className="font-medium text-gray-100">{area.title}</p>
                            <p className="text-sm text-gray-400">Needs review and targeted practice.</p>
                        </div>
                        <div className="text-right">
                             <span className="font-bold text-red-400 text-lg">{area.avg.toFixed(1)}%</span>
                             <p className="text-xs text-gray-400">Avg. Score</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(MOCK_STATS);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleExport = () => {
      exportToCsv(MOCK_PERFORMANCE_DATA, 'exam_performance_summary.csv');
  }

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white text-shadow mb-6">Dashboard</h1>
      
      {/* Language Test Component */}
      <div className="mb-6">
        <LanguageTest />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon="students" />
        <StatCard title="Active Exams" value={stats.activeExams} icon="exams" />
        <StatCard title="Total Attempts" value={stats.totalAttempts} icon="attempts" />
        <StatCard title="Average Score" value={`${stats.averageScore}%`} icon="score" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-glass p-6 transition-all duration-300 hover:shadow-glass-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white text-shadow">Exam Performance (CMA/FMAA)</h2>
              <button 
                onClick={handleExport}
                className="text-sm bg-secondary hover:bg-secondary/90 text-white px-3 py-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Export CSV
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MOCK_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#ddd' }} className="text-shadow" />
                <YAxis tick={{ fill: '#ddd' }} className="text-shadow" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="Avg Score" fill="rgba(8, 145, 178, 0.9)" animationDuration={1500} radius={[4, 4, 0, 0]} />
                <Bar dataKey="attempts" fill="rgba(16, 185, 129, 0.9)" animationDuration={1500} radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-1">
            <WeakAreas attempts={MOCK_ATTEMPTS} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;