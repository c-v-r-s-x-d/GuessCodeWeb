import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, KataDifficulty, ProgrammingLanguage, KataType } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';

export default function Katas() {
  const { theme } = useTheme();
  const [katas, setKatas] = useState<KataDto[]>([]);
  const [filter, setFilter] = useState({
    difficulty: KataDifficulty.Value1,
    language: ProgrammingLanguage.Value1,
    type: KataType.Value1,
    search: ''
  });

  useEffect(() => {
    loadKatas();
  }, [filter]);

  const loadKatas = async () => {
    try {
      const response = await apiClient.api.kataSearchList({
        kataDifficulty: filter.difficulty,
        kataLanguage: filter.language,
        kataType: filter.type
      });
      setKatas(response.data || []);
    } catch (error) {
      console.error('Error loading katas:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold 
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Katas
        </h1>
        
        <Link
          to="/katas/create"
          className={`px-4 py-2 rounded-lg text-white font-semibold
            ${theme === 'dark' 
              ? 'bg-primary-dark hover:bg-blue-500' 
              : 'bg-primary hover:bg-blue-700'}`}
        >
          Create Kata
        </Link>
      </div>

      <div className={`p-4 rounded-lg shadow-md mb-6
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search katas..."
            className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2
              ${theme === 'dark' 
                ? 'bg-background-dark border-gray-700 text-text-dark focus:ring-primary-dark' 
                : 'border-gray-300 text-text-light focus:ring-primary'}`}
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
          
          <select
            value={filter.difficulty}
            onChange={(e) => setFilter({...filter, difficulty: Number(e.target.value) as KataDifficulty})}
            className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2
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

          <select
            value={filter.language}
            onChange={(e) => setFilter({...filter, language: Number(e.target.value) as ProgrammingLanguage})}
            className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {katas.map((kata) => (
          <div key={kata.title} className={`p-6 rounded-lg shadow-md
            ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-semibold
                ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                {kata.title}
              </h3>
              <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
                {getDifficultyLabel(kata.kataDifficulty!)}
              </span>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {kata.kataRawJsonContent?.kataDescription}
            </p>
            <div className="flex justify-between items-center">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {ProgrammingLanguage[kata.programmingLanguage!]}
              </span>
              <Link
                to={`/kata/${kata.authorId}`}
                className={`px-4 py-2 rounded text-sm font-medium
                  ${theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                Train
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 