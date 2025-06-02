import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const NotificationContext = createContext<{
  message: string;
  setMessage: (msg: string) => void;
} | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationContext');
  return ctx;
};

const Notification: React.FC = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx || !ctx.message) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow z-50">
      {ctx.message}
      <button className="ml-4 text-white font-bold" onClick={() => ctx.setMessage('')}>×</button>
    </div>
  );
};

const Layout = () => {
  const [message, setMessage] = useState('');
  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      <Notification />
      <div className="min-h-screen bg-[#FFF8F3]">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <footer className="bg-[#2C1810] text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">BlissGift Registry</h3>
              <p className="text-sm opacity-75">
                Celebrating African Unions with Meaningful Gifts
              </p>
              <div className="mt-4 space-y-1">
                <div>WhatsApp: <a href="https://wa.me/2348012345678" className="underline text-[#B8860B]" target="_blank" rel="noopener noreferrer">+234 801 234 5678</a></div>
                <div>Email: <a href="mailto:support@blissgift.com" className="underline text-[#B8860B]">support@blissgift.com</a></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NotificationContext.Provider>
  );
};

export default Layout;