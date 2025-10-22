/**
 * Flashcards Page
 * Dedicated page for studying with flashcards
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Flashcards from '@/components/Flashcards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  easinessFactor: number;
  reviewCount: number;
}

export default function FlashcardsPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const addNotification = useAppStore(state => state.addNotification);

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    // Load flashcards
    // In a real app, this would fetch from an API or generate from PDF
    const sampleCards: Flashcard[] = [
      {
        id: '1',
        front: 'ما هو CMA?',
        back: 'Certified Management Accountant - محاسب إداري معتمد',
        category: 'مقدمة',
        difficulty: 'easy',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '2',
        front: 'ما هي المواضيع الرئيسية في CMA Part 1?',
        back: 'التخطيط المالي (Financial Planning)، إدارة الأداء (Performance Management)، إدارة التكاليف (Cost Management)',
        category: 'المحتوى العلمي',
        difficulty: 'medium',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '3',
        front: 'ما هو الموازنة الشاملة (Master Budget)?',
        back: 'خطة شاملة من الموازنات المترابطة المتكاملة لفترة زمنية مستقبلية',
        category: 'التخطيط المالي',
        difficulty: 'medium',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '4',
        front: 'ما الفرق بين التكاليف الثابتة والمتغيرة?',
        back: 'التكاليف الثابتة لا تتغير مع حجم الإنتاج بينما التكاليف المتغيرة تتغير بشكل مباشر مع حجم الإنتاج',
        category: 'إدارة التكاليف',
        difficulty: 'easy',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '5',
        front: 'ما هو معدل العائد الداخلي (IRR)?',
        back: 'معدل الخصم الذي يجعل صافي القيمة الحالية للتدفقات النقدية مساوياً للصفر',
        category: 'القرارات المالية',
        difficulty: 'hard',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
    ];

    setCards(sampleCards);
    setLoading(false);
  }, [materialId]);

  const handleComplete = (completionResults: { correct: number; total: number }) => {
    setResults(completionResults);
    setCompleted(true);

    const percentage = (completionResults.correct / completionResults.total) * 100;

    if (percentage >= 80) {
      addNotification({
        type: 'success',
        title: t('flashcards.excellentPerformance'),
        message: `${t('flashcards.youGot')} ${completionResults.correct} ${t('flashcards.outOf')} ${completionResults.total}`,
      });
    } else if (percentage >= 60) {
      addNotification({
        type: 'info',
        title: t('flashcards.goodPerformance'),
        message: `${t('flashcards.youGot')} ${completionResults.correct} ${t('flashcards.outOf')} ${completionResults.total}`,
      });
    } else {
      addNotification({
        type: 'warning',
        title: t('flashcards.needsMoreReview'),
        message: `${t('flashcards.youGot')} ${completionResults.correct} ${t('flashcards.outOf')} ${completionResults.total}`,
      });
    }
  };

  const handleRestart = () => {
    setCompleted(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">{t('studyLibrary.loadingMaterial')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-glass backdrop-blur-lg border-b border-white/20 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/study-library')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="text-white border-white/30 hover:bg-white/10"
            >
              {t('flashcards.backToLibrary')}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{t('flashcards.title')}</h1>
              <p className="text-sm text-gray-300">{t('flashcards.subtitle')}</p>
            </div>
          </div>

          {completed && (
            <Button
              variant="outline"
              onClick={handleRestart}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="text-white border-white/30 hover:bg-white/10"
            >
              {t('flashcards.reviewAgain')}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {!completed ? (
          <Flashcards cards={cards} onComplete={handleComplete} />
        ) : (
          <div className="max-w-2xl mx-auto px-6">
            <Card
              padding="lg"
              className="bg-white/95 backdrop-blur-lg shadow-2xl border-2 border-white/30"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 font-bold text-center">
                  {t('flashcards.results')}
                </CardTitle>
              </CardHeader>
              <CardContent padding="lg">
                <div className="text-center space-y-6">
                  {/* Score Circle */}
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="transform -rotate-90 w-40 h-40">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-300"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(results!.correct / results!.total) * 440} 440`}
                        className={
                          (results!.correct / results!.total) * 100 >= 80
                            ? 'text-green-500'
                            : (results!.correct / results!.total) * 100 >= 60
                              ? 'text-blue-500'
                              : 'text-yellow-500'
                        }
                      />
                    </svg>
                    <div className="absolute">
                      <div className="text-5xl font-bold text-gray-900">
                        {Math.round((results!.correct / results!.total) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg shadow-md">
                      <div className="text-3xl font-bold text-green-700">{results!.correct}</div>
                      <div className="text-sm font-semibold text-green-800">
                        {t('flashcards.correct')}
                      </div>
                    </div>
                    <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg shadow-md">
                      <div className="text-3xl font-bold text-red-700">
                        {results!.total - results!.correct}
                      </div>
                      <div className="text-sm font-semibold text-red-800">
                        {t('flashcards.incorrect')}
                      </div>
                    </div>
                    <div className="bg-blue-100 border-2 border-blue-300 p-4 rounded-lg shadow-md">
                      <div className="text-3xl font-bold text-blue-700">{results!.total}</div>
                      <div className="text-sm font-semibold text-blue-800">
                        {t('flashcards.total')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleRestart} size="lg" className="font-bold shadow-lg">
                      {t('flashcards.reviewAgainButton')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/study-library')}
                      size="lg"
                      className="font-bold border-2 shadow-lg"
                    >
                      {t('flashcards.backToLibraryButton')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
