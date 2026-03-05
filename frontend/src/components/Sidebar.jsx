import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const items = [];

    // Common items
    items.push({
      to: '/dashboard',
      label: 'Dashboard',
      icon: '📊'
    });

    // Role-specific items
    switch (user?.role) {
      case 'student':
        items.push(
          {
            to: '/attendance',
            label: 'Mark Attendance',
            icon: '📱'
          },
          {
            to: '/my-attendance',
            label: 'My Attendance',
            icon: '📈'
          }
        );
        break;

      case 'teacher':
        items.push(
          {
            to: '/sessions',
            label: 'My Sessions',
            icon: '🏫'
          },
          {
            to: '/attendance-reports',
            label: 'Attendance Reports',
            icon: '📊'
          },
          {
            to: '/qr-display',
            label: 'QR Display',
            icon: '📷'
          }
        );
        break;

      case 'admin':
        items.push(
          {
            to: '/admin/dashboard',
            label: 'Admin Dashboard',
            icon: '🎛️'
          },
          {
            to: '/admin/students',
            label: 'Manage Students',
            icon: '👥'
          },
          {
            to: '/admin/teachers',
            label: 'Manage Teachers',
            icon: '👨‍🏫'
          },
          {
            to: '/admin/classes',
            label: 'Manage Classes',
            icon: '📚'
          },
          {
            to: '/admin/reports',
            label: 'Reports',
            icon: '📈'
          },
          {
            to: '/admin/settings',
            label: 'Settings',
            icon: '⚙️'
          }
        );
        break;
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Smart Attendance</h2>
        <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
        <p className="text-xs text-gray-500">{user?.name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition duration-200"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
