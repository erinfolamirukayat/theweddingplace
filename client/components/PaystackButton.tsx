import React, { useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
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
    onSuccess: (reference: string) => void;
    onClose: () => void;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
    email,
    amount,
    metadata,
    onSuccess,
    onClose
}) => {
    // Log the Paystack public key for debugging
    console.log('Paystack Public Key:', getConfig().paystackPublicKey);

    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount: Math.round(amount * 100), // Convert to kobo and ensure it's an integer
        publicKey: getConfig().paystackPublicKey,
        metadata: {
            registry_item_id: metadata.registry_item_id,
            name: metadata.name,
            email: metadata.email,
            message: metadata.message
        },
        currency: 'NGN'
    };

    const initializePayment = usePaystackPayment(config);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Log the configuration for debugging
        console.log('Paystack Config:', {
            ...config,
            publicKey: '***' // Hide the public key in logs
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

        try {
            initializePayment(onSuccess, onClose);
        } catch (error) {
            console.error('Payment initialization failed:', error);
            if (error && typeof error === 'object' && 'issues' in error) {
                // @ts-ignore
                console.error('Paystack issues:', error.issues);
            }
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