import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.js';
import DashboardPage from './pages/DashboardPage.js';
import StudentsPage from './pages/StudentsPage.js';
import ExamsPage from './pages/ExamsPage.js';
import QuestionsPage from './pages/QuestionsPage.js';
import ResultsPage from './pages/ResultsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import AuditLogPage from './pages/AuditLogPage.js';
import CurriculumPage from './pages/CurriculumPage.js';
import AchievementsPage from './pages/AchievementsPage.js';
import { UserProvider } from './contexts/UserContext.js';
import { StudentProfilePage } from './pages/StudentProfilePage.js';
import AnalyticsPage from './pages/AnalyticsPage.js';
import TakeExamPage from './pages/TakeExamPage.js';
import ExamSimulationPage from './pages/ExamSimulationPage.js';
import AIDashboardPage from './pages/AIDashboardPage.js';

function App() {
  return (
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
          </Route>
        </Routes>
      </HashRouter>
    </UserProvider>
  );
}

export default App;