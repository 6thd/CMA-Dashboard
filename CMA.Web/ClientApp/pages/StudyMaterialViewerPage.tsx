/**
 * Study Material Viewer Page
 * Dedicated page for viewing and interacting with PDF materials
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import PDFViewer from '@/components/PDFViewer';
import { useAppStore } from '@/store/useAppStore';

interface StudyMaterial {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  description: string;
  pages: number;
}

export default function StudyMaterialViewerPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const addNotification = useAppStore((state) => state.addNotification);

  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load material data
    // In a real app, this would fetch from an API
    if (materialId === '1') {
      setMaterial({
        id: '1',
        title: 'CMA Part 1 2025',
        fileName: 'CMA P1 2025 .pdf',
        fileUrl: '/materials/CMA P1 2025 .pdf',
        description: '?????? ?????? ??????? CMA ????? ????? 2025',
        pages: 450,
      });
    }
    setLoading(false);
  }, [materialId]);

  const handleProgress = (progress: number) => {
    // Save progress to backend
    console.log('Progress:', progress);
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

  if (!material) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">?????? ??? ??????</p>
          <Button onClick={() => navigate('/study-library')}>
            ?????? ???????
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
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
              <h1 className="text-lg font-semibold text-gray-900">{material.title}</h1>
              <p className="text-sm text-gray-500">{material.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer
          fileUrl={material.fileUrl}
          fileName={material.fileName}
          initialPage={1}
          onProgress={handleProgress}
        />
      </div>
    </div>
  );
}
