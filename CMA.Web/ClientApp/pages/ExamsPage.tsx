import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Exam } from '../types.js';
import Modal from '../components/Modal.js';
import { generateExamDetails } from '../services/geminiService.js';
import { useUser } from '../contexts/UserContext.js';
import logService from '../services/logService.js';
import { syllabusData } from '../data/curriculum.js';

export const MOCK_EXAMS: Exam[] = [
    { id: 'ex1', unitId: 'unit1', title: 'Calculus I Final', description: 'Final exam for first semester calculus.', duration_minutes: 120, total_marks: 100, status: 'published' },
    { id: 'ex2', unitId: 'unit2', title: 'Modern Physics Midterm', description: 'Midterm covering relativity and quantum mechanics.', duration_minutes: 90, total_marks: 50, status: 'published' },
    { id: 'ex3', unitId: 'unit1', title: 'Organic Chemistry Quiz', description: 'Quiz on nomenclature.', duration_minutes: 30, total_marks: 20, status: 'archived' },
    { id: 'ex4', unitId: 'unit3', title: 'World History I', description: 'Comprehensive exam on ancient civilizations.', duration_minutes: 150, total_marks: 100, status: 'draft' },
];


const StatusChip: React.FC<{ status: Exam['status'] }> = ({ status }) => {
    const statusStyles = {
        published: 'bg-green-500/80 border-green-400',
        draft: 'bg-yellow-500/80 border-yellow-400',
        archived: 'bg-gray-600/80 border-gray-500',
    };
    return <span className={`px-3 py-1 text-xs font-bold rounded-full text-white border ${statusStyles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const ActionMenu: React.FC<{ exam: Exam; onEdit: () => void; onDelete: () => void; isModerator: boolean }> = ({ exam, onEdit, onDelete, isModerator }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex justify-center w-full rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none">
                Actions
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {exam.status === 'published' && (
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/exam/${exam.id}`); setIsOpen(false); }} className="block px-4 py-2 text-sm text-green-400 hover:bg-gray-700">
                                Take Exam
                            </a>
                        )}
                        <a href="#" onClick={(e) => { e.preventDefault(); onEdit(); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Edit</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onDelete(); setIsOpen(false); }} className={`block px-4 py-2 text-sm ${isModerator ? 'text-gray-500' : 'text-red-400 hover:bg-gray-700'}`} title={isModerator ? "You don't have permission" : "Delete exam"}>
                            Delete
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

