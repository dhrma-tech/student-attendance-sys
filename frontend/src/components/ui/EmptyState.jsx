import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 rounded-full bg-slate-100 text-slate-400">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
