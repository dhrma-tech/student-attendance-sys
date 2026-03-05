import React from 'react';

const Loading = ({ 
  size = 'md',
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const dotSizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-6 w-6'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600`}>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-slate-200 border-t-indigo-600 animate-pulse"></div>
        </div>
      </div>
      {text && (
        <span className="ml-3 text-slate-600 dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
};

const LoadingSkeleton = ({ 
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="rounded-lg bg-slate-200 dark:bg-slate-700 h-4 w-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
              <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Loading, LoadingSkeleton };
