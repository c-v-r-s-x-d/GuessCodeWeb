import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { ProfileInfoDto, ActivityStatus } from '../services/api.generated';
import { apiClient } from '../services/apiClient';
import { tokenService } from '../services/tokenService';

const getStatusColor = (status: ActivityStatus) => {
  switch (status) {
    case ActivityStatus.Value1:
      return 'bg-gray-500';
    case ActivityStatus.Value2:
      return 'bg-yellow-400';
    case ActivityStatus.Value3:
      return 'bg-green-700';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: ActivityStatus) => {
  switch (status) {
    case ActivityStatus.Value1:
      return 'Offline';
    case ActivityStatus.Value2:
      return 'Away';
    case ActivityStatus.Value3:
      return 'Online';
    default:
      return 'Unknown';
  }
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { theme } = useTheme();
  const [user, setUser] = useState<ProfileInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myUserId = tokenService.getUserId();
  const isMyProfile = myUserId && userId && String(myUserId) === String(userId);

  const loadUser = async () => {
    if (!userId) {
      setError('User ID not provided');
      setLoading(false);
      return;
    }
    try {
      const response = await apiClient.api.profileInfoDetail(parseInt(userId));
      setUser(response.data);
    } catch (err) {
      setError('Не удалось загрузить профиль');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, [userId]);

  const handleAvatarClick = () => {
    if (isMyProfile && fileInputRef.current) {
      fileInputRef.current.value = ''; // сбросить значение
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.userId) {
      setUploading(true);
      try {
        alert("середина")
        await apiClient.api.profileInfoAvatarCreate({ file });
        await loadUser();
      } catch (e) {
      } finally {
        setUploading(false);
      }
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/';
      return apiUrl.replace(/\/$/, '') + '/static/' + user.avatarUrl;
    }
    return '/default-avatar.png';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Загрузка профиля...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error || 'Пользователь не найден'}
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
            {isMyProfile ? (
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
                  src={user.avatarUrl 
                    ? `${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/static/${user.avatarUrl}` 
                    : '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className={`absolute inset-0 flex items-center justify-center rounded-lg
                  bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity
                  text-white font-medium`}>
                  {uploading ? 'Загрузка...' : 'Кликните, чтобы изменить'}
                </div>
              </label>
            ) : (
              <img
                src={user.avatarUrl 
                  ? `${(process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/static/${user.avatarUrl}` 
                  : '/default-avatar.png'} 
                alt="Profile" 
                className="w-32 h-32 rounded-lg object-cover"
              />
            )}
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.activityStatus)}`}>
              <div className="absolute left-full bottom-0 ml-2 hidden group-hover:block">
                <div className={`px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap
                  ${theme === 'dark'
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-white text-gray-800'}`}>
                  Статус: {getStatusText(user.activityStatus)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <div className={`flex flex-col gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <h1 className="text-2xl font-semibold">{user.username}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">Ранг:</span>
                  <span className="ml-2 font-bold text-blue-500">Новичок</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Достижения как ментора
          </h2>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Учеников</p>
                  <p className="text-xl font-bold">5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Сессий проведено</p>
                  <p className="text-xl font-bold">24</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Награды
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className="text-sm font-medium text-yellow-500">Золотой ментор</p>
                  <p className="text-xs text-gray-500">10+ успешных учеников</p>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className="text-sm font-medium text-blue-500">Эксперт по алгоритмам</p>
                  <p className="text-xs text-gray-500">50+ решенных задач</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4
            ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
            Activity
          </h2>
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Activity tracking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
} 