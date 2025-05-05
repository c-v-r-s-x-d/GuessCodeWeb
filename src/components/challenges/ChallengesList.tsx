import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoadingState } from '../../hooks/useLoadingState';
import LoadingSpinner from '../common/LoadingSpinner';
import { KataDto } from '../../services/api.generated';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../context/ThemeContext';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../../utils/enumHelpers';

export default function ChallengesList() {
  const { theme } = useTheme();
  const { isLoading, error, executeWithLoading } = useLoadingState();
  const [challenges, setChallenges] = React.useState<KataDto[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const result = await executeWithLoading(apiClient.kataSearchAll(undefined, undefined, undefined));
      if (result) {
        setChallenges(result);
      }
    };

    fetchChallenges();
  }, [executeWithLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        {error.message}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <Link 
          key={challenge.title} 
          to={`/kata/${challenge.id}`}
          className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105
            ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}
        >
          <h3 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            {challenge.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.programmingLanguage && (
              <span className={`px-3 py-1 rounded-full text-sm
                ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                {getLanguageLabel(challenge.programmingLanguage)}
              </span>
            )}
            {challenge.kataDifficulty && (
              <span className={`px-3 py-1 rounded-full text-sm
                ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                {getDifficultyLabel(challenge.kataDifficulty)}
              </span>
            )}
            {challenge.kataType && (
              <span className={`px-3 py-1 rounded-full text-sm
                ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                {getKataTypeLabel(challenge.kataType)}
              </span>
            )}
          </div>

          <p className={`line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {challenge.kataJsonContent?.kataDescription}
          </p>
        </Link>
      ))}
    </div>
  );
} 