import React, { useState } from 'react';
import { FeedbackDto } from '../services/api.generated';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notify } from '../utils/notifications';
import { apiClient } from '../services/apiClient';

interface FeedbackProps {
    className?: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { theme } = useTheme();

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setMessage('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            setError('Пожалуйста, введите сообщение');
            return;
        }

        if (!user?.userId) {
            setError('Необходимо авторизоваться для отправки фидбека');
            return;
        }

        try {
            const feedbackDto = new FeedbackDto({
                message: message.trim()
            });

            await apiClient.feedback(feedbackDto);
            notify.success('Successfully sent!');
            handleClose();
        } catch (err) {
            setError('Error');
            console.error('Error submitting feedback:', err);
        }
    };

    return (
        <div>
            <button
                onClick={handleOpen}
                className={className || `px-3 py-1 rounded-lg font-medium
                    ${theme === 'dark'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                GuessCode feedback
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-md w-full mx-4 rounded-lg shadow-xl
                        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4
                                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                Feedback
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="message" className={`block text-sm font-medium mb-2
                                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Your message:
                                    </label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-lg border
                                            ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                        rows={4}
                                        placeholder="Describe your feelings and problems..."
                                    />
                                </div>

                                {error && (
                                    <div className={`p-3 rounded-lg text-sm
                                        ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-800'}`}>
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={handleClose}
                                        className={`px-4 py-2 rounded-lg font-medium
                                            ${theme === 'dark'
                                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className={`px-4 py-2 rounded-lg font-medium text-white
                                            ${theme === 'dark'
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 