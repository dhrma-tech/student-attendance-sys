import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  border = true
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `
    bg-white dark:bg-slate-800 
    rounded-lg 
    transition-all 
    duration-200
    ${paddingClasses[padding] || paddingClasses.md}
    ${shadowClasses[shadow] || shadowClasses.md}
    ${border ? 'border border-slate-200 dark:border-slate-700' : ''}
    ${hover ? 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600' : ''}
  `;

  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <div 
      className={combinedClasses}
      style={{
        boxShadow: isDark && shadow !== 'none' 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.15)'
          : undefined
      }}
    >
      {children}
    </div>
  );
};

export default Card;
