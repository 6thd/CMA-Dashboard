/**
 * Study Library Page
 * Main hub for PDF study materials with advanced features
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  FileText,
  Download,
  Search,
  BookMarked,
  Brain,
  ListChecks,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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
  const { t } = useTranslation();
  const addNotification = useAppStore(state => state.addNotification);

  const [materials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'CMA Part 1 2025',
      fileName: 'CMA_P1_2025.pdf',
      fileUrl: '/CMA_P1_2025.pdf',
      description:
        'Comprehensive study material for CMA Part 1 - Financial Planning, Performance, and Analytics',
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
    .filter(material => {
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
        title: t('notifications.info'),
        message: t('notifications.processingQuestions'),
      });

      navigate(`/practice-exam/${material.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('notifications.error'),
        message: t('notifications.questionsFailed'),
      });
    }
  };

  const handleGenerateFlashcards = async (material: StudyMaterial) => {
    try {
      addNotification({
        type: 'info',
        title: t('notifications.info'),
        message: t('notifications.processingFlashcards'),
      });

      navigate(`/flashcards/${material.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('notifications.error'),
        message: t('notifications.flashcardsFailed'),
      });
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`studyLibrary.${difficulty}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with consistent styling */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white text-shadow">{t('studyLibrary.title')}</h1>
          <p className="text-gray-300 mt-1">{t('studyLibrary.subtitle')}</p>
        </div>
      </div>

      {/* Quick Stats with unified styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                {t('studyLibrary.totalMaterials')}
              </p>
              <p className="text-2xl font-bold text-white">{materials.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                {t('studyLibrary.averageProgress')}
              </p>
              <p className="text-2xl font-bold text-white">
                {Math.round(
                  materials.reduce((acc, m) => acc + m.readProgress, 0) / materials.length
                )}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BookMarked className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                {t('studyLibrary.bookmarks')}
              </p>
              <p className="text-2xl font-bold text-white">
                {materials.reduce((acc, m) => acc + m.bookmarks, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wide">
                {t('studyLibrary.studyTime')}
              </p>
              <p className="text-2xl font-bold text-white">24 {t('studyLibrary.hours')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search with consistent styling */}
      <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t('studyLibrary.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="bg-white/10 border-white/30 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white"
              aria-label="Filter by difficulty"
            >
              <option value="all" className="text-black">
                {t('studyLibrary.allLevels')}
              </option>
              <option value="beginner" className="text-black">
                {t('studyLibrary.beginner')}
              </option>
              <option value="intermediate" className="text-black">
                {t('studyLibrary.intermediate')}
              </option>
              <option value="advanced" className="text-black">
                {t('studyLibrary.advanced')}
              </option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'recent' | 'progress' | 'name')}
              className="px-4 py-2 bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-white"
              aria-label="Sort by"
            >
              <option value="recent" className="text-black">
                {t('studyLibrary.sortByRecent')}
              </option>
              <option value="progress" className="text-black">
                {t('studyLibrary.sortByProgress')}
              </option>
              <option value="name" className="text-black">
                {t('studyLibrary.sortByName')}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Grid with consistent styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMaterials.map(material => (
          <div
            key={material.id}
            className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl overflow-hidden hover:border-white/30 transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{material.title}</h3>
                  <p className="text-sm text-gray-300">{material.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    material.difficulty === 'beginner'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : material.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {getDifficultyLabel(material.difficulty)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-300">{t('studyLibrary.progress')}</span>
                  <span className="font-semibold text-white">{material.readProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${material.readProgress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>
                    {material.pages} {t('studyLibrary.pages')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookMarked className="w-4 h-4" />
                  <span>
                    {material.bookmarks} {t('studyLibrary.bookmark')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {t('studyLibrary.lastRead')}: {material.lastRead?.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {material.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium border border-primary/30"
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
                  className="bg-primary hover:bg-primary-dark"
                >
                  {t('studyLibrary.openMaterial')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateQuestions(material)}
                  leftIcon={<ListChecks className="w-4 h-4" />}
                  className="border-white/30 hover:bg-white/10 text-white"
                >
                  {t('studyLibrary.generateQuestions')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerateFlashcards(material)}
                  leftIcon={<Brain className="w-4 h-4" />}
                  className="border-white/30 hover:bg-white/10 text-white"
                >
                  {t('studyLibrary.flashcards')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  className="border-white/30 hover:bg-white/10 text-white"
                >
                  {t('studyLibrary.download')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
