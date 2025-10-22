/**
 * Advanced PDF Viewer Component
 * عارض PDF متقدم مع ميزات الإشارات والملاحظات
 */

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Bind react-pdf's pdfjs to the local worker URL to avoid fake-worker fallback
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// Include required styles for text and annotation layers to avoid blue bars/unstyled overlays
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  BookmarkPlus,
  Highlighter,
  StickyNote,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import pdfService from '@/services/pdfExtractionService';
import styles from './PDFViewer.module.css';

// Configure the worker on react-pdf's pdfjs instance explicitly
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl as unknown as string;

interface Bookmark {
  id: string;
  page: number;
  title: string;
  timestamp: Date;
}

interface Highlight {
  id: string;
  page: number;
  text: string;
  color: string;
  rects: DOMRect[]; // Store multiple rectangles for multi-line selections
}

interface Note {
  id: string;
  page: number;
  content: string;
  position: { x: number; y: number };
  timestamp: Date;
}

interface PDFViewerProps {
  fileUrl: string;
  fileName?: string;
  initialPage?: number;
  onProgress?: (progress: number) => void;
}

export default function PDFViewer({
  fileUrl,
  fileName = 'Document.pdf',
  initialPage = 1,
  onProgress,
}: PDFViewerProps) {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'highlights'>('bookmarks');
  const [isHighlighting, setIsHighlighting] = useState<boolean>(false);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('#FFEB3B'); // Yellow default
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left');
  const [sidebarWidth, setSidebarWidth] = useState<number>(320); // Default 320px (80 * 4)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  // Fallback for loading PDF as ArrayBuffer if URL load fails
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [triedBuffer, setTriedBuffer] = useState<boolean>(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Highlight colors palette
  const highlightColors = [
    { name: 'أصفر', color: '#FFEB3B' },
    { name: 'أخضر', color: '#4CAF50' },
    { name: 'أزرق', color: '#2196F3' },
    { name: 'وردي', color: '#E91E63' },
    { name: 'برتقالي', color: '#FF9800' },
    { name: 'بنفسجي', color: '#9C27B0' },
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`pdf-bookmarks-${fileName}`);
    const savedHighlights = localStorage.getItem(`pdf-highlights-${fileName}`);
    const savedNotes = localStorage.getItem(`pdf-notes-${fileName}`);
    const savedPage = localStorage.getItem(`pdf-page-${fileName}`);
    const savedColor = localStorage.getItem('pdf-highlight-color');
    const savedSidebarWidth = localStorage.getItem('pdf-sidebar-width');
    const savedSidebarPosition = localStorage.getItem('pdf-sidebar-position');

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHighlights) {
      try {
        const parsed = JSON.parse(savedHighlights);
        // Recreate DOMRect objects from stored data
        const restoredHighlights = parsed.map((h: Highlight) => ({
          ...h,
          rects: h.rects.map(
            r =>
              ({
                ...r,
                toJSON: () => ({}),
              }) as DOMRect
          ),
        }));
        setHighlights(restoredHighlights);
      } catch (e) {
        console.error('Failed to load highlights:', e);
      }
    }
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPage) setCurrentPage(parseInt(savedPage));
    if (savedColor) setSelectedColor(savedColor);
    if (savedSidebarWidth) setSidebarWidth(parseInt(savedSidebarWidth));
    if (savedSidebarPosition) setSidebarPosition(savedSidebarPosition as 'left' | 'right');
  }, [fileName]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(`pdf-bookmarks-${fileName}`, JSON.stringify(bookmarks));
    localStorage.setItem(`pdf-highlights-${fileName}`, JSON.stringify(highlights));
    localStorage.setItem(`pdf-notes-${fileName}`, JSON.stringify(notes));
    localStorage.setItem(`pdf-page-${fileName}`, currentPage.toString());
  }, [bookmarks, highlights, notes, currentPage, fileName]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('pdf-highlight-color', selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    localStorage.setItem('pdf-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem('pdf-sidebar-position', sidebarPosition);
  }, [sidebarPosition]);

  // Track reading progress
  useEffect(() => {
    if (numPages > 0 && onProgress) {
      const progress = (currentPage / numPages) * 100;
      onProgress(progress);
    }
  }, [currentPage, numPages, onProgress]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const addBookmark = () => {
    const title = prompt(t('pdfViewer.enterBookmarkTitle'));
    if (title) {
      const newBookmark: Bookmark = {
        id: crypto.randomUUID(),
        page: currentPage,
        title,
        timestamp: new Date(),
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handleGenerateQuestions = async () => {
    try {
      setIsGeneratingQuestions(true);

      // Extract text from the current PDF
      const extractedText = await pdfService.extractText(fileUrl);

      if (!extractedText || extractedText.trim().length === 0) {
        alert(t('pdfViewer.noTextFound') || 'لا يوجد نص قابل للاستخراج من PDF');
        return;
      }

      // Extract questions using AI
      const questions = await pdfService.extractQuestions(extractedText);

      if (questions && questions.length > 0) {
        // Store questions in localStorage for the questions page
        localStorage.setItem('generated-questions', JSON.stringify(questions));
        localStorage.setItem('questions-source', fileName);

        alert(
          t('pdfViewer.questionsGenerated', { count: questions.length }) ||
            `تم توليد ${questions.length} سؤال بنجاح! سيتم فتح صفحة الأسئلة.`
        );

        // Navigate to questions page or show in modal
        window.open('/questions', '_blank');
      } else {
        alert(t('pdfViewer.noQuestionsGenerated') || 'لم يتم توليد أسئلة. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(
        t('pdfViewer.questionGenerationError') ||
          'حدث خطأ أثناء توليد الأسئلة. تأكد من أن الملف يحتوي على نص قابل للقراءة.'
      );
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Handle text selection for highlighting or adding notes
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') return;

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);

    if (isHighlighting) {
      // Get the PDF page container to calculate relative positions
      const pageContainer = pageRef.current || containerRef.current;
      if (!pageContainer) return;

      const containerRect = pageContainer.getBoundingClientRect();

      // Get all rectangles for the selection (handles multi-line properly)
      const clientRects = Array.from(range.getClientRects()).filter(
        rect => rect.width > 0 && rect.height > 0
      );

      if (clientRects.length === 0) return;

      // Convert to relative coordinates within the page container
      const rects = clientRects.map(
        r =>
          ({
            x: r.x - containerRect.x,
            y: r.y - containerRect.y,
            width: r.width,
            height: r.height,
            top: r.top - containerRect.top,
            right: r.right - containerRect.left,
            bottom: r.bottom - containerRect.top,
            left: r.left - containerRect.left,
            toJSON: () => ({}),
          }) as DOMRect
      );

      // Add highlight with actual rectangles
      const newHighlight: Highlight = {
        id: crypto.randomUUID(),
        page: currentPage,
        text: selectedText,
        color: selectedColor,
        rects: rects,
      };
      setHighlights([...highlights, newHighlight]);
      setIsHighlighting(false);
      selection.removeAllRanges();
    } else if (isAddingNote) {
      // Add note
      const noteContent = prompt(t('pdfViewer.addNote'), selectedText);
      if (noteContent) {
        const rects = Array.from(range.getClientRects());
        const firstRect = rects[0];
        const newNote: Note = {
          id: crypto.randomUUID(),
          page: currentPage,
          content: noteContent,
          position: { x: firstRect?.x || 0, y: firstRect?.y || 0 },
          timestamp: new Date(),
        };
        setNotes([...notes, newNote]);
      }
      setIsAddingNote(false);
      selection.removeAllRanges();
    }
  };

  return (
    <div className="flex h-full bg-gray-900/50">
      {/* Highlighting Mode Indicator */}
      {isHighlighting && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-pulse">
          <Highlighter className="w-5 h-5" />
          <span className="font-semibold">
            {t('pdfViewer.highlightModeActive') || 'وضع التظليل نشط - حدد النص'}
          </span>
          <button
            onClick={() => setIsHighlighting(false)}
            className="ml-2 hover:bg-yellow-600 rounded px-2"
            aria-label="Cancel highlighting"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Note Mode Indicator */}
      {isAddingNote && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-pulse">
          <StickyNote className="w-5 h-5" />
          <span className="font-semibold">
            {t('pdfViewer.noteModeActive') || 'وضع الملاحظات نشط - حدد النص'}
          </span>
          <button
            onClick={() => setIsAddingNote(false)}
            className="ml-2 hover:bg-blue-600 rounded px-2"
            aria-label="Cancel note"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(styles.sidebar, sidebarOpen ? styles.sidebarOpen : '')}>
        {sidebarOpen && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{t('pdfViewer.bookmarks')}</h3>
              <div className="flex items-center gap-2">
                {/* Sidebar Settings Dropdown */}
                <div className="relative group">
                  <button
                    className="text-gray-400 hover:text-white p-1"
                    aria-label="إعدادات الشريط"
                    title="إعدادات الشريط"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-3 space-y-2">
                      <div className="text-xs text-gray-300 mb-2">الموضع</div>
                      <button
                        onClick={() => setSidebarPosition('left')}
                        className={cn(
                          'w-full text-left px-2 py-1 rounded text-sm',
                          sidebarPosition === 'left'
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-gray-600'
                        )}
                      >
                        يسار
                      </button>
                      <button
                        onClick={() => setSidebarPosition('right')}
                        className={cn(
                          'w-full text-left px-2 py-1 rounded text-sm',
                          sidebarPosition === 'right'
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-gray-600'
                        )}
                      >
                        يمين
                      </button>
                      <div className="text-xs text-gray-300 mt-3 mb-2">العرض</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSidebarWidth(prev => Math.max(240, prev - 40))}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                        >
                          -
                        </button>
                        <span className="text-xs text-gray-300 flex-1 text-center">
                          {sidebarWidth}px
                        </span>
                        <button
                          onClick={() => setSidebarWidth(prev => Math.min(480, prev + 40))}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label={t('close')}
                  title={t('close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  activeTab === 'bookmarks'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                )}
              >
                {t('pdfViewer.bookmarks')} ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  activeTab === 'notes'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                )}
              >
                {t('pdfViewer.notes')} ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium',
                  activeTab === 'highlights'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                )}
              >
                {t('pdfViewer.highlights')} ({highlights.length})
              </button>
            </div>

            {/* Content */}
            <div className="space-y-2">
              {activeTab === 'bookmarks' &&
                bookmarks.length > 0 &&
                bookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer transition-colors"
                    onClick={() => goToPage(bookmark.page)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{bookmark.title}</p>
                      <p className="text-xs text-gray-400">
                        {t('pdfViewer.goToPage')}: {bookmark.page}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className="text-red-400 hover:text-red-300 ml-2 shrink-0"
                      aria-label={t('pdfViewer.delete')}
                      title={t('pdfViewer.delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

              {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">
                  {t('pdfViewer.noBookmarks')}
                </p>
              )}

              {activeTab === 'notes' &&
                notes.length > 0 &&
                notes.map(note => (
                  <div
                    key={note.id}
                    className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 cursor-pointer transition-colors"
                    onClick={() => goToPage(note.page)}
                  >
                    <p className="text-sm mb-2 text-white">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {t('pdfViewer.goToPage')}: {note.page}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removeNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                        aria-label={t('pdfViewer.delete')}
                        title={t('pdfViewer.delete')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

              {activeTab === 'notes' && notes.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">{t('pdfViewer.noNotes')}</p>
              )}

              {activeTab === 'highlights' &&
                highlights.length > 0 &&
                highlights.map(highlight => (
                  <div
                    key={highlight.id}
                    className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 cursor-pointer transition-colors"
                    onClick={() => goToPage(highlight.page)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-2 text-white truncate">{highlight.text}</p>
                      <p className="text-xs text-gray-400">
                        {t('pdfViewer.goToPage')}: {highlight.page}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeHighlight(highlight.id);
                      }}
                      className="text-red-400 hover:text-red-300 ml-2 shrink-0"
                      aria-label={t('pdfViewer.delete')}
                      title={t('pdfViewer.delete')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

              {activeTab === 'highlights' && highlights.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">
                  {t('pdfViewer.noHighlights')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800/90 backdrop-blur-lg border-b border-white/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Menu className="w-4 h-4" />}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white border-white/30 hover:bg-white/10"
                title={t('pdfViewer.bookmarks')}
              >
                <span className="hidden sm:inline">{t('pdfViewer.bookmarks')}</span>
              </Button>

              <div className="h-6 w-px bg-white/20" />

              <Button
                size="sm"
                variant="outline"
                onClick={previousPage}
                disabled={currentPage <= 1}
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
                title={t('pdfViewer.previousPage')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <span className="text-sm px-2 text-white whitespace-nowrap">
                {currentPage} {t('pdfViewer.of')} {numPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={nextPage}
                disabled={currentPage >= numPages}
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
                title={t('pdfViewer.nextPage')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="h-6 w-px bg-white/20" />

              <Button
                size="sm"
                variant="outline"
                onClick={zoomOut}
                className="text-white border-white/30 hover:bg-white/10"
                title={t('pdfViewer.zoomOut')}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <span className="text-sm px-2 text-white whitespace-nowrap">
                {Math.round(scale * 100)}%
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={zoomIn}
                className="text-white border-white/30 hover:bg-white/10"
                title={t('pdfViewer.zoomIn')}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<BookmarkPlus className="w-4 h-4" />}
                onClick={addBookmark}
                className="text-white border-white/30 hover:bg-white/10"
                title={t('pdfViewer.addBookmark')}
              >
                <span className="hidden md:inline">{t('pdfViewer.addBookmark')}</span>
              </Button>

              <Button
                size="sm"
                variant={isAddingNote ? 'default' : 'outline'}
                leftIcon={<StickyNote className="w-4 h-4" />}
                onClick={() => setIsAddingNote(!isAddingNote)}
                className={isAddingNote ? '' : 'text-white border-white/30 hover:bg-white/10'}
                title={t('pdfViewer.addNote')}
              >
                <span className="hidden md:inline">{t('pdfViewer.addNote')}</span>
              </Button>

              {/* Highlight Button with Color Picker */}
              <div className="relative">
                <Button
                  size="sm"
                  variant={isHighlighting ? 'default' : 'outline'}
                  leftIcon={<Highlighter className="w-4 h-4" />}
                  onClick={() => setIsHighlighting(!isHighlighting)}
                  className={cn(
                    isHighlighting ? '' : 'text-white border-white/30 hover:bg-white/10',
                    styles.highlightButton
                  )}
                  title={t('pdfViewer.highlight')}
                >
                  <span className="hidden md:inline">{t('pdfViewer.highlight')}</span>
                </Button>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={cn(
                    'absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-lg',
                    styles.colorPickerButton
                  )}
                  aria-label="اختيار اللون"
                  title="اختيار اللون"
                />
                {showColorPicker && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-700 rounded-lg shadow-2xl p-3 z-50 border border-white/20">
                    <div className="text-xs text-gray-300 mb-2 text-center">اختر اللون</div>
                    <div className="grid grid-cols-3 gap-2">
                      {highlightColors.map(color => (
                        <button
                          key={color.color}
                          onClick={() => {
                            setSelectedColor(color.color);
                            setShowColorPicker(false);
                          }}
                          className={cn(
                            'w-10 h-10 rounded border-2 transition-all hover:scale-110',
                            selectedColor === color.color
                              ? 'border-white scale-105'
                              : 'border-gray-500',
                            styles.colorPickerButton
                          )}
                          title={color.name}
                          aria-label={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-white/20" />

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={handleGenerateQuestions}
                disabled={isGeneratingQuestions}
                className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
                title={t('pdfViewer.generateQuestions') || 'توليد أسئلة من المقرر'}
              >
                <span className="hidden md:inline">
                  {isGeneratingQuestions
                    ? t('pdfViewer.generating') || 'جاري التوليد...'
                    : t('pdfViewer.generateQuestions') || 'توليد أسئلة'}
                </span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={downloadPDF}
                className="text-white border-white/30 hover:bg-white/10"
                title={t('pdfViewer.downloadPDF')}
              >
                <span className="hidden md:inline">{t('pdfViewer.downloadPDF')}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Display */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-900 flex justify-center items-start p-8"
          onMouseUp={handleTextSelection}
        >
          <div className="rounded-lg overflow-hidden relative">
            <Document
              file={fileData ? { data: fileData } : fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={async error => {
                console.error('Error loading PDF:', error);
                // Try fetching as ArrayBuffer once if direct URL load fails
                if (!triedBuffer) {
                  try {
                    setTriedBuffer(true);
                    const res = await fetch(fileUrl);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const buffer = await res.arrayBuffer();
                    setFileData(buffer);
                    return;
                  } catch (e) {
                    console.error('Fallback fetch failed:', e);
                  }
                }
                alert(`فشل في تحميل ملف PDF: ${error.message}`);
              }}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('pdfViewer.loading')}</p>
                  </div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
                    <p className="text-red-600 font-semibold mb-2">فشل في تحميل ملف PDF</p>
                    <p className="text-sm text-gray-600">الرجاء التحقق من المسار: {fileUrl}</p>
                  </div>
                </div>
              }
            >
              <div className="relative" ref={pageRef}>
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="react-pdf-page"
                />

                {/* Highlight Overlay Layer - only for current page */}
                {highlights
                  .filter(h => h.page === currentPage)
                  .map(highlight => (
                    <div key={highlight.id} className={styles.highlightOverlay}>
                      {highlight.rects.map((rect, idx) => (
                        <div
                          key={`${highlight.id}-${idx}`}
                          className={styles.highlightOverlay}
                          style={
                            {
                              '--highlight-color': highlight.color,
                              '--left': `${rect.x}px`,
                              '--top': `${rect.y}px`,
                              '--width': `${rect.width}px`,
                              '--height': `${rect.height}px`,
                            } as React.CSSProperties
                          }
                          title={highlight.text}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
