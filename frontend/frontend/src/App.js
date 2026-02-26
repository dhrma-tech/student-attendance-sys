import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import our components
import TeacherQR from './components/TeacherQR';
import StudentScanner from './components/StudentScanner';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Attendance</h1>
        <p className="text-gray-500 mb-8">Select your role to continue</p>
        
        <div className="space-y-4">
          <Link 
            to="/teacher" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            👨‍🏫 Teacher Dashboard
          </Link>
          
          <Link 
            to="/student" 
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            📱 Student Scanner
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* In a real app, you'd pass the actual logged-in teacher's class details here */}
        <Route 
          path="/teacher" 
          element={<TeacherQR classId="64a1b2c3d4e5f6g7h8i9j0" sessionId="session_12345" />} 
        />
        
        {/* In a real app, the studentId would come from their login context */}
        <Route 
          path="/student" 
          element={<StudentScanner studentId="student_98765" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
