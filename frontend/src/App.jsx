import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import StudentDashboard from './pages/StudentDashboard';
import LearningPage from './pages/LearningPage';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseBuilder from './pages/CourseBuilder';
import InstructorGrading from './pages/InstructorGrading';
import InstructorAnalytics from './pages/InstructorAnalytics';
import AdminDashboard from './pages/AdminDashboard';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify/:certNumber" element={<CertificateVerifyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Student Portal */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/learn/:courseId" element={<LearningPage />} />

          {/* Instructor Studio */}
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/course/create" element={<CourseBuilder />} />
          <Route path="/instructor/course/:courseId/edit" element={<CourseBuilder />} />
          <Route path="/instructor/grading" element={<InstructorGrading />} />
          <Route path="/instructor/analytics" element={<InstructorAnalytics />} />

          {/* Admin Governance */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <AppContent />
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
