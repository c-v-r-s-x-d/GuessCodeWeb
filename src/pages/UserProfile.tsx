import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import {ProfileInfoDto, ActivityStatus, UserDto, Rank} from '../services/api.generated';
import { notify, handleApiError } from '../utils/notifications';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function UserProfile() {
  const { theme } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileInfoDto | null>(null);
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        setError('Неверный ID пользователя');
        setIsLoading(false);
        return;
      }
      loadUserData(userIdNum);
    } else {
      setError('Требуется ID пользователя');
      setIsLoading(false);
    }
  }, [userId]);

  const loadUserData = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Загружаем профиль и данные пользователя параллельно
      const [profileResponse, userResponse] = await Promise.all([
        apiClient.profileInfoGET(userId),
        apiClient.user(userId)
      ]);

      if (!profileResponse) {
        setError('Пользователь не найден');
        return;
      }

      setUser(profileResponse);
      setUserData(userResponse);
    } catch (error: any) {
      if (error.status === 401) {
        notify.error('Пожалуйста, войдите в систему для просмотра профиля');
        navigate('/login');
      } else if (error.status === 404) {
        setError('Пользователь не найден');
      } else {
        handleApiError(error);
        setError('Произошла ошибка при загрузке профиля');
      }
    } finally {
      setIsLoading(false);
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

  const getRankText = (rank: Rank): string => {
    switch (rank) {
      case 1: return 'FifthKyu';
      case 2: return 'FourthKyu';
      case 3: return 'ThirdKyu';
      case 4: return 'SecondKyu';
      case 5: return 'FirstKyu';
      case 6: return 'FirstDan';
      case 7: return 'SecondDan';
      case 20: return 'Master';
      default: return 'Unranked';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`mt-4 px-4 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Назад
        </button>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Пользователь не найден
        </p>
        <button
          onClick={() => navigate(-1)}
          className={`mt-4 px-4 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Назад
        </button>
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
              alt="Avatar"
              className="w-32 h-32 rounded-lg object-cover border"
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white
              ${getStatusColor(user.activityStatus!)}`}>
              <div className="absolute left-full bottom-0 ml-2 hidden group-hover:block">
                <div className={`px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap
                  ${theme === 'dark' 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-white text-gray-800'}`}>
                  Текущий статус: {getStatusText(user.activityStatus!)}
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
                  <span className="text-sm font-medium">Rank:</span>
                  <span className="ml-2 font-bold text-blue-500">{getRankText(userData.rank)}</span>
                </div>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">Rating:</span>
                  <span className="ml-2 font-bold text-green-500">{userData.rating || 0}</span>
                </div>
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">GuessCode member since:</span>
                  <span className="ml-2 font-bold text-purple-500">
                    {userData.registrationDate ? new Date(userData.registrationDate).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 