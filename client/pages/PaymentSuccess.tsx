import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConfig } from '../config';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const reference = searchParams.get('reference');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setVerificationStatus('error');
                return;
            }

            try {
                const response = await fetch(`${getConfig().apiUrl}/payments/verify?reference=${reference}`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    setVerificationStatus('success');
                } else {
                    setVerificationStatus('error');
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                setVerificationStatus('error');
            }
        };

        verifyPayment();
    }, [reference]);

    if (verificationStatus === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
                {verificationStatus === 'success' ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your contribution. The couple will be notified of your gift.</p>
                        <button
                            onClick={() => navigate(-2)} // Go back to registry view
                            className="px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
                        >
                            Return to Registry
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
                        <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support if you've been charged.</p>
                        <button
                            onClick={() => navigate(-2)}
                            className="px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
                        >
                            Return to Registry
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess; 