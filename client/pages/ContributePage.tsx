import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRegistryItemByShareUrl } from '../utils/api';
import ContributionForm from '../components/ContributionForm';

const ContributePage: React.FC = () => {
    const { shareUrl, itemId } = useParams<{ shareUrl: string; itemId: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (!shareUrl || !itemId) {
                    throw new Error('Share URL and Item ID are required');
                }
                const data = await getRegistryItemByShareUrl(shareUrl, itemId);
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

    const totalCost = item.price * item.quantity;
    const remainingAmount = totalCost - item.contributions_received;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={() => navigate(`/${shareUrl}`)}
                    className="mb-4 inline-flex items-center text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Registry
                </button>
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
                            <div className="mb-4 space-y-1">
                                <p className="text-sm text-gray-600 font-medium">Price: ₦{Number(item.price).toLocaleString()} <span className="text-gray-400 font-normal">(Qty: {item.quantity})</span></p>
                                <p className="text-sm text-gray-600 font-medium">Total Cost: ₦{Number(totalCost).toLocaleString()}</p>
                                <p className="text-sm text-gray-600 font-medium">Contributions Received: ₦{Number(item.contributions_received).toLocaleString()}</p>
                                <p className="text-sm text-[#B8860B] font-bold text-base">Remaining: ₦{Number(remainingAmount).toLocaleString()}</p>
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