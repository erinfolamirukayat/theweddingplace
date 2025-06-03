import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartIcon, HomeIcon, GiftIcon, LogInIcon, UserPlusIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REGISTRY_KEY = 'afriwed_registry_id';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registryId, setRegistryId] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  // Nav links as a function for reuse
  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
        <HomeIcon className="h-4 w-4 mr-1" />
        Home
      </Link>
      <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/how-it-works' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>How it works</Link>
      {user && (
        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
          Dashboard
        </Link>
      )}
      {user && registryId ? (
        <Link to={`/registry/${registryId}`} onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/registry') ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
          <HeartIcon className="h-4 w-4 mr-1" />
          My Registry
        </Link>
      ) : user ? (
        <Link to="/create-registry" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/create-registry' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
          <HeartIcon className="h-4 w-4 mr-1" />
          Create Registry
        </Link>
      ) : null}
      <Link to="/catalog" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith('/catalog') ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
        <GiftIcon className="h-4 w-4 mr-1" />
        Browse Products
      </Link>
      {user && (
        <Link to="/profile" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/profile' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
          <UserPlusIcon className="h-4 w-4 mr-1" />
          My Profile
        </Link>
      )}
      <Link to="/contact" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/contact' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>Contact Us</Link>
      {user && (
        <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-[#FFF8F3] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition w-full text-left">
          <LogOutIcon className="h-4 w-4 mr-1" />
          Logout
        </button>
      )}
      {!user && (
        <>
          <Link to="/login" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/login' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
            <LogInIcon className="h-4 w-4 mr-1" />
            Login
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/register' ? 'bg-[#FFF8F3] text-[#B8860B]' : 'text-gray-600 hover:bg-[#FFF8F3] hover:text-[#B8860B]'}`}>
            <UserPlusIcon className="h-4 w-4 mr-1" />
            Register
          </Link>
        </>
      )}
    </>
  );

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
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-4 items-center">
            {navLinks}
          </nav>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center p-2 rounded text-[#B8860B] focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="md:hidden bg-white shadow rounded-b-lg py-2 flex flex-col space-y-1 z-50">
            {navLinks}
          </nav>
        )}
      </div>
    </header>
  );
};
export default Navbar;