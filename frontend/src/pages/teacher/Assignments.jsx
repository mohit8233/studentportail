import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const TeacherAssignments = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', studentId: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [grading, setGrading] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

 const fetchStudents = async () => {
  const res = await api.get('/students/assigned');
  setStudents(res.data.data || []);
};

const fetchAssignments = async () => {
  const res = await api.get('/assignments/teacher');
  setAssignments(res.data.data || []);
};

  const handleFileChange = (e) => setForm({ ...form, file: e.target.files[0] });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.studentId) return toast.error('Title and student required');
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('studentId', form.studentId);
    if (form.file) data.append('file', form.file);
    setUploading(true);
    try {
      await api.post('/assignments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Assignment created');
      setForm({ title: '', description: '', studentId: '', file: null });
      fetchAssignments();
    } catch (err) {
      toast.error('Failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGrade = async (assignmentId, marksAwarded, feedback) => {
    if (!marksAwarded && marksAwarded !== 0) return toast.error('Enter marks');
    setGrading(assignmentId);
    try {
      await api.put(`/assignments/grade/${assignmentId}`, { marksAwarded, feedback });
      toast.success('Graded');
      fetchAssignments();
    } catch (err) {
      toast.error('Grade failed');
    } finally {
      setGrading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>
      {/* Create form */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">Create New Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 border rounded" required />
          <textarea placeholder="Description" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 border rounded"></textarea>
          <select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full p-2 border rounded" required>
            <option value="">Assign to Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
          </select>
          <input type="file" onChange={handleFileChange} className="w-full text-sm" accept=".pdf,.doc,.docx" />
          <button type="submit" disabled={uploading} className="bg-indigo-600 text-white px-4 py-2 rounded">{uploading ? 'Creating...' : 'Create Assignment'}</button>
        </form>
      </div>

      {/* List assignments for grading */}
      <h2 className="text-xl font-semibold mb-3">Pending / Submitted Assignments</h2>
      <div className="space-y-4">
        {assignments.map(ass => (
          <div key={ass._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{ass.title}</h3>
                <p className="text-sm text-gray-600">Student: {ass.studentId?.rollNumber}</p>
                <p className="text-sm">Status: <span className={`font-semibold ${ass.status === 'submitted' ? 'text-green-600' : ass.status === 'graded' ? 'text-blue-600' : 'text-yellow-600'}`}>{ass.status}</span></p>
                {ass.submittedFile && <a href={`http://localhost:5000/uploads/${ass.submittedFile}`} target="_blank" className="text-indigo-600 text-sm block">📎 Submitted File</a>}
              </div>
              {ass.status === 'submitted' && (
                <div className="ml-4">
                  <input type="number" placeholder="Marks (0-100)" className="w-24 p-1 border rounded" id={`marks-${ass._id}`} />
                  <input type="text" placeholder="Feedback" className="w-40 p-1 border rounded ml-2" id={`feedback-${ass._id}`} />
                  <button onClick={() => {
                    const marks = document.getElementById(`marks-${ass._id}`).value;
                    const feedback = document.getElementById(`feedback-${ass._id}`).value;
                    handleGrade(ass._id, parseInt(marks), feedback);
                  }} disabled={grading === ass._id} className="ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm">Grade</button>
                </div>
              )}
              {ass.status === 'graded' && <div className="ml-4"><p>Marks: {ass.marksAwarded}</p><p className="text-sm text-gray-500">Feedback: {ass.feedback}</p></div>}
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p className="text-gray-500">No assignments created yet.</p>}
      </div>
    </div>
  );
};

export default TeacherAssignments;