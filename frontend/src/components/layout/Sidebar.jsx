import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  QrCode,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/students', icon: Users, label: 'Students' },
  { to: '/dashboard/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/dashboard/teacher', icon: QrCode, label: 'QR Session' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
];

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-slate-800 text-white"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-slate-900 text-slate-200 flex flex-col border-r border-slate-700/50
          transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Attendance</h1>
            <p className="text-xs text-slate-400 mt-0.5">Student System</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700/50">
          <button
            type="button"
            onClick={() => { onLogout(); setOpen(false); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
