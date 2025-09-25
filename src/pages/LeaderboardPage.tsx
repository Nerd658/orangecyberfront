// src/pages/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import { Award, Play, Star } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import useQuizStore from '../store/quizStore';

interface Player {
    rank: number;
    username: string;
    score: number;
    time_taken: number;
}

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const { username } = useQuizStore();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/leaderboard');
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) {
            return <Star className="w-5 h-5 text-orange-500 fill-orange-500" />;
        }
        return <span className="w-5 h-5 flex items-center justify-center text-gray-600 font-bold text-sm">{rank}</span>;
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-orange-600 font-bold';
        if (score >= 6) return 'text-orange-500 font-semibold';
        return 'text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <Award className="mr-3 w-8 h-8 text-orange-500" />
                        <h1 className="text-3xl font-bold text-gray-800">Classement CyberQuiz 2025</h1>
                    </div>
                    <button
                        onClick={() => navigate('/quiz')}
                        className="flex items-center rounded-full bg-orange-500 px-6 py-3 font-medium text-white transition-all hover:bg-orange-600 hover:scale-105"
                    >
                        <Play size={16} className="mr-2" />
                        Jouer
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
                    <div className="bg-orange-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Award className="w-6 h-6 mr-2" />
                            Classement
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
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

                    {players.length === 0 && (
                        <div className="text-center py-12">
                            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                Aucun score enregistré
                            </h3>
                            <p className="text-gray-500">
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