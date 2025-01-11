import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is GuessCode?",
    answer: "GuessCode is a platform designed to help developers improve their code reading and understanding skills through interactive challenges and exercises."
  },
  {
    question: "How do the challenges work?",
    answer: "Each challenge presents you with a code snippet and multiple explanations. Your task is to correctly identify what the code does by selecting the right explanation. This helps build your code comprehension skills."
  },
  {
    question: "What programming languages are supported?",
    answer: "Currently, we support multiple popular programming languages including JavaScript, Python, Java, and C#. We're continuously adding support for more languages."
  },
  {
    question: "How is my rank calculated?",
    answer: "Your rank is determined by your performance in solving challenges. As you successfully complete more challenges, especially harder ones, your rank improves. The ranking system uses kyu levels, similar to martial arts."
  },
  {
    question: "Can I create my own challenges?",
    answer: "Yes! Once you reach a certain rank, you can create and submit your own challenges for the community. This helps others learn while also deepening your own understanding."
  },
  {
    question: "How can I improve my ranking?",
    answer: "Complete more challenges, especially those at or above your current rank level. Consistent practice and tackling progressively harder challenges is the key to improvement."
  }
];

export default function FAQ() {
  const { theme } = useTheme();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-8 
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className={`rounded-lg shadow-md overflow-hidden
              ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}
          >
            <button
              onClick={() => toggleItem(index)}
              className={`w-full p-6 flex justify-between items-center
                ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
            >
              <h3 className={`text-xl font-semibold text-left
                ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                {item.question}
              </h3>
              <span className={`transform transition-transform duration-200
                ${openItems.includes(index) ? 'rotate-45' : ''}`}>
                <svg 
                  className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-200 ease-in-out
              ${openItems.includes(index) ? 'max-h-96' : 'max-h-0'}`}>
              <p className={`px-6 pb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 