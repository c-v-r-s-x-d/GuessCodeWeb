import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { apiClient } from '../../services/apiClient';
import { useState, useEffect } from 'react';
import { UserDto } from '../../services/api.generated';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.userId) {
        try {
          const currentUser = await apiClient.user(user.userId);
          setUserData(currentUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      return `${apiUrl}/static/${user.avatarUrl}`;
    }
    return '/default-avatar.png';
  };

  const linkClass = theme === 'dark' 
    ? 'text-gray-300 hover:text-primary-dark' 
    : 'text-gray-200 hover:text-primary';

  return (
    <nav className={`shadow-md transition-colors duration-200 backdrop-blur-sm
      ${theme === 'dark' ? 'bg-surface-dark/80' : 'bg-surface-light/50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="font-bold text-base text-white">
            GuessCode
          </Link>

          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Открыть меню"
            >
              {menuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/leaderboard" className={`text-sm ${linkClass}`}>
              Leaderboard
            </Link>
            <Link to="/faq" className={`text-sm ${linkClass}`}>
              FAQ
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/challenges" className={`text-sm ${linkClass}`}>
                  Challenges
                </Link>
                <Link to="/find-mentor" className={`text-sm ${linkClass}`}>
                  Find Mentor
                </Link>
                <Link to="/become-mentor" className={`text-sm ${linkClass}`}>
                  Become Mentor
                </Link>
                {userData?.roleId === 1 && (
                  <Link to="/admin" className={`text-sm ${linkClass}`}>
                    Administration
                  </Link>
                )}
                <div className="relative group">
                  <button 
                    className={`flex items-center gap-2 text-sm ${linkClass} py-1`}
                  >
                    <img 
                      src={getAvatarUrl()}
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{user?.username}</span>
                  </button>
                  
                  <div 
                    className={`absolute right-0 w-48 rounded-lg shadow-lg
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 ease-in-out transform
                      ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}
                    style={{ 
                      zIndex: 1000,
                      top: '100%',
                      marginTop: '0.5rem'
                    }}
                  >
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className={`block w-full text-left px-4 py-2 text-sm
                          ${theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={logout}
                        className={`block w-full text-left px-4 py-2 text-sm
                          ${theme === 'dark' 
                            ? 'text-red-400 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-gray-100'}`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
                <>
              <Link to="/login" className={`text-sm ${linkClass}`}>
                Login
              </Link>
                  <Link
                      to="/register"
                      className={`${theme === 'dark'
                          ? 'bg-primary-dark hover:bg-blue-500'
                          : 'bg-primary hover:bg-blue-700'} 
                    text-white px-2.5 py-1 rounded text-sm transition-colors`}
                  >
                    Register
                  </Link>
                </>
            )}
            <ThemeToggle />
          </div>
        </div>
        {menuOpen && (
          <div className={`md:hidden mt-2 flex flex-col gap-2 rounded-lg shadow-lg p-4 animate-fade-in z-50 transition-colors duration-200
            ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
            <Link to="/leaderboard" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/faq" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
              FAQ
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/challenges" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Challenges
                </Link>
                <Link to="/find-mentor" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Find Mentor
                </Link>
                <Link to="/become-mentor" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Become Mentor
                </Link>
                {userData?.roleId === 1 && (
                  <Link to="/admin" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                    Administration
                  </Link>
                )}
                <Link to="/profile" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className={`text-base text-left w-full ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} text-base`} onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 