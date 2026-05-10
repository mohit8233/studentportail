import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getArray } from "../../utils/responseHelpers";

const emptyForm = {
    topicName: "",
    description: "",
    order: 0,
};

const TopicManagement = () => {
    const { courseId, subjectId } = useParams();
    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchTopics();
    }, [subjectId]);

    const fetchTopics = () => {
        setLoading(true);

        api
            .get(`/topics/subject/${subjectId}`)
            .then((res) => setTopics(getArray(res.data, ["data", "topics"])))
            .catch((err) => {
                toast.error(err.response?.data?.message || "Failed to fetch topics");
                setTopics([]);
            })
            .finally(() => setLoading(false));
    };

    const filteredTopics = useMemo(() => {
        const keyword = search.toLowerCase();

        return topics.filter((topic) =>
            `${topic.topicName || ""} ${topic.description || ""}`
                .toLowerCase()
                .includes(keyword)
        );
    }, [topics, search]);

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
            subjectId,
            order: Number(form.order) || 0,
        };

        const request = editing
            ? api.patch(`/topics/update/${editing._id}`, payload)
            : api.post("/topics/create", payload);

        request
            .then((res) => {
                toast.success(
                    res.data?.message || (editing ? "Topic updated" : "Topic created")
                );

                fetchTopics();
                resetForm();
                setModalOpen(false);
            })
            .catch((err) =>
                toast.error(err.response?.data?.message || "Something went wrong")
            )
            .finally(() => setSaving(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this topic?")) return;

        api
            .delete(`/topics/delete/${id}`)
            .then((res) => {
                toast.success(res.data?.message || "Topic deleted");
                fetchTopics();
            })
            .catch((err) =>
                toast.error(err.response?.data?.message || "Delete failed")
            );
    };

    const openEdit = (topic) => {
        setEditing(topic);

        setForm({
            topicName: topic.topicName || "",
            description: topic.description || "",
            order: topic.order || 0,
        });

        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-purple-100">
                            Admin
                        </p>

                        <h1 className="mt-2 text-3xl font-black">
                            Topic Management
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-2xl bg-white/20 px-5 py-3 font-bold"
                        >
                            Back
                        </button>

                        <button
                            onClick={() => {
                                resetForm();
                                setModalOpen(true);
                            }}
                            className="rounded-2xl bg-white px-5 py-3 font-bold text-purple-700"
                        >
                            + Add Topic
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-4 shadow-soft">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full rounded-2xl border p-3 outline-none"
                />
            </div>

            {loading ? (
                <div className="rounded-[1.5rem] bg-white p-10 text-center">
                    Loading...
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTopics.map((topic) => (
                        <div
                            key={topic._id}
                            className="rounded-[1.75rem] bg-white p-6 shadow-soft"
                        >
                            <h2 className="text-2xl font-black">
                                {topic.topicName}
                            </h2>

                            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                                {topic.description || "No description"}
                            </p>

                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                <button
                                    onClick={() => openEdit(topic)}
                                    className="rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(topic._id)}
                                    className="rounded-xl bg-red-50 px-4 py-2 font-bold text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="rounded-[1.5rem] bg-white p-10 text-center text-slate-500 shadow-soft">
                            No topics found
                        </div>
                    )}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-[2rem] bg-white p-6">
                        <h2 className="text-2xl font-black">
                            {editing ? "Edit Topic" : "Add Topic"}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <input
                                value={form.topicName}
                                onChange={(e) =>
                                    setForm({ ...form, topicName: e.target.value })
                                }
                                placeholder="Topic Name"
                                className="w-full rounded-2xl border p-3"
                                required
                            />

                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                placeholder="Description"
                                rows="4"
                                className="w-full rounded-2xl border p-3"
                            />

                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) =>
                                    setForm({ ...form, order: e.target.value })
                                }
                                placeholder="Order"
                                className="w-full rounded-2xl border p-3"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        resetForm();
                                    }}
                                    className="rounded-2xl border px-5 py-3 font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={saving}
                                    type="submit"
                                    className="rounded-2xl bg-purple-600 px-5 py-3 font-bold text-white"
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

export default TopicManagement;