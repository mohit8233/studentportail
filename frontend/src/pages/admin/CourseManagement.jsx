import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getArray } from "../../utils/responseHelpers";

const emptyForm = { courseName: "", duration: "", fees: 0 };

const CourseManagement = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);

    api
      .get("/courses")
      .then((res) => setCourses(getArray(res.data, ["data", "courses"])))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to fetch courses");
        setCourses([]);
      })
      .finally(() => setLoading(false));
  };

  const filteredCourses = useMemo(() => {
    const keyword = search.toLowerCase();

    return courses.filter((course) =>
      `${course.courseName || ""} ${course.duration || ""} ${course.fees || ""}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [courses, search]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      fees: Number(form.fees) || 0,
    };

    const request = editing
      ? api.put(`/courses/${editing._id}`, payload)
      : api.post("/courses", payload);

    request
      .then((res) => {
        toast.success(
          res.data?.message || (editing ? "Course updated" : "Course added")
        );

        setModalOpen(false);
        resetForm();
        fetchCourses();
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Something went wrong")
      )
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this course?")) return;

    api
      .delete(`/courses/${id}`)
      .then((res) => {
        toast.success(res.data?.message || "Course deleted");
        fetchCourses();
      })
      .catch((err) =>
        toast.error(err.response?.data?.message || "Delete failed")
      );
  };

  const openEdit = (course) => {
    setEditing(course);

    setForm({
      courseName: course.courseName || "",
      duration: course.duration || "",
      fees: course.fees || 0,
    });

    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Course Management
            </h1>

            <p className="mt-2 max-w-2xl text-emerald-50">
              Add courses, update duration and manage fees with responsive cards.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            + Add Course
          </button>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-4 shadow-soft ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              All Courses
            </h2>

            <p className="text-sm text-slate-500">
              Total {courses.length} records
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 md:max-w-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.5rem] bg-white p-10 text-center font-semibold text-slate-500 shadow-soft">
          Loading courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
          <p className="text-lg font-bold text-slate-700">
            No courses found
          </p>

          <p className="text-sm text-slate-500">
            Add a course to show it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="group rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-700">
                  {(course.courseName || "C").charAt(0).toUpperCase()}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Active
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {course.courseName}
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Duration</span>
                  <b className="text-slate-900">{course.duration}</b>
                </p>

                <p className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Fees</span>
                  <b className="text-emerald-700">₹{course.fees}</b>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() =>
                    navigate(`/admin/courses/${course._id}/subjects`)
                  }
                  className="rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700 hover:bg-blue-100"
                >
                  Subjects
                </button>

                <button
                  onClick={() => openEdit(course)}
                  className="rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(course._id)}
                  className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                {editing ? "Edit Course" : "Add Course"}
              </h2>

              <p className="text-sm text-slate-500">
                Enter course name, duration and fees.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.courseName}
                onChange={(e) =>
                  setForm({ ...form, courseName: e.target.value })
                }
                placeholder="Course Name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                required
              />

              <input
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
                placeholder="Duration (e.g. 6 Months)"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                required
              />

              <input
                type="number"
                min="0"
                value={form.fees}
                onChange={(e) =>
                  setForm({ ...form, fees: e.target.value })
                }
                placeholder="Fees"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;