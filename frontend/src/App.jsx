import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './components/Login';

// Import role-specific components (these will be created)
import TeacherQR from './components/TeacherQR';
import StudentScanner from './components/StudentScanner';

// Dashboard components
const StudentDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Today's Classes</h3>
        <p className="text-3xl font-bold text-blue-600">3</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
        <p className="text-3xl font-bold text-green-600">87%</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pending</h3>
        <p className="text-3xl font-bold text-orange-600">1</p>
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
        <p className="text-3xl font-bold text-blue-600">2</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl font-bold text-green-600">156</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Avg Attendance</h3>
        <p className="text-3xl font-bold text-purple-600">92%</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Students</h3>
        <p className="text-3xl font-bold text-blue-600">1,234</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
        <p className="text-3xl font-bold text-green-600">45</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Active Classes</h3>
        <p className="text-3xl font-bold text-purple-600">28</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Low Attendance</h3>
        <p className="text-3xl font-bold text-red-600">12</p>
      </div>
    </div>
  </div>
);

const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 ml-64">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      {/* Role-based dashboard */}
                      <ProtectedRoute requiredRole="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                      <ProtectedRoute requiredRole="teacher">
                        <TeacherDashboard />
                      </ProtectedRoute>
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    </ProtectedRoute>
                  } />
                  
                  {/* Student Routes */}
                  <Route path="attendance" element={
                    <ProtectedRoute requiredRole="student">
                      <StudentScanner studentId="demo-student" />
                    </ProtectedRoute>
                  } />
                  
                  {/* Teacher Routes */}
                  <Route path="qr-display" element={
                    <ProtectedRoute requiredRole="teacher">
                      <TeacherQR classId="demo-class" sessionId="demo-session" />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
