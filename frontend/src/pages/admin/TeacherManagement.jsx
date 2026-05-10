import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getArray } from "../../utils/responseHelpers";

const emptyForm = { userId: "", subject: "", experience: 0 };

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchTeachers();
    fetchUsers();
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    api
      .get("/teachers")
      .then((res) => setTeachers(getArray(res.data, ["data", "teachers"])))
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to fetch teachers");
        setTeachers([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchUsers = () => {
    api
      .get("/users?role=teacher")
      .then((res) => setUsers(getArray(res.data, ["data", "users"])))
      .catch(() => setUsers([]));
  };

  const filteredTeachers = useMemo(() => {
    const keyword = search.toLowerCase();
    return teachers.filter((teacher) => {
      const text = `${teacher.subject || ""} ${teacher.experience || ""} ${teacher.userId?.name || ""} ${teacher.userId?.email || ""}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [teachers, search]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = { ...form, experience: Number(form.experience) || 0 };
    const request = editing ? api.put(`/teachers/${editing._id}`, payload) : api.post("/teachers", payload);

    request
      .then((res) => {
        toast.success(res.data?.message || (editing ? "Teacher updated" : "Teacher added"));
        setModalOpen(false);
        resetForm();
        fetchTeachers();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Something went wrong"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    api
      .delete(`/teachers/${id}`)
      .then((res) => {
        toast.success(res.data?.message || "Teacher deleted");
        fetchTeachers();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Delete failed"));
  };

  const openEdit = (teacher) => {
    setEditing(teacher);
    setForm({
      userId: teacher.userId?._id || teacher.userId || "",
      subject: teacher.subject || "",
      experience: teacher.experience || 0,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-100">Admin</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Teacher Management</h1>
            <p className="mt-2 max-w-2xl text-violet-50">Manage teacher profiles, subjects and experience in one responsive panel.</p>
          </div>
          <button onClick={() => { resetForm(); setModalOpen(true); }} className="rounded-2xl bg-white px-5 py-3 font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
            + Add Teacher
          </button>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-4 shadow-soft ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">All Teachers</h2>
            <p className="text-sm text-slate-500">Total {teachers.length} records</p>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, subject..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 md:max-w-sm" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft ring-1 ring-slate-200/70">
        {loading ? (
          <div className="p-10 text-center font-semibold text-slate-500">Loading teachers...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold text-slate-700">No teachers found</p>
            <p className="text-sm text-slate-500">Add a teacher user first, then create teacher profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Experience</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{teacher.userId?.name || "N/A"}</p>
                      <p className="text-sm text-slate-500">{teacher.userId?.email || "No email"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{teacher.subject}</td>
                    <td className="px-5 py-4 text-slate-600">{teacher.experience} yrs</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(teacher)} className="rounded-xl bg-violet-50 px-4 py-2 font-bold text-violet-700 hover:bg-violet-100">Edit</button>
                        <button onClick={() => handleDelete(teacher._id)} className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-600 hover:bg-red-100">Delete</button>
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
              <h2 className="text-2xl font-black text-slate-900">{editing ? "Edit Teacher" : "Add Teacher"}</h2>
              <p className="text-sm text-slate-500">Only registered users with role teacher will show here.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" required>
                <option value="">Select teacher user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                ))}
              </select>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" required />
              <input type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Experience in years" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" required />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button disabled={saving} type="submit" className="rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-60">{saving ? "Saving..." : editing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