const ExamsPage: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [unitFilter, setUnitFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<Exam['status'] | ''>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { currentUser } = useUser();
    const isModerator = currentUser.role === 'Moderator';

    const filteredExams = useMemo(() => {
        return exams.filter(exam => 
            (unitFilter ? exam.unitId === unitFilter : true) &&
            (statusFilter ? exam.status === statusFilter : true) &&
            (searchTerm ? exam.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        );
    }, [exams, unitFilter, statusFilter, searchTerm]);

    useEffect(() => {
        setTimeout(() => {
            setExams(MOCK_EXAMS);
            setLoading(false);
        }, 500);
    }, []);

    const handleOpenModal = (exam: Exam | null = null) => {
        setEditingExam(exam);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExam(null);
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveExam = (examData: Omit<Exam, 'id'>) => {
        if (editingExam) {
            setExams(exams.map(e => e.id === editingExam.id ? { ...e, ...examData } : e));
            logService.addLog(currentUser, 'UPDATE_EXAM', `Updated exam: ${examData.title} (ID: ${editingExam.id})`);
            showNotification('Exam updated successfully!', 'success');
        } else {
            const newExam: Exam = { ...examData, id: String(Date.now()) };
            setExams([newExam, ...exams]);
            logService.addLog(currentUser, 'CREATE_EXAM', `Created new exam: ${examData.title}`);
            showNotification('Exam created successfully!', 'success');
        }
        handleCloseModal();
    };

    const handleDeleteExam = (id: string) => {
        const examToDelete = exams.find(e => e.id === id);
        if (examToDelete && window.confirm('Are you sure you want to delete this exam? This will also delete all associated questions.')) {
            setExams(exams.filter(e => e.id !== id));
            logService.addLog(currentUser, 'DELETE_EXAM', `Deleted exam: ${examToDelete.title} (ID: ${id})`);
            showNotification('Exam deleted successfully.', 'success');
        }
    };

    const exportToCsv = () => {
        const headers = ['ID', 'Title', 'Description', 'Duration (Mins)', 'Total Marks', 'Status'];
        const rows = filteredExams.map(exam => [exam.id, exam.title, `"${exam.description}"`, exam.duration_minutes, exam.total_marks, exam.status]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'exams_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-white text-shadow">Loading exams...</div>;

    return (
        <div>
            {notification && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.message}
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white text-shadow">Manage Exams</h1>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg disabled:bg-gray-500/50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={isModerator}
                    title={isModerator ? "You don't have permission to add exams" : "Add a new exam"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add Exam
                </button>
            </div>

            <div className="mb-4 bg-glass backdrop-blur-lg border border-white/20 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                <input 
                    type="text"
                    placeholder="Search by exam title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-grow bg-white/10 border border-white/30 text-white rounded-lg p-2 focus:ring-primary focus:border-primary"
                    aria-label="Search by exam title"
                />
                <select 
                    value={unitFilter} 
                    onChange={e => setUnitFilter(e.target.value)}
                    className="bg-white/10 border border-white/30 text-white rounded-lg p-2 focus:ring-primary focus:border-primary"
                    aria-label="Filter exams by unit"
                >
                    <option value="">All Units</option>
                    {syllabusData.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.title}</option>
                    ))}
                </select>
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value as Exam['status'] | '')}
                    className="bg-white/10 border border-white/30 text-white rounded-lg p-2 focus:ring-primary focus:border-primary"
                    aria-label="Filter exams by status"
                >
                    <option value="">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
                <button 
                    onClick={exportToCsv}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark shadow-lg"
                >
                    Export CSV
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-white/10 border-b border-white/20">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Title</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Unit</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Duration</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Marks</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Status</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExams.map(exam => (
                            <tr key={exam.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                                <td className="px-5 py-4 text-sm bg-transparent font-medium text-white" title={exam.description}>
                                    {exam.title}
                                </td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-300">
                                    {syllabusData.find(u => u.id === exam.unitId)?.title || 'N/A'}
                                </td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{exam.duration_minutes}</td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{exam.total_marks}</td>
                                <td className="px-5 py-4 text-sm bg-transparent"><StatusChip status={exam.status} /></td>
                                <td className="px-5 py-4 text-sm bg-transparent">
                                    <ActionMenu 
                                        exam={exam}
                                        onEdit={() => handleOpenModal(exam)} 
                                        onDelete={() => handleDeleteExam(exam.id)}
                                        isModerator={isModerator}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                {filteredExams.map(exam => (
                    <div key={exam.id} className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-lg mb-2" title={exam.description}>{exam.title}</h3>
                                <StatusChip status={exam.status} />
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-4">{exam.description}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <div className="text-xs text-gray-400">
                                {exam.duration_minutes} mins | {exam.total_marks} marks
                            </div>
                            <ActionMenu 
                                exam={exam}
                                onEdit={() => handleOpenModal(exam)} 
                                onDelete={() => handleDeleteExam(exam.id)}
                                isModerator={isModerator}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && <ExamForm exam={editingExam} onSave={handleSaveExam} onClose={handleCloseModal} />}
        </div>
    );
};

interface ExamFormProps {
    exam: Exam | null;
    onSave: (examData: Omit<Exam, 'id'>) => void;
    onClose: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ exam, onSave, onClose }) => {
    const { currentUser } = useUser();
    const isModerator = currentUser.role === 'Moderator';
    
    const [formData, setFormData] = useState({
        title: exam?.title || '',
        description: exam?.description || '',
        duration_minutes: exam?.duration_minutes || 60,
        total_marks: exam?.total_marks || 100,
        status: exam?.status || 'draft',
    });
    
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = (name === 'duration_minutes' || name === 'total_marks') ? parseInt(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: numValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Exam, 'id'>);
    };

    const handleAiGenerate = async () => {
        if (!aiTopic) {
            setAiError('Please enter a topic to generate details.');
            return;
        }
        setIsGenerating(true);
        setAiError('');
        try {
            const details = await generateExamDetails(aiTopic);
            if (details) {
                setFormData(prev => ({
                    ...prev,
                    title: details.title,
                    description: details.description,
                    duration_minutes: details.duration_minutes,
                    total_marks: details.total_marks
                }));
                logService.addLog(currentUser, 'AI_GENERATE_EXAM', `Generated exam details for topic: "${aiTopic}"`);
            }
        } catch (error: any) {
            // Provide a more helpful error message
            if (error.message.includes("API_KEY environment variable not set")) {
                setAiError("AI features are not configured. Please contact your administrator to set up the API key.");
            } else {
                setAiError(error.message || 'An unknown error occurred.');
            }
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={exam ? 'Edit Exam' : 'Add Exam'}>
            <form onSubmit={handleSubmit}>
                <div className={`p-4 mb-4 border border-dashed border-white/30 rounded-lg bg-white/10 ${isModerator ? 'opacity-50' : ''}`}>
                    <h4 className="text-lg font-semibold text-white text-shadow mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        Generate with AI
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">Enter a topic and let AI suggest the exam details for you.</p>
                    <fieldset disabled={isModerator}>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            className="flex-grow block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400"
                            placeholder="e.g., 'Financial Statements'"
                            disabled={isGenerating || isModerator}
                        />
                        <button
                            type="button"
                            onClick={handleAiGenerate}
                            disabled={isGenerating || !aiTopic || isModerator}
                            className="w-full sm:w-auto px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-500/50"
                        >
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    </fieldset>
                    {aiError && <p className="text-sm text-red-400 mt-2">{aiError}</p>}
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-200">Title</label>
                        <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-200">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-200">Duration (minutes)</label>
                            <input id="duration_minutes" type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" required />
                        </div>
                        <div>
                            <label htmlFor="total_marks" className="block text-sm font-medium text-gray-200">Total Marks</label>
                            <input id="total_marks" type="number" name="total_marks" value={formData.total_marks} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-200">Status</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white">
                            <option className="text-black" value="draft">Draft</option>
                            <option className="text-black" value="published">Published</option>
                            <option className="text-black" value="archived">Archived</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Cancel</button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-500/50 disabled:cursor-not-allowed"
                        disabled={isModerator && !exam}
                        title={isModerator && !exam ? "You don't have permission to add exams" : "Save exam"}
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ExamsPage;
