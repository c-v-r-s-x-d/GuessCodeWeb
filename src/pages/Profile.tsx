import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ActivityStatus } from '../services/api.generated';

export default function Profile() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement avatar upload logic here
      console.log('File selected:', file);
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.Value1:
        return 'bg-gray-500'; // offline
      case ActivityStatus.Value2:
        return 'bg-yellow-400'; // away
      case ActivityStatus.Value3:
        return 'bg-green-700'; // online
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Loading profile...
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
            <div 
              className="relative cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img 
                src={user.avatarUrl || '/default-avatar.png'} 
                alt="Profile" 
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center rounded-lg
                bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity
                text-white font-medium`}>
                Click to change
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
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
            <div className={`flex flex-col gap-2 text-2xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>{user.username}</p>
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