
import { useEffect, useState } from 'react';
import useQuizStore, { useQuizActions } from '../store/quizStore';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

interface Submission {
  username: string;
  score: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

const AdminPage = () => {
    const { quizSettings, adminKey } = useQuizStore();
    const actions = useQuizActions();
    const { fetchAdminQuizSettings, updateQuizSettings } = actions;
    const [participantCount, setParticipantCount] = useState(0);
    const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        if (adminKey) {
            fetchAdminQuizSettings();
        }
    }, [adminKey, fetchAdminQuizSettings]);

    useEffect(() => {
        const socket = io(API_BASE_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // Initialization events
        socket.on('participant_count_init', (count) => {
            setParticipantCount(count);
        });

        socket.on('leaderboard_init', (initialLeaderboard) => {
            setLeaderboard(initialLeaderboard);
        });

        // Real-time update events
        socket.on('user_registered', (_user) => {
            setParticipantCount(prevCount => prevCount + 1);
        });

        socket.on('attempt_submitted', (submission) => {
            setRecentSubmissions(prev => [submission, ...prev].slice(0, 5));
        });

        socket.on('leaderboard_updated', (newLeaderboard) => {
            setLeaderboard(newLeaderboard);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleToggleOpen = () => {
        if (quizSettings) {
            updateQuizSettings({ is_open: !quizSettings.is_open });
        }
    };

    if (!adminKey) {
        return <p>Please login first.</p>;
    }

    if (!quizSettings) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-10 pb-4 border-b-2 border-orange-300">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Settings Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-lg font-medium text-gray-700">Quiz Status</span>
                                <button
                                    onClick={handleToggleOpen}
                                    className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${quizSettings.is_open ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}>
                                    {quizSettings.is_open ? 'Open' : 'Closed'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 col-span-1 md:col-span-2">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Live Statistics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-orange-50 p-6 rounded-xl text-center border border-orange-200">
                                <p className="text-5xl font-extrabold text-orange-600 mb-2">{participantCount}</p>
                                <p className="text-lg text-gray-600">Participants</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                <h3 className="text-xl font-bold text-blue-800 mb-4">Recent Submissions</h3>
                                <ul className="space-y-2">
                                    {recentSubmissions.map((sub, i) => (
                                        <li key={i} className="text-base text-gray-700 flex justify-between items-center">
                                            <span>{sub.username}</span>
                                            <span className="font-semibold text-blue-600">{sub.score} points</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Live Leaderboard</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left bg-white rounded-xl">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Rank</th>
                                    <th className="py-3 px-6 text-left">Username</th>
                                    <th className="py-3 px-6 text-left">Score</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                                {leaderboard.slice(0, 10).map((entry, index) => (
                                    <tr key={entry.rank} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="py-3 px-6 text-left whitespace-nowrap">{entry.rank}</td>
                                        <td className="py-3 px-6 text-left">{entry.username}</td>
                                        <td className="py-3 px-6 text-left font-medium">{entry.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
