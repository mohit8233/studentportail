import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      if (result.role === "admin") navigate("/admin/dashboard");
      else if (result.role === "teacher") navigate("/teacher/dashboard");
      else navigate("/student/profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-indigo-300">Student Management System</p>
          <h1 className="mt-5 text-5xl font-black leading-tight">Manage students, teachers and courses smarter.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">Modern dashboard with role based login, responsive admin panel and clean academic management flow.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {['Admin', 'Teacher', 'Student'].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10">
                <p className="font-bold">{item}</p>
                <p className="mt-1 text-xs text-slate-300">Panel</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-indigo-600 text-2xl font-black text-white shadow-lg shadow-indigo-500/30">MS</div>
            <h2 className="text-3xl font-black">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">Login to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
              <input type="email" placeholder="Enter email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
              <input type="password" placeholder="Enter password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-60">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New user? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
