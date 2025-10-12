import { syllabusData } from '../data/curriculum.js';
import { questionsBank } from '../data/questions.js';
import { examHistory } from '../data/examHistory.js';
import { ExamAttempt, Question } from '../types.js';

// AI-powered exam recommendation service
export class AIExamService {
  // Analyze student performance and recommend focus areas
  static analyzePerformance(studentId: string) {
    // Get student's exam history
    const studentExams = examHistory.filter(exam => exam.student_id === studentId);
    
    if (studentExams.length === 0) {
      // If no history, recommend all sections equally
      return this.getDefaultRecommendations();
    }
    
    // Calculate performance by section
    const sectionPerformance: { [key: string]: { total: number; count: number; average: number } } = {};
    
    // Initialize all sections
    syllabusData.forEach(unit => {
      unit.sections.forEach(section => {
        sectionPerformance[section.id] = { total: 0, count: 0, average: 0 };
      });
    });
    
    // Aggregate performance data
    studentExams.forEach(exam => {
      const examQuestions = questionsBank.filter(q => q.exam_id === exam.exam_id);
      
      examQuestions.forEach(question => {
        if (question.sectionId) {
          const sectionId = question.sectionId;
          if (!sectionPerformance[sectionId]) {
            sectionPerformance[sectionId] = { total: 0, count: 0, average: 0 };
          }
          
          // Calculate if the student got this question right (simplified logic)
          const isCorrect = exam.percentage >= 70; // Simplified assumption
          sectionPerformance[sectionId].total += isCorrect ? 1 : 0;
          sectionPerformance[sectionId].count += 1;
        }
      });
    });
    
    // Calculate averages
    Object.keys(sectionPerformance).forEach(sectionId => {
      if (sectionPerformance[sectionId].count > 0) {
        sectionPerformance[sectionId].average = 
          sectionPerformance[sectionId].total / sectionPerformance[sectionId].count;
      }
    });
    
    // Identify weak areas (performance < 70%)
    const weakAreas = Object.entries(sectionPerformance)
      .filter(([_, perf]) => perf.average < 0.7)
      .map(([sectionId, perf]) => ({
        sectionId,
        performance: perf.average,
        title: this.getSectionTitle(sectionId)
      }))
      .sort((a, b) => a.performance - b.performance);
    
    // Identify strong areas (performance >= 85%)
    const strongAreas = Object.entries(sectionPerformance)
      .filter(([_, perf]) => perf.average >= 0.85)
      .map(([sectionId, perf]) => ({
        sectionId,
        performance: perf.average,
        title: this.getSectionTitle(sectionId)
      }))
      .sort((a, b) => b.performance - a.performance);
    
    return {
      weakAreas,
      strongAreas,
      overallPerformance: this.calculateOverallPerformance(studentExams),
      recommendations: this.generateRecommendations(weakAreas, strongAreas)
    };
  }
  
  // Generate exam based on AI analysis
  static generateAdaptiveExam(studentId: string, questionCount: number = 50) {
    const analysis = this.analyzePerformance(studentId);
    
    // Weight sections based on performance
    // Weak areas get more questions, strong areas get fewer
    const sectionWeights: { [key: string]: number } = {};
    
    // Assign weights based on performance
    analysis.weakAreas.forEach(area => {
      sectionWeights[area.sectionId] = 1.5; // 50% more questions
    });
    
    analysis.strongAreas.forEach(area => {
      sectionWeights[area.sectionId] = 0.7; // 30% fewer questions
    });
    
    // Default weight for areas with no data
    syllabusData.forEach(unit => {
      unit.sections.forEach(section => {
        if (!(section.id in sectionWeights)) {
          sectionWeights[section.id] = 1.0; // Normal weight
        }
      });
    });
    
    // Generate questions based on weights
    const examQuestions: Question[] = [];
    const questionsPerSection: { [key: string]: number } = {};
    
    // Calculate questions per section
    const totalWeight = Object.values(sectionWeights).reduce((sum, weight) => sum + weight, 0);
    
    Object.entries(sectionWeights).forEach(([sectionId, weight]) => {
      questionsPerSection[sectionId] = Math.round((weight / totalWeight) * questionCount);
    });
    
    // Ensure we have exactly the requested number of questions
    let totalAllocated = Object.values(questionsPerSection).reduce((sum, count) => sum + count, 0);
    let diff = questionCount - totalAllocated;
    
    // Adjust allocation if needed
    if (diff !== 0) {
      const sections = Object.keys(questionsPerSection);
      sections.forEach((sectionId, index) => {
        if (diff > 0 && index < diff) {
          questionsPerSection[sectionId] += 1;
        } else if (diff < 0 && index < Math.abs(diff)) {
          questionsPerSection[sectionId] = Math.max(0, questionsPerSection[sectionId] - 1);
        }
      });
    }
    
    // Select questions for each section
    Object.entries(questionsPerSection).forEach(([sectionId, count]) => {
      if (count > 0) {
        const sectionQuestions = questionsBank.filter(q => q.sectionId === sectionId);
        // Shuffle and select questions
        const shuffled = [...sectionQuestions].sort(() => 0.5 - Math.random());
        examQuestions.push(...shuffled.slice(0, count));
      }
    });
    
    // Shuffle the final exam questions
    return examQuestions.sort(() => 0.5 - Math.random());
  }
  
