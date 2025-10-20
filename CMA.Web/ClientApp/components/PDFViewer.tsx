/**
 * Advanced PDF Viewer Component
 * Full-featured PDF reader with highlights, bookmarks, and notes
 */

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download,
  BookmarkPlus,
  Highlighter,
  StickyNote,
  Search,
  Menu,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  position: { x: number; y: number; width: number; height: number };
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
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [searchText, setSearchText] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'highlights'>('bookmarks');
  const [isHighlighting, setIsHighlighting] = useState<boolean>(false);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`pdf-bookmarks-${fileName}`);
    const savedHighlights = localStorage.getItem(`pdf-highlights-${fileName}`);
    const savedNotes = localStorage.getItem(`pdf-notes-${fileName}`);
    const savedPage = localStorage.getItem(`pdf-page-${fileName}`);

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPage) setCurrentPage(parseInt(savedPage));
  }, [fileName]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(`pdf-bookmarks-${fileName}`, JSON.stringify(bookmarks));
    localStorage.setItem(`pdf-highlights-${fileName}`, JSON.stringify(highlights));
    localStorage.setItem(`pdf-notes-${fileName}`, JSON.stringify(notes));
    localStorage.setItem(`pdf-page-${fileName}`, currentPage.toString());
  }, [bookmarks, highlights, notes, currentPage, fileName]);

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

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const addBookmark = () => {
    const title = prompt('????? ??????? ????????:');
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
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const addNote = (x: number, y: number) => {
    const content = prompt('??? ??????:');
    if (content) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        page: currentPage,
        content,
        position: { x, y },
        timestamp: new Date(),
      };
      setNotes([...notes, newNote]);
      setIsAddingNote(false);
    }
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto',
          sidebarOpen ? 'w-80' : 'w-0'
        )}
      >
        {sidebarOpen && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">?????????</h3>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm',
                  activeTab === 'bookmarks'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                )}
              >
                ???????? ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm',
                  activeTab === 'notes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                )}
              >
                ????????? ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={cn(
                  'px-3 py-1.5 rounded text-sm',
                  activeTab === 'highlights'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                )}
              >
                ????????? ({highlights.length})
              </button>
            </div>

            {/* Content */}
            <div className="space-y-2">
              {activeTab === 'bookmarks' &&
                bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => goToPage(bookmark.page)}
                  >
                    <div>
                      <p className="font-medium text-sm">{bookmark.title}</p>
                      <p className="text-xs text-gray-500">???? {bookmark.page}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

              {activeTab === 'notes' &&
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2 bg-yellow-50 rounded hover:bg-yellow-100 cursor-pointer"
                    onClick={() => goToPage(note.page)}
                  >
                    <p className="text-sm mb-1">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">???? {note.page}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNote(note.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Menu className="w-4 h-4" />}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ???????
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />

              <Button
                size="sm"
                variant="outline"
                onClick={previousPage}
                disabled={currentPage <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <span className="text-sm px-2">
                ???? {currentPage} ?? {numPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={nextPage}
                disabled={currentPage >= numPages}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              <Button size="sm" variant="outline" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>

              <span className="text-sm px-2">{Math.round(scale * 100)}%</span>

              <Button size="sm" variant="outline" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<BookmarkPlus className="w-4 h-4" />}
                onClick={addBookmark}
              >
                ????? ??????
              </Button>

              <Button
                size="sm"
                variant={isAddingNote ? 'default' : 'outline'}
                leftIcon={<StickyNote className="w-4 h-4" />}
                onClick={() => setIsAddingNote(!isAddingNote)}
              >
                ??????
              </Button>

              <Button
                size="sm"
                variant={isHighlighting ? 'default' : 'outline'}
                leftIcon={<Highlighter className="w-4 h-4" />}
                onClick={() => setIsHighlighting(!isHighlighting)}
              >
                ?????
              </Button>

              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={downloadPDF}
              >
                ?????
              </Button>
            </div>
          </div>
        </div>

        {/* PDF Display */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-gray-100 flex justify-center items-start p-8"
        >
          <div className="shadow-2xl">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">???? ????? ???????...</p>
                  </div>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
