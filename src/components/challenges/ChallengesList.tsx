import React, { useEffect, useState } from 'react';
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
  const [selectedKata, setSelectedKata] = useState<KataDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      const result = await executeWithLoading(apiClient.kataSearchAll(undefined, undefined, undefined));
      if (result) {
        setChallenges(result);
      }
    };

    fetchChallenges();
  }, [executeWithLoading]);

  const handleViewKata = (kata: KataDto) => {
    setSelectedKata(kata);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedKata(null);
  };

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
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <div 
            key={challenge.title} 
            className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer
              ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}
            onClick={() => handleViewKata(challenge)}
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
          </div>
        ))}
      </div>

      {isDialogOpen && selectedKata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-4xl w-full mx-4 rounded-lg shadow-xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg font-semibold
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {selectedKata.title}
                </h3>
                <button
                  onClick={handleCloseDialog}
                  className={`px-3 py-1 rounded-lg font-medium
                    ${theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  Закрыть
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedKata.programmingLanguage && (
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                      {getLanguageLabel(selectedKata.programmingLanguage)}
                    </span>
                  )}
                  {selectedKata.kataDifficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                      {getDifficultyLabel(selectedKata.kataDifficulty)}
                    </span>
                  )}
                  {selectedKata.kataType && (
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                      {getKataTypeLabel(selectedKata.kataType)}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className={`text-sm font-medium mb-2
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Описание:
                  </h4>
                  <p className={`text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedKata.kataJsonContent?.kataDescription}
                  </p>
                </div>

                {selectedKata.kataJsonContent?.sourceCode && (
                  <div>
                    <h4 className={`text-sm font-medium mb-2
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Исходный код:
                    </h4>
                    <pre className={`p-4 rounded-lg text-sm overflow-x-auto
                      ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
                      {selectedKata.kataJsonContent.sourceCode}
                    </pre>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Link
                    to={`/kata/${selectedKata.id}`}
                    className={`px-4 py-2 rounded-lg font-medium text-white
                      ${theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    Начать решение
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 