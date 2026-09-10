import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../utils/api';
import { useNotification } from '../components/Layout';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const { setMessage: setGlobalMessage } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid verification link. Missing parameters.');
      return;
    }

    verifyEmail(email, token)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        setTimeout(() => {
          setGlobalMessage('Email verified successfully! You can now log in.', 'success');
          navigate('/login');
        }, 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have expired or is invalid.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-[#2C1810] mb-4">Email Verification</h2>
      
      {status === 'verifying' && (
        <div className="py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8860B] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email address...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-8">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <p className="text-lg text-gray-800 mb-6">{message}</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to login...</p>
          <Link to="/login" className="inline-block px-6 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508] transition-colors">
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="py-8">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <p className="text-lg text-gray-800 mb-6">{message}</p>
          <Link to="/" className="inline-block px-6 py-2 bg-[#B8860B] text-white rounded hover:bg-[#8B6508] transition-colors">
            Return Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
