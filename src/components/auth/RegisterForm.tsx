import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../context/ThemeContext';
import GitHubButton from './GitHubButton';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    try {
      const registerDto = {
        email: formData.email,
        username: formData.username,
        password: formData.password
      };
      
      await apiClient.api.authRegisterCreate(registerDto);
      
      // After successful registration, login the user
      const loginDto = {
        username: formData.username,
        password: formData.password
      };
      
      await login(loginDto);
      navigate('/');
    } catch (error) {
      setErrors(['Registration failed. Please try again.']);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold text-center mb-6
          ${theme === 'dark' ? 'text-text-dark' : 'text-gray-900'}`}>
          Create Account
        </h2>
        
        {errors.length > 0 && (
          <div className="bg-red-900/20 text-red-500 p-4 rounded-lg mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['username', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label 
                htmlFor={field} 
                className={`block text-sm font-medium mb-1
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1).replace('Password', ' Password')}
              </label>
              <input
                type={field === 'password' || field === 'confirmPassword' ? 'password' : field === 'email' ? 'email' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                required
              />
            </div>
          ))}

          <div className="space-y-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white transition-colors
                ${theme === 'dark' 
                  ? 'bg-primary-dark hover:bg-blue-500' 
                  : 'bg-primary hover:bg-blue-700'}`}
            >
              Register
            </button>

            <div className={`relative flex items-center gap-3
              ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className="flex-grow h-px bg-current"></div>
              <span className="text-sm">or</span>
              <div className="flex-grow h-px bg-current"></div>
            </div>

            <GitHubButton 
              text="Sign up with GitHub"
              onClick={() => {
                // TODO: Implement GitHub OAuth
                console.log('GitHub signup clicked');
              }}
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