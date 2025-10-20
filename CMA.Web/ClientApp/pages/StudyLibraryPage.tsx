/**
 * Study Library Page
 * Main hub for PDF study materials with advanced features
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Filter,
  BookMarked,
  Brain,
  ListChecks,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { pdfService } from '@/services/pdfExtractionService';
import { useAppStore } from '@/store/useAppStore';

interface StudyMaterial {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  description: string;
  pages: number;
  uploadDate: Date;
  lastRead?: Date;
  readProgress: number; // 0-100
  bookmarks: number;
  notes: number;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function StudyLibraryPage() {
  const navigate = useNavigate();
  const addNotification = useAppStore((state) => state.addNotification);

  const [materials, setMaterials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'CMA Part 1 2025',
      fileName: 'CMA P1 2025.pdf',
      fileUrl: '/materials/CMA P1 2025.pdf',
      description: '?????? ?????? ??????? CMA ????? ????? 2025',
      pages: 450,
      uploadDate: new Date('2024-01-01'),
      lastRead: new Date(),
      readProgress: 35,
      bookmarks: 12,
      notes: 8,
      topics: ['Financial Planning', 'Performance Management', 'Cost Management'],
      difficulty: 'advanced',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');

  // Filter and sort materials
  const filteredMaterials = materials
    .filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === 'all' || material.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return (b.lastRead?.getTime() || 0) - (a.lastRead?.getTime() || 0);
      } else if (sortBy === 'progress') {
        return b.readProgress - a.readProgress;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const handleOpenMaterial = (material: StudyMaterial) => {
    navigate(`/study/${material.id}`);
  };

  const handleGenerateQuestions = async (material: StudyMaterial) => {
    try {
      addNotification({
        type: 'info',
        title: '???? ????????',
        message: '???? ????? ??????? ?? ???????...',
      });

      // This would call the PDF extraction service
      // const questions = await pdfService.generatePracticeExam(text, 20);

      navigate(`/practice-exam/${material.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: '???',
        message: '??? ?? ????? ???????',
      });
    }
  };

  const handleGenerateFlashcards = async (material: StudyMaterial) => {
    try {
      addNotification({
        type: 'info',
        title: '???? ????????',
        message: '???? ????? ???????? ?????????...',
      });

      navigate(`/flashcards/${material.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: '???',
        message: '??? ?? ????? ????????',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '?????';
      case 'intermediate':
        return '?????';
      case 'advanced':
        return '?????';
      default:
        return difficulty;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">??????? ????????</h1>
        <p className="text-gray-600">
          ?????? ????? ?????? ????????? ?? ????? ?????? ?????? ???????
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">?????? ??????</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">????? ??????</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    materials.reduce((acc, m) => acc + m.readProgress, 0) / materials.length
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookMarked className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">?????? ??????</p>
                <p className="text-2xl font-bold">
                  {materials.reduce((acc, m) => acc + m.bookmarks, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">??? ???????</p>
                <p className="text-2xl font-bold">24 ????</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent padding="md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="???? ?? ??????..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">?? ?????????</option>
                <option value="beginner">?????</option>
                <option value="intermediate">?????</option>
                <option value="advanced">?????</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">??????</option>
                <option value="progress">??????</option>
                <option value="name">?????</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} variant="bordered" className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle as="h3">{material.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                  {getDifficultyLabel(material.difficulty)}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">??????</span>
                  <span className="font-medium">{material.readProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${material.readProgress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{material.pages} ????</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookMarked className="w-4 h-4" />
                  <span>{material.bookmarks} ?????</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>??? ?????: {material.lastRead?.toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {material.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleOpenMaterial(material)}
                  leftIcon={<BookOpen className="w-4 h-4" />}
                >
                  ??? ??????
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateQuestions(material)}
                  leftIcon={<ListChecks className="w-4 h-4" />}
                >
                  ????? ?????
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateFlashcards(material)}
                  leftIcon={<Brain className="w-4 h-4" />}
                >
                  ?????? ???????
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  ?????
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
