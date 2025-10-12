import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../types.js';
import { questionsBank } from '../data/questions.js';
import { syllabusData } from '../data/curriculum.js';
import { AIExamService } from '../services/aiExamService.js';

interface ExamSettings {
  questionCount: number;
  timeLimit: number; // in minutes
  displayOrder: 'book' | 'selection' | 'random';
  selectedSections: string[];
  adaptiveMode: boolean; // AI-powered adaptive exam
  studentId: string; // For personalized recommendations
}

interface ExamQuestion extends Question {
  marked: boolean;
  userAnswer: string | null;
  timeSpent: number; // in seconds
  notes: string;
}

const ExamSimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'aiAnalysis' | 'exam' | 'results'>('setup');
  const [settings, setSettings] = useState<ExamSettings>({
    questionCount: 50,
    timeLimit: 180,
    displayOrder: 'random',
    selectedSections: [],
    adaptiveMode: false,
    studentId: 'stud001' // Default student for demo
  });
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Timer effect
  useEffect(() => {
    if (step === 'exam' && !isTimerPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, isTimerPaused, timeRemaining]);

  // Handle time expiration
  useEffect(() => {
    if (timeRemaining === 0 && step === 'exam') {
      // Time's up, but user can continue
    }
  }, [timeRemaining, step]);

  const handleAiAnalysis = () => {
    // Perform AI analysis
    const analysis = AIExamService.analyzePerformance(settings.studentId);
    const plan = AIExamService.generateStudyPlan(settings.studentId);
    
    setAiAnalysis(analysis);
    setStudyPlan(plan);
    setStep('aiAnalysis');
  };

  const handleStartExam = () => {
    let examQuestions: Question[] = [];
    
    if (settings.adaptiveMode) {
      // Generate AI-adaptive exam
      examQuestions = AIExamService.generateAdaptiveExam(settings.studentId, settings.questionCount);
    } else {
      // Filter questions by selected sections
      let filteredQuestions: Question[] = [];
      
      if (settings.selectedSections.length === 0) {
        // If no sections selected, use all questions
        filteredQuestions = [...questionsBank];
      } else {
        filteredQuestions = questionsBank.filter(q => 
          q.sectionId && settings.selectedSections.includes(q.sectionId)
        );
      }

      // Apply display order
      let orderedQuestions: Question[] = [];
      switch (settings.displayOrder) {
        case 'book':
          // Sort by section and then by question ID
          orderedQuestions = [...filteredQuestions].sort((a, b) => {
            if (a.sectionId && b.sectionId) {
              if (a.sectionId !== b.sectionId) {
                return a.sectionId.localeCompare(b.sectionId);
              }
            }
            return a.id.localeCompare(b.id);
          });
          break;
        case 'selection':
          // Keep the order as selected
          orderedQuestions = filteredQuestions;
          break;
        case 'random':
          // Shuffle questions
          orderedQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
          break;
      }

      // Limit to question count
      examQuestions = orderedQuestions.slice(0, settings.questionCount);
    }

    // Convert to ExamQuestion format
    const examQuestionsWithState: ExamQuestion[] = examQuestions.map(q => ({
      ...q,
      marked: false,
      userAnswer: null,
      timeSpent: 0,
      notes: ''
    }));

    setQuestions(examQuestionsWithState);
    setTimeRemaining(settings.timeLimit * 60);
    setStartTime(Date.now());
    setStep('exam');
    setCurrentQuestionIndex(0);
    questionStartTimeRef.current = Date.now();
  };

  const handleAnswerSelect = (answer: string) => {
    const updatedQuestions = [...questions];
    const currentTime = Date.now();
    const timeSpentOnQuestion = Math.floor((currentTime - questionStartTimeRef.current) / 1000);
    
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      userAnswer: answer,
      timeSpent: updatedQuestions[currentQuestionIndex].timeSpent + timeSpentOnQuestion
    };
    
    setQuestions(updatedQuestions);
    questionStartTimeRef.current = currentTime;
  };

  const handleMarkQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      marked: !updatedQuestions[currentQuestionIndex].marked
    };
    setQuestions(updatedQuestions);
  };

  const handleSaveNotes = (notes: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      notes
    };
    setQuestions(updatedQuestions);
  };

  const handleNextQuestion = () => {
    const currentTime = Date.now();
    const timeSpentOnQuestion = Math.floor((currentTime - questionStartTimeRef.current) / 1000);
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      timeSpent: updatedQuestions[currentQuestionIndex].timeSpent + timeSpentOnQuestion
    };
    
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
    questionStartTimeRef.current = currentTime;
  };

  const handlePreviousQuestion = () => {
    const currentTime = Date.now();
    const timeSpentOnQuestion = Math.floor((currentTime - questionStartTimeRef.current) / 1000);
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      timeSpent: updatedQuestions[currentQuestionIndex].timeSpent + timeSpentOnQuestion
    };
    
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
    questionStartTimeRef.current = currentTime;
  };

  const handleQuestionNavigation = (index: number) => {
    const currentTime = Date.now();
    const timeSpentOnQuestion = Math.floor((currentTime - questionStartTimeRef.current) / 1000);
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      timeSpent: updatedQuestions[currentQuestionIndex].timeSpent + timeSpentOnQuestion
    };
    
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(index);
    questionStartTimeRef.current = currentTime;
  };

  const handleFinishExam = () => {
    // Save final time for current question
    const currentTime = Date.now();
    const timeSpentOnQuestion = Math.floor((currentTime - questionStartTimeRef.current) / 1000);
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      timeSpent: updatedQuestions[currentQuestionIndex].timeSpent + timeSpentOnQuestion
    };
    
    setQuestions(updatedQuestions);
    setStep('results');
  };

  const handlePauseTimer = () => {
    setIsTimerPaused(!isTimerPaused);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSectionSelection = (sectionId: string) => {
    setSettings(prev => {
      const newSections = prev.selectedSections.includes(sectionId)
        ? prev.selectedSections.filter(id => id !== sectionId)
        : [...prev.selectedSections, sectionId];
      
      return {
        ...prev,
        selectedSections: newSections
      };
    });
  };

  const selectAllSections = () => {
    const allSectionIds = syllabusData.flatMap(unit => unit.sections.map(section => section.id));
    setSettings(prev => ({
      ...prev,
      selectedSections: allSectionIds
    }));
  };

  const clearSectionSelection = () => {
    setSettings(prev => ({
      ...prev,
      selectedSections: []
    }));
  };

  if (step === 'setup') {
    return (
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-white text-shadow mb-6">CMA Part 1 Exam Simulation</h1>
        
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white text-shadow mb-4">Exam Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Number of Questions: {settings.questionCount}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.questionCount}
                onChange={(e) => setSettings({...settings, questionCount: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10</span>
                <span>100</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Time Limit: {settings.timeLimit} minutes
              </label>
              <input
                type="range"
                min="1"
                max="360"
                value={settings.timeLimit}
                onChange={(e) => setSettings({...settings, timeLimit: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 min</span>
                <span>360 min</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">Display Order</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSettings({...settings, displayOrder: 'book'})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.displayOrder === 'book'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                Book Order
              </button>
              <button
                onClick={() => setSettings({...settings, displayOrder: 'selection'})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.displayOrder === 'selection'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                Selection Order
              </button>
              <button
                onClick={() => setSettings({...settings, displayOrder: 'random'})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.displayOrder === 'random'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                Random
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">Exam Mode</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="adaptiveMode"
                checked={settings.adaptiveMode}
                onChange={(e) => setSettings({...settings, adaptiveMode: e.target.checked})}
                className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
              />
              <label htmlFor="adaptiveMode" className="ml-2 text-gray-200">
                AI-Powered Adaptive Exam (Personalized based on your performance)
              </label>
            </div>
          </div>
          
          {!settings.adaptiveMode && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-200">Select Sections</label>
                <div className="space-x-2">
                  <button
                    onClick={selectAllSections}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSectionSelection}
                    className="text-xs text-gray-400 hover:text-gray-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto border border-white/20 rounded-lg p-3 bg-black/20">
                {syllabusData.map(unit => (
                  <div key={unit.id} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-white text-sm mb-2">{unit.title}</h3>
                    <div className="space-y-2 ml-2">
                      {unit.sections.map(section => (
                        <div key={section.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`section-${section.id}`}
                            checked={settings.selectedSections.includes(section.id)}
                            onChange={() => toggleSectionSelection(section.id)}
                            className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                          />
                          <label
                            htmlFor={`section-${section.id}`}
                            className="ml-2 text-sm text-gray-200"
                          >
                            {section.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={handleAiAnalysis}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark font-semibold"
            >
              AI Performance Analysis
            </button>
            <button
              onClick={handleStartExam}
              disabled={!settings.adaptiveMode && settings.selectedSections.length === 0}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'aiAnalysis' && aiAnalysis) {
    return (
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-white text-shadow mb-6">AI Performance Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white text-shadow mb-4">Performance Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-white">{aiAnalysis.overallPerformance.toFixed(1)}%</div>
                <div className="text-gray-300">Overall Score</div>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-400">{aiAnalysis.weakAreas.length}</div>
                <div className="text-gray-300">Weak Areas</div>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-400">{aiAnalysis.strongAreas.length}</div>
                <div className="text-gray-300">Strong Areas</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-red-400 mb-3">Areas Needing Improvement</h3>
                {aiAnalysis.weakAreas.length > 0 ? (
                  <div className="space-y-3">
                    {aiAnalysis.weakAreas.map((area: any, index: number) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                        <div className="flex justify-between">
                          <span className="text-white font-medium">{area.title}</span>
                          <span className="text-red-400">{(area.performance * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No weak areas identified</div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-green-400 mb-3">Strong Areas</h3>
                {aiAnalysis.strongAreas.length > 0 ? (
                  <div className="space-y-3">
                    {aiAnalysis.strongAreas.map((area: any, index: number) => (
                      <div key={index} className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                        <div className="flex justify-between">
                          <span className="text-white font-medium">{area.title}</span>
                          <span className="text-green-400">{(area.performance * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No strong areas identified yet</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white text-shadow mb-4">AI Recommendations</h2>
            <div className="space-y-3">
              {aiAnalysis.recommendations.map((rec: string, index: number) => (
                <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                  {rec}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setStep('setup')}
              className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Back to Exam Setup
            </button>
          </div>
        </div>
        
        {studyPlan && (
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white text-shadow mb-4">Personalized Study Plan</h2>
            
            <div className="mb-4">
              <p className="text-gray-300">{studyPlan.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <span>{studyPlan.weeks} weeks</span>
                <span className="mx-2">•</span>
                <span>{studyPlan.dailyHours} hours/day</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-red-400 mb-3">Focus Areas</h3>
                {studyPlan.focusAreas.map((area: any, index: number) => (
                  <div key={index} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                    <div className="font-medium text-white">{area.title}</div>
                    <div className="text-sm text-gray-300 mt-1">Priority: {area.priority}</div>
                    <div className="text-sm text-gray-300">Recommended: {area.recommendedHours} hours</div>
                    <div className="mt-2">
                      {area.topics.map((topic: string, topicIndex: number) => (
                        <span key={topicIndex} className="inline-block bg-white/10 text-xs px-2 py-1 rounded mr-2 mb-1">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="font-medium text-green-400 mb-3">Review Areas</h3>
                {studyPlan.reviewAreas.map((area: any, index: number) => (
                  <div key={index} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-3">
                    <div className="font-medium text-white">{area.title}</div>
                    <div className="text-sm text-gray-300 mt-1">Priority: {area.priority}</div>
                    <div className="text-sm text-gray-300">Recommended: {area.recommendedHours} hours</div>
                    <div className="mt-2">
                      {area.topics.map((topic: string, topicIndex: number) => (
                        <span key={topicIndex} className="inline-block bg-white/10 text-xs px-2 py-1 rounded mr-2 mb-1">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'exam' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="flex flex-col h-full">
        {/* Exam Header */}
        <div className="bg-glass backdrop-blur-lg border-b border-white/20 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePauseTimer}
              className="flex items-center text-gray-200 hover:text-white"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isTimerPaused ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{isTimerPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <div className="text-lg font-mono">
              <span className={timeRemaining < 300 ? 'text-red-400' : 'text-white'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <button
              onClick={handleMarkQuestion}
              className={`px-3 py-1 rounded text-sm ${
                currentQuestion.marked
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {currentQuestion.marked ? 'Marked' : 'Mark'}
            </button>
            
            <button
              onClick={handleFinishExam}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              Finish Test
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 mb-6">
              <div className="text-gray-300 mb-4">
                Section: {currentQuestion.sectionId || 'N/A'}
              </div>
              
              <h2 className="text-xl font-semibold text-white text-shadow mb-6">
                {currentQuestion.question_text}
              </h2>
              
              {currentQuestion.options && (
                <div className="space-y-3 mb-6">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        currentQuestion.userAnswer === key
                          ? 'border-primary bg-primary/20'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                          <span className="font-medium text-white">{key}</span>
                        </div>
                        <span className="text-gray-200">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ❮ Back
                </button>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next ❯
                </button>
              </div>
            </div>
            
            {/* Notes Section */}
            <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold text-white text-shadow mb-3">Notes</h3>
              <textarea
                value={currentQuestion.notes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Add your notes for this question..."
                className="w-full h-32 px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          {/* Question Navigation Sidebar */}
          <div className="w-64 border-l border-white/20 bg-black/20 p-4 overflow-y-auto">
            <h3 className="font-semibold text-white text-shadow mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-white'
                      : q.userAnswer
                      ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                      : q.marked
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500/20 border border-green-400/50 rounded mr-2"></div>
                <span className="text-gray-300">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-400/50 rounded mr-2"></div>
                <span className="text-gray-300">Marked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white/10 rounded mr-2"></div>
                <span className="text-gray-300">Not answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const answeredQuestions = questions.filter(q => q.userAnswer !== null);
    const correctAnswers = answeredQuestions.filter(q => q.userAnswer === q.correct_answer);
    const incorrectAnswers = answeredQuestions.filter(q => q.userAnswer !== q.correct_answer);
    const markedQuestions = questions.filter(q => q.marked);
    
    const totalTimeSpent = questions.reduce((sum, q) => sum + q.timeSpent, 0);
    const averageTimePerQuestion = answeredQuestions.length > 0 
      ? Math.round(totalTimeSpent / answeredQuestions.length) 
      : 0;
    
    const percentage = answeredQuestions.length > 0 
      ? Math.round((correctAnswers.length / answeredQuestions.length) * 100) 
      : 0;

    return (
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-white text-shadow mb-6">Exam Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{percentage}%</div>
            <div className="text-gray-300">Score</div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{correctAnswers.length}</div>
            <div className="text-gray-300">Correct</div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400">{incorrectAnswers.length}</div>
            <div className="text-gray-300">Incorrect</div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{markedQuestions.length}</div>
            <div className="text-gray-300">Marked</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white text-shadow mb-3">Time Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Time:</span>
                <span className="text-white">{formatTime(totalTimeSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Average Time/Question:</span>
                <span className="text-white">{formatTime(averageTimePerQuestion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Questions Answered:</span>
                <span className="text-white">{answeredQuestions.length}/{questions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white text-shadow mb-3">Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Correct Answers:</span>
                <span className="text-green-400">{correctAnswers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Incorrect Answers:</span>
                <span className="text-red-400">{incorrectAnswers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Unanswered:</span>
                <span className="text-gray-400">{questions.length - answeredQuestions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white text-shadow mb-3">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setStep('setup')}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Take Another Exam
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white text-shadow mb-4">Question Review</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-400 mb-2">Correctly Answered ({correctAnswers.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {correctAnswers.map((q, index) => (
                  <div key={index} className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm">
                    Q{questions.indexOf(q) + 1}: {q.question_text.substring(0, 50)}...
                  </div>
                ))}
                {correctAnswers.length === 0 && (
                  <div className="text-gray-400 text-sm">No correctly answered questions</div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-red-400 mb-2">Incorrectly Answered ({incorrectAnswers.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {incorrectAnswers.map((q, index) => (
                  <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm">
                    Q{questions.indexOf(q) + 1}: {q.question_text.substring(0, 50)}...
                  </div>
                ))}
                {incorrectAnswers.length === 0 && (
                  <div className="text-gray-400 text-sm">No incorrectly answered questions</div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Marked Questions ({markedQuestions.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {markedQuestions.map((q, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm">
                    Q{questions.indexOf(q) + 1}: {q.question_text.substring(0, 50)}...
                  </div>
                ))}
                {markedQuestions.length === 0 && (
                  <div className="text-gray-400 text-sm">No marked questions</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white">Loading...</div>
    </div>
  );
};

export default ExamSimulationPage;