import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { ProfileInfoDto, ActivityStatus } from '../services/api.generated';
import { apiClient } from '../services/apiClient';

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

  useEffect(() => {
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
        setError('Failed to load user profile');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Loading profile...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error || 'User not found'}
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
              src={user.avatarUrl || '/default-avatar.png'} 
              alt="Profile" 
              className="w-32 h-32 rounded-lg object-cover"
            />
            
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
              <h1 className="text-2xl font-semibold">{user.username}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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