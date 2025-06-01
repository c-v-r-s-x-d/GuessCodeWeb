import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, UserIcon, CodeBracketIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../services/apiClient';
import { MentorDto, KataDto, ChangeUserRoleDto, UserDto } from '../services/api.generated';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getLanguageLabel } from '../utils/enumHelpers';
import { notify, handleApiError } from '../utils/notifications';

type TabType = 'mentors' | 'users' | 'katas' | 'reports';

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
];

export default function AdminPanel() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('mentors');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mentors, setMentors] = useState<MentorDto[]>([]);
  const [pendingKatas, setPendingKatas] = useState<KataDto[]>([]);

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
      await apiClient.pendingKatas(kataId, isApproved);
      setPendingKatas(pendingKatas.filter(kata => kata.id !== kataId));
      notify.success(`Kata ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      handleApiError(error);
    }
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
                          User ID: {mentor.userId}
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
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Description: {kata.kataJsonContent?.kataDescription}
                        </p>
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
          </div>
        );
      case 'reports':
        return <ReportsTab />;
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
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {user.username}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Role: {user.roleId === 1 ? 'User' : user.roleId === 2 ? 'Moderator' : 'Administrator'}
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
                    <option value="2">Moderator</option>
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
  const { theme } = useTheme();
  const [reports, setReports] = useState([
    { id: 1, type: 'spam', target: 'user1', reporter: 'user2', status: 'pending' },
    { id: 2, type: 'inappropriate', target: 'kata1', reporter: 'user3', status: 'resolved' },
  ]);

  const handleResolve = (id: number) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: 'resolved' } : r
    ));
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Reports and Complaints
      </h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Type: {report.type}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Target: {report.target}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Reporter: {report.reporter}
                </p>
              </div>
              <div>
                {report.status === 'pending' ? (
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}