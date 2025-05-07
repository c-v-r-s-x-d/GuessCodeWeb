import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, ProgrammingLanguage, KataDifficulty, KataType, KataJsonContent, AnswerOption } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { notify, handleApiError } from '../utils/notifications';

interface FormProps {
  formData: KataDto;
  setFormData: (data: KataDto) => void;
  theme: 'dark' | 'light';
}

interface CodeReadingFormProps extends FormProps {}
interface BugFindingFormProps extends FormProps {}
interface CodeOptimizationFormProps extends FormProps {}

const CodeReadingForm: React.FC<CodeReadingFormProps> = ({ formData, setFormData, theme }) => {
  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      sourceCode: e.target.value
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const handleAnswerOptionChange = (index: number, field: keyof AnswerOption, value: any) => {
    const updatedOptions = [...(formData.kataJsonContent?.answerOptions || [])];
    updatedOptions[index] = AnswerOption.fromJS({
      ...updatedOptions[index],
      [field]: value
    });

    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      answerOptions: updatedOptions
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const addAnswerOption = () => {
    const newOption = AnswerOption.fromJS({
      optionId: (formData.kataJsonContent?.answerOptions?.length || 0) + 1,
      option: '',
      isCorrect: false
    });

    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      answerOptions: [...(formData.kataJsonContent?.answerOptions || []), newOption]
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const removeAnswerOption = (index: number) => {
    const updatedOptions = [...(formData.kataJsonContent?.answerOptions || [])];
    updatedOptions.splice(index, 1);

    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      answerOptions: updatedOptions
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const toggleCorrectAnswer = (optionId: number) => {
    const updatedContent = new KataJsonContent({
      ...formData.kataJsonContent,
      answerOptions: formData.kataJsonContent?.answerOptions?.map(opt => 
        new AnswerOption({
          ...opt,
          isCorrect: opt.optionId === optionId
        })
      )
    });

    setFormData(new KataDto({
      ...formData,
      kataJsonContent: updatedContent
    }));
  };

  const updateAnswerOption = (optionId: number, value: string) => {
    const updatedContent = new KataJsonContent({
      ...formData.kataJsonContent,
      answerOptions: formData.kataJsonContent?.answerOptions?.map(opt =>
        opt.optionId === optionId ? new AnswerOption({ ...opt, option: value }) : opt
      )
    });

    setFormData(new KataDto({
      ...formData,
      kataJsonContent: updatedContent
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Source Code
        </label>
        <textarea
          value={formData.kataJsonContent?.sourceCode}
          onChange={handleSourceCodeChange}
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
              ${theme === 'dark' ? 'bg-primary-dark' : 'bg-primary'}`}
          >
            Add Option
          </button>
        </div>

        {formData.kataJsonContent?.answerOptions?.map((option, index) => (
          <div key={option.optionId} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={option.option}
              onChange={(e) => handleAnswerOptionChange(index, 'option', e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                  : 'border-gray-300 text-text-light focus:ring-primary'}`}
              placeholder="Enter answer option"
              required
            />
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={(e) => handleAnswerOptionChange(index, 'isCorrect', e.target.checked)}
              className={`h-4 w-4 rounded
                ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}
            />
            <button
              type="button"
              onClick={() => removeAnswerOption(index)}
              className={`p-2 rounded-lg
                ${theme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
            >
              <span className="sr-only">Remove option</span>
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BugFindingForm: React.FC<BugFindingFormProps> = ({ formData, setFormData, theme }) => {
  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      sourceCode: e.target.value
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Просто сохраняем файл, не читаем его содержимое
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Source Code
        </label>
        <textarea
          value={formData.kataJsonContent?.sourceCode}
          onChange={handleSourceCodeChange}
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

  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      sourceCode: e.target.value
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });

    setFormData(updatedFormData);
  };

  const handleTestFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Просто сохраняем файл, не читаем его содержимое
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Source Code
        </label>
        <textarea
          value={formData.kataJsonContent?.sourceCode}
          onChange={handleSourceCodeChange}
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

const CreateKata: React.FC = () => {
  const { theme } = useTheme();
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  const initialKataJsonContent = KataJsonContent.fromJS({
    kataDescription: '',
    sourceCode: '',
    answerOptions: []
  });

  const initialFormData = KataDto.fromJS({
    title: '',
    programmingLanguage: ProgrammingLanguage._1,
    kataDifficulty: KataDifficulty._1,
    kataType: KataType._1,
    kataJsonContent: initialKataJsonContent,
    authorId: userId,
    memoryLimits: {},
    timeLimits: {}
  });

  const [formData, setFormData] = useState<KataDto>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Создаем объект с данными ката
      const kataData = KataDto.fromJS({
        title: formData.title,
        programmingLanguage: formData.programmingLanguage,
        kataDifficulty: formData.kataDifficulty,
        kataType: formData.kataType,
        kataJsonContent: KataJsonContent.fromJS({
          kataDescription: formData.kataJsonContent?.kataDescription,
          sourceCode: formData.kataJsonContent?.sourceCode,
          answerOptions: formData.kataJsonContent?.answerOptions?.map(opt => 
            AnswerOption.fromJS({
              optionId: opt.optionId,
              option: opt.option,
              isCorrect: opt.isCorrect
            })
          )
        }),
        authorId: userId,
        // Добавляем лимиты только для BugFinding и CodeOptimization
        ...(formData.kataType !== KataType._1 && {
          memoryLimits: formData.memoryLimits,
          timeLimits: formData.timeLimits
        })
      });

      // Преобразуем объект в JSON строку
      const kataDtoRaw = JSON.stringify(kataData.toJSON());

      // Добавляем файл, если он есть
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      await apiClient.kataAdministrationPOST(kataDtoRaw, file ? {
        data: file,
        fileName: file.name
      } : undefined);

      notify.success('Kata created successfully!');
      navigate('/challenges');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = KataDto.fromJS({
      ...formData,
      title: e.target.value
    });
    setFormData(updatedFormData);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataType: Number(e.target.value) as KataType
    });
    setFormData(updatedFormData);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataDifficulty: Number(e.target.value) as KataDifficulty
    });
    setFormData(updatedFormData);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedFormData = KataDto.fromJS({
      ...formData,
      programmingLanguage: Number(e.target.value) as ProgrammingLanguage
    });
    setFormData(updatedFormData);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = KataJsonContent.fromJS({
      ...formData.kataJsonContent,
      kataDescription: e.target.value
    });

    const updatedFormData = KataDto.fromJS({
      ...formData,
      kataJsonContent: updatedContent
    });
    setFormData(updatedFormData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-2xl font-bold mb-6
        ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        Create New Kata
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-1
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
              ${theme === 'dark' 
                ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                : 'border-gray-300 text-text-light focus:ring-primary'}`}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Type
            </label>
            <select
              value={formData.kataType}
              onChange={handleTypeChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                  : 'border-gray-300 text-text-light focus:ring-primary'}`}
              required
            >
              {Object.values(KataType)
                .filter(value => typeof value === 'number')
                .map(value => (
                  <option key={value} value={value}>
                    {getKataTypeLabel(value as KataType)}
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
              onChange={handleDifficultyChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                  : 'border-gray-300 text-text-light focus:ring-primary'}`}
              required
            >
              {Object.values(KataDifficulty)
                .filter(value => typeof value === 'number')
                .map(value => (
                  <option key={value} value={value}>
                    {getDifficultyLabel(value as KataDifficulty)}
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
              onChange={handleLanguageChange}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                ${theme === 'dark' 
                  ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                  : 'border-gray-300 text-text-light focus:ring-primary'}`}
              required
            >
              {Object.values(ProgrammingLanguage)
                .filter(value => typeof value === 'number')
                .map(value => (
                  <option key={value} value={value}>
                    {getLanguageLabel(value as ProgrammingLanguage)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            value={formData.kataJsonContent?.kataDescription}
            onChange={handleDescriptionChange}
            rows={6}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2
              ${theme === 'dark' 
                ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                : 'border-gray-300 text-text-light focus:ring-primary'}`}
            required
          />
        </div>

        {formData.kataType === KataType._1 && (
          <CodeReadingForm formData={formData} setFormData={setFormData} theme={theme} />
        )}

        {formData.kataType === KataType._2 && (
          <BugFindingForm formData={formData} setFormData={setFormData} theme={theme} />
        )}

        {formData.kataType === KataType._3 && (
          <CodeOptimizationForm formData={formData} setFormData={setFormData} theme={theme} />
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white
              ${theme === 'dark' 
                ? 'bg-primary-dark hover:bg-primary-dark/90' 
                : 'bg-primary hover:bg-primary/90'}`}
            disabled={isSubmitting}
          >
            Create Kata
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateKata; 