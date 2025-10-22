/**
 * Practice Exam Page - Generate and Take Practice Exams from Study Materials
 * صفحة الامتحان التدريبي - توليد وأداء امتحانات تدريبية من المواد الدراسية
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  FileQuestion,
  AlertCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import pdfService from '@/services/pdfExtractionService';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  page: number;
  topic: string;
  userAnswer?: string;
}

export default function PracticeExamPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load questions from localStorage or generate new ones
  useEffect(() => {
    const loadOrGenerateQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to load from localStorage
        const storedQuestions = localStorage.getItem('generated-questions');
        const storedSource = localStorage.getItem('questions-source');

        if (storedQuestions && storedSource) {
          const parsedQuestions = JSON.parse(storedQuestions);
          if (parsedQuestions && parsedQuestions.length > 0) {
            setQuestions(parsedQuestions);
            setLoading(false);
            return;
          }
        }

        // If no stored questions, generate from PDF
        setGenerating(true);

        // Get the PDF URL based on materialId
        const pdfUrl = materialId === '1' ? '/CMA_P1_2025.pdf' : '/CMA_P1_2025.pdf';

        // Extract text from PDF
        const extractedText = await pdfService.extractText(pdfUrl);

        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('لا يوجد نص قابل للاستخراج من المقرر');
        }

        // Extract questions using AI
        const extractedQuestions = await pdfService.extractQuestions(extractedText);

        if (!extractedQuestions || extractedQuestions.length === 0) {
          throw new Error('لم يتم توليد أسئلة من المقرر. حاول مرة أخرى.');
        }

        setQuestions(extractedQuestions);

        // Store for future use
        localStorage.setItem('generated-questions', JSON.stringify(extractedQuestions));
        localStorage.setItem('questions-source', pdfUrl);
      } catch (err) {
        console.error('Error loading/generating questions:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'حدث خطأ أثناء تحميل الأسئلة. تأكد من وجود اتصال بالخادم.'
        );
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    };

    loadOrGenerateQuestions();
  }, [materialId]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStarted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setTimeElapsed(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    setShowResults(true);
    setExamStarted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white text-lg mb-2">
            {generating
              ? t('practiceExam.generatingQuestions') || 'جاري توليد الأسئلة...'
              : t('common.loading') || 'جاري التحميل...'}
          </p>
          {generating && (
            <p className="text-gray-400 text-sm">
              {t('practiceExam.pleaseWait') || 'قد يستغرق هذا عدة ثوانٍ...'}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="text-center bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('practiceExam.error') || 'حدث خطأ'}
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/study-library')} variant="outline">
              <ArrowLeft className="w-4 h-4 ml-2" />
              {t('common.back') || 'العودة'}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {t('common.retry') || 'إعادة المحاولة'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="text-center bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl">
          <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('practiceExam.noQuestions') || 'لا توجد أسئلة متاحة'}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('practiceExam.noQuestionsDesc') ||
              'لم يتم العثور على أسئلة لهذا المقرر. يرجى العودة وإعادة المحاولة.'}
          </p>
          <Button onClick={() => navigate('/study-library')}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            {t('common.back') || 'العودة للمكتبة'}
          </Button>
        </div>
      </div>
    );
  }

  // Start screen
  if (!examStarted && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/study-library')}
            className="mb-6 text-white"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            {t('common.back') || 'العودة'}
          </Button>

          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-8">
              <FileQuestion className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('practiceExam.title') || 'امتحان تدريبي'}
              </h1>
              <p className="text-gray-300">
                {t('practiceExam.subtitle') || 'اختبر معرفتك بالمقرر الدراسي'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-gray-300">
                  {t('practiceExam.totalQuestions') || 'عدد الأسئلة'}
                </span>
                <span className="text-white font-bold text-xl">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <span className="text-gray-300">
                  {t('practiceExam.estimatedTime') || 'الوقت المقدر'}
                </span>
                <span className="text-white font-bold text-xl">
                  {Math.ceil(questions.length * 1.5)} {t('practiceExam.minutes') || 'دقيقة'}
                </span>
              </div>
            </div>

            <Button onClick={handleStartExam} className="w-full" size="lg">
              {t('practiceExam.startExam') || 'بدء الامتحان'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl mb-6">
            <div className="text-center mb-8">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  score.percentage >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}
              >
                {score.percentage >= 70 ? (
                  <CheckCircle className="w-12 h-12 text-green-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {score.percentage >= 70
                  ? t('practiceExam.passed') || 'نجحت!'
                  : t('practiceExam.needsImprovement') || 'يحتاج إلى تحسين'}
              </h1>
              <p className="text-gray-300">
                {t('practiceExam.completedIn') || 'أكملت الامتحان في'} {formatTime(timeElapsed)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">{score.percentage}%</div>
                <div className="text-gray-300 text-sm">{t('practiceExam.score') || 'النتيجة'}</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-1">{score.correct}</div>
                <div className="text-gray-300 text-sm">{t('practiceExam.correct') || 'صحيحة'}</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {score.total - score.correct}
                </div>
                <div className="text-gray-300 text-sm">
                  {t('practiceExam.incorrect') || 'خاطئة'}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleStartExam} className="flex-1">
                {t('practiceExam.retryExam') || 'إعادة الامتحان'}
              </Button>
              <Button
                onClick={() => navigate('/study-library')}
                variant="outline"
                className="flex-1"
              >
                {t('common.back') || 'العودة للمكتبة'}
              </Button>
            </div>
          </div>

          {/* Review answers */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('practiceExam.reviewAnswers') || 'مراجعة الإجابات'}
            </h2>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`bg-glass backdrop-blur-lg border rounded-lg p-6 ${
                    isCorrect ? 'border-green-500/30' : 'border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-sm">
                          {t('practiceExam.question') || 'سؤال'} {index + 1}
                        </span>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-400 text-xs">{question.topic}</span>
                      </div>
                      <p className="text-white text-lg mb-4">{question.question}</p>

                      {question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => {
                            const optionLetter = String.fromCharCode(65 + optIndex);
                            const isUserChoice = userAnswer === optionLetter;
                            const isCorrectChoice = question.correctAnswer === optionLetter;

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectChoice
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : isUserChoice
                                      ? 'bg-red-500/10 border-red-500/30'
                                      : 'bg-white/5 border-white/10'
                                }`}
                              >
                                <span className="text-white">
                                  {optionLetter}. {option}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.explanation && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <p className="text-sm text-blue-200">
                            <span className="font-semibold">
                              {t('practiceExam.explanation') || 'التفسير'}:
                            </span>{' '}
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Exam screen
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-white font-mono text-lg">{formatTime(timeElapsed)}</span>
            </div>
            <div className="text-white">
              {t('practiceExam.question') || 'سؤال'} {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl mb-6">
          <div className="mb-6">
            <div className="text-gray-400 text-sm mb-2">{currentQuestion.topic}</div>
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
          </div>

          {currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion.id] === optionLetter;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, optionLetter)}
                    className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-primary/50 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold ml-3">{optionLetter}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex-1"
          >
            {t('practiceExam.previous') || 'السابق'}
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmitExam}
              disabled={Object.keys(answers).length !== questions.length}
              className="flex-1"
            >
              {t('practiceExam.submitExam') || 'إنهاء الامتحان'}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1">
              {t('practiceExam.next') || 'التالي'}
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                answers[questions[index].id]
                  ? 'bg-primary text-white'
                  : index === currentQuestionIndex
                    ? 'bg-white/20 text-white border-2 border-primary'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
