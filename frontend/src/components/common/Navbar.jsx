import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  // Admin Check
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800/80 backdrop-blur-md">
         <div className="w-[90%] mx-auto py-2.5 flex items-center justify-between gap-4">              
        
        {/* --- CIRCULAR LOGO CONTAINER --- */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full group-hover:scale-105 transition duration-300 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Brand Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-xl font-extrabold tracking-wide text-white hidden sm:block">
            Swift<span className="text-indigo-400">Cart</span>
          </span>
        </Link>

        {/* --- SEARCH BAR --- */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-5 py-2 bg-slate-900/80 text-white placeholder-slate-400 border border-slate-700/80 rounded-l-full focus:outline-none focus:border-indigo-500 focus:bg-slate-900 text-sm transition"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-r-full hover:bg-indigo-500 transition font-semibold text-sm shadow-md"
          >
            Search
          </button>
        </form>

        {/* --- NAV LINKS --- */}
        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link to="/" className="hover:text-indigo-400 transition">
            Home
          </Link>

          {/* 🛒 Cart Link */}
          {!isAdmin && (
            <Link to="/cart" className="hover:text-indigo-400 transition flex items-center gap-1.5">
              🛒 Cart
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {/* My Orders Link */}
              {!isAdmin && (
                <Link to="/my-orders" className="hover:text-indigo-400 transition">
                  My Orders
                </Link>
              )}

              {/* Admin Panel Link */}
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-amber-400 font-bold hover:underline">
                  Admin
                </Link>
              )}

              {/* User Badge */}
              <span className="text-xs font-bold bg-indigo-950/60 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-800/60 shadow-inner">
                {user.name}
              </span>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition shadow"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 px-5 py-1.5 rounded-full hover:bg-indigo-500 transition shadow-md font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;