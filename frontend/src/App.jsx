import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import DashboardLayout from './components/layout/DashboardLayout';

// Import dashboard components
import AdminDashboard from './components/dashboard/AdminDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';

// Import existing components
import TeacherQR from './components/TeacherQR';
import StudentScanner from './components/StudentScanner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Nested routes for dashboard */}
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
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
