import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, ProgrammingLanguage, KataDifficulty, KataType } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';

export default function CreateKata() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<KataDto>({
    title: '',
    programmingLanguage: ProgrammingLanguage.Value1,
    kataDifficulty: KataDifficulty.Value1,
    kataType: KataType.Value1,
    kataRawJsonContent: {
      kataDescription: '',
      sourceCode: '',
      answerOptions: []
    }
  });

  const [answerOption, setAnswerOption] = useState({
    option: '',
    isCorrect: false
  });

  const addAnswerOption = () => {
    if (!answerOption.option) return;
    
    setFormData({
      ...formData,
      kataRawJsonContent: {
        ...formData.kataRawJsonContent,
        answerOptions: [
          ...(formData.kataRawJsonContent.answerOptions || []),
          {
            optionId: formData.kataRawJsonContent.answerOptions?.length || 0,
            option: answerOption.option,
            isCorrect: answerOption.isCorrect
          }
        ]
      }
    });
    
    setAnswerOption({ option: '', isCorrect: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.api.kataAdministrationCreate(formData);
      navigate('/katas');
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
                Description (Markdown supported)
              </label>
              <textarea
                value={formData.kataRawJsonContent.kataDescription}
                onChange={(e) => setFormData({...formData, kataRawJsonContent: {...formData.kataRawJsonContent, kataDescription: e.target.value}})}
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
                value={formData.kataRawJsonContent.sourceCode}
                onChange={(e) => setFormData({...formData, kataRawJsonContent: {...formData.kataRawJsonContent, sourceCode: e.target.value}})}
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
              <div className="space-y-2">
                {formData.kataRawJsonContent.answerOptions?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{option.option}</span>
                    {option.isCorrect && <span className="text-green-500">(Correct)</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={answerOption.option}
                  onChange={(e) => setAnswerOption({...answerOption, option: e.target.value})}
                  className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                    ${theme === 'dark' 
                      ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                      : 'border-gray-300 text-text-light focus:ring-primary'}`}
                  placeholder="Enter answer option"
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={answerOption.isCorrect}
                    onChange={(e) => setAnswerOption({...answerOption, isCorrect: e.target.checked})}
                  />
                  Correct
                </label>
                <button
                  type="button"
                  onClick={addAnswerOption}
                  className={`px-4 py-2 rounded-lg text-white
                    ${theme === 'dark' 
                      ? 'bg-primary-dark hover:bg-blue-500' 
                      : 'bg-primary hover:bg-blue-700'}`}
                >
                  Add
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