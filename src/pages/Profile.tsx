import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ActivityStatus, ProfileInfoDto, MentorDto, ProfileUpdateValuesDto } from '../services/api.generated';
import { apiClient } from '../services/apiClient';
import { notify, handleApiError } from '../utils/notifications';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ChatRoom from '../components/chat/ChatRoom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Feedback } from '../components/Feedback';

export default function Profile() {
  const { theme } = useTheme();
  const { user, isLoading, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [mentees, setMentees] = useState<ProfileInfoDto[]>([]);
  const [isLoadingMentees, setIsLoadingMentees] = useState(false);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [mentor, setMentor] = useState<MentorDto | null>(null);
  const [isLoadingMentor, setIsLoadingMentor] = useState(false);
  const [pendingMentees, setPendingMentees] = useState<ProfileInfoDto[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [mentorProfile, setMentorProfile] = useState<ProfileInfoDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileUpdateValuesDto>>({
    userId: undefined,
    username: '',
    newPassword: '',
    confirmCurrentPassword: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadMentees();
      loadMentor();
      loadPendingMentees();
    }
  }, [user]);

  const loadMentees = async () => {
    if (!user) return;
    setIsLoadingMentees(true);
    try {
      const menteesList = await apiClient.mentees();
      const menteesInfo = await Promise.all(
        menteesList.map(mentee => apiClient.profileInfoGET(mentee.id!))
      );
      setMentees(menteesInfo);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingMentees(false);
    }
  };

  const loadMentor = async () => {
    if (!user?.userId) return;
    setIsLoadingMentor(true);
    try {
      const userData = await apiClient.user(user.userId);
      if (!userData.mentorId) {
        setMentor(null);
        return;
      }
      const mentorData = await apiClient.mentor(userData.mentorId);
      setMentor(mentorData);
      if (mentorData.userId) {
        const mentorProfileData = await apiClient.profileInfoGET(mentorData.userId);
        setMentorProfile(mentorProfileData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingMentor(false);
    }
  };

  const loadPendingMentees = async () => {
    if (!user?.userId) return;
    setIsLoadingPending(true);
    try {
      const pendingList = await apiClient.pendingMenteesAll();
      const pendingInfo = await Promise.all(
        pendingList.map(mentee => apiClient.profileInfoGET(mentee.id!))
      );
      setPendingMentees(pendingInfo);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleStartChat = async (userId: number) => {
    try {
      const roomId = await apiClient.chat(userId);
      setChatRoomId(roomId);
      setSelectedUserId(userId);
      setIsChatOpen(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setChatRoomId(null);
    setSelectedUserId(null);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await apiClient.avatar({ data: file, fileName: file.name });
      notify.success('Avatar updated successfully');
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

  const getMentorAvatarUrl = (avatarUrl?: string) => {
    if (avatarUrl) {
      const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      return `${apiUrl}/static/${avatarUrl}`;
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

  const handleApproveMentee = async (menteeId: number) => {
    try {
      await apiClient.pendingMentees(menteeId, true);
      notify.success('Mentee approved');
      loadMentees();
      loadPendingMentees();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRejectMentee = async (menteeId: number) => {
    try {
      await apiClient.pendingMentees(menteeId, false);
      notify.success('Request rejected');
      loadPendingMentees();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEditClick = () => {
    if (user) {
      const newForm = new ProfileUpdateValuesDto();
      newForm.userId = user.userId;
      newForm.username = user.username || '';
      newForm.description = user.description || '';
      newForm.newPassword = '';
      newForm.confirmCurrentPassword = '';
      setEditForm(newForm);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    const emptyForm = new ProfileUpdateValuesDto();
    emptyForm.userId = undefined;
    emptyForm.username = '';
    emptyForm.newPassword = '';
    emptyForm.confirmCurrentPassword = '';
    emptyForm.description = '';
    setEditForm(emptyForm);
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editForm.userId) return;
    
    setIsSaving(true);
    try {
      const formToSubmit = new ProfileUpdateValuesDto();
      Object.assign(formToSubmit, editForm);
      await apiClient.profileInfoPOST(formToSubmit);
      notify.success('Profile updated successfully');
      // Перезагружаем данные пользователя
      const updatedUser = await apiClient.profileInfoGET(editForm.userId);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const newForm = new ProfileUpdateValuesDto();
      Object.assign(newForm, prev);
      (newForm as any)[name] = value;
      return newForm;
    });
  };

  if (!user || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className={`rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
          <div className="flex-shrink-0 relative group mb-4 md:mb-0 flex justify-center w-full md:w-auto">
            <label className="cursor-pointer block w-24 h-24 sm:w-32 sm:h-32 mx-auto md:mx-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Choose avatar"
              />
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border mx-auto md:mx-0"
                style={uploading ? { opacity: 0.5 } : {}}
              />
              <div className={`absolute inset-0 flex items-center justify-center rounded-lg
                bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity
                text-white font-medium`}>
                {uploading ? 'Uploading...' : 'Click to change'}
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
          
          <div className="flex-grow w-full md:w-auto">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={editForm.newPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Current Password</label>
                  <input
                    type="password"
                    name="confirmCurrentPassword"
                    value={editForm.confirmCurrentPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-md ${
                      theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white disabled:opacity-50`}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={`px-4 py-2 rounded-md ${
                      theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
                    } text-white`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{user?.username}</h1>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {user?.description || 'No description'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Feedback 
                      className={`px-4 py-2 rounded-md font-medium
                        ${theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    />
                    <button
                      onClick={handleEditClick}
                      className={`px-4 py-2 rounded-md ${
                        theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <span className="text-sm font-medium">Rank:</span>
                    <span className="ml-2 font-bold text-blue-500">5th Kyu</span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <span className="text-sm font-medium">Rating:</span>
                    <span className="ml-2 font-bold text-green-500">10</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>To next rank</span>
                    <span>10%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                      style={{ width: '10%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Remaining 90 points to "4th Kyu" rank
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        {/* Мой ментор */}
        <div className={`rounded-lg shadow-md p-6 ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>My Mentor</h2>
          {isLoadingMentor ? (
            <LoadingSpinner />
          ) : mentor ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={getMentorAvatarUrl(mentorProfile?.avatarUrl)}
                alt={mentor.userId?.toString() || 'Ментор'}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="text-center">
                <p className="font-medium text-lg">{mentorProfile?.username || mentor.userId}</p>
                <p className="text-sm text-gray-500">Experience: {mentor.experience} years</p>
                <p className="text-sm text-gray-500 mt-2">{mentor.about}</p>
              </div>
              <button
                onClick={() => handleStartChat(mentor.userId!)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Chat with mentor</span>
              </button>
            </div>
          ) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>You don't have a mentor yet</p>
          )}
        </div>

        {/* Менти */}
        <div className={`rounded-lg shadow-md p-6 md:col-span-2 ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>My Mentees</h2>
          {isLoadingMentees ? (
            <div className="flex justify-center"><LoadingSpinner /></div>
          ) : mentees.length > 0 ? (
            <div className="space-y-4">
              {mentees.map((mentee) => (
                <div key={mentee.userId} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={mentee.avatarUrl || '/default-avatar.png'}
                        alt={mentee.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-lg">{mentee.username}</p>
                        <p className="text-sm text-gray-500">Status: {getStatusText(mentee.activityStatus!)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartChat(mentee.userId!)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Start chat"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>You don't have any mentees yet</p>
          )}

          {/* Pending mentees */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Pending requests</h3>
          {isLoadingPending ? (
            <div className="flex justify-center"><LoadingSpinner /></div>
          ) : pendingMentees.length > 0 ? (
            <div className="space-y-4">
              {pendingMentees.map((mentee) => (
                <div key={mentee.userId} className={`p-4 rounded-lg border border-yellow-400 ${theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={mentee.avatarUrl || '/default-avatar.png'}
                        alt={mentee.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-lg">{mentee.username}</p>
                        <p className="text-sm text-gray-500">Status: {getStatusText(mentee.activityStatus!)}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveMentee(mentee.userId!)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectMentee(mentee.userId!)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No pending requests</p>
          )}
        </div>
      </div>

      {isChatOpen && chatRoomId && selectedUserId && (
        <ChatRoom roomId={chatRoomId} onClose={handleCloseChat} />
      )}
    </div>
  );
} 