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



  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-slate-50'
    } relative`}>
      <div className="w-full max-w-5xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-800 rounded-2xl mb-8 shadow-sm">
            <span className="text-white font-bold text-2xl uppercase">SA</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            Attendance<br />Simplified.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
            A professional QR-based attendance tracking system for modern educational environments.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
        {/* Mobile Header */}
        <div className="text-center mb-10 md:hidden">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-800 rounded-xl mb-4">
            <span className="text-white font-bold text-xl uppercase">SA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Smart Attendance
          </h1>
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
              <div className="grid grid-cols-2 gap-4">
                {['student', 'teacher'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      formData.role === role
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className={`text-sm font-bold capitalize ${
                      formData.role === role ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'
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
  </div>
);
};

export default Login;
