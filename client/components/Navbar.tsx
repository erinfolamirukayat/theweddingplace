import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartIcon, HomeIcon, GiftIcon, LogInIcon, UserPlusIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REGISTRY_KEY = 'afriwed_registry_id';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registryId, setRegistryId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const updateRegistryId = () => {
      const id = localStorage.getItem(REGISTRY_KEY);
      setRegistryId(id);
    };
    updateRegistryId();
    window.addEventListener('storage', updateRegistryId);
    const interval = setInterval(updateRegistryId, 500);
    return () => {
      window.removeEventListener('storage', updateRegistryId);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 text-[#B8860B]" />
            <span className="ml-2 text-xl font-bold text-[#2C1810]">
              BlissGifts
            </span>
          </Link>
          <nav className="flex space-x-4 items-center">
            <Link to="/" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link to="/how-it-works" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/how-it-works' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>How it works</Link>
            {user && (
              <Link to="/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                Dashboard
              </Link>
            )}
            {user && registryId ? (
              <Link to={`/registry/${registryId}`} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/registry') ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                <HeartIcon className="h-4 w-4 mr-1" />
                My Registry
              </Link>
            ) : user ? (
              <Link to="/create-registry" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/create-registry' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                <HeartIcon className="h-4 w-4 mr-1" />
                Create Registry
              </Link>
            ) : null}
            <Link to="/catalog" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/catalog') ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
              <GiftIcon className="h-4 w-4 mr-1" />
              Browse Products
            </Link>
            {user && (
              <Link to="/profile" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/profile' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                <UserPlusIcon className="h-4 w-4 mr-1" />
                My Profile
              </Link>
            )}
            <Link to="/contact" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/contact' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>Contact Us</Link>
            {user && (
              <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#FFF8F3] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition">
                <LogOutIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            )}
            {!user && (
              <>
                <Link to="/login" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/login' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                  <LogInIcon className="h-4 w-4 mr-1" />
                  Login
                </Link>
                <Link to="/register" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/register' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
                  <UserPlusIcon className="h-4 w-4 mr-1" />
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;