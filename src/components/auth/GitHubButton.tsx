import { useTheme } from '../../context/ThemeContext';

interface GitHubButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function GitHubButton({ text, onClick, disabled = false }: GitHubButtonProps) {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
        transition-colors border
        ${theme === 'dark' 
          ? 'bg-surface-dark border-gray-700 text-text-dark hover:bg-gray-800' 
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <img 
        src="/github_logo.png" 
        alt="GitHub" 
        className="w-5 h-5"
      />
      {text}
    </button>
  );
} 