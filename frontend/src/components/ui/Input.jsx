import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  size = 'md'
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
    xl: 'py-5 px-8 text-xl'
  };

  const inputClasses = `
    block 
    w-full 
    rounded-lg 
    border 
    border-slate-300 
    dark:border-slate-600 
    bg-white 
    dark:bg-slate-800 
    text-slate-900 
    dark:text-slate-100 
    placeholder-slate-400 
    dark:placeholder-slate-500 
    focus:outline-none 
    focus:ring-2 
    focus:ring-indigo-500 
    focus:ring-offset-2
    transition-all 
    duration-200
    disabled:bg-slate-100 
    disabled:dark:bg-slate-700
    disabled:text-slate-500
    disabled:cursor-not-allowed
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;

  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputClasses} ${errorClasses} ${icon ? 'pl-10' : ''}`}
          style={{
            paddingLeft: icon ? '2.5rem' : undefined
          }}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
