import React, { useState } from 'react';
// Removed Layout import since it's already provided by the router
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_ATTEMPTS as attempts } from '../data/attempts.js';
import { syllabusData as curriculum } from '../data/curriculum.js';
import { questionsBank as questions } from '../data/questions.js';

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ 
    start: '', 
    end: '' 
  });
  const [selectedExam, setSelectedExam] = useState<string>('');

  // Filter attempts based on date range and selected exam
  const filteredAttempts = attempts.filter(attempt => {
    // Date filtering
    if (dateRange.start && dateRange.end) {
      const attemptDate = new Date(attempt.submitted_at);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      if (attemptDate < startDate || attemptDate > endDate) {
        return false;
      }
    }
    
    // Exam filtering
    if (selectedExam && attempt.exam_id !== selectedExam) {
      return false;
    }
    
    return true;
  });

  // Data processing for charts
  const examPerformance = curriculum.map(unit => {
    const unitAttempts = filteredAttempts.filter(a => a.exam_id.startsWith(unit.id.replace('unit', 'ex')));
    const passCount = unitAttempts.filter(a => a.percentage >= 50).length;
    const failCount = unitAttempts.length - passCount;
    return { name: unit.title.replace('Study Unit ', 'SU '), Passed: passCount, Failed: failCount };
  }).filter(item => item.Passed > 0 || item.Failed > 0); // Only show units with data

  const questionDifficulty = questions.map(q => {
    // This is a placeholder logic as we don't have detailed answer data per question
    const successRate = Math.random() * 100; // Placeholder
    return { ...q, successRate };
  }).sort((a, b) => a.successRate - b.successRate).slice(0, 5);

  const overallPassFail = {
    pass: filteredAttempts.filter(a => a.percentage >= 50).length,
    fail: filteredAttempts.filter(a => a.percentage < 50).length,
  };
  const pieData = [
    { name: 'Passed', value: overallPassFail.pass },
    { name: 'Failed', value: overallPassFail.fail },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  // Reset filters
  const resetFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedExam('');
  };

  return (
    // Removed Layout wrapper since it's already provided by the router
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 text-white text-shadow">Analytics Dashboard</h1>
      
      {/* Filter Section */}
      <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-white text-shadow">Filters</h2>
          <button 
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-200 mb-1">Start Date</label>
            <input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-200 mb-1">End Date</label>
            <input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
            />
          </div>
          
          <div>
            <label htmlFor="exam-filter" className="block text-sm font-medium text-gray-200 mb-1">Exam</label>
            <select
              id="exam-filter"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
            >
              <option value="" className="text-black">All Exams</option>
              {Array.from(new Set(attempts.map(a => a.exam_id))).map(examId => {
                const exam = attempts.find(a => a.exam_id === examId);
                return (
                  <option key={examId} value={examId} className="text-black">
                    {exam?.exam_title || examId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-300">
          Showing {filteredAttempts.length} of {attempts.length} attempts
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Performance Bar Chart */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white text-shadow">Exam Pass/Fail Rates</h2>
          {examPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={examPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#ddd' }} className="text-shadow" />
                <YAxis tick={{ fill: '#ddd' }} className="text-shadow" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="Passed" fill="rgba(16, 185, 129, 0.9)" />
                <Bar dataKey="Failed" fill="rgba(239, 68, 68, 0.9)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No data available for selected filters
            </div>
          )}
        </div>

        {/* Overall Pass/Fail Pie Chart */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white text-shadow">Overall Performance</h2>
          {filteredAttempts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No data available for selected filters
            </div>
          )}
        </div>

        {/* Most Difficult Questions */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white text-shadow">Top 5 Most Difficult Questions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Question</th>
                  <th className="py-2 px-4 border-b border-white/20 text-left text-gray-200">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {questionDifficulty.map(q => (
                  <tr key={q.id} className="hover:bg-white/10">
                    <td className="py-2 px-4 border-b border-white/10 text-gray-200">{q.question_text}</td>
                    <td className="py-2 px-4 border-b border-white/10 font-semibold text-gray-200">{q.successRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;