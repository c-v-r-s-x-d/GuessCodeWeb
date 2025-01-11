import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, ProgrammingLanguage, KataDifficulty, KataType } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CreateKata() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));

  const [formData, setFormData] = useState<KataDto>({
    title: '',
    programmingLanguage: ProgrammingLanguage.Value1,
    kataDifficulty: KataDifficulty.Value1,
    kataType: KataType.Value1,
    authorId: userId,
    kataJsonContent: {
      kataDescription: '',
      sourceCode: '',
      answerOptions: []
    }
  });

  const addAnswerOption = () => {
    const newOption = {
      optionId: (formData.kataJsonContent?.answerOptions?.length || 0) + 1,
      option: '',
      isCorrect: false
    };
    setFormData({
      ...formData,
      kataJsonContent: {
        ...formData.kataJsonContent,
        answerOptions: [...(formData.kataJsonContent?.answerOptions || []), newOption]
      }
    });
  };

  const removeAnswerOption = (optionId: number) => {
    setFormData({
      ...formData,
      kataJsonContent: {
        ...formData.kataJsonContent,
        answerOptions: formData.kataJsonContent?.answerOptions?.filter(opt => opt.optionId !== optionId)
      }
    });
  };

  const toggleCorrectAnswer = (optionId: number) => {
    setFormData({
      ...formData,
      kataJsonContent: {
        ...formData.kataJsonContent,
        answerOptions: formData.kataJsonContent?.answerOptions?.map(opt => ({
          ...opt,
          isCorrect: opt.optionId === optionId
        }))
      }
    });
  };

  const updateAnswerOption = (optionId: number, value: string) => {
    setFormData({
      ...formData,
      kataJsonContent: {
        ...formData.kataJsonContent,
        answerOptions: formData.kataJsonContent?.answerOptions?.map(opt =>
          opt.optionId === optionId ? { ...opt, option: value } : opt
        )
      }
    });
  };

  const validateForm = () => {
    const options = formData.kataJsonContent?.answerOptions || [];
    if (options.length < 2) {
      alert('Please add at least 2 answer options');
      return false;
    }
    if (!options.some(opt => opt.isCorrect)) {
      alert('Please mark at least one answer as correct');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await apiClient.api.kataAdministrationCreate(formData);
      navigate('/challenges');
    } catch (error) {
      console.error('Error creating kata:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className={`text-3xl font-bold mb-8 
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Create New Kata
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`p-6 rounded-lg shadow-md
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Difficulty
              </label>
              <select
                value={formData.kataDifficulty}
                onChange={(e) => setFormData({...formData, kataDifficulty: Number(e.target.value) as KataDifficulty})}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
              >
                {Object.entries(KataDifficulty)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {getDifficultyLabel(Number(key) as KataDifficulty)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Programming Language
              </label>
              <select
                value={formData.programmingLanguage}
                onChange={(e) => setFormData({...formData, programmingLanguage: Number(e.target.value) as ProgrammingLanguage})}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
              >
                {Object.entries(ProgrammingLanguage)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {getLanguageLabel(Number(key) as ProgrammingLanguage)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (Markdown supported)
              </label>
              <textarea
                value={formData.kataJsonContent.kataDescription}
                onChange={(e) => setFormData({...formData, kataJsonContent: {...formData.kataJsonContent, kataDescription: e.target.value}})}
                rows={6}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Initial Code
              </label>
              <textarea
                value={formData.kataJsonContent.sourceCode}
                onChange={(e) => setFormData({...formData, kataJsonContent: {...formData.kataJsonContent, sourceCode: e.target.value}})}
                rows={8}
                className={`w-full px-3 py-2 rounded-lg font-mono focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Answer Options
              </label>
              <div className="space-y-3">
                {formData.kataJsonContent?.answerOptions?.map((option) => (
                  <div key={option.optionId} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCorrectAnswer(option.optionId!)}
                      className={`p-2 rounded-full transition-colors
                        ${option.isCorrect 
                          ? 'text-green-500 hover:text-green-600' 
                          : 'text-gray-400 hover:text-gray-500'}`}
                    >
                      <CheckCircleIcon className="w-6 h-6" />
                    </button>
                    <input
                      type="text"
                      value={option.option}
                      onChange={(e) => updateAnswerOption(option.optionId!, e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                        ${theme === 'dark' 
                          ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                          : 'border-gray-300 text-text-light focus:ring-primary'}`}
                      placeholder="Enter answer option"
                    />
                    <button
                      type="button"
                      onClick={() => removeAnswerOption(option.optionId!)}
                      className="p-2 text-red-500 hover:text-red-600 rounded-full"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAnswerOption}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                    ${theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Answer Option
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-semibold
            ${theme === 'dark' 
              ? 'bg-primary-dark hover:bg-blue-500' 
              : 'bg-primary hover:bg-blue-700'}`}
        >
          Create Kata
        </button>
      </form>
    </div>
  );
} 