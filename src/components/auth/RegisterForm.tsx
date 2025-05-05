import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GitHubButton from './GitHubButton';
import TelegramButton from './TelegramButton';
import LoadingSpinner from '../common/LoadingSpinner';
import { RegisterDto } from '../../services/api.generated';

export default function RegisterForm() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match']);
      setIsLoading(false);
      return;
    }

    try {
      const registerDto = new RegisterDto({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      await register(registerDto);
      navigate('/');
    } catch (error) {
      setErrors(['Registration failed. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-6
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Register
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
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white transition-colors flex items-center justify-center
                ${theme === 'dark' 
                  ? 'bg-primary-dark hover:bg-blue-500' 
                  : 'bg-primary hover:bg-blue-700'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="text-white" />
              ) : (
                'Register'
              )}
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
              disabled={isLoading}
            />

            <TelegramButton 
              text="Continue with Telegram"
              onClick={() => {
                // TODO: Implement Telegram OAuth
                console.log('Telegram login clicked');
              }}
              disabled={isLoading}
            />
          </div>
        </form>

        <div className={`mt-6 text-sm text-center
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            Already have an account?{' '}
            <Link 
              to="/login"
              className={`hover:underline font-medium
                ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 