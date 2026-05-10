import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const StudentPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = () => {
    setLoading(true);

    api
      .get("/students/me")
      .then((res) => {
        const student = res.data.data;

        return api.get(`/performance/student/${student._id}`);
      })
      .then((res) => {
        setPerformance(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Failed to load performance"
        );

        setPerformance(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold text-gray-600">
          Loading performance...
        </div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-2xl bg-white px-10 py-8 shadow-lg">
          <h2 className="text-2xl font-bold text-red-500">
            No performance data found
          </h2>
        </div>
      </div>
    );
  }

  const marks = performance.marks || {};
  const assignments = performance.assignments || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="text-3xl md:text-5xl font-black">
            My Performance
          </h1>

          <p className="mt-3 text-lg text-indigo-100">
            Track your marks, assignments and overall progress
          </p>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* Marks */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-800">
                Marks Summary
              </h2>

              <div className="rounded-2xl bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                Academic
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-indigo-50 p-5">
                <p className="text-sm font-semibold text-indigo-600">
                  Total Obtained
                </p>

                <h3 className="mt-2 text-3xl font-black text-indigo-700">
                  {marks.totalObtained || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-600">
                  Total Marks
                </p>

                <h3 className="mt-2 text-3xl font-black text-purple-700">
                  {marks.totalMax || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-semibold text-green-600">
                  Overall %
                </p>

                <h3 className="mt-2 text-3xl font-black text-green-700">
                  {Number(
                    marks.overallPercentage || 0
                  ).toFixed(2)}
                  %
                </h3>
              </div>

              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="text-sm font-semibold text-orange-600">
                  Average %
                </p>

                <h3 className="mt-2 text-3xl font-black text-orange-700">
                  {Number(
                    marks.averagePercentage || 0
                  ).toFixed(2)}
                  %
                </h3>
              </div>

            </div>

            {/* Subject Wise */}
            <div className="mt-8">
              <h3 className="text-xl font-black text-gray-800">
                Subject Wise Marks
              </h3>

              <div className="mt-5 space-y-4">

                {(marks.subjectWise || []).map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {s.subject}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {s.examName}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">

                        <div className="rounded-xl bg-white px-4 py-2 shadow-sm">
                          <p className="text-sm text-gray-500">
                            Marks
                          </p>

                          <h5 className="text-lg font-black text-indigo-700">
                            {s.marks}/{s.maxMarks}
                          </h5>
                        </div>

                        <div className="rounded-xl bg-indigo-100 px-4 py-2">
                          <h5 className="text-lg font-black text-indigo-700">
                            {s.maxMarks
                              ? (
                                  (s.marks / s.maxMarks) *
                                  100
                                ).toFixed(1)
                              : 0}
                            %
                          </h5>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}

                {(marks.subjectWise || []).length === 0 && (
                  <div className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
                    No marks available
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-800">
                Assignments
              </h2>

              <div className="rounded-2xl bg-pink-100 px-4 py-2 text-sm font-bold text-pink-700">
                Tasks
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-600">
                  Total
                </p>

                <h3 className="mt-2 text-3xl font-black text-blue-700">
                  {assignments.total || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-semibold text-green-600">
                  Submitted
                </p>

                <h3 className="mt-2 text-3xl font-black text-green-700">
                  {assignments.submitted || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-600">
                  Graded
                </p>

                <h3 className="mt-2 text-3xl font-black text-purple-700">
                  {assignments.graded || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-orange-50 p-5">
                <p className="text-sm font-semibold text-orange-600">
                  Completion
                </p>

                <h3 className="mt-2 text-3xl font-black text-orange-700">
                  {Number(
                    assignments.completionRate || 0
                  ).toFixed(2)}
                  %
                </h3>
              </div>

            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <p className="text-lg font-semibold text-indigo-100">
                Average Marks Awarded
              </p>

              <h2 className="mt-3 text-5xl font-black">
                {Number(
                  assignments.averageMarksAwarded || 0
                ).toFixed(1)}
              </h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;