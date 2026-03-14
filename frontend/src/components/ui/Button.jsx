import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const buttonVariants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2',
  secondary: 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium py-2 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-xl transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2',
  outline: 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-xl hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 bg-transparent'
};

const buttonSizes = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
  xl: 'py-4 px-8 text-xl'
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-wide rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none';
  
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      style={{
        '--tw-ring-color': isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.5)'
      }}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2h4a2 2 0 01-2z"></path>
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;
