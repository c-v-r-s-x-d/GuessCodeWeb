import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Prism from 'prismjs';
import { useEffect } from 'react';

// Pages
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

import 'prismjs/themes/prism-tomorrow.css'; // for dark theme
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

function App() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
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
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
