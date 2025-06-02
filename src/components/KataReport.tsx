import React, { useState } from 'react';
import { ReportKataDto } from '../services/api.generated';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notify } from '../utils/notifications';
import { apiClient } from '../services/apiClient';

interface KataReportProps {
    kataId: number;
    onReportSubmitted?: () => void;
}

export const KataReport: React.FC<KataReportProps> = ({ kataId, onReportSubmitted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { theme } = useTheme();

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setReason('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError('Пожалуйста, укажите причину репорта');
            return;
        }

        if (!user?.userId) {
            setError('Необходимо авторизоваться для отправки жалобы');
            return;
        }

        try {
            const reportDto = new ReportKataDto({
                kataId: kataId,
                reason: reason.trim(),
                userId: user.userId
            });

            await apiClient.kataReport(reportDto);
            notify.success('Report sent');
            handleClose();
            if (onReportSubmitted) {
                onReportSubmitted();
            }
        } catch (err) {
            setError('Ошибка при отправке жалобы');
            console.error('Error submitting report:', err);
        }
    };

    return (
        <div>
            <button
                onClick={handleOpen}
                className={`px-3 py-1 rounded-lg font-medium text-sm
                    ${theme === 'dark'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'}`}
            >
                Report
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-md w-full mx-4 rounded-lg shadow-xl
                        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4
                                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                Send a report
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="reason" className={`block text-sm font-medium mb-2
                                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Report reason:
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-lg border
                                            ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                        rows={4}
                                        placeholder="Please, write what is exactly wrong..."
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
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-red-500 hover:bg-red-600'}`}
                                    >
                                        Submit
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