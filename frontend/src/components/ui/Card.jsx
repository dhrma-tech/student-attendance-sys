import React from 'react';

export default function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function CardStat({ label, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {trend != null && (
          <p className={`text-xs mt-1 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}% from last period
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
