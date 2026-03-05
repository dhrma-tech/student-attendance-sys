import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Loading } from '../ui/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 1234,
        totalTeachers: 45,
        activeClasses: 28,
        lowAttendance: 12,
        attendanceRate: 87.5,
        todaySessions: 15,
        pendingApprovals: 3,
        systemHealth: 'Good'
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      change: '+3%',
      changeType: 'positive',
      icon: '👨‍🏫',
      color: 'green'
    },
    {
      title: 'Active Classes',
      value: stats.activeClasses,
      change: '+5%',
      changeType: 'positive',
      icon: '📚',
      color: 'purple'
    },
    {
      title: 'Low Attendance',
      value: stats.lowAttendance,
      change: '-2%',
      changeType: 'negative',
      icon: '⚠️',
      color: 'red'
    }
  ];

  const quickActions = [
    { label: 'Add Teacher', icon: '➕', href: '/admin/teachers/add' },
    { label: 'Create Class', icon: '📝', href: '/admin/classes/create' },
    { label: 'View Reports', icon: '📊', href: '/admin/reports' },
    { label: 'System Settings', icon: '⚙️', href: '/admin/settings' }
  ];

  const recentActivity = [
    { id: 1, action: 'New teacher registered', user: 'John Doe', time: '2 hours ago', type: 'info' },
    { id: 2, action: 'Class CS301 created', user: 'Admin', time: '4 hours ago', type: 'success' },
    { id: 3, action: 'Low attendance alert', user: 'System', time: '6 hours ago', type: 'warning' },
    { id: 4, action: 'Database backup completed', user: 'System', time: '1 day ago', type: 'info' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Welcome back! Here's what's happening with your attendance system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover={true} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className="text-3xl opacity-20">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col justify-center"
              onClick={() => console.log(`Navigate to ${action.href}`)}
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <Card className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Attendance Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Weekly attendance trends
            </p>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.attendanceRate}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Overall Attendance Rate
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Latest system events
            </p>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              System Status
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All systems operational
            </p>
          </div>
          <Badge variant="success">
            {stats.systemHealth}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
