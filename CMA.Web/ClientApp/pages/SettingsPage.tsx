import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.js';
import logService from '../services/logService.js';
import Tooltip from '../components/Tooltip.js';
import { PDFService } from '../services/pdfService.js';
import { toast } from 'react-hot-toast';

const InfoIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const SettingsToggle: React.FC<{
  label: string;
  enabled: boolean;
  onToggle: () => void;
  'aria-label': string;
  tooltip: string;
}> = ({ label, enabled, onToggle, 'aria-label': ariaLabel, tooltip }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center">
      <span className="text-gray-200">{label}</span>
      <Tooltip text={tooltip}>
        <div className="ml-2">
          <InfoIcon />
        </div>
      </Tooltip>
    </div>
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
    highScoreThreshold: 90,
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    itemsPerPage: 10,
    defaultDateRange: '30d',
  });

  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setKnowledgeBase(localStorage.getItem('cmaKnowledgeBase') || '');
    setLastUpdated(localStorage.getItem('cmaKnowledgeBaseLastUpdated') || null);
  }, []);

  const handleNotificationToggle = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus(null); // Clear previous status on new file selection
    }
  };

  const handleProcessPdf = async () => {
    if (!selectedFile) return;

    setIsParsingPdf(true);
    setUploadStatus(null);

    try {
      const result = await PDFService.parsePDF(selectedFile);

      if (result.error) {
        // Check if it's a worker initialization error
        if (result.error.includes('worker') || result.error.includes('Failed to fetch')) {
          setUploadStatus({
            message:
              'PDF processing failed due to worker initialization issues. Loading default CMA curriculum instead.',
            type: 'error',
          });

          // Automatically load the default CMA curriculum
          setTimeout(() => {
            fetch('/data/cmaP1Curriculum.txt')
              .then(response => response.text())
              .then(text => {
                setKnowledgeBase(text);
                const now = new Date().toLocaleString();
                setLastUpdated(now);
                localStorage.setItem('cmaKnowledgeBaseLastUpdated', now);
                setUploadStatus({
                  message:
                    'Successfully loaded default CMA P1 curriculum due to PDF processing issues.',
                  type: 'success',
                });
              })
              .catch(error => {
                setUploadStatus({
                  message: `Failed to load default curriculum: ${error.message}`,
                  type: 'error',
                });
              });
          }, 2000);
        } else {
          setUploadStatus({ message: `Error: ${result.error}`, type: 'error' });
        }
      } else {
        setKnowledgeBase(result.text);
        const now = new Date().toLocaleString();
        setLastUpdated(now);
        localStorage.setItem('cmaKnowledgeBaseLastUpdated', now);
        setUploadStatus({
          message: `Successfully parsed ${result.pageCount} pages from ${result.fileName}. Extracted ${result.text.length} characters.`,
          type: 'success',
        });
      }
    } catch (error: unknown) {
      console.error('Error parsing PDF:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setUploadStatus({
        message: `Failed to parse PDF: ${message}. Loading default CMA curriculum instead.`,
        type: 'error',
      });

      // Automatically load the default CMA curriculum
      setTimeout(() => {
        fetch('/data/cmaP1Curriculum.txt')
          .then(response => response.text())
          .then(text => {
            setKnowledgeBase(text);
            const now = new Date().toLocaleString();
            setLastUpdated(now);
            localStorage.setItem('cmaKnowledgeBaseLastUpdated', now);
            setUploadStatus({
              message:
                'Successfully loaded default CMA P1 curriculum due to PDF processing issues.',
              type: 'success',
            });
          })
          .catch((error: unknown) => {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            setUploadStatus({
              message: `Failed to load default curriculum: ${msg}`,
              type: 'error',
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
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  const handleReset = () => {
    setNotificationPrefs({
      registrations: true,
      submissions: true,
      highScores: false,
      examPublished: true,
      highScoreThreshold: 90,
    });
    setDisplayPrefs({
      itemsPerPage: 10,
      defaultDateRange: '30d',
    });
    logService.addLog(currentUser, 'RESET_SETTINGS', 'Reset settings to default.');
    toast('Settings have been reset to their default values.');
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
        <div className="bg-surface/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-lg">
          <h2 className="text-xl font-bold text-white text-shadow mb-4">
            Notification Preferences
          </h2>
          <div className="divide-y divide-white/10">
            <SettingsToggle
              label="New Student Registrations"
              enabled={notificationPrefs.registrations}
              onToggle={() => handleNotificationToggle('registrations')}
              aria-label="Toggle new student registration notifications"
              tooltip="Receive a notification every time a new student registers in the system."
            />
            <SettingsToggle
              label="Exam Submissions"
              enabled={notificationPrefs.submissions}
              onToggle={() => handleNotificationToggle('submissions')}
              aria-label="Toggle exam submission notifications"
              tooltip="Get notified when a student submits an exam for evaluation."
            />
            <SettingsToggle
              label="High Score Alerts"
              enabled={notificationPrefs.highScores}
              onToggle={() => handleNotificationToggle('highScores')}
              aria-label="Toggle high score alert notifications"
              tooltip={`Receive an alert when a student achieves a score above ${notificationPrefs.highScoreThreshold}%.`}
            />
            <div className="pl-8 py-3">
              <label
                htmlFor="high-score-threshold"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                High Score Threshold: {notificationPrefs.highScoreThreshold}%
              </label>
              <input
                id="high-score-threshold"
                type="range"
                min="50"
                max="100"
                value={notificationPrefs.highScoreThreshold}
                onChange={e =>
                  setNotificationPrefs(p => ({
                    ...p,
                    highScoreThreshold: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!notificationPrefs.highScores}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <SettingsToggle
              label="New Exam Published"
              enabled={notificationPrefs.examPublished}
              onToggle={() => handleNotificationToggle('examPublished')}
              aria-label="Toggle new exam published notifications"
              tooltip="Get notified when a new exam is published and made available to students."
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-surface/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-lg">
          <h2 className="text-xl font-bold text-white text-shadow mb-4">Display & Data</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <label htmlFor="items-per-page" className="block text-sm font-medium text-gray-200">
                  Items per Page
                </label>
                <Tooltip text="Set the default number of items to display in tables and lists throughout the application.">
                  <div className="ml-2">
                    <InfoIcon />
                  </div>
                </Tooltip>
              </div>
              <select
                id="items-per-page"
                value={displayPrefs.itemsPerPage}
                onChange={e =>
                  setDisplayPrefs(p => ({ ...p, itemsPerPage: Number(e.target.value) }))
                }
                className="mt-1 block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-lg text-white transition-all duration-200"
              >
                <option className="text-black" value="10">
                  10
                </option>
                <option className="text-black" value="25">
                  25
                </option>
                <option className="text-black" value="50">
                  50
                </option>
              </select>
            </div>
            <div>
              <div className="flex items-center">
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-200">
                  Default Date Range for Reports
                </label>
                <Tooltip text="Choose the default time period for analytics and reporting dashboards.">
                  <div className="ml-2">
                    <InfoIcon />
                  </div>
                </Tooltip>
              </div>
              <select
                id="date-range"
                value={displayPrefs.defaultDateRange}
                onChange={e => setDisplayPrefs(p => ({ ...p, defaultDateRange: e.target.value }))}
                className="mt-1 block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-lg text-white transition-all duration-200"
              >
                <option className="text-black" value="7d">
                  Last 7 Days
                </option>
                <option className="text-black" value="30d">
                  Last 30 Days
                </option>
                <option className="text-black" value="90d">
                  Last 90 Days
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="bg-surface/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-3 mb-4 gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">AI Knowledge Base (RAG)</h2>
              <Tooltip text="Provide the AI assistant with context by uploading a PDF of the curriculum or pasting the content directly. This enables Retrieval-Augmented Generation (RAG) for more accurate, context-aware answers.">
                <div className="ml-2">
                  <InfoIcon />
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {selectedFile && !isParsingPdf && (
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-gray-300 truncate max-w-xs">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={handleProcessPdf}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Load
                  </button>
                </div>
              )}
              <button
                onClick={handleUploadClick}
                disabled={isParsingPdf}
                className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg hover:bg-secondary-dark disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isParsingPdf ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Upload PDF'
                )}
              </button>
            </div>
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
            Upload a PDF of the CMA curriculum, or paste the content directly below to provide
            context for the AI assistant.
          </p>
          {uploadStatus && (
            <div
              className={`p-3 rounded-lg mb-4 text-sm ${uploadStatus.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
            >
              {uploadStatus.message}
            </div>
          )}
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="font-medium text-blue-300 mb-2">Alternative Method</h3>
            <p className="text-sm text-gray-300">
              If PDF upload fails, you can manually copy and paste the CMA curriculum content. A
              comprehensive CMA P1 curriculum text file is available at:
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
                    const now = new Date().toLocaleString();
                    setLastUpdated(now);
                    localStorage.setItem('cmaKnowledgeBaseLastUpdated', now);
                    setUploadStatus({
                      message: 'Successfully loaded CMA P1 curriculum from local data file.',
                      type: 'success',
                    });
                  })
                  .catch((error: unknown) => {
                    const msg = error instanceof Error ? error.message : 'Unknown error';
                    setUploadStatus({
                      message: `Failed to load curriculum data: ${msg}`,
                      type: 'error',
                    });
                  });
              }}
              className="mt-2 bg-secondary hover:bg-secondary/90 text-white px-3 py-1.5 rounded text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              Load CMA P1 Curriculum
            </button>
          </div>
          <textarea
            value={knowledgeBase}
            onChange={e => setKnowledgeBase(e.target.value)}
            placeholder="Paste your CMA syllabus/content here..."
            className="w-full h-96 p-4 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 resize-none"
            aria-label="AI Knowledge Base Input"
          />
          <div className="text-xs text-gray-400 mt-2 flex flex-wrap justify-between gap-2">
            <span>{lastUpdated ? `Last updated: ${lastUpdated}` : 'Not updated yet.'}</span>
            <span>
              {knowledgeBase.length.toLocaleString()} characters /{' '}
              {knowledgeBase.split(/\s+/).filter(Boolean).length.toLocaleString()} words
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            <span className="font-bold">Privacy Note:</span> The content you upload is stored
            locally in your browser and is only used to provide context to the AI assistant. It is
            not sent to any external servers beyond the AI provider&apos;s API for processing your
            requests.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors shadow-lg disabled:bg-gray-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
