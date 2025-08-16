import axios from 'axios';
import { PAYSTACK_CONFIG } from '../config/paystack';

interface InitializeTransactionResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

interface VerifyTransactionResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        status: 'success' | 'failed' | 'abandoned';
        reference: string;
        amount: number;
        customer: {
            email: string;
        };
        metadata: any;
    };
}
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
    }): Promise<InitializeTransactionResponse> {
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
            if (axios.isAxiosError(error)) {
                console.error('Error initializing Paystack transaction:', error.response?.data || error.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
            throw error;
        }
    }

    async verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
        try {
            const response = await axios.get(
                `${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error verifying Paystack transaction:', error.response?.data || error.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
            throw error;
        }
    }
} 