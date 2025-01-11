import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className={`text-9xl font-bold mb-4 
        ${theme === 'dark' ? 'text-primary-dark' : 'text-primary'}`}>
        404
      </h1>
      
      <h2 className={`text-2xl font-semibold mb-6
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Page Not Found
      </h2>
      
      <p className={`text-lg mb-8 max-w-md
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        The page you're looking for might have been moved, deleted, or never existed.
      </p>

      <div className="space-x-4">
        <Link
          to="/"
          className={`inline-block px-6 py-3 rounded-lg font-semibold
            ${theme === 'dark' 
              ? 'bg-primary-dark hover:bg-blue-500' 
              : 'bg-primary hover:bg-blue-700'}
            text-white transition-colors`}
        >
          Go Home
        </Link>
        
        <Link
          to="/challenges"
          className={`inline-block px-6 py-3 rounded-lg font-semibold
            ${theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
            transition-colors`}
        >
          Browse Katas
        </Link>
      </div>
    </div>
  );
} 