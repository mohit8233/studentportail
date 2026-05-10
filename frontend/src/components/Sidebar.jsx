import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
      { name: "Students", path: "/admin/students", icon: UsersIcon },
      { name: "Teachers", path: "/admin/teachers", icon: UserGroupIcon },
      { name: "Courses", path: "/admin/courses", icon: BookOpenIcon },
    ],
    teacher: [
      { name: "Dashboard", path: "/teacher/dashboard", icon: HomeIcon },
      { name: "Attendance", path: "/teacher/attendance", icon: ClipboardDocumentListIcon },
      { name: "Marks", path: "/teacher/marks", icon: ChartBarIcon },
      { name: "Assignments", path: "/teacher/assignments", icon: AcademicCapIcon },
    ],
    student: [
  { name: "Profile", path: "/student/profile", icon: HomeIcon },

  { name: "Courses", path: "/student/courses", icon: BookOpenIcon },

  { name: "Marks", path: "/student/marks", icon: ChartBarIcon },

  {
    name: "Attendance",
    path: "/student/attendance",
    icon: ClipboardDocumentListIcon,
  },

  {
    name: "Assignments",
    path: "/student/assignments",
    icon: AcademicCapIcon,
  },

  {
    name: "Performance",
    path: "/student/performance",
    icon: TrophyIcon,
  },
],
  };

  const items = navItems[user?.role] || [];

  const SidebarContent = () => (
    <aside className="flex h-full flex-col overflow-hidden rounded-none bg-slate-950 text-white md:rounded-r-[2rem]">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
            <SparklesIcon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Student MS</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Panel</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-300">Logged in as</p>
          <p className="mt-1 truncate text-base font-bold">{user?.name || "User"}</p>
          <span className="mt-3 inline-flex rounded-full bg-indigo-400/20 px-3 py-1 text-xs font-semibold capitalize text-indigo-100 ring-1 ring-indigo-300/20">
            {user?.role || "role"}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-slate-950 shadow-lg"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:hidden">
        <button
          className="rounded-xl bg-slate-950 p-2 text-white"
          onClick={() => setMobileOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <p className="font-black text-slate-900">Student MS</p>
        <div className="h-10 w-10 rounded-xl bg-indigo-100" />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden">
          <div className="h-full w-72 max-w-[85vw]">
            <button
              className="absolute left-72 top-4 ml-3 rounded-full bg-white p-2 text-slate-950 shadow-lg"
              onClick={() => setMobileOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="fixed left-0 top-0 hidden h-screen w-72 p-0 md:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
