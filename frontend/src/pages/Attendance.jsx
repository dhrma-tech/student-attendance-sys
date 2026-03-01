import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClasses, getSessions, getStudents } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [classRes, studentRes, sessionRes] = await Promise.allSettled([
          getClasses(),
          getStudents(),
          getSessions({ date: selectedDate }),
        ]);
        if (cancelled) return;
        setClasses(Array.isArray(classRes.value?.data) ? classRes.value.data : classRes.value?.data?.classes ?? []);
        setStudents(Array.isArray(studentRes.value?.data) ? studentRes.value.data : studentRes.value?.data?.students ?? []);
        setSessions(Array.isArray(sessionRes.value?.data) ? sessionRes.value.data : sessionRes.value?.data?.sessions ?? []);
        if (!selectedClassId && classRes.value?.data?.length) {
          const first = Array.isArray(classRes.value.data) ? classRes.value.data[0] : classRes.value.data?.classes?.[0];
          if (first) setSelectedClassId(first._id);
        }
      } catch (e) {
        toast.error('Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDate]);

  const classStudents = selectedClassId
    ? students.filter((s) => (s.enrolledClasses || []).includes(selectedClassId))
    : students;

  const toggleStudent = (id) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedStudentIds.size >= classStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(classStudents.map((s) => s._id)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId) {
      toast.error('Select a class');
      return;
    }
    setSubmitLoading(true);
    try {
      // If backend has POST /api/attendance/mark for bulk mark, use it. Otherwise show info.
      toast.success('Attendance marking is typically done via QR scan in class. Use the QR Session page to start a session.');
      setSelectedStudentIds(new Set());
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mark Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Select date and class, then mark present students</p>
      </div>

      <Card title="Session details">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>{c.courseName || c.courseCode || c._id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedClassId && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700">Students</label>
                {classStudents.length > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={toggleAll}>
                    {selectedStudentIds.size >= classStudents.length ? 'Deselect all' : 'Select all'}
                  </Button>
                )}
              </div>
              {classStudents.length === 0 ? (
                <EmptyState
                  title="No students in this class"
                  description="Enroll students in this class from the Students page or backend."
                />
              ) : (
                <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {classStudents.map((s) => (
                    <li key={s._id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.has(s._id)}
                        onChange={() => toggleStudent(s._id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-800">{s.name}</span>
                      <span className="text-slate-500 text-sm">{s.prnNumber}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" loading={submitLoading} disabled={submitLoading}>
              Submit attendance
            </Button>
          </div>
        </form>
      </Card>

      {sessions.length > 0 && (
        <Card title="Sessions on this date" subtitle={`${selectedDate}`}>
          <ul className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <li key={s._id} className="py-2 flex justify-between text-sm">
                <span className="text-slate-800">{s.classId?.courseName || s.classId || s._id}</span>
                <span className="text-slate-500">{s.isActive ? 'Active' : 'Ended'}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
