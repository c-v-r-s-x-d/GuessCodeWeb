import React, { useEffect, useState } from 'react';
import { FeedbackDto, ProfileInfoDto } from '../../services/api.generated';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { apiClient } from '../../services/apiClient';
import { Link } from 'react-router-dom';

interface FeedbackWithUser {
    message?: string;
    user?: ProfileInfoDto;
    createdAt?: string;
}

export const FeedbackPanel: React.FC = () => {
    const [feedback, setFeedback] = useState<FeedbackWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const feedbackData = await apiClient.feedbackAll();
            
            // Получаем информацию о пользователях для каждого фидбека
            const feedbackWithUsers = await Promise.all(
                feedbackData.map(async (item) => {
                    try {
                        const feedbackItem: FeedbackWithUser = {
                            message: item.message,
                            createdAt: (item as any).createdAt
                        };

                        // Получаем userId из токена, так как он не приходит с сервера
                        const userId = (item as any).userId;
                        if (userId) {
                            const userInfo = await apiClient.profileInfoGET(userId);
                            feedbackItem.user = userInfo;
                        }
                        return feedbackItem;
                    } catch (err) {
                        console.error('Error fetching user info:', err);
                        return item as FeedbackWithUser;
                    }
                })
            );

            setFeedback(feedbackWithUsers);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке обратной связи');
            console.error('Error fetching feedback:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 rounded-lg mb-4
                ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className={`text-xl font-semibold
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                User Feedback
            </h2>

            <div className={`space-y-4
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                {feedback.length === 0 ? (
                    <p className={`text-center py-4
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        No feedback yet
                    </p>
                ) : (
                    feedback.map((item, index) => (
                        <div key={index} className={`p-6 rounded-lg border
                            ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.user?.avatarUrl 
                                            ? `${process.env.REACT_APP_API_URL}/static/${item.user.avatarUrl}`
                                            : '/default-avatar.png'}
                                        alt={item.user?.username || 'User'}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {item.user ? (
                                                <Link 
                                                    to={`/user/${item.user.userId}`}
                                                    className={`font-medium hover:underline
                                                        ${theme === 'dark' 
                                                            ? 'text-blue-400 hover:text-blue-300' 
                                                            : 'text-blue-600 hover:text-blue-500'}`}
                                                >
                                                    {item.user.username}
                                                </Link>
                                            ) : (
                                                <p className={`font-medium
                                                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    Anonymous User
                                                </p>
                                            )}
                                            {item.createdAt && (
                                                <p className={`text-sm
                                                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            )}
                                        </div>
                                        {item.user?.activityStatus && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${theme === 'dark' 
                                                    ? item.user.activityStatus === 3 
                                                        ? 'bg-green-900 text-green-300'
                                                        : 'bg-gray-700 text-gray-300'
                                                    : item.user.activityStatus === 3
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'}`}>
                                                {item.user.activityStatus === 3 ? 'Online' : 'Offline'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <p className={`text-sm whitespace-pre-wrap
                                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {item.message}
                                        </p>
                                    </div>
                                    {item.user?.description && (
                                        <div className="mt-2">
                                            <p className={`text-xs italic
                                                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                About user: {item.user.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}; 