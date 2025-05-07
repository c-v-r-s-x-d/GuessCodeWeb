import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { ProfileInfoDto, ActivityStatus } from '../services/api.generated';
import { notify, handleApiError } from '../utils/notifications';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function UserProfile() {
  const { theme } = useTheme();
  const { id } = useParams();
  const [user, setUser] = useState<ProfileInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser(parseInt(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const response = await apiClient.profileInfoGET(userId);
      setUser(response);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await apiClient.avatar({ data: file, fileName: file.name });
      notify.success('Аватар успешно обновлен');
      if (id) {
        loadUser(parseInt(id));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Пользователь не найден
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
            <img
              src={getAvatarUrl()}
              alt="Аватар"
              className="w-32 h-32 rounded-lg object-cover border"
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white
              ${getStatusColor(user.activityStatus!)}`}>
              <div className="absolute left-full bottom-0 ml-2 hidden group-hover:block">
                <div className={`px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap
                  ${theme === 'dark' 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-white text-gray-800'}`}>
                  Current status: {getStatusText(user.activityStatus!)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className={`flex flex-col gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-2xl font-bold">{user.username}</p>
              <p className="text-sm">{user.description || 'Нет описания'}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 