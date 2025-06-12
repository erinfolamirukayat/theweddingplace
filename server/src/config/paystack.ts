export const PAYSTACK_CONFIG = {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    baseUrl: 'https://api.paystack.co',
    callbackUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment/verify` : 'http://localhost:5173/payment/verify'
}; 