export const getConfig = () => {
  const env = window.location.hostname === 'localhost' ? 'development' : 'production';
  return {
    apiUrl: env === 'development'
      ? 'http://localhost:5000/api'
      : 'https://theweddingplace.onrender.com/api',
    paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
  };
};