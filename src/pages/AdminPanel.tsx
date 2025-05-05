import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, UserIcon, CodeBracketIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../services/apiClient';
import { MentorDto, KataDto } from '../services/api.generated';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getLanguageLabel } from '../utils/enumHelpers';

type TabType = 'mentors' | 'users' | 'katas' | 'reports';

interface Tab {
  id: TabType;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const tabs: Tab[] = [
  { id: 'mentors', name: 'Менторы', icon: ShieldCheckIcon },
  { id: 'users', name: 'Пользователи', icon: UserIcon },
  { id: 'katas', name: 'Каты', icon: CodeBracketIcon },
  { id: 'reports', name: 'Жалобы', icon: LockClosedIcon },
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
        // TODO: Добавить API для проверки статуса администратора
        // const response = await apiClient.api.checkAdminStatus();
        // setIsAdmin(response.data.isAdmin);
        setIsAdmin(true); // Временное решение
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
    } catch (error) {
      console.error('Error handling mentor action:', error);
      alert('Произошла ошибка при обработке запроса ментора');
    }
  };

  const handleKataAction = async (kataId: number, isApproved: boolean) => {
    try {
      await apiClient.pendingKatas(kataId, isApproved);
      setPendingKatas(pendingKatas.filter(kata => kata.id !== kataId));
    } catch (error) {
      console.error('Error handling kata action:', error);
      alert('Произошла ошибка при обработке каты');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg text-center
          ${theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
          У вас нет доступа к панели администратора
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
              Запросы на менторство
            </h2>
            {mentors.length === 0 ? (
              <p className={`text-center py-4
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Нет новых запросов на менторство
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
                          ID пользователя: {mentor.userId}
                        </h3>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Опыт: {mentor.experience} лет
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Языки программирования: {mentor.programmingLanguages?.map(lang => getLanguageLabel(lang)).join(', ')}
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          О себе: {mentor.about}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMentorAction(mentor.id!, true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleMentorAction(mentor.id!, false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Отклонить
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
              Каты на согласование
            </h2>
            {pendingKatas.length === 0 ? (
              <p className={`text-center py-4
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Нет кат, ожидающих согласования
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
                          Язык программирования: {getLanguageLabel(kata.programmingLanguage!)}
                        </p>
                        <p className={`mt-1
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Описание: {kata.kataJsonContent?.kataDescription}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleKataAction(kata.id!, true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleKataAction(kata.id!, false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Отклонить
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
          Панель администратора
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

// Компоненты для остальных табов
function UsersTab() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([
    { id: 1, name: 'user1', email: 'user1@example.com', status: 'active', lastLogin: '2024-03-01' },
    { id: 2, name: 'user2', email: 'user2@example.com', status: 'blocked', lastLogin: '2024-02-15' },
  ]);

  const handleBlock = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: 'blocked' } : u
    ));
  };

  const handleUnblock = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: 'active' } : u
    ));
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Управление пользователями
      </h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {user.name}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Последний вход: {user.lastLogin}
                </p>
              </div>
              <div>
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleBlock(user.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Заблокировать
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnblock(user.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Разблокировать
                  </button>
                )}
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
        Жалобы и отчеты
      </h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  Тип: {report.type}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Объект: {report.target}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Отправитель: {report.reporter}
                </p>
              </div>
              <div>
                {report.status === 'pending' ? (
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Решить
                  </button>
                ) : (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded">
                    Решено
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