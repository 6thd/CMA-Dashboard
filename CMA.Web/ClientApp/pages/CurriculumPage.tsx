import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { syllabusData } from '../data/curriculum.js';
import { questionsBank } from '../data/questions.js';
import { SyllabusSection, Question } from '../types.js';

interface LayoutContext {
  openAssistant: (context?: string) => void;
}

const CurriculumSection: React.FC<{ section: SyllabusSection }> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openAssistant } = useOutletContext<LayoutContext>();

  const relatedQuestions = useMemo(() => 
    questionsBank.filter(q => q.sectionId === section.id), 
    [section.id]
  );

  const handleAskAI = () => {
    let contextString = section.content;
    if (relatedQuestions.length > 0) {
      const questionContext = relatedQuestions.map(q => 
        `Question: ${q.question_text}\nCorrect Answer: ${q.options ? q.options[q.correct_answer] : q.correct_answer}`
      ).join('\n\n');
      contextString += `\n\n--- RELEVANT QUESTIONS FROM KNOWLEDGE BASE ---\n${questionContext}`;
    }
    openAssistant(contextString);
  };
  
  const formattedContent = section.content
    .replace(/## (.*)/g, '') // Remove the title, as it's already in the header
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>')
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-900/50 px-1 py-0.5 rounded text-sm text-yellow-300">$1</code>')
    .replace(/\n/g, '<br />');

  return (
    <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-lg rounded-lg overflow-hidden transition-all duration-300">
      <button
        className="w-full text-left px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-white/10"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${section.id}`}
      >
        <h3 className="text-lg font-semibold text-white text-shadow">{section.id}: {section.title}</h3>
        <svg className={`w-5 h-5 text-gray-300 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isExpanded && (
        <div id={`section-content-${section.id}`} className="px-6 pb-6 text-gray-200 divide-y divide-white/10">
          <div className="prose prose-invert prose-sm max-w-none pb-4" dangerouslySetInnerHTML={{ __html: formattedContent }} />
          
          {relatedQuestions.length > 0 && (
            <div className="pt-4">
              <h4 className="text-md font-bold text-white text-shadow mb-3">Related Questions</h4>
              <div className="space-y-3">
                {relatedQuestions.map(q => (
                  <div key={q.id} className="text-sm bg-black/20 p-3 rounded-md">
                    <p className="font-semibold text-gray-200">{q.question_text}</p>
                    <p className="text-green-400 mt-1 text-xs"><strong>Answer:</strong> {q.options ? `${q.correct_answer}: ${q.options[q.correct_answer]}` : q.correct_answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

           <div className="pt-4">
            <button 
                onClick={handleAskAI}
                className="px-3 py-1.5 bg-secondary text-white text-sm font-semibold rounded-md hover:bg-secondary-dark transition-colors shadow-md flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white text-shadow">CMA Part 1 Curriculum</h1>
      </div>
      
      {/* Study Unit Selector */}
      <div className="mb-6">
        <label htmlFor="unit-select" className="block text-sm font-medium text-gray-300 mb-2">
          Select Study Unit:
        </label>
        <select
          id="unit-select"
          value={selectedUnitIndex}
          onChange={(e) => setSelectedUnitIndex(parseInt(e.target.value))}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
        >
          {syllabusData.map((unit, index) => (
            <option key={unit.id} value={index}>
              {unit.title} ({unit.weight})
            </option>
          ))}
        </select>
      </div>
      
      {/* Unit Information */}
      <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-white text-shadow mb-3">{unit.title}</h2>
        <p className="text-gray-300 text-shadow mb-4">{unit.description}</p>
        <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
          Exam Weight: {unit.weight}
        </div>
      </div>
      
      {/* Sections */}
      <div className="space-y-4">
        {unit.sections.map(section => (
          <CurriculumSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

export default CurriculumPage;