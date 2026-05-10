import { useEffect, useState } from "react";
import api from "../../services/api";
import { getArray, getTotal } from "../../utils/responseHelpers";
import { AcademicCapIcon, BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      setLoading(true);
      Promise.allSettled([api.get("/students?limit=1"), api.get("/teachers"), api.get("/courses")])
        .then(([studentsRes, teachersRes, coursesRes]) => {
          const studentPayload = studentsRes.status === "fulfilled" ? studentsRes.value.data : {};
          const teacherPayload = teachersRes.status === "fulfilled" ? teachersRes.value.data : {};
          const coursePayload = coursesRes.status === "fulfilled" ? coursesRes.value.data : {};

          const teachers = getArray(teacherPayload, ["data", "teachers"]);
          const courses = getArray(coursePayload, ["data", "courses"]);

          setStats({
            students: getTotal(studentPayload, getArray(studentPayload, ["data", "students"])),
            teachers: getTotal(teacherPayload, teachers),
            courses: getTotal(coursePayload, courses),
          });
        })
        .finally(() => setLoading(false));
    };

    fetchStats();
  }, []);

  const cards = [
    { label: "Total Students", value: stats.students, icon: AcademicCapIcon, color: "from-indigo-500 to-sky-500" },
    { label: "Total Teachers", value: stats.teachers, icon: UserGroupIcon, color: "from-violet-500 to-indigo-500" },
    { label: "Total Courses", value: stats.courses, icon: BookOpenIcon, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black md:text-5xl">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Monitor your student management system from one clean, responsive dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-slate-200/70">
            <div className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
              <card.icon className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{loading ? "..." : card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-slate-200/70">
          <h2 className="text-xl font-black text-slate-900">Quick Tips</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p className="rounded-2xl bg-slate-50 p-4">Create users first from register page, then assign them as student or teacher profile.</p>
            <p className="rounded-2xl bg-slate-50 p-4">If name/email shows N/A, check backend model ref and populate userId.</p>
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-soft">
          <h2 className="text-xl font-black">System Status</h2>
          <p className="mt-3 text-indigo-100">Frontend is now protected against map errors and unknown API response shapes.</p>
          <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="font-bold">API Base URL</p>
            <p className="mt-1 break-all text-sm text-indigo-100">{import.meta.env.VITE_API_URL || "http://localhost:5000/api"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
