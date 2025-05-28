const config = {
  development: {
    apiUrl: 'http://localhost:5000/api'
  },
  production: {
    apiUrl: 'https://theweddingplace.onrender.com/api'
  }
};

export const getConfig = () => {
  const env = window.location.hostname === 'localhost' ? 'development' : 'production';
  return config[env];
}; 