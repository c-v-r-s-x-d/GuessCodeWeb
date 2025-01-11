import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { apiClient } from '../../services/apiClient';
import GitHubButton from './GitHubButton';

export default function LoginForm() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      const loginDto = {
        username: formData.username,
        password: formData.password
      };
      
      await login(loginDto);
      navigate('/');
    } catch (error) {
      setErrors(['Invalid credentials. Please try again.']);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-6
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Login
        </h2>
        
        {errors.length > 0 && (
          <div className="bg-red-900/20 text-red-500 p-4 rounded-lg mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium mb-1
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
              required
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white transition-colors
                ${theme === 'dark' 
                  ? 'bg-primary-dark hover:bg-blue-500' 
                  : 'bg-primary hover:bg-blue-700'}`}
            >
              Login
            </button>

            <div className={`relative flex items-center gap-3
              ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className="flex-grow h-px bg-current"></div>
              <span className="text-sm">or</span>
              <div className="flex-grow h-px bg-current"></div>
            </div>

            <GitHubButton 
              text="Continue with GitHub"
              onClick={() => {
                // TODO: Implement GitHub OAuth
                console.log('GitHub login clicked');
              }}
            />
          </div>
        </form>

        <div className={`mt-6 text-sm text-center space-y-2
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            <Link 
              to="/forgot-password"
              className={`hover:underline
                ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
            >
              Forgot your password?
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link 
              to="/register"
              className={`hover:underline font-medium
                ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 