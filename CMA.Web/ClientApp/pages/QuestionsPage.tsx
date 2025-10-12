import React, { useState, useEffect, useMemo } from 'react';
import { Exam, Question, QuestionType } from '../types.js';
import { generateQuestions } from '../services/geminiService.js';
import Modal from '../components/Modal.js';
import { useUser } from '../contexts/UserContext.js';
import logService from '../services/logService.js';
import { questionsBank } from '../data/questions.js';
import AIAssistant from '../components/AIAssistant.js';
import { syllabusData } from '../data/curriculum.js';

const MOCK_EXAMS: Exam[] = [
    { id: 'ex1', unitId: 'unit1', title: 'External Financial Statements', description: '', duration_minutes: 120, total_marks: 100, status: 'published' },
    { id: 'ex2', unitId: 'unit2', title: 'Planning, Budgeting, and Forecasting', description: '', duration_minutes: 120, total_marks: 100, status: 'published' },
    { id: 'ex3', unitId: 'unit3', title: 'Performance Management', description: '', duration_minutes: 90, total_marks: 75, status: 'published' },
    { id: 'ex4', unitId: 'unit4', title: 'Cost Management', description: '', duration_minutes: 90, total_marks: 75, status: 'published' },
    { id: 'ex5', unitId: 'unit5', title: 'Internal Controls', description: '', duration_minutes: 60, total_marks: 50, status: 'published' },
    { id: 'ex6', unitId: 'unit6', title: 'Technology and Analytics', description: '', duration_minutes: 60, total_marks: 50, status: 'published' },
];

const ALL_TYPES: QuestionType[] = ['multiple_choice', 'true_false', 'short_answer'];
const ALL_DIFFICULTIES: Question['difficulty'][] = ['easy', 'medium', 'hard'];


const QuestionsPage: React.FC = () => {
    const [exams] = useState<Exam[]>(MOCK_EXAMS);
    const [questions, setQuestions] = useState<Question[]>(questionsBank);
    const [selectedUnitId, setSelectedUnitId] = useState<string>('');
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    
    // AI Modal State
    const [aiTopic, setAiTopic] = useState('');
    const [aiCount, setAiCount] = useState(5);
    const [aiDifficulty, setAiDifficulty] = useState('medium');
    const [aiError, setAiError] = useState('');
    
    // Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const { currentUser } = useUser();
    const isModerator = currentUser.role === 'Moderator';

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const sectionMatch = selectedSectionId ? q.sectionId === selectedSectionId : (selectedUnitId ? syllabusData.find(u => u.id === selectedUnitId)?.sections.some(s => s.id === q.sectionId) : true);
            const searchMatch = searchTerm ? q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            const difficultyMatch = difficultyFilter ? q.difficulty === difficultyFilter : true;
            const typeMatch = typeFilter ? q.question_type === typeFilter : true;
            return sectionMatch && searchMatch && difficultyMatch && typeMatch;
        });
    }, [questions, selectedUnitId, selectedSectionId, searchTerm, difficultyFilter, typeFilter]);

    const handleOpenAiAssistant = () => {
        setIsAiModalOpen(true);
    };

    const handleGenerateQuestions = async () => {
        if (!aiTopic || !selectedSectionId) return;
        setIsLoading(true);
        setAiError('');
        try {
            const newQuestions = await generateQuestions(aiTopic, aiCount, aiDifficulty);
            const formattedQuestions = newQuestions.map((q: any) => ({
                ...q,
                id: `ai-${Date.now()}-${Math.random()}`,
                exam_id: 'ex_cma', // Generic exam id for CMA
                sectionId: selectedSectionId,
                question_type: 'multiple_choice',
            }));
            setQuestions(prev => [...prev, ...formattedQuestions]);
            const section = syllabusData.flatMap(u => u.sections).find(s => s.id === selectedSectionId);
            logService.addLog(currentUser, 'AI_GENERATE_QUESTIONS', `Generated ${aiCount} questions for topic "${aiTopic}" in section "${section?.title}"`);
            setIsAiModalOpen(false);
            setAiTopic('');
        } catch (error: any) {
            // Provide a more helpful error message
            if (error.message.includes("API_KEY environment variable not set")) {
                setAiError("AI features are not configured. Please contact your administrator to set up the API key.");
            } else {
                setAiError(error.message || 'An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnitChange = (unitId: string) => {
        setSelectedUnitId(unitId);
        setSelectedSectionId(''); // Reset section when unit changes
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white text-shadow">Question Bank</h1>
                <button
                    onClick={() => setIsAiModalOpen(true)}
                    disabled={!selectedSectionId || isModerator}
                    className="w-full md:w-auto px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:bg-gray-500/50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                    title={isModerator ? "You don't have permission to generate questions" : (!selectedSectionId ? "Please select a unit and section first" : "Generate questions with AI")}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    Generate with AI
                </button>
            </div>

            <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" aria-label="Search questions"/>
                    <select value={selectedUnitId} onChange={e => handleUnitChange(e.target.value)} className="w-full pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white" aria-label="Filter by Unit">
                        <option value="" className="text-black">All Units</option>
                        {syllabusData.map(unit => (<option key={unit.id} value={unit.id} className="text-black">{unit.title}</option>))}
                    </select>
                    <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} disabled={!selectedUnitId} className="w-full pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white disabled:bg-gray-500/20" aria-label="Filter by Section">
                        <option value="" className="text-black">All Sections</option>
                        {selectedUnitId && syllabusData.find(u => u.id === selectedUnitId)?.sections.map(section => (<option key={section.id} value={section.id} className="text-black">{section.title}</option>))}
                    </select>
                    <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} className="w-full pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white" aria-label="Filter by difficulty"><option value="" className="text-black">All Difficulties</option>{ALL_DIFFICULTIES.map(d => (<option key={d} value={d} className="text-black capitalize">{d}</option>))}</select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map(q => (
                        <div key={q.id} className="bg-glass backdrop-blur-lg border border-white/20 p-4 rounded-lg shadow-lg">
                            <p className="font-semibold text-white text-shadow">{q.question_text}</p>
                            {q.options && (
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-200">
                                    {Object.entries(q.options).map(([key, value]) => (
                                        <p key={key} className={key === q.correct_answer ? 'text-green-300 font-bold' : ''}>
                                            {key}: {value}
                                        </p>
                                    ))}
                                </div>
                            )}
                             <div className="flex items-center justify-end gap-4 text-xs mt-2 text-gray-400">
                                <span className="capitalize">{q.difficulty}</span>
                                <span>|</span>
                                <span className="capitalize">{q.question_type.replace('_', ' ')}</span>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                        <p className="text-white text-shadow">No questions match your filters.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="Generate Questions with AI">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Section to add to</label>
                        <input 
                            type="text" 
                            value={syllabusData.flatMap(u => u.sections).find(s => s.id === selectedSectionId)?.title || ''} 
                            readOnly 
                            disabled 
                            className="mt-1 block w-full px-3 py-2 bg-black/20 border border-white/30 rounded-md text-gray-300"
                            aria-label="Selected section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Topic</label>
                        <input 
                            type="text" 
                            value={aiTopic} 
                            onChange={(e) => setAiTopic(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400" 
                            placeholder="e.g., Cost of Capital" 
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200">Number of Questions</label>
                            <input 
                                type="number" 
                                value={aiCount} 
                                onChange={(e) => setAiCount(Number(e.target.value))} 
                                min="1" 
                                max="10" 
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white" 
                                aria-label="Number of questions"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-200">Difficulty</label>
                            <select 
                                value={aiDifficulty} 
                                onChange={(e) => setAiDifficulty(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-white"
                                aria-label="Difficulty"
                            >
                                <option className="text-black" value="easy">Easy</option>
                                <option className="text-black" value="medium">Medium</option>
                                <option className="text-black" value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    {aiError && <p className="text-sm text-red-400">{aiError}</p>}
                    <div className="flex justify-end pt-2 space-x-3">
                        <button type="button" onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Cancel</button>
                        <button onClick={handleGenerateQuestions} disabled={isLoading || !aiTopic} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-500/50">
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </Modal>
            
            <AIAssistant 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                context={`Generating questions for section: ${syllabusData.flatMap(u => u.sections).find(s => s.id === selectedSectionId)?.title || 'General'}`}
            />
        </div>
    );
};

export default QuestionsPage;