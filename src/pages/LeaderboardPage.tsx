// src/pages/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import { Award, Star } from 'react-feather';
import useQuizStore from '../store/quizStore';
import { API_BASE_URL } from '../config';

interface Player {
    rank: number;
    username: string;
    score: number;
    time_taken: number;
}
console.log(API_BASE_URL)

const LeaderboardPage = () => {
    const { username } = useQuizStore();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            }
        };

        // Fetch initial data
        fetchLeaderboard();

        // Set up auto-refresh every 5 seconds
        const interval = setInterval(fetchLeaderboard, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) {
            return <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500" />;
        }
        return <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-gray-600 font-bold text-xs sm:text-sm">{rank}</span>;
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-orange-600 font-bold';
        if (score >= 6) return 'text-orange-500 font-semibold';
        return 'text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center">
                        <Award className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            <span className="block sm:inline">Classement</span>
                            <span className="block sm:inline sm:ml-1">Orange CyberQuiz 2025</span>
                        </h1>
                    </div>
           
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-orange-100">
                    <div className="bg-orange-500 px-4 sm:px-6 py-3 sm:py-4">
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Classement
                        </h2>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-orange-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">Rang</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">Nom</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">Score</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-800">Temps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player) => (
                                    <tr 
                                        key={`${player.username}-${player.rank}`}
                                        className={`
                                            border-b border-gray-100 transition-all hover:bg-gray-50
                                            ${player.username === username 
                                                ? 'bg-orange-50 border-orange-200' 
                                                : ''
                                            }
                                        `}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {getRankIcon(player.rank)}
                                                {player.rank === 1 && (
                                                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">
                                                        #1
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                                                    {player.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={`font-medium ${player.username === username ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>
                                                    {player.username}
                                                    {player.username === username && (
                                                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">
                                                            VOUS
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`text-lg ${getScoreColor(player.score)}`}>
                                                    {player.score}/10
                                                </span>
                                                <div className="ml-3 w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="h-2 bg-orange-500 rounded-full transition-all duration-700"
                                                        style={{ width: `${(player.score / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700 font-medium">
                                                {player.time_taken}s
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden">
                        {players.map((player) => (
                            <div
                                key={`${player.username}-${player.rank}`}
                                className={`
                                    p-4 border-b border-gray-100 transition-all
                                    ${player.username === username 
                                        ? 'bg-orange-50 border-orange-200' 
                                        : ''
                                    }
                                `}
                            >
                                {/* Header with Rank and Name */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="flex items-center mr-3">
                                            {getRankIcon(player.rank)}
                                            {player.rank === 1 && (
                                                <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">
                                                    #1
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm mr-2">
                                            {player.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className={`font-medium text-sm ${player.username === username ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>
                                                {player.username}
                                            </span>
                                            {player.username === username && (
                                                <div className="mt-1">
                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-bold">
                                                        VOUS
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Score and Time */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <span className={`text-lg mr-2 ${getScoreColor(player.score)}`}>
                                                {player.score}/10
                                            </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                                <div 
                                                    className="h-2 bg-orange-500 rounded-full transition-all duration-700"
                                                    style={{ width: `${(player.score / 10) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-gray-100 px-2 py-1 rounded-lg text-gray-700 font-medium text-sm">
                                        {player.time_taken}s
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {players.length === 0 && (
                        <div className="text-center py-8 sm:py-12 px-4">
                            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                                Aucun score enregistré
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                Soyez le premier à jouer !
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;