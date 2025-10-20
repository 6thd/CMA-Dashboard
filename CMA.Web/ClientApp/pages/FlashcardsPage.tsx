/**
 * Flashcards Page
 * Dedicated page for studying with flashcards
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const addNotification = useAppStore((state) => state.addNotification);

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
        front: '?? ?? CMA?',
        back: 'Certified Management Accountant - ????? ????? ?????',
        category: '???????',
        difficulty: 'easy',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '2',
        front: '?? ?? ???????? ???????? ?? CMA Part 1?',
        back: '??????? ?????? (Financial Planning)? ????? ?????? (Performance Management)? ????? ???????? (Cost Management)',
        category: '??????? ???????',
        difficulty: 'medium',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '3',
        front: '?? ?? ???????? ???????? (Master Budget)?',
        back: '?????? ????? ?? ????????? ????????? ???????? ???? ???? ?????? ???????',
        category: '??????? ??????',
        difficulty: 'medium',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '4',
        front: '?? ????? ??? ??????? ??????? ??????????',
        back: '??????? ??????? ?? ????? ?? ??? ???????? ????? ??????? ???????? ????? ???? ????? ?? ??? ???????',
        category: '????? ????????',
        difficulty: 'easy',
        easinessFactor: 2.5,
        reviewCount: 0,
      },
      {
        id: '5',
        front: '?? ?? ???? ?????? ??????? (IRR)?',
        back: '???? ????? ???? ???? ???? ?????? ??????? ??????? ??????? ?????',
        category: '??????? ??????',
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
        title: '???? ?????!',
        message: `???? ??? ${completionResults.correct} ?? ${completionResults.total}`,
      });
    } else if (percentage >= 60) {
      addNotification({
        type: 'info',
        title: '???? ???',
        message: `???? ??? ${completionResults.correct} ?? ${completionResults.total}`,
      });
    } else {
      addNotification({
        type: 'warning',
        title: '????? ????? ?? ????????',
        message: `???? ??? ${completionResults.correct} ?? ${completionResults.total}`,
      });
    }
  };

  const handleRestart = () => {
    setCompleted(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">???? ???????...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/study-library')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              ??????
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">???????? ?????????</h1>
              <p className="text-sm text-gray-500">?????? ????? ???????? ????????</p>
            </div>
          </div>

          {completed && (
            <Button
              variant="outline"
              onClick={handleRestart}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              ????? ????????
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
            <Card padding="lg">
              <CardHeader>
                <CardTitle>???????</CardTitle>
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
                        className="text-gray-200"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${
                          (results!.correct / results!.total) * 440
                        } 440`}
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
                      <div className="text-4xl font-bold text-gray-900">
                        {Math.round((results!.correct / results!.total) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {results!.correct}
                      </div>
                      <div className="text-sm text-green-700">????</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {results!.total - results!.correct}
                      </div>
                      <div className="text-sm text-red-700">???</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results!.total}
                      </div>
                      <div className="text-sm text-blue-700">??????</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleRestart} size="lg">
                      ?????? ??? ????
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/study-library')}
                      size="lg"
                    >
                      ?????? ???????
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
