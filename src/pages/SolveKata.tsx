import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import { apiClient } from '../services/apiClient';
import { KataDto, KataAnswerDto, KataSolveResultDto } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel, getPrismLanguage } from '../utils/enumHelpers';
import { Link } from 'react-router-dom';

export default function SolveKata() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [kata, setKata] = useState<KataDto | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<KataSolveResultDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadKata(parseInt(id));
    }
  }, [id]);

  const loadKata = async (kataId: number) => {
    try {
      const response = await apiClient.api.kataSearchDetail(kataId);
      setKata(response.data);
      Prism.highlightAll();
    } catch (error) {
      console.error('Error loading kata:', error);
    }
  };

  const handleSubmit = async () => {
    if (!id || selectedOption === null) return;
    
    setIsSubmitting(true);
    try {
      const answer: KataAnswerDto = {
        kataId: parseInt(id),
        optionId: selectedOption
      };
      
      const response = await apiClient.api.kataSolveUpdate(answer);
      setResult(response.data);
      
      if (response.data.isAnswerCorrect) {
        alert('Правильный ответ!');
      } else {
        alert(response.data.error || 'Неправильный ответ. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Произошла ошибка при отправке ответа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!kata) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        {/* Kata Content */}
        <div>
          {/* Author, difficulty, language badges */}
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
            <Link 
              to={`/user/${kata.authorId}`}
              className={`px-3 py-1 rounded-full text-sm hover:underline
                ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}
            >
              by Author #{kata.authorId}
            </Link>
          </div>

          {/* Description */}
          <div className={`prose max-w-none mb-6 ${theme === 'dark' ? 'prose-invert' : ''}`}>
            {kata.kataJsonContent?.kataDescription}
          </div>

          {/* Source Code */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Source Code
            </h2>
            <pre className="relative rounded-lg p-4 overflow-x-auto font-mono text-sm select-none bg-[#272822]">
              <code className={`language-javascript block whitespace-pre`}>
                {kata.kataJsonContent?.sourceCode}
              </code>
            </pre>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-12">
            {kata.kataJsonContent?.answerOptions?.map((option) => (
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
            
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className={`w-full py-3 mt-6 rounded-lg text-white font-semibold transition-colors
                ${selectedOption === null || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-primary-dark hover:bg-blue-500'
                    : 'bg-primary hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>

        {/* Discussion Section - Now at bottom with divider */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-3xl mx-auto py-8">
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Discussion
            </h2>
            
            {/* Add Comment Form */}
            <div className="mb-6">
              <textarea
                placeholder="Add your comment..."
                rows={3}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
              />
              <button
                className={`mt-2 px-4 py-2 rounded-lg text-white text-sm
                  ${theme === 'dark'
                    ? 'bg-primary-dark hover:bg-blue-500'
                    : 'bg-primary hover:bg-blue-700'}`}
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg
                ${theme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                      User #123
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      2 hours ago
                    </span>
                  </div>
                </div>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  This is a sample comment. The actual comments will be implemented later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 