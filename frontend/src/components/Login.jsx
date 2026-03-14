import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';

const Login = () => {
  const [formData, setFormData] = useState({
    role: 'student',
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.role, formData.identifier, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const getIdentifierLabel = () => {
    switch (formData.role) {
      case 'teacher':
      case 'admin':
        return 'Email';
      case 'student':
        return 'PRN Number';
      default:
        return 'Identifier';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (formData.role) {
      case 'teacher':
      case 'admin':
        return 'teacher@college.edu';
      case 'student':
        return 'e.g., 2023CS001';
      default:
        return 'Enter your identifier';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return '👤';
      case 'teacher':
        return '👨‍🏫';
      case 'admin':
        return '👑';
      default:
        return '👤';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 ${
      isDark 
        ? 'bg-[#09090B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#09090B] to-[#09090B]' 
        : 'bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50'
    }`}>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Illustration (Hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center animate-slideIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl mb-8 shadow-xl shadow-indigo-500/30 transform transition-transform hover:scale-105">
            <span className="text-white font-bold text-3xl">SA</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 mb-6 leading-tight">
            Next Generation<br />Attendance.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
            Streamline your educational journey with smart QR tracking, beautiful dashboards, and real-time insights for students and faculty.
          </p>
          
          <div className="mt-12 flex items-center space-x-6">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-slate-500">
              Trusted by <span className="text-indigo-600 dark:text-indigo-400 font-bold">10,000+</span> users
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-fadeIn shadow-2xl shadow-indigo-500/10 rounded-3xl">
        {/* Mobile Logo and Title */}
        <div className="text-center mb-8 md:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-2xl">SA</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Smart Attendance
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <Card padding="lg" shadow="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </span>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 tracking-wide">
                SELECT YOUR ROLE
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['student', 'teacher', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                      formData.role === role
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-inner'
                        : 'border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {formData.role === role && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                    )}
                    <div className={`text-2xl mb-1 transition-transform duration-300 ${formData.role === role ? 'scale-110' : ''}`}>
                      {getRoleIcon(role)}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold capitalize ${
                      formData.role === role ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {role}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier Input */}
            <Input
              label={getIdentifierLabel()}
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder={getIdentifierPlaceholder()}
              required
              icon={
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              icon={
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
              variant="primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2h4a2 2 0 01-2z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Additional Links */}
        <div className="mt-8 text-center animate-pulse">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="#" className="font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors">
              Forgot Password?
            </a>
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <a href="#" className="font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors">
              Need Help?
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
