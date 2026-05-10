import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", phone: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(form);
    if (res.success) navigate("/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-indigo-300">Create Profile</p>
          <h1 className="mt-5 text-5xl font-black leading-tight">Register user first, then assign role details.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">Teacher and student dropdowns depend on this registered user role.</p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl md:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-600 text-2xl font-black text-white shadow-lg shadow-indigo-500/30">+</div>
            <h2 className="text-3xl font-black">Create Account</h2>
            <p className="mt-2 text-sm text-slate-500">Register student or teacher user</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input type="password" placeholder="Password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <input type="text" placeholder="Phone (optional)" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-60">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have account? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
