import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    primary: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    inline-flex 
    items-center 
    rounded-full 
    font-medium
    ${variantClasses[variant] || variantClasses.default}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;

  return (
    <span className={baseClasses}>
      {children}
    </span>
  );
};

export default Badge;
