import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { apiClient } from '../services/apiClient';
import { MentorDto, ProgrammingLanguage } from '../services/api.generated';
import { getLanguageLabel, getMentorAvailabilityLabel } from '../utils/enumHelpers';
import { notify, handleApiError } from '../utils/notifications';

export default function FindMentor() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<MentorDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<ProgrammingLanguage[]>([]);
  const [tempSelectedLanguages, setTempSelectedLanguages] = useState<ProgrammingLanguage[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [isRequesting, setIsRequesting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Загрузка всех менторов при первой загрузке страницы
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Отправляем пустой массив для получения всех менторов
        const response = await apiClient.mentoring([]);
        setMentors(response || []);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setError('Ошибка при загрузке списка менторов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Синхронизация временного состояния с выбранным
  useEffect(() => {
    setTempSelectedLanguages(selectedLanguages);
  }, [selectedLanguages]);

  // Обработчик изменения языков программирования
  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setTempSelectedLanguages(prev => {
      if (prev.includes(lang)) {
        return prev.filter(l => l !== lang);
      } else {
        return [...prev, lang];
      }
    });
  };

  // Обработчик отправки запроса на бэкенд
  const handleApplyLanguageFilter = async () => {
    try {
      console.log('Отправка запроса с языками:', tempSelectedLanguages);
      setIsLoading(true);
      setError(null);
      
      // Отправляем массив языков в теле POST запроса
      const response = await apiClient.mentoring(tempSelectedLanguages);
      console.log('Получен ответ:', response);
      
      setMentors(response || []);
      setSelectedLanguages([...tempSelectedLanguages]);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setError('Ошибка при загрузке списка менторов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async (mentorId: number) => {
    if (!user) {
      notify.warning('Please login to contact a mentor');
      return;
    }

    try {
      setIsRequesting(mentorId);
      await apiClient.mentorRequest(mentorId);
      notify.success('Request sent successfully! The mentor will contact you soon.');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsRequesting(null);
    }
  };

  // Фильтрация менторов на фронтенде
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.about?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesRating = (mentor.rating || 0) >= minRating;
    const matchesExperience = (mentor.experience || 0) >= minExperience;
    return matchesSearch && matchesRating && matchesExperience;
  });

  const allLanguages = Object.values(ProgrammingLanguage).filter(
    (value) => typeof value === 'number'
  ) as ProgrammingLanguage[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">
          Find a Mentor
        </h1>

        <div className={`rounded-lg shadow-md p-6 mb-8
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Поиск и фильтры рейтинга/опыта */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark' 
                    : 'border-gray-300 text-text-light'}`}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg border
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700' 
                    : 'bg-white border-gray-300'}`}>
                  <div className="font-medium mb-2">Minimum rating:</div>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                      ${theme === 'dark' 
                        ? 'bg-background-dark border-gray-700 text-text-dark' 
                        : 'border-gray-300 text-text-light'}`}
                  />
                </div>

                <div className={`p-3 rounded-lg border
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700' 
                    : 'bg-white border-gray-300'}`}>
                  <div className="font-medium mb-2">Minimum experience (years):</div>
                  <input
                    type="number"
                    min="0"
                    value={minExperience}
                    onChange={(e) => setMinExperience(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                      ${theme === 'dark' 
                        ? 'bg-background-dark border-gray-700 text-text-dark' 
                        : 'border-gray-300 text-text-light'}`}
                  />
                </div>
              </div>
            </div>

            {/* Фильтр по языкам */}
            <div className={`p-3 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-background-dark border-gray-700' 
                : 'bg-white border-gray-300'}`}>
              <div className="font-medium mb-2">Programming Languages:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {allLanguages.map(lang => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSelectedLanguages.includes(lang)}
                      onChange={() => handleLanguageChange(lang)}
                      className={`rounded focus:ring-2 focus:ring-primary-${theme}
                        ${theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-primary-dark' 
                          : 'bg-white border-gray-300 text-primary'}`}
                    />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {getLanguageLabel(lang)}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleApplyLanguageFilter}
                className={`w-full py-2 rounded-lg text-white transition-colors
                  ${theme === 'dark' 
                    ? 'bg-primary-dark hover:bg-blue-500' 
                    : 'bg-primary hover:bg-blue-700'}`}
              >
                Apply filter
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-4 mb-6 rounded-lg
              ${theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Mentors not found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <div key={mentor.userId} className={`rounded-lg shadow-md p-6
                  ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
                  <Link 
                    to={`/user/${mentor.userId}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold
                        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                        ID: {mentor.userId}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-sm
                        ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        {mentor.rating?.toFixed(1) || '5.0'} ★
                      </div>
                    </div>
                    
                    <div className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="mb-2">
                        <span className="font-medium">Experience:</span> {mentor.experience || 0} {mentor.experience === 1 ? 'year' : 'years'}
                      </p>
                      <p className="mb-2">
                        <span className="font-medium">Availability:</span> {getMentorAvailabilityLabel(mentor.availability || 0)}
                      </p>
                      <div className="mb-2">
                        <span className="font-medium">Programming Languages:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {mentor.programmingLanguages?.map(lang => (
                            <span key={lang} className={`px-2 py-1 rounded-full text-sm
                              ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                              {getLanguageLabel(lang)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {mentor.about}
                    </p>
                  </Link>

                  <button
                    onClick={() => handleContact(mentor.id)}
                    disabled={isRequesting === mentor.userId}
                    className={`w-full py-2 rounded-lg text-white transition-colors
                      ${theme === 'dark' 
                        ? 'bg-primary-dark hover:bg-blue-500 disabled:bg-gray-700' 
                        : 'bg-primary hover:bg-blue-700 disabled:bg-gray-400'}`}
                  >
                    {isRequesting === mentor.userId ? 'Sending...' : 'Contact'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 