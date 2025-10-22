import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import ExamsPage from './pages/ExamsPage';
import QuestionsPage from './pages/QuestionsPage';
import ResultsPage from './pages/ResultsPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogPage from './pages/AuditLogPage';
import CurriculumPage from './pages/CurriculumPage';
import AchievementsPage from './pages/AchievementsPage';
import { UserProvider } from './contexts/UserContext';
import { StudentProfilePage } from './pages/StudentProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TakeExamPage from './pages/TakeExamPage';
import ExamSimulationPage from './pages/ExamSimulationPage';
import AIDashboardPage from './pages/AIDashboardPage';
import StudyLibraryPage from './pages/StudyLibraryPage';
import StudyMaterialViewerPage from './pages/StudyMaterialViewerPage';
import FlashcardsPage from './pages/FlashcardsPage';
import PracticeExamPage from './pages/PracticeExamPage';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="student/:studentId" element={<StudentProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="exams" element={<ExamsPage />} />
              <Route path="exam/:examId" element={<TakeExamPage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="curriculum" element={<CurriculumPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="audit-log" element={<AuditLogPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="exam-simulation" element={<ExamSimulationPage />} />
              <Route path="ai-dashboard" element={<AIDashboardPage />} />
              <Route path="study-library" element={<StudyLibraryPage />} />
              <Route path="study/:materialId" element={<StudyMaterialViewerPage />} />
              <Route path="flashcards/:materialId" element={<FlashcardsPage />} />
              <Route path="practice-exam/:materialId" element={<PracticeExamPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </UserProvider>
    </I18nextProvider>
  );
}

export default App;
