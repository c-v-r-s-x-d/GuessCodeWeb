import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Prism from 'prismjs';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Katas from './pages/Katas';
import CreateKata from './pages/CreateKata';
import SolveKata from './pages/SolveKata';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import UserProfile from './pages/UserProfile';
import BecomeMentor from './pages/BecomeMentor';
import FindMentor from './pages/FindMentor';
import AdminPanel from './pages/AdminPanel';

import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

const darkThemeStyles = {
  info: {
    background: '#2C2D31',
    color: '#E5E7EB',
    progressBar: '#4B5563'
  },
  error: {
    background: '#7F1D1D',
    color: '#FCA5A5',
    progressBar: '#991B1B'
  }
};

function AppContent() {
  const { theme } = useTheme();

  useEffect(() => {
    Prism.highlightAll();

    // Применяем кастомные стили для темной темы
    if (theme === 'dark') {
      const style = document.createElement('style');
      style.textContent = `
        .Toastify__toast--info {
          background: ${darkThemeStyles.info.background} !important;
          color: ${darkThemeStyles.info.color} !important;
        }
        .Toastify__toast--info .Toastify__progress-bar {
          background: ${darkThemeStyles.info.progressBar} !important;
        }
        .Toastify__toast--error {
          background: ${darkThemeStyles.error.background} !important;
          color: ${darkThemeStyles.error.color} !important;
        }
        .Toastify__toast--error .Toastify__progress-bar {
          background: ${darkThemeStyles.error.progressBar} !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [theme]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/challenges" element={
            <ProtectedRoute>
              <Katas />
            </ProtectedRoute>
          } />
          <Route path="/katas/create" element={
            <ProtectedRoute>
              <CreateKata />
            </ProtectedRoute>
          } />
          <Route path="/kata/:id" element={
            <ProtectedRoute>
              <SolveKata />
            </ProtectedRoute>
          } />
          <Route path="/become-mentor" element={
            <ProtectedRoute>
              <BecomeMentor />
            </ProtectedRoute>
          } />
          <Route path="/find-mentor" element={
            <ProtectedRoute>
              <FindMentor />
            </ProtectedRoute>
          } />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* 404 catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
