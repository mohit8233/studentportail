import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const StudentAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = () => {
    setLoading(true);

    api
      .get("/students/me")
      .then((res) => {
        const student = res.data.data;

        return api.get(`/attendance/student/${student._id}`);
      })
      .then((res) => {
        setRecords(res.data.data || []);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load attendance");
        setRecords([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

      {records.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {records.map((rec) => (
                <tr key={rec._id} className="border-t">
                  <td className="p-3">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        rec.status === "present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(rec.status || "").toUpperCase()}
                    </span>
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

export default StudentAttendance;