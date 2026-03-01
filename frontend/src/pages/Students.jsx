import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal, { ConfirmModal } from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const BRANCHES = ['Mechatronics', 'Computer', 'Civil', 'Mechanical', 'Electrical'];

const emptyStudent = {
  name: '',
  email: '',
  prnNumber: '',
  branch: 'Computer',
  year: 1,
  parentPhone: '',
  password: '',
};

export default function Students() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyStudent);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getStudents();
      setList(Array.isArray(data) ? data : data?.students ?? []);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to load students');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter(
    (s) =>
      !search ||
      [s.name, s.prnNumber, s.email, s.branch].some((v) =>
        String(v || '').toLowerCase().includes(search.toLowerCase())
      )
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyStudent);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      name: s.name || '',
      email: s.email || '',
      prnNumber: s.prnNumber || '',
      branch: s.branch || 'Computer',
      year: s.year ?? 1,
      parentPhone: s.parentPhone || '',
      password: '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.name?.trim() || !form.email?.trim() || !form.prnNumber?.trim() || !form.parentPhone?.trim()) {
      toast.error('Please fill required fields: name, email, PRN, parent phone.');
      return;
    }
    setSubmitLoading(true);
    try {
      if (editing) {
        await updateStudent(editing._id, form);
        toast.success('Student updated');
      } else {
        await createStudent(form);
        toast.success('Student added');
      }
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteStudent(deleteTarget._id);
      toast.success('Student removed');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student records</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add student
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name, PRN, email, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={list.length === 0 ? 'No students yet' : 'No matches'}
            description={list.length === 0 ? 'Add students to get started. Backend may need GET/POST /api/students.' : 'Try a different search.'}
            action={list.length === 0 ? <Button onClick={openCreate}>Add student</Button> : null}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll / PRN</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class / Branch</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance %</th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-6 font-medium text-slate-800">{s.name}</td>
                    <td className="py-3 px-6 text-slate-600">{s.prnNumber}</td>
                    <td className="py-3 px-6 text-slate-600">{s.branch} {s.year ? `Year ${s.year}` : ''}</td>
                    <td className="py-3 px-6 text-slate-600">{s.attendancePercent != null ? `${s.attendancePercent}%` : '—'}</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit student' : 'Add student'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitLoading} disabled={submitLoading}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          <Input label="PRN number" value={form.prnNumber} onChange={(e) => setForm((f) => ({ ...f, prnNumber: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
            <select
              value={form.branch}
              onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <Input label="Year" type="number" min={1} max={5} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) || 1 }))} />
          <Input label="Parent phone" value={form.parentPhone} onChange={(e) => setForm((f) => ({ ...f, parentPhone: e.target.value }))} required />
          <Input label="Password (optional)" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="For login - leave blank if student will register" />
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete student"
        message={deleteTarget ? `Remove "${deleteTarget.name}"? This cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
