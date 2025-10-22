import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { syllabusData } from '../data/curriculum.js';
import { questionsBank } from '../data/questions.js';
import { SyllabusSection } from '../types.js';

interface LayoutContext {
  openAssistant: (context?: string) => void;
}

const CurriculumSection: React.FC<{ section: SyllabusSection }> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openAssistant } = useOutletContext<LayoutContext>();

  const relatedQuestions = useMemo(
    () => questionsBank.filter(q => q.sectionId === section.id),
    [section.id]
  );

  const handleAskAI = () => {
    let contextString = section.content;
    if (relatedQuestions.length > 0) {
      const questionContext = relatedQuestions
        .map(
          q =>
            `Question: ${q.question_text}\nCorrect Answer: ${q.options ? q.options[q.correct_answer] : q.correct_answer}`
        )
        .join('\n\n');
      contextString += `\n\n--- RELEVANT QUESTIONS FROM KNOWLEDGE BASE ---\n${questionContext}`;
    }
    openAssistant(contextString);
  };

  const formattedContent = section.content
    .replace(/## (.*)/g, '') // Remove the title, as it's already in the header
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>')
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-900/50 px-1 py-0.5 rounded text-sm text-yellow-300">$1</code>'
    )
    .replace(/\n/g, '<br />');

  return (
    <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:border-white/30">
      <button
        className="w-full text-left px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded ? 'true' : 'false'}
        aria-controls={`section-content-${section.id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
            {section.id}
          </span>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-300 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div id={`section-content-${section.id}`} className="px-6 pb-6 space-y-4">
          {/* Content section with consistent typography */}
          <div
            className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Related Questions section with consistent styling */}
          {relatedQuestions.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-base font-semibold text-white">
                  Related Questions ({relatedQuestions.length})
                </h4>
              </div>
              <div className="space-y-3">
                {relatedQuestions.map(q => (
                  <div key={q.id} className="bg-black/20 border border-white/10 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-200 mb-2">{q.question_text}</p>
                    <p className="text-xs text-green-400 font-medium">
                      <span className="text-gray-400">Answer:</span>{' '}
                      {q.options
                        ? `${q.correct_answer}: ${q.options[q.correct_answer]}`
                        : q.correct_answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Assistant button with consistent styling */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleAskAI}
              className="w-full md:w-auto px-4 py-2 bg-secondary text-white text-sm font-semibold rounded-lg hover:bg-secondary-dark transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Ask AI about this section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CurriculumPage: React.FC = () => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const unit = syllabusData[selectedUnitIndex];

  // Calculate statistics
  const totalSections = unit.sections.length;
  const totalQuestions = useMemo(
    () =>
      unit.sections.reduce(
        (sum, section) => sum + questionsBank.filter(q => q.sectionId === section.id).length,
        0
      ),
    [unit]
  );

  return (
    <div className="space-y-6">
      {/* Page Header with consistent spacing */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white text-shadow">Study Library</h1>

        {/* Statistics with consistent styling */}
        <div className="flex gap-4">
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Total Topics</div>
            <div className="text-2xl font-bold text-white">{totalSections}</div>
          </div>
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Questions</div>
            <div className="text-2xl font-bold text-white">{totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Study Unit Selector with consistent styling */}
      <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4">
        <label htmlFor="unit-select" className="block text-sm font-medium text-gray-300 mb-2">
          Select Study Unit:
        </label>
        <select
          id="unit-select"
          value={selectedUnitIndex}
          onChange={e => setSelectedUnitIndex(parseInt(e.target.value))}
          className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-white"
        >
          {syllabusData.map((unit, index) => (
            <option key={unit.id} value={index} className="text-black bg-white">
              {unit.title} ({unit.weight})
            </option>
          ))}
        </select>
      </div>

      {/* Unit Information with consistent spacing */}
      <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white text-shadow mb-3">{unit.title}</h2>
        <p className="text-base text-gray-300 mb-4 leading-relaxed">{unit.description}</p>
        <div className="inline-block bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-semibold">
          Exam Weight: {unit.weight}
        </div>
      </div>

      {/* Sections with consistent spacing */}
      <div className="space-y-4">
        {unit.sections.map(section => (
          <CurriculumSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

export default CurriculumPage;
