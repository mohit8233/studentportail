import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', date: new Date().toISOString().slice(0,10), status: 'present' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students/assigned').then(res => setStudents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) return toast.error('Select a student');
    setLoading(true);
    try {
      await api.post('/attendance', form);
      toast.success('Attendance marked');
      setForm({ ...form, studentId: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mark Attendance</h1>
      <div className="bg-white p-6 rounded-xl shadow max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full p-2 border rounded" required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
          </select>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-2 border rounded" required />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2 border rounded">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Marking...' : 'Mark Attendance'}</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAttendance;