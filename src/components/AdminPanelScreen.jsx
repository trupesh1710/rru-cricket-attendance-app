import React, { useEffect, useState } from 'react';
import { getAllAttendance, getAllUsers } from '../utils/AttendanceService';

export default function AdminPanelScreen({ onBack }) {
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        const allAttendance = await getAllAttendance(1000);
        setUsers(allUsers);
        setAttendanceRecords(allAttendance);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'success').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const successRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p>{error}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-600 rounded">Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <button onClick={onBack} className="mb-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">Back</button>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 rounded p-4 text-center">
          <div className="text-4xl font-bold">{totalUsers}</div>
          <div className="text-sm text-slate-300">Total Users</div>
        </div>
        <div className="bg-white/10 rounded p-4 text-center">
          <div className="text-4xl font-bold">{totalAttendance}</div>
          <div className="text-sm text-slate-300">Total Attendance Records</div>
        </div>
        <div className="bg-green-600/30 rounded p-4 text-center">
          <div className="text-4xl font-bold">{presentCount}</div>
          <div className="text-sm text-green-300">Present Count</div>
        </div>
        <div className="bg-red-600/30 rounded p-4 text-center">
          <div className="text-4xl font-bold">{absentCount}</div>
          <div className="text-sm text-red-300">Absent Count</div>
        </div>
        <div className="bg-purple-600/30 rounded p-4 text-center md:col-span-4">
          <div className="text-4xl font-bold">{successRate}%</div>
          <div className="text-sm text-purple-300">Overall Success Rate</div>
        </div>
      </div>
    </div>
  );
}
