/**
 * Study Material Viewer Page
 * صفحة عرض المواد الدراسية
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, Clock, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import PDFViewer from '@/components/PDFViewer';

interface StudyMaterial {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  description: string;
  pages: number;
  readProgress?: number;
  lastRead?: Date;
}

export default function StudyMaterialViewerPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    // Load material data
    if (materialId === '1') {
      setMaterial({
        id: '1',
        title: 'CMA Part 1 2025',
        fileName: 'CMA_P1_2025.pdf',
        fileUrl: '/CMA_P1_2025.pdf',
        description:
          t('studyLibrary.cmaDescription') ||
          'Comprehensive study material for CMA Part 1 - Financial Planning, Performance, and Analytics',
        pages: 450,
        readProgress: 35,
        lastRead: new Date(),
      });
      setCurrentProgress(35);
    }
    setLoading(false);
  }, [materialId, t]);

  const handleProgress = (progress: number) => {
    // Save progress to backend
    setCurrentProgress(progress);
    console.log('Progress:', progress);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {t('studyLibrary.loadingMaterial') || 'Loading material...'}
          </p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-glass backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-xl">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">
            {t('studyLibrary.materialNotFound') || 'Material not found'}
          </p>
          <Button onClick={() => navigate('/study-library')}>
            {t('pdfViewer.back') || 'Return to Library'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with consistent styling - رأس الصفحة بتنسيق موحد */}
      <div className="bg-glass backdrop-blur-lg border-b border-white/20 px-4 md:px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* Top Row: Back button and Title */}
            <div className="flex items-start gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/study-library')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-white border-white/30 hover:bg-white/10 shrink-0"
              >
                {t('pdfViewer.back') || 'Back'}
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                  {material.title}
                </h1>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{material.description}</p>
              </div>
            </div>

            {/* Statistics Row - صف الإحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Pages - الصفحات */}
              <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-300 uppercase tracking-wide truncate">
                      {t('studyLibrary.pages') || 'Pages'}
                    </div>
                    <div className="text-lg font-bold text-white">{material.pages}</div>
                  </div>
                </div>
              </div>

              {/* Progress - التقدم */}
              <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-300 uppercase tracking-wide truncate">
                      {t('studyLibrary.progress') || 'Progress'}
                    </div>
                    <div className="text-lg font-bold text-white">{currentProgress}%</div>
                  </div>
                </div>
              </div>

              {/* Last Read - آخر قراءة */}
              <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 col-span-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-300 uppercase tracking-wide truncate">
                      {t('studyLibrary.lastRead') || 'Last Read'}
                    </div>
                    <div className="text-sm font-semibold text-white truncate">
                      {material.lastRead?.toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) ||
                        t('studyLibrary.notStarted') ||
                        'Not started'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer - عارض PDF */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl overflow-hidden">
          <PDFViewer
            fileUrl={material.fileUrl}
            fileName={material.fileName}
            initialPage={1}
            onProgress={handleProgress}
          />
        </div>
      </div>
    </div>
  );
}
