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
    relative
    overflow-hidden
    bg-white/80 dark:bg-slate-900/60 
    backdrop-blur-xl
    rounded-2xl 
    transition-all 
    duration-300
    ${paddingClasses[padding] || paddingClasses.md}
    ${shadowClasses[shadow] || shadowClasses.md}
    ${border ? 'border border-slate-200/50 dark:border-slate-700/50' : ''}
    ${hover ? 'hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-500/30 hover:-translate-y-1' : ''}
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
