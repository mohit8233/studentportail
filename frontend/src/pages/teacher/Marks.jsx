import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TeacherMarks = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', subject: '', marks: 0, maxMarks: 100, examName: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/students/assigned').then(res => setStudents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.subject) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await api.post('/marks', form);
      toast.success('Marks added');
      setForm({ studentId: '', subject: '', marks: 0, maxMarks: 100, examName: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Marks</h1>
      <div className="bg-white p-6 rounded-xl shadow max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full p-2 border rounded" required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
          </select>
          <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full p-2 border rounded" required />
          <div className="flex gap-2">
            <input type="number" placeholder="Marks Obtained" value={form.marks} onChange={e => setForm({...form, marks: parseInt(e.target.value)})} className="w-1/2 p-2 border rounded" required />
            <input type="number" placeholder="Max Marks" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: parseInt(e.target.value)})} className="w-1/2 p-2 border rounded" required />
          </div>
          <input type="text" placeholder="Exam Name (optional)" value={form.examName} onChange={e => setForm({...form, examName: e.target.value})} className="w-full p-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Adding...' : 'Add Marks'}</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherMarks;