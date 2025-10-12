import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.js';
import logService from '../services/logService.js';
import { PDFService } from '../services/pdfService.js';

const SettingsToggle: React.FC<{ label: string; enabled: boolean; onToggle: () => void; 'aria-label': string }> = ({ label, enabled, onToggle, 'aria-label': ariaLabel }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-gray-200">{label}</span>
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled ? 'true' : 'false'}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary ${enabled ? 'bg-primary' : 'bg-gray-600'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

const SettingsPage: React.FC = () => {
  const { currentUser } = useUser();
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    registrations: true,
    submissions: true,
    highScores: false,
    examPublished: true,
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    itemsPerPage: 10,
    defaultDateRange: '30d',
  });
  
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setKnowledgeBase(localStorage.getItem('cmaKnowledgeBase') || '');
    setLastUpdated(localStorage.getItem('cmaKnowledgeBaseLastUpdated') || null);
  }, []);

  const handleNotificationToggle = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingPdf(true);
    setUploadStatus(null);
    
    try {
      const result = await PDFService.parsePDF(file);
      
      if (result.error) {
        // Check if it's a worker initialization error
        if (result.error.includes('worker') || result.error.includes('Failed to fetch')) {
          setUploadStatus({ 
            message: 'PDF processing failed due to worker initialization issues. Loading default CMA curriculum instead.', 
            type: 'error' 
          });
          
          // Automatically load the default CMA curriculum
          setTimeout(() => {
            fetch('/data/cmaP1Curriculum.txt')
              .then(response => response.text())
              .then(text => {
                setKnowledgeBase(text);
                setUploadStatus({ 
                  message: 'Successfully loaded default CMA P1 curriculum due to PDF processing issues.', 
                  type: 'success' 
                });
              })
              .catch(error => {
                setUploadStatus({ 
                  message: `Failed to load default curriculum: ${error.message}`, 
                  type: 'error' 
                });
              });
          }, 2000);
        } else {
          setUploadStatus({ message: `Error: ${result.error}`, type: 'error' });
        }
      } else {
        setKnowledgeBase(result.text);
        setUploadStatus({ 
          message: `Successfully parsed ${result.pageCount} pages from ${result.fileName}. Extracted ${result.text.length} characters.`, 
          type: 'success' 
        });
      }
    } catch (error: any) {
      console.error("Error parsing PDF:", error);
      setUploadStatus({ 
        message: `Failed to parse PDF: ${error.message || 'Unknown error'}. Loading default CMA curriculum instead.`, 
        type: 'error' 
      });
      
      // Automatically load the default CMA curriculum
      setTimeout(() => {
        fetch('/data/cmaP1Curriculum.txt')
          .then(response => response.text())
          .then(text => {
            setKnowledgeBase(text);
            setUploadStatus({ 
              message: 'Successfully loaded default CMA P1 curriculum due to PDF processing issues.', 
              type: 'success' 
            });
          })
          .catch(error => {
            setUploadStatus({ 
              message: `Failed to load default curriculum: ${error.message}`, 
              type: 'error' 
            });
          });
      }, 2000);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSave = () => {
    setIsSaving(true);
    const now = new Date().toLocaleString();
    localStorage.setItem('cmaKnowledgeBase', knowledgeBase);
    localStorage.setItem('cmaKnowledgeBaseLastUpdated', now);
    setLastUpdated(now);
    setTimeout(() => {
        logService.addLog(currentUser, 'UPDATE_SETTINGS', 'Saved application settings.');
        setIsSaving(false);
    }, 1000);
  };
  
  if (currentUser.role !== 'Admin') {
    return (
        <div className="text-center py-10 bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-400 text-shadow">Access Denied</h1>
            <p className="text-gray-200 mt-2">You do not have permission to view this page.</p>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white text-shadow mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Notification Settings */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-bold text-white text-shadow mb-4">Notification Preferences</h2>
          <div className="divide-y divide-white/10">
            <SettingsToggle
              label="New Student Registrations"
              enabled={notificationPrefs.registrations}
              onToggle={() => handleNotificationToggle('registrations')}
              aria-label="Toggle new student registration notifications"
            />
            <SettingsToggle
              label="Exam Submissions"
              enabled={notificationPrefs.submissions}
              onToggle={() => handleNotificationToggle('submissions')}
              aria-label="Toggle exam submission notifications"
            />
            <SettingsToggle
              label="High Score Alerts"
              enabled={notificationPrefs.highScores}
              onToggle={() => handleNotificationToggle('highScores')}
              aria-label="Toggle high score alert notifications"
            />
            <SettingsToggle
              label="New Exam Published"
              enabled={notificationPrefs.examPublished}
              onToggle={() => handleNotificationToggle('examPublished')}
              aria-label="Toggle new exam published notifications"
            />
          </div>
        </div>
        
        {/* Display Settings */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-bold text-white text-shadow mb-4">Display & Data</h2>
           <div className="space-y-4">
               <div>
                  <label htmlFor="items-per-page" className="block text-sm font-medium text-gray-200">Items per Page</label>
                  <select 
                    id="items-per-page"
                    value={displayPrefs.itemsPerPage}
                    onChange={(e) => setDisplayPrefs(p => ({...p, itemsPerPage: Number(e.target.value)}))}
                    className="mt-1 block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white"
                  >
                    <option className="text-black" value="10">10</option>
                    <option className="text-black" value="25">25</option>
                    <option className="text-black" value="50">50</option>
                  </select>
               </div>
                <div>
                  <label htmlFor="date-range" className="block text-sm font-medium text-gray-200">Default Date Range for Reports</label>
                  <select 
                    id="date-range"
                    value={displayPrefs.defaultDateRange}
                    onChange={(e) => setDisplayPrefs(p => ({...p, defaultDateRange: e.target.value}))}
                    className="mt-1 block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white"
                  >
                    <option className="text-black" value="7d">Last 7 Days</option>
                    <option className="text-black" value="30d">Last 30 Days</option>
                    <option className="text-black" value="90d">Last 90 Days</option>
                  </select>
               </div>
           </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <h2 className="text-xl font-semibold text-white">AI Knowledge Base (RAG)</h2>
              <button
                  onClick={handleUploadClick}
                  disabled={isParsingPdf}
                  className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 disabled:bg-gray-500"
              >
                  {isParsingPdf ? 'Processing...' : 'Upload PDF'}
              </button>
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                  aria-label="PDF Upload"
                />
            </div>
            <p className="text-gray-300 mb-4">
              Upload a PDF of the CMA curriculum, or paste the content directly below to provide context for the AI assistant.
            </p>
            {uploadStatus && (
              <div className={`p-3 rounded-md mb-4 text-sm ${uploadStatus.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {uploadStatus.message}
              </div>
            )}
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
              <h3 className="font-medium text-blue-300 mb-2">Alternative Method</h3>
              <p className="text-sm text-gray-300">
                If PDF upload fails, you can manually copy and paste the CMA curriculum content. 
                A comprehensive CMA P1 curriculum text file is available at: 
                <code className="block mt-1 p-2 bg-black/30 rounded text-xs">
                  c:\Users\mojah\Downloads\CMA\CMA.Web\ClientApp\data\cmaP1Curriculum.txt
                </code>
              </p>
              <p className="text-sm text-gray-300 mt-2">
                You can also use the pre-loaded curriculum data by clicking the button below:
              </p>
              <button
                onClick={() => {
                  fetch('/data/cmaP1Curriculum.txt')
                    .then(response => response.text())
                    .then(text => {
                      setKnowledgeBase(text);
                      setUploadStatus({ 
                        message: 'Successfully loaded CMA P1 curriculum from local data file.', 
                        type: 'success' 
                      });
                    })
                    .catch(error => {
                      setUploadStatus({ 
                        message: `Failed to load curriculum data: ${error.message}`, 
                        type: 'error' 
                      });
                    });
                }}
                className="mt-2 bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-secondary/90"
              >
                Load CMA P1 Curriculum
              </button>
            </div>
            <textarea
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              placeholder="Paste your CMA syllabus/content here..."
              className="w-full h-96 p-3 bg-gray-900/50 border border-white/20 rounded-md text-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"
              aria-label="AI Knowledge Base Input"
            />
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>
                {lastUpdated ? `Last updated: ${lastUpdated}` : 'Not updated yet.'}
              </span>
              <span>
                {knowledgeBase.length.toLocaleString()} characters / {knowledgeBase.split(/\s+/).filter(Boolean).length.toLocaleString()} words
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <span className="font-bold">Privacy Note:</span> The content you upload is stored locally in your browser and is only used to provide context to the AI assistant. It is not sent to any external servers beyond the AI provider's API for processing your requests.
            </p>
          </div>
        
        <div className="flex justify-end mt-8">
            <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg disabled:bg-gray-500/50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;