/**
 * Centralized API client for the Student Attendance System.
 * Uses VITE_API_URL for backend base URL (required for Vercel + Render deployment).
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendance_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('attendance_token');
      localStorage.removeItem('attendance_user');
      window.dispatchEvent(new Event('storage'));
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const login = (body) => api.post('/api/auth/login', body);
export const register = (body) => api.post('/api/auth/register', body);

// --- Status ---
export const getStatus = () => api.get('/api/status');

// --- Students ---
export const getStudents = (params) => api.get('/api/students', { params });
export const getStudent = (id) => api.get(`/api/students/${id}`);
export const createStudent = (data) => api.post('/api/students', data);
export const updateStudent = (id, data) => api.put(`/api/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/api/students/${id}`);

// --- Classes ---
export const getClasses = (params) => api.get('/api/classes', { params });

// --- Sessions ---
export const getSessions = (params) => api.get('/api/sessions', { params });
export const createSession = (data) => api.post('/api/sessions', data);

// --- Attendance ---
export const submitScan = (data) => api.post('/api/attendance/scan', data);
export const getAttendanceStats = () => api.get('/api/dashboard/stats');
export const getRecentAttendance = (params) => api.get('/api/attendance/recent', { params });

/** Socket.IO URL - same host as API for cross-origin (Vercel frontend → Render backend) */
export function getSocketUrl() {
  const base = import.meta.env.VITE_API_URL || '';
  if (!base) return window.location.origin;
  try {
    const u = new URL(base);
    return `${u.protocol === 'https:' ? 'https' : 'http'}://${u.host}`;
  } catch {
    return window.location.origin;
  }
}

export default api;