  // Generate personalized study plan
  static generateStudyPlan(studentId: string) {
    const analysis = this.analyzePerformance(studentId);
    
    // Create study plan based on weak areas
    const studyPlan = {
      title: "Personalized Study Plan",
      description: "Focus on improving your weak areas while maintaining your strengths",
      weeks: 4,
      dailyHours: 2,
      focusAreas: analysis.weakAreas.map(area => ({
        sectionId: area.sectionId,
        title: area.title,
        priority: "High",
        recommendedHours: Math.round((1 - area.performance) * 20), // Hours based on weakness
        topics: this.getSectionTopics(area.sectionId)
      })),
      reviewAreas: analysis.strongAreas.map(area => ({
        sectionId: area.sectionId,
        title: area.title,
        priority: "Low",
        recommendedHours: Math.round(area.performance * 5), // Maintenance hours
        topics: this.getSectionTopics(area.sectionId)
      })),
      overallStrategy: this.generateStudyStrategy(analysis)
    };
    
    return studyPlan;
  }
  
  // Get AI-powered question recommendations
  static getQuestionRecommendations(studentId: string, sectionId: string, count: number = 10) {
    const analysis = this.analyzePerformance(studentId);
    
    // Find questions in the specified section
    const sectionQuestions = questionsBank.filter(q => q.sectionId === sectionId);
    
    // Sort questions by difficulty based on student performance
    const studentPerformance = analysis.overallPerformance;
    
    // If student is struggling, recommend easier questions
    // If student is doing well, recommend harder questions
    sectionQuestions.sort((a, b) => {
      if (studentPerformance < 70) {
        // Recommend easier questions first
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (studentPerformance >= 85) {
        // Recommend harder questions first
        const difficultyOrder = { 'hard': 1, 'medium': 2, 'easy': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else {
        // Mix of difficulties
        return 0.5 - Math.random();
      }
    });
    
    return sectionQuestions.slice(0, count);
  }
  
  // Private helper methods
  private static getDefaultRecommendations() {
    return {
      weakAreas: [],
      strongAreas: [],
      overallPerformance: 0,
      recommendations: [
        "Start with foundational topics in Financial Reporting",
        "Practice basic calculations in Cost Management",
        "Review fundamental concepts in Planning & Budgeting"
      ]
    };
  }
  
  private static getSectionTitle(sectionId: string) {
    for (const unit of syllabusData) {
      const section = unit.sections.find(s => s.id === sectionId);
      if (section) {
        return `${unit.title} - ${section.title}`;
      }
    }
    return `Section ${sectionId}`;
  }
  
  private static calculateOverallPerformance(exams: ExamAttempt[]) {
    if (exams.length === 0) return 0;
    const total = exams.reduce((sum, exam) => sum + exam.percentage, 0);
    return total / exams.length;
  }
  
  private static generateRecommendations(weakAreas: any[], strongAreas: any[]) {
    const recommendations = [];
    
    if (weakAreas.length > 0) {
      recommendations.push(`Focus on improving: ${weakAreas.map(a => a.title).join(', ')}`);
    }
    
    if (strongAreas.length > 0) {
      recommendations.push(`Continue practicing: ${strongAreas.map(a => a.title).join(', ')}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Maintain your current study schedule");
      recommendations.push("Practice with mixed difficulty questions");
    }
    
    return recommendations;
  }
  
  private static getSectionTopics(sectionId: string) {
    const section = syllabusData
      .flatMap(unit => unit.sections)
      .find(s => s.id === sectionId);
    
    if (section) {
      // Extract topics from section content
      const topics = section.content
        .split('\n')
        .filter(line => line.startsWith('**') && line.endsWith('**'))
        .map(line => line.replace(/\*\*/g, ''));
      return topics.slice(0, 3); // Return top 3 topics
    }
    
    return [`Topic 1 in ${sectionId}`, `Topic 2 in ${sectionId}`];
  }
  
  private static generateStudyStrategy(analysis: any) {
    if (analysis.overallPerformance < 60) {
      return "Focus intensive study on weak areas, spend 70% of time on improvement";
    } else if (analysis.overallPerformance < 80) {
      return "Balanced approach, 50% improvement, 30% maintenance, 20% new topics";
    } else {
      return "Advanced study, 30% improvement, 20% maintenance, 50% challenging topics";
    }
  }
}