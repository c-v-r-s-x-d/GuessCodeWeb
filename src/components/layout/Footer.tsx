import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`mt-auto transition-colors duration-200 backdrop-blur-sm
      ${theme === 'dark' ? 'bg-surface-dark/80' : 'bg-surface-light/50'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <h3 className={`font-bold text-base mb-2 
              ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              GuessCode
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Improve your code reading and understanding skills
            </p>
          </div>

          <div className="col-span-1">
            <h4 className={`font-semibold mb-2 text-sm ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Quick Links
            </h4>
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/challenges" 
                  className={`text-sm ${theme === 'dark' 
                    ? 'text-gray-400 hover:text-primary-dark' 
                    : 'text-gray-600 hover:text-primary'}`}
                >
                  Challenges
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className={`font-semibold mb-4 
              ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Resources
            </h4>
            <ul className="space-y-2">
              {['FAQ'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className={`${theme === 'dark' 
                      ? 'text-gray-400 hover:text-primary-dark' 
                      : 'text-gray-600 hover:text-primary'}`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className={`font-semibold mb-4 
              ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email: admin@guess-code.ru
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
          mt-4 pt-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>&copy; 2024-2025 GuessCode. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 