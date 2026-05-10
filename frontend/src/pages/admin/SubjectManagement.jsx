import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    createSubjectApi,
    deleteSubjectApi,
    getSubjectsByCourseApi,
    updateSubjectApi,
} from "../../services/api";
import { getArray } from "../../utils/responseHelpers";

const emptyForm = {
    subjectName: "",
    teacherName: "",
    time: "",
    statusColor: "yellow",
    order: 0,
};

const SubjectManagement = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchSubjects();
    }, [courseId]);

    const fetchSubjects = () => {
        setLoading(true);

        getSubjectsByCourseApi(courseId)
            .then((res) => setSubjects(getArray(res.data, ["data", "subjects"])))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Failed to fetch subjects");
                setSubjects([]);
            })
            .finally(() => setLoading(false));
    };

    const filteredSubjects = useMemo(() => {
        const keyword = search.toLowerCase();

        return subjects.filter((subject) =>
            `${subject.subjectName || ""} ${subject.teacherName || ""} ${subject.time || ""}`
                .toLowerCase()
                .includes(keyword)
        );
    }, [subjects, search]);

    const resetForm = () => {
        setEditing(null);
        setForm(emptyForm);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...form,
            courseId,
            order: Number(form.order) || 0,
        };

        const request = editing
            ? updateSubjectApi(editing._id, payload)
            : createSubjectApi(payload);

        request
            .then((res) => {
                toast.success(
                    res.data?.message || (editing ? "Subject updated" : "Subject added")
                );
                setModalOpen(false);
                resetForm();
                fetchSubjects();
            })
            .catch((err) =>
                toast.error(err.response?.data?.message || "Something went wrong")
            )
            .finally(() => setSaving(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this subject?")) return;

        deleteSubjectApi(id)
            .then((res) => {
                toast.success(res.data?.message || "Subject deleted");
                fetchSubjects();
            })
            .catch((err) =>
                toast.error(err.response?.data?.message || "Delete failed")
            );
    };

    const openEdit = (subject) => {
        setEditing(subject);

        setForm({
            subjectName: subject.subjectName || "",
            teacherName: subject.teacherName || "",
            time: subject.time || "",
            statusColor: subject.statusColor || "yellow",
            order: subject.order || 0,
        });

        setModalOpen(true);
    };

    const badgeColor = {
        yellow: "bg-yellow-100 text-yellow-700",
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        gray: "bg-gray-100 text-gray-700",
    };

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-soft md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
                            Admin
                        </p>

                        <h1 className="mt-2 text-3xl font-black md:text-4xl">
                            Subject Management
                        </h1>

                        <p className="mt-2 max-w-2xl text-blue-50">
                            Course ke andar subjects add, update aur delete karo.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-2xl bg-white/15 px-5 py-3 font-bold text-white hover:bg-white/25"
                        >
                            Back
                        </button>

                        <button
                            onClick={() => {
                                resetForm();
                                setModalOpen(true);
                            }}
                            className="rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            + Add Subject
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-4 shadow-soft ring-1 ring-slate-200/70">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            All Subjects
                        </h2>
                        <p className="text-sm text-slate-500">
                            Total {subjects.length} records
                        </p>
                    </div>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search subjects..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 md:max-w-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="rounded-[1.5rem] bg-white p-10 text-center font-semibold text-slate-500 shadow-soft">
                    Loading subjects...
                </div>
            ) : filteredSubjects.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
                    <p className="text-lg font-bold text-slate-700">
                        No subjects found
                    </p>
                    <p className="text-sm text-slate-500">
                        Add subject to show it here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredSubjects.map((subject) => (
                        <div
                            key={subject._id}
                            className="group rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-lg font-black text-blue-700">
                                    {(subject.subjectName || "S").charAt(0).toUpperCase()}
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor[subject.statusColor] || badgeColor.yellow
                                        }`}
                                >
                                    {subject.statusColor}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-900">
                                {subject.subjectName}
                            </h3>

                            <div className="mt-4 space-y-3 text-sm text-slate-600">
                                <p className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                    <span>Teacher</span>
                                    <b className="text-slate-900">
                                        {subject.teacherName || "N/A"}
                                    </b>
                                </p>

                                <p className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                    <span>Time</span>
                                    <b className="text-slate-900">{subject.time || "N/A"}</b>
                                </p>

                                <p className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                                    <span>Order</span>
                                    <b className="text-blue-700">{subject.order}</b>
                                </p>
                            </div>

                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                <button
                                    onClick={() =>
                                        navigate(`/admin/courses/${courseId}/subjects/${subject._id}/topics`)
                                    }
                                    className="rounded-xl bg-purple-50 px-4 py-2 font-bold text-purple-700 hover:bg-purple-100"
                                >
                                    Topics
                                </button>

                                <button
                                    onClick={() => openEdit(subject)}
                                    className="rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700 hover:bg-blue-100"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(subject._id)}
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
                                {editing ? "Edit Subject" : "Add Subject"}
                            </h2>

                            <p className="text-sm text-slate-500">
                                Enter subject details.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                value={form.subjectName}
                                onChange={(e) =>
                                    setForm({ ...form, subjectName: e.target.value })
                                }
                                placeholder="Subject Name"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                required
                            />

                            <input
                                value={form.teacherName}
                                onChange={(e) =>
                                    setForm({ ...form, teacherName: e.target.value })
                                }
                                placeholder="Teacher Name"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            />

                            <input
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                placeholder="Time e.g. 10:00 AM"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            />

                            <select
                                value={form.statusColor}
                                onChange={(e) =>
                                    setForm({ ...form, statusColor: e.target.value })
                                }
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="gray">Gray</option>
                            </select>

                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: e.target.value })}
                                placeholder="Order"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
                                    className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-60"
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

export default SubjectManagement;