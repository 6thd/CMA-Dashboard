/**
 * Flashcards Component
 * Interactive flashcards for effective memorization
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Check, X, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  easinessFactor: number; // For spaced repetition
  reviewCount: number;
}

interface FlashcardsProps {
  cards: Flashcard[];
  onComplete?: (results: { correct: number; total: number }) => void;
}

export default function Flashcards({ cards, onComplete }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<string>>(new Set());
  const [showingAnswer, setShowingAnswer] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowingAnswer(!showingAnswer);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowingAnswer(false);
    } else if (onComplete) {
      onComplete({
        correct: correctCards.size,
        total: cards.length,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowingAnswer(false);
    }
  };

  const handleKnow = () => {
    const newStudied = new Set(studiedCards);
    const newCorrect = new Set(correctCards);
    newStudied.add(currentCard.id);
    newCorrect.add(currentCard.id);
    setStudiedCards(newStudied);
    setCorrectCards(newCorrect);
    handleNext();
  };

  const handleDontKnow = () => {
    const newStudied = new Set(studiedCards);
    newStudied.add(currentCard.id);
    setStudiedCards(newStudied);
    handleNext();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">?? ???? ?????? ?????</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">??????</span>
          <span className="font-medium">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>????: {correctCards.size}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>???: {studiedCards.size - correctCards.size}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full" />
          <span>?????: {cards.length - studiedCards.size}</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative perspective-1000">
        <div
          className={cn(
            'relative w-full h-96 transition-transform duration-500 transform-style-3d cursor-pointer',
            isFlipped && 'rotate-y-180'
          )}
          onClick={handleFlip}
        >
          {/* Front */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden',
              'flex items-center justify-center p-8',
              'shadow-xl border-2 border-blue-200'
            )}
          >
            <CardContent className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">??????</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                    currentCard.difficulty
                  )}`}
                >
                  {currentCard.difficulty}
                </span>
              </div>
              <p className="text-2xl text-center font-medium text-gray-900">
                {currentCard.front}
              </p>
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-400">???? ?????</span>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden rotate-y-180',
              'flex items-center justify-center p-8',
              'shadow-xl border-2 border-green-200'
            )}
          >
            <CardContent className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">???????</span>
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl text-center text-gray-900 leading-relaxed">
                {currentCard.back}
              </p>
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-400">???? ?????</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category */}
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
          {currentCard.category}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Answer Buttons (shown when flipped) */}
        {showingAnswer && (
          <div className="flex gap-3">
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              onClick={handleDontKnow}
              leftIcon={<X className="w-5 h-5" />}
            >
              ?? ????
            </Button>
            <Button
              variant="default"
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleKnow}
              leftIcon={<Check className="w-5 h-5" />}
            >
              ????
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            leftIcon={<ChevronRight className="w-5 h-5" />}
          >
            ??????
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleFlip}
            leftIcon={<RotateCw className="w-5 h-5" />}
          >
            ??? ???????
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            rightIcon={<ChevronLeft className="w-5 h-5" />}
          >
            ??????
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-xs text-gray-400">
        <p>???????? ???? ????????: Space (???) | ? (??????) | ? (??????)</p>
      </div>
    </div>
  );
}
