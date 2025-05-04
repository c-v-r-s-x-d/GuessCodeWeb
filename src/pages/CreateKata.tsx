import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, ProgrammingLanguage, KataDifficulty, KataType } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CodeReadingFormProps {
  formData: KataDto;
  setFormData: React.Dispatch<React.SetStateAction<KataDto>>;
  theme: string;
}

const CodeReadingForm: React.FC<CodeReadingFormProps> = ({ formData, setFormData, theme }) => {
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

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Initial Code
        </label>
        <textarea
          value={formData.kataJsonContent.sourceCode}
          onChange={(e) => setFormData({...formData, kataJsonContent: {...formData.kataJsonContent, sourceCode: e.target.value}})}
          rows={8}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
            ${theme === 'dark' 
              ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
              : 'border-gray-300 text-text-light focus:ring-primary'}`}
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={`block text-sm font-medium
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Answer Options
          </label>
          <button
            type="button"
            onClick={addAnswerOption}
            className={`px-3 py-1 rounded-lg text-sm
              ${theme === 'dark' 
                ? 'bg-primary-dark text-white hover:bg-primary-dark/90' 
                : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            <PlusIcon className="h-4 w-4 inline-block mr-1" />
            Add Option
          </button>
        </div>

        {formData.kataJsonContent.answerOptions?.map((option) => (
          <div key={option.optionId} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={option.option}
              onChange={(e) => updateAnswerOption(option.optionId, e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                  : 'border-gray-300 text-text-light focus:ring-primary'}`}
              required
            />
            <button
              type="button"
              onClick={() => toggleCorrectAnswer(option.optionId)}
              className={`p-2 rounded-lg
                ${option.isCorrect 
                  ? theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              <CheckCircleIcon className="h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => removeAnswerOption(option.optionId)}
              className={`p-2 rounded-lg
                ${theme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
            >
              <TrashIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BugFindingFormProps {
  formData: KataDto;
  setFormData: React.Dispatch<React.SetStateAction<KataDto>>;
  theme: string;
}

const BugFindingForm: React.FC<BugFindingFormProps> = ({ formData, setFormData, theme }) => {
  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData({
          ...formData,
          kataJsonContent: {
            ...formData.kataJsonContent,
            sourceCode: content
          }
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Initial Code
        </label>
        <textarea
          value={formData.kataJsonContent.sourceCode}
          onChange={(e) => setFormData({...formData, kataJsonContent: {...formData.kataJsonContent, sourceCode: e.target.value}})}
          rows={8}
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
          Test File (TXT)
        </label>
        <input
          type="file"
          accept=".txt"
          onChange={handleTestFileChange}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
            ${theme === 'dark' 
              ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
              : 'border-gray-300 text-text-light focus:ring-primary'}`}
          required
        />
      </div>
    </div>
  );
};

interface CodeOptimizationFormProps {
  formData: KataDto;
  setFormData: React.Dispatch<React.SetStateAction<KataDto>>;
  theme: string;
}

const CodeOptimizationForm: React.FC<CodeOptimizationFormProps> = ({ formData, setFormData, theme }) => {
  const [languages, setLanguages] = useState<{
    [key: number]: { timeLimit: number; memoryLimit: number }
  }>({});

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setLanguages(prev => {
      if (prev[lang]) {
        const newLanguages = { ...prev };
        delete newLanguages[lang];
        return newLanguages;
      } else {
        return {
          ...prev,
          [lang]: { timeLimit: 1000, memoryLimit: 256 }
        };
      }
    });
  };

  const handleLimitChange = (lang: ProgrammingLanguage, field: 'timeLimit' | 'memoryLimit', value: number) => {
    setLanguages(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormData({
          ...formData,
          kataJsonContent: {
            ...formData.kataJsonContent,
            testCases: content
          }
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Initial Code
        </label>
        <textarea
          value={formData.kataJsonContent.sourceCode}
          onChange={(e) => setFormData({...formData, kataJsonContent: {...formData.kataJsonContent, sourceCode: e.target.value}})}
          rows={8}
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
          Test File (TXT)
        </label>
        <input
          type="file"
          accept=".txt"
          onChange={handleTestFileChange}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
            ${theme === 'dark' 
              ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
              : 'border-gray-300 text-text-light focus:ring-primary'}`}
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Supported Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(ProgrammingLanguage).filter(lang => typeof lang === 'number').map((lang) => (
            <div key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`lang-${lang}`}
                checked={!!languages[lang as number]}
                onChange={() => handleLanguageChange(lang as ProgrammingLanguage)}
                className={`h-4 w-4 rounded
                  ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
              />
              <label htmlFor={`lang-${lang}`} className={`text-sm
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {getLanguageLabel(lang as ProgrammingLanguage)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {Object.entries(languages).map(([lang, limits]) => (
        <div key={lang} className="space-y-2 p-4 rounded-lg border
          ${theme === 'dark' ? 'border-gray-700 bg-background-dark' : 'border-gray-200 bg-white'}">
          <h4 className={`text-sm font-medium
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {getLanguageLabel(Number(lang) as ProgrammingLanguage)} Limits
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs mb-1
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Time Limit (ms)
              </label>
              <input
                type="number"
                value={limits.timeLimit}
                onChange={(e) => handleLimitChange(Number(lang) as ProgrammingLanguage, 'timeLimit', Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
                min="100"
                step="100"
              />
            </div>
            <div>
              <label className={`block text-xs mb-1
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Memory Limit (MB)
              </label>
              <input
                type="number"
                value={limits.memoryLimit}
                onChange={(e) => handleLimitChange(Number(lang) as ProgrammingLanguage, 'memoryLimit', Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
                min="64"
                step="64"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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

  const validateForm = () => {
    switch (formData.kataType) {
      case KataType.Value1: // Code Reading
        const options = formData.kataJsonContent?.answerOptions || [];
        if (options.length < 2) {
          alert('Please add at least 2 answer options');
          return false;
        }
        if (!options.some(opt => opt.isCorrect)) {
          alert('Please mark at least one answer as correct');
          return false;
        }
        break;
      case KataType.Value2: // Bug Finding
        if (!formData.kataJsonContent?.sourceCode) {
          alert('Please upload a test file');
          return false;
        }
        break;
      case KataType.Value3: // Code Optimization
        if (!formData.kataJsonContent?.sourceCode) {
          alert('Please provide initial code');
          return false;
        }
        break;
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

  const renderFormByType = () => {
    switch (formData.kataType) {
      case KataType.Value1:
        return <CodeReadingForm formData={formData} setFormData={setFormData} theme={theme} />;
      case KataType.Value2:
        return <BugFindingForm formData={formData} setFormData={setFormData} theme={theme} />;
      case KataType.Value3:
        return <CodeOptimizationForm formData={formData} setFormData={setFormData} theme={theme} />;
      default:
        return null;
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
                Type
              </label>
              <select
                value={formData.kataType}
                onChange={(e) => setFormData({...formData, kataType: Number(e.target.value) as KataType})}
                className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                  ${theme === 'dark' 
                    ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                    : 'border-gray-300 text-text-light focus:ring-primary'}`}
              >
                {Object.entries(KataType)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {getKataTypeLabel(Number(key) as KataType)}
                    </option>
                  ))}
              </select>
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

            {renderFormByType()}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium
              ${theme === 'dark' 
                ? 'bg-primary-dark text-white hover:bg-primary-dark/90' 
                : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            Create Kata
          </button>
        </div>
      </form>
    </div>
  );
} 