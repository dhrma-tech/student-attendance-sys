import React from 'react';

export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  const id = props.id || `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full px-3 py-2 rounded-lg border bg-white text-slate-800
          placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-500' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
