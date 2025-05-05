import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ActivityStatus } from '../services/api.generated';
import { apiClient } from '../services/apiClient';
import { tokenService } from '../services/tokenService';

export default function Profile() {
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.userId) return;
    setUploading(true);
    try {
      await apiClient.avatar({ data: file, fileName: file.name });
    } catch {
      alert('Ошибка загрузки аватара');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      return `${apiUrl}/static/${user.avatarUrl}`;
    }
    return '/default-avatar.png';
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 1:
        return 'bg-gray-500'; // offline
      case 2:
        return 'bg-yellow-400'; // away
      case 3:
        return 'bg-green-700'; // online
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ActivityStatus) => {
    switch (status) {
      case 1:
        return 'Offline';
      case 2:
        return 'Away';
      case 3:
        return 'Online';
      default:
        return 'Unknown';
    }
  };

  if (!user || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Загрузка профиля...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`rounded-lg shadow-md p-6 mb-8
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0 relative group">
            <label className="cursor-pointer block w-32 h-32">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Выбрать аватар"
              />
              <img
                src={getAvatarUrl()}
                alt="Аватар"
                className="w-32 h-32 rounded-lg object-cover border"
                style={uploading ? { opacity: 0.5 } : {}}
              />
              <div className={`absolute inset-0 flex items-center justify-center rounded-lg
                bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity
                text-white font-medium`}>
                {uploading ? 'Загрузка...' : 'Кликните, чтобы изменить'}
              </div>
            </label>
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white
              ${getStatusColor(user.activityStatus)}`}>
              <div className="absolute left-full bottom-0 ml-2 hidden group-hover:block">
                <div className={`px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap
                  ${theme === 'dark' 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-white text-gray-800'}`}>
                  Current status: {getStatusText(user.activityStatus)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className={`flex flex-col gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-2xl font-bold">{user.username}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">Ранг:</span>
                  <span className="ml-2 font-bold text-blue-500">Новичок</span>
                </div>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">Рейтинг:</span>
                  <span className="ml-2 font-bold text-green-500">1000</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>До следующего ранга</span>
                  <span>75%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Осталось 250 очков до ранга "Средний"
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium">Языки программирования:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['JavaScript', 'Python', 'Java'].map((lang) => (
                    <span key={lang} className={`px-3 py-1 rounded-full text-sm font-medium
                      ${theme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Решенные каты */}
        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Решенные каты
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Code Reading (3)
              </h3>
              <div className="space-y-2">
                {['Legacy Code Refactoring', 'Code Review Practice', 'Documentation Analysis'].map((kata) => (
                  <div key={kata} className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {kata}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Bug Finding (2)
              </h3>
              <div className="space-y-2">
                {['Memory Leak Detection', 'Race Condition Debugging'].map((kata) => (
                  <div key={kata} className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {kata}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Code Optimization (2)
              </h3>
              <div className="space-y-2">
                {['Performance Optimization', 'Memory Usage Optimization'].map((kata) => (
                  <div key={kata} className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {kata}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Менторинг */}
        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Менторинг
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Статистика как ментора
              </h3>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Учеников</p>
                    <p className="text-xl font-bold">-</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Сессий проведено</p>
                    <p className="text-xl font-bold">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Мой ментор */}
        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Мой ментор
          </h2>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-4">
              <img 
                src="/default-avatar.png" 
                alt="Ментор" 
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-medium">-</p>
                <p className="text-sm text-gray-500">-</p>
                <p className="text-sm text-gray-500">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 