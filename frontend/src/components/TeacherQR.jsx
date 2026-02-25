import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
// In a real app, you'd fetch this hash from your backend via WebSockets
// For this snippet, we simulate the backend generation logic for the UI
import { generateRotatingQR } from '../../../backend/utils/totp'; 

const TeacherQR = ({ classId, sessionId }) => {
  const [qrData, setQrData] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // Initial generation
    setQrData(generateRotatingQR(classId, sessionId));

    // Rotate the QR code and reset timer every 10 seconds
    const interval = setInterval(() => {
      setQrData(generateRotatingQR(classId, sessionId));
      setTimeLeft(10);
    }, 10000);

    // Visual countdown timer for the dashboard
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [classId, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Scan to Mark Attendance</h2>
      <div className="p-4 bg-white rounded-lg shadow-sm border-4 border-blue-500">
        <QRCode value={qrData} size={300} />
      </div>
      <p className="mt-6 text-xl text-gray-700 font-mono">
        Code refreshes in: <span className="font-bold text-red-500">{timeLeft}s</span>
      </p>
    </div>
  );
};

export default TeacherQR;
