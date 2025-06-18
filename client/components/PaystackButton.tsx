import React, { useEffect } from 'react';
import { getConfig } from '../config';

interface PaystackButtonProps {
    email: string;
    amount: number;
    metadata: {
        registry_item_id: string;
        name: string;
        email: string;
        message?: string;
    };
    onSuccess: (response: { reference: string }) => void;
    onClose: () => void;
}

declare global {
    interface Window {
        PaystackPop: any;
    }
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
    email,
    amount,
    metadata,
    onSuccess,
    onClose
}) => {
    useEffect(() => {
        // Load Paystack script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        // Check if Paystack key is configured
        const paystackKey = getConfig().paystackPublicKey;
        if (!paystackKey) {
            console.error(
                'Paystack public key not found. This usually means:\n' +
                '1. In development: Missing VITE_PAYSTACK_PUBLIC_KEY in .env file\n' +
                '2. In production: Missing environment variable in Netlify dashboard\n' +
                'Please check the configuration and deploy again.'
            );
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const paystackKey = getConfig().paystackPublicKey;

        // Enhanced debugging logs
        console.log('Payment Configuration Status:', {
            email,
            amount,
            metadata,
            environment: window.location.hostname === 'localhost' ? 'development' : 'production',
            paystackKeyConfigured: !!paystackKey,
            hostname: window.location.hostname
        });

        // Validate required parameters
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (!metadata.name) {
            alert('Please enter your name');
            return;
        }
        if (!metadata.registry_item_id) {
            alert('Invalid registry item');
            return;
        }
        if (!paystackKey) {
            alert(
                'Payment configuration error: Paystack public key not found.\n\n' +
                'If you are seeing this in production, please contact support.'
            );
            return;
        }

        try {
            const handler = window.PaystackPop?.setup({
                key: paystackKey,
                email,
                amount: Math.round(amount * 100), // Convert to kobo
                currency: 'NGN',
                ref: (new Date()).getTime().toString(),
                metadata: {
                    registry_item_id: metadata.registry_item_id,
                    name: metadata.name,
                    email: metadata.email,
                    message: metadata.message,
                    custom_fields: [
                        {
                            display_name: "Registry Item",
                            variable_name: "registry_item_id",
                            value: metadata.registry_item_id
                        }
                    ]
                },
                callback: (response: { reference: string }) => {
                    onSuccess(response);
                },
                onClose: () => {
                    onClose();
                }
            });

            handler.openIframe();
        } catch (error: any) {
            console.error('Payment initialization failed:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#8B6508] transition-colors"
        >
            Pay with Paystack
        </button>
    );
};

export default PaystackButton; 