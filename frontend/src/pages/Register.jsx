import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const BRANCHES = ['Mechatronics', 'Computer', 'Civil', 'Mechanical', 'Electrical'];

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    prnNumber: '',
    password: '',
    branch: 'Computer',
    year: 1,
    parentPhone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const next = {};
    if (!form.name?.trim()) next.name = 'Required';
    if (!form.email?.trim()) next.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.prnNumber?.trim()) next.prnNumber = 'Required';
    if (!form.password) next.password = 'Required';
    else if (form.password.length < 6) next.password = 'At least 6 characters';
    if (!form.parentPhone?.trim()) next.parentPhone = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data } = await apiRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        prnNumber: form.prnNumber.trim(),
        password: form.password,
        branch: form.branch,
        year: Number(form.year) || 1,
        parentPhone: form.parentPhone.trim(),
      });
      login({ id: data.user.id, name: data.user.name, role: data.user.role }, data.token);
      toast.success('Account created! Welcome.');
      navigate('/student');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800">Student Registration</h1>
            <p className="text-slate-500 text-sm mt-1">Create your account to mark attendance</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={errors.name}
              placeholder="e.g. John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              placeholder="you@school.edu"
            />
            <Input
              label="PRN Number"
              value={form.prnNumber}
              onChange={(e) => setForm((f) => ({ ...f, prnNumber: e.target.value }))}
              error={errors.prnNumber}
              placeholder="e.g. 2020BTEIT001"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  minLength={6}
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
              <select
                value={form.branch}
                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <Input
              label="Year"
              type="number"
              min={1}
              max={5}
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            />
            <Input
              label="Parent phone"
              value={form.parentPhone}
              onChange={(e) => setForm((f) => ({ ...f, parentPhone: e.target.value }))}
              error={errors.parentPhone}
              placeholder="+91 9876543210"
            />
            <Button type="submit" className="w-full" size="lg" loading={loading} loadingText="Creating account…" disabled={loading}>
              Create account
            </Button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
