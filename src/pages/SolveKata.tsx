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
import { 
  KataDto, 
  KataCodeReadingAnswerDto, 
  KataCodeReadingSolveResultDto,
  KataBugFindingAnswerDto,
  KataBugFindingSolveResultDto,
  ResolvedKataDto,
  KataType
} from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';
import { Link } from 'react-router-dom';
import { notify, handleApiError } from '../utils/notifications';
import { KataReport } from '../components/KataReport';

export default function SolveKata() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [kata, setKata] = useState<KataDto | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [result, setResult] = useState<KataCodeReadingSolveResultDto | KataBugFindingSolveResultDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedKata, setResolvedKata] = useState<ResolvedKataDto | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadKata(parseInt(id));
      loadResolvedKata(parseInt(id));
    }
  }, [id]);

  const loadKata = async (kataId: number) => {
    try {
      const response = await apiClient.kataSearch(kataId);
      setKata(response);
      if (response.kataType !== KataType._1 && !resolvedKata) {
        setSourceCode(response.kataJsonContent?.sourceCode || '');
      }
      Prism.highlightAll();
    } catch (error) {
      console.error('Error loading kata:', error);
    }
  };

  const loadResolvedKata = async (kataId: number) => {
    try {
      const response = await apiClient.resolved(kataId);
      setResolvedKata(response);
      if (response.sourceCode) {
        setSourceCode(response.sourceCode);
      }
      if (response.isSuccess && response.selectedOptionId) {
        setCorrectOptionId(response.selectedOptionId);
      }
    } catch (error) {
      console.error('Error loading resolved kata:', error);
    }
  };

  const handleSubmit = async () => {
    if (!kata || !id) return;
    
    setIsSubmitting(true);
    try {
      if (kata.kataType === KataType._1) { // Code Reading
        if (!selectedOption) {
          throw new Error('Пожалуйста, выберите вариант ответа');
        }

        const answer = new KataCodeReadingAnswerDto();
        answer.kataId = parseInt(id);
        answer.optionId = selectedOption;
        const response = await apiClient.codeReading(answer);
        setResult(response);
        
        if (response.isAnswerCorrect) {
          notify.success('Congratulations! Your answer is correct!');
          setCorrectOptionId(selectedOption);
        } else {
          notify.warning(response.error || 'Неверный ответ. Попробуйте еще раз.');
        }
      } else { // Bug Finding или Code Optimization
        if (!sourceCode) {
          throw new Error('Пожалуйста, введите код решения');
        }

        const answer = new KataBugFindingAnswerDto();
        answer.kataId = parseInt(id);
        answer.sourceCode = sourceCode;
        const response = await apiClient.bugFinding(answer);
        setResult(response);
        
        if (response.isScheduled) {
          notify.success('Solution sent, please come back in a few minutes');
        } else {
          notify.warning('Не удалось отправить решение на проверку');
        }
      }
    } catch (error) {
      handleApiError(error);
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
            <KataReport kataId={kata.id!} />
          </div>

          {/* Description */}
          <div className={`prose max-w-none mb-6 ${theme === 'dark' ? 'prose-invert' : ''}`}>
            {kata.kataJsonContent?.kataDescription}
          </div>

          {/* Source Code */}
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Source Code
            </h2>
            <pre className="relative rounded-lg p-4 overflow-x-auto font-mono text-sm select-none bg-[#272822]">
              <code className={`language-javascript block whitespace-pre`}>
                {kata.kataJsonContent?.sourceCode}
              </code>
            </pre>
          </div>

          {/* Solution Section */}
          {resolvedKata ? (
            <div className="space-y-6 mb-12">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                Your last solution
              </h2>
              
              {kata.kataType === KataType._1 ? (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className="mb-2">Selected option: {resolvedKata.selectedOptionId}</p>
                  <p>Points earned: {50/*resolvedKata.pointEarned*/}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <pre className="relative rounded-lg p-4 overflow-x-auto font-mono text-sm select-none bg-[#272822]">
                    <code className={`language-javascript block whitespace-pre`}>
                      {resolvedKata.sourceCode}
                    </code>
                  </pre>
                  {resolvedKata.executionOutput && (
                    <div className={`p-4 rounded-lg ${
                      resolvedKata.isSuccess 
                        ? theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'
                        : theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                    }`}>
                      <p className={`mb-2 ${
                        resolvedKata.isSuccess
                          ? theme === 'dark' ? 'text-green-300' : 'text-green-800'
                          : theme === 'dark' ? 'text-red-300' : 'text-red-800'
                      }`}>
                        Execution result:
                      </p>
                      <pre className="whitespace-pre-wrap">{resolvedKata.executionOutput}</pre>
                    </div>
                  )}
                  <p>Points earned: {resolvedKata.pointEarned + 50}</p>
                </div>
              )}

              {/* Показываем новое поле для ввода только если решение было неуспешным */}
              {!resolvedKata.isSuccess && kata.kataType !== KataType._1 && (
                <div className="mt-8">
                  <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                    Try again
                  </h2>
                  <div className="space-y-4">
                    <textarea
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      rows={10}
                      className={`w-full px-3 py-2 rounded-lg font-mono text-sm
                        ${theme === 'dark' 
                          ? 'bg-gray-800 text-gray-200 border-gray-700' 
                          : 'bg-white text-gray-800 border-gray-300'}`}
                      placeholder="Enter your new solution..."
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !sourceCode}
                      className={`w-full py-3 rounded-lg text-white font-semibold transition-colors
                        ${isSubmitting || !sourceCode
                          ? 'bg-gray-400 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-primary-dark hover:bg-blue-500'
                            : 'bg-primary hover:bg-blue-700'
                        }`}
                    >
                      {isSubmitting ? 'Pending...' : 'Submit new solution'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {kata.kataType === KataType._1 ? (
                // Code Reading - варианты ответов
                <div className="space-y-4">
                  {kata.kataJsonContent?.answerOptions?.map((option) => (
                    <button
                      key={option.optionId}
                      onClick={() => !correctOptionId && setSelectedOption(option.optionId!)}
                      className={`w-full p-4 text-left rounded-lg border transition-colors
                        ${selectedOption === option.optionId
                          ? theme === 'dark' 
                            ? 'bg-primary-dark text-white'
                            : 'bg-primary text-white'
                          : correctOptionId === option.optionId
                            ? theme === 'dark'
                              ? 'bg-green-900/30 text-green-300 border-green-500'
                              : 'bg-green-50 text-green-800 border-green-500'
                            : theme === 'dark'
                              ? 'bg-surface-dark hover:bg-gray-700'
                              : 'bg-white hover:bg-gray-50'
                        }`}
                      disabled={!!correctOptionId}
                    >
                      {option.option}
                      {correctOptionId === option.optionId && (
                        <span className="ml-2 text-sm">✓ Correct answer </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                // Bug Finding или Code Optimization - поле для ввода кода
                <div className="space-y-4">
                  <textarea
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    rows={10}
                    className={`w-full px-3 py-2 rounded-lg font-mono text-sm
                      ${theme === 'dark' 
                        ? 'bg-gray-800 text-gray-200 border-gray-700' 
                        : 'bg-white text-gray-800 border-gray-300'}`}
                    placeholder="Enter your solution..."
                  />
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (kata.kataType === KataType._1 ? (!selectedOption || !!correctOptionId) : !sourceCode)}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-colors
                  ${isSubmitting || (kata.kataType === KataType._1 ? (!selectedOption || !!correctOptionId) : !sourceCode)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-primary-dark hover:bg-blue-500'
                      : 'bg-primary hover:bg-blue-700'
                  }`}
              >
                {correctOptionId ? 'Kata resolved' : isSubmitting ? 'Pending...' : 'Submit solution'}
              </button>
            </div>
          )}

          {/* Result Section */}
          {result && !resolvedKata && (
            <div className={`p-4 rounded-lg mb-8
              ${kata.kataType === KataType._1 
                ? (result as KataCodeReadingSolveResultDto).isAnswerCorrect
                  ? theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'
                  : theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
                : (result as KataBugFindingSolveResultDto).isScheduled
                  ? theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'
                  : theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'
              }`}>
              <p className={`font-medium
                ${kata.kataType === KataType._1
                  ? (result as KataCodeReadingSolveResultDto).isAnswerCorrect
                    ? theme === 'dark' ? 'text-green-300' : 'text-green-800'
                    : theme === 'dark' ? 'text-red-300' : 'text-red-800'
                  : (result as KataBugFindingSolveResultDto).isScheduled
                    ? theme === 'dark' ? 'text-green-300' : 'text-green-800'
                    : theme === 'dark' ? 'text-red-300' : 'text-red-800'
                }`}>
                {kata.kataType === KataType._1
                  ? (result as KataCodeReadingSolveResultDto).isAnswerCorrect 
                    ? 'Поздравляем!' 
                    : 'Попробуйте еще раз'
                  : (result as KataBugFindingSolveResultDto).isScheduled
                    ? 'Решение отправлено на проверку'
                    : 'Не удалось отправить решение'
                }
              </p>
              {kata.kataType === KataType._1 && (result as KataCodeReadingSolveResultDto).error && (
                <p className={`mt-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {(result as KataCodeReadingSolveResultDto).error}
                </p>
              )}
              {kata.kataType === KataType._1 && (result as KataCodeReadingSolveResultDto).pointsEarned && (
                <p className={`mt-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Points earned: {50/*{(result as KataCodeReadingSolveResultDto).pointsEarned}*/}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 