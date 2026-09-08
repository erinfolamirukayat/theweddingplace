export const getConfig = () => {
  const env = window.location.hostname === 'localhost' ? 'development' : 'production';
  
  // Robustly handle VITE_API_URL even if it is set incorrectly in Netlify
  let prodUrl = import.meta.env.VITE_API_URL || 'https://theweddingplace.onrender.com/api';
  if (prodUrl.endsWith('/')) prodUrl = prodUrl.slice(0, -1);
  if (!prodUrl.endsWith('/api')) prodUrl += '/api';

  return {
    apiUrl: env === 'development'
      ? 'http://localhost:5000/api'
      // @ts-ignore
      : prodUrl,
    // @ts-ignore
    paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
  };
};