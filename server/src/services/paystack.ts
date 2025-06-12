import axios from 'axios';
import { PAYSTACK_CONFIG } from '../config/paystack';

export class PaystackService {
    private static instance: PaystackService;
    private readonly headers: { Authorization: string };

    private constructor() {
        if (!PAYSTACK_CONFIG.secretKey) {
            throw new Error('Paystack secret key is not configured');
        }
        this.headers = {
            Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`
        };
    }

    public static getInstance(): PaystackService {
        if (!PaystackService.instance) {
            PaystackService.instance = new PaystackService();
        }
        return PaystackService.instance;
    }

    async initializeTransaction(data: {
        email: string;
        amount: number;
        metadata: {
            registry_item_id: string;
            name: string;
            email: string;
            message?: string;
        };
    }) {
        try {
            const response = await axios.post(
                `${PAYSTACK_CONFIG.baseUrl}/transaction/initialize`,
                {
                    email: data.email,
                    amount: data.amount * 100, // Convert to kobo
                    callback_url: PAYSTACK_CONFIG.callbackUrl,
                    metadata: data.metadata
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error initializing Paystack transaction:', error);
            throw error;
        }
    }

    async verifyTransaction(reference: string) {
        try {
            const response = await axios.get(
                `${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error verifying Paystack transaction:', error);
            throw error;
        }
    }
} 