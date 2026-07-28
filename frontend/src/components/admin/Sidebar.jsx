import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Orders', path: '/admin/orders', icon: '🛍️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 space-y-6">
      <div className="px-2 font-bold text-xl text-white tracking-wide border-b border-slate-800 pb-4">
        Admin Panel
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;