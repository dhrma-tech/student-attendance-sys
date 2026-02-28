import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import fpPromise from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

const StudentScanner = ({ studentId }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize the device fingerprint when the component loads
  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await fpPromise.load();
      const result = await fp.get();
      setDeviceId(result.visitorId); // This is the unique hash for the student's phone
    };
    getFingerprint();
  }, []);

  const handleScan = async (scannedText) => {
    if (!scannedText || scanStatus === 'success') return;

    try {
      setScanStatus('scanning');
      
      // The QR code holds a JSON string from our Python/Node generator
      const qrPayload = JSON.parse(scannedText); 

      // Send the data to our secure Express endpoint
      const response = await axios.post('http://localhost:5000/api/attendance/scan', {
        studentId: studentId, // In a real app, this comes from your Auth/Login context
        sessionId: qrPayload.sessionId,
        classId: qrPayload.classId,
        scannedHash: qrPayload.hash,
        deviceId: deviceId
      });

      if (response.status === 200) {
        setScanStatus('success');
      }
    } catch (error) {
      console.error('Scan Error:', error);
      setScanStatus('error');
      // Extract the specific error message from our backend
      setErrorMessage(
        error.response?.data?.error || 'Failed to verify attendance. Please try again.'
      );
      
      // Reset scanner after 3 seconds so they can try again
      setTimeout(() => {
        setScanStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Attendance Scanner</h2>
          <p className="text-blue-100 text-sm mt-1">Point your camera at the projector</p>
        </div>

        {/* Scanner Body */}
        <div className="p-6 flex flex-col items-center">
          {scanStatus === 'success' ? (
            <div className="flex flex-col items-center py-10 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Attendance Marked!</h3>
              <p className="text-gray-500 mt-2 text-center">Your presence has been securely logged on the server.</p>
            </div>
          ) : (
            <div className="w-full relative">
              <div className="overflow-hidden rounded-xl border-4 border-gray-200">
                <Scanner 
                  onScan={(detectedCodes) => {
                    const text = detectedCodes[0]?.rawValue;
                    if (text) handleScan(text);
                  }} 
                  onError={(error) => console.log(error?.message)}
                  scanDelay={1000}
                />
              </div>
              
              {scanStatus === 'scanning' && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                  <p className="text-blue-600 font-semibold animate-pulse">Verifying Code...</p>
                </div>
              )}
            </div>
          )}

          {/* Error Message Display */}
          {scanStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
              <p className="text-sm text-red-600 text-center font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Device Fingerprint Status */}
          <div className="mt-6 text-xs text-gray-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            Device ID: {deviceId ? `${deviceId.substring(0, 8)}...` : 'Generating...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentScanner;