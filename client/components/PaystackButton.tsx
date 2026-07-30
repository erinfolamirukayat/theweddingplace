import React, { useEffect } from 'react';
import { getConfig } from '../config';
import { useNotification } from './Layout';

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
    const { setMessage } = useNotification();
    const [scriptLoaded, setScriptLoaded] = React.useState(!!window.PaystackPop);

    useEffect(() => {
        if (window.PaystackPop) {
            setScriptLoaded(true);
            return;
        }

        // Load Paystack script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => {
            setScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load Paystack inline script');
        };
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
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
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
            setMessage('Please enter your email address', 'error');
            return;
        }
        if (!amount || amount <= 0) {
            setMessage('Please enter a valid amount', 'error');
            return;
        }
        if (!metadata.name) {
            setMessage('Please enter your name', 'error');
            return;
        }
        if (!metadata.registry_item_id) {
            setMessage('Invalid registry item', 'error');
            return;
        }
        if (!paystackKey) {
            setMessage(
                'Payment configuration error: Paystack public key not found. Please contact support.',
                'error'
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
            setMessage('Failed to initialize payment. Please try again.', 'error');
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!scriptLoaded}
            className={`w-full px-6 py-2 text-white rounded-md transition-colors ${
                scriptLoaded 
                    ? 'bg-[#B8860B] hover:bg-[#8B6508]' 
                    : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
            {scriptLoaded ? 'Pay with Paystack' : 'Loading payment gateway...'}
        </button>
    );
};

export default PaystackButton; 