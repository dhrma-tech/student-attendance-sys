import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import io from 'socket.io-client';

// Connect to our new Express server
const socket = io('http://localhost:5000'); 

const TeacherQR = ({ classId, sessionId }) => {
  const [qrData, setQrData] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    // Tell the server we are starting a lecture
    socket.emit('start_session', { classId, sessionId });

    // Listen for the secure payload pushed from the server
    socket.on('qr_update', (newQrPayload) => {
      setQrData(newQrPayload);
      setTimeLeft(10); // Reset the visual countdown timer
    });

    // Visual countdown timer for the dashboard
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      socket.disconnect();
      clearInterval(countdown);
    };
  }, [classId, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Scan to Mark Attendance</h2>
      
      {qrData ? (
        <div className="p-4 bg-white rounded-lg shadow-sm border-4 border-blue-500 transition-all duration-300">
          <QRCode value={typeof qrData === 'string' ? qrData : JSON.stringify(qrData)} size={300} />
        </div>
      ) : (
        <p className="text-gray-500 animate-pulse">Initializing Secure Connection...</p>
      )}

      <p className="mt-6 text-xl text-gray-700 font-mono">
        Code refreshes in: <span className="font-bold text-red-500">{timeLeft}s</span>
      </p>
    </div>
  );
};

export default TeacherQR;
