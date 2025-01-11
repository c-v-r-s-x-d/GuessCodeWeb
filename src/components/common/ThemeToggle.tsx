import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-500 relative overflow-hidden
        ${theme === 'dark' 
          ? 'bg-surface-dark hover:bg-gray-700' 
          : 'bg-surface-light hover:bg-gray-200'
        }`}
    >
      <div className="relative">
        {/* Sun */}
        <div className={`transform transition-all duration-500
          ${theme === 'dark' 
            ? '-translate-y-10 opacity-0' 
            : 'translate-y-0 opacity-100'
          }`}
        >
          <span className="text-2xl">☀️</span>
        </div>

        {/* Moon */}
        <div className={`absolute top-0 left-0 transform transition-all duration-500
          ${theme === 'dark' 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
          }`}
        >
          <span className="text-2xl">🌙</span>
        </div>
      </div>
    </button>
  );
} 