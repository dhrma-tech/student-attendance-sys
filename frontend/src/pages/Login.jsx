import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [role, setRole] = useState('teacher');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const next = {};
    if (!identifier.trim()) next.identifier = 'Required';
    if (!password) next.password = 'Required';
    if (role === 'teacher' && identifier && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      next.identifier = 'Enter a valid email';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data } = await apiLogin({ role, identifier: identifier.trim(), password });
      login({ id: data.user.id, name: data.user.name, role: data.user.role }, data.token);
      toast.success('Welcome back!');
      navigate(data.user.role === 'student' ? '/student' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
      if (err.response?.status === 404) setErrors({ identifier: 'User not found' });
      else if (err.response?.status === 401) setErrors({ password: 'Invalid password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800">Student Attendance</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sign in as</label>
              <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    role === 'teacher' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
            <Input
              label={role === 'teacher' ? 'Email' : 'PRN Number'}
              type={role === 'teacher' ? 'email' : 'text'}
              placeholder={role === 'teacher' ? 'you@school.edu' : 'e.g. 2020BTEIT001'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={errors.identifier}
              autoComplete="username"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-3 py-2 pr-10 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading} loadingText="Signing in…" disabled={loading}>
              Sign in
            </Button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Student?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
