import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Loading } from '../ui/Loading';

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 156,
        avgAttendance: 92,
        activeSessions: 2,
        todayClasses: 4,
        completedClasses: 12,
        pendingAttendance: 3
      });
      
      // Simulate active session
      setActiveSession({
        id: 'session-123',
        className: 'CS301 - Data Structures',
        startTime: '10:00 AM',
        attendanceCount: 45,
        totalStudents: 60
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
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Avg Attendance',
      value: `${stats.avgAttendance}%`,
      icon: '📈',
      color: 'green'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: '🔴',
      color: 'red'
    },
    {
      title: 'Today\'s Classes',
      value: stats.todayClasses,
      icon: '📚',
      color: 'purple'
    }
  ];

  const todaySchedule = [
    {
      id: 1,
      className: 'CS301 - Data Structures',
      time: '10:00 AM - 11:00 AM',
      room: 'Room 301',
      status: 'active',
      attendance: 45
    },
    {
      id: 2,
      className: 'CS302 - Algorithms',
      time: '11:30 AM - 12:30 PM',
      room: 'Room 302',
      status: 'upcoming',
      attendance: null
    },
    {
      id: 3,
      className: 'CS303 - Database Systems',
      time: '2:00 PM - 3:00 PM',
      room: 'Room 303',
      status: 'upcoming',
      attendance: null
    },
    {
      id: 4,
      className: 'CS304 - Computer Networks',
      time: '3:30 PM - 4:30 PM',
      room: 'Room 304',
      status: 'upcoming',
      attendance: null
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your classes and track student attendance in real-time.
        </p>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Live Session Active
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activeSession.className} • {activeSession.startTime}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {activeSession.attendanceCount}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  of {activeSession.totalStudents}
                </div>
              </div>
              <Button variant="primary" size="sm">
                View Session
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover={true}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" className="h-16">
            <span className="text-2xl mr-3">▶️</span>
            Start New Session
          </Button>
          <Button variant="outline" className="h-16">
            <span className="text-2xl mr-3">📊</span>
            View Reports
          </Button>
          <Button variant="outline" className="h-16">
            <span className="text-2xl mr-3">📝</span>
            Manage Classes
          </Button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Today's Schedule
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your classes for today
            </p>
          </div>
          
          <div className="space-y-4">
            {todaySchedule.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {classItem.className}
                    </h4>
                    <Badge 
                      variant={classItem.status === 'active' ? 'success' : 'default'}
                      size="sm"
                    >
                      {classItem.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {classItem.time} • {classItem.room}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  {classItem.attendance !== null && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {classItem.attendance}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        attended
                      </div>
                    </div>
                  )}
                  
                  {classItem.status === 'active' ? (
                    <Button variant="primary" size="sm">
                      Manage
                    </Button>
                  ) : classItem.status === 'upcoming' ? (
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Sessions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your latest attendance sessions
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { className: 'CS301 - Data Structures', date: 'Today', attendance: '45/60', rate: '75%' },
              { className: 'CS302 - Algorithms', date: 'Yesterday', attendance: '52/58', rate: '90%' },
              { className: 'CS303 - Database Systems', date: '2 days ago', attendance: '48/55', rate: '87%' },
              { className: 'CS304 - Computer Networks', date: '3 days ago', attendance: '50/62', rate: '81%' }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {session.className}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {session.date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {session.attendance}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {session.rate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
