import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Mentor {
  id: string;
  username: string;
  experience: number;
  expertise: string[];
  availability: string;
  bio: string;
  rating: number;
}

export default function FindMentor() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');

  useEffect(() => {
    // TODO: Implement mentor fetching
    const fetchMentors = async () => {
      try {
        // const response = await apiClient.api.mentorsList();
        // setMentors(response.data);
        // Mock data for now
        setMentors([
          {
            id: '1',
            username: 'mentor1',
            experience: 5,
            expertise: ['JavaScript', 'React', 'TypeScript'],
            availability: '2 часа в неделю',
            bio: 'Опытный разработчик с 5-летним стажем',
            rating: 4.8
          },
          {
            id: '2',
            username: 'mentor2',
            experience: 3,
            expertise: ['Python', 'Django', 'SQL'],
            availability: '3 часа в неделю',
            bio: 'Специалист по бэкенд-разработке',
            rating: 4.5
          }
        ]);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = !selectedExpertise || mentor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const allExpertise = Array.from(new Set(mentors.flatMap(m => m.expertise)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Найти ментора
        </h1>

        <div className={`rounded-lg shadow-md p-6 mb-8
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Поиск по имени или описанию"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-grow px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
            />
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-${theme}
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark' 
                  : 'border-gray-300 text-text-light'}`}
            >
              <option value="">Все области</option>
              {allExpertise.map(expertise => (
                <option key={expertise} value={expertise}>{expertise}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <div key={mentor.id} className={`rounded-lg shadow-md p-6
                  ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold
                      ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                      {mentor.username}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-sm
                      ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                      {mentor.rating} ★
                    </div>
                  </div>
                  
                  <div className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p className="mb-2">
                      <span className="font-medium">Опыт:</span> {mentor.experience} лет
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Доступность:</span> {mentor.availability}
                    </p>
                    <div className="mb-2">
                      <span className="font-medium">Навыки:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mentor.expertise.map(skill => (
                          <span key={skill} className={`px-2 py-1 rounded-full text-sm
                            ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mentor.bio}
                  </p>

                  <button
                    className={`w-full py-2 rounded-lg text-white transition-colors
                      ${theme === 'dark' 
                        ? 'bg-primary-dark hover:bg-blue-500' 
                        : 'bg-primary hover:bg-blue-700'}`}
                  >
                    Связаться
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