import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0 });
  useEffect(() => {
    api.get('/students/assigned').then(res => setStats({ students: res.data.length }));
  }, []);
  return (<div><h1 className="text-2xl font-bold">Teacher Dashboard</h1><p className="mb-4">Welcome, {user?.name}</p><div className="bg-white p-6 rounded-xl shadow"><p className="text-gray-500">Assigned Students</p><p className="text-3xl font-bold">{stats.students}</p></div></div>);
};
export default TeacherDashboard;