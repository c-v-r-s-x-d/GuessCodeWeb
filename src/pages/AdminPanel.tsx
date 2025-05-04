import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon, UserIcon, CodeBracketIcon, LockClosedIcon } from '@heroicons/react/24/outline';

type TabType = 'mentors' | 'users' | 'katas' | 'reports';

interface Tab {
  id: TabType;
  name: string;
  icon: React.ElementType;
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

  // Временное решение - захардкоженная проверка на администратора
  const isAdmin = true;

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          У вас нет доступа к панели администратора
        </p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mentors':
        return <MentorsTab />;
      case 'users':
        return <UsersTab />;
      case 'katas':
        return <KatasTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Панель администратора
      </h1>

      {/* Табы */}
      <div className="mb-8">
        <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className={`-mb-px flex space-x-8 ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`} aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? theme === 'dark'
                        ? 'border-blue-500 text-blue-500'
                        : 'border-blue-600 text-blue-600'
                      : theme === 'dark'
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${activeTab === tab.id
                        ? theme === 'dark'
                          ? 'text-blue-500'
                          : 'text-blue-600'
                        : theme === 'dark'
                          ? 'text-gray-400 group-hover:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Контент таба */}
      <div className={`rounded-lg shadow-md p-6
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        {renderTabContent()}
      </div>
    </div>
  );
}

// Компоненты для каждого таба
function MentorsTab() {
  const { theme } = useTheme();
  const [mentors, setMentors] = useState([
    { id: 1, name: 'Иван Иванов', status: 'pending', experience: '5 лет', rating: 4.8 },
    { id: 2, name: 'Петр Петров', status: 'approved', experience: '3 года', rating: 4.5 },
    { id: 3, name: 'Анна Сидорова', status: 'rejected', experience: '7 лет', rating: 4.9 },
  ]);

  const handleApprove = (id: number) => {
    setMentors(mentors.map(m => 
      m.id === id ? { ...m, status: 'approved' } : m
    ));
  };

  const handleReject = (id: number) => {
    setMentors(mentors.map(m => 
      m.id === id ? { ...m, status: 'rejected' } : m
    ));
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Заявки на менторство
      </h2>
      <div className="space-y-4">
        {mentors.map((mentor) => (
          <div key={mentor.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {mentor.name}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Опыт: {mentor.experience}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Рейтинг: {mentor.rating}
                </p>
              </div>
              <div className="flex gap-2">
                {mentor.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(mentor.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(mentor.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                {mentor.status === 'approved' && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded">
                    Одобрено
                  </span>
                )}
                {mentor.status === 'rejected' && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded">
                    Отклонено
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

function KatasTab() {
  const { theme } = useTheme();
  const [katas, setKatas] = useState([
    { id: 1, title: 'Two Sum', author: 'user1', status: 'pending', type: 'Algorithm' },
    { id: 2, title: 'Code Review', author: 'user2', status: 'approved', type: 'Code Reading' },
  ]);

  const handleApprove = (id: number) => {
    setKatas(katas.map(k => 
      k.id === id ? { ...k, status: 'approved' } : k
    ));
  };

  const handleReject = (id: number) => {
    setKatas(katas.map(k => 
      k.id === id ? { ...k, status: 'rejected' } : k
    ));
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4
        ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Управление катами
      </h2>
      <div className="space-y-4">
        {katas.map((kata) => (
          <div key={kata.id} className={`p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {kata.title}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Автор: {kata.author}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Тип: {kata.type}
                </p>
              </div>
              <div className="flex gap-2">
                {kata.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(kata.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(kata.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Отклонить
                    </button>
                  </>
                )}
                {kata.status === 'approved' && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded">
                    Одобрено
                  </span>
                )}
                {kata.status === 'rejected' && (
                  <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded">
                    Отклонено
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