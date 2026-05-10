import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

 const fetchAssignments = async () => {
  try {
    const res = await api.get("/assignments/student");
    setAssignments(res.data.data || []);
  } catch (err) {
    toast.error("Failed to load assignments");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (assignmentId, file) => {
    if (!file) return toast.error('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    setSubmitting(assignmentId);
    try {
      await api.post(`/assignments/submit/${assignmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Assignment submitted!');
      fetchAssignments();
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Assignments</h1>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments given yet.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((ass) => (
            <div key={ass._id} className="bg-white rounded-xl shadow-md p-5">
              <h3 className="text-lg font-semibold">{ass.title}</h3>
              <p className="text-gray-600 mt-1">{ass.description}</p>
              {ass.file && (
                <a href={`http://localhost:5000/uploads/${ass.file}`} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm block mt-2">📎 Download Assignment File</a>
              )}
              <div className="mt-3 flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-sm ${ass.status === 'submitted' ? 'bg-green-100 text-green-800' : ass.status === 'graded' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {ass.status.toUpperCase()}
                </span>
                {ass.status === 'graded' && <span className="text-sm">Marks: {ass.marksAwarded} / 100</span>}
                {ass.feedback && <span className="text-sm text-gray-500">Feedback: {ass.feedback}</span>}
              </div>
              {ass.status === 'pending' && (
                <div className="mt-3">
                  <input type="file" onChange={(e) => handleSubmit(ass._id, e.target.files[0])} accept=".pdf,.doc,.docx,.jpg,.png" className="text-sm" disabled={submitting === ass._id} />
                  {submitting === ass._id && <span className="ml-2 text-sm">Uploading...</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;