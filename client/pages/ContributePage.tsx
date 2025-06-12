import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRegistryItem } from '../utils/api';
import ContributionForm from '../components/ContributionForm';

const ContributePage: React.FC = () => {
    const { shareUrl, itemId } = useParams<{ shareUrl: string; itemId: string }>();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (!shareUrl || !itemId) {
                    throw new Error('Share URL and Item ID are required');
                }
                const data = await getRegistryItem(shareUrl, itemId);
                setItem(data);
            } catch (err) {
                setError('Failed to load item details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [shareUrl, itemId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading item details...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600">{error || 'Item not found'}</p>
                </div>
            </div>
        );
    }

    const remainingAmount = item.price - item.contributions_received;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h1>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Price: ${item.price}</p>
                                <p className="text-sm text-gray-500">Contributions Received: ${item.contributions_received}</p>
                                <p className="text-sm text-gray-500">Remaining: ${remainingAmount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-200">
                        <ContributionForm
                            registryItemId={item.id}
                            itemName={item.name}
                            price={item.price}
                            remainingAmount={remainingAmount}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributePage; 