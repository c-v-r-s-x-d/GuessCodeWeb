import React, { useEffect, useState } from 'react';
import { ReportKataDto, KataDto } from '../../services/api.generated';
import { useTheme } from '../../context/ThemeContext';
import { notify } from '../../utils/notifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { apiClient } from '../../services/apiClient';
import { Link } from 'react-router-dom';

export const KataReportsPanel: React.FC = () => {
    const [reports, setReports] = useState<ReportKataDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<ReportKataDto | null>(null);
    const [selectedKata, setSelectedKata] = useState<KataDto | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const { theme } = useTheme();

    const fetchReports = async () => {
        try {
            setLoading(true);
            const reportsData = await apiClient.reportedKatasAll();
            setReports(reportsData);
            setError(null);
        } catch (err) {
            setError('Ошибка при загрузке репортов');
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleViewKata = async (report: ReportKataDto) => {
        try {
            setLoading(true);
            const kata = await apiClient.kataSearch(report.kataId!);
            setSelectedKata(kata);
            setSelectedReport(report);
            setIsDialogOpen(true);
        } catch (err) {
            notify.error('Ошибка при загрузке ката');
            console.error('Error fetching kata:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedKata(null);
        setSelectedReport(null);
    };

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!selectedReport?.kataId) return;

        try {
            setActionLoading(true);
            if (action === 'approve') {
                await apiClient.kataAdministrationDELETE(selectedReport.kataId);
                notify.success('Kata deleted');
            } else {
                await apiClient.reportedKatas(selectedReport.kataId);
                notify.success('Report declined');
            }
            setIsDialogOpen(false);
            fetchReports();
        } catch (err) {
            notify.error('Ошибка при выполнении действия');
            console.error('Error performing action:', err);
        } finally {
            setActionLoading(false);
        }
    };

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
                Kata reports
            </h2>

            <div className={`overflow-x-auto rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Kata ID
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Report reason
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                User ID
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200
                        ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {reports.map((report) => (
                            <tr key={`${report.kataId}-${report.userId}`}
                                className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm
                                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                    {report.kataId}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm
                                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                    {report.reason}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm
                                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                                    <Link 
                                        to={`/user/${report.userId}`}
                                        className={`hover:underline
                                            ${theme === 'dark' 
                                                ? 'text-blue-400 hover:text-blue-300' 
                                                : 'text-blue-600 hover:text-blue-500'}`}
                                    >
                                        {report.userId}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => {
                                            setSelectedReport(report);
                                            handleViewKata(report);
                                        }}
                                        className={`px-3 py-1 rounded-lg font-medium
                                            ${theme === 'dark'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={4} className={`px-6 py-4 text-center text-sm
                                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Нет активных жалоб
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-4xl w-full mx-4 rounded-lg shadow-xl
                        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-6">
                            <h3 className={`text-lg font-semibold mb-4
                                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                Kata review
                                {selectedKata && ` - ${selectedKata.title}`}
                            </h3>

                            {selectedKata && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className={`text-sm font-medium mb-2
                                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Description:
                                        </h4>
                                        <p className={`text-sm
                                            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {selectedKata.kataJsonContent?.kataDescription}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className={`text-sm font-medium mb-2
                                            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Source code:
                                        </h4>
                                        <pre className={`p-4 rounded-lg text-sm overflow-x-auto
                                            ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
                                            {selectedKata.kataJsonContent?.sourceCode}
                                        </pre>
                                    </div>

                                    {selectedReport && (
                                        <div>
                                            <h4 className={`text-sm font-medium mb-2
                                                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Report reason:
                                            </h4>
                                            <p className={`text-sm text-red-500`}>
                                                {selectedReport.reason}
                                            </p>
                                        </div>
                                    )}
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
                                    onClick={() => handleAction('reject')}
                                    disabled={actionLoading}
                                    className={`px-4 py-2 rounded-lg font-medium text-white
                                        ${theme === 'dark'
                                            ? 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                                            : 'bg-blue-500 hover:bg-blue-600 disabled:opacity-50'}`}
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={() => handleAction('approve')}
                                    disabled={actionLoading}
                                    className={`px-4 py-2 rounded-lg font-medium text-white
                                        ${theme === 'dark'
                                            ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                                            : 'bg-red-500 hover:bg-red-600 disabled:opacity-50'}`}
                                >
                                    Delete kata
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 