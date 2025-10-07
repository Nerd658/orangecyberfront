import { useEffect, useState } from 'react';
import { Shield, Star } from 'react-feather';
import { API_BASE_URL } from '../config';

interface CapturedCuid {
    id: number;
    cuid: string;
    created_at: string;
}

const DashboardPage = () => {
    const [cuids, setCuids] = useState<CapturedCuid[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCuids = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/cuids`);
                const data = await response.json();
                if (data.success) {
                    setCuids(data.cuids);
                }
            } catch (error) {
                console.error("Failed to fetch CUIDs:", error);
            }
            setIsLoading(false);
        };

        fetchCuids();
    }, []);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center">
                    <Shield className="mr-3 w-8 h-8 text-orange-500" />
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard CUIDs</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-orange-500 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">CUIDs Capturés</h2>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-500">Chargement des données...</div>
                        ) : cuids.length > 0 ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Rang</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-600">CUID</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-600">Date de capture</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuids.map((item, index) => (
                                        <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index === 0 ? 'bg-orange-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                {index === 0 ? (
                                                    <div className="flex items-center">
                                                        <Star className="w-5 h-5 text-orange-500 fill-orange-500 mr-2" />
                                                        <span className="font-bold text-orange-600">First</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-gray-600">{index + 1}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-800">{item.cuid}</td>
                                            <td className="px-6 py-4 text-gray-600">{formatDateTime(item.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12 text-gray-500">Aucun CUID capturé pour le moment.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;