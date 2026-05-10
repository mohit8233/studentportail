import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getArray } from "../../utils/responseHelpers";

const emptyForm = { userId: "", rollNumber: "", course: "", batch: "" };

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchStudents();
    fetchUsers();
  }, []);

const fetchStudents = () => {
  setLoading(true);

  api
    .get("/students")
    .then((res) => {
      const studentData = getArray(res.data, ["data", "students"]);

      setStudents(studentData);
    })
    .catch((err) => {
      console.log("ERROR =>", err.response?.data);

      toast.error(
        err.response?.data?.message || "Failed"
      );

      setStudents([]);
    })
    .finally(() => setLoading(false));
};

  const fetchUsers = () => {
    api
      .get("/users?role=student")
      .then((res) => setUsers(getArray(res.data, ["data", "users"])))
      .catch(() => setUsers([]));
  };

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase();
    return students.filter((student) => {
      const text = `${student.rollNumber || ""} ${student.course || ""} ${student.batch || ""} ${student.userId?.name || ""} ${student.userId?.email || ""}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [students, search]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = editing
      ? api.put(`/students/${editing._id}`, form)
      : api.post("/students", form);

    request
      .then((res) => {
        toast.success(res.data?.message || (editing ? "Student updated" : "Student added"));
        setModalOpen(false);
        resetForm();
        fetchStudents();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Something went wrong"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this student?")) return;

    api
      .delete(`/students/${id}`)
      .then((res) => {
        toast.success(res.data?.message || "Student deleted");
        fetchStudents();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Delete failed"));
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      userId: student.userId?._id || student.userId || "",
      rollNumber: student.rollNumber || "",
      course: student.course || "",
      batch: student.batch || "",
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 to-sky-500 p-6 text-white shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Admin</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Student Management</h1>
            <p className="mt-2 max-w-2xl text-indigo-50">Create, update and manage student records with clean searchable data.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            + Add Student
          </button>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-4 shadow-soft ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">All Students</h2>
            <p className="text-sm text-slate-500">Total {students.length} records</p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, roll, course..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 md:max-w-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft ring-1 ring-slate-200/70">
        {loading ? (
          <div className="p-10 text-center font-semibold text-slate-500">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-slate-700">No students found</p>
            <p className="text-sm text-slate-500">Add a new student or clear search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Roll No</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Batch</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{student.userId?.name || "N/A"}</p>
                      <p className="text-sm text-slate-500">{student.userId?.email || "No email"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{student.rollNumber}</td>
                    <td className="px-5 py-4 text-slate-600">{student.course}</td>
                    <td className="px-5 py-4 text-slate-600">{student.batch}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(student)} className="rounded-xl bg-indigo-50 px-4 py-2 font-bold text-indigo-700 hover:bg-indigo-100">Edit</button>
                        <button onClick={() => handleDelete(student._id)} className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">{editing ? "Edit Student" : "Add Student"}</h2>
              <p className="text-sm text-slate-500">Select a registered student user and fill academic details.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" required>
                <option value="">Select student user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                ))}
              </select>
              <input value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} placeholder="Roll Number" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" required />
              <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="Course" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" required />
              <input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="Batch (e.g. Morning 2025)" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" required />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button disabled={saving} type="submit" className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-60">{saving ? "Saving..." : editing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
