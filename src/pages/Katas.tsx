import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { KataDto, KataDifficulty, ProgrammingLanguage, KataType } from '../services/api.generated';
import { getDifficultyLabel, getLanguageLabel, getKataTypeLabel } from '../utils/enumHelpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Katas() {
  const { theme } = useTheme();
  const [katas, setKatas] = useState<KataDto[]>([]);
  const [featuredKata, setFeaturedKata] = useState<KataDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    difficulty: 1,
    language: 1,
    type: 1,
    search: ''
  });

  useEffect(() => {
    loadKatas();
  }, [filter]);

  const loadKatas = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.kataSearchAll(
        filter.language,
        filter.type,
        filter.difficulty
      );
      setKatas(response || []);
      if (!featuredKata && response && response.length > 0) {
        setFeaturedKata(response[0]);
      }
    } catch (error) {
      console.error('Error loading katas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextKata = () => {
    if (katas.length === 0) return;
    const currentIndex = katas.findIndex(k => k.id === featuredKata?.id);
    const nextIndex = (currentIndex + 1) % katas.length;
    setFeaturedKata(katas[nextIndex]);
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

      {/* Featured Kata Section */}
      {featuredKata && (
        <div className={`p-6 rounded-lg shadow-md mb-8
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className={`text-2xl font-bold mb-2
                ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                Featured Kata
              </h2>
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm
                  ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                  {getLanguageLabel(featuredKata.programmingLanguage!)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm
                  ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  {getDifficultyLabel(featuredKata.kataDifficulty!)}
                </span>
              </div>
            </div>
            <button
              onClick={getNextKata}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                ${theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              Next Kata →
            </button>
          </div>
          
          <h3 className={`text-xl font-semibold mb-3
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            {featuredKata.title}
          </h3>
          
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {featuredKata.kataJsonContent?.kataDescription}
          </p>

          <Link
            to={`/kata/${featuredKata.id}`}
            className={`inline-block px-6 py-2 rounded-lg text-white font-medium
              ${theme === 'dark' 
                ? 'bg-primary-dark hover:bg-blue-500' 
                : 'bg-primary hover:bg-blue-700'}`}
          >
            Start Challenge
          </Link>
        </div>
      )}

      {/* Filters Section */}
      <div className={`p-4 rounded-lg shadow-md mb-6
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <select
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: Number(e.target.value) as KataType})}
            className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2
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
      </div>

      {/* Katas Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {katas.map((kata) => (
            <Link
              key={kata.id}
              to={`/kata/${kata.id}`}
              className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105
                ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-semibold
                  ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                  {kata.title}
                </h3>
                <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
                  {getDifficultyLabel(kata.kataDifficulty!)}
                </span>
              </div>
              <p className={`mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {kata.kataJsonContent?.kataDescription}
              </p>
              <div className="flex justify-between items-center">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {getLanguageLabel(kata.programmingLanguage!)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 