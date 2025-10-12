import React, { useState, useEffect } from 'react';
import { AIExamService } from '../services/aiExamService.js';
import { syllabusData } from '../data/curriculum.js';
import { questionsBank } from '../data/questions.js';
import { examHistory } from '../data/examHistory.js';

const AIDashboardPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('stud001');
  const [analysis, setAnalysis] = useState<any>(null);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState('');
  
  // Get unique students from exam history
  const students = Array.from(
    new Map(examHistory.map(attempt => [attempt.student_id, attempt.student_name]))
      .entries()
  ).map(([id, name]) => ({ id, name }));

  useEffect(() => {
    // Perform initial analysis
    const analysisResult = AIExamService.analyzePerformance(selectedStudent);
    const planResult = AIExamService.generateStudyPlan(selectedStudent);
    
    setAnalysis(analysisResult);
    setStudyPlan(planResult);
    
    // Get recommendations for the first weak area or first section
    if (analysisResult.weakAreas.length > 0) {
      const firstWeakArea = analysisResult.weakAreas[0].sectionId;
      setSelectedSection(firstWeakArea);
      const recommendations = AIExamService.getQuestionRecommendations(
        selectedStudent, 
        firstWeakArea, 
        5
      );
      setRecommendedQuestions(recommendations);
    } else if (syllabusData.length > 0 && syllabusData[0].sections.length > 0) {
      const firstSection = syllabusData[0].sections[0].id;
      setSelectedSection(firstSection);
      const recommendations = AIExamService.getQuestionRecommendations(
        selectedStudent, 
        firstSection, 
        5
      );
      setRecommendedQuestions(recommendations);
    }
  }, [selectedStudent]);

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    const recommendations = AIExamService.getQuestionRecommendations(
      selectedStudent, 
      sectionId, 
      5
    );
    setRecommendedQuestions(recommendations);
  };

  const getSectionTitle = (sectionId: string) => {
    for (const unit of syllabusData) {
      const section = unit.sections.find(s => s.id === sectionId);
      if (section) {
        return `${unit.title.substring(0, 10)}... - ${section.title.substring(0, 30)}...`;
      }
    }
    return `Section ${sectionId}`;
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-white text-shadow mb-6">AI Learning Dashboard</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full md:w-64 px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white"
        >
          {students.map(student => (
            <option key={student.id} value={student.id} className="text-black">
              {student.name}
            </option>
          ))}
        </select>
      </div>
      
      {analysis && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white text-shadow mb-4">Performance Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-white">{analysis.overallPerformance.toFixed(1)}%</div>
                  <div className="text-gray-300">Overall Score</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-400">{analysis.weakAreas.length}</div>
                  <div className="text-gray-300">Weak Areas</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-400">{analysis.strongAreas.length}</div>
                  <div className="text-gray-300">Strong Areas</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-red-400 mb-3">Areas Needing Improvement</h3>
                  {analysis.weakAreas.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.weakAreas.map((area: any, index: number) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                          <div className="flex justify-between">
                            <span className="text-white font-medium">{getSectionTitle(area.sectionId)}</span>
                            <span className="text-red-400">{(area.performance * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No weak areas identified</div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-green-400 mb-3">Strong Areas</h3>
                  {analysis.strongAreas.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.strongAreas.map((area: any, index: number) => (
                        <div key={index} className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                          <div className="flex justify-between">
                            <span className="text-white font-medium">{getSectionTitle(area.sectionId)}</span>
                            <span className="text-green-400">{(area.performance * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No strong areas identified yet</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white text-shadow mb-4">AI Recommendations</h2>
              <div className="space-y-3">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {studyPlan && (
            <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white text-shadow mb-4">Personalized Study Plan</h2>
              
              <div className="mb-4">
                <p className="text-gray-300">{studyPlan.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <span>{studyPlan.weeks} weeks</span>
                  <span className="mx-2">•</span>
                  <span>{studyPlan.dailyHours} hours/day</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-red-400 mb-3">Focus Areas</h3>
                  {studyPlan.focusAreas.map((area: any, index: number) => (
                    <div key={index} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                      <div className="font-medium text-white">{getSectionTitle(area.sectionId)}</div>
                      <div className="text-sm text-gray-300 mt-1">Priority: {area.priority}</div>
                      <div className="text-sm text-gray-300">Recommended: {area.recommendedHours} hours</div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium text-green-400 mb-3">Review Areas</h3>
                  {studyPlan.reviewAreas.map((area: any, index: number) => (
                    <div key={index} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-3">
                      <div className="font-medium text-white">{getSectionTitle(area.sectionId)}</div>
                      <div className="text-sm text-gray-300 mt-1">Priority: {area.priority}</div>
                      <div className="text-sm text-gray-300">Recommended: {area.recommendedHours} hours</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white text-shadow">AI-Powered Question Recommendations</h2>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="px-3 py-1 bg-white/10 border border-white/30 rounded-md text-white text-sm"
              >
                {syllabusData.flatMap(unit => 
                  unit.sections.map(section => (
                    <option key={section.id} value={section.id} className="text-black">
                      {unit.title.substring(0, 15)}... - {section.title.substring(0, 25)}...
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedQuestions.map((question, index) => (
                <div key={index} className="p-4 bg-white/10 border border-white/20 rounded-lg">
                  <div className="text-sm text-gray-300 mb-2">
                    {getSectionTitle(question.sectionId)}
                  </div>
                  <div className="text-white mb-3 text-sm">
                    {question.question_text.substring(0, 100)}...
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                      {question.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">
                      {question.marks} marks
                    </span>
                  </div>
                </div>
              ))}
              {recommendedQuestions.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-8">
                  No recommendations available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIDashboardPage;