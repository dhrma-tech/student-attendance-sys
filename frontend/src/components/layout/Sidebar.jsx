import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavItems = () => {
    const items = [];

    switch (user?.role) {
      case 'student':
        items.push(
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/attendance', label: 'Scan Attendance', icon: '📱' },
          { to: '/my-attendance', label: 'My Attendance', icon: '📈' },
          { to: '/profile', label: 'Profile', icon: '👤' }
        );
        break;
      case 'teacher':
        items.push(
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/session/start', label: 'Start Session', icon: '▶️' },
          { to: '/session/live', label: 'Live Session', icon: '🔴' },
          { to: '/reports', label: 'Class Reports', icon: '📋' }
        );
        break;
      case 'admin':
        items.push(
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
          { to: '/admin/students', label: 'Students', icon: '👥' },
          { to: '/admin/classes', label: 'Classes', icon: '📚' },
          { to: '/admin/reports', label: 'Reports', icon: '📈' },
          { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
        );
        break;
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <span className="ml-3 text-lg font-semibold text-slate-900 dark:text-white">
            Smart Attendance
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
