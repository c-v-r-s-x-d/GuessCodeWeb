import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BecomeMentor() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    experience: '',
    expertise: '',
    availability: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement mentor registration
    try {
      // await apiClient.api.mentorRegisterCreate(formData);
      console.log('Mentor registration submitted:', formData);
    } catch (error) {
      console.error('Error submitting mentor registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Стать ментором
        </h1>

        <div className={`rounded-lg shadow-md p-6 mb-8
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Информация о вас
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Расскажите о своем опыте и навыках, чтобы помочь другим разработчикам расти.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="experience" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Опыт работы (лет)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                required
                min="1"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="expertise" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Области экспертизы
              </label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                placeholder="Например: JavaScript, React, TypeScript"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="availability" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Доступность
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                placeholder="Например: 2 часа в неделю"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="bio" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                О себе
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                placeholder="Расскажите о своем опыте и почему вы хотите стать ментором"
                required
                disabled={isLoading}
              />
            </div>

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
                'Подать заявку'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 