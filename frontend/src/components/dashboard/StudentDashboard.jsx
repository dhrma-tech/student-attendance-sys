import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Loading } from '../ui/Loading';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        attendanceRate: 87,
        totalClasses: 45,
        attendedClasses: 39,
        missedClasses: 6,
        todayClasses: 3,
        pendingClasses: 1,
        streak: 12
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

  const attendanceColor = stats.attendanceRate >= 75 ? 'green' : 
                         stats.attendanceRate >= 60 ? 'yellow' : 'red';

  const statCards = [
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: '📊',
      color: attendanceColor,
      subtitle: `${stats.attendedClasses}/${stats.totalClasses} classes`
    },
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: '🔥',
      color: 'orange',
      subtitle: 'Keep it up!'
    },
    {
      title: 'Today\'s Classes',
      value: stats.todayClasses,
      icon: '📚',
      color: 'blue',
      subtitle: `${stats.pendingClasses} pending`
    },
    {
      title: 'Missed Classes',
      value: stats.missed,
      icon: '⚠️',
      color: 'red',
      subtitle: 'Need improvement'
    }
  ];

  const todaySchedule = [
    {
      id: 1,
      className: 'CS301 - Data Structures',
      time: '10:00 AM',
      room: 'Room 301',
      status: 'attended',
      attendance: 'Present'
    },
    {
      id: 2,
      className: 'CS302 - Algorithms',
      time: '11:30 AM',
      room: 'Room 302',
      status: 'pending',
      attendance: 'Pending'
    },
    {
      id: 3,
      className: 'CS303 - Database Systems',
      time: '2:00 PM',
      room: 'Room 303',
      status: 'pending',
      attendance: 'Pending'
    }
  ];

  const attendanceHistory = [
    { date: 'Mon', rate: 100, classes: 3 },
    { date: 'Tue', rate: 67, classes: 3 },
    { date: 'Wed', rate: 100, classes: 2 },
    { date: 'Thu', rate: 100, classes: 3 },
    { date: 'Fri', rate: 67, classes: 3 },
    { date: 'Sat', rate: 100, classes: 2 },
    { date: 'Sun', rate: 0, classes: 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Student Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track your attendance and stay on top of your classes.
        </p>
      </div>

      {/* Attendance Alert */}
      {stats.attendanceRate < 75 && (
        <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Low Attendance Alert
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your attendance is {stats.attendanceRate}%. Maintain at least 75% to avoid penalties.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stat.subtitle}
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
            <span className="text-2xl mr-3">📱</span>
            Scan Attendance
          </Button>
          <Button variant="outline" className="h-16">
            <span className="text-2xl mr-3">📈</span>
            View History
          </Button>
          <Button variant="outline" className="h-16">
            <span className="text-2xl mr-3">👤</span>
            My Profile
          </Button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Today's Classes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your schedule for today
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
                      variant={classItem.status === 'attended' ? 'success' : 'default'}
                      size="sm"
                    >
                      {classItem.attendance}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {classItem.time} • {classItem.room}
                  </p>
                </div>
                
                <div>
                  {classItem.status === 'attended' ? (
                    <Badge variant="success">
                      ✓ Attended
                    </Badge>
                  ) : classItem.status === 'pending' ? (
                    <Button variant="primary" size="sm">
                      Mark Attendance
                    </Button>
                  ) : (
                    <Badge variant="default">
                      {classItem.attendance}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Attendance */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Weekly Attendance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Last 7 days overview
            </p>
          </div>
          
          <div className="space-y-4">
            {attendanceHistory.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-8">
                    {day.date}
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          day.rate === 100 ? 'bg-green-500' :
                          day.rate >= 75 ? 'bg-yellow-500' :
                          day.rate > 0 ? 'bg-red-500' : 'bg-slate-300'
                        }`}
                        style={{ width: `${day.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {day.rate}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {day.classes} classes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card className="mt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Attendance Progress
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your overall attendance this semester
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Overall Attendance
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {stats.attendanceRate}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  stats.attendanceRate >= 75 ? 'bg-green-500' :
                  stats.attendanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.attendanceRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.attendedClasses}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Attended
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.missedClasses}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Missed
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                {stats.totalClasses}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
