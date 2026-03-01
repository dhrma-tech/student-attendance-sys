import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Attendance and export reports</p>
      </div>
      <Card>
        <EmptyState
          icon={FileText}
          title="Reports coming soon"
          description="Export attendance by class, date range, or student. Backend can expose /api/reports when ready."
        />
      </Card>
    </div>
  );
}
