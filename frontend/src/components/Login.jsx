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
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">SA</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Smart Attendance
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['student', 'teacher', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.role === role
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getRoleIcon(role)}</div>
                    <div className="text-sm font-medium capitalize text-slate-900 dark:text-white">
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

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            For demo: Use your PRN number as student, email as teacher/admin
          </p>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Forgot Password?
            </a>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Need Help?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
