import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = () => {
    setLoading(true);

    api
      .get("/students/me")
      .then((res) => {
        const student = res.data.data;

        return api.get(`/marks/student/${student._id}`);
      })
      .then((res) => {
        setMarks(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load marks");
        setMarks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div className="text-center py-10">Loading marks...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Marks</h1>

      {marks.length === 0 ? (
        <p className="text-gray-500">No marks added yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Exam</th>
                <th className="p-3 text-left">Marks</th>
                <th className="p-3 text-left">Max Marks</th>
                <th className="p-3 text-left">Percentage</th>
              </tr>
            </thead>

            <tbody>
              {marks.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="p-3">{m.subject}</td>

                  <td className="p-3">
                    {m.examName || "Test"}
                  </td>

                  <td className="p-3 font-semibold">
                    {m.marks}
                  </td>

                  <td className="p-3">
                    {m.maxMarks}
                  </td>

                  <td className="p-3">
                    {m.maxMarks
                      ? ((m.marks / m.maxMarks) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentMarks;