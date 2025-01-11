import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../services/apiClient';
import { LeaderboardPositionDto, Rank } from '../services/api.generated';
import LoadingSpinner from '../components/common/LoadingSpinner';

const getRankLabel = (rank: Rank): string => {
  switch (rank) {
    case Rank.Value1: return '1 kyu';
    case Rank.Value2: return '2 kyu';
    case Rank.Value3: return '3 kyu';
    case Rank.Value4: return '4 kyu';
    case Rank.Value5: return '5 kyu';
    case Rank.Value6: return '6 kyu';
    case Rank.Value7: return '7 kyu';
    case Rank.Value20: return '8 kyu';
    default: return 'Unranked';
  }
};

export default function Leaderboard() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardPositionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await apiClient.api.leaderboardList();
        setLeaderboard(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg text-center
        ${theme === 'dark' ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}`}>
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-text-dark' : 'text-text-light'}`}>
        Leaderboard
      </h1>
      
      <div className={`rounded-lg shadow-md overflow-hidden
        ${theme === 'dark' ? 'bg-surface-dark' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-sm font-semibold
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Position
              </th>
              <th className={`px-6 py-3 text-left text-sm font-semibold
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                User
              </th>
              <th className={`px-6 py-3 text-left text-sm font-semibold
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Rank
              </th>
              <th className={`px-6 py-3 text-left text-sm font-semibold
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Rating
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {leaderboard.map((position, index) => (
              <tr key={position.userId} className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                <td className={`px-6 py-4 text-sm
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  #{index + 1}
                </td>
                <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  <span className="text-sm font-medium">{position.username}</span>
                </td>
                <td className={`px-6 py-4 text-sm
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {position.rank && getRankLabel(position.rank)}
                </td>
                <td className={`px-6 py-4 text-sm
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {position.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 