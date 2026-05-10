import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import SubjectManagement from './pages/admin/SubjectManagement';
import TopicManagement from './pages/admin/TopicManagement';
import CourseDetails from './pages/student/CourseDetails';
import StudentCourses from './pages/student/StudentCourse';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement'));
const TeacherManagement = lazy(() => import('./pages/admin/TeacherManagement'));
const CourseManagement = lazy(() => import('./pages/admin/CourseManagement'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
const TeacherAttendance = lazy(() => import('./pages/teacher/Attendance'));
const TeacherMarks = lazy(() => import('./pages/teacher/Marks'));
const TeacherAssignments = lazy(() => import('./pages/teacher/Assignments'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const StudentMarks = lazy(() => import('./pages/student/Marks'));
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const StudentAssignments = lazy(() => import('./pages/student/Assignments'));
const StudentPerformance = lazy(() => import('./pages/student/Performance'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="courses" element={<CourseManagement />} />

              <Route
                path="courses/:courseId/subjects"
                element={<SubjectManagement />}
              />

              <Route
                path="courses/:courseId/subjects/:subjectId/topics"
                element={<TopicManagement />}
              />
            </Route>

            {/* Teacher Routes */}
            <Route path="/teacher" element={<ProtectedRoute role="teacher" />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="marks" element={<TeacherMarks />} />
              <Route path="assignments" element={<TeacherAssignments />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute role="student" />}>
              <Route path="profile" element={<StudentProfile />} />
              <Route path="marks" element={<StudentMarks />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="performance" element={<StudentPerformance />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route
                path="courses/:courseId"
                element={<CourseDetails />}
              />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;