import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();

  const linkClass = theme === 'dark' 
    ? 'text-gray-300 hover:text-primary-dark' 
    : 'text-gray-200 hover:text-primary';

  return (
    <nav className={`shadow-md transition-colors duration-200 backdrop-blur-sm
      ${theme === 'dark' ? 'bg-surface-dark/80' : 'bg-surface-light/50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-10">
          <Link to="/" className={`font-bold text-base ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            GuessCode
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/about" className={`text-sm ${linkClass}`}>
              About
            </Link>
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
                <div className="relative group">
                  <button 
                    className={`flex items-center gap-2 text-sm ${linkClass} py-1`}
                  >
                    <img 
                      src={user?.avatarUrl || '/default-avatar.png'}
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
                      top: 'calc(100% - 5px)',
                      padding: '5px 0'
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
      </div>
    </nav>
  );
} 