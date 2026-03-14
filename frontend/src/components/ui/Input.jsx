import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full 
            ${icon ? 'pl-11' : 'px-4'} 
            py-2.5 
            bg-white dark:bg-slate-900 
            border border-slate-200 dark:border-slate-800 
            text-slate-900 dark:text-slate-100 
            placeholder-slate-400
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 
            transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
