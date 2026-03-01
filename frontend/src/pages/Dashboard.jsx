import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAttendanceStats, getRecentAttendance } from '../services/api';
import Card, { CardStat } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const defaultStats = {
  totalStudents: 0,
  presentToday: 0,
  absentToday: 0,
  totalClasses: 0,
};

const chartColors = { stroke: '#6366f1', fill: 'rgba(99, 102, 241, 0.2)' };

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [chartData, setChartData] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, recentRes] = await Promise.allSettled([
          getAttendanceStats(),
          getRecentAttendance({ limit: 10 }),
        ]);
        if (cancelled) return;
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          const d = statsRes.value.data;
          setStats({
            totalStudents: d.totalStudents ?? 0,
            presentToday: d.presentToday ?? 0,
            absentToday: d.absentToday ?? 0,
            totalClasses: d.totalClasses ?? 0,
          });
          if (Array.isArray(d.attendanceTrend)) setChartData(d.attendanceTrend);
        }
        if (recentRes.status === 'fulfilled') {
          const data = recentRes.value?.data;
          setRecent(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const absentToday = Math.max(0, stats.totalStudents - stats.presentToday);
  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users },
    { label: 'Present Today', value: stats.presentToday, icon: UserCheck },
    { label: 'Absent Today', value: absentToday, icon: UserX },
    { label: 'Total Classes', value: stats.totalClasses, icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of attendance and classes</p>
      </div>

      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          Could not load dashboard stats. Using default counts. Ensure backend exposes <code className="bg-amber-100 px-1 rounded">/api/dashboard/stats</code> and <code className="bg-amber-100 px-1 rounded">/api/attendance/recent</code>.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <CardStat key={s.label} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Attendance trend" subtitle="Last 7 days">
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                      labelStyle={{ color: '#475569' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="present"
                      name="Present"
                      stroke={chartColors.stroke}
                      fill={chartColors.fill}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No trend data"
                description="Attendance trend will appear when the backend provides /api/dashboard/stats with attendanceTrend array."
              />
            )}
          </Card>
        </div>
        <div>
          <Card title="Recent attendance" subtitle="Latest scans">
            {recent.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {recent.slice(0, 8).map((r, i) => (
                  <li key={r._id || i} className="py-2.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{r.studentName || r.name || 'Student'}</span>
                    <span className="text-slate-500">{r.prnNumber || r.sessionId || '—'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No recent activity"
                description="Recent scans will show here once students mark attendance."
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
