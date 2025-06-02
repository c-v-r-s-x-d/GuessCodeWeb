import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, UserIcon, CodeBracketIcon, LockClosedIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../services/apiClient';
import { MentorDto, KataDto, ChangeUserRoleDto, UserDto } from '../services/api.generated';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getLanguageLabel, getDifficultyLabel, getKataTypeLabel } from '../utils/enumHelpers';
import { notify, handleApiError } from '../utils/notifications';
import { KataReportsPanel } from '../components/admin/KataReportsPanel';
import { FeedbackPanel } from '../components/admin/FeedbackPanel';
import { Link } from 'react-router-dom';

type TabType = 'mentors' | 'users' | 'katas' | 'reports' | 'feedback';

interface Tab {
  id: TabType;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const tabs: Tab[] = [
  { id: 'mentors', name: 'Mentors', icon: ShieldCheckIcon },
  { id: 'users', name: 'Users', icon: UserIcon },
  { id: 'katas', name: 'Katas', icon: CodeBracketIcon },
  { id: 'reports', name: 'Reports', icon: LockClosedIcon },
  { id: 'feedback', name: 'Feedback', icon: ChatBubbleLeftIcon },
];

export default function AdminPanel() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('mentors');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mentors, setMentors] = useState<MentorDto[]>([]);
  const [pendingKatas, setPendingKatas] = useState<KataDto[]>([]);
  const [selectedKata, setSelectedKata] = useState<KataDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // TODO: Add API for checking admin status
        // const response = await apiClient.api.checkAdminStatus();
        // setIsAdmin(response.data.isAdmin);
        setIsAdmin(true); // Temporary solution
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        const [mentorsResponse, katasResponse] = await Promise.all([
          apiClient.pendingMentorsAll(),
          apiClient.pendingKatasAll()
        ]);
        setMentors(mentorsResponse);
        setPendingKatas(katasResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleMentorAction = async (mentorId: number, isApproved: boolean) => {
    try {
      await apiClient.pendingMentors(mentorId, isApproved);
      setMentors(mentors);
      notify.success(`Mentor request ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleKataAction = async (kataId: number, isApproved: boolean) => {
    try {
      setActionLoading(true);
      await apiClient.pendingKatas(kataId, isApproved);
      setPendingKatas(pendingKatas.filter(kata => kata.id !== kataId));
      notify.success(`Kata ${isApproved ? 'approved' : 'rejected'} successfully`);
      setIsDialogOpen(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewKata = (kata: KataDto) => {
    setSelectedKata(kata);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedKata(null);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg text-center
          ${theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
          You don't have access to the admin panel
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mentors':
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4
              ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Mentorship Requests
            </h2>
            {mentors.length === 0 ? (
              <p className={`text-center py-4
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No new mentorship requests
              </p>
            ) : (
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.userId} className={`p-4 rounded-lg border
                    ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium
                          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                          <Link 
                            to={`/user/${mentor.userId}`}
                            className={`hover:underline
                              ${theme === 'dark' 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-500'}`}
                          >
                            User ID: {mentor.userId}
                          </Link>
                        </h3>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Experience: {mentor.experience} years
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Programming Languages: {mentor.programmingLanguages?.map(lang => getLanguageLabel(lang)).join(', ')}
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          About: {mentor.about}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMentorAction(mentor.id!, true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleMentorAction(mentor.id!, false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'users':
        return <UsersTab />;
      case 'katas':
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4
              ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
              Katas Pending Approval
            </h2>
            {pendingKatas.length === 0 ? (
              <p className={`text-center py-4
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No katas pending approval
              </p>
            ) : (
              <div className="space-y-4">
                {pendingKatas.map((kata) => (
                  <div key={kata.id} className={`p-4 rounded-lg border
                    ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium
                          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
                          {kata.title}
                        </h3>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          ID: {kata.id}
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Programming Language: {getLanguageLabel(kata.programmingLanguage!)}
                        </p>
                        <button
                          onClick={() => handleViewKata(kata)}
                          className={`mt-2 px-3 py-1 rounded-lg font-medium
                            ${theme === 'dark'
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                          Review
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleKataAction(kata.id!, true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleKataAction(kata.id!, false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isDialogOpen && selectedKata && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`max-w-4xl w-full mx-4 rounded-lg shadow-xl
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-lg font-semibold
                        ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        {selectedKata.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedKata.programmingLanguage && (
                          <span className={`px-3 py-1 rounded-full text-sm
                            ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                            {getLanguageLabel(selectedKata.programmingLanguage)}
                          </span>
                        )}
                        {selectedKata.kataDifficulty && (
                          <span className={`px-3 py-1 rounded-full text-sm
                            ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                            {getDifficultyLabel(selectedKata.kataDifficulty)}
                          </span>
                        )}
                        {selectedKata.kataType && (
                          <span className={`px-3 py-1 rounded-full text-sm
                            ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                            {getKataTypeLabel(selectedKata.kataType)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-sm font-medium mb-2
                          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Описание:
                        </h4>
                        <p className={`text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedKata.kataJsonContent?.kataDescription}
                        </p>
                      </div>

                      {selectedKata.kataJsonContent?.sourceCode && (
                        <div>
                          <h4 className={`text-sm font-medium mb-2
                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Исходный код:
                          </h4>
                          <pre className={`p-4 rounded-lg text-sm overflow-x-auto
                            ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
                            {selectedKata.kataJsonContent.sourceCode}
                          </pre>
                        </div>
                      )}

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={handleCloseDialog}
                          disabled={actionLoading}
                          className={`px-4 py-2 rounded-lg font-medium
                            ${theme === 'dark'
                              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50'}`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleKataAction(selectedKata.id!, false)}
                          disabled={actionLoading}
                          className={`px-4 py-2 rounded-lg font-medium text-white
                            ${theme === 'dark'
                              ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                              : 'bg-red-500 hover:bg-red-600 disabled:opacity-50'}`}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleKataAction(selectedKata.id!, true)}
                          disabled={actionLoading}
                          className={`px-4 py-2 rounded-lg font-medium text-white
                            ${theme === 'dark'
                              ? 'bg-green-600 hover:bg-green-700 disabled:opacity-50'
                              : 'bg-green-500 hover:bg-green-600 disabled:opacity-50'}`}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'reports':
        return <ReportsTab />;
      case 'feedback':
        return <FeedbackTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8
          ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
          Admin Panel
        </h1>

        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium
                ${activeTab === tab.id
                  ? theme === 'dark'
                    ? 'bg-primary-dark text-white'
                    : 'bg-primary text-white'
                  : theme === 'dark'
                    ? 'bg-surface-dark text-text-dark hover:bg-surface-dark/80'
                    : 'bg-white text-text-light hover:bg-gray-50'}`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className={`rounded-lg shadow-md p-6
          ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.all();
      setUsers(response);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async (userId: number) => {
    try {
      await apiClient.ban(userId);
      await fetchUsers();
      notify.success('User has been successfully banned');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUnban = async (userId: number) => {
    try {
      await apiClient.unban(userId);
      await fetchUsers();
      notify.success('User has been successfully unbanned');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const dto = new ChangeUserRoleDto({
        userId: userId,
        roleName: newRole
      });
      await apiClient.role(dto);
      await fetchUsers();
      notify.success('User role has been successfully changed');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        User Management
      </h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <Link 
                  to={`/user/${user.id}`}
                  className={`font-medium hover:underline
                    ${theme === 'dark' 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-500'}`}
                >
                  {user.username}
                </Link>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Role: {user.roleId === 1 ? 'Admin' : user.roleId === 2 ? 'Mentor' : 'User'}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status: {user.isBanned ? (
                    <span className="text-red-500">Banned</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <select
                    value={user.roleId}
                    onChange={(e) => handleRoleChange(user.id!, e.target.value)}
                    className={`px-3 py-1 text-sm rounded
                      ${theme === 'dark' 
                        ? 'bg-gray-700 text-gray-200 border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'}`}
                  >
                    <option value="1">User</option>
                    <option value="2">Mentor</option>
                    <option value="3">Administrator</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  {!user.isBanned ? (
                    <button
                      onClick={() => handleBan(user.id!)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnban(user.id!)}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Unban
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab() {
  return <KataReportsPanel />;
}

function FeedbackTab() {
  return <FeedbackPanel />;
}