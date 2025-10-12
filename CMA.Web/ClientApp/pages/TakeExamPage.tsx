import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Exam, Question } from '../types.js';
import { MOCK_EXAMS } from './ExamsPage.js';
import { questionsBank } from '../data/questions.js';

const TakeExamPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const foundExam = MOCK_EXAMS.find((e: Exam) => e.id === examId);
        if (foundExam) {
            setExam(foundExam);
            const examQuestions = questionsBank.filter((q: Question) => q.exam_id === examId);
            setQuestions(examQuestions);
        }
    }, [examId]);

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (window.confirm('Are you sure you want to submit your answers?')) {
            // Here you would typically save the attempt to a backend or state management
            console.log('Submitting answers:', answers);
            navigate('/results'); // Redirect to results page after submission
        }
    };

    if (!exam) {
        return <div className="text-center p-8 text-white">Exam not found.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">{exam.title}</h1>
            <p className="text-gray-300 mb-6">{exam.description}</p>

            {currentQuestion ? (
                <div className="bg-glass p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                    <p className="text-white mb-6">{currentQuestion.question_text}</p>
                    
                    <div className="space-y-4">
                        {currentQuestion.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                            <label key={key} className="flex items-center p-4 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">
                                <input
                                    type="radio"
                                    name={currentQuestion.id}
                                    value={key}
                                    checked={answers[currentQuestion.id] === key}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, key)}
                                    className="form-radio h-5 w-5 text-primary"
                                />
                                <span className="ml-4 text-white">{String(value)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 text-white">No questions found for this exam.</div>
            )}

            <div className="mt-6 flex justify-between items-center">
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50">
                    Previous
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg">
                        Submit
                    </button>
                ) : (
                    <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeExamPage;
