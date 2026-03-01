import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shadow-sm lg:pl-8">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-sm font-medium">Welcome back</span>
        <span className="text-slate-800 font-semibold">{user?.name || 'User'}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
        <User className="w-4 h-4" />
        <span className="text-sm font-medium capitalize">{user?.role || 'teacher'}</span>
      </div>
    </header>
  );
}
