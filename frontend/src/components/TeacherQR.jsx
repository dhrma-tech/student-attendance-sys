import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import io from 'socket.io-client';
import { getSocketUrl, getClasses, createSession } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import EmptyState from './ui/EmptyState';

export default function TeacherQR() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [qrData, setQrData] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getClasses()
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.classes ?? [];
        if (!cancelled) {
          setClasses(list);
          if (list.length > 0 && !selectedClassId) setSelectedClassId(list[0]._id);
        }
      })
      .catch(() => {
        if (!cancelled) setClasses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const startSession = async () => {
    if (!selectedClassId || !user?.id) {
      toast.error('Select a class and ensure you are logged in.');
      return;
    }
    setStarting(true);
    try {
      const { data } = await createSession({ classId: selectedClassId, teacherId: user.id });
      setSessionId(data._id);
      setClassId(selectedClassId);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start session');
      setStarting(false);
    } finally {
      setStarting(false);
    }
  };

  const endSession = () => {
    if (socket) socket.disconnect();
    setSocket(null);
    setSessionId(null);
    setClassId(null);
    setQrData('');
  };

  useEffect(() => {
    if (!sessionId || !classId) return;
    const s = io(getSocketUrl());
    setSocket(s);
    s.emit('start_session', { classId, sessionId });
    s.on('qr_update', (payload) => {
      setQrData(payload);
      setTimeLeft(10);
    });
    return () => {
      s.disconnect();
    };
  }, [sessionId, classId]);

  useEffect(() => {
    if (!sessionId) return;
    const t = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10)), 1000);
    return () => clearInterval(t);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">QR Attendance Session</h1>
          <p className="text-slate-500 text-sm mt-1">Start a session and project the QR code for students to scan</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-md">
          {classes.length === 0 ? (
            <EmptyState
              title="No classes available"
              description="Create classes in the database first. Then you can start QR sessions."
              action={<Button variant="secondary" onClick={() => window.location.reload()}>Refresh</Button>}
            />
          ) : (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white mb-4"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseName || c.courseCode} ({c.courseCode || c._id})
                  </option>
                ))}
              </select>
              <Button onClick={startSession} loading={starting} disabled={starting} className="w-full">
                Start QR Session
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live QR Session</h1>
          <p className="text-slate-500 text-sm mt-1">Project this code for students to scan</p>
        </div>
        <Button variant="secondary" onClick={endSession}>
          End Session
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        {qrData ? (
          <div className="p-6 bg-white rounded-2xl border-4 border-indigo-500 shadow-lg transition-all duration-300">
            <QRCode value={typeof qrData === 'string' ? qrData : JSON.stringify(qrData)} size={280} />
          </div>
        ) : (
          <p className="text-slate-500 animate-pulse">Connecting...</p>
        )}
        <p className="mt-6 text-lg text-slate-700 font-mono">
          Refreshes in: <span className="font-bold text-red-500">{timeLeft}s</span>
        </p>
      </div>
    </div>
  );
}
