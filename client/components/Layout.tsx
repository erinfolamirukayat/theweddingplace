import React, { createContext, useContext, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../utils/api';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export const NotificationContext = createContext<{
  notification: NotificationState | null;
  setNotification: (notification: NotificationState | null) => void;
} | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationContext');
  return {
    setMessage: (message: string, type: 'success' | 'error' = 'success') => {
      ctx.setNotification({ message, type });
      setTimeout(() => ctx.setNotification(null), 5000);
    },
  };
};

const Notification: React.FC = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx || !ctx.notification) return null;

  const bgColor = ctx.notification.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded shadow z-50`}>
      {ctx.notification.message}
      <button className="ml-4 text-white font-bold" onClick={() => ctx.setNotification(null)}>✕</button>
    </div>
  );
};

const Layout = () => {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const location = useLocation();
  const isSharePage = location.pathname.startsWith('/share/');
  const auth = useAuth();

  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      await resendVerificationEmail();
      setNotification({ message: 'Verification email resent!', type: 'success' });
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to resend email', type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setResending(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      <Notification />
      <div className="min-h-screen bg-[#FFF8F3]">
        {auth?.user && auth.user.is_verified === false && !isSharePage && (
          <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 px-4 py-3 text-center sm:text-sm text-xs">
            <span className="font-semibold mr-2">Please verify your email address.</span> 
            <button onClick={handleResend} disabled={resending} className="underline text-yellow-900 hover:text-yellow-700">
              {resending ? 'Sending...' : 'Click here to resend verification email'}
            </button>
          </div>
        )}
        {isSharePage ? (
          <div className="bg-white border-b border-gray-200 py-4 text-center shadow-sm">
            <Link to="/" className="text-sm font-semibold text-[#B8860B] hover:text-[#8B6508] transition-colors">
              Visit Celebron to set up a registry like this
            </Link>
          </div>
        ) : (
          <Navbar />
        )}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <Outlet />
        </main>
        <footer className="bg-[#2C1810] text-white py-6 sm:py-8 mt-8 sm:mt-12">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Celebron Registry</h3>
              <p className="text-xs sm:text-sm opacity-75">
                Celebrating African Unions with Meaningful Gifts
              </p>
              <div className="mt-4 flex flex-col gap-1 items-center justify-center sm:space-y-1">
                <div className="text-xs sm:text-sm">Email: <a href="mailto:info@celebron.co" className="underline text-[#B8860B]">info@celebron.co</a></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NotificationContext.Provider>
  );
};

export default Layout;
