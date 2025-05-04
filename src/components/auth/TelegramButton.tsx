import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TelegramButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function TelegramButton({ text, onClick, disabled = false }: TelegramButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2
        ${theme === 'dark' 
          ? 'bg-[#0088cc] hover:bg-[#0077b3] text-white' 
          : 'bg-[#0088cc] hover:bg-[#0077b3] text-white'}`}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.08-.2-.09-.06-.22-.04-.31-.02-.13.02-2.24 1.43-6.32 4.21-.6.42-1.15.62-1.64.61-.54-.01-1.57-.3-2.34-.55-.94-.31-1.69-.48-1.63-1.01.03-.27.4-.55 1.1-.84 4.12-1.79 6.87-2.97 8.26-3.57 3.93-1.7 4.75-1.99 5.28-2.01.12 0 .38.03.55.18.14.13.18.3.2.45-.01.06-.01.11-.02.17z"/>
      </svg>
      {text}
    </button>
  );
} 