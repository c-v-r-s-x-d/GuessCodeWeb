import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
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

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
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
              <Route path="/user/:userId" element={<UserProfile />} />

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
