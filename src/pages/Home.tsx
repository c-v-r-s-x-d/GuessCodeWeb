import React from "react";
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-7rem)]">
      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Improve Your Code Reading Skills
        </h1>
        <p className="text-xl mb-8 text-gray-200">
          Practice reading and understanding code through interactive challenges
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Read & Understand', 'Fix the code', 'Challenge AI', 'Learn', 'Teach', 'Enjoy'].map((title, index) => (
            <div key={index} className="p-6 rounded-lg shadow-md bg-black/90 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-white">
                {title}
              </h3>
              <p className="text-gray-300">
                {index === 0 && 'Practice understanding complex code snippets and explain their functionality'}
                {index === 1 && 'Identify bugs and potential issues in code samples'}
                {index === 2 && 'Try your hand at coding against AI. Who will win? (Coming soon)'}
                {index === 3 && 'Find a mentor and improve your skills together'}
                {index === 4 && 'Help your junior colleagues become programmers, and you yourself will gain invaluable mentoring experience'}
                {index === 5 && 'Just enjoy the exciting katas and new acquaintances'}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <Link to="/challenges" 
            className="inline-block px-8 py-3 rounded-lg text-lg font-semibold text-white
              bg-primary-dark hover:bg-blue-500 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
} 