import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { apiClient } from '../services/apiClient';
import { MentorDto, ProgrammingLanguage, MentorAvailability } from '../services/api.generated';
import { getMentorAvailabilityLabel, getLanguageLabel } from '../utils/enumHelpers';
import { notify, handleApiError } from '../utils/notifications';

export default function BecomeMentor() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<MentorDto>>({
    experience: 0,
    programmingLanguages: [],
    availability: 0,
    about: '',
    userId: user.userId
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'programmingLanguages') {
      const languages = value.split(',').map(lang => Number(lang.trim()) as ProgrammingLanguage);
      setFormData(prev => ({ ...prev, programmingLanguages: languages }));
    } else if (name === 'experience') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'availability') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageChange = (language: ProgrammingLanguage) => {
    setFormData(prev => {
      const currentLanguages = prev.programmingLanguages || [];
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter(lang => lang !== language)
        : [...currentLanguages, language];
      return { ...prev, programmingLanguages: newLanguages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.mentorship(formData as MentorDto);
      notify.success('Your mentor application has been submitted successfully!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Become a Mentor
        </h1>

        <div className={`rounded-lg shadow-md p-6 mb-8
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Your Information
          </h2>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Tell us about your experience and skills to help other developers grow.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="experience" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Years of Experience
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
              <label className={`block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Programming Languages
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(ProgrammingLanguage)
                  .filter(value => typeof value === 'number')
                  .map(language => (
                    <div key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`lang-${language}`}
                        checked={formData.programmingLanguages?.includes(language as ProgrammingLanguage)}
                        onChange={() => handleLanguageChange(language as ProgrammingLanguage)}
                        className={`h-4 w-4 rounded
                          ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={`lang-${language}`}
                        className={`text-sm cursor-pointer
                          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {getLanguageLabel(language as ProgrammingLanguage)}
                      </label>
                    </div>
                  ))}
              </div>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose programming languages in which you can help others
              </p>
            </div>

            <div>
              <label htmlFor="availability" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                required
                disabled={isLoading}
              >
                {Object.values(MentorAvailability)
                  .filter(value => typeof value === 'number')
                  .map(value => (
                    <option key={value} value={value}>
                      {getMentorAvailabilityLabel(value as MentorAvailability)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label htmlFor="about" className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                About Yourself
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
                placeholder="Tell us about your experience and why you want to become a mentor"
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
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 