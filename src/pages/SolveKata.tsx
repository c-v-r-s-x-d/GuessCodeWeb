import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, KataAnswerDto, KataSolveResultDto } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';

export default function SolveKata() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [kata, setKata] = useState<KataDto | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<KataSolveResultDto | null>(null);

  useEffect(() => {
    if (id) {
      loadKata(parseInt(id));
    }
  }, [id]);

  const loadKata = async (kataId: number) => {
    try {
      const response = await apiClient.api.kataSearchDetail(kataId);
      setKata(response.data);
    } catch (error) {
      console.error('Error loading kata:', error);
    }
  };

  const handleSubmit = async () => {
    if (!id || !selectedOption) return;

    try {
      const answer: KataAnswerDto = {
        kataId: parseInt(id),
        optionId: selectedOption
      };
      
      const response = await apiClient.api.kataSolveUpdate(answer);
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting solution:', error);
    }
  };

  if (!kata) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg shadow-md
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h1 className={`text-2xl font-bold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            {kata.title}
          </h1>
          
          <div className="flex gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm
              ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
              {getLanguageLabel(kata.programmingLanguage!)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm
              ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {getDifficultyLabel(kata.kataDifficulty!)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm
              ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
              {getKataTypeLabel(kata.kataType!)}
            </span>
          </div>

          <div className={`prose max-w-none mb-6
            ${theme === 'dark' ? 'prose-invert' : ''}`}>
            {kata.kataRawJsonContent?.kataDescription}
          </div>

          <div className="space-y-4">
            {kata.kataRawJsonContent?.answerOptions?.map((option) => (
              <button
                key={option.optionId}
                onClick={() => setSelectedOption(option.optionId!)}
                className={`w-full p-4 text-left rounded-lg border transition-colors
                  ${selectedOption === option.optionId
                    ? theme === 'dark' 
                      ? 'bg-primary-dark text-white'
                      : 'bg-primary text-white'
                    : theme === 'dark'
                      ? 'bg-surface-dark hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
              >
                {option.option}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`mt-6 w-full py-3 rounded-lg font-semibold text-white
              ${theme === 'dark'
                ? 'bg-primary-dark hover:bg-blue-500'
                : 'bg-primary hover:bg-blue-700'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Submit Answer
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg
              ${result.isAnswerCorrect
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'}`}>
              {result.isAnswerCorrect ? 'Correct!' : result.error || 'Incorrect answer'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 