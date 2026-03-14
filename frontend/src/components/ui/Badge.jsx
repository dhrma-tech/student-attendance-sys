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
    default: 'bg-slate-200/50 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-300/30',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200/50',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200/50',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200/50',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200/50'
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
    md: 'px-3 py-1 text-sm font-semibold tracking-wide',
    lg: 'px-4 py-1.5 text-base font-medium',
    xl: 'px-6 py-2 text-lg font-medium'
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
