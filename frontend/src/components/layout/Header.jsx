import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const Header = ({ onMenuClick, onThemeToggle, isDark, user }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side - Logo and menu button */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="hidden lg:flex lg:items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-slate-900 dark:text-white">
                Smart Attendance
              </span>
            </div>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* User info */}
          {user && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
              <Badge variant="primary" size="sm">
                {user.role}
              </Badge>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 8v1m0 8v1M5 21h14a2 2 0 002-2v-7a2 2 0 00-2h-4a2 2 0 00-2v4a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 0018.706 0L3.346 4.58a1 1 0 00-.707.293L15.653 5.293a1 1 0 00-.707-.293l-1.414-1.414a1 1 0 00-.293-.707L10.586 1.707a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01.707.293l5.293 5.586a1 1 0 00.707.707l1.414 1.414a1 1 0 01.707-.293L17.586 18.293A9 9 0 0020.354 15.354z" />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.407-1.407A2 2 0 01-3.586-3.586L7 3h4a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v8a2 2 0 002 2h6a2 2 0 002-2v4a2 2 0 002-2h-4a2 2 0 00-2-2v-2a2 2 0 00-2 2z" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </svg>
            </button>
          </div>

          {/* Logout */}
          {user && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="ml-4"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4l0 0-4-4M4 4h12" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
