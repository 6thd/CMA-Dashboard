import React, { useState, useEffect } from 'react';
import { ExamAttempt } from '../types.js';
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

const ScoreDistributionChart: React.FC<{ data: ExamAttempt[] }> = ({ data }) => {
    const scoreBuckets = [
        { name: '0-20%', count: 0 },
        { name: '21-40%', count: 0 },
        { name: '41-60%', count: 0 },
        { name: '61-80%', count: 0 },
        { name: '81-100%', count: 0 },
    ];

    data.forEach(attempt => {
        if (attempt.percentage <= 20) scoreBuckets[0].count++;
        else if (attempt.percentage <= 40) scoreBuckets[1].count++;
        else if (attempt.percentage <= 60) scoreBuckets[2].count++;
        else if (attempt.percentage <= 80) scoreBuckets[3].count++;
        else scoreBuckets[4].count++;
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#fff' }} className="text-shadow" />
                <YAxis allowDecimals={false} tick={{ fill: '#fff' }} className="text-shadow" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                    }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="count" fill="rgba(66, 133, 244, 0.9)" name="Number of Students" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const ResultsPage: React.FC = () => {
    const [allAttempts, setAllAttempts] = useState<ExamAttempt[]>([]);
    const [filteredAttempts, setFilteredAttempts] = useState<ExamAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ 
        start: '', 
        end: '' 
    });
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            setAllAttempts(MOCK_ATTEMPTS);
            setFilteredAttempts(MOCK_ATTEMPTS);
            setLoading(false);
        }, 500);
    }, []);

    // Apply filters whenever filter criteria change
    useEffect(() => {
        let result = [...allAttempts];
        
        // Date filtering
        if (dateRange.start && dateRange.end) {
            result = result.filter(attempt => {
                const attemptDate = new Date(attempt.submitted_at);
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                return attemptDate >= startDate && attemptDate <= endDate;
            });
        }
        
        // Exam filtering
        if (selectedExam) {
            result = result.filter(attempt => attempt.exam_id === selectedExam);
        }
        
        // Search term filtering
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(attempt => 
                attempt.student_name.toLowerCase().includes(term) ||
                attempt.exam_title.toLowerCase().includes(term)
            );
        }
        
        setFilteredAttempts(result);
    }, [allAttempts, dateRange, selectedExam, searchTerm]);

    const handleExport = () => {
        exportToCsv(filteredAttempts, 'exam_attempts.csv');
    };
    
    // Reset filters
    const resetFilters = () => {
        setDateRange({ start: '', end: '' });
        setSelectedExam('');
        setSearchTerm('');
    };

    if (loading) return <div className="text-white text-shadow">Loading results...</div>;

    // Get unique exams for filter dropdown
    const uniqueExams = Array.from(
        new Map(allAttempts.map(attempt => [attempt.exam_id, { id: attempt.exam_id, title: attempt.exam_title }]))
        .values()
    );

    return (
        <div className="fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white text-shadow">Results</h1>
                <button onClick={handleExport} className="btn btn-secondary px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Export Results
                </button>
            </div>
            
            {/* Filter Section */}
            <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-white text-shadow">Filters</h2>
                    <button 
                        onClick={resetFilters}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                        Reset Filters
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">End Date</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Exam</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
                        >
                            <option value="" className="text-black">All Exams</option>
                            {uniqueExams.map(exam => (
                                <option key={exam.id} value={exam.id} className="text-black">{exam.title}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Student or exam name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400"
                        />
                    </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-300">
                    Showing {filteredAttempts.length} of {allAttempts.length} results
                </div>
            </div>

            <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-xl font-bold text-white text-shadow mb-4">Overall Score Distribution</h2>
                <ScoreDistributionChart data={filteredAttempts} />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-white/10 border-b border-white/20">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Student</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Exam</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Submitted On</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Score</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttempts.length > 0 ? (
                            filteredAttempts.map(attempt => (
                                <tr key={attempt.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                                    <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{attempt.student_name}</td>
                                    <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{attempt.exam_title}</td>
                                    <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{new Date(attempt.submitted_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 text-sm bg-transparent font-semibold text-gray-100">{attempt.score}/{attempt.total_marks}</td>
                                    <td className="px-5 py-4 text-sm bg-transparent">
                                        <span className={`font-bold text-shadow ${attempt.percentage >= 80 ? 'text-green-300' : attempt.percentage >= 60 ? 'text-yellow-300' : 'text-red-400'}`}>
                                            {attempt.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-4 text-center text-gray-400">
                                    No results found matching the selected filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredAttempts.length > 0 ? (
                    filteredAttempts.map(attempt => (
                        <div key={attempt.id} className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-start">
                            <div>
                                    <div className="font-bold text-white text-lg">{attempt.student_name}</div>
                                    <div className="text-sm text-gray-200">{attempt.exam_title}</div>
                            </div>
                                <div className={`font-bold text-xl text-shadow ${attempt.percentage >= 80 ? 'text-green-300' : attempt.percentage >= 60 ? 'text-yellow-300' : 'text-red-400'}`}>
                                    {attempt.percentage}%
                                </div>
                            </div>
                            <div className="text-xs text-gray-300 pt-2 border-t border-white/10">
                                Submitted on {new Date(attempt.submitted_at).toLocaleDateString()} &middot; Score: {attempt.score}/{attempt.total_marks}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        No results found matching the selected filters
                    </div>
                )}
            </div>

        </div>
    );
};

export default ResultsPage;